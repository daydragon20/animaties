# Scout Atlas 2027: het meetmodel (versie 3.0)

Datum: 10 oktober 2026. Opgesteld door de methodoloog van Scout Atlas 2027. Dit document hoort bij `model.json` (de machineleesbare versie) en legt in gewoon Nederlands uit hoe het model werkt, welke keuzes ik maakte en waar het zwak blijft.

## 1. Het model in één blik

De groep (verkenners 14 tot 16 jaar, 10 à 15 leden, tentenkamp van ±10 dagen in juli of augustus 2027, vertrek uit België) kiest in welk van **42 Europese landen** het buitenlandse kamp doorgaat. Het model telt **33 variabelen** in **10 categorieën** en **3 tiers**. Elke variabele heeft precies één *meter*: een opzoekbare ruwe waarde met een bron, die via een vaste, absolute schaal naar een score van 0 tot 100 gaat. De eindscore van een land is de som van gewicht × score; de gewichten tellen op tot 100.

| Tier | Aandeel | Categorie | Gewicht | Aantal variabelen |
|---|---|---|---|---|
| 1 (Kostprijs en avontuur) | 50 % | Kostprijs | 25,0 % | 5 |
| 1 (Kostprijs en avontuur) | 50 % | Avontuur | 25,0 % | 6 |
| 2 (Kamperen) | 22 % | Kamperen | 22,0 % | 5 |
| 3 (De rest) | 28 % | Veiligheid en gezondheid | 8,3 % | 5 |
| 3 (De rest) | 28 % | Reis en vervoer | 3,7 % | 2 |
| 3 (De rest) | 28 % | Weer in de zomer | 3,4 % | 2 |
| 3 (De rest) | 28 % | Cultuur en mensen | 4,5 % | 3 |
| 3 (De rest) | 28 % | Scoutingnetwerk | 2,2 % | 1 |
| 3 (De rest) | 28 % | Praktisch | 3,8 % | 3 |
| 3 (De rest) | 28 % | Uniek en niet-toeristisch | 2,1 % | 1 |

De prioriteiten van de groep zijn bindend: Tier 1 (kostprijs en avontuur) weegt samen 50 %, Tier 2 (kamperen) 22 % en Tier 3 (de rest) 28 %. Elke variabele weegt tussen 1,2 % en 8 % van de eindscore; de zwaarste is de reiskost (8,0 %), de lichtste zijn de roamingregels (1,2 %).

**Knock-out.** Rusland, Oekraïne en Belarus staan in de lijst maar vallen af omdat de FOD Buitenlandse Zaken alle reizen afraadt. Dat is een knock-out, geen variabele: ze krijgen wel gewoon waarden en een score, maar ze doen niet mee aan de rangschikking. In `model.json` staat dat bij `landen[].knockout`.

## 2. Hoe een meter werkt

- **`dataset`**: één tabel of API dekt (bijna) alle 42 landen. Dit type heeft de voorkeur. De onderzoeksagent leest één pagina en noteert de waarden.
- **`per-land`**: de waarde moet per land apart opgezocht worden (bv. tekenencefalitis uit nationale bronnen).
- **`rubriek`**: een ordinale schaal met expliciete niveaus (bv. wildkamperen: 100 = allemansrecht, 0 = verboden met boetes). De niveaus zijn zó geschreven dat twee onafhankelijke onderzoekers hetzelfde niveau kiezen: ze verwijzen naar de wet, een telbaar aantal terreinen of een ja/nee-toets.

De **schaal** is absoluut en hangt niet af van wie meedoet: `ankers` (lineair tussen vaste punten, daarbuiten geplafonneerd), `log` (x → 0 en y → 100 op een logschaal) of `rubriek`. De ankers zijn gekozen op de werkelijke spreiding van de 42 landen, zodat geen schaal waarop iedereen 90+ scoort overblijft.

**Formules voor de scoringsagent.** `ankers`: lineaire interpolatie tussen de twee omliggende punten; onder het eerste en boven het laatste punt geldt de score van dat punt. `log`: score = 100 × (ln x − ln van) ÷ (ln tot − ln van), begrensd op 0 tot 100 (een waarde 0 of lager krijgt de score van het punt `van`). `rubriek`: neem de score van het gekozen niveau. De eindscore is de som van gewicht × score ÷ 100; de gewichten staan in `model.json` en tellen op tot 100.

**Ontbrekende waarden** hebben per variabele een vaste regel (bv. neem de waarde van het buurland, of de Numbeo-verhouding) en de zekerheid wordt dan *laag*. **Zekerheid** is hoog (dataset), midden (afgeleid of een kleine aanname) of laag (geschat of rubriek met zwakke bronnen).

**Vaste edities.** Om de tien onafhankelijke rondes dezelfde invoer te geven, zijn edities en jaren vastgelegd: Numbeo *2026 Mid-Year* (de editie 2025 verschilt sterk), Eurostat *2024*, camping.info *editie 2026*, WOSM-census *2019*, EF EPI *2025*, klimaatnormalen *1991-2020*, toerisme *2019*.

## 3. Alle variabelen: gewicht, meter, bron en zekerheid

| Variabele | Gewicht | Meter (kort) | Beste bron | Verwachte zekerheid |
|---|---|---|---|---|
| **Reiskost heen en terug** (`kost_reis`, Kostprijs) | 8,0 % | Modelprijs retourreis Brussel - hoofdstad (€): min(weg, vlucht) uit vaste afstandstabel | OSRM (Open Source Routing Machine), publieke demoserver: wegafstand en rijtijd | midden |
| **Eten in de supermarkt** (`kost_voeding`, Kostprijs) | 5,5 % | Numbeo Groceries Index 2026 mid-year (NYC = 100) | Numbeo, Cost of Living Index by Country 2026 Mid-Year (kolom Groceries Index) | midden |
| **Prijs van een kampeerplek** (`kost_kampplaats`, Kostprijs) | 5,0 % | camping.info gemiddelde prijs per nacht (€), editie 2026 | camping.info, Preisvergleich: So viel kostet Camping in Europa (tabel overgenomen door Reisefroh) | midden |
| **Prijs van activiteiten en uitstappen** (`kost_activiteiten`, Kostprijs) | 3,0 % | Eurostat prijspeil recreatie en cultuur (EU27 = 100), 2024 | Eurostat, prc_ppp_ind (A0109 Recreation and culture) | midden |
| **Prijs van vervoer ter plaatse** (`kost_vervoer`, Kostprijs) | 3,5 % | Eurostat prijspeil vervoersdiensten (EU27 = 100), 2024 | Eurostat, prc_ppp_ind (A010703 Transport services) | midden |
| **Bergen en hoogteverschil** (`av_bergen`, Avontuur) | 7,0 % | Hoogste punt van het land (m), vasteland | Wikipedia, List of countries by highest point | hoog |
| **Kust en zee** (`av_kust`, Avontuur) | 4,5 % | Kustlijn in km (CIA-snapshot), logschaal | Wikipedia, List of countries by length of coastline (kolom CIA) | hoog |
| **Meren en binnenwater** (`av_meren`, Avontuur) | 3,5 % | Binnenwater in % van de oppervlakte | Wikipedia, List of countries and dependencies by area | midden |
| **Rivieren, watervallen en wildwater** (`av_rivieren`, Avontuur) | 3,5 % | Afvoerdiepte (mm/jaar) = zoetwatervoorraad ÷ landoppervlakte | Wereldbank WDI, ER.H2O.INTR.K3 (hernieuwbare interne zoetwatervoorraden) en AG.LND.TOTL.K2 (landoppervlakte) | hoog |
| **Grotten en kloven** (`av_grotten`, Avontuur) | 3,0 % | Showcaves + Caves + Gorges op showcaves.com | showcaves.com, Statistics (aantal per land en categorie) | midden |
| **Ruimte en wildernis** (`av_ruimte`, Avontuur) | 3,5 % | Inwoners per km² (lager is beter), logschaal | Wereldbank WDI, EN.POP.DNST (bevolkingsdichtheid) | hoog |
| **Wildkamperen toegestaan** (`kamp_wild`, Kamperen) | 6,5 % | Rubriek wildkamperen voor groep van 5-6 tenten (niveaus 100/80/55/30/0) | Officiële overheids- of natuurbeheerpagina van het land (wet op natuurtoegang, kampeerwet, bosbeheer) | midden |
| **Kampterreinen voor groepen** (`kamp_groepsterrein`, Kamperen) | 7,5 % | Aantal vervulde criteria A-D (databank, 3 terreinen, scoutscentrum, 10 groepscampings) | Nationale scoutsorganisatie van het land (WOSM-lid) en WOSM/SCENES-lijst van scoutscentra | laag |
| **Kampvuur in de zomer** (`kamp_vuur`, Kamperen) | 3,5 % | Rubriek kampvuurregime in juli en augustus (100/75/50/25/0) | Nationale brandweer-, bosbeheer- of milieudienst van het land (regels voor open vuur) | midden |
| **Beschermde natuur rond de kampplek** (`kamp_beschermd`, Kamperen) | 2,5 % | % beschermd landgebied (Protected Planet via Wereldbank) | Wereldbank WDI, ER.LND.PTLD.ZS (terrestrial protected areas), bron Protected Planet | hoog |
| **Bos rond de kampplek** (`kamp_bos`, Kamperen) | 2,0 % | % bosoppervlakte (FAO via Wereldbank) | Wereldbank WDI, AG.LND.FRST.ZS (forest area) | hoog |
| **Vrede en veiligheid** (`vei_vrede`, Veiligheid en gezondheid) | 3,0 % | Global Peace Index (1 tot 5, lager is beter) | Wikipedia, Global Peace Index (landentabel) | hoog |
| **Verkeersveiligheid** (`vei_verkeer`, Veiligheid en gezondheid) | 1,4 % | Verkeersdoden per 100.000 inwoners (WHO 2021) | Our World in Data / WHO, death-rate-from-road-accidents-ghe (2021) | hoog |
| **Gezondheidszorg** (`vei_zorg`, Veiligheid en gezondheid) | 1,3 % | WHO UHC service coverage index 2023 | Our World in Data / WHO, universal-health-coverage-index | hoog |
| **Tekenencefalitis (TBE)** (`vei_teken`, Veiligheid en gezondheid) | 1,3 % | TBE-gevallen per 100.000 inwoners (ECDC, gemiddelde 3 jaar) | ECDC, notification rates of locally acquired TBE cases (kaart en Surveillance Atlas) | midden |
| **Bosbrandrisico** (`vei_brand`, Veiligheid en gezondheid) | 1,3 % | % landoppervlak dat per jaar verbrandt (GWIS, gemiddelde 2015-2025) | Our World in Data / GWIS, Annual share of the total land area burnt by wildfires | midden |
| **Rechtstreekse verbinding vanuit België** (`reis_direct`, Reis en vervoer) | 2,2 % | Rubriek beste verbinding Brussel - hoofdstad (trein/vlucht/overstappen) | Wikipedia, Brussels Airport en Brussels South Charleroi Airport (tabellen Airlines and destinations) | midden |
| **Openbaar vervoer ter plaatse** (`reis_ov`, Reis en vervoer) | 1,5 % | % van het personenvervoer per bus of trein (Eurostat, 2024) | Eurostat, tran_hv_psmod (modal split van het personenvervoer) | midden |
| **Temperatuur in juli** (`weer_temp`, Weer in de zomer) | 1,8 % | Gemiddeld dagmaximum in juli in de hoofdstad (°C, 1991-2020) | Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) | hoog |
| **Neerslag in juli** (`weer_regen`, Weer in de zomer) | 1,6 % | Neerslag in juli in de hoofdstad (mm, 1991-2020) | Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) | hoog |
| **Engels spreken** (`cul_engels`, Cultuur en mensen) | 1,5 % | EF English Proficiency Index 2025 | EF English Proficiency Index 2025 (via Wikipedia-tabel) | hoog |
| **Echt buitenland-gevoel** (`cul_buitenland`, Cultuur en mensen) | 1,7 % | Telling van 3 kenmerken: taalfamilie, schrift, religie (0 tot 3) | Wikipedia, Languages of [land] en Religion in [land] | midden |
| **Gastvrijheid** (`cul_gastvrij`, Cultuur en mensen) | 1,3 % | WEF-score 'attitude of population toward foreign visitors' (1 tot 7) | World Economic Forum, Travel & Tourism Competitiveness Report (landenprofielen en datatabellen) | laag |
| **Scouts per 1.000 inwoners** (`scout_leden`, Scoutingnetwerk) | 2,2 % | WOSM-leden per 1.000 inwoners (census 2019), logschaal | Wikipedia, List of World Organization of the Scout Movement members (WOSM-census 2019) | hoog |
| **Reisdocumenten** (`prak_documenten`, Praktisch) | 1,3 % | Rubriek reisdocumenten voor Belgen (ID-kaart tot visum) | FOD Buitenlandse Zaken, Reizen naar [land]: praktische info (reisdocumenten, visum) | hoog |
| **Roaming en bereik** (`prak_roaming`, Praktisch) | 1,2 % | Rubriek roaming: EU-regeling, dagpas van Belgische operatoren | Europese Commissie, EU roaming (Roam like at home) en partnerakkoorden | midden |
| **Betalen en geld opnemen** (`prak_betalen`, Praktisch) | 1,3 % | Rubriek betaalgemak: euro, kaartnetwerk, contant geld | Europese Centrale Bank en Wikipedia, Eurozone en landen die de euro gebruiken | midden |
| **Weinig massatoerisme** (`uniek_toerisme`, Uniek en niet-toeristisch) | 2,1 % | Toeristenaankomsten per inwoner (2019), lager is beter, logschaal | Wereldbank WDI, ST.INT.ARVL (international tourism, number of arrivals), jaar 2019 | midden |

