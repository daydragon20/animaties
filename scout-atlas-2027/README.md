# Scout Atlas 2027: de film

Een geanimeerde film van 88 seconden (16:9, met geluid) over de keuze van het buitenlandse kamp, zomer 2027.
De film speelt zelf van begin tot eind en is gemaakt om te schermopnemen.

**Openen:** dubbelklik `index.html`. Het is één bestand en werkt ook zonder internet. Zet je geluid aan.

| Toets | Wat |
|---|---|
| spatie | afspelen / pauzeren |
| ← → | 5 seconden terug / vooruit |
| R | opnieuw vanaf het begin |
| M | geluid aan / uit |
| F | volledig scherm |
| H | bedieningsbalk verbergen (voor een schone opname) |

De balk en de muiscursor verdwijnen ook vanzelf tijdens het afspelen.

**Schermopname, zo doe je het:** open de film, druk op F, wacht tot onder de startknop "geluid klaar ♪" staat,
start je opname met systeemgeluid en druk dan op spatie.

## Verhaal

| Tijd | Scène | Licht | Wat je ziet |
|---|---|---|---|
| 0–8 s | De vraag | nacht → dag | 3D-wereldbol, de zon komt op boven Europa |
| 8–22 s | De weging | dag | 188 vragen worden een rugzak: het zwaarste zit onderaan |
| 22–30 s | De kandidaten | dag | 3D-diorama van Europa: 25 landen komen omhoog, de top 10 springt eruit |
| 30–52 s | De race | nacht | top 10, categorie per categorie, zwaarste eerst |
| 52–66 s | Het vergelijk | dag | top 10 × 14 categorieën: niemand is overal de beste |
| 66–76 s | Het podium | dag | 3D-podium met licht, schaduw en confetti |
| 76–88 s | Eerlijk is eerlijk | nacht → dag | dit is versie 1, wat nog uitgezocht moet, de route naar de winnaar |

## Over de getallen

- Alle getallen en namen worden in het bestand zelf uit de JSON gelezen, niet overgetypt.
- Er wordt niets afgerond. De enige opmaak: een Nederlandse komma, en eindscores en categoriescores krijgen
  minstens één decimaal (`90` wordt `90,0`, dezelfde waarde).
- In de race zijn de balken de gewogen tussenstand na elke categorie, berekend uit de ruwe scores en gewichten.
  Die tussenstanden staan niet als getal in beeld. Na de laatste categorie gelden exact de eindscore en de volgorde uit de JSON.
- De hoogte van de blokken (diorama, podium) en de lengte van de balken zijn visuele weergaven van JSON-waarden.
  Er staan geen asgetallen bij die niet in de JSON voorkomen.

## Bouwen (alleen nodig als je iets aanpast)

De bron staat in `bron/`. `bron/bouw.mjs` bakt data, kaart, lettertypes en three.js in tot `index.html`:

```bash
cd bron
node bouw.mjs
```

`bron/kaart.mjs` maakt `kaart.json` opnieuw aan (vereist `npm i d3-geo topojson-client world-atlas@2`).

## Bronnen en licenties

- Kaartdata: Natural Earth (publiek domein), via `world-atlas`.
- 3D: three.js r149 (MIT, zie `bron/vendor/three-LICENSE.txt`).
- Lettertypes: Big Shoulders Display, Fraunces, IBM Plex Mono (SIL Open Font License).
- Muziek en geluidseffecten: zelf opgewekt in het bestand (Web Audio en een kleine synthesizer in JavaScript).
  Er zit geen stockmateriaal in.
