#!/bin/bash
# Phase 3 — design cards for approval (no full render). Re-run freely; each step reuses finished outputs.
# usage: cards.sh <episode.env>
source "$(dirname "$0")/_env.sh" "$1"
CARD_TIMES=${CARD_TIMES:-$($PY -c "import json;print(','.join(str(c['t']) for c in json.load(open('$K-cards.json'))))")}
$PY $S/assemble.py "$PROJ" $TRANSCRIPT $DUR $TILE0 $TILE1 "$KEYWORDS" ${FIXES:-} 2>/dev/null
(cd "$PROJ" && npx hyperframes@0.8.134 lint 2>&1 | tail -1 | sed 's/^/lint /')
node $S/node/camexport.js "$PROJ/camera.cjs" "$WORK/$K-cam-base.json" $N | sed 's/^/camera /'
# clean plates for the chroma key (needs a zones.json entry for this key — see references/workflow.md)
mkdir -p plates
[ -f plates/${K}_samples.npy ] || $PY $S/plate.py $K-sdr.mp4 plates/$K 2>/dev/null | sed 's/^/plate samples /'
if ! $PY -c "import json,sys; sys.exit(0 if '$K' in json.load(open('zones.json')) else 1)" 2>/dev/null; then
  $PY $S/plategrid.py plates $K plates/$K-grid.png 2>/dev/null
  echo "STOP: add a \"$K\" entry to $WORK/zones.json (zone above the chair + prop boxes) using plates/$K-grid.png, then re-run."; exit 2
fi
if [ ! -f $K-plate.png ]; then
  Z=$($PY -c "import json;print(' '.join(map(str,json.load(open('zones.json'))['$K']['zone'])))")
  $PY $S/modeplate.py plates $K $Z 6 2>/dev/null | sed 's/^/mode plate /'
  $PY $S/propplate.py plates $K 2>/dev/null | sed 's/^/prop plate /'
fi
bash $S/cardlayers.sh "$PROJ" $CARD_TIMES
$PY $S/cards.py "$PROJ" $K-sdr.mp4 $K-cam-base.json $K-clear.json $K-cards.json "EP.$EP" $K 2>/dev/null | tail -1
rm -rf "$PROJ/cards/boards"; $PY $S/boards.py "$PROJ" ep$EP 2>/dev/null | tail -1
$PY $S/keytest.py $K "$PROJ" "$PROJ/cards/keytest.jpg" 2>/dev/null
log "cards ready: $PROJ/cards/overview.jpg + boards/ + keytest.jpg (check the key: green = removed)"