## 4. Waarom deze meters, categorie per categorie

### Kostprijs (25,0 %, tier 1)

**Reiskost heen en terug** (`kost_reis`, 8,0 %, dataset, zekerheid midden).

*Meter:* Modelprijs (€) voor de retourreis per persoon van Brussel naar de hoofdstad, berekend met een vaste formule: het goedkoopste van (a) WEG = 2 × wegafstand in km (OSRM, Brussel Grote Markt naar de hoofdstad) × 0,08 €/km (+ 50 € Kanaalovergang voor GB) en (b) VLUCHT = 90 + 0,09 × grootcirkelafstand in km (enkele reis). Eilanden en landen met veerboot (IE, IS, MT, CY): alleen (b). Landen zonder passagiersluchthaven of vluchten (AD, LI, SM; ook UA, BY, RU): alleen (a). De afstanden en de uitkomst staan vast in de referentietabel van pakket p02, zodat elke ronde dezelfde invoer gebruikt.

*Waarom:* Een buitenlands kamp wordt voor de leden vooral duur door de reis, dus dit is de zwaarste variabele (het toegelaten maximum van 8 %). De formule is bewust eenvoudig en volledig reproduceerbaar: dezelfde afstanden, dezelfde tarieven, geen dagprijzen die van ronde tot ronde verschillen. Haar kracht is de volgorde (Nederland of Frankrijk goedkoop, de Kaukasus duur); haar zwakte is dat ze geen echte tarieven kent.

*Schaal:* lineair tussen de ankers 35 → 100, 420 → 0; daarbuiten geplafonneerd.

*Bronnen:* OSRM (Open Source Routing Machine), publieke demoserver: wegafstand en rijtijd (2026; dekking: 39 van 42 hoofdsteden gerouteerd op 10-10-2026 (alle behalve IS, MT en CY, die niet over de weg bereikbaar zijn). Dublin wordt met een veerboot gerouteerd en telt daarom niet als wegreis.) ; Grootcirkelafstand (haversineformule, aardstraal 6371 km) (2026; dekking: 42 van 42 (zuivere berekening uit coördinaten, geen opzoeking)) ; Rome2Rio, steekproef om de orde van grootte te controleren (2026; dekking: Wereldwijd, maar de site werkt met JavaScript en is niet automatisch leesbaar)

**Eten in de supermarkt** (`kost_voeding`, 5,5 %, dataset, zekerheid midden).

*Meter:* Numbeo Groceries Index per land (New York = 100) uit de tabel 'Cost of Living Index by Country 2026 Mid-Year' (URL-parameter title=2026-mid, zodat alle rondes dezelfde editie gebruiken). Meet de prijs van een standaardmandje levensmiddelen.

*Waarom:* Op een tentenkamp kook je zelf, dus boodschappen zijn de grootste plaatselijke uitgave. Numbeo is de enige bron die vrijwel alle 42 landen in één tabel dekt, inclusief Kaukasus en Balkan; Eurostat dient als officiële controle.

*Schaal:* lineair tussen de ankers 30 → 100, 110 → 0; daarbuiten geplafonneerd.

*Bronnen:* Numbeo, Cost of Living Index by Country 2026 Mid-Year (kolom Groceries Index) (2026 (mid-year); dekking: 39 van 42; ontbreken: AD, LI, SM. Geverifieerd op 10-10-2026 (Kosovo staat als 'Kosovo (Disputed Territory)').) ; Eurostat, prijspeilindex voeding en niet-alcoholische dranken (prc_ppp_ind, ppp_cat A0101, EU27 = 100) (2024; dekking: 30 van 42; ontbreken: AD, LI, SM, GB, XK, MD, UA, BY, RU, GE, AM, AZ. Geverifieerd op 10-10-2026.)

**Prijs van een kampeerplek** (`kost_kampplaats`, 5,0 %, dataset, zekerheid midden).

*Meter:* Gemiddelde prijs per nacht (€) op campings volgens camping.info, editie 2026 (34 landen, ruim 20.000 campings): standplaats voor twee personen inclusief caravan, stroom en toeristenbelasting. Dient als prijsindicator voor kampeerplaatsen; de echte groepsprijs van een scoutsterrein ligt veel lager maar volgt hetzelfde prijsniveau.

*Waarom:* De prijs van de overnachting zelf. Er bestaat geen Europese dataset van groepsterreinprijzen; de camping.info-prijs is de beste gepubliceerde, jaarlijks herhaalde vergelijking op landniveau. We nemen aan dat groepsterreinen hetzelfde prijsniveau volgen als gewone campings.

*Schaal:* lineair tussen de ankers 14 → 100, 42 → 0; daarbuiten geplafonneerd.

*Bronnen:* camping.info, Preisvergleich: So viel kostet Camping in Europa (tabel overgenomen door Reisefroh) (2026; dekking: 28 van 42; ontbreken: AD, LI, SM, MT, ME, XK, CY, MD, UA, BY, RU, GE, AM, AZ. Geverifieerd op 10-10-2026.) ; PiNCAMP (ADAC), Price Analysis 2026 (2026; dekking: Slechts 12 van 42: NO, SE, DE, NL, FR, DK, GB, AT, ES, CH, IT, HR)

**Prijs van activiteiten en uitstappen** (`kost_activiteiten`, 3,0 %, dataset, zekerheid midden).

*Meter:* Eurostat prijspeilindex voor 'Recreatie en cultuur' (prc_ppp_ind, ppp_cat A0109; EU27 = 100), jaar 2024: de prijs van recreatieve en culturele diensten (entreegelden, sport, uitstappen) ten opzichte van het EU-gemiddelde.

*Waarom:* Rafting, entreegelden en uitstappen kosten per land verschillend. De Eurostat-categorie 'recreatie en cultuur' is de officiële maat voor de prijs van zulke diensten.

*Schaal:* lineair tussen de ankers 50 → 100, 160 → 0; daarbuiten geplafonneerd.

*Bronnen:* Eurostat, prc_ppp_ind (A0109 Recreation and culture) (2024; dekking: 30 van 42; ontbreken: AD, LI, SM, GB, XK, MD, UA, BY, RU, GE, AM, AZ. Geverifieerd op 10-10-2026 (2025 stond nog niet in de API; gebruik vast 2024).) ; OECD, Comparative price levels (voor het VK) (2024; dekking: Onder meer GB, TR en EU-landen; de pagina gaf op 10-10-2026 een 403 voor geautomatiseerde aanvragen)

