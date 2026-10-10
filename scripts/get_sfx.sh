#!/bin/bash
# Fills assets/template/sfx/ with the five cue sounds that mix.py expects, when they're missing (the public copy of
# this skill ships without audio: the original set came from licensed libraries). Uses HyperFrames media-use —
# whatever sound providers you have first, HyperFrames' bundled library as the fallback. To use your own sounds,
# drop short files with the same names in that folder instead.
# usage: get_sfx.sh [--force]      (--force re-fetches files that already exist)
OB=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
D=$OB/assets/template/sfx; mkdir -p "$D"
T=$(mktemp -d)
# file | cue (mix.py name) | intent | bundled-library fallback intent
while IFS='|' read -r f cue intent fb; do
  if [ -s "$D/$f" ] && [ "${1:-}" != "--force" ]; then echo "have $f ($cue)"; continue; fi
  for try in "any:$intent" "bundled.sfx:$fb"; do
    prov=${try%%:*}; q=${try#*:}
    args=(); [ "$prov" = any ] || args=(--provider "$prov")
    out=$(cd "$T" && npx -y hyperframes@0.8.134 media-use resolve --type sfx --intent "$q" "${args[@]}" --json --project . 2>/dev/null | tail -1)
    p=$(python3 -c "import json,sys; j=json.loads(sys.argv[1]); print(j['path'] if j.get('ok') else '')" "$out" 2>/dev/null)
    if [ -n "$p" ] && [ -s "$T/$p" ]; then cp "$T/$p" "$D/$f"; echo "got  $f ($cue) <- \"$q\" [$prov]"; break; fi
  done
  [ -s "$D/$f" ] || echo "MISSING $f ($cue): drop any short '$intent' sound there"
done <<'EOF'
sfx_003.mp3|whoosh|short whoosh swipe|short whoosh swipe
sfx_002.mp3|pop|soft pop|soft pop
sfx_004.mp3|impact|bass impact hit|bass impact hit
sfx_005.mp3|thud|heavy box close thud|bass impact hit
sfx_007.mp3|tick|typewriter tick|tick click
EOF
rm -rf "$T"
