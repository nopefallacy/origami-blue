# static background plate from the whole clip (mirrored like the edit), half-res
import sys, subprocess, numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
w, h = 540, 960
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps=1.5,hflip,scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)
np.save(out + "_samples.npy", fr)
med = np.median(fr, 0).astype(np.uint8)
Image.fromarray(med).save(out + "_median.png")
print(fr.shape)