**Prijs van vervoer ter plaatse** (`kost_vervoer`, 3,5 %, dataset, zekerheid midden).

*Meter:* Eurostat prijspeilindex voor 'Vervoersdiensten' (prc_ppp_ind, ppp_cat A010703: tarieven voor trein, bus, taxi en dergelijke; EU27 = 100), jaar 2024.

*Waarom:* Bus- en treinbilletten ter plaatse bepalen wat dagtochten kosten. De Eurostat-categorie 'vervoersdiensten' meet precies de tarieven (en niet de aankoop van auto's, zoals de bredere categorie 'vervoer').

*Schaal:* lineair tussen de ankers 55 → 100, 170 → 0; daarbuiten geplafonneerd.

*Bronnen:* Eurostat, prc_ppp_ind (A010703 Transport services) (2024; dekking: 30 van 42; ontbreken: AD, LI, SM, GB, XK, MD, UA, BY, RU, GE, AM, AZ. Geverifieerd op 10-10-2026.) ; GlobalPetrolPrices, benzineprijzen per land (alternatieve indicator voor busvervoer) (2026; dekking: Alle landen; pagina geverifieerd bereikbaar (stand 05-10-2026), lijst per land)

### Avontuur (25,0 %, tier 1)

**Bergen en hoogteverschil** (`av_bergen`, 7,0 %, dataset, zekerheid hoog).

*Meter:* Hoogste punt van het land (meter boven zeeniveau) op het Europese vasteland of in het hoofdgebied. Negeer overzeese gebieden en ver afgelegen eilandgroepen: NL = Vaalserberg 322 m (niet Saba 870 m), PT = Serra da Estrela 1.993 m (niet Pico op de Azoren), ES = Mulhacén 3.479 m (niet de Teide), DK = Møllehøj 171 m (niet Groenland). Bij een gedeelde top geldt die voor beide landen.

*Waarom:* Bergen zijn voor deze leeftijd het meest herkenbare avontuur (hiken, trekking, klimmen). Het hoogste punt is objectief, op één pagina te vinden en onderscheidt Alpen en Kaukasus (4.000 m en meer) van de laagvlakte (onder 500 m). Het zegt niets over hoeveel van het land bergachtig is: dat is bewust niet gemeten omdat de beschikbare ruggedness-data eilandlanden (Malta, Cyprus) en kustlijnen vervormt en voor Montenegro en Kosovo ontbreekt.

*Schaal:* lineair tussen de ankers 150 → 0, 500 → 10, 1500 → 45, 2500 → 80, 3800 → 100; daarbuiten geplafonneerd.

*Bronnen:* Wikipedia, List of countries by highest point (2026; dekking: 42 van 42. Geverifieerd op 10-10-2026: de pagina is lang en wordt afgekapt na ongeveer 100.000 tekens (rond 'S'); lees verder met offset 100000 voor ES, GB, SE, CH, SK, SM, RS, TR en UA.) ; Wikipedia, List of elevation extremes by country (2026; dekking: Alle landen; pagina geverifieerd op 10-10-2026 (ook hier staat Saba voor Nederland en Pico voor Portugal; ook lang, offset 100000))

**Kust en zee** (`av_kust`, 4,5 %, dataset, zekerheid hoog).

*Meter:* Lengte van de kustlijn in kilometer volgens de CIA World Factbook, zoals overgenomen in de Wikipedia-lijst (het Factbook zelf is in 2026 stopgezet; de Wikipedia-tabel is nu de bron). Landen zonder zee = 0. Noorwegen telt fjorden en eilanden mee (83.281 km); de logschaal plafonneert dat.

*Waarom:* Zee, kust en strand staan hoog op de wenslijst van de groep. De kustlijn is het enige uniforme cijfer voor alle landen. De logschaal voorkomt dat de fjorden van Noorwegen de rest verdringen.

*Schaal:* logschaal: 10 → 0 punten, 5000 → 100 punten; daarbuiten geplafonneerd.

*Bronnen:* Wikipedia, List of countries by length of coastline (kolom CIA) (2026; dekking: 42 van 42, ook landen zonder kust (0). Geverifieerd op 10-10-2026.) ; Wikipedia, List of countries by length of coastline (kolom WRI) (2026; dekking: Dezelfde pagina heeft een tweede meting van het World Resources Institute; geverifieerd)

**Meren en binnenwater** (`av_meren`, 3,5 %, dataset, zekerheid midden).

*Meter:* Binnenwater (meren, stuwmeren, rivieren) als percentage van de totale oppervlakte van het land, volgens Wikipedia 'List of countries and dependencies by area', kolom '% water' (cijfers CIA/VN, snapshot van vóór de stopzetting van het Factbook).

*Waarom:* Meren zijn de plek voor kajak, zwemmen en watersport zonder zee. Het percentage binnenwater is grof maar eenduidig.

*Schaal:* lineair tussen de ankers 0 → 0, 1 → 20, 2,5 → 45, 5 → 75, 10 → 100; daarbuiten geplafonneerd.

*Bronnen:* Wikipedia, List of countries and dependencies by area (2026; dekking: 37 van 42 geverifieerd op 10-10-2026; AD, LU, LI, SM en MT staan in het afgekapte deel (offset 100000) en zijn niet gecontroleerd.) ; Wikipedia, Geography of [land] (infobox: Area, water %) (2026; dekking: Elk land heeft een geografiepagina met infobox; niet per land geverifieerd)

**Rivieren, watervallen en wildwater** (`av_rivieren`, 3,5 %, dataset, zekerheid hoog).

*Meter:* Jaarlijkse afvoerdiepte in millimeter = hernieuwbare interne zoetwatervoorraden (miljard m³, Wereldbank ER.H2O.INTR.K3, bron FAO AQUASTAT, laatst beschikbare jaar) ÷ landoppervlakte (km², Wereldbank AG.LND.TOTL.K2) × 1.000.000. Veel afvoer per oppervlak betekent veel rivieren, watervallen en wildwater.

*Waarom:* Rivieren, watervallen en wildwater hangen af van hoeveel water er door het land stroomt. De afvoerdiepte (water per oppervlakte) onderscheidt het natte Noorwegen, IJsland, Alpenlanden en Montenegro van het droge Cyprus, Malta en Spanje. Het is een proxy voor wildwater, geen telling van rafting-bedrijven.

*Schaal:* lineair tussen de ankers 50 → 0, 200 → 35, 500 → 70, 1000 → 100; daarbuiten geplafonneerd.

*Bronnen:* Wereldbank WDI, ER.H2O.INTR.K3 (hernieuwbare interne zoetwatervoorraden) en AG.LND.TOTL.K2 (landoppervlakte) (2022; dekking: 38 van 42; ontbreken: LI, SM, ME, XK. Landoppervlakte: 41 van 42 (XK ontbreekt). Geverifieerd op 10-10-2026.) ; FAO AQUASTAT (2022; dekking: Brondataset van de Wereldbank; de pagina laadt maar toont zonder JavaScript geen tekst)

**Grotten en kloven** (`av_grotten`, 3,0 %, dataset, zekerheid midden).

*Meter:* Aantal vermeldingen op showcaves.com in de statistiektabel per land: kolom 'Showcaves' + 'Caves' + 'Gorges' (toeristische grotten, natuurlijke grotten, kloven en ravijnen). Mijnen, karstverschijnselen, bronnen en 'Subterranea' tellen niet mee. Voor het VK staat 'Great Britain'.

*Waarom:* Grotten en kloven staan expliciet op de lijst van de groep (grotten, canyoning). Showcaves.com is de enige site die ze per land telt, in één tabel.

*Schaal:* logschaal: 1 → 0 punten, 150 → 100 punten; daarbuiten geplafonneerd.

*Bronnen:* showcaves.com, Statistics (aantal per land en categorie) (2026; dekking: 39 van 42; ontbreken: AD, LI, XK. Geverifieerd op 10-10-2026. CY, GE, AM, AZ, RU en TR staan in het aparte blok 'transcontinental'.) ; Wikipedia, Category: Show caves by country (2026; dekking: Niet geverifieerd)

**Ruimte en wildernis** (`av_ruimte`, 3,5 %, dataset, zekerheid hoog).

*Meter:* Bevolkingsdichtheid (inwoners per km² landoppervlakte), Wereldbank EN.POP.DNST, laatste jaar (2024). Een lage dichtheid betekent ruimte, afgelegen gebieden en een wilder landschap om te trekken en te kamperen.

*Waarom:* Wie wil trekken en wild kamperen wil ruimte. Een lage bevolkingsdichtheid is een eenvoudige, betrouwbare maat voor afgelegen gebieden en voor het gevoel van wildernis, en vult de bergen en het water aan.

*Schaal:* logschaal: 600 → 0 punten, 10 → 100 punten; daarbuiten geplafonneerd.

*Bronnen:* Wereldbank WDI, EN.POP.DNST (bevolkingsdichtheid) (2024; dekking: 41 van 42; ontbreekt: XK. Geverifieerd op 10-10-2026.) ; Wikipedia, List of countries and dependencies by population density (2026; dekking: Alle landen; niet geverifieerd)

### Kamperen (22,0 %, tier 2)

**Wildkamperen toegestaan** (`kamp_wild`, 6,5 %, rubriek, zekerheid midden).

*Meter:* Mag een groep van 10 à 15 jongeren (5 à 6 tenten) 1 tot 3 nachten buiten een camping kamperen? Kies het niveau van het wettelijke regime dat geldt in het grootste deel van het land, op grond van de wet of de officiële overheidsregeling (niet op grond van een reisblog). Bij regionale verschillen (VK: Schotland; Oostenrijk en Zwitserland: deelstaten en kantons) neem je het gemiddelde van het strengste en het soepelste regime dat minstens 25 % van het grondgebied bestrijkt.

*Waarom:* De eerste vraag van Tier 2: mag het? Wildkamperen is een kernwens van de groep. De rubriek verwijst naar de wet, niet naar blogs, en rekent met een groep van 5 tot 6 tenten, omdat de regels voor groepen strenger zijn dan voor een wandelaar.

*Schaal:* rubriek: 100 = Allemansrecht: tentkamperen op onbebouwde, niet-landbouwgrond is wettelijk gegarandeerd zonder toestemming, ook voor groepen (hooguit melden bij een grote groep of bij meer dan 2 nachten op dezelfde plek) ; 80 = Beperkt vrij kamperen: 1 nacht (bivak) zonder toestemming op onbeschermde natuurgrond of boven de boomgrens, óf een gedoogregeling die uitdrukkelijk groepen van 5 à 6 tenten toelaat ; 55 = Alleen met toestemming van de grondeigenaar of beheerder, en die is doorgaans eenvoudig te krijgen (boer, gemeente, bosbeheerder), of er bestaan officiële natuurkampeer- en bivakzones ; 30 = Verboden, maar in de praktijk gedoogd buiten natuurgebieden, kustzones en bewoonde gebieden; handhaving is zeldzaam en de boetes zijn laag ; 0 = Verboden buiten erkende campings en actief gehandhaafd met boetes

*Bronnen:* Officiële overheids- of natuurbeheerpagina van het land (wet op natuurtoegang, kampeerwet, bosbeheer) (2026; dekking: Wikipedia-overzicht geverifieerd op 10-10-2026: gedetailleerd voor NO, SE, FI, IS, EE, Schotland, AT, DE, CH, CZ; thin voor LV, LT en de Balkan.) ; ÖAMTC (ÖCC), Wildcamping in Europa: ein Überblick (2024; dekking: 14 van 42 (PT, FR, DE, NO, SE, EE, LV, LT, CH, AT, SK, IT, HR, GR). Geverifieerd op 10-10-2026.) ; Wikivoyage, Camping (algemene regels en landenpagina's) (2026; dekking: Alle landen via de landenpagina's (sectie Sleep/Camping); niet geverifieerd)

**Kampterreinen voor groepen** (`kamp_groepsterrein`, 7,5 %, rubriek, zekerheid laag).

*Meter:* Aantal van onderstaande vier criteria (A tot D) dat voor het land vervuld is, elk met een controleerbare bron. A) Er bestaat een online lijst of databank van minstens 10 kampterreinen voor jeugdgroepen, onderhouden door een scoutsorganisatie, jeugdorganisatie, overheid, campingfederatie of groepsaccommodatieportaal. B) Minstens 3 met naam te noemen terreinen verhuren uitdrukkelijk aan jeugd- of scoutsgroepen met tenten voor 10 à 15 personen, met contact of prijs op de eigen website. C) De nationale scoutsorganisatie (WOSM-lid) heeft een scoutscentrum of kampterrein dat aan buitenlandse groepen verhuurt (bijvoorbeeld SCENES-geaccrediteerd). D) Minstens 10 campings met een uitdrukkelijke groepsvoorziening ('groepsterrein', 'Gruppenzeltplatz', 'jeugdkampeerterrein') volgens een campingportaal of de nationale campingfederatie.

