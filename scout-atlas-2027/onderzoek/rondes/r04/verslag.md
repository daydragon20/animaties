# Verslag scoring · ronde 4

Model v3.0, gewichtsvariant `variant.json` (ronde 4, ongewijzigd), feiten uit 12 pakketten (`pakket-p01` t/m `p12`, even ronde: tweede bron eerst). Scores zijn uitsluitend berekend met `node scoor.mjs 4`; geen score is met de hand gezet.

**Uitkomst (rangschikking zonder UA, BY, RU):** 1 Duitsland 68,2 · 2 Zweden 67,4 · 3 Finland 66,8 · 4 Frankrijk 66,4 · 5 Noorwegen 66,2. De kop is een bundel van vijf landen binnen 2 punten: de verzameling {DE, SE, FI, FR, NO} blijft de top 5 in alle gevoeligheidsproeven hieronder, de volgorde binnen die vijf niet.

## (a) Top 10 en waarom

| # | Land | Score | Waarom (op basis van de feiten) |
|---|---|---|---|
| 1 | Duitsland | 68,2 | Hoge scores op bergen (Zugspitze 2.962 m), grotten (156, plafond), directe verbinding (nachttrein Berlijn) en goedkope reis (€121); veiligheid 85,6. Zwak op ruimte (239 inw/km²) en buitenlandgevoel (10); groepsterreinen 50. |
| 2 | Zweden | 67,4 | Kust (3.218 km), binnenwater (9 %), bos (68,6 %) en ruimte (26 inw/km²) tillen avontuur op 77; wildkamperen slechts 55 omdat Naturvårdsverket voor een grotere groep met meerdere tenten toestemming van de grondeigenaar vraagt. Duur vervoer en activiteiten. |
| 3 | Finland | 66,8 | Enige land met 100 op wildkamperen én kampvuur; binnenwater 10,2 % (100), ruimte (18 inw/km²), weer 90. Lage bergen (Halti 1.324 m), duur vervoer en activiteiten, groepsterreinen 25. |
| 4 | Frankrijk | 66,4 | Goedkoopste reis van de kopgroep (€49), Mont Blanc (100), kust 4.853 km, grotten 195, directe Eurostar; wild 55, groepsterreinen 25, weinig buitenlandgevoel. |
| 5 | Noorwegen | 66,2 | Kust 83.281 km, rivieren 1.049 mm, bergen 2.469 m, allemansrecht (100); structureel vuurverbod 15 april tot 15 september (50) en zeer duur vervoer (161,6). |
| 6 | Italië | 63,5 | Bergen, kust (7.600 km) en grotten (182) allemaal op het plafond; dure campingplaats (€41,21 → 3) en weinig ruimte drukken de score. |
| 7 | Verenigd Koninkrijk | 62,9 | Kust 12.429 km, Engels (100), Eurostar, wild 80 (Schotland 100, Engeland/Wales 55); lage bergen (Ben Nevis 1.345 m) en drukke bevolking (286 inw/km²). |
| 8 | Spanje | 62,9 | Mulhacén 3.479 m, kust 4.964 km, grotten 144 en als enige in de top 10 groepsterreinen 75; wildkamperen verboden (0) en Madrid 32,8 °C in juli. |
| 9 | Ierland | 61,1 | Engels (100), kampvuur 100 (na correctie), veilig (GPI 1,371), mild weer (20,1 °C, 58 mm), kust 1.448 km; lage bergen, weinig bos (12 %), groepsterreinen 25. |
| 10 | Tsjechië | 60,9 | Goedkoopste combinatie: kampplaats €20,15, voeding, vervoer (73,6) en reis (€145); geen kust (0), weinig water, groepsterreinen 50. |

Staart (alleen landen die meedoen): Cyprus 45,0 · Moldavië 45,8 · San Marino 46,1 · Malta 46,4 · Liechtenstein 49,5. Dat klopt met de verwachting: eilanden en mini-staten scoren laag op ruimte, bos, bergen en groepsterreinen. Knock-outs, niet in de rangschikking: Rusland 58,6, Oekraïne 53,5, Belarus 46,5.

