# Scout Atlas 2027: de film (versie 2)

Een geanimeerde film van 100 seconden (16:9, met geluid) over de keuze van het buitenlandse kamp, zomer 2027.
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

## Wat er veranderd is tegenover versie 1

- **Heel Europa doet mee: 42 landen**, niets extra, niets minder. Erbij: Nederland, Luxemburg, Verenigd Koninkrijk,
  Ierland, IJsland, Denemarken, Noorwegen, Zweden, Finland, Estland, Letland, Litouwen, Cyprus, Malta, Andorra,
  Liechtenstein, San Marino, Moldavië, Oekraïne, Belarus, Rusland, Armenië en Azerbeidzjan. Eruit: Canada (geen Europa).
- **Op vraag van de groep uit de lijst:** Slovenië, Polen, Hongarije, Roemenië en Albanië. Vaticaanstad en Monaco
  staan er niet in: daar kan geen tentenkamp (0,44 en 2 km²). België is thuis.
- **Alle scores zijn opnieuw berekend.** De oude scores (alles tussen 84 en 91) waren te vlak om iets te kiezen.
  Nu komt elke score uit **39 feiten per land** (prijspeil, reisadvies, vredesindex, verkeersdoden, bosbedekking,
  juli-temperatuur, scouts per 1.000 inwoners, ...). De eindscores lopen van 51 tot 75. Zie `BRONNEN.md`.
- **164 vragen in plaats van 188:** dubbels samengevoegd (Eten stond er twee keer in, Hitte drie keer),
  vage vragen geschrapt, en enkele nieuwe toegevoegd (roamingkosten, bosbrandverbod, tekenencefalitis).
  De gewichten per categorie zijn de prioriteiten van de groep en zijn **niet** veranderd.
- **Drie landen vallen af vóór de race:** Rusland, Oekraïne en Belarus. De FOD Buitenlandse Zaken raadt alle
  reizen af. Ze staan wel op de kaart en krijgen een score, maar doen niet mee.
- **Nieuwe scène "Het speelveld":** alle landen op één veld, kostprijs tegen avontuur. Je ziet in één oogopslag
  waarom "goedkoop en wild" (Montenegro, Georgië) en "spectaculair maar duur" (Zwitserland, IJsland) het niet halen.
- **Eerlijker slot:** de film toont zelf welke 15 feiten hard zijn, welke 17 afgeleid, en welke 7 een inschatting.

## Verhaal

| Tijd | Scène | Licht | Wat je ziet |
|---|---|---|---|
| 0–8 s | De vraag | nacht → dag | 3D-wereldbol, de zon komt op boven Europa |
| 8–21 s | De weging | dag | 164 vragen worden een rugzak: het zwaarste zit onderaan |
| 21–34 s | De kandidaten | dag | 3D-diorama: 42 landen komen omhoog, drie vallen af, de top 10 springt eruit |
| 34–56 s | De race | nacht | top 10, categorie per categorie, zwaarste eerst |
| 56–69 s | Het speelveld | dag | alle landen: kostprijs tegen avontuur, stipgrootte = eindscore |
| 69–81 s | Het podium | dag | 3D-podium met confetti, en de plaatsen 4 tot 10 |
| 81–100 s | Eerlijk is eerlijk | nacht → dag | waar de cijfers vandaan komen, wat nog op tafel moet, de route naar de winnaar |

## Over de getallen

- Alle getallen en namen worden in het bestand zelf uit de JSON gelezen, niet overgetypt. De teksten in de film
  (wie leidt na welke categorie, wie valt terug, wie zit in welke hoek van het speelveld) worden ook uit de data
  afgeleid: verandert de data, dan verandert het verhaal mee.
- Er wordt niets afgerond. De enige opmaak: een Nederlandse komma, en eindscores en categoriescores krijgen
  minstens één decimaal (`75` wordt `75,0`, dezelfde waarde). Bij gelijke eindscores op één decimaal beslist
  de exacte waarde (`exact` in de JSON) over de volgorde.
- In de race zijn de balken de gewogen tussenstand na elke categorie, berekend uit de ruwe scores en gewichten.
  Na de laatste categorie gelden exact de eindscore en de volgorde uit de JSON.

## Bouwen (alleen nodig als je iets aanpast)

De bron staat in `bron/`:

```bash
cd bron
node bereken.mjs   # feiten.mjs + variabelen.mjs → scout-atlas-2027-data.json (en print de ranglijst)
node bouw.mjs      # data, kaart, lettertypes en three.js inbakken → ../index.html
```

- **Een feit aanpassen?** Open `bron/feiten.mjs`, pas het cijfer aan, draai de twee commando's. Klaar.
- **Een vraag of gewicht aanpassen?** `bron/variabelen.mjs`.
- `bron/kaart.mjs` maakt `kaart.json` opnieuw aan (vereist `npm i d3-geo topojson-client world-atlas@2`).

## Bronnen en licenties

- Cijfers en methode: zie `BRONNEN.md`.
- Kaartdata: Natural Earth (publiek domein), via `world-atlas`.
- 3D: three.js r149 (MIT, zie `bron/vendor/three-LICENSE.txt`).
- Lettertypes: Big Shoulders Display, Fraunces, IBM Plex Mono (SIL Open Font License).
- Muziek en geluidseffecten: zelf opgewekt in het bestand (Web Audio en een kleine synthesizer in JavaScript).
  Er zit geen stockmateriaal in.