*Waarom:* De tweede vraag van Tier 2: bestaan er echte plekken voor een groep? Het zwaarste gewicht van Tier 2 (7,5 %), want zonder terrein geen kamp. Omdat er geen dataset bestaat, is de meter een telling van vier controleerbare criteria.

*Schaal:* rubriek: 100 = Alle vier de criteria (A, B, C en D) zijn vervuld ; 75 = Drie van de vier criteria zijn vervuld ; 50 = Twee van de vier criteria zijn vervuld ; 25 = Eén van de vier criteria is vervuld ; 0 = Geen enkel criterium is vervuld

*Bronnen:* Nationale scoutsorganisatie van het land (WOSM-lid) en WOSM/SCENES-lijst van scoutscentra (2026; dekking: Pagina geverifieerd op 10-10-2026: toont de SCENES-centra per land. SCENES telt wereldwijd slechts ±43 accreditaties, dus criterium C moet breed gelezen worden (ook nationale scoutscentra).) ; Groepsaccommodatieportalen (bv. gruppenhaus.de, groepsaccommodatie.nl, groupaccommodation.com) (2026; dekking: Vooral DE, AT, CH, NL, BE, FR, IT; elders weinig. Site geverifieerd bereikbaar (10-10-2026) en toont per regio Zeltplätze voor Pfadfinder en Jugendgruppen.) ; Eurocampings, ACSI en camping.info (zoekfilter groepen / groepsterrein) (2026; dekking: Europa-breed; geeft 403 voor geautomatiseerde aanvragen)

**Kampvuur in de zomer** (`kamp_vuur`, 3,5 %, rubriek, zekerheid midden).

*Meter:* Regime voor open vuur (kampvuur) in juli en augustus, voor een kamp van 12 jongeren op een kampterrein of met toestemming van de grondeigenaar. Kies het niveau op grond van de wet of de officiële regeling van brandweer, bosdienst of natuurbeheer van het land (en de zomerverboden van 2025 en 2026 als bewijs van het gebruikelijke beleid).

*Waarom:* Kampvuur hoort bij Tier 2 omdat het voor veel scouts essentieel is. De rubriek vat samen wat wettelijk en in de praktijk kan in juli en augustus.

*Schaal:* rubriek: 100 = Open vuur is op een kampterrein toegestaan met toestemming van de eigenaar of beheerder, en er geldt in juli en augustus geen structureel verbod in het land of in grote regio's; alleen tijdelijke, plaatselijke verboden bij extreme droogte ; 75 = Open vuur is toegestaan op aangewezen vuurplaatsen of na een eenvoudige melding of toestemming van gemeente of brandweer; er zijn periodieke zomerbeperkingen per regio (brandgevaarkaarten, prefectuurbesluiten, Waldbrandstufen) die kampvuur geregeld tijdelijk verbieden ; 50 = Structureel verbod op open vuur in of vlakbij bos en natuur gedurende een vaste zomerperiode (bijvoorbeeld 15 april tot 15 september in Noorwegen, de 'período crítico' in Portugal); kampvuur enkel op erkende vuurplaatsen van campings of kampterreinen of buiten bosgebied (strand, rotsen), voor zover toegestaan ; 25 = Algemeen verbod op open vuur buiten gebouwde barbecueplaatsen in juli en augustus, met boetes; hooguit gas- of houtskoolbarbecue op campings ; 0 = Totaal vuurverbod in de zomer, ook op kampterreinen, met zware straffen; of vuur is feitelijk onmogelijk (geen hout, kale eilanden)

*Bronnen:* Nationale brandweer-, bosbeheer- of milieudienst van het land (regels voor open vuur) (2026; dekking: EFFIS-startpagina geverifieerd bereikbaar; of er per land links naar nationale brandpreventieregels staan is niet geverifieerd) ; Wikipedia, Right of public access to the wilderness (vuurregels NO, SE, FI) (2026; dekking: Geverifieerd voor Noorwegen: vuurverbod in bosgebied van 15 april tot 15 september, met uitzonderingen.)

**Beschermde natuur rond de kampplek** (`kamp_beschermd`, 2,5 %, dataset, zekerheid hoog).

*Meter:* Beschermd landgebied als percentage van de landoppervlakte (Wereldbank ER.LND.PTLD.ZS, gebaseerd op Protected Planet / WDPA, editie 2025). Proxy voor de schoonheid en rust van de natuur waarin je staat; geen subjectief wow-cijfer.

*Waarom:* Hoe mooi is de plek waar je staat? Beschermde natuur is de beste objectieve proxy voor mooie, rustige, onbebouwde natuur.

*Schaal:* lineair tussen de ankers 5 → 0, 15 → 40, 30 → 80, 45 → 100; daarbuiten geplafonneerd.

*Bronnen:* Wereldbank WDI, ER.LND.PTLD.ZS (terrestrial protected areas), bron Protected Planet (2025; dekking: 40 van 42; ontbreken: SM en XK. Geverifieerd op 10-10-2026.) ; Protected Planet (UNEP-WCMC en IUCN), landenpagina's (2025; dekking: Alle landen; landenpagina's laden (geverifieerd voor BEL) maar tonen de percentages niet in de paginatekst (JavaScript))

**Bos rond de kampplek** (`kamp_bos`, 2,0 %, dataset, zekerheid hoog).

*Meter:* Bosoppervlakte als percentage van de landoppervlakte (Wereldbank AG.LND.FRST.ZS, bron FAO Global Forest Resources Assessment), laatste jaar (2024). Bos betekent schaduw, hout en een natuurlijke kampplek.

*Waarom:* Bos betekent schaduw tegen de hitte, hout voor het vuur en een mooie kampplek. FAO-cijfers voor bijna alle landen via de Wereldbank.

*Schaal:* lineair tussen de ankers 0 → 0, 10 → 15, 30 → 60, 50 → 90, 70 → 100; daarbuiten geplafonneerd.

*Bronnen:* Wereldbank WDI, AG.LND.FRST.ZS (forest area) (2024; dekking: 41 van 42; ontbreekt: XK. Geverifieerd op 10-10-2026.) ; FAO, Global Forest Resources Assessment 2025 (2025; dekking: Alle landen; landenrapporten niet geverifieerd)

### Veiligheid en gezondheid (8,3 %, tier 3)

**Vrede en veiligheid** (`vei_vrede`, 3,0 %, dataset, zekerheid hoog).

*Meter:* Global Peace Index (Institute for Economics & Peace), globale score van 1 (zeer vredig) tot 5, laatste editie (op 10-10-2026: editie 2026; is die niet vindbaar, gebruik editie 2025 en noteer het jaar).

*Waarom:* De algemene maat voor veiligheid en stabiliteit voor minderjarigen. De Global Peace Index is gewogen (criminaliteit, conflicten, terreur) en jaarlijks herhaald; het reisadvies zelf is een knock-out en dus niet nog eens een variabele.

*Schaal:* lineair tussen de ankers 1,2 → 100, 1,7 → 80, 2,1 → 50, 2,7 → 15, 3,4 → 0; daarbuiten geplafonneerd.

*Bronnen:* Wikipedia, Global Peace Index (landentabel) (2026; dekking: Geverifieerd op 10-10-2026: 34 van 42 in het eerste deel van de pagina plus TR (136), UA (160) en RU (163) in het tweede deel. Afwezig: AD, LI, SM; LU en MT vermoedelijk ook afwezig (niet bevestigd).) ; Vision of Humanity (IEP), Global Peace Index kaart en tabel (2026; dekking: 163 landen; pagina bestaat (geverifieerd), de landentabel zelf werkt met JavaScript)

