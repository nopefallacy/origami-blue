"""Seamless chroma-key compositor (oct-6: band DOF above the head, subject over the behind layer).

out = front OVER mix(F_with_behind, F, A)
  F  = graded footage (one grade for room + subject), camera-transformed, page/plate aware
  A  = subject alpha, same transform (so subject pixels == base pixels: no seam, no sticker look)
Usage: python composite.py footage.mp4 alpha.mp4 cam.json behind_dir front_dir caps_dir out.mp4 N [start]
"""
import json, sys, subprocess, glob
import numpy as np
from PIL import Image, ImageDraw

footage, alpha_v, camf, behind_d, front_d, caps_d, out = sys.argv[1:8]
N = int(sys.argv[8])
START = int(sys.argv[9]) if len(sys.argv) > 9 else 0
W, H = 1080, 1920
cam = json.load(open(camf))

# ---------- grade (CSS-equivalent: brightness, contrast, saturate, sepia) ----------
def mat_sat(s):
    return np.array([[0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s],
                     [0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s],
                     [0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s]], np.float32)
def mat_sep(a):
    b = 1 - a
    return np.array([[0.393 + 0.607 * b, 0.769 - 0.769 * b, 0.189 - 0.189 * b],
                     [0.349 - 0.349 * b, 0.686 + 0.314 * b, 0.168 - 0.168 * b],
                     [0.272 - 0.272 * b, 0.534 - 0.534 * b, 0.131 + 0.869 * b]], np.float32)
BR, CT = 0.9, 1.08
M = (mat_sep(0.05) @ mat_sat(0.9)).T.astype(np.float32)
def grade(x):
    x = np.clip(x * BR, 0, 1)
    x = np.clip((x - 0.5) * CT + 0.5, 0, 1)
    return np.clip(x @ M, 0, 1)

# ---------- screen-space light: vignette + top shade (applied to footage only) ----------
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
r = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.52) / (H * 0.6)) ** 2)
vig = 1 - 0.5 * np.clip((r - 0.55) / 0.6, 0, 1) ** 1.5
t = np.clip(1 - yy / (H * 0.46), 0, 1)
top = 1 - 0.62 * t ** 1.15
LIGHT = (vig * top)[..., None].astype(np.float32)

# ---------- page for the plate beat ----------
page = Image.new("RGB", (W, H), (18, 17, 19))
d = ImageDraw.Draw(page)
for yy0 in range(13, H, 26):
    for xx0 in range(13, W, 26):
        d.ellipse([xx0 - 1.6, yy0 - 1.6, xx0 + 1.6, yy0 + 1.6], fill=(44, 42, 46))
PAGE = np.asarray(page).astype(np.float32) / 255

def reader(path, pix, ch):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", f"{START/30:.4f}", "-i", path, "-vf", "hflip", "-frames:v", str(N),
                          "-f", "rawvideo", "-pix_fmt", pix, "-"], stdout=subprocess.PIPE, bufsize=10 ** 8)
    return p, W * H * ch

def affine(img, s, dx, dy, resample):
    return img.transform((W, H), Image.AFFINE, (1 / s, 0, -dx / s, 0, 1 / s, -dy / s), resample=resample)

def plate_mask(s, dx, dy, p):
    m = Image.new("L", (W * 2, H * 2), 0)  # 2x supersampled rounded rect
    rad = int(2 * 40 * p)
    ImageDraw.Draw(m).rounded_rectangle([2 * dx, 2 * dy, 2 * (dx + W * s) - 1, 2 * (dy + H * s) - 1], radius=rad, fill=255)
    return np.asarray(m.resize((W, H), Image.BILINEAR)).astype(np.float32)[..., None] / 255

def plate_mask_grow(s, dx, dy, p, g):
    m = Image.new("L", (W * 2, H * 2), 0)
    rad = int(2 * (40 * p + g))
    ImageDraw.Draw(m).rounded_rectangle([2 * (dx - g), 2 * (dy - g), 2 * (dx + W * s + g) - 1, 2 * (dy + H * s + g) - 1], radius=rad, fill=255)
    return np.asarray(m.resize((W, H), Image.BILINEAR)).astype(np.float32)[..., None] / 255


