#!/bin/bash
# Footage prep for a batch: HDR iPhone HEVC -> SDR h264 (the whole pipeline works in SDR) + word-level transcript.
# usage: prep.sh <work_dir> <key>=<footage.mp4> [<key>=<footage.mp4> ...]
#   writes <work>/<key>-sdr.mp4, <key>.wav, <key>.transcript.json
set -u
W=$1; shift; mkdir -p $W; cd $W
sdr() { ffmpeg -v error -y -hwaccel videotoolbox -hwaccel_output_format videotoolbox_vld -i "$1" \
  -vf "scale_vt=color_matrix=bt709:color_primaries=bt709:color_transfer=bt709,hwdownload,format=p010le,format=yuv420p" \
  -c:v libx264 -crf 14 -preset medium -g 15 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 256k -movflags +faststart "$2"; }
for kv in "$@"; do
  k=${kv%%=*}; f=${kv#*=}
  ffmpeg -v error -y -i "$f" -ac 1 -ar 16000 $k.wav
  mkdir -p tr_$k && (cd tr_$k && npx --yes hyperframes@0.8.134 transcribe ../$k.wav --json > ../$k.transcribe.log 2>&1 < /dev/null)
  mv tr_$k/transcript.json $k.transcript.json 2>/dev/null || mv transcript.json $k.transcript.json 2>/dev/null; rmdir tr_$k 2>/dev/null
  [ -s $k.transcript.json ] && echo "$k transcript ok" || echo "$k transcript FAILED (see $k.transcribe.log; just re-run, first model load sometimes cancels)"
  # SDR conversion (non-HDR sources are simply re-encoded)
  sdr "$f" $k-sdr.mp4 2>/dev/null || ffmpeg -v error -y -i "$f" -c:v libx264 -crf 14 -preset medium -g 15 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart $k-sdr.mp4
  [ -s $k-sdr.mp4 ] && echo "$k sdr ok"
done