**Verkeersveiligheid** (`vei_verkeer`, 1,4 %, dataset, zekerheid hoog).

*Meter:* Geschatte verkeersdoden per 100.000 inwoners (WHO Global Health Estimates, 2021), via Our World in Data.

*Waarom:* Een groep reist veel per bus. Verkeersdoden zijn de scherpste objectieve veiligheidsmaat voor wegvervoer.

*Schaal:* lineair tussen de ankers 2 → 100, 6 → 65, 10 → 30, 17 → 0; daarbuiten geplafonneerd.

*Bronnen:* Our World in Data / WHO, death-rate-from-road-accidents-ghe (2021) (2021; dekking: 40 van 42; ontbreken: LI en XK. Geverifieerd op 10-10-2026.) ; Wereldbank WDI, SH.STA.TRAF.P5 (WHO-schatting 2019) (2019; dekking: 40 van 42; ontbreken: LI en XK (AD 2013, SM 2016). Geverifieerd op 10-10-2026.)

**Gezondheidszorg** (`vei_zorg`, 1,3 %, dataset, zekerheid hoog).

*Meter:* WHO-index voor dekking van gezondheidsdiensten (UHC service coverage index, SDG 3.8.1), schaal 0 tot 100, laatste jaar (2023).

*Waarom:* Als er iets gebeurt, moet er een ziekenhuis zijn. De UHC-index van de WHO meet de dekking van gezondheidsdiensten in 14 domeinen.

*Schaal:* lineair tussen de ankers 62 → 5, 90 → 100; daarbuiten geplafonneerd.

*Bronnen:* Our World in Data / WHO, universal-health-coverage-index (2023; dekking: 40 van 42; ontbreken: LI (leeg) en XK. Geverifieerd op 10-10-2026.) ; Wereldbank WDI, SH_UHC_SCI (zelfde WHO-reeks) (2023; dekking: Zelfde dekking; gebruik de code SH_UHC_SCI, niet SH.UHC.SRVS.CV.XD (die geeft 'not found'). Geverifieerd.)

**Tekenencefalitis (TBE)** (`vei_teken`, 1,3 %, per-land, zekerheid midden).

*Meter:* Aantal gemelde gevallen van tekenencefalitis (TBE) per 100.000 inwoners per jaar, gemiddelde van de laatste 3 beschikbare jaren, volgens het ECDC (Surveillance Atlas / Annual Epidemiological Report). Voor landen buiten het ECDC-rapport: het nationale instituut (bv. BAG Zwitserland, FHI Noorwegen, Rospotrebnadzor Rusland) of WHO Europa.

*Waarom:* Tekenencefalitis is de enige ziekte met een duidelijk, landgebonden risico voor een kamp in bos en gras. Het verschil tussen bijna nul (Zuid-Europa) en vele gevallen (Baltische staten, Centraal-Europa) is groot genoeg om mee te tellen.

*Schaal:* lineair tussen de ankers 0 → 100, 0,3 → 90, 1 → 70, 3 → 40, 8 → 10, 15 → 0; daarbuiten geplafonneerd.

*Bronnen:* ECDC, notification rates of locally acquired TBE cases (kaart en Surveillance Atlas) (2023; dekking: 20 EU/EER-landen melden; de paginatekst bevat geen landentabel (kaarten en Atlas zijn interactief). Niet volledig geverifieerd.) ; Eurosurveillance / RKI en nationale instituten (TBE-risicogebieden) (2023; dekking: Per land; niet geverifieerd)

**Bosbrandrisico** (`vei_brand`, 1,3 %, dataset, zekerheid midden).

*Meter:* Gemiddeld jaarlijks aandeel van het landoppervlak dat door natuurbranden verbrandt (% van het land per jaar), gemiddelde over 2015 tot en met 2025, uit GWIS-satellietdata (Our World in Data). Het jaar 2026 is nog onvolledig en telt niet mee.

*Waarom:* Branden in juli en augustus (Portugal, Griekenland, Turkije) veroorzaken evacuaties van kampen. Het gemiddelde over 2015 tot 2025 dempt uitschieters als 2017 (Portugal) en 2025.

*Schaal:* lineair tussen de ankers 0 → 100, 0,05 → 90, 0,2 → 65, 0,5 → 35, 1 → 10, 1,5 → 0; daarbuiten geplafonneerd.

*Bronnen:* Our World in Data / GWIS, Annual share of the total land area burnt by wildfires (2025; dekking: 41 van 42 geverifieerd (alle behalve mogelijk XK) op 10-10-2026; reeks 2012 tot 2026 voor ruim 200 landen.) ; EFFIS (Copernicus) / JRC, Forest Fires in Europe, Middle East and North Africa (Table 1: burnt area per country) (2024; dekking: ±37 landen; Table 1 geverifieerd in de advance-rapporten)

### Reis en vervoer (3,7 %, tier 3)

**Rechtstreekse verbinding vanuit België** (`reis_direct`, 2,2 %, rubriek, zekerheid midden).

*Meter:* Beste verbinding van Brussel naar de hoofdstad (of een stad binnen 150 km ervan), op basis van de dienstregeling van de zomer 2027 (als die nog niet bestaat: zomer 2026).

*Waarom:* Een groep van 12 tieners met bagage wil zo weinig mogelijk overstappen. Dit meet het gemak, terwijl `kost_reis` de prijs meet.

*Schaal:* rubriek: 100 = Rechtstreekse trein of nachttrein (zonder overstap) van Brussel naar de hoofdstad of een stad binnen 150 km ervan, met een reistijd van hoogstens 14 uur ; 80 = Geen rechtstreekse trein, maar wel een rechtstreekse lijnvlucht vanuit Brussel of Charleroi naar de hoofdstad (of een luchthaven binnen 150 km), minstens 5 keer per week in juli, met een vliegtijd van hoogstens 3 uur ; 60 = Rechtstreekse lijnvlucht (minstens 3 keer per week in juli) met een vliegtijd van meer dan 3 uur, of een rechtstreekse langeafstandsbus met hoogstens 24 uur reistijd ; 40 = Alleen met één overstap (trein, bus of vlucht), totale reistijd hoogstens 12 uur ; 20 = Alleen met één of meer overstappen en een totale reistijd van 12 tot 24 uur ; 0 = Meer dan 24 uur reistijd, of enkel een route met een veerboot of vlucht waarvan de bestemmingsluchthaven geen lijndienst heeft

*Bronnen:* Wikipedia, Brussels Airport en Brussels South Charleroi Airport (tabellen Airlines and destinations) (2026; dekking: Geverifieerd op 10-10-2026: bevat o.a. Reykjavik, Jerevan, Tallinn, Riga, Vilnius, Pristina (seizoen), Chisinau, Larnaca, Athene, Sofia, Belgrado, Zagreb, Istanboel; Bakoe start 8 mei 2027; Tbilisi, Sarajevo, Podgorica, Skopje en Valletta stonden er niet.) ; Seat61, treinreizen vanuit Brussel (Eurostar, Nightjet, European Sleeper) (2026; dekking: Geverifieerd dat de pagina Londen, Amsterdam, Rotterdam en Luxemburg rechtstreeks noemt; verdere pagina's per bestemming niet bekeken.)

**Openbaar vervoer ter plaatse** (`reis_ov`, 1,5 %, dataset, zekerheid midden).

*Meter:* Aandeel van bus, touringcar en trein in het binnenlandse personenvervoer (in % van de reizigerskilometers) = 100 min het aandeel personenauto's, Eurostat tran_hv_psmod, laatste jaar (2024). Meet hoe goed het collectieve vervoer werkt en gebruikt wordt.

*Waarom:* 'Vervoer ter plaatse' uit de wensen van de groep: kun je je zonder auto verplaatsen? Het aandeel bus en trein in het personenvervoer is het beste landvergelijkende cijfer dat vrij beschikbaar is.

*Schaal:* lineair tussen de ankers 2 → 0, 10 → 30, 15 → 60, 22 → 90, 28 → 100; daarbuiten geplafonneerd.

*Bronnen:* Eurostat, tran_hv_psmod (modal split van het personenvervoer) (2024; dekking: 29 van 42; ontbreken: AD, GB, LI, SM, BA, XK, MD, UA, BY, RU, GE, AM, AZ. Geverifieerd op 10-10-2026 (IS, MT, CY hebben geen treinwaarde maar wel bus en auto).) ; Wereldbank WDI, IS.RRS.PASG.KM (reizigerskilometers per spoor) (2021; dekking: 35 van 42; ontbreken: AD, CY, IS, LI, MT, SM, XK (geen of nauwelijks personentreinen). Geverifieerd op 10-10-2026.)

### Weer in de zomer (3,4 %, tier 3)

**Temperatuur in juli** (`weer_temp`, 1,8 %, dataset, zekerheid hoog).

*Meter:* Gemiddelde dagelijkse maximumtemperatuur in juli (°C) in de hoofdstad, klimaatnormaal 1991-2020, uit de klimaattabel 'Climate data for [stad]' op Wikipedia (rij 'Mean daily maximum °C'). De hoofdstad is de vaste referentie voor alle landen (zie de lijst in pakket p09).

*Waarom:* Hitte (boven 30 °C) is op een tentenkamp het grootste weerprobleem, kou (onder 18 °C) het tweede. De schaal is dus een plateau van 21 tot 26 °C met dalingen aan beide kanten.

*Schaal:* lineair tussen de ankers 14 → 25, 18 → 70, 21 → 100, 26 → 100, 29 → 70, 32 → 35, 35 → 10, 38 → 0; daarbuiten geplafonneerd.

*Bronnen:* Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) (1991-2020; dekking: Geverifieerd op 10-10-2026 voor Tbilisi (31,5 °C) en Vaduz (24,9 °C); de klimaattabellen bestaan voor vrijwel alle hoofdsteden.) ; NOAA, Global Historical Climatology Network / klimaatnormalen, of nationale meteodienst (1991-2020; dekking: Niet geverifieerd)

