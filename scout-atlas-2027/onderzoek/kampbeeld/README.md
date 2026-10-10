# Kampbeeld

Opdrachten voor de top 3 uit de consensusdata (2026-10-10): 1. Noorwegen (NO), 2. Zwitserland (CH), 3. Spanje (ES).
Per land draait één Sonnet-agent `opdracht-<iso2>.md`; het resultaat is `../bron/kampbeeld/<iso2>.json` plus foto's in `../bron/foto/`.
Controle: `node valideer-kampbeeld.mjs <iso2>`. Het bouwscript `bron/bouw.mjs` bakt de JSON en de foto's in de film en de verkenner.
