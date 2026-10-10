# Kampbeeld · Zwitserland (nummer 2 van 39)

Je maakt voor **Scout Atlas 2027** het kampbeeld van Zwitserland: hoe ziet een tentenkamp van ±10 dagen in juli/augustus 2027 er daar
concreet uit voor een Vlaamse scoutsgroep (verkenners 14–16 jaar, 10–15 leden, 5 à 6 tenten, beperkt budget)? De film toont voor
dit land één activiteit met foto, naast de winnaar; de verkenner toont alles wat jij verzamelt.
**Regel nummer één: elke activiteit hangt aan één variabele uit het model en aan een concrete, controleerbare plek.** Geen reisfolder-taal.

Werkmap: `/home/user/animaties/scout-atlas-2027/`. Context: `onderzoek/model/MODEL.md` (het model), `bron/scout-atlas-2027-data.json` (de data).
Eindscore van Zwitserland: 62,5 op 100 (0 van 10 rondes gewonnen).
Categoriescores: Kostprijs 65,3 · Avontuur 77,9 · Kamperen 60,6 · Veiligheid en gezondheid 20,5 · Reis en vervoer 48,7 · Weer in de zomer 55,1 · Cultuur en mensen 69,3 · Scoutingnetwerk 65,9 · Praktisch 57,2 · Uniek en niet-toeristisch 60,2.