**Neerslag in juli** (`weer_regen`, 1,6 %, dataset, zekerheid hoog).

*Meter:* Gemiddelde neerslag in juli (mm) in de hoofdstad, klimaatnormaal 1991-2020, uit dezelfde klimaattabel (rij 'Average precipitation mm').

*Waarom:* Een natte kampzomer is voor tenten het tweede grote weerprobleem; juli is het kernmoment van het kamp.

*Schaal:* lineair tussen de ankers 10 → 100, 40 → 92, 70 → 65, 100 → 35, 140 → 10, 180 → 0; daarbuiten geplafonneerd.

*Bronnen:* Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) (1991-2020; dekking: Geverifieerd op 10-10-2026 voor Tbilisi (41,6 mm) en Vaduz (130,3 mm).) ; NOAA of nationale meteodienst (1991-2020; dekking: Niet geverifieerd)

### Cultuur en mensen (4,5 %, tier 3)

**Engels spreken** (`cul_engels`, 1,5 %, dataset, zekerheid hoog).

*Meter:* EF English Proficiency Index 2025 (score per land).

*Waarom:* Taal is de eerste drempel voor 14- tot 16-jarigen. EF EPI is de meest gebruikte internationale vergelijking.

*Schaal:* lineair tussen de ankers 450 → 15, 525 → 50, 600 → 85, 640 → 100; daarbuiten geplafonneerd.

*Bronnen:* EF English Proficiency Index 2025 (via Wikipedia-tabel) (2025; dekking: 32 van 42; ontbreken: AD, GB, IE, IS, LU, LI, SM, MT, ME, XK. Geverifieerd op 10-10-2026.) ; Wikipedia, List of countries by English-speaking population (2026; dekking: Veel landen met uiteenlopende bronjaren; Wikipedia vermeldt zelf dat de bronnen verouderd zijn)

**Echt buitenland-gevoel** (`cul_buitenland`, 1,7 %, rubriek, zekerheid midden).

*Meter:* Aantal van drie ja/nee-vragen dat met 'ja' beantwoord wordt (telkens op basis van Wikipedia 'Languages of [land]' en 'Religion in [land]'): A) de officiële of overheersende taal behoort niet tot de Germaanse of Romaanse taalfamilie (dus Slavisch, Baltisch, Fins-Oegrisch, Grieks, Turks, Albanees, Armeens, Georgisch, Azerbeidzjaans, Maltees); B) het dagelijkse schrift is niet Latijns (Cyrillisch, Grieks, Armeens, Georgisch); C) de grootste religieuze groep is niet rooms-katholiek of protestants en de grootste groep is ook niet 'zonder religie' (dus oosters-orthodox, islamitisch, enzovoort).

*Waarom:* De groep wil 'echt buitenland': een andere taal, een ander schrift, een andere cultuur. Drie ja/nee-vragen zijn grof maar objectief en herhaalbaar.

*Schaal:* rubriek: 100 = Drie keer 'ja' (A, B en C) ; 75 = Twee keer 'ja' ; 45 = Eén keer 'ja' ; 10 = Geen enkele 'ja'

*Bronnen:* Wikipedia, Languages of [land] en Religion in [land] (2026; dekking: Alle landen; niet per land geverifieerd) ; Wikipedia, Religion in Europe (grootste religie per land) (2026; dekking: Europese landen (ook TR, de Kaukasus en Cyprus staan in de tekst); pagina geverifieerd op 10-10-2026, lang (offset 100000))

**Gastvrijheid** (`cul_gastvrij`, 1,3 %, dataset, zekerheid laag).

*Meter:* Score voor de houding van de bevolking tegenover buitenlandse bezoekers: WEF Travel & Tourism Competitiveness Report, indicator 'Attitude of population toward foreign visitors' (1 = zeer ongunstig, 7 = zeer gunstig), laatste editie waarin het land voorkomt (2019, anders 2017 of 2015); noteer de editie. Alternatief: Gallup/CAF 'helped a stranger' (% in de afgelopen maand).

*Waarom:* Gastvrijheid staat op de wensenlijst, maar is moeilijk te meten; zie Beslissingen en Wat zwak blijft.

*Schaal:* lineair tussen de ankers 5 → 0, 6,7 → 100; daarbuiten geplafonneerd.

*Bronnen:* World Economic Forum, Travel & Tourism Competitiveness Report (landenprofielen en datatabellen) (2019; dekking: ±140 economieën, niet AD, LI, SM, XK; NIET GEVERIFIEERD: de publicatiepagina gaf op 10-10-2026 een 403, de rapport-PDF een 504 en de indicator is niet apart teruggevonden.) ; Gallup World Poll / CAF World Giving Report: aandeel dat een vreemde hielp (2024; dekking: 142 landen; de landentabel is niet vrij leesbaar (de pagina /about-us/research/world-giving-report gaf op 10-10-2026 een 404; het Gallup-artikel bevat geen landentabel))

### Scoutingnetwerk (2,2 %, tier 3)

**Scouts per 1.000 inwoners** (`scout_leden`, 2,2 %, dataset, zekerheid hoog).

*Meter:* Aantal leden van de nationale scoutsorganisatie(s) die lid zijn van WOSM (census 31-12-2019) per 1.000 inwoners (bevolking 2023, Wereldbank SP.POP.TOTL). Een sterk scoutsnetwerk betekent kampterreinen, ervaring met buitenlandse groepen en kans op uitwisseling.

*Waarom:* Een sterk scoutsnetwerk betekent scoutscentra, ervaring met buitenlandse groepen en kans op uitwisseling met lokale scouts. Het aantal leden per inwoner is het enige cijfer dat WOSM voor alle landen publiceert.

*Schaal:* logschaal: 0,05 → 0 punten, 12 → 100 punten; daarbuiten geplafonneerd.

*Bronnen:* Wikipedia, List of World Organization of the Scout Movement members (WOSM-census 2019) (2019; dekking: 40 van 42; ontbreken: AD (geen WOSM-lid, scouting herstart in 2016) en XK (geen WOSM-lid). Geverifieerd op 10-10-2026.) ; Wereldbank WDI, SP.POP.TOTL (bevolking 2023) (2023; dekking: 42 van 42, inclusief Kosovo (1.682.668). Geverifieerd op 10-10-2026.)

### Praktisch (3,8 %, tier 3)

**Reisdocumenten** (`prak_documenten`, 1,3 %, rubriek, zekerheid hoog).

*Meter:* Reisdocumenten die een Belgische minderjarige (14 tot 16 jaar) voor een verblijf van 10 dagen nodig heeft, volgens de FOD Buitenlandse Zaken (pagina 'Praktische info' per land).

*Waarom:* Papieren zijn een echte drempel voor een groep van minderjarigen (een paspoort per kind, een visum of ETA).

