"""Draw a coordinate grid over the median plate so you can read zone/props boxes for zones.json.
usage: plategrid.py <plates_dir> <key> <out.png>      (half-res 540x960 mirrored coords; bright lines every 100px)"""
import sys
from PIL import Image, ImageDraw
S, k, out = sys.argv[1:4]
im = Image.open(f"{S}/{k}_median.png").convert("RGB")
d = ImageDraw.Draw(im)
for x in range(0, im.width, 20): d.line([(x, 0), (x, im.height)], fill=(0, 255, 255) if x % 100 == 0 else (0, 80, 80))
for y in range(0, im.height, 20): d.line([(0, y), (im.width, y)], fill=(0, 255, 255) if y % 100 == 0 else (0, 80, 80))
for x in range(0, im.width, 100): d.text((x + 3, 3), str(x), fill=(255, 255, 0))
for y in range(100, im.height, 100): d.text((3, y + 3), str(y), fill=(255, 255, 0))
im.resize((im.width * 2, im.height * 2)).save(out); print(out)
