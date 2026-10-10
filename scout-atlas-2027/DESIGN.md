# Scout Atlas 2027 · versie 3 — ontwerp van de film

*Werkdocument, 10 oktober 2026. Alles hieronder is de bedoeling; de film zelf is de waarheid.*

## Waar deze versie vandaan komt

| Versie | Wat het was | Wat we meenemen | Wat we loslaten |
|---|---|---|---|
| Film 1 (PR 1) | 88 s, 25 landen, 188 vragen, Slovenië wint | zonsopgang op de bol, diorama met oprijzende landen, podium, route | te klein lettertype, te snel |
| Film 2 (PR 3, "v3") | 2:20, 24 landen, Portugal wint | **leesbaarheid** (grote tekst, lange leestijd, hoog contrast, geen kleine labels), draaiende 3D-rugzak, kubuslandschap, startscherm en afspeelbalk, **verkenner na de film**, geen stem, datacontrole | de 188 vragen zonder meters |
| Film 3 (PR 5, "v2") | 100 s, 42 landen, Noorwegen wint | 39 feiten met bron en zekerheid, speelveld kost × avontuur, uitschakelbeat (reisadvies), eerlijk slot | te kort, scores uit één onderzoeksronde |

Drie keer een andere winnaar. Daarom is deze versie eerst een **dataproject** en pas dan een film: één meetmodel met een meter per variabele, tien onafhankelijke onderzoeksrondes, en de waarde die het vaakst voorkomt wint (zie `onderzoek/`).

## Wat de film moet doen

1. De groep laten **voelen** waarom het winnende land wint, in minder dan drie minuten.
2. Elk getal in beeld komt uit `bron/scout-atlas-2027-data.json`; elke zin over de uitkomst wordt uit de data afgeleid.
3. Leesbaar op een laptop in een lokaal: geen tekst kleiner dan 24 px (op 1920×1080), hoofdtekst 30–36 px, koppen 64–110 px, elk tekstblok minstens 3 s in beeld, nooit meer dan twee tekstblokken tegelijk.
4. Meer 3D dan vorige versies, maar 3D in dienst van de data (hoogte = score, afstand = verschil), nooit decoratie alleen.
5. Na de film opent de verkenner: alle data, elke bron, de spreiding over de tien rondes.

## Het verhaal (tempo 120, 1 tel = 0,5 s; tijden ±)

| # | Tijd | Hoofdstuk | Licht | Wat je ziet | 3D |
|---|---|---|---|---|---|
| 1 | 0:00–0:16 | **Het kamp** | nacht → dag | We beginnen bij één tent met een kampvuur op een heuvel. De camera trekt terug: de heuvel is België, op de wereldbol. De zon komt op boven Europa. "Zomer 2027. Eén kamp. Welk land?" Dan duiken we Europa in. | bol met tent, vuurlicht, zonsopgang |
| 2 | 0:16–0:44 | **De weging** | dag | Drie beats. (a) *Wat telt:* de rugzak met drie vakken: onderaan het zwaarst (kostprijs en avontuur, 50 %), dan kamperen (22 %), bovenaan de rest (28 %). De vragen vliegen als tegels in hun vak. (b) *Hoe we meten:* drie meetlatten: ruwe waarde → score, met de bron erbij. (c) *Tien keer gemeten:* tien kleine ranglijsten schuiven in beeld en vallen samen tot één; "de waarde die het vaakst voorkomt telt". | draaiende rugzak met drie vakken |
| 3 | 0:44–1:00 | **De kandidaten** | dag | Diorama van Europa; 42 landen rijzen op. Drie zakken terug in het bord en kleuren grijs: alle reizen afgeraden. De top 10 springt eruit. | diorama (behouden, beter licht en camera) |
| 4 | 1:00–1:18 | **Het landschap** | nacht | Alle scores als een veld van kubussen: rij = land, kolom = variabele, hoogte = score, goud = 100. Daarna gesorteerd op eindscore. | kubusveld |
| 5 | 1:18–1:46 | **De race** | nacht | Top 10, categorie per categorie, zwaarste eerst. Tussenstand en volgorde kloppen met elkaar (les uit v3). De teksten (wie leidt, wie zakt) komen uit de data. | — (2D, groot) |
| 6 | 1:46–2:04 | **De ruimte** | dag | Een 3D-ruimte met drie assen: kostprijs, avontuur, kamperen. Elk land is een bol, grootte = eindscore. De camera draait; de winnaar zit in de goede hoek. Dan kijkt de camera recht van voren: kost × avontuur, met de kwadranten "goedkoop en wild", "spectaculair maar duur". | 3D-puntenwolk |
| 7 | 2:04–2:20 | **Het podium** | dag | 3D-podium, top 3 met eindscore en hun sterkste en zwakste categorie; confetti; "won X van 10 rondes"; plaatsen 4–10 ernaast. | podium |
| 8 | 2:20–2:45 | **De bestemming** | gouden uur | Route van België naar de winnaar over het diorama; de tent staat op. "Nu begint het echte plannen": kampplaats, vervoer, budget, reisadvies vlak voor vertrek. Aftiteling met de cijfers van het onderzoek. Daarna opent de verkenner. | diorama + route |

