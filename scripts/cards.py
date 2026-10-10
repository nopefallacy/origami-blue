"""Design cards: the real composition frozen at each beat's peak, on the real footage frame.
usage: cards.py <project> <footage_sdr.mp4> <cam-base.json> <clear.json> <spec.json> <ep label>
spec.json: [{"t": 2.6, "title": "...", "line": "...", "visual": "...", "motion": "..."}...]
"""
import json, os, sys, glob, subprocess, importlib.util
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from matte_clean import clean_alpha
from keyer import Keyer
from PIL import Image, ImageDraw, ImageFont, ImageFilter

proj, footage, camf, clearf, specf, ep = sys.argv[1:7]
W, H = 1080, 1920
spec = json.load(open(specf))
cam = json.load(open(camf))
clear = json.load(open(clearf))
cdir = os.path.join(proj, "cards")
tmp = os.path.join(cdir, "tmp"); os.makedirs(tmp, exist_ok=True)

# reuse the exact grade / light / affine used by the video compositor
src = open(os.path.join(proj, "composite.py")).read()
g = {"__name__": "cardlib"}
argv0 = sys.argv
sys.argv = ["x", footage, footage, camf, "b", "f", "c", "/dev/null", "1"]
exec(src, g)
sys.argv = argv0

# 1) footage frames (mirrored like the edit) + one batched cut-out pass
times = [c["t"] for c in spec]
for i, t in enumerate(times):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", footage, "-vf", "hflip", "-frames:v", "1", f"{tmp}/src_{i:02d}.png"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "1", "-i", f"{tmp}/src_%02d.png", "-c:v", "libx264", "-crf", "8", "-pix_fmt", "yuv420p", f"{tmp}/srcs.mp4"], check=True)
if not os.path.exists(f"{tmp}/matte_done") or open(f"{tmp}/matte_done").read() != json.dumps(times):
    subprocess.run(["npx", "--yes", "hyperframes@0.8.134", "remove-background", f"{tmp}/srcs.mp4", "-o", f"{tmp}/matte.mov"], check=True, capture_output=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{tmp}/matte.mov", "-vf", "alphaextract,format=gray", "-start_number", "0", f"{tmp}/a_%02d.png"], check=True)
    open(f"{tmp}/matte_done", "w").write(json.dumps(times))

def layer(name, i):
    b = np.asarray(Image.open(sorted(glob.glob(f"{cdir}/layers/{name}_black/frame-*.png"))[i]).convert("RGB")).astype(np.float32) / 255
    w = np.asarray(Image.open(sorted(glob.glob(f"{cdir}/layers/{name}_white/frame-*.png"))[i]).convert("RGB")).astype(np.float32) / 255
    a = np.clip(1 - (w - b).mean(2, keepdims=True), 0, 1)
    rgb = np.where(a > 0.004, np.clip(b / np.maximum(a, 0.004), 0, 1), 0)
    return rgb, a

def C_at(t):
    c = 0
    for a, b, v in clear:
        if a - 0.2 <= t <= b + 0.2: c = max(c, v)
    return c

F_REG = ImageFont.truetype("/Library/Fonts/Arial Unicode.ttf", 28)
F_BOLD = ImageFont.truetype("/Library/Fonts/Arial Unicode.ttf", 32)
F_BIG = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 64, index=1)
F_SM = ImageFont.truetype("/Library/Fonts/Arial Unicode.ttf", 22)

def wrap(d, text, font, width):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        nxt = (cur + " " + wd).strip()
        if d.textlength(nxt, font=font) <= width: cur = nxt
        else: lines.append(cur); cur = wd
    if cur: lines.append(cur)
    return lines

