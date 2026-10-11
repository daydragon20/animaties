# Verslag scoring · ronde 5

Datum 2026-10-11 · model v3.0 · variant "per variabele ×0,8–1,2 (zaad 5), tier-aandelen ongewijzigd" · alle 12 pakketten aanwezig · `model.json`, gewichten en `variant.json` ongewijzigd. Scores zijn alleen berekend (`node scoor.mjs 5`), nooit met de hand gezet. Gebruikt: 2 WebSearch-aanroepen (Malta, Griekenland), verder curl/WebFetch met User-Agent `ScoutAtlas/1.0 (nathan@charut.be)`.

**Onafhankelijkheid (let op).** De scratchpad bleek gedeeld met andere scorers. Een hulpscript van mij werd door een andere sessie overschreven en las daarna `rondes/r08/feiten.json`. Daardoor toonde een deel van mijn tussenuitvoer (o.a. kamp_wild, kamp_groepsterrein, kamp_vuur) kort r08-gegevens. Ik heb dat direct gezien, de uitvoer verworpen en alles opnieuw uit r05 opgebouwd met scripts in een eigen map. Elke correctie hieronder steunt op r05-materiaal (de referenties in `opdracht-p05/p06.md`, de bronpagina's zelf). Toch meld ik het: wie streng wil zijn op onafhankelijkheid, kan de drie kamp-correcties (MT en BY bij kamp_wild, AD/SM/UA/BY bij kamp_groepsterrein) als het enige risico beschouwen.

## (a) Top 10 (basisuitkomst, eindscore 0–100)

| # | Land | Score | Waarom |
|---|---|---|---|
| 1 | Duitsland | 67,4 | Goedkope reis (€121 modelprijs), volle score op reisdocumenten, roaming en betalen, veel grotten (156), kust en Zugspitze (2.962 m); kamperen gemiddeld (wild 55, groepsterrein 50, vuur 75). |
| 2 | Zweden | 67,1 | Allemansrätt (wild 100, vuur 100), 69 % bos, 9 % binnenwater, 26 inwoners/km²; remt: duur vervoer en 4,0 TBE-gevallen per 100.000. |
| 3 | Verenigd Koninkrijk | 65,1 | Beste weer- en cultuurscore (Engels, 23,9 °C), geen TBE, Schotland met vrij kamperen, 9,3 scouts per 1.000 inwoners; remt: laag hoogste punt (1.345 m), ETA + paspoort. |
| 4 | Frankrijk | 65,0 | Reis bijna het goedkoopst (€49 per wegreis), Mont Blanc, 4.853 km kust, 195 grotten; remt: duur eten, weinig buitenland-gevoel, veel toerisme. |
| 5 | Finland | 63,1 | 74 % bos, 10 % binnenwater, allemansrätt (wild 100, vuur 100), 9,9 scouts per 1.000; remt: reis €238 en duur vervoer. |
| 6 | Italië | 62,7 | Alpen, 7.600 km kust en 182 grotten; remt: dure kampeerplek (€41,21) en hitte (32,6 °C). |
| 7 | Tsjechië | 62,4 | Beste kostprijsscore van de top 10 (74,5), veilig, 6,3 scouts per 1.000; remt: geen kust, laag gebergte, TBE 6,8. |
| 8 | Noorwegen | 61,2 | Beste avontuurscore (83,7: fjorden, rivieren, allemansrätt); remt: duurste profiel (vervoer, eten). |
| 9 | Ierland | 61,0 | Veilig, Engelstalig, kampvuur 100, 9,1 scouts per 1.000; remt: weinig bergen en bos. |
| 10 | Slowakije | 61,0 | Goedkoop (68,5), Wenen-nachttrein telt als rechtstreeks, veel bos; geen kust. Slechts 0,03 achter Ierland. |

Knock-out (staan wel in `scores.json`, niet in de rangschikking): Rusland 53,3, Oekraïne 52,2, Belarus 46,2.

**Kritische lezing.** De top 10 is verdedigbaar: goedkope en bereikbare landen met veel natuur en zomerse veiligheid. De staart (San Marino, Cyprus, Moldavië, Azerbeidzjan, Liechtenstein, Andorra, Malta) klopt met microstaten zonder natuur, verre of eilandbestemmingen. Verrassingen, elk met oorzaak in de feiten:
- Duitsland en Zweden liggen 0,39 punt uit elkaar; het is een gelijkspel binnen de meetfout (zie (c) en de gevoeligheid hieronder).
- Kroatië (#26) en Griekenland (#23): wildkamperen 0, kampvuur 25 en kampterreinen 0. Dat laatste is grotendeels een artefact: er is niets onderzocht (zie (c)). Kroatië heeft bovendien 15,2 toeristen per inwoner (WB, 60 mln aankomsten).
- Denemarken (#32): duur, laagste reliëf (171 m), weinig bos. Zwitserland (#27): duurste kampeerplek en voeding.
- Bulgarije viel van #5 naar #12 door het invullen van kamp_groepsterrein met 0 (de oorspronkelijke #5 kwam doordat de ontbrekende cel gewoon werd weggelaten).

**Gevoeligheid voor kamp_groepsterrein (gewicht 8,0 %, de zwakste variabele).**

| Scenario | Top 5 |
|---|---|
| Huidig (na correcties) | DE 67,4 · SE 67,1 · GB 65,1 · FR 65,0 · FI 63,1 |
| Alle laag-cellen van deze variabele = 25 | DE · SE · GB · FR · FI (BG komt op #8) |
| Variabele weggelaten | SE 70,7 · DE 69,0 · FI 68,6 · GB 68,6 · FR 68,5 |
| Alle landen op het referentie-voorstel | SE 71,1 · DE 69,4 · FI 67,1 · GB 67,1 · FR 67,0 |

De winnaar van deze ronde (Duitsland) hangt dus aan de behandeling van één variabele; Zweden wint zodra die variabele neutraler wordt behandeld. De top 5 als groep is wel stabiel.

## (b) Correcties en invullingen (28 celwijzigingen, alle in `feiten.json`; de pakketten bleven ongemoeid)

Alle gewijzigde cellen dragen in hun opmerking "gecorrigeerd door scorer: …" (of "ingevuld door scorer volgens de ontbrekend-regel: …"), met de oorspronkelijke waarde en opmerking erachter.

**8 waardecorrecties**
- kamp_groepsterrein AD 25→0, SM 50→0, UA 25→0, BY 25→0: de ontbrekend-regel zegt eerst het referentie-voorstel (hier 0, "niet onderzocht") en pas zonder referentie een buurland. De agent had het buurlandniveau gebruikt (SM erfde Italië's 50, een gok naar boven).
- kamp_wild MT 80→30: de bron (toeristenmagazine) toont geen enkel bivakregime zonder toestemming (strand verboden, twee campings, Comino-zone; volgens Decathlon-FAQ en expatforum is een vergunning nodig, bevel tot ontruiming Comino 2018). Niveau 80 was niet onderbouwd; terug naar referentie-voorstel 30, zekerheid laag.
- kamp_wild BY 80→55: Forest Code art. 13 noemt geen tenten, groepen of nachten (de agent schreef dat zelf). Terug naar het voorstel 55, zekerheid laag. Belarus is knock-out.
- av_rivieren ME 487,7→611,2 en XK 155→430,6: de regel vraagt het gemiddelde van aangrenzende landen mét waarde; Albanië (WB: 26,9 mld m³ / 27.400 km² = 981,8 mm) was weggelaten omdat het niet in de landenlijst staat. Montenegro en Kosovo zelf hebben geen WB-waarde (gecontroleerd via de API); AQUASTAT niet geraadpleegd. Zekerheid blijft laag.

**16 ingevulde null-cellen (zekerheid laag)**
- kamp_groepsterrein ×10 (HR, BA, ME, RS, XK, MK, GR, BG, CY, MD) = 0: referentie-voorstel overgenomen. Let op: dit 0 betekent "niet onderzocht", niet "bewezen afwezig".
- vei_teken ×5: XK 0,17 (gem. ME, RS, MK), MD 1,27 (RO 0,0 uit ECDC AER 2022 en UA 2,53), GE 3,72 en AZ 3,72 (gem. TR en RU), AM 0 (enkel TR). Allemaal afgeleid van afgeleide waarden.
- reis_ov MD 19,7 (gem. RO 17,9 uit Eurostat en UA 21,5); een marshroetka-land, waarschijnlijk te laag geschat.

**4 zekerheidscorrecties**: av_meren AD, LI, SM, MT van hoog naar midden (de regel van de meter voor kleine staten zonder meren).

**Gecontroleerd en in orde bevonden** (programmatisch tegen de bron): kost_voeding (39 van 39 gelijk aan Numbeo 2026-mid), kost_kampplaats (28 van 28 gelijk aan de Reisefroh/camping.info-tabel; LU en FI hebben daar zelf allebei 27,95), kost_activiteiten en kost_vervoer (alle Eurostat-cellen gelijk; BA 118,4 staat echt in Eurostat), reis_ov ME 2,2 (Eurostat: auto 97,8 %), av_meren (alle landen gelijk aan Wikipedia), av_kust (steekproef), kamp_beschermd, kamp_bos, av_ruimte, uniek_toerisme en av_rivieren (gelijk aan de Wereldbank-API, tot op de gaten). De rekenstap van de Numbeo-verhoudingsschatting (31 cellen) klopt en de gekozen 5 referentielanden zijn telkens de dichtstbijzijnde. Een scan op waarden die >5× afwijken van de regiomediaan vond alleen natuurlijke uitschieters (Noorwegen-kust, Malta-dichtheid, Andorra/San Marino-toerisme); geen eenheidsfout. Alle rubriekwaarden zijn geldige niveaus; alle zekerheden zijn hoog, midden of laag.

**Kampeervariabelen: houdt de opmerking de keuze overeind?** Ja, behalve de hierboven gecorrigeerde gevallen. Zwak maar toegelaten (volgens de ontbrekend-regel, zekerheid laag): wild-niveau 30 voor de Balkan/Kaukasus/Moldavië (Wikivoyage zegt niets over regels), kamp_vuur 25 voor Malta en 75 voor Georgië/Armenië/Azerbeidzjan (geen bron, "neutraal voorstel"), Griekenland vuur 25 (bron: totaal vuurverbod mei–oktober "ook kampvuren"; of campings uitgezonderd zijn is niet bevestigd, mijn zoekopdracht wees op een uitzondering voor aangewezen kamp- en picknickplaatsen, maar geen officiële tekst). Het VK-wildniveau 80 is een gemiddelde van Schotland (100) en Engeland/Wales (55): de rubriek kent die berekening niet, maar 80 is een geldig niveau. Zweden C-criterium (ja) rust op een verwijzing van Scouterna naar scoutstugor, niet op een verhuurpagina: dun.

## (c) Onbetrouwbare variabelen

1. **kamp_groepsterrein (8,0 %).** De onderzoeksagent mocht per land hooguit twee pagina's openen en telde alleen wat hij zelf zag; "niet bevestigd" werd "nee". Gevolg: Noorwegen, Finland, Estland, Letland, Liechtenstein, Georgië staan op 0 en Spanje, Frankrijk, het VK, Nederland, Denemarken, Zweden op 25, terwijl de referentie voor die landen 25–75 voorstelde. 14 landen kregen 0 zonder onderzoek. Het criterium C is bovendien ongelijk toegepast (Noorwegen "nee" omdat buitenlandse groepen niet op de pagina staan; Slowakije "ja" op een expliciete zin). De variabele beslist de winnaar (zie boven).
2. **kamp_wild (5,9 %) en kamp_vuur (4,1 %).** 19 en 24 laag-cellen; veel niveaus zijn het referentie-voorstel zonder eigen bron. Het niveau voor een groep van 5–6 tenten is een juridische interpretatie (bv. IJsland 100 omdat het hoogland vrij is, maar 55 in bewoond gebied).
3. **reis_direct (2,3 %).** 33 laag-cellen: de vliegfrequentie in juli 2027 staat in geen enkele bron; "80 aangenomen". Verbindingen die pas in nov. 2026 of mei 2027 starten (Wizz Air Skopje/Pristina/Kutaisi, Bakoe) tellen mee.
4. **vei_teken (1,2 %).** 18 laag-cellen, vijf nu ingevuld met afgeleide-van-afgeleide waarden. Zwitserland (1,7) rust op BAG-gegevens 2002–2015 en is waarschijnlijk te laag voor 2020–2022 (niet gecontroleerd; BAG-pagina gaf 404).
5. **prak_documenten (1,2 %).** 18 laag-cellen uit buurlandafleiding; CH en LI staan op 75 omdat de FOD-pagina een ouderlijke toelating voor minderjarigen noemt, terwijl dat voor elk land geldt (inconsequent, maar bronvolgend).
6. **uniek_toerisme (1,8 %).** Wereldbank-aankomsten volgen blijkbaar verschillende definities (Spanje 126 mln, Frankrijk 218 mln, Kroatië 60 mln, Denemarken 33 mln lijken hoog); de meter schrijft die bron voor, dus niet gecorrigeerd. Microstaten (AD 108, SM 55 per inwoner) vallen op 0 punten.
7. **Prijsschattingen** (kost_kampplaats 14, kost_activiteiten 12, kost_vervoer 12 laag-cellen): het Numbeo-verhoudingsmodel rust voor de Balkan/Kaukasus op BA's vervoersverhouding 3,09 (Eurostat-uitschieter) en op een Reisefroh-kopie van camping.info.
8. **reis_ov, cul_engels, av_rivieren (ME, XK):** buurlandgemiddelden; Kaukasus en Moldavië bij reis_ov waarschijnlijk te laag.
9. **Weer AD en SM:** normalen 1971–2000 resp. onbekende periode (zekerheid midden).

## (d) Zekerheid laag

**219 van 1.344 cellen (16,3 %)**, waarvan 24 in de drie knock-outlanden (195 in de overige 39). Per variabele: reis_direct 33, kamp_vuur 24, kamp_groepsterrein 21, kamp_wild 19, vei_teken 18, prak_documenten 18, kost_kampplaats 14, reis_ov 13, kost_activiteiten 12, kost_vervoer 12, cul_engels 10, vei_vrede 5, av_rivieren 4, kost_voeding 3, av_grotten 3, kamp_beschermd 2, vei_verkeer 2, vei_zorg 2, uniek_toerisme 2, vei_brand 1, cul_buitenland 1. Landen met de meeste laag-cellen: Kosovo 17, Liechtenstein 14, San Marino 14, Andorra 13, Moldavië 10, Armenië 10. Na de invulling zijn er geen lege cellen meer (0 van 1.344); de 16 eerder lege cellen waren al als laag gemarkeerd en tellen mee.