## De sterkste variabelen (score × gewicht), hier moeten de activiteiten uit komen
- **kamp_wild** (Wildkamperen toegestaan, Kamperen, gewicht 6.5 %): score 100 op 100 · gemeten: 100 niveau 0 tot 100 (rubriek) · niveau: Allemansrecht: tentkamperen op onbebouwde, niet-landbouwgrond is wettelijk gegarandeerd zonder toestemming, ook voor groepen (hooguit melden bij een grote groep of bij meer dan 2 nachten op dezelfde plek). Ter oriëntatie: NO, SE, FI. · bron: Officiële overheids- of natuurbeheerpagina van het land (wet op natuurtoegang, kampeerwet, bosbeheer) https://en.wikipedia.org/wiki/Right_of_public_access_to_the_wilderness
- **av_bergen** (Bergen en hoogteverschil, Avontuur, gewicht 7 %): score 91,6 op 100 · gemeten: 3.253,8 meter boven zeeniveau · bron: Wikipedia, List of countries by highest point https://en.wikipedia.org/wiki/List_of_countries_by_highest_point
- **kost_voeding** (Eten in de supermarkt, Kostprijs, gewicht 5.5 %): score 82,7 op 100 · gemeten: 43,9 indexpunten (New York = 100) · bron: Numbeo, Cost of Living Index by Country 2026 Mid-Year (kolom Groceries Index) https://www.numbeo.com/cost-of-living/rankings_by_country.jsp?title=2026-mid
- **kost_kampplaats** (Prijs van een kampeerplek, Kostprijs, gewicht 5 %): score 81,5 op 100 · gemeten: 19,2 euro per nacht (2 personen + standplaats) · bron: camping.info, Preisvergleich: So viel kostet Camping in Europa (tabel overgenomen door Reisefroh) https://reisefroh.de/news/campingpreise-in-europa-2025/
- **av_kust** (Kust en zee, Avontuur, gewicht 4.5 %): score 81,1 op 100 · gemeten: 1.545,8 kilometer kustlijn · bron: Wikipedia, List of countries by length of coastline (kolom CIA) https://en.wikipedia.org/wiki/List_of_countries_by_length_of_coastline
- **kamp_vuur** (Kampvuur in de zomer, Kamperen, gewicht 3.5 %): score 100 op 100 · gemeten: 100 niveau 0 tot 100 (rubriek) · niveau: Open vuur is op een kampterrein toegestaan met toestemming van de eigenaar of beheerder, en er geldt in juli en augustus geen structureel verbod in het land of in grote regio's; alleen tijdelijke, plaatselijke verboden bij extreme droogte. · bron: Nationale brandweer-, bosbeheer- of milieudienst van het land (regels voor open vuur) https://forest-fire.emergency.copernicus.eu/
- **kost_reis** (Reiskost heen en terug, Kostprijs, gewicht 8 %): score 37,6 op 100 · gemeten: 275,1 euro per persoon, heen en terug (modelprijs, geen offerte) · bron: OSRM (Open Source Routing Machine), publieke demoserver: wegafstand en rijtijd https://router.project-osrm.org/route/v1/driving/4.3525,50.8467;2.3522,48.8566?overview=false
- **av_ruimte** (Ruimte en wildernis, Avontuur, gewicht 3.5 %): score 80,7 op 100 · gemeten: 22 inwoners per km² · bron: Wereldbank WDI, EN.POP.DNST (bevolkingsdichtheid) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/EN.POP.DNST?format=json&date=2018:2024&mrnev=1&per_page=100
- **kost_activiteiten** (Prijs van activiteiten en uitstappen, Kostprijs, gewicht 3 %): score 87,5 op 100 · gemeten: 63,8 EU27 = 100 · bron: Eurostat, prc_ppp_ind (A0109 Recreation and culture) https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_ppp_ind?format=JSON&lang=EN&na_item=PLI_EU27_2020&ppp_cat=A0109&time=2024
- **av_rivieren** (Rivieren, watervallen en wildwater, Avontuur, gewicht 3.5 %): score 72,4 op 100 · gemeten: 539,3 mm water per jaar · bron: Wereldbank WDI, ER.H2O.INTR.K3 (hernieuwbare interne zoetwatervoorraden) en AG.LND.TOTL.K2 (landoppervlakte) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.H2O.INTR.K3?format=json&date=2000:2024&mrnev=1&per_page=100
- **av_grotten** (Grotten en kloven, Avontuur, gewicht 3 %): score 69,4 op 100 · gemeten: 32,4 aantal grotten en kloven · bron: showcaves.com, Statistics (aantal per land en categorie) https://www.showcaves.com/english/explain/Index/Statistics.html
- **kost_vervoer** (Prijs van vervoer ter plaatse, Kostprijs, gewicht 3.5 %): score 59,4 op 100 · gemeten: 101,7 EU27 = 100 · bron: Eurostat, prc_ppp_ind (A010703 Transport services) https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_ppp_ind?format=JSON&lang=EN&na_item=PLI_EU27_2020&ppp_cat=A010703&time=2024
- **av_meren** (Meren en binnenwater, Avontuur, gewicht 3.5 %): score 56,6 op 100 · gemeten: 3,47 % binnenwater van de oppervlakte · bron: Wikipedia, List of countries and dependencies by area https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area
- **kamp_groepsterrein** (Kampterreinen voor groepen, Kamperen, gewicht 7.5 %): score 25 op 100 · gemeten: 25 aantal vervulde criteria (0 tot 4) · niveau: Eén van de vier criteria is vervuld. · bron: Nationale scoutsorganisatie van het land (WOSM-lid) en WOSM/SCENES-lijst van scoutscentra https://www.scout.org/SCENES

