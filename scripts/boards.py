# 2x2 review boards from the annotated cards: boards.py <project> <ep label e.g. ep05>
import sys, glob, os
from PIL import Image
proj, ep = sys.argv[1], sys.argv[2]
cards = sorted(glob.glob(f"{proj}/cards/card_*.png"))
os.makedirs(f"{proj}/cards/boards", exist_ok=True)
for b in range(0, len(cards), 4):
    grp = cards[b:b + 4]
    sheet = Image.new("RGB", (2720, 2560 if len(grp) > 2 else 1280), (18, 17, 19))
    for i, c in enumerate(grp):
        sheet.paste(Image.open(c).convert("RGB"), ((i % 2) * 1360, (i // 2) * 1280))
    sheet = sheet.resize((int(sheet.width * 0.6), int(sheet.height * 0.6)), Image.LANCZOS)
    out = f"{proj}/cards/boards/{ep}-board-{b // 4 + 1}.jpg"
    sheet.save(out, quality=88); print(out, len(grp))