## Beeldtaal

- **Atlas en expeditie**, zoals de vorige versies: atlaspapier (`#efe7d4`) overdag, diepe nacht (`#071519`) 's nachts, mint (`#7cf0c4` / `#0e7a5f`) voor "goed", goud (`#f2c374` / `#e3bd52`) voor "nummer één / perfect", koraal (`#ff8b66` / `#c63f20`) voor "let op".
- Lettertypes: Big Shoulders Display (koppen), Fraunces italic (zinnen), IBM Plex Mono (cijfers en labels). Allemaal ingebakken.
- Ritme licht/donker: dag voor uitleg en overzicht, nacht voor data-dichte scènes (landschap, race).
- 3D: zachte schaduwen, filmische toonmapping, lichte mist voor diepte, rustige camerabewegingen (nooit sneller dan de lezer).
- Achtergrond: hoogtelijnen die langzaam schuiven; sterren 's nachts; kader met hoeken, merknaam en hoofdstukspoor.

## Wat uit de data komt (en dus nooit "vast" in de film staat)

- namen, eindscores, categoriescores, tierscores, rangen, aantal landen, aantal variabelen, aantal rondes
- wie leidt na welke categorie in de race, wie het meest zakt of stijgt
- welke landen in welk kwadrant van de ruimte zitten
- hoeveel rondes de winnaar won; de spreiding (min–max rang) van de top 3
- de drie voorbeeld-meters in hoofdstuk 2 (de zwaarste variabele van elke tier)

## De verkenner (versie 3)

Opent na de film (of met D). Tabbladen:

1. **Ranglijst**: alle landen met eindscore, de drie tierscores, de categoriescores, de rangen over de tien rondes (als stipjes) en "gewonnen rondes". Sorteerbaar.
2. **Kaart van alle scores**: landen × variabelen, gegroepeerd per tier en categorie; zoomen, slepen; klik op een cel → de vraag, de meter, de ruwe waarde met eenheid, de bron (klikbaar), de score, de waarden van de tien rondes en de spreiding.
3. **Speel met de gewichten**: schuiven per categorie én per tier; de ranglijst herschikt live.
4. **Tien rondes**: per ronde de winnaar en top 5; per land de rangverdeling.
5. **Bronnen**: alle gebruikte bronnen met het aantal cellen; de zekerheid per variabele.
6. **CSV**: alles downloaden (puntkomma's, Belgisch Excel).

## Bouw

`bron/js/*.js` (één bestand per onderdeel, op volgorde van naam) → `bron/bouw.mjs` bakt data, kaart, lettertypes, three.js en de verkenner in één `index.html`. Muziek: eigen synthesizer in JavaScript, partituur getimed op de hoofdstukken.

## Controle (voor het "klaar" is)

- Playwright speelt de film van begin tot eind in Chromium; schermafbeeldingen per hoofdstuk.
- Onafhankelijke herberekening van alle getallen in beeld uit de ruwe feiten en gewichten (zoals `controle.mjs` in v3).
- Elke zin die iets over de uitkomst zegt wordt gecontroleerd tegen de data.
