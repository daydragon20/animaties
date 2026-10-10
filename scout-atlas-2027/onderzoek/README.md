# Het onderzoek achter Scout Atlas 2027 (versie 3)

Drie eerdere versies gaven drie verschillende winnaars. Daarom is de data in deze versie het product van een vast meetmodel en
**tien onafhankelijke onderzoeksrondes**. Alles in deze map is reproduceerbaar met Node (geen pakketten nodig).

## Het model (`model/`)

- `model.json`: 42 landen, 3 tiers, de categorieën en de variabelen. Elke variabele heeft een **meter**: wat precies gemeten wordt,
  in welke eenheid, welke bronnen (in volgorde van voorkeur), wat te doen als een land ontbreekt, en een vaste **schaal** naar 0–100
  (ankers, rubriek of logschaal). De schalen zijn absoluut: een score hangt niet af van welke landen meedoen.
- `MODEL.md`: de uitleg en de keuzes, geschreven door de ontwerpagent (Sonnet).
- Tiers: **tier 1** kostprijs en avontuur (50 %), **tier 2** kamperen (22 %), **tier 3** de rest (28 %). Geen variabele onder 1,2 %.
- `node valideer-model.mjs` controleert de structuur en de gewichten.

## Eén ronde (`rondes/rNN/`)

```bash
node opdrachten.mjs 3          # schrijft opdracht-pXX.md (één per pakket) en opdracht-scoren.md, plus variant.json
# → per pakket een Haiku-agent die opdracht-pXX.md uitvoert en pakket-pXX.json schrijft
node valideer-pakket.mjs rondes/r03/pakket-p01.json
# → één Sonnet-agent die opdracht-scoren.md uitvoert:
node merge-pakketten.mjs 3     # pakketten → feiten.json
node scoor.mjs 3               # feiten.json + variant.json → scores.json (en de ranglijst op het scherm)
```

- **Pakketten** groeperen variabelen per bronfamilie, zodat één agent met één tabel 30+ landen tegelijk kan invullen.
- **Onafhankelijkheid**: elke ronde zoekt opnieuw; oneven rondes beginnen bij de eerste voorziene bron, even rondes bij de tweede.
  Agents kijken niet in andere ronde-mappen.
- **Gewichtsvariant**: ronde 1 gebruikt de basisgewichten; vanaf ronde 2 krijgt elke variabele een factor ×0,8–1,2 (vast zaad per ronde),
  waarna de tier-aandelen exact hersteld worden. Zo hangt de uitkomst niet aan één gewichtskeuze.
- De **scorer** (Sonnet) controleert eenheden en uitschieters, vult gaten volgens de regel van de meter, laat de scores berekenen en
  schrijft `verslag.md`. Scores worden nooit met de hand gezet.

## De consensus

```bash
node consensus.mjs             # alle volledige rondes → ../bron/scout-atlas-2027-data.json + CONSENSUS.md
```

Per land en per variabele telt de ruwe waarde die **het vaakst voorkomt** (minstens 3 keer en minstens 30 % van de rondes, na afronding
op de precisie van de meter), anders de **mediaan**. Daaruit volgen met de basisgewichten de eindscores. Daarnaast telt het script per
land de rang in elke ronde (min, max, mediaan, aantal keer gewonnen) en de **modale winnaar**. De film toont beide: de consensusranglijst
en hoeveel rondes de winnaar won.

De film en de verkenner lezen uitsluitend `bron/scout-atlas-2027-data.json`; `bron/controle.mjs` herberekent daaruit onafhankelijk elke
score, categoriescore, eindscore en rang.

## Bestanden

| Bestand | Wat |
|---|---|
| `lib.mjs` | schalen, gewichten, scoren (gedeeld) |
| `valideer-model.mjs` | controle van `model/model.json` |
| `opdrachten.mjs` | schrijft de opdrachten van een ronde |
| `variant.mjs` | gewichtsvariant per ronde |
| `valideer-pakket.mjs` | controle van een pakketbestand |
| `merge-pakketten.mjs` | pakketten → `feiten.json` |
| `scoor.mjs` | `feiten.json` → `scores.json` |
| `consensus.mjs` | alle rondes → data-JSON van de film + `CONSENSUS.md` |
