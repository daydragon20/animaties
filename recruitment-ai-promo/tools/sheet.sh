#!/usr/bin/env bash
# Usage: tools/sheet.sh <dir> <out.png> [cols] — contactsheet met tijdstempel per frame
set -e
dir=$1; out=$2; cols=${3:-5}
files=($(ls "$dir"/t*.png | sort))
args=(); filt=""; i=0
for f in "${files[@]}"; do
  t=$(basename "$f" .png | sed 's/^t0*//; s/^\./0./')
  args+=(-i "$f")
  filt+="[$i]scale=480:270,drawtext=text='${t}s':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6[v$i];"
  i=$((i+1))
done
rows=$(( (i + cols - 1) / cols ))
layout=""; for ((k=0;k<i;k++)); do x=$(( (k % cols) * 480 )); y=$(( (k / cols) * 270 )); layout+="${x}_${y}|"; done
inputs=""; for ((k=0;k<i;k++)); do inputs+="[v$k]"; done
ffmpeg -v error -y "${args[@]}" -filter_complex "${filt}${inputs}xstack=inputs=$i:layout=${layout%|}:fill=black" "$out"
