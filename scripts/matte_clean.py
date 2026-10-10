"""Keep only the subject: the matte component connected to the bottom of the frame.
Thin bridges (hair touching a shelf) are cut by a temporary erosion before labelling."""
import numpy as np
from PIL import Image
from scipy import ndimage

def clean_alpha(al, erode=14):
    """al: uint8 HxW alpha. returns uint8 cleaned alpha."""
    H, W = al.shape
    small = np.asarray(Image.fromarray(al).resize((W // 2, H // 2), Image.BILINEAR)) > 90
    core = ndimage.binary_erosion(small, iterations=erode)
    lab, n = ndimage.label(core)
    if n == 0:
        return al
    bottom = lab[int(lab.shape[0] * 0.8):, :]
    ids = [i for i in np.unique(bottom) if i != 0]
    if not ids:
        return al
    sizes = ndimage.sum(np.ones_like(lab), lab, ids)
    keep_id = ids[int(np.argmax(sizes))]
    keep = ndimage.binary_dilation(lab == keep_id, iterations=erode + 4) & small
    keep = ndimage.binary_dilation(keep, iterations=3)
    m = np.asarray(Image.fromarray((keep * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)).astype(np.float32) / 255
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(__import__("PIL.ImageFilter", fromlist=["x"]).GaussianBlur(3))).astype(np.float32) / 255
    out = al.astype(np.float32) * m
    # head prior anchored on the shoulders (always the widest band of the subject)
    bin_ = out > 128
    widths = bin_.sum(1)
    # scan up from the bottom while the body is wide; the first narrow row is the neck
    y_sh = None
    for y in range(H - 1, H // 4, -1):
        if widths[y] < 0.42 * W and widths[min(H - 1, y + 1)] < 0.42 * W:
            y_sh = y + 2; break
    if y_sh is not None:
        face = bin_[max(0, y_sh - 420):max(1, y_sh - 140)]
        if face.any():
            cx = int(np.median(np.where(face)[1]))
            fw = face.sum(1); hw = int(np.median(fw[fw > 0]) / 2) + 60
            x0, x1 = max(0, cx - hw), min(W, cx + hw)
            # walk up through the hair; stop at the first clear gap above the head
            y_top = y_sh - 140
            gap = 0
            for y in range(y_sh - 140, -1, -1):
                if bin_[y, x0:x1].sum() > 6: y_top = y; gap = 0
                else:
                    gap += 1
                    if gap >= 6: break
            keepcols = np.zeros(W, np.float32); keepcols[x0:x1] = 1
            keepcols = np.convolve(keepcols, np.ones(41) / 41, mode="same")
            region = slice(0, max(0, y_sh - 140))
            out[region] *= keepcols[None, :]
            # anatomical cap: hair never rises more than ~1.75 face-widths above the neck
            facew = float(np.median(fw[fw > 0]))
            y_cap = int(y_sh - 1.75 * facew)
            y_top = max(y_top, y_cap)
            cut = max(0, y_top - 8)
            ramp = np.clip((np.arange(cut) - (cut - 12)) / 12.0, 0, 1)[:, None] if cut > 0 else None
            if cut > 0: out[:cut] *= ramp
    return (out + 0.5).clip(0, 255).astype(np.uint8)
