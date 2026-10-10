# shared by cards.sh / render.sh: load episode.env and derive defaults
set -u
OB=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
S=$OB/scripts
[ -f "$1" ] || { echo "usage: $(basename $0) <episode.env>"; exit 1; }
source "$1"
PY=${PY:-python3}
TRANSCRIPT=${TRANSCRIPT:-$K.transcript.json}
TILE=${TILE:-"0 0"}
read TILE0 TILE1 <<< "$TILE"
cd "$WORK"
log() { echo "[$(date +%H:%M:%S)] $*"; }
[ -n "${N:-}" ] || N=$($PY -c "print(round($DUR*30))")
