#!/usr/bin/env bash
# Alle rondes scoren, consensus berekenen, data controleren en de film bouwen.
# Gebruik: bash alles.sh    (vanuit onderzoek/)
set -e
cd "$(dirname "$0")"
for r in 1 2 3 4 5 6 7 8 9 10; do
  node merge-pakketten.mjs $r | head -3
  node scoor.mjs $r | sed -n 2,4p
done
node consensus.mjs
cd ../bron && node controle.mjs | tail -3 && node bouw.mjs
