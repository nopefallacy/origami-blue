"""Re-render a short time window of one graphics pass (behind|front|caps) and splice the frames into renders/<layer>.
The composition is time-shifted: clips are re-timed to the window and the main timeline is driven from T0.
usage: segpass.py <proj> <layer> <T0> <T1>
"""
import os, re, sys, glob, shutil, subprocess
proj, layer, T0, T1 = os.path.abspath(sys.argv[1]), sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
L = T1 - T0
html = open(f"{proj}/index.html").read()
hide = {"behind": ".front,.caps", "front": ".behind,.caps", "caps": ".behind,.front"}[layer]
html = html.replace("</style>", hide + "{display:none!important}\n</style>", 1)

def retime(m):
    s, d = float(m.group(1)), float(m.group(2))
    e = s + d
    ns, ne = max(0.0, s - T0), min(L, e - T0)
    if ne <= 0 or ns >= L:
        return 'data-start="9999" data-duration="0.01"'
    return f'data-start="{ns:.4f}" data-duration="{ne - ns:.4f}"'

root = re.search(r'<div id="root"[^>]*>', html).group(0)
body = html.replace(root, "@@ROOT@@", 1)
body = re.sub(r'data-start="([0-9.]+)" data-duration="([0-9.]+)"', retime, body)
root2 = re.sub(r'data-duration="[0-9.]+"', f'data-duration="{L}"', root)
html = body.replace("@@ROOT@@", root2, 1)
assert html.count('window.__timelines["main"] = tl;') == 1
html = html.replace('window.__timelines["main"] = tl;',
                    f'const seg = gsap.timeline({{ paused: true }}); seg.add(tl.tweenFromTo({T0}, {T1}, {{ ease: "none" }}), 0); window.__timelines["main"] = seg;', 1)
name = f"seg_{layer}.html"
open(f"{proj}/{name}", "w").write(html)
out = f"{proj}/renders/seg_{layer}"
shutil.rmtree(out, ignore_errors=True)
r = subprocess.run(["npx", "hyperframes@0.8.134", "render", "-c", name, "--fps", "30", "--quality", "draft", "--format", "png-sequence",
                    "--workers", "1", "--protocol-timeout", "900000", "-o", out], cwd=proj, capture_output=True, text=True)
if not glob.glob(f"{out}/*.png"): print(r.stdout[-1500:], r.stderr[-1500:])
os.remove(f"{proj}/{name}")
frames = sorted(glob.glob(f"{out}/*.png"))
dst = sorted(glob.glob(f"{proj}/renders/{layer}/*.png"))
f0 = int(round(T0 * 30))
n = min(len(frames), int(round(L * 30)))
if len(sys.argv) > 5 and sys.argv[5] == "check":
    import numpy as np
    from PIL import Image
    for i in (0, n - 1):
        a = np.asarray(Image.open(frames[i]).convert("RGBA")).astype(int); b = np.asarray(Image.open(dst[f0 + i]).convert("RGBA")).astype(int)
        print("check frame", f0 + i, "mean abs diff vs original pass:", round(float(np.abs(a - b).mean()), 4))
    sys.exit(0)
for i in range(n):
    shutil.copyfile(frames[i], dst[f0 + i])
shutil.rmtree(out, ignore_errors=True)
print(f"{proj} {layer}: replaced frames {f0}..{f0 + n - 1} ({n} frames; rendered {len(frames)})")
