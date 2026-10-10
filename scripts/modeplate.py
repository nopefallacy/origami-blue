# usage: modeplate.py <plates_dir> <key> <x0> <y0> <x1> <y1> [tol=6]   (half-res box = the zone; writes <key>-plate.png, <key>-frac.npy in cwd)
# temporal-mode plate in a region: the colour a pixel holds most consistently (static books win over moving hair)
import sys, numpy as np
from PIL import Image
S, k = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = map(int, sys.argv[3:7]); TOL = int(sys.argv[7]) if len(sys.argv) > 7 else 10
allf = np.load(f"{S}/{k}_samples.npy")
allf = allf[np.linspace(0, len(allf) - 1, min(len(allf), 140)).round().astype(int)]  # cost is O(N^2): cap samples
fr = allf[:, y0:y1, x0:x1].astype(np.int16)  # N h w 3
N, h, w, _ = fr.shape
P = fr.reshape(N, -1, 3).transpose(1, 0, 2)  # px N 3
plate = np.zeros((P.shape[0], 3), np.float32); frac = np.zeros(P.shape[0], np.float32)
for i in range(0, P.shape[0], 256):
    c = P[i:i + 256]
    d = np.abs(c[:, :, None, :] - c[:, None, :, :]).max(3)  # px N N
    near = d <= TOL
    cnt = near.sum(2)
    j = cnt.argmax(1)
    sel = near[np.arange(len(c)), j]  # px N
    plate[i:i + 256] = (c * sel[..., None]).sum(1) / sel.sum(1, keepdims=True)
    frac[i:i + 256] = cnt[np.arange(len(c)), j] / N
full = np.median(allf, 0).astype(np.float32)
full[y0:y1, x0:x1] = plate.reshape(h, w, 3)
F = np.zeros(full.shape[:2], np.float32); F[y0:y1, x0:x1] = frac.reshape(h, w)
Image.fromarray(full.clip(0, 255).astype(np.uint8)).save(f"{k}-plate.png")
np.save(f"{k}-frac.npy", F)
Image.fromarray((F * 255).astype(np.uint8)).save(f"{S}/{k}-frac.png")
print(k, "done", np.percentile(frac, [10, 50, 90]))
