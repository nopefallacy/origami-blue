"""Preview the subject key on the card frames (green = removed). Run from the work dir after cards.py made the card mattes.
usage: keytest.py <key> <project> <out.jpg>"""
import os, sys, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from keyer import Keyer
k, proj, out = sys.argv[1:4]
K = Keyer(k, base=os.getcwd()); tiles = []
for src in sorted(glob.glob(f"{proj}/cards/tmp/src_*.png")):
    a = np.asarray(Image.open(src.replace("src_", "a_")).convert("L"))
    s = np.asarray(Image.open(src).convert("RGB"))
    c = K(s, a)[..., None] / 255
    o = (s * c + np.array([0, 200, 0]) * (1 - c)).astype(np.uint8)[150:1150, 100:980]
    tiles.append(np.asarray(Image.fromarray(o).resize((300, 341))))
while len(tiles) % 5: tiles.append(np.zeros_like(tiles[0]))
rows = [np.concatenate(tiles[i:i + 5], 1) for i in range(0, len(tiles), 5)]
Image.fromarray(np.concatenate(rows, 0)).save(out, quality=85); print(out)