## De zwakste (niet verzwijgen in de uitleg als het relevant is, bv. weer of kosten)
- **kamp_beschermd** (Beschermde natuur rond de kampplek, Kamperen, gewicht 2.5 %): score 0 op 100 · gemeten: 5 % van het landoppervlak · bron: Wereldbank WDI, ER.LND.PTLD.ZS (terrestrial protected areas), bron Protected Planet https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.LND.PTLD.ZS?format=json&date=2020:2025&mrnev=1&per_page=100
- **prak_betalen** (Betalen en geld opnemen, Praktisch, gewicht 1.3 %): score 0 op 100 · gemeten: 0 niveau 0 tot 100 (rubriek) · niveau: Belgische bankkaarten werken niet of nauwelijks door sancties of afsluiting van het betaalnetwerk (bv. RU, BY). · bron: Europese Centrale Bank en Wikipedia, Eurozone en landen die de euro gebruiken https://en.wikipedia.org/wiki/Eurozone
- **vei_teken** (Tekenencefalitis (TBE), Veiligheid en gezondheid, gewicht 1.3 %): score 2,1 op 100 · gemeten: 13,5 gevallen per 100.000 inwoners per jaar · bron: ECDC, notification rates of locally acquired TBE cases (kaart en Surveillance Atlas) https://www.ecdc.europa.eu/en/publications-data/notification-rates-locally-acquired-tick-borne-encephalitis-cases-reported-2023
- **reis_ov** (Openbaar vervoer ter plaatse, Reis en vervoer, gewicht 1.5 %): score 2,8 op 100 · gemeten: 2,74 % van het personenvervoer per bus of trein · bron: Eurostat, tran_hv_psmod (modal split van het personenvervoer) https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tran_hv_psmod?format=JSON&lang=EN&unit=PC&sinceTimePeriod=2021

## Wat het referentieonderzoek over kamperen al vond (controleer het, gebruik het)
- Wildkamperen (voorstel 55): ZGB Art. 699: bos en weide zijn voor iedereen toegankelijk in plaatselijk gebruikelijke mate (dit is geen recht om te kamperen); kamperen wordt per kanton en gemeente geregeld: sommige kantons staan 1 nacht toe, de meeste kantons verbieden groepen; boven de boomgrens vaak toegestaan · Beobachter/TCS, Wild campen: Wo das erlaubt ist - der schweizweite Überblick (6 juli 2026) https://www.beobachter.ch/arbeit-bildung/freizeit/hier-konnen-sie-in-ruhe-ihr-zelt-aufschlagen-624417 · ÖAMTC/ÖCC, Wildcamping in Europa: ein Überblick (17 juli 2024) https://www.oeamtc.at/presse/oecc-informiert-wildcamping-in-europa-ein-ueberblick-72446068 · Fedlex, Schweizerisches Zivilgesetzbuch (ZGB) Art. 699 (niet geopend) https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de
- Kampvuur (voorstel 75): Kantonale vuurverboden in bos en nabij bos bij hoog bosbrandgevaar (bundesportaal waldbrandgefahr.ch, BAFU); kampvuur op vuurplaatsen anders mogelijk · BAFU, waldbrandgefahr.ch (aktuelle Gefahrenlage en Massnahmen) https://www.waldbrandgefahr.ch/
- Kampterreinen (voorstel 25):
  - A: nee pfadiheime.ch gaf 403 (Cloudflare); gruppenhaus.de toont maar 1 Zeltplatz in Zwitserland. 
  - B: nee Geen drie Zwitserse terreinen met prijs of contact geopend; KISC is één terrein. 
    - Kandersteg International Scout Centre (KISC) (Kandersteg (Berner Oberland)) https://www.kisc.ch/ · Sinds 1923 het eerste wereldwijde scoutscentrum; menu 'Book Camping & Cooking Rentals', 'Book accommodation', 'Accommodation', 'Rentals'; prijzen niet gelezen (kisc.ch/camping gaf 404).
  - C: ja KISC (Kandersteg International Scout Centre) is een SCENES-centrum van WOSM en bij uitstek bedoeld voor internationale scoutsgroepen. https://www.kisc.ch/
  - D: nee Niet onderzocht. 

