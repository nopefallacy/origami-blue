import json, subprocess, sys
voice, cues_f, dur, out, sfxdir = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4], sys.argv[5]
F = {"whoosh": "sfx_003.mp3", "pop": "sfx_002.mp3", "impact": "sfx_004.mp3", "thud": "sfx_005.mp3", "tick": "sfx_007.mp3"}
L = {"whoosh": 0.6, "pop": 0.7, "impact": 1.4, "thud": 0.9, "tick": 0.9}
cues = json.load(open(cues_f))
inp = ["-i", voice]; fl = [f"[0:a]atrim=0:{dur},asetpts=PTS-STARTPTS[a0]"]; lab = ["[a0]"]
for k, (t, kind, vol) in enumerate(cues, 1):
    inp += ["-i", f"{sfxdir}/{F[kind]}"]
    ms = int(t * 1000)
    fl.append(f"[{k}:a]atrim=0:{L[kind]},afade=t=out:st={L[kind]-0.15}:d=0.15,asetpts=PTS-STARTPTS,volume={vol},adelay={ms}|{ms}[s{k}]"); lab.append(f"[s{k}]")
fl.append("".join(lab) + f"amix=inputs={len(lab)}:normalize=0:dropout_transition=0,atrim=0:{dur},loudnorm=I=-14:TP=-1.0:LRA=11[out]")
r = subprocess.run(["ffmpeg", "-v", "error", "-y"] + inp + ["-filter_complex", ";".join(fl), "-map", "[out]", "-ar", "48000", "-c:a", "aac", "-b:a", "256k", out], capture_output=True, text=True)
print(r.stderr[-400:] or f"ok {out} ({len(cues)} cues)")
