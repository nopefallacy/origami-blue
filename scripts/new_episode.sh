#!/bin/bash
# Create an origami-blue HyperFrames project from the template.
# usage: new_episode.sh <project_dir> <name e.g. ep07-full>
set -eu
OB=$(cd "$(dirname "$0")/.." && pwd)
P=$1; NAME=$2
mkdir -p "$P"/parts "$P"/renders "$P"/cards
cp -n "$OB"/assets/template/hyperframes.json "$OB"/assets/template/passes.sh "$OB"/assets/template/composite.py "$P"/
cp -Rn "$OB"/assets/template/fonts "$OB"/assets/template/media "$OB"/assets/template/sfx "$P"/
[ -f "$P"/parts/body.html ] || cp "$OB"/assets/template/parts/body.template.html "$P"/parts/body.html
[ -f "$P"/parts/script.js ] || cp "$OB"/assets/template/parts/script.template.js "$P"/parts/script.js
[ -f "$P"/camera.cjs ] || cp "$OB"/assets/template/camera.template.cjs "$P"/camera.cjs
printf '{\n  "id": "%s",\n  "name": "%s",\n  "createdAt": "%s"\n}\n' "$NAME" "$NAME" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$P"/meta.json
printf '{\n  "name": "%s",\n  "private": true,\n  "type": "module",\n  "scripts": {\n    "dev": "npx --yes hyperframes@0.8.134 preview",\n    "check": "npx --yes hyperframes@0.8.134 check",\n    "render": "npx --yes hyperframes@0.8.134 render"\n  }\n}\n' "$NAME" > "$P"/package.json
echo "project ready: $P  (edit parts/body.html, parts/script.js, camera.cjs)"