*Schaal:* rubriek: 100 = De Belgische identiteitskaart (eID of Kids-ID) volstaat, zonder voorafgaande toelating of visum ; 75 = De identiteitskaart volstaat, maar er is een gratis of goedkope voorafgaande online registratie of formulier nodig ; 50 = Een paspoort is vereist, maar geen visum en geen voorafgaande online toelating ; 30 = Paspoort én een voorafgaande online toelating of e-visum (bv ; 0 = Visum aan te vragen bij een ambassade of consulaat (bv

*Bronnen:* FOD Buitenlandse Zaken, Reizen naar [land]: praktische info (reisdocumenten, visum) (2026; dekking: Alle landen; geverifieerd voor Georgië (ID-kaart volstaat, geen visum tot 1 jaar). Het URL-patroon: /nl/landen/[land]/reizen-naar-[land]-reisadvies/praktische-info-voor-[land].) ; Raad van de EU, PRADO en nationale ambassadesites (controle) (2026; dekking: Niet geverifieerd)

**Roaming en bereik** (`prak_roaming`, 1,2 %, rubriek, zekerheid midden).

*Meter:* Kost van mobiel internet voor een Belgische sim-kaart in het land, volgens de EU-roamingverordening 2022/612 en de roamingzones/dagpassen van Proximus, Orange Belgium en Telenet (Base).

*Waarom:* Bereikbaarheid van de leiding in nood: roaming zoals thuis tegenover dure dagpassen.

*Schaal:* rubriek: 100 = Roam like at home: data, bellen en sms tegen het binnenlandse tarief binnen het fair-use-plafond, op grond van de EU-verordening (EU, IS, NO, LI) of een EU-akkoord dat vóór 1 juli 2027 van kracht is (op 10-10-2026: Oekraïne en Moldavië sinds 1-1-2026) ; 75 = Niet in de EU-regeling, maar de drie grote Belgische operatoren bieden een dagpas van hoogstens 5 euro per dag of rekenen standaard als in België (bv ; 40 = Dagpas of tarief tussen 5 en 15 euro per dag, of een zone met beperkte data-opties ; 10 = Meer dan 15 euro per dag, geen dagpas, of geen 4G-dekking voor Belgische operatoren

*Bronnen:* Europese Commissie, EU roaming (Roam like at home) en partnerakkoorden (2026; dekking: Geverifieerd op 10-10-2026: Roam Like at Home geldt voor EU, IJsland, Noorwegen, Liechtenstein en sinds 1-1-2026 ook voor Oekraïne en Moldavië; voor de Westelijke Balkan is er enkel een voorstel van de Commissie om te onderhandelen, geen akkoord.) ; Proximus, Orange Belgium en Telenet: roamingzones en dagpassen (2026; dekking: Alle landen; niet geverifieerd, de URL is een schatting (kan een 403 of JavaScript geven): zoek 'Proximus roaming zones')

**Betalen en geld opnemen** (`prak_betalen`, 1,3 %, rubriek, zekerheid midden).

*Meter:* Betaalgemak voor Belgen: is de euro het wettelijke of feitelijke betaalmiddel, en zo niet, werken Belgische Visa-, Mastercard- of Maestro-kaarten er normaal (geen sancties) en is kaartbetaling gebruikelijk? Bulgarije telt als euroland sinds 1-1-2026.

*Waarom:* Euro of niet, en werken Belgische kaarten? Cash-landen en sancties maken het betalen lastig.

*Schaal:* rubriek: 100 = De euro is het wettelijke of feitelijke betaalmiddel ; 70 = Eigen munt, maar in de EU, de EER, Zwitserland of het VK: kaartbetaling (ook contactloos) is overal gebruikelijk en geldautomaten zijn overal (bv ; 40 = Eigen munt buiten de EU/EER: Belgische kaarten werken, maar contant geld is nodig buiten steden, bij kleine winkels en op veel campings (bv ; 0 = Belgische bankkaarten werken niet of nauwelijks door sancties of afsluiting van het betaalnetwerk (bv

*Bronnen:* Europese Centrale Bank en Wikipedia, Eurozone en landen die de euro gebruiken (2026; dekking: Euro: AT, BE, BG, HR, CY, EE, FI, FR, DE, GR, IE, IT, LV, LT, LU, MT, NL, PT, SK, ES, ook AD, SM, ME, XK (eenzijdig/akkoord). Niet per land geverifieerd.) ; FOD Buitenlandse Zaken, Praktische info per land (betalen en geld opnemen) en Visa/Mastercard-meldingen (2026; dekking: Alle landen; niet per land geverifieerd)

### Uniek en niet-toeristisch (2,1 %, tier 3)

**Weinig massatoerisme** (`uniek_toerisme`, 2,1 %, dataset, zekerheid midden).

*Meter:* Internationale toeristenaankomsten per inwoner in 2019 (het laatste jaar vóór corona): Wereldbank ST.INT.ARVL (UN Tourism) gedeeld door de bevolking in 2019 (SP.POP.TOTL). Een lage waarde betekent minder toeristendrukte en meer kans op een niet-toeristische ervaring.

*Waarom:* De groep wil niet in een toeristenval. Aankomsten per inwoner meten toeristische druk; de logschaal dempt de definitieverschillen.

*Schaal:* logschaal: 20 → 0 punten, 0,3 → 100 punten; daarbuiten geplafonneerd.

*Bronnen:* Wereldbank WDI, ST.INT.ARVL (international tourism, number of arrivals), jaar 2019 (2019; dekking: 40 van 42 voor 2019; ontbreken: SK (laatste waarde 2018: 15.299.000) en XK. Geverifieerd op 10-10-2026.) ; Wereldbank WDI, SP.POP.TOTL (bevolking 2019) (2019; dekking: 42 van 42 (2023 geverifieerd, 2019 mag ook))

## 5. De onderzoekspakketten

Elk pakket is één opdracht voor één onderzoeksagent, die voor alle 42 landen de ruwe waarden en bronnen van de variabelen in dat pakket verzamelt. De pakketten zijn gegroepeerd op bronfamilie. De volledige instructie staat in `model.json` onder `pakketten[].instructie`.

| Pakket | Naam | Variabelen | Geschatte opzoekingen |
|---|---|---|---|
| p01 | Prijsniveau: Numbeo, Eurostat en camping.info | `kost_voeding`, `kost_kampplaats`, `kost_activiteiten`, `kost_vervoer` | 20 |
| p02 | Reiskost: vaste formule en referentietabel | `kost_reis` | 8 |
| p03 | Landschap: Wikipedia-landenlijsten en showcaves.com | `av_bergen`, `av_kust`, `av_meren`, `av_grotten` | 20 |
| p04 | Wereldbank-datasets: water, ruimte, beschermde natuur en bos | `av_rivieren`, `av_ruimte`, `kamp_beschermd`, `kamp_bos` | 15 |
| p05 | Kampeerregels per land: wildkamperen en kampvuur | `kamp_wild`, `kamp_vuur` | 110 |
| p06 | Kampterreinen voor groepen (scouts, jeugd, groepscampings) | `kamp_groepsterrein` | 120 |
| p07 | Veiligheid: vrede, verkeer, gezondheidszorg en bosbrand (datasets) | `vei_vrede`, `vei_verkeer`, `vei_zorg`, `vei_brand` | 15 |
| p08 | Teken, rechtstreekse verbinding en openbaar vervoer | `vei_teken`, `reis_direct`, `reis_ov` | 100 |
| p09 | Klimaat in juli: de hoofdsteden | `weer_temp`, `weer_regen` | 45 |
| p10 | Cultuur en mensen: Engels, echt buitenland en gastvrijheid | `cul_engels`, `cul_buitenland`, `cul_gastvrij` | 70 |
| p11 | Scouting en toeristische druk | `scout_leden`, `uniek_toerisme` | 8 |
| p12 | Praktisch: reisdocumenten, roaming en betalen | `prak_documenten`, `prak_roaming`, `prak_betalen` | 120 |

Samen 12 pakketten en 651 geschatte opzoekingen; geen pakket telt meer dan 4 variabelen of ongeveer 120 opzoekingen.

## 6. De beslissingen die ik nam

1. **Geen dubbeltellingen: één feit, één variabele.** De vorige versie telde het prijspeil in 15 vragen. Nu heeft elke kostenvariabele zijn eigen cijfer uit een andere statistische categorie (voeding, recreatie, vervoersdiensten, campingprijs, reiskost). Ze delen onvermijdelijk het algemene prijsniveau van een land, maar geen enkel cijfer komt twee keer voor. Op dezelfde manier staat geen enkele meter in twee categorieën, en afstand telt maar één keer mee (zie volgende punt).
2. **Geen aparte reistijd- of afstandsvariabele.** De reiskost is een vaste formule op wegafstand (OSRM) en vliegafstand. Een aparte variabele 'reistijd' zou dezelfde afstand een tweede keer tellen. In Tier 3 meet `reis_direct` iets anders: hoe rechtstreeks en eenvoudig de verbinding is (treinen, vluchten, overstappen). De reiskost is een *modelprijs*, geen offerte: echte tarieven zijn niet reproduceerbaar op te zoeken (de dag en de aanbieder veranderen elke ronde), de formule wel.
3. **De hoofdstad is de vaste referentie** voor reiskost, reisverbinding, temperatuur en neerslag. De vorige versie gebruikte een 'typische kampregio', maar die keuze kan geen tweede onderzoeker reproduceren. Nadeel: Madrid (ruim 32 °C in juli) staat voor een land waar je ook in de Pyreneeën kunt kamperen. De fout wordt beperkt door het lage gewicht van het weer (3,4 %).
4. **Voeding via Numbeo, de rest van de prijzen via Eurostat.** Eurostat is beter maar mist 12 van de 42 landen (AD, LI, SM, GB, XK, MD, UA, BY, RU, GE, AM, AZ); Numbeo mist er maar 3 (AD, LI, SM). Voor voeding kies ik daarom Numbeo (met de vaste editie 2026-mid) en gebruik ik Eurostat als controle. Voor activiteiten en vervoer bestaat geen landentabel bij Numbeo; daar geldt Eurostat, aangevuld met een vast recept (Numbeo-verhouding) voor de 12 ontbrekende landen.
5. **Avontuur wordt gemeten als natuurlijk potentieel, niet als aanbod.** Voor het echte aanbod (rafting-, kano-, klimaanbieders, wandelroutes) bestaat geen dataset die alle 42 landen dekt én toegankelijk is: Wikiloc, AllTrails, theCrag, ropewiki, GetYourGuide, Viator, Eurocampings en camping.info gaven op 10-10-2026 een 403 voor geautomatiseerde aanvragen (Komoot en Outdooractive gaven een 404 op de geteste pagina en toonden geen landtotaal); Overpass (OpenStreetMap) gaf een time-out of fout; zware Wikidata-queries ook. Ik bouwde Avontuur daarom uit zes meetbare terreinkenmerken: bergen (hoogste punt), kust, binnenwater, rivierafvoer, grotten en kloven, en ruimte (lage bevolkingsdichtheid).
6. **Afgewezen: de Adventure Tourism Development Index (ATDI 2020).** Ik haalde het Excel-bestand op en las het kader: de pijler 'Adventure Activity Resources' bestaat uit het aantal bedreigde diersoorten en de verandering in bosoppervlakte, 'Natural Resources' uit bevolkingsdichtheid, verstedelijking en kustlengte, en de rest uit expertoordelen en economische indexen. Het is geen meting van het aanbod aan avontuurlijke activiteiten en zou bovendien al onze terreinvariabelen dubbel tellen.
7. **Natuurschoonheid van de kampplek als proxy**, niet als wow-cijfer: het aandeel beschermde natuur (`kamp_beschermd`) en de bosbedekking (`kamp_bos`). Nationale parken (Wikipedia-lijst) liet ik vallen omdat ze een deel van het beschermde gebied zijn (dubbeltelling) en omdat de lijst gaten heeft; UNESCO-natuurerfgoed gaf een 403.
8. **Groepsterreinen als telling van vier ja/nee-criteria** (`kamp_groepsterrein`). Een dataset van scoutskampterreinen in Europa bestaat niet (SCENES telt maar ±43 centra wereldwijd; Eurostat telt campings zeer ongelijk: Estland 10, Finland 195). Vier controleerbare criteria (een lijst van minstens 10 terreinen, minstens 3 terreinen met naam voor jeugdgroepen, een scoutscentrum voor buitenlandse groepen, minstens 10 campings met groepsvoorziening) geven een reproduceerbaar 0 tot 4. Dit is de belangrijkste en tegelijk zwakste meter van Tier 2.
9. **Wildkamperen en kampvuur als rubrieken die naar de wet verwijzen**, niet naar reisblogs. Voor groepen van 5 à 6 tenten is de wet vaak strenger dan voor een wandelaar met één tent; het niveau 100 (allemansrecht) geldt dus alleen als het ook voor groepen werkt. Bij regionale verschillen (Schotland, Oostenrijkse deelstaten, Zwitserse kantons) geldt het gemiddelde van het strengste en het soepelste regime dat minstens 25 % van het land beslaat.
10. **Bosbrandrisico en kampvuurregels zijn twee verschillende feiten.** `vei_brand` meet hoeveel land er echt brandt (satellietdata, gemiddelde 2015 tot 2025); `kamp_vuur` meet wat je als scoutsgroep mág doen. Ze zijn gecorreleerd (Zuid-Europa scoort op beide laag) maar niet hetzelfde: Noorwegen brandt nauwelijks en heeft toch een vuurverbod in het bos van april tot september.
11. **Cultuurverschil als telling van drie objectieve kenmerken** (taalfamilie, schrift, religie) in plaats van een expertoordeel. Het is grof, maar herhaalbaar: twee onderzoekers komen op dezelfde score.
12. **Gastvrijheid blijft in het model omdat de groep erom vroeg, maar met het minimale gewicht (1,3 %)** en een expliciete uitstapregel: vindt de onderzoeksagent geen bereikbare bron voor minstens 30 landen, dan wordt de variabele uitgesloten en het gewicht verdeeld over de andere variabelen van de categorie. Ik verwierp de Gallup Migrant Acceptance Index (die zet Noord-Macedonië onderaan, terwijl het in de WEF-enquête van 2013 4e staat voor de houding tegenover bezoekers) en de World Giving Index (meet geven, geen gastvrijheid).
13. **EHIC, drinkwater, reisadvies en Vlaamse groepen zitten niet in het model.** De Europese ziekteverzekeringskaart en het drinkwater verschillen nauwelijks tussen de 42 landen of laten zich niet betrouwbaar meten; het reisadvies is een knock-out (geen variabele); 'hoeveel Vlaamse groepen gaan er al' bestaat in geen enkele publieke dataset (de Eurostat-reeks over Belgische overnachtingen per land bleek te onvolledig).
14. **Regio's en landen.** Elk land krijgt een regio (Zuid-, West-, Noord-, Midden-, Oost-Europa, Balkan, Zuidoost-Europa, Kaukasus) voor presentatie. Kosovo telt mee als land (ISO XK; de Wereldbank gebruikt XKX).

## 7. Wat zwak blijft

Eerlijk gerangschikt van zwak naar sterk, met het totale gewicht erbij:

- **`kamp_groepsterrein` (7,5 %), zekerheid laag.** Geen dataset. Het resultaat hangt af van hoeveel de agent via zoekopdrachten vindt, ook al zijn de criteria expliciet. Hoogste prioriteit voor een menselijke steekproefcontrole bij een eerste ronde.
- **`kost_reis` (8,0 %), zekerheid midden.** Een formule, geen markttarief. Ze meet vooral afstand, met een bodem voor vluchten. Echte zomerprijzen naar Scandinavië, IJsland en Griekenland liggen waarschijnlijk hoger, treinvriendelijke bestemmingen (Nightjet) misschien lager. Het gewicht is hoog omdat de reis in de praktijk de grootste kostenpost is; wie dat te riskant vindt, kan dit gewicht verlagen.
- **`kamp_wild` (6,5 %) en `kamp_vuur` (3,5 %), zekerheid midden.** Rubrieken die op wetteksten steunen, maar de bronnen zijn verspreid en soms verouderd; de feitelijke handhaving verschilt van de wet. Niveaus liggen vaak dicht bij elkaar (bv. 55 versus 80).
- **`kost_kampplaats` (5,0 %), `kost_activiteiten` (3,0 %), `kost_vervoer` (3,5 %).** De cijfers zelf zijn goed, maar voor 14 landen (camping.info) en 12 landen (Eurostat) moet met het Numbeo-recept geschat worden, vooral voor de Kaukasus, Oekraïne, Belarus, Rusland, Moldavië en de mini-staten. Camping.info meet een standplaats met caravan voor twee, niet een groepsterrein voor 12 tenten.
- **De zes avontuurvariabelen (25 %), zekerheid hoog tot midden.** Ze meten wat de natuur toelaat, niet wat er te beleven valt. Een land met hoge bergen maar geen infrastructuur scoort hoog. `av_grotten` leunt op één Duitstalige site met sterke bias; `av_meren` mist rivieren in sommige landen (Servië 0 %).
- **`cul_gastvrij` (1,3 %), zekerheid laag.** De geschikte bron (WEF-enquête) bleek niet te verifiëren; mogelijk valt de variabele uit.
- **`reis_direct` (2,2 %) en `vei_teken` (1,3 %).** De dienstregeling van 2027 bestaat nog niet voor alle bestemmingen, en voor de TBE-cijfers staat geen landentabel in een leesbare pagina (enkel interactieve ECDC-kaarten).
- **`reis_ov` (1,5 %).** Meet het gebruik van bus en trein (Eurostat modal split), niet de kwaliteit; ontbreekt voor 13 landen, juist de Kaukasus en de Balkan waar marshroetka's en minibussen het openbaar vervoer zijn.
- **`vei_brand` (1,3 %).** Satellietdata telt ook landbouwbranden mee (Georgië, Belarus komen te hoog uit).
- **`uniek_toerisme` (2,1 %).** Aankomsten per inwoner zijn niet overal even gedefinieerd (Frankrijk, Kroatië, Tsjechië en Andorra tellen veel dagbezoekers mee); de logschaal dempt dat.

De sterkste meters (volledig dataset, hoge dekking en geverifieerd): `kost_voeding`, `av_bergen`, `av_kust`, `av_rivieren`, `av_ruimte`, `kamp_beschermd`, `kamp_bos`, `vei_vrede`, `vei_verkeer`, `vei_zorg`, `weer_temp`, `weer_regen`, `cul_engels`, `scout_leden`.

## 8. Wat ik gecontroleerd heb (10 oktober 2026)

Ik opende elke dataset-bron die ik vermeld en telde hoeveel van de 42 landen erin zitten. Dekking tussen haakjes; de ontbrekende landen staan bij de bronnen in `model.json`.

| Bron | Dekking | Status |
|---|---|---|
| Numbeo, Cost of Living Index by Country 2026 Mid-Year (title=2026-mid) | 39 van 42 (AD, LI, SM ontbreken) | geverifieerd |
| Eurostat prc_ppp_ind, A0101 / A0109 / A010703, 2024 | 30 van 42 | geverifieerd (API); 2025 stond nog niet in de API |
| camping.info via Reisefroh (editie 2026) | 28 van 42 | geverifieerd (camping.info zelf geeft 403) |
| PiNCAMP Price Analysis 2026 | 12 van 42 | geverifieerd; enkel ter controle |
| Wikipedia kustlijn / hoogste punt / oppervlakte | 42 / 33 / 37 van 42 gezien (de rest staat achter offset 100000) | gedeeltelijk geverifieerd (lange pagina's) |
| showcaves.com Statistics | 39 van 42 | geverifieerd |
| Wereldbank: ER.H2O.INTR.K3, EN.POP.DNST, ER.LND.PTLD.ZS, AG.LND.FRST.ZS, SP.POP.TOTL, ST.INT.ARVL | 38, 41, 40, 41, 42 en 41 van 42 | geverifieerd (JSON-API) |
| Our World in Data: wegdoden (WHO), UHC-index (WHO), natuurbranden (GWIS) | 40, 40 en 41 van 42 | geverifieerd (CSV) |
| Global Peace Index 2026 (Wikipedia) | 37 van 42 gezien (AD, LI, SM afwezig) | geverifieerd (LU en MT niet bevestigd) |
| EF EPI 2025 (Wikipedia) | 32 van 42 | geverifieerd |
| WOSM-census 2019 (Wikipedia) | 40 van 42 | geverifieerd |
| Eurostat tran_hv_psmod (modal split) en Wereldbank IS.RRS.PASG.KM | 29 en 35 van 42 | geverifieerd |
| Wikipedia klimaattabellen (Tbilisi, Vaduz) | 2 hoofdsteden gecontroleerd | geverifieerd; de overige 40 niet apart geopend |
| OSRM publieke demoserver | 39 hoofdsteden gerouteerd (niet IS, MT, CY) | geverifieerd |
| Wikipedia luchthaventabel Brussels Airport, Seat61 België | — | gedeeltelijk geverifieerd |
| FOD Buitenlandse Zaken, pagina Praktische info (nieuw URL-patroon) | Georgië bekeken | gedeeltelijk geverifieerd |
| EU-roamingpagina (Roam Like at Home sinds 1-1-2026 voor UA en MD; Westelijke Balkan: enkel voorstel) | — | geverifieerd |
| WOSM-SCENES-pagina, gruppenhaus.de, EFFIS-startpagina, FAO FRA, Vision of Humanity, GlobalPetrolPrices, EF.com, ECDC TBE-pagina, Wikivoyage Camping, Wikipedia Show-caves-categorie en Religion in Europe | — | pagina bestaat en is bereikbaar (inhoud per land niet doorgenomen) |
| ECDC TBE (landentabel), WEF TTCR (gastvrijheid), Gallup/CAF, operatorpagina's roaming (Proximus, Orange, Telenet), Protected Planet (percentages), FAO AQUASTAT (JavaScript), Eurocampings/ACSI, FOD-pagina's buiten Georgië | — | NIET geverifieerd |

**Bronnen die vanuit de onderzoeksomgeving niet bereikbaar bleken (403, 404, time-out of lege JavaScript-pagina)**: camping.info, Eurocampings, Wikiloc, AllTrails, theCrag, ropewiki, GetYourGuide, Viator en de UNESCO-werelderfgoedlijst (403), Rome2Rio (lege JavaScript-pagina), het CIA World Factbook (in 2026 stopgezet: de Wikipedia-tabellen met CIA-cijfers zijn nu de enige bron), de OECD- en WEF-pagina's (403), Overpass en zware Wikidata-queries (time-out of fout), de WHO GHO-API (502) en de WEF-PDF (504). Wie het model uitbreidt, moet daar rekening mee houden.

## 9. Hoe het model door de rest van de keten gebruikt wordt

1. De 12 onderzoeksagenten (Haiku) werken elk één pakket af en leveren per land: ruwe waarde, bron-URL, jaar, zekerheid, opmerking.
2. De scoringsagent (Sonnet) zet elke ruwe waarde om met de schaal van de meter, past de ontbrekend-regel toe waar nodig en berekent de gewogen eindscore.
3. Dat gebeurt 10 keer onafhankelijk; de mediaan van de eindscores per land beslist. Daarom zijn edities en jaren vastgezet en staan alle ontbrekend-regels in `model.json`, zodat twee rondes niet door een andere keuze tot een ander cijfer komen.
4. Rusland, Oekraïne en Belarus krijgen een score maar doen niet mee aan de rangschikking.