from PIL import ImageFilter
ROOM_BLUR = 7.0
def room_blur(F, A):
    """Defocus the room only: blur(F*(1-A)) / blur(1-A), then put the sharp subject back."""
    if ROOM_BLUR <= 0:
        return F
    inv = 1 - A
    num = Image.fromarray((np.clip(F * inv, 0, 1) * 255 + .5).astype(np.uint8)).filter(ImageFilter.GaussianBlur(ROOM_BLUR))
    den = Image.fromarray((np.clip(inv[..., 0], 0, 1) * 255 + .5).astype(np.uint8)).filter(ImageFilter.GaussianBlur(ROOM_BLUR))
    num = np.asarray(num).astype(np.float32) / 255; den = np.asarray(den).astype(np.float32)[..., None] / 255
    Fb = np.where(den > 0.02, num / np.maximum(den, 0.02), F)
    return Fb * inv + F * A


BAND_FEATHER = 200.0
BAND_BLUR = 11.0
def band_blur(F, y_line):
    """Graduated depth-of-field: defocus only the band above y_line (screen px), feathered toward the head."""
    if y_line is None or y_line <= 0:
        return F
    fb = np.asarray(Image.fromarray((np.clip(F, 0, 1) * 255 + .5).astype(np.uint8)).filter(ImageFilter.GaussianBlur(BAND_BLUR))).astype(np.float32) / 255
    yy_ = np.arange(F.shape[0], dtype=np.float32)[:, None, None]
    m = np.clip((y_line - yy_) / BAND_FEATHER, 0, 1)
    m = m * m * (3 - 2 * m)
    return F * (1 - m) + fb * m

def rgba(path):
    a = np.asarray(Image.open(path).convert("RGBA")).astype(np.float32) / 255
    return a[..., :3], a[..., 3:4]


if __name__ == "__main__":
    fp, fsz = reader(footage, "rgb24", 3)
    ap, asz = reader(alpha_v, "gray", 1)
    behind = sorted(glob.glob(behind_d + "/*.png"))
    front = sorted(glob.glob(front_d + "/*.png"))
    caps = sorted(glob.glob(caps_d + "/*.png"))
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
                            "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
                            "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", out], stdin=subprocess.PIPE)

    for i in range(N):
        fi = START + i
        s, dx, dy, p = cam[fi][:4]
        capdy = int(round(cam[fi][4])) if len(cam[fi]) > 4 else 0
        raw = np.frombuffer(fp.stdout.read(fsz), np.uint8).reshape(H, W, 3)
        al = np.frombuffer(ap.stdout.read(asz), np.uint8).reshape(H, W)
        g = (grade(raw.astype(np.float32) / 255) * 255 + 0.5).astype(np.uint8)
        F = np.asarray(affine(Image.fromarray(g), s, dx, dy, Image.BICUBIC)).astype(np.float32) / 255
        A = np.asarray(affine(Image.fromarray(al), s, dx, dy, Image.BILINEAR)).astype(np.float32)[..., None] / 255
        F = F * LIGHT
        if s < 0.9999 or p > 0.0001:
            Mk = plate_mask(s, dx, dy, p)
            F = PAGE * (1 - Mk) + F * Mk
            A = A * Mk
            if p > 0.01:  # hairline border just outside the plate
                ring = np.clip(plate_mask_grow(s, dx, dy, p, 3) - Mk, 0, 1)
                F = F * (1 - ring * 0.6 * p) + ring * 0.6 * p * 0.82
        yl = (cam[fi][5] + 10) if len(cam[fi]) > 5 else None   # head-top on screen, minus a margin
        C = band_blur(F, yl)
        br, ba = rgba(behind[fi])
        if ba.max() > 0.002:
            C = C * (1 - ba) + br * ba
            # chroma key: the subject stands in front of the behind layer (only where that layer draws)
            k = np.clip(ba * 30, 0, 1)
            k = np.asarray(Image.fromarray((k[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32)[..., None] / 255
            Ak = A * k
            C = C * (1 - Ak) + F * Ak
        fr, fa = rgba(front[fi])
        C = C * (1 - fa) + fr * fa
        cr, ca = rgba(caps[fi])
        if capdy > 0:  # captions ride just under the chin
            cr = np.roll(cr, capdy, 0); ca = np.roll(ca, capdy, 0); ca[:capdy] = 0
        C = C * (1 - ca) + cr * ca
        enc.stdin.write((np.clip(C, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
        if i % 200 == 0:
            print("frame", fi, flush=True)
    enc.stdin.close(); enc.wait()
    print("done", out)

