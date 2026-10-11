# Kampbeeld

Opdrachten voor de top 3 uit de consensusdata (2026-10-11): 1. Duitsland (DE), 2. Zweden (SE), 3. Frankrijk (FR).
Per land draait één Sonnet-agent `opdracht-<iso2>.md`; het resultaat is `../bron/kampbeeld/<iso2>.json` plus foto's in `../bron/foto/`.
Controle: `node valideer-kampbeeld.mjs <iso2>`. Het bouwscript `bron/bouw.mjs` bakt de JSON en de foto's in de film en de verkenner.
