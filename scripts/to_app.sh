#!/bin/bash
# Add a finished episode to the HyperFrames desktop app as the COMPLETE edit (footage + cut-out + graphics +
# captions + mixed audio), under a readable name. Makes a viewing copy next to the project so the pipeline's
# graphics-only index.html stays untouched (the app stamps editor ids into whatever it opens).
# usage: to_app.sh "<App Name, e.g. Business Ep 07 - Views vs Trust>" <proj_dir> <cam.json> <wins.json>
# needs <proj>/media/{base.mp4,subj-XX.webm,mix.m4a} (render.sh makes them).
set -eu
S=$(cd "$(dirname "$0")" && pwd)
NAME=$1; P=$(cd "$2" && pwd); CAM=$3; WINS=$4
PY=${PY:-python3}
D="$(dirname "$P")/studio/$NAME"
mkdir -p "$D"
cp "$P/index.html" "$D/index.html"; cp "$P/hyperframes.json" "$D/"
ln -sfn "$P/fonts" "$D/fonts"; ln -sfn "$P/media" "$D/media"
SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed -e 's/[^a-z0-9]\{1,\}/-/g' -e 's/^-//' -e 's/-$//')
printf '{\n  "id": "%s",\n  "name": "%s",\n  "createdAt": "%s"\n}\n' "$SLUG" "$NAME" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$D/meta.json"
printf '{\n  "name": "%s",\n  "private": true,\n  "type": "module"\n}\n' "$SLUG" > "$D/package.json"
$PY "$S/direct.py" "$D" "$CAM" "$WINS"
(cd "$D" && npx hyperframes@0.8.134 lint 2>&1 | tail -1)
npx hyperframes@0.8.134 open "$D" --json > /dev/null 2>&1 && echo "in the app as: $NAME"
