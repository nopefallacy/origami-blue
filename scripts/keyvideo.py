"""Full-video subject matte: ML alpha x clean-plate key (keyer.py), 2 worker processes.
Writes an un-mirrored gray alpha video (composite.py mirrors it like the footage) + per-frame head-top (source px).
usage: keyvideo.py <k> <footage_sdr.mp4> <ml_alpha.mp4> <out_alpha.mp4> <headtop.json> <N>"""
import os, sys, json, subprocess, numpy as np
from multiprocessing import Pool
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
W, H = 1080, 1920
_K = None
def init(k):
    global _K
    from keyer import Keyer
    _K = Keyer(k, base=os.getcwd())
def work(args):
    fb, ab = args
    F = np.frombuffer(fb, np.uint8).reshape(H, W, 3)
    al = np.frombuffer(ab, np.uint8).reshape(H, W)
    c = _K(F, al)
    rows = np.where((c[:, 194:886] > 128).sum(1) > 20)[0]
    return (float(rows[0]) if len(rows) else 1920.0), np.ascontiguousarray(c[:, ::-1]).tobytes()

if __name__ == "__main__":
    k, footage, alpha, out, htf, N = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], int(sys.argv[6])
    rd = lambda p, pix: subprocess.Popen(["ffmpeg", "-v", "error", "-i", p, "-vf", "hflip", "-frames:v", str(N), "-f", "rawvideo", "-pix_fmt", pix, "-"], stdout=subprocess.PIPE, bufsize=10 ** 8)
    fp, ap = rd(footage, "rgb24"), rd(alpha, "gray")
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
                            "-c:v", "libx264", "-crf", "8", "-preset", "medium", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    def frames():
        for i in range(N):
            fb = fp.stdout.read(W * H * 3); ab = ap.stdout.read(W * H)
            if len(fb) < W * H * 3 or len(ab) < W * H:
                return
            yield fb, ab
    tops = []
    with Pool(2, initializer=init, initargs=(k,)) as pool:
        for i, (ht, buf) in enumerate(pool.imap(work, frames(), chunksize=4)):
            tops.append(ht); enc.stdin.write(buf)
            if i % 300 == 0:
                print("key", i, flush=True)
    enc.stdin.close(); enc.wait()
    json.dump(tops, open(htf, "w"))
    t = np.array(tops); print("frames", len(tops), "headtop min %.0f median %.0f max %.0f" % (t.min(), np.median(t), t.max()))
