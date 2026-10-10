# inside the prop boxes, rebuild the plate from STATIC samples only (unchanged vs the next sample): books always are, hair rarely
import os, sys, numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from keyer import load_zones
S, k = sys.argv[1], sys.argv[2]
fr = np.load(f"{S}/{k}_samples.npy").astype(np.int16)
plate = np.asarray(Image.open(f"{k}-plate.png").convert("RGB")).astype(np.float32)
frac = np.load(f"{k}-frac.npy")
for x0, y0, x1, y1 in load_zones(".", k)[1]:
    c = fr[:, y0:y1, x0:x1]                       # N h w 3
    stat = np.zeros(c.shape[:3], bool)
    dn = np.abs(c[1:] - c[:-1]).max(3) <= 6
    stat[:-1] |= dn; stat[1:] |= dn                 # static if it matches a neighbouring sample
    N, h, w, _ = c.shape
    P = c.reshape(N, -1, 3).transpose(1, 0, 2); St = stat.reshape(N, -1).T
    out = np.zeros((P.shape[0], 3), np.float32); fo = np.zeros(P.shape[0], np.float32)
    for i in range(0, P.shape[0], 256):
        p, s_ = P[i:i + 256], St[i:i + 256]
        d = np.abs(p[:, :, None, :] - p[:, None, :, :]).max(3) <= 6
        d &= s_[:, None, :] & s_[:, :, None]
        cnt = d.sum(2); j = cnt.argmax(1)
        sel = d[np.arange(len(p)), j]
        ok = sel.sum(1) > 0
        out[i:i + 256][ok] = ((p * sel[..., None]).sum(1)[ok] / sel.sum(1, keepdims=True)[ok])
        fo[i:i + 256] = cnt[np.arange(len(p)), j] / N
    out = out.reshape(h, w, 3); fo = fo.reshape(h, w)
    better = fo * 1.0 > 0.06                       # a static cluster seen in >6% of samples
    reg = plate[y0:y1, x0:x1]; reg[better] = out[better]
    fr_ = frac[y0:y1, x0:x1]; fr_[better] = np.maximum(fr_[better], np.clip(fo[better] * 3, 0, 1))
    print(k, (x0, y0), "static-plate pixels", int(better.sum()), "of", better.size)
Image.fromarray(plate.clip(0, 255).astype(np.uint8)).save(f"{k}-plate.png")
np.save(f"{k}-frac.npy", frac)
