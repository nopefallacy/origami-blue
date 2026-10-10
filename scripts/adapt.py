# Adaptive framing: keep the subject's head below the on-screen graphics, smoothly.
# in: base cam [[s,dx,dy,p]...], headtop (source px per frame), clearance [[t0,t1,C]...]
# out: [[s,dx,dy,p,capdy]...]
import json, sys, numpy as np
base, head, clear, out = sys.argv[1:5]
S_MAX = 1.25
cam = np.array(json.load(open(base)), dtype=np.float64)
ht = np.array(json.load(open(head)), dtype=np.float64)
N = len(cam); ht = ht[:N]
if len(ht) < N: ht = np.concatenate([ht, np.full(N - len(ht), ht[-1])])
def gauss(x, sig):
    r = int(sig * 3); k = np.exp(-0.5 * (np.arange(-r, r + 1) / sig) ** 2); k /= k.sum()
    xp = np.pad(x, r, mode="edge"); return np.convolve(xp, k, mode="valid")
# conservative head top: highest point within +-12 frames, then smooth
w = 12
htc = np.array([ht[max(0, i - w):i + w + 1].min() for i in range(N)])
htc = gauss(htc, 12)
# clearance curve with 0.4s eased ramps
t = np.arange(N) / 30.0
C = np.zeros(N)
for a, b, c in json.load(open(clear)):
    r = 0.4
    up = np.clip((t - (a - r)) / r, 0, 1); dn = np.clip(((b + r) - t) / r, 0, 1)
    ramp = np.minimum(up, dn); ramp = ramp * ramp * (3 - 2 * ramp)
    C = np.maximum(C, c * ramp)
s = cam[:, 0].copy(); dy = cam[:, 2].copy(); p = cam[:, 3].copy()
for i in range(N):
    if p[i] > 0.001 or C[i] <= 0: continue
    ys = s[i] * htc[i] + dy[i]
    if ys >= C[i]: continue
    dy[i] = min(0.0, dy[i] + (C[i] - ys))           # first slide the frame down (no extra zoom)
    ys = s[i] * htc[i] + dy[i]
    if ys < C[i]:                                     # then push in from the top edge
        s[i] = min(S_MAX, max(s[i], C[i] / htc[i])); dy[i] = 0.0
s = gauss(s, 5); dy = gauss(dy, 5)
dy = np.minimum(dy, 0); dy = np.maximum(dy, 1920 * (1 - s))  # keep frame covered
dx = 540 * (1 - s)
# captions sit just under the chin (chin ~ headtop + 700 in source), inside IG safe zone
chin = s * (htc + 700) + dy
capdy = np.clip(chin + 24 - 1440, 0, 166)
capdy = gauss(capdy, 8)
res = np.stack([s, dx, dy, p, capdy, s * htc + dy], 1)
json.dump([[round(float(v), 3) for v in r] for r in res], open(out, "w"))
bad = int(((C > 0) & (s * htc + dy < C - 1)).sum())
print(f"frames {N}  max s {s.max():.3f}  frames still tight (capped) {bad}  capdy max {capdy.max():.0f}")
