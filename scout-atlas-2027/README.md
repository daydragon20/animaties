# Scout Atlas 2027: de film

Een film van 3½ minuut (16:9, met muziek) over de keuze van het buitenlandse kamp, zomer 2027.
Na de film opent vanzelf de **verkenner**: alle data, die je kunt verschuiven en waarop je kunt inzoomen.

**Openen:** dubbelklik `index.html`. Het is één bestand en werkt ook zonder internet. Zet je geluid aan.

| Toets | Wat |
|---|---|
| spatie | afspelen / pauzeren |
| ← → | 10 seconden terug / vooruit |
| R | opnieuw vanaf het begin |
| M | geluid aan / uit |
| V | stem aan / uit (als de stem is ingebakken) |
| D | naar de data (verkenner) |
| F | volledig scherm |
| H | bediening verbergen (voor een schone schermopname) |
| Esc | terug van de verkenner naar de film |

De bediening en de muiscursor verdwijnen vanzelf tijdens het afspelen. De tijdlijn onderaan is per hoofdstuk opgedeeld:
beweeg erover om de hoofdstuknaam te zien, klik of sleep om te springen.

## Het verhaal

Gebouwd op een spanningsboog, niet op snelheid: één gedachte per keer, eerst traag, dan versnellend, stilte vóór de winnaar, een rustig slot.
Alles valt op de tel van de muziek (80 BPM: 1 tel = 0,75 s).

| Tijd | Hoofdstuk | Wat je ziet |
|---|---|---|
| 0:00 | De vraag | zwart, drie zinnen; dan de zonsopgang boven de aarde, de titel, en de 25 kandidaten die oplichten op de bol |
| 0:27 | De meetlat | een draaiende rol met alle 188 vragen, een bol van 4.700 lichtpunten (één per score), en de **3D-rugzak die blijft draaien**: 14 lagen, de zwaarste categorie onderaan |
| 1:06 | Het landschap | alle 4.700 scores als een veld van kubussen (hoogte = score, goud = 100); de 25 landen schuiven in de volgorde van de eindstand |
| 1:24 | De afvaltocht | 25 → 1 op een 3D-kaart van Europa: eerst traag, dan sneller; "nog tien over"; de top 10 met sterkste en zwakste categorie; een podium met spots; stilte; de witte flits |
| 2:43 | Waarom Slovenië | de winnaar wint géén enkele categorie, maar zakt ook nergens diep weg (bereik per land van zwakste tot sterkste categorie) |
| 3:04 | Eerlijk is eerlijk | versie 1, wat nog uitgezocht moet worden, de route van België naar de winnaar bij zonsopgang, de eindtitel |

Daarna opent de verkenner.

## De verkenner (alle data)

- **Kaart van alle scores**: 25 landen × 188 vragen, gegroepeerd per categorie (zwaarste eerst). Slepen = bewegen, scrollen of knijpen = zoomen,
  dubbelklik = inzoomen. Ingezoomd zie je elk getal. Klik op een land voor zijn profiel, op een vraag om de landen erop te sorteren,
  op een categorie om ze open of dicht te klappen. Minikaart rechtsonder; toetsen ←↑→↓, + −, 0.
- **Ranglijst**: alle landen met eindscore en de 14 categoriescores, sorteerbaar.
- **Speel met de gewichten**: schuif per categorie (0–300 %) en zie de ranglijst meteen herschikken.
- **CSV**: download alle data (puntkomma's en komma's, opent zo in Excel).

## De stem (Fish Audio)

De film werkt zonder stem: de belangrijkste woorden staan in beeld. Met een stem wordt het episch. Zo maak je hem met je eigen Fish Audio-account:

1. Maak een API-sleutel op [fish.audio](https://fish.audio) (Developers → API keys).
2. Maak het bestand `bron/.env` met daarin:
   ```
   FISH_API_KEY=jouw_sleutel
   ```
   Optioneel: `FISH_VOICE_ID=...` voor een andere stem (standaard: "Rustige Nederlandse Stem"; andere ideeën staan bovenaan `bron/stem.mjs`,
   zoals een Vlaamse vertelstem of je eigen gekloonde stem). `.env` wordt nooit mee geüpload.
3. In de map `bron`:
   ```bash
   node stem.mjs --toon   # bekijk eerst de 24 zinnen (geen sleutel nodig)
   node stem.mjs          # maakt stem/v01.mp3 … v24.mp3
   node bouw.mjs          # bakt de stem in index.html
   ```

**Draait Fish Audio/Fish Speech lokaal op je pc?** Zet dan in `bron/.env` in plaats van de sleutel: `FISH_URL=http://127.0.0.1:<poort>` (de poort van je server; een sleutel is alleen nodig als je server er een eist). Zonder `FISH_VOICE_ID` gebruikt de server zijn standaardstem.

De zinnen staan in `bron/stem/teksten.json`, met aanwijzingen voor Fish Audio zoals `[whispering]` en `[break]`.
Getallen en de naam van de winnaar worden uit de data ingevuld. Is een zin te lang voor zijn moment, dan zegt het script welke `snelheid` je moet zetten.
De muziek wordt automatisch zachter zolang de stem spreekt.

## Over de getallen

- Alles wordt in het bestand zelf berekend uit de **ruwe scores en gewichten** in de JSON. Niets is overgetypt.
- **Correcties** (volledig in [`DATACONTROLE.md`](DATACONTROLE.md)):
  - Eindscores staan met **2 decimalen** en de volgorde volgt de exacte waarde. In de JSON hadden Oostenrijk en Polen allebei 89,1,
    en Montenegro, Frankrijk en Hongarije allebei 88,0. Exact staat **Polen (89,12) vóór Oostenrijk (89,06)** en **Frankrijk (88,03) vóór Montenegro (88,01)**.
  - Categoriescores zijn **gewogen** (zoals de eindscore). In de JSON waren ze ongewogen. Verschil: hoogstens 0,4 punt.
  - De fout uit de vorige versie ("Griekenland 87 onderaan") kwam doordat de rijen op een onzichtbare tussenstand gesorteerd stonden,
    terwijl het getal ernaast de categoriescore was. In deze versie hoort elk getal bij de balk of de rij waar het naast staat.
- `data/scout-atlas-2027-gecorrigeerd.json` is de data met deze correcties (de originele JSON blijft ongewijzigd in `bron/`).
- Hoogtes van zuilen, kubussen en blokken zijn visuele weergaven; het getal staat er altijd bij.

## Bouwen (alleen nodig als je iets aanpast)

```bash
cd bron
node controle.mjs   # controleert de data, schrijft DATACONTROLE.md en de gecorrigeerde JSON
node bouw.mjs       # bakt alles (data, kaart, lettertypes, three.js, stem) in ../index.html
```

De film zit in `bron/js/` (één bestand per hoofdstuk), de verkenner in `bron/js/95-verkenner.js`, `bron/verkenner.html` en `bron/verkenner.css`.
Testhaakjes in de adresbalk: `?t=95` (spring naar 95 s), `?clean` (zonder bediening), `?nosound`, `?data` (meteen de verkenner), `?q=0.6` (lagere 3D-kwaliteit voor trage computers), `?nograin` (zonder filmkorrel; handig voor een kleinere video-export).

## Inspiratie

Drie motion-designfilms die met Claude gemaakt zijn: een filmisch, geduldig verhaal (één zin per keer, cursieve kernwoorden in goud, één doorlopend
"apparaat", traag → versnellend → stilte → flits → zonsopgang) en twee showreels (kleurvlakken, cirkelwipes, kinetische typografie, 3D-kubusvelden,
HUD-kader met tijdcode). Daaruit komen het tempo, de hoofdstukkaarten, het kubuslandschap en het HUD-kader.

## Bronnen en licenties

- Kaartdata: Natural Earth (publiek domein), via `world-atlas`.
- 3D: three.js r149 (MIT, zie `bron/vendor/three-LICENSE.txt`).
- Lettertypes: Big Shoulders Display, Fraunces, IBM Plex Mono (SIL Open Font License).
- Muziek en geluidseffecten: zelf opgewekt in het bestand (een kleine synthesizer in JavaScript). Geen stockmateriaal.
- Stem (optioneel): Fish Audio, met je eigen account.
