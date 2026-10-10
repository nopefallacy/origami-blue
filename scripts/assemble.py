"""Assemble an origami-blue composition: shared style + fx + parts/body.html + caption data + parts/script.js -> <proj>/index.html
usage: assemble.py <proj> <transcript.json> <duration_s> <tile_start> <tile_end> "<kw1|kw2|...>" [word_fixes.json]
  tile_start/tile_end: words spoken while the full-screen series tile is up get no caption (use 0 0 if no tile)
  keywords: lowercase words that render yellow in captions
  word_fixes.json: optional {"mistranscribed": "fixed"} map (defaults fix "one-core"/"gover" -> crore)
"""
import json, os, re, sys
ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
proj, transcript, dur, tile0, tile1 = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
KEY = set(sys.argv[6].split("|")) if len(sys.argv) > 6 else set()
style = open(os.path.join(ASSETS, "style_base.html")).read()
style = style.replace(".front { z-index: 6; }", ".front { z-index: 6; }\n      .caps { z-index: 7; }")
body = open(os.path.join(ASSETS, "fx_defs.html")).read() + open(f"{proj}/parts/body.html").read()
script = open(f"{proj}/parts/script.js").read()
fx = open(os.path.join(ASSETS, "fx.js")).read()
script = script.replace("const q = (s) =>", fx + "        const q = (s) =>", 1)
w = json.load(open(transcript))
words = [[round(x["start"], 2), round(x["end"], 2), x["text"]] for x in w]
fix = {"gover": "crore", "one-core": "1-crore"}
if len(sys.argv) > 7:
    fix.update(json.load(open(sys.argv[7])))
out = []
for s0, e0, t in words:
    t = fix.get(t, t)
    base = re.sub(r"[.,?!]+$", "", t).lower()
    out.append([s0, e0, t + ("*" if base in KEY else "")])
out = [x for x in out if not (tile0 <= x[0] < tile1)]
chunks, cur = [], []
for wd in out:
    if cur:
        gap = wd[0] - cur[-1][1]
        if len(cur) >= 3 or gap > 0.3 or (wd[1] - cur[0][0]) > 1.25 or re.search(r"[.,?!]\*?$", cur[-1][2]):
            chunks.append(cur); cur = []
    cur.append(wd)
if cur: chunks.append(cur)
html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    {style}
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
{body}
    </div>
    <script>window.CAPS = {json.dumps(chunks)};</script>
    <script>
{script}
    </script>
  </body>
</html>
"""
open(f"{proj}/index.html", "w").write(html)
print(proj, len(chunks), "caption chunks")
