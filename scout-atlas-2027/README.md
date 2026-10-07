# Scout Atlas 2027: de film

Een film van 2 minuten 20 (16:9, met muziek) over de keuze van het buitenlandse kamp, zomer 2027.
Na de film opent vanzelf de **verkenner**: alle data, die je kunt verschuiven en waarop je kunt inzoomen.

**Openen:** dubbelklik `index.html`. Het is één bestand en werkt ook zonder internet. Zet je geluid aan.

| Toets | Wat |
|---|---|
| spatie | afspelen / pauzeren |
| ← → | 10 seconden terug / vooruit |
| R | opnieuw vanaf het begin |
| M | geluid aan / uit |
| D | naar de data (verkenner) |
| F | volledig scherm |
| H | bediening verbergen (voor een schone schermopname) |
| Esc | terug van de verkenner naar de film |

De bediening en de muiscursor verdwijnen vanzelf tijdens het afspelen. De tijdlijn onderaan is per hoofdstuk opgedeeld:
beweeg erover om de hoofdstuknaam te zien, klik of sleep om te springen.

## Het verhaal

Elke tekst blijft lang genoeg staan om hem rustig te lezen, en alle tekst is groot genoeg voor een laptopscherm.
Alles valt op de tel van de muziek (120 BPM: 1 tel = 0,5 s).

| Tijd | Hoofdstuk | Wat je ziet |
|---|---|---|
| 0:00 | De vraag | zonsopgang boven de bol, "Eén kamp. 24 landen. Welk wordt het?" |
| 0:12 | De weging | 188 vragen als tegels, hun gewicht, en daarna de **draaiende 3D-rugzak**: 14 lagen, de zwaarste categorie onderaan |
| 0:38 | De kandidaten | een 3D-kaart van Europa waarop de 24 landen oprijzen; de top 10 springt eruit |
| 0:50 | Het landschap | alle 4.512 scores als een veld van kubussen (hoogte = score, goud = 100), daarna op eindscore gesorteerd |
| 1:06 | De race | de top 10, categorie per categorie (zwaarste eerst), tot de eindstand |
| 1:34 | Het vergelijk | de top 10 naast elkaar in 14 categorieën, met de beste en zwakste per categorie |
| 1:54 | Het podium | een 3D-podium met de top 3 |
| 2:08 | De bestemming | de route van België naar de winnaar |

Daarna opent de verkenner.

## De verkenner (alle data)

- **Kaart van alle scores**: 24 landen × 188 vragen, gegroepeerd per categorie (zwaarste eerst). Slepen = bewegen, scrollen of knijpen = zoomen,
  dubbelklik = inzoomen. Ingezoomd zie je elk getal. Klik op een land voor zijn profiel, op een vraag om de landen erop te sorteren,
  op een categorie om ze open of dicht te klappen. Minikaart rechtsonder; toetsen ←↑→↓, + −, 0.
- **Ranglijst**: alle landen met eindscore en de 14 categoriescores, sorteerbaar.
- **Speel met de gewichten**: schuif per categorie (0–300 %) en zie de ranglijst meteen herschikken.
- **CSV**: download alle data (puntkomma's en komma's, opent zo in Excel).

## Over de getallen

- Alles wordt in het bestand zelf berekend uit de **ruwe scores en gewichten** in de JSON. Niets is overgetypt.
- **Correcties** (volledig in [`DATACONTROLE.md`](DATACONTROLE.md)):
  - Eindscores staan met **2 decimalen** en de volgorde volgt de exacte waarde. In de JSON hadden Oostenrijk en Polen allebei 89,1,
    en Montenegro, Frankrijk en Hongarije allebei 88,0. Exact staat **Polen (89,12) vóór Oostenrijk (89,06)** en **Frankrijk (88,03) vóór Montenegro (88,01)**.
  - Categoriescores zijn **gewogen** (zoals de eindscore). In de JSON waren ze ongewogen. Verschil: hoogstens 0,4 punt.
  - In de race staat bij elk land dezelfde tussenstand als waarop de rijen zijn gesorteerd (het gewogen gemiddelde van de categorieën tot dan toe),
    met de score in de nieuwe categorie ernaast. Zo hoort elk getal bij de balk en de rij waar het naast staat.
- `data/scout-atlas-2027-gecorrigeerd.json` is de data met deze correcties (de originele JSON blijft ongewijzigd in `bron/`).
- Hoogtes van zuilen, kubussen en blokken zijn visuele weergaven; het getal staat er altijd bij.
- Alle teksten die iets over de uitkomst zeggen (wie vooraan staat, wie het meest zakt, wat de laagste score is) worden uit de data afgeleid.
  Verandert de data, dan verandert de tekst mee.

## Bouwen (alleen nodig als je iets aanpast)

```bash
cd bron
node controle.mjs   # controleert de data, schrijft DATACONTROLE.md en de gecorrigeerde JSON
node bouw.mjs       # bakt alles (data, kaart, lettertypes, three.js) in ../index.html
```

De film zit in `bron/js/` (één bestand per onderdeel, op volgorde van de bestandsnaam), de verkenner in `bron/js/95-verkenner.js`,
`bron/verkenner.html` en `bron/verkenner.css`. De kaart is gemaakt met `bron/kaart.mjs`.
Testhaakjes in de adresbalk: `?t=95` (spring naar 95 s), `?clean` (zonder bediening), `?nosound`, `?data` (meteen de verkenner),
`?q=0.6` (lagere 3D-kwaliteit voor trage computers).

## Inspiratie

Drie motion-designfilms die met Claude gemaakt zijn: een filmisch, geduldig verhaal (één zin per keer, kernwoorden in kleur, één doorlopend
"apparaat", traag → versnellend → stilte → flits) en twee showreels (kleurvlakken, cirkelwipes, kinetische typografie, 3D-kubusvelden,
HUD-kader). Daaruit komen het tempo, het kubuslandschap, de draaiende rugzak en het kader.

## Bronnen en licenties

- Kaartdata: Natural Earth (publiek domein), via `world-atlas`.
- 3D: three.js r149 (MIT, zie `bron/vendor/three-LICENSE.txt`).
- Lettertypes: Big Shoulders Display, Fraunces, IBM Plex Mono (SIL Open Font License).
- Muziek en geluidseffecten: zelf opgewekt in het bestand (een kleine synthesizer in JavaScript). Geen stockmateriaal, geen stem.