Verrassingen die ik nagelopen heb: Turkije stond voor de correcties negende (61,4) door wildkamperen 80 en zakt nu naar 15e (58,7); Ierland stond 14e (59,0) door kampvuur 50 en staat nu 9e (61,1); Georgië (12e, 60,1) komt door wildkamperen 80, goedkope prijzen en bergen (Shkhara 5.203 m) maar heeft groepsterreinen 0 en veel onzekerheid. Geen van de overige verrassingen bleek een datafout.

## (b) Wat ik controleerde en corrigeerde

**Controle.** Alle datasetcellen zijn herberekend of vergeleken met de primaire bron, niet alleen gelezen: Eurostat prc_ppp_ind (A0101, A0109, A010703; 30 landen, API), Wereldbank (bevolkingsdichtheid, beschermd gebied, bos, UHC, verkeersdoden 2019, toerisme 2019, rivierafvoer; API), Numbeo 2026-mid (de 9 rechtstreekse voedingscijfers en alle controlegetallen in de opmerkingen), de Reisefroh-tabel (campingprijzen), OWID/GWIS (brand), de Wikipedia-tabellen voor kustlijn, % water, Global Peace Index, EF EPI en WOSM-leden, showcaves.com (Showcaves + Caves + Gorges voor 39 landen) en de Wikipedia-klimaattabellen van de 42 hoofdsteden. Alle 24 Numbeo-verhoudingsschattingen (kampplaats, activiteiten, vervoer) heb ik opnieuw uitgerekend en reproduceren exact. Resultaat: **geen eenheidsfouten (geen waarde die 10× afwijkt zonder reden), geen verwisselde landen, geen ongeldig rubrieklevel** (alle rubriekwaarden zijn een niveau uit de meter). De grote uitschieters (AD 107,7 en SM 54,9 toeristen per inwoner, MT 1.805 inw/km², NO 83.281 km kust) zijn echte bronwaarden die de schaal plafonneert.

**Correcties (8 cellen, elk met bron en de opmerking "gecorrigeerd door scorer: …" in `feiten.json`):**

| Cel | Was | Nu | Reden en bron |
|---|---|---|---|
| Zwitserland · vei_teken | 0,61 (laag) | 4,34 (midden) | Ontbrekend-regel gaf het gemiddelde van de buren, terwijl de meter het BAG als bron noemt en de agent zelf "waarschijnlijk te laag" schreef. BAG-gevallen 454/285/393 (2020-2022, MedUni Wien Virologie, tabel 1) gedeeld door de bevolking (Wereldbank) geeft 5,26/3,27/4,48 per 100.000. |
| Ierland · kamp_vuur | 50 | 100 | De opmerking van de agent zei zelf dat het verbod over begroeiing gaat en niet over kampvuur op een kampterrein. Wildlife Act 1976 s.40 zelf geopend: het gaat om het vernietigen van vegetatie op onbewerkt land; Larch Hill (scouts.ie) heeft kampvuurcirkels en vuurvaten. |
| Turkije · kamp_wild | 80 (laag) | 30 (laag) | 80 steunde op één zin uit Wikivoyage, terwijl de meter wet of officiële regeling vraagt en het referentiebestand dezelfde zin las en 30 voorstelde. CNN Türk: in de zomerse bosverbodsperiodes van de valiliks is kamperen in bos alleen toegestaan in nationale parken, natuurparken en vergunde campings, met boetes onder wet 6831. |
| Montenegro · cul_buitenland | 100 (laag) | 75 (laag) | Criterium B (dagelijks schrift niet Latijns) is "nee": Wikipedia zegt Latijns én Cyrillisch met een beweging naar enkel Latijns; de oriëntatie van de meter zet ME bij niveau 75. |
| Kosovo · vei_teken | null | 0,15 (laag) | Ontbrekend-regel: gemiddelde van ME 0,33, MK 0 en RS 0,13 (alle drie zelf schattingen). |
| Georgië, Armenië, Azerbeidzjan · vei_teken | null | 0 (laag) | Ontbrekend-regel: enige buurland met een waarde is TR (0). De schatting voor RU (6,3, gemiddelde van Noordse en Baltische landen) heb ik bewust niet gebruikt. Een cijfer voor de zuidelijke Kaukasus vond ik niet; 0 kan te optimistisch zijn. |

