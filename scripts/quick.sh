#!/bin/bash
# Phase 2 helper — a fast look at the graphics alone: no footage, no chroma key, no plates.
# Snapshots every layer (behind + front + captions) on a mid-grey ground, plus a contact sheet.
# Use it while authoring parts/body.html + parts/script.js to check layout, wraps and what is visible at a
# given second (~1 min for a dozen frames). The cards from cards.sh are still what the creator approves.
# usage: quick.sh <episode.env> [comma-times]         default times: the card times in <key>-cards.json
#        quick.sh --proj <project-dir> <comma-times>  snapshot the project's index.html as it is (no assemble)
set -u
if [ "${1:-}" = "--proj" ]; then
  P=$(cd "${2:?project dir}" && pwd); T=${3:?comma-separated times}
else
  source "$(dirname "$0")/_env.sh" "$1"
  P=$PROJ
  T=${2:-$($PY -c "import json;print(','.join(str(c['t']) for c in json.load(open('$K-cards.json'))))")}
  $PY $S/assemble.py "$PROJ" $TRANSCRIPT $DUR $TILE0 $TILE1 "$KEYWORDS" ${FIXES:-} 2>/dev/null
fi
O=$P/cards/quick
rm -rf "$O"; mkdir -p "$O/proj"
ln -s "$P/fonts" "$O/proj/fonts"; ln -s "$P/media" "$O/proj/media"
python3 - "$P/index.html" "$O/proj/index.html" <<'PY'
import sys
s = open(sys.argv[1]).read()
open(sys.argv[2], "w").write(s.replace("</style>", "html,body,#root{background:#2a2b30!important} #grain{display:none!important}\n</style>", 1))
PY
(cd "$O/proj" && npx hyperframes@0.8.134 snapshot . --at "$T" --no-end --describe false --timeout 60000 -o "$O/frames" > "$O/snap.log" 2>&1) \
  || { tail -5 "$O/snap.log"; exit 1; }
rm -rf "$O/proj"
echo "quick preview: $(ls "$O"/frames/frame-*.png 2>/dev/null | wc -l | tr -d ' ') frames -> $(ls "$O"/frames/contact-sheet*.jpg | tr '\n' ' ')"
