"""Light compositor: prepped footage (media/base.mp4, already framed/graded/depth-of-field) + graphics passes.
out = caps OVER front OVER subject(where behind draws) OVER behind OVER base
Only the bounding box of each graphics frame is blended, so most frames cost little.
usage: fastcomp.py <proj_dir> <cam.json> <windows.json> <out.mp4> <N>
"""
import json, sys, glob, subprocess
import numpy as np
from PIL import Image, ImageFilter

proj, camf, winf, out, N = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], int(sys.argv[5])
W, H = 1080, 1920
cam = json.load(open(camf))
wins = [(int(round(a * 30)), int(round(b * 30))) for a, b in json.load(open(winf))]
media, R = f"{proj}/media", f"{proj}/renders"
layers = {k: sorted(glob.glob(f"{R}/{k}/*.png")) for k in ("behind", "front", "caps")}
for k, v in layers.items():
    assert len(v) >= N, f"{k} pass has {len(v)} frames, need {N}"

base = subprocess.Popen(["ffmpeg", "-v", "error", "-i", f"{media}/base.mp4", "-frames:v", str(N), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE, bufsize=10 ** 8)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
                        "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
                        "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", out], stdin=subprocess.PIPE)
subj = {}

def layer(path, dy=0):
    """-> (rgb, a, (x0, y0, x1, y1)) cropped to content, or None when the frame is empty"""
    im = Image.open(path).convert("RGBA")
    bb = im.getchannel("A").getbbox()
    if bb is None:
        return None
    x0, y0, x1, y1 = bb
    arr = np.asarray(im.crop(bb)).astype(np.float32) / 255
    y0, y1 = y0 + dy, y1 + dy
    if y1 > H:  # captions pushed down past the frame edge
        arr = arr[: H - y0]; y1 = H
    return arr[..., :3], arr[..., 3:4], (x0, y0, x1, y1)

for fi in range(N):
    C = np.frombuffer(base.stdout.read(W * H * 3), np.uint8).reshape(H, W, 3).astype(np.float32) / 255
    # subject cut-out for this frame (kept in sync whenever we're inside a window)
    S = None
    for k, (a, b) in enumerate(wins):
        if a <= fi < b:
            if k not in subj:
                subj[k] = subprocess.Popen(["ffmpeg", "-v", "error", "-c:v", "libvpx-vp9", "-i", f"{media}/subj-{k:02d}.webm",
                                            "-f", "rawvideo", "-pix_fmt", "rgba", "-"], stdout=subprocess.PIPE, bufsize=10 ** 8)
            buf = subj[k].stdout.read(W * H * 4)
            if len(buf) == W * H * 4:
                S = np.frombuffer(buf, np.uint8).reshape(H, W, 4)
    L = layer(layers["behind"][fi])
    if L is not None:
        rgb, a, (x0, y0, x1, y1) = L
        reg = C[y0:y1, x0:x1]
        reg = reg * (1 - a) + rgb * a
        if S is not None:  # chroma key: he stands in front of what is drawn behind him
            m = Image.fromarray((np.clip(a[..., 0] * 30, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2))
            k_ = np.asarray(m).astype(np.float32)[..., None] / 255
            s = S[y0:y1, x0:x1].astype(np.float32) / 255
            As = s[..., 3:4] * k_
            reg = reg * (1 - As) + s[..., :3] * As
        C[y0:y1, x0:x1] = reg
    L = layer(layers["front"][fi])
    if L is not None:
        rgb, a, (x0, y0, x1, y1) = L
        C[y0:y1, x0:x1] = C[y0:y1, x0:x1] * (1 - a) + rgb * a
    capdy = int(round(cam[fi][4])) if len(cam[fi]) > 4 else 0
    L = layer(layers["caps"][fi], capdy)
    if L is not None:
        rgb, a, (x0, y0, x1, y1) = L
        C[y0:y1, x0:x1] = C[y0:y1, x0:x1] * (1 - a) + rgb * a
    enc.stdin.write((np.clip(C, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
    if fi % 500 == 0:
        print("comp", fi, flush=True)
enc.stdin.close(); enc.wait()
print("done", out)
