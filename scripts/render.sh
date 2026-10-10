#!/bin/bash
# Phase 4 — full draft after the cards are approved. Resumable: every step skips when its output exists.
# Route that works on an 8 GB Mac: cut-out -> book key -> adaptive camera -> footage prep (base.mp4 + subject clips)
# -> graphics-only HyperFrames passes -> light composite -> audio mix -> draft + phone preview + QA sheet.
# usage: caffeinate -dimsu bash render.sh <episode.env>
source "$(dirname "$0")/_env.sh" "$1"
# 1 cut-out (ML matte, ~0.2-0.6 s/frame)
if ! grep -q ALPHA_DONE $K-matte.log 2>/dev/null; then
  npx --yes hyperframes@0.8.134 remove-background $K-sdr.mp4 -o $K-matte.mov > $K-matte.log 2>&1 < /dev/null
  ffmpeg -v error -y -i $K-matte.mov -vf "alphaextract,format=gray" -c:v libx264 -crf 8 -preset medium -pix_fmt yuv420p $K-alpha.mp4 && rm -f $K-matte.mov && echo ALPHA_DONE >> $K-matte.log
  grep -q ALPHA_DONE $K-matte.log || { log "matte FAILED"; exit 1; }
fi
log "matte ok"
# 2 subject key (books/lamp removed against the clean plate)
if [ ! -f $K-keyed.done ]; then
  $PY $S/keyvideo.py $K $K-sdr.mp4 $K-alpha.mp4 $K-keyed.tmp.mp4 $K-headtop.tmp.json $N 2>/dev/null | tail -1
  [ -s $K-headtop.tmp.json ] && mv $K-keyed.tmp.mp4 $K-keyed.mp4 && mv $K-headtop.tmp.json $K-headtop.json && date > $K-keyed.done
  [ -f $K-keyed.done ] || { log "key FAILED"; exit 1; }
fi
log "key ok"
# 3 adaptive camera (head never covers graphics; captions ride under the chin)
node $S/node/camexport.js "$PROJ/camera.cjs" $K-cam-base.json $N > /dev/null
$PY $S/adapt.py $K-cam-base.json $K-headtop.json $K-clear.json $K-cam.json 2>/dev/null | sed 's/^/camera /'
# 4 footage prep: base.mp4 + subject clips for the chroma windows, 3 parallel slices cut outside windows
if [ ! -f $K-plates.done ]; then
  read S1 S2 <<< "${SLICES:-$($PY -c "
import json; w=[(round(a*30),round(b*30)) for a,b in json.load(open('$K-wins.json'))]; n=$N
def ok(f): return all(not(a<f<b) for a,b in w)
def near(t):
    for d in range(0,n):
        for f in (t-d,t+d):
            if 0<f<n and ok(f): return f
print(near(n//3), near(2*n//3))")}"
  $PY $S/plates.py "$PROJ/composite.py" $K-sdr.mp4 $K-keyed.mp4 $K-cam.json $K-wins.json "$PROJ/media" $S1 0 base_0.mp4 2>/dev/null | tail -1 &
  $PY $S/plates.py "$PROJ/composite.py" $K-sdr.mp4 $K-keyed.mp4 $K-cam.json $K-wins.json "$PROJ/media" $((S2 - S1)) $S1 base_1.mp4 2>/dev/null | tail -1 &
  $PY $S/plates.py "$PROJ/composite.py" $K-sdr.mp4 $K-keyed.mp4 $K-cam.json $K-wins.json "$PROJ/media" $((N - S2)) $S2 base_2.mp4 2>/dev/null | tail -1 &
  wait
  (cd "$PROJ/media" && printf "file 'base_0.mp4'\nfile 'base_1.mp4'\nfile 'base_2.mp4'\n" > base.txt && ffmpeg -v error -y -f concat -safe 0 -i base.txt -c copy base.mp4 && rm -f base_0.mp4 base_1.mp4 base_2.mp4 base.txt)
  nb=$(ffprobe -v error -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$PROJ/media/base.mp4")
  [ "$nb" -eq "$N" ] && date > $K-plates.done || { log "footage prep FAILED ($nb of $N frames)"; exit 1; }
fi
log "footage prep ok"
# 5 audio: voice + SFX cues, loudness -14 LUFS
[ -s "$PROJ/media/mix.m4a" ] || python3 $S/mix.py $K-sdr.mp4 $K-cues.json $DUR "$PROJ/media/mix.m4a" "$PROJ/sfx" | sed 's/^/mix /'
# 6 graphics-only passes (no video in the page = no Chrome hangs)
$PY $S/assemble.py "$PROJ" $TRANSCRIPT $DUR $TILE0 $TILE1 "$KEYWORDS" ${FIXES:-} 2>/dev/null
for L in behind front caps; do
  n=$(ls "$PROJ/renders/$L" 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -ge "$N" ] && continue
  for attempt in 1 2 3; do
    bash "$PROJ/passes.sh" $L > /dev/null 2>&1
    n=$(ls "$PROJ/renders/$L" 2>/dev/null | wc -l | tr -d ' ')
    log "$L pass frames=$n (attempt $attempt)"; [ "$n" -ge "$N" ] && break
  done
  [ "$n" -ge "$N" ] || { log "$L pass FAILED"; exit 1; }
done
# 7 composite + mux + preview + QA sheet
OUT="$PROJ/renders/ep$EP-draft.mp4"
if [ ! -s "$OUT" ]; then
  $PY $S/fastcomp.py "$PROJ" $K-cam.json $K-wins.json $K-video.mp4 $N 2>/dev/null | tail -1
  ffmpeg -v error -y -i $K-video.mp4 -i "$PROJ/media/mix.m4a" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT.tmp.mp4" && mv "$OUT.tmp.mp4" "$OUT" && rm -f $K-video.mp4
fi
ffmpeg -v error -y -i "$OUT" -vf scale=720:1280 -c:v libx264 -crf 28 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "${OUT%.mp4}-preview.mp4"
$PY $S/sheet.py "$OUT" $K-cards.json "$PROJ/renders/ep$EP-sheet.jpg" 2>/dev/null
log "DRAFT READY $OUT (QA: $PROJ/renders/ep$EP-sheet.jpg, phone preview: ${OUT%.mp4}-preview.mp4)"
# 8 add the complete edit to the HyperFrames desktop app (optional: APP_NAME in episode.env)
if [ -n "${APP_NAME:-}" ]; then
  PY=$PY bash $S/to_app.sh "$APP_NAME" "$PROJ" "$WORK/$K-cam.json" "$WORK/$K-wins.json"
fi