KEY = Keyer(sys.argv[7] if len(sys.argv) > 7 else "a", base=os.getcwd())
frames = []
for i, c in enumerate(spec):
    fi = min(int(round(c["t"] * 30)), len(cam) - 1)
    s, dx, dy, p = cam[fi][:4]
    raw = np.asarray(Image.open(f"{tmp}/src_{i:02d}.png").convert("RGB"))
    al = KEY(raw, np.asarray(Image.open(f"{tmp}/a_{i:02d}.png").convert("L")))
    # adaptive framing (same rule as the video): keep the head below this beat's graphics
    rows = np.where((al[:, int(W * .18):int(W * .82)] > 128).sum(1) > 20)[0]
    ht = float(rows[0]) if len(rows) else 1920.0
    need = C_at(c["t"])
    if need > 0 and s * ht + dy < need:
        dy = min(0.0, dy + (need - (s * ht + dy)))
        if s * ht + dy < need:
            s = min(1.25, max(s, need / ht)); dy = 0.0
        dx = 540 * (1 - s)
    gr = (g["grade"](raw.astype(np.float32) / 255) * 255 + .5).astype(np.uint8)
    F = np.asarray(g["affine"](Image.fromarray(gr), s, dx, dy, Image.BICUBIC)).astype(np.float32) / 255 * g["LIGHT"]
    A = np.asarray(g["affine"](Image.fromarray(al), s, dx, dy, Image.BILINEAR)).astype(np.float32)[..., None] / 255
    br, ba = layer("behind", i); fr, fa = layer("front", i)
    Cc = g["band_blur"](F, s * ht + dy + 10)
    Cc = Cc * (1 - ba) + br * ba
    k = np.clip(ba * 30, 0, 1)
    k = np.asarray(Image.fromarray((k[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32)[..., None] / 255
    Cc = Cc * (1 - A * k) + F * A * k
    Cc = Cc * (1 - fa) + fr * fa
    frame = Image.fromarray((np.clip(Cc, 0, 1) * 255 + .5).astype(np.uint8))
    frame.save(f"{cdir}/frame_{i+1:02d}.png")
    frames.append(frame)
    # annotated card: frame + design notes
    card = Image.new("RGB", (1360, 1280), (18, 17, 19))
    thumb = frame.resize((720, 1280), Image.LANCZOS).convert("RGBA")
    ov = Image.new("RGBA", thumb.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
    k = 720 / 1080
    for yy in (240, 1672):
        for xx in range(0, 720, 18): od.line([(xx, yy * k), (xx + 9, yy * k)], fill=(120, 210, 255, 170), width=2)
    for yy in range(int(1156 * k), int(1672 * k), 18): od.line([(918 * k, yy), (918 * k, yy + 9)], fill=(120, 210, 255, 170), width=2)
    card.paste(Image.alpha_composite(thumb, ov).convert("RGB"), (0, 0))
    d = ImageDraw.Draw(card)
    d.text((10, 1248), "IG safe zone guides", font=F_SM, fill=(120, 210, 255))
    x, y, wdt = 770, 70, 540
    d.text((x, y), f"{ep}  ·  CARD {i+1:02d}", font=F_SM, fill=(254, 209, 0)); y += 44
    for ln in wrap(d, c["title"], F_BIG, wdt):
        d.text((x, y), ln, font=F_BIG, fill=(245, 243, 238)); y += 74
    y += 10
    m, s_ = divmod(c["t"], 60)
    d.text((x, y), f"{int(m)}:{s_:05.2f}", font=F_SM, fill=(150, 150, 150)); y += 60
    for label, key, col in [("THE LINE", "line", (245, 243, 238)), ("ON SCREEN", "visual", (245, 243, 238)), ("MOTION", "motion", (198, 220, 242))]:
        d.text((x, y), label, font=F_SM, fill=(254, 209, 0)); y += 34
        for ln in wrap(d, c[key], F_REG if key != "line" else F_BOLD, wdt):
            d.text((x, y), ln, font=F_REG if key != "line" else F_BOLD, fill=col); y += 40
        y += 34
    card.save(f"{cdir}/card_{i+1:02d}.png")
    print("card", i + 1, f"t={c['t']} s={s:.2f}")

# overview sheet
n = len(frames); cols = min(7, n); rows_n = (n + cols - 1) // cols
sheet = Image.new("RGB", (cols * 270, rows_n * 520), (18, 17, 19))
d = ImageDraw.Draw(sheet)
for i, fr_ in enumerate(frames):
    cx, cy = (i % cols) * 270, (i // cols) * 520
    sheet.paste(fr_.resize((270, 480), Image.LANCZOS), (cx, cy))
    d.text((cx + 10, cy + 486), f"{i+1:02d}  {spec[i]['title']}", font=F_SM, fill=(245, 243, 238))
sheet.save(f"{cdir}/overview.jpg", quality=90)
print("done", cdir)
