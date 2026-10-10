# contact sheet of a finished draft at the card beats (+ extra times): sheet.py <draft.mp4> <cards.json> <out.jpg> [extra,times]
import sys, json, subprocess
from PIL import Image, ImageDraw, ImageFont
v, spec, out = sys.argv[1:4]
ts = [c["t"] for c in json.load(open(spec))] + ([float(x) for x in sys.argv[4].split(",")] if len(sys.argv) > 4 else [])
F = ImageFont.truetype("/Library/Fonts/Arial Unicode.ttf", 22)
tiles = []
for t in ts:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "360x640", "-"], capture_output=True).stdout
    im = Image.frombytes("RGB", (360, 640), raw); ImageDraw.Draw(im).text((8, 610), f"{t:.2f}s", font=F, fill=(254, 209, 0)); tiles.append(im)
cols = 7; rows = (len(tiles) + cols - 1) // cols
sh = Image.new("RGB", (cols * 360, rows * 640), (18, 17, 19))
for i, im in enumerate(tiles): sh.paste(im, ((i % cols) * 360, (i // cols) * 640))
sh.save(out, quality=88); print(out, len(tiles))
