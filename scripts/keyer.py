"""Subject matte for the bookshelf room: ML matte x clean-plate difference key inside the book-stack zone.
The camera is locked, so the leaning book stack behind the head is static: matte pixels there that match
the temporal-mode plate are background (the model glues those books to the hair)."""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

import json, os

def load_zones(base, k):
    """<work>/zones.json: {"a": {"zone": [x0,y0,x1,y1], "props": [[x0,y0,x1,y1], ...]}, ...}
    half-res (540x960) coords of the MIRRORED frame. zone = area where the clean-plate key may cut (stop above
    the chair); props = static objects that touch the hair (book stacks, lamps) and look skin-coloured."""
    z = json.load(open(os.path.join(base, "zones.json")))[k]
    return tuple(z["zone"]), [tuple(p) for p in z.get("props", [])]

edt = ndimage.distance_transform_edt
def erode(m, r): return edt(m) > r
def dilate(m, r): return edt(~m) <= r
def opening(m, r): return dilate(erode(m, r), r)

class Keyer:
    def __init__(self, k, base="."):
        ZONE, PROPS = load_zones(base, k)
        self.plate = np.asarray(Image.open(os.path.join(base, f"{k}-plate.png")).convert("RGB").filter(ImageFilter.GaussianBlur(1.0))).astype(np.float32)
        frac = np.load(os.path.join(base, f"{k}-frac.npy"))
        h, w = frac.shape
        x0, y0, x1, y1 = ZONE
        zone = np.zeros((h, w), np.float32); zone[y0:y1, x0:x1] = 1
        zone = ndimage.gaussian_filter(zone, 6)
        p = self.plate / 255
        mx, mn = p.max(2), p.min(2)
        sat = (mx - mn) / np.maximum(mx, 1e-3)
        r, g, b = p[..., 0], p[..., 1], p[..., 2]
        skin = (r > g) & (g > b) & (sat > 0.22) & (sat < 0.7) & (mx > 0.35) & ((r - g) < 0.25)
        yy, xx = np.mgrid[-11:12, -11:12]
        disk = (xx * xx + yy * yy) <= 121
        skin = ndimage.binary_opening(skin, structure=disk)       # forehead blob survives, thin book spines don't
        skin = ndimage.binary_dilation(skin, iterations=6)
        self.rel = zone * np.clip((frac - 0.2) / 0.12, 0, 1) * (1 - skin)
        self.disk = disk
        self.zone = zone
        self.props = np.zeros((h, w), bool)
        for x0, y0, x1, y1 in PROPS: self.props[y0:y1, x0:x1] = True

    def __call__(self, F, al):
        """F: HxWx3 uint8 full res (mirrored), al: HxW uint8 ML alpha (mirrored). returns uint8 alpha."""
        H, W = al.shape
        h, w = H // 2, W // 2
        f = np.asarray(Image.fromarray(F).resize((w, h), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.0))).astype(np.float32)
        d = np.abs(f - self.plate).max(2)
        a = np.asarray(Image.fromarray(al).resize((w, h), Image.BILINEAR)).astype(np.float32) / 255
        # head prior from the ML matte: neck = first narrow row scanning up from the shoulders
        cols = np.ones((h, w), np.float32); strict = np.zeros((h, w), bool)
        ab = a > 0.5; wid = ab.sum(1)
        y_sh = next((y + 1 for y in range(h - 1, h // 4, -1) if wid[y] < 0.42 * w and wid[min(h - 1, y + 1)] < 0.42 * w), None)
        if y_sh is not None:
            face = ab[max(0, y_sh - 210):max(1, y_sh - 70)]
            fw = face.sum(1)
            if (fw > 0).any():
                cx = int(np.median(np.where(face)[1])); hw = int(np.median(fw[fw > 0]) / 2) + 34
                c1 = np.zeros(w, np.float32); c1[max(0, cx - hw):min(w, cx + hw)] = 1
                c1 = np.convolve(c1, np.ones(15) / 15, mode="same")
                top = slice(0, max(0, y_sh - 70))
                cols[top] = c1[None, :]                    # books / lamp beside the head: gone
                strict[top] = c1[None, :] > 0.5            # over the hair itself: only cut on strong evidence
        bg = np.where(strict, np.clip((10 - d) / 5, 0, 1), np.clip((24 - d) / 11, 0, 1))
        # never cut the face: big skin blobs in the current frame are protected (thin orange spines are not)
        c = f / 255; mx, mn = c.max(2), c.min(2); sat = (mx - mn) / np.maximum(mx, 1e-3)
        sk = (c[..., 0] > c[..., 1]) & (c[..., 1] > c[..., 2]) & (sat > 0.2) & (sat < 0.7) & (mx > 0.3)
        sk &= ~self.props                                   # book spines / lamp are skin-coloured: no protection there
        q = sk[::2, ::2]                                    # quarter res for the morphology
        q = opening(q, 5.5)
        lab, n = ndimage.label(q)
        if n:
            sz = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
            q = np.isin(lab, 1 + np.where(sz > 875)[0])     # only the face-sized blob
        q = dilate(q, 2.5)
        sk = np.repeat(np.repeat(q, 2, 0), 2, 1)[:h, :w]
        bg = bg * (1 - sk)
        keep = (1 - self.rel * bg) * cols
        m = (a * keep) > 0.5
        m = ndimage.binary_opening(m, iterations=2)
        # cut thin bridges (plant, lamp cord) with a temporary erosion, keep the body-connected part
        core = erode(m[::2, ::2], 3.5)
        lab, n = ndimage.label(core)
        if n:
            bot = lab[int(lab.shape[0] * 0.85):]
            ids = np.unique(bot[bot > 0])
            if len(ids):
                sizes = ndimage.sum(np.ones_like(lab), lab, ids)
                core = lab == ids[int(np.argmax(sizes))]
                core = dilate(core, 4.5)
                m = np.repeat(np.repeat(core, 2, 0), 2, 1)[:h, :w] & m
        m = ndimage.binary_closing(m, iterations=2)
        m = ndimage.binary_fill_holes(m)
        km = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)).resize((W, H), Image.BILINEAR)
        km = np.asarray(km).astype(np.float32) / 255
        out = al.astype(np.float32) * km
        return (out + 0.5).clip(0, 255).astype(np.uint8)

def head_top(al):
    W = al.shape[1]
    rows = np.where((al[:, int(W * .18):int(W * .82)] > 128).sum(1) > 20)[0]
    return float(rows[0]) if len(rows) else 1920.0