## Wat je oplevert
1. `bron/kampbeeld/ch.json`:
```json
{
 "iso2": "CH", "naam": "Zwitserland", "datum": "JJJJ-MM-DD",
 "slogan": "één zin van hoogstens 70 tekens die het kamp daar samenvat, concreet (plaatsnamen mogen)",
 "activiteiten": [
  { "titel": "Kajakken op de Nærøyfjord", "plek": "Gudvangen, Vestland", "variabele": "av_kust",
    "uitleg": "max 220 tekens: wat doe je, waarom kan dat juist hier, wat kost het of wat is gratis; concreet en controleerbaar",
    "bron": { "naam": "Visit Norway, Nærøyfjord", "url": "https://..." }, "foto": 0 }
 ],
 "kampplaatsen": [ { "naam": "...", "plaats": "...", "url": "https://...", "details": "voor jeugdgroepen met tenten · capaciteit of prijs als je die ziet · afstand tot station" } ],
 "fotos": [ { "bestand": "ch-1.jpg", "bijschrift": "wat je ziet, met plaatsnaam", "auteur": "naam of gebruikersnaam op Commons", "licentie": "CC BY-SA 4.0", "bron_url": "https://commons.wikimedia.org/wiki/File:..." } ],
 "bronnen": [ { "naam": "...", "url": "..." } ],
 "problemen": [ "..." ]
}
```
2. De foto's in `bron/foto/ch-1.jpg` … (JPEG, langste zijde 1600 px, hoogstens 350 KB per foto).

## Eisen
- **Activiteiten: minstens 4**, elk met een bestaande `variabele`-id uit de lijst hierboven (verschillende variabelen, hoogstens 2 per categorie),
  een concrete plek (nationaal park, fjord, meer, rivier, grot, kampterrein, stad) en een bron die je zelf geopend hebt (WebFetch of curl).
  Zet de activiteiten in volgorde van kracht: de eerste vijf komen in de film. Minstens één gaat over kamperen zelf (vrij kamperen, een
  kampterrein, kampvuur) en minstens één over de kostprijs als dat een sterke kant is. Wees eerlijk: zeg in de uitleg als iets alleen in
  augustus kan, een vergunning vraagt of geld kost.
- **Kampplaatsen: minstens 2** die aan jeugd- of scoutsgroepen met tenten verhuren, met werkende URL (zelf geopend). Gebruik de
  referentielijst hierboven als vertrekpunt. Noteer afstand tot een station of bushalte als je die vindt.
- **Foto's: minstens 3**, alleen van Wikimedia Commons, alleen met licentie CC0, Public domain, CC BY of CC BY-SA (elke versie).
  Werkwijze: zoek via de Commons-API, bv. `curl -sS -A "ScoutAtlas/1.0 (nathan@charut.be)" "https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=20&format=json&srsearch=Naeroyfjord+kayak"`,
  haal dan de licentie en de URL op met `action=query&titles=File:...&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&format=json`
  (velden LicenseShortName, Artist, ImageDescription; neem de `thumburl`), download de thumb met curl en verklein:
  `convert in.jpg -auto-orient -resize 1600x1600\> -strip -interlace Plane -quality 80 /home/user/animaties/scout-atlas-2027/bron/foto/ch-N.jpg`.
  Kies liggende foto's (breder dan hoog) van landschap of activiteit, scherp en zonder tekst of logo; geen close-ups van herkenbare kinderen.
  Elke foto hoort bij één activiteit (`foto`-index) of bij de kampplaats. Vul auteur en licentie exact in zoals Commons ze geeft (Artist mag
  ontdaan worden van HTML). Lukt een download niet, neem een andere foto; verzin nooit een licentie.
- **Bronnen**: officiële toerismesites, nationale parken, scoutsorganisaties, Wikipedia/Wikivoyage. Reisblogs alleen als wegwijzer.
- **Zoekbudget**: WebSearch is schaars (gedeeld): hoogstens 15 keer voor dit land, alleen als je met WebFetch en de Commons-API niet verder komt.
- Schrijf niets anders dan het JSON-bestand en de foto's. Controleer op het einde: `cd /home/user/animaties/scout-atlas-2027/onderzoek && node valideer-kampbeeld.mjs CH`
  moet "Kampbeeld in orde" zeggen; herstel fouten tot het zover is.

Rapporteer in hoogstens 12 regels: de activiteiten (titel + variabele), het aantal foto's en kampplaatsen, en wat je niet kon bevestigen.
