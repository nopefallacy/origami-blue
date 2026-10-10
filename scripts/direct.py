"""Make an assembled composition a complete edit: real footage inside HyperFrames.
Adds the prepped base video, the subject cut-out clips (only where graphics sit behind him), the mixed
audio, and the caption offset that keeps subtitles under the chin.
usage: direct.py <proj> <cam.json> <windows.json> [render_duration]
"""
import json, re, sys
proj, camf, winf = sys.argv[1:4]
dur_override = float(sys.argv[4]) if len(sys.argv) > 4 else None
html = open(f"{proj}/index.html").read()
cam = json.load(open(camf))
wins = json.load(open(winf))
m = re.search(r'(<div id="root"[^>]*data-duration=")([0-9.]+)("[^>]*>)', html)
dur = dur_override or float(m.group(2))
root_tag = m.group(1) + f"{dur}" + m.group(3)
vid = 'style="position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; object-fit: cover; z-index: {z}"'
media = [f'      <video id="base" class="clip" data-start="0" data-duration="{dur}" src="media/base.mp4" muted playsinline {vid.format(z=1)}></video>']
for k, (a, b) in enumerate(wins):
    if a >= dur:
        continue
    d = round(min(b, dur) - a, 3)
    media.append(f'      <video id="subj-{k:02d}" class="clip" data-start="{a}" data-duration="{d}" src="media/subj-{k:02d}.webm" muted playsinline {vid.format(z=4)}></video>')
media.append(f'      <audio id="mix" class="clip" data-start="0" data-duration="{dur}" src="media/mix.m4a" data-has-audio="true"></audio>')
html = html.replace(m.group(0), root_tag + "\n" + "\n".join(media), 1)
capdy = [int(round(r[4])) if len(r) > 4 else 0 for r in cam]
shift = '''        // subtitles ride just under the chin (offset from the adaptive camera)
        const capEl = document.getElementById("captions"), CD = window.CAPDY || [], cp = { f: 0 };
        tl.fromTo(cp, { f: 0 }, { f: CD.length - 1, duration: (CD.length - 1) / 30, ease: "none", onUpdate: () => { capEl.style.transform = "translateY(" + (CD[Math.round(cp.f)] || 0) + "px)"; } }, 0);

        window.__timelines["main"] = tl;'''
assert html.count('window.__timelines["main"] = tl;') == 1
html = html.replace('        window.__timelines["main"] = tl;', shift, 1)
html = html.replace("<script>window.CAPS", f"<script>window.CAPDY = {json.dumps(capdy)};</script>\n    <script>window.CAPS", 1)
open(f"{proj}/index.html", "w").write(html)
print(proj, "direct edit:", len(media) - 2, "subject clips, duration", dur)
