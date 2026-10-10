"""Footage prep for a direct HyperFrames render (no graphics here, no PNGs written).
One pass over the footage, in screen space (adaptive camera, grade, vignette/top shade):
  base.mp4        - the room + subject with the graduated depth-of-field above the head
  subj-XX.webm    - VP9-alpha cut-out of the subject, only for the windows where graphics sit behind him
usage: plates.py <composite.py> <footage_sdr.mp4> <keyed_alpha.mp4> <cam.json> <windows.json> <out_dir> <N> [start]
"""
import json, sys, subprocess
import numpy as np
from PIL import Image

comp, footage, keyed, camf, winf, out_dir, N = sys.argv[1:8]
N = int(N); START = int(sys.argv[8]) if len(sys.argv) > 8 else 0
BASE = sys.argv[9] if len(sys.argv) > 9 else "base.mp4"
g = {"__name__": "plates"}
argv0 = sys.argv
sys.argv = ["x", footage, keyed, camf, "b", "f", "c", "/dev/null", str(N), str(START)]
exec(open(comp).read(), g)
sys.argv = argv0
W, H = 1080, 1920
cam = json.load(open(camf))
wins = json.load(open(winf))  # [[t0, t1], ...] seconds (absolute)

fp, fsz = g["reader"](footage, "rgb24", 3)
ap, asz = g["reader"](keyed, "gray", 1)
base = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
                         "-c:v", "libx264", "-crf", "14", "-preset", "faster", "-g", "30", "-pix_fmt", "yuv420p",
                         "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", f"{out_dir}/{BASE}"], stdin=subprocess.PIPE)
frames_of = [(int(round(a * 30)), int(round(b * 30))) for a, b in wins]
enc = {}

def subj_encoder(k):
    return subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
                             "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "24", "-deadline", "realtime", "-cpu-used", "8",
                             "-row-mt", "1", "-threads", "4", "-tile-columns", "2", "-auto-alt-ref", "0", f"{out_dir}/subj-{k:02d}.webm"], stdin=subprocess.PIPE)

for i in range(N):
    fi = START + i
    s, dx, dy, p = cam[fi][:4]
    raw = np.frombuffer(fp.stdout.read(fsz), np.uint8).reshape(H, W, 3)
    al = np.frombuffer(ap.stdout.read(asz), np.uint8).reshape(H, W)
    gr = (g["grade"](raw.astype(np.float32) / 255) * 255 + 0.5).astype(np.uint8)
    F = np.asarray(g["affine"](Image.fromarray(gr), s, dx, dy, Image.BICUBIC)).astype(np.float32) / 255 * g["LIGHT"]
    yl = (cam[fi][5] + 10) if len(cam[fi]) > 5 else None
    # graduated depth-of-field above the head: only the band rows are blurred
    C = F
    if yl is not None and yl > 0:
        ylim = min(H, int(yl) + 40)
        C = F.copy()
        C[:ylim] = g["band_blur"](F[:ylim], yl)
    base.stdin.write((np.clip(C, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
    for k, (a, b) in enumerate(frames_of):
        if a <= fi < b:
            if k not in enc:
                enc[k] = subj_encoder(k)
            A = np.asarray(g["affine"](Image.fromarray(al), s, dx, dy, Image.BILINEAR))
            rgba = np.dstack([(np.clip(F, 0, 1) * 255 + 0.5).astype(np.uint8), A])
            enc[k].stdin.write(rgba.tobytes())
        elif fi >= b and k in enc and enc[k] is not None:
            enc[k].stdin.close(); enc[k].wait(); enc[k] = None
    if i % 300 == 0:
        print("plate frame", fi, flush=True)
base.stdin.close(); base.wait()
for k, e in enc.items():
    if e is not None:
        e.stdin.close(); e.wait()
print("done", out_dir, "subject clips:", len(enc))