Niet gewijzigd maar wel beoordeeld: de afwijkingen van agents van het referentievoorstel bij kamp_wild en kamp_vuur (IS 55, SE 55, SK 0, ES 0, IT 55, DK 75, IS 75, SE 75, GB 75) staan elk met een bron in de opmerking en blijven staan; Zweden 55 steunt op de officiële Naturvårdsverket-tekst ("ni behöver fråga markägaren om lov om ni är en större grupp som vill tälta på samma plats med flera tält"; ik las het pdf zelf).

## (c) Variabelen die ik onbetrouwbaar vind

1. **`kamp_groepsterrein` (gewicht 7,5 in deze variant, de zwaarste van tier 2).** De waarde meet hoeveel criteria de agent zelf kon bevestigen, niet hoeveel er bestaan. Criterium D is nergens onderzocht; B wordt "nee" zodra maar 1 of 2 terreinen opengingen (FR, GB, NL, DK, NO, FI vallen daardoor van 50 naar 25 ten opzichte van het referentievoorstel); 19 cellen zijn afgeleid van buurlanden, deels cirkelredenering (Balkan, Kaukasus, Griekenland, Cyprus: "buurlanden hebben 0" terwijl die zelf nooit onderzocht zijn). AD 75 en SM 50 zijn van ES en IT gekopieerd terwijl het referentiebestand 0 gaf. Gevoeligheid: met de referentievoorstellen blijft de top 5 hetzelfde (DE 70,1) maar Georgië springt naar 7; maakt men de variabele neutraal (overal 50) dan wint Finland (68,7), Frankrijk 2e, Duitsland 3e. De volgorde 6 tot 12 hangt dus aan deze ene variabele.
2. **`kamp_wild` en `kamp_vuur` (6,5 en 3,5).** 17 en 21 cellen zijn laag, vaak op Wikivoyage of afgeleid van een buurland. De Noordse groepsregel is niet gelijk toegepast: Zweden 55 (officiële tekst vraagt toestemming voor een grotere groep), Finland en Noorwegen 100 (Finse bronnen, onder meer Metsähallitus, noemen geen drempel onder 20 personen; de Noorse wet noemt geen groepsgrootte). Met Zweden op 100 wint Zweden (69,8); met Finland en Noorwegen op 55 wordt de top 5 Duitsland, Zweden, Frankrijk, Finland, Noorwegen (64,4 en 63,8). Verder: ES 0 (twijfel 0 of 30), BY en RU 80 (knock-out, Wikipedia-analogie), GB 75 versus 100 bij kampvuur.
3. **`kost_voeding` (5,3).** Deze ronde gebruikt Eurostat A0101 × 0,557 voor 30 landen en rechtstreeks Numbeo voor 9 landen (GB, XK, MD, UA, BY, RU, GE, AM, AZ): twee methoden in één variabele. De omgerekende waarden wijken tot 26 indexpunten af van Numbeo (IJsland 80,2 tegenover 106,3; Zwitserland 88,4 tegenover 109,5; Letland 58,8 tegenover 48,4). Gevoeligheid: met echte Numbeo-cijfers voor alle landen daalt de kopgroep met 0,5 tot 1,1 punt en blijven de top 5 en de volgorde gelijk; IE en CZ wisselen van plaats op 9 en 10.
4. **`kamp_kampplaats` (5,4)** meet een caravanstandplaats voor twee (camping.info), geen groepsterrein; 14 cellen zijn Numbeo-schattingen. LU en FI hebben hetzelfde bedrag (27,95) in de bron.
5. **`vei_verkeer`.** Tweede bron (Wereldbank, schatting 2019) in plaats van de OWID/WHO-reeks 2021 van de meter, en AD en SM komen uit OWID 2021: gemengde jaren. Grote verschillen tussen de reeksen: AZ 6,7 (WB) tegenover 17,15 (OWID), AM 20 tegenover 13,58, CY 5,8 tegenover 3,94. Klein gewicht (1,7).
6. **`vei_teken`.** 15 cellen laag; ECDC dekt de Balkan, Turkije, Zwitserland en de Kaukasus niet. Ik corrigeerde Zwitserland (BAG); de nullen voor TR, GE, AM, AZ, MD, MK zijn schattingen, geen metingen.
7. **`reis_ov`.** 13 cellen laag; Montenegro 2,2 komt uit Eurostat (autoaandeel 97,8 %) en lijkt het ontbreken van busdata, geen echt cijfer; Balkan en Kaukasus (marshroetka's) zijn te laag.
8. **`reis_direct`.** Vliegfrequenties (minstens 5 per week in juli) zijn bijna overal niet geverifieerd; Duitsland 100 steunt op een European Sleeper die in 2026 maar drie keer per week rijdt.
9. **`av_rivieren`.** ME 487,7 en XK 155 zijn gemiddelden van buren; Montenegro is in werkelijkheid veel natter (het model noemt het zelf een nat land), dus onderschat.
10. **`prak_documenten`.** CH en LI 75 omdat de FOD-pagina voor Zwitserland een ouderlijke toelating voor minderjarigen noemt; die regel geldt in de praktijk voor elke bestemming, dus dit is een inconsistentie (effect minder dan 0,5 punt). `prak_roaming` AD en SM 75: Telenet niet geverifieerd.
11. **`cul_engels`**: 10 laag volgens de vaste regel (GB, IE, MT 640; IS, LU 600; mini-staten gemiddelden). **`weer_*`**: GB uit Heathrow-stationsdata (geen Wikipedia-normaal), AD 1971-2000, RU 1961-1990, SM via Rimini; de hoofdstad is voor Spanje en Italië veel heter dan het kampgebied.

## (d) Zekerheid laag

**169 van 1.344 cellen (12,6 %)** hebben zekerheid "laag"; ontbrekende waarden na afloop: 0 (de 4 nulls zijn ingevuld met de regel, zekerheid laag). Verdeling per variabele: kamp_vuur 21, kamp_groepsterrein 19, kamp_wild 17, vei_teken 15, kost_kampplaats 14, reis_ov 13, kost_activiteiten 12, kost_vervoer 12, cul_engels 10, reis_direct 10, vei_vrede 5, av_rivieren 4, kost_voeding 3, av_grotten 3, vei_verkeer 2, vei_zorg 2, uniek_toerisme 2, kamp_beschermd 2, cul_buitenland 2, vei_brand 1. Van de 33 variabelen hebben dus de drie kampeervariabelen samen 57 lage cellen.

## Werkwijze en voorbehoud

Zoekbudget: 4 WebSearch-aanroepen (TBE Zwitserland, TBE Kaukasus, Turkse bosregels, Finse groepsregel), verder curl en WebFetch met User-Agent "ScoutAtlas/1.0 (nathan@charut.be)". `model/model.json`, de gewichten en `variant.json` zijn niet gewijzigd. Ik heb geen andere ronde-map geopend. Eén technisch voorval: het gedeelde scratchpad bevat hulpscripts van parallelle agents; een tabelscript dat ik daar schreef werd tussentijds overschreven en gaf één keer een tabel van een andere ronde terug. Die uitvoer heb ik verworpen en niet gebruikt; alle cijfers in dit verslag komen uit `rondes/r04/feiten.json` en eigen scripts in een aparte map.
