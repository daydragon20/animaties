# Kampbeeld · Spanje (nummer 3 van 39)

Je maakt voor **Scout Atlas 2027** het kampbeeld van Spanje: hoe ziet een tentenkamp van ±10 dagen in juli/augustus 2027 er daar
concreet uit voor een Vlaamse scoutsgroep (verkenners 14–16 jaar, 10–15 leden, 5 à 6 tenten, beperkt budget)? De film toont voor
dit land één activiteit met foto, naast de winnaar; de verkenner toont alles wat jij verzamelt.
**Regel nummer één: elke activiteit hangt aan één variabele uit het model en aan een concrete, controleerbare plek.** Geen reisfolder-taal.

Werkmap: `/home/user/animaties/scout-atlas-2027/`. Context: `onderzoek/model/MODEL.md` (het model), `bron/scout-atlas-2027-data.json` (de data).
Eindscore van Spanje: 59,3 op 100 (0 van 10 rondes gewonnen).
Categoriescores: Kostprijs 53 · Avontuur 67,1 · Kamperen 60,5 · Veiligheid en gezondheid 31,1 · Reis en vervoer 97,1 · Weer in de zomer 55,5 · Cultuur en mensen 60,7 · Scoutingnetwerk 51,5 · Praktisch 83,6 · Uniek en niet-toeristisch 41,3.

## De sterkste variabelen (score × gewicht), hier moeten de activiteiten uit komen
- **av_bergen** (Bergen en hoogteverschil, Avontuur, gewicht 7 %): score 94,4 op 100 · gemeten: 3.438,6 meter boven zeeniveau · bron: Wikipedia, List of countries by highest point https://en.wikipedia.org/wiki/List_of_countries_by_highest_point
- **kamp_groepsterrein** (Kampterreinen voor groepen, Kamperen, gewicht 7.5 %): score 75 op 100 · gemeten: 75 aantal vervulde criteria (0 tot 4) · niveau: Drie van de vier criteria zijn vervuld. · bron: Nationale scoutsorganisatie van het land (WOSM-lid) en WOSM/SCENES-lijst van scoutscentra https://www.scout.org/SCENES
- **kost_voeding** (Eten in de supermarkt, Kostprijs, gewicht 5.5 %): score 92,9 op 100 · gemeten: 35,7 indexpunten (New York = 100) · bron: Numbeo, Cost of Living Index by Country 2026 Mid-Year (kolom Groceries Index) https://www.numbeo.com/cost-of-living/rankings_by_country.jsp?title=2026-mid
- **kost_reis** (Reiskost heen en terug, Kostprijs, gewicht 8 %): score 46,8 op 100 · gemeten: 239,9 euro per persoon, heen en terug (modelprijs, geen offerte) · bron: OSRM (Open Source Routing Machine), publieke demoserver: wegafstand en rijtijd https://router.project-osrm.org/route/v1/driving/4.3525,50.8467;2.3522,48.8566?overview=false
- **kamp_vuur** (Kampvuur in de zomer, Kamperen, gewicht 3.5 %): score 100 op 100 · gemeten: 100 niveau 0 tot 100 (rubriek) · niveau: Open vuur is op een kampterrein toegestaan met toestemming van de eigenaar of beheerder, en er geldt in juli en augustus geen structureel verbod in het land of in grote regio's; alleen tijdelijke, plaatselijke verboden bij extreme droogte. · bron: Nationale brandweer-, bosbeheer- of milieudienst van het land (regels voor open vuur) https://forest-fire.emergency.copernicus.eu/
- **av_rivieren** (Rivieren, watervallen en wildwater, Avontuur, gewicht 3.5 %): score 88,5 op 100 · gemeten: 808,2 mm water per jaar · bron: Wereldbank WDI, ER.H2O.INTR.K3 (hernieuwbare interne zoetwatervoorraden) en AG.LND.TOTL.K2 (landoppervlakte) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.H2O.INTR.K3?format=json&date=2000:2024&mrnev=1&per_page=100
- **av_meren** (Meren en binnenwater, Avontuur, gewicht 3.5 %): score 86,3 op 100 · gemeten: 7,27 % binnenwater van de oppervlakte · bron: Wikipedia, List of countries and dependencies by area https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area
- **av_grotten** (Grotten en kloven, Avontuur, gewicht 3 %): score 100 op 100 · gemeten: 150 aantal grotten en kloven · bron: showcaves.com, Statistics (aantal per land en categorie) https://www.showcaves.com/english/explain/Index/Statistics.html
- **kost_vervoer** (Prijs van vervoer ter plaatse, Kostprijs, gewicht 3.5 %): score 69 op 100 · gemeten: 90,7 EU27 = 100 · bron: Eurostat, prc_ppp_ind (A010703 Transport services) https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_ppp_ind?format=JSON&lang=EN&na_item=PLI_EU27_2020&ppp_cat=A010703&time=2024
- **reis_direct** (Rechtstreekse verbinding vanuit België, Reis en vervoer, gewicht 2.2 %): score 100 op 100 · gemeten: 100 niveau 0 tot 100 (rubriek) · niveau: Rechtstreekse trein of nachttrein (zonder overstap) van Brussel naar de hoofdstad of een stad binnen 150 km ervan, met een reistijd van hoogstens 14 uur. · bron: Wikipedia, Brussels Airport en Brussels South Charleroi Airport (tabellen Airlines and destinations) https://en.wikipedia.org/wiki/Brussels_Airport
- **kamp_beschermd** (Beschermde natuur rond de kampplek, Kamperen, gewicht 2.5 %): score 87,3 op 100 · gemeten: 35,5 % van het landoppervlak · bron: Wereldbank WDI, ER.LND.PTLD.ZS (terrestrial protected areas), bron Protected Planet https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.LND.PTLD.ZS?format=json&date=2020:2025&mrnev=1&per_page=100
- **kamp_bos** (Bos rond de kampplek, Kamperen, gewicht 2 %): score 100 op 100 · gemeten: 70 % van het landoppervlak · bron: Wereldbank WDI, AG.LND.FRST.ZS (forest area) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/AG.LND.FRST.ZS?format=json&date=2018:2024&mrnev=1&per_page=100
- **kost_kampplaats** (Prijs van een kampeerplek, Kostprijs, gewicht 5 %): score 39,8 op 100 · gemeten: 30,9 euro per nacht (2 personen + standplaats) · bron: camping.info, Preisvergleich: So viel kostet Camping in Europa (tabel overgenomen door Reisefroh) https://reisefroh.de/news/campingpreise-in-europa-2025/
- **weer_temp** (Temperatuur in juli, Weer in de zomer, gewicht 1.8 %): score 100 op 100 · gemeten: 23,2 °C (gemiddelde maximum in juli) · bron: Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) https://en.wikipedia.org/wiki/Tbilisi

## De zwakste (niet verzwijgen in de uitleg als het relevant is, bv. weer of kosten)
- **kost_activiteiten** (Prijs van activiteiten en uitstappen, Kostprijs, gewicht 3 %): score 0 op 100 · gemeten: 160 EU27 = 100 · bron: Eurostat, prc_ppp_ind (A0109 Recreation and culture) https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_ppp_ind?format=JSON&lang=EN&na_item=PLI_EU27_2020&ppp_cat=A0109&time=2024
- **av_kust** (Kust en zee, Avontuur, gewicht 4.5 %): score 0 op 100 · gemeten: 10 kilometer kustlijn · bron: Wikipedia, List of countries by length of coastline (kolom CIA) https://en.wikipedia.org/wiki/List_of_countries_by_length_of_coastline
- **kamp_wild** (Wildkamperen toegestaan, Kamperen, gewicht 6.5 %): score 0 op 100 · gemeten: 0 niveau 0 tot 100 (rubriek) · niveau: Verboden buiten erkende campings en actief gehandhaafd met boetes. Ter oriëntatie: PT, GR (wet 5170/2025, boetes tot 3.000 euro), HR, SK. · bron: Officiële overheids- of natuurbeheerpagina van het land (wet op natuurtoegang, kampeerwet, bosbeheer) https://en.wikipedia.org/wiki/Right_of_public_access_to_the_wilderness
- **weer_regen** (Neerslag in juli, Weer in de zomer, gewicht 1.6 %): score 5,4 op 100 · gemeten: 158,3 mm neerslag in juli · bron: Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) https://en.wikipedia.org/wiki/Vaduz

## Referentieonderzoek kamperen
(nog niet beschikbaar)

## Wat je oplevert
1. `bron/kampbeeld/es.json`:
```json
{
 "iso2": "ES", "naam": "Spanje", "datum": "JJJJ-MM-DD",
 "slogan": "één zin van hoogstens 70 tekens die het kamp daar samenvat, concreet (plaatsnamen mogen)",
 "activiteiten": [
  { "titel": "Kajakken op de Nærøyfjord", "plek": "Gudvangen, Vestland", "variabele": "av_kust",
    "uitleg": "max 220 tekens: wat doe je, waarom kan dat juist hier, wat kost het of wat is gratis; concreet en controleerbaar",
    "bron": { "naam": "Visit Norway, Nærøyfjord", "url": "https://..." }, "foto": 0 }
 ],
 "kampplaatsen": [ { "naam": "...", "plaats": "...", "url": "https://...", "details": "voor jeugdgroepen met tenten · capaciteit of prijs als je die ziet · afstand tot station" } ],
 "fotos": [ { "bestand": "es-1.jpg", "bijschrift": "wat je ziet, met plaatsnaam", "auteur": "naam of gebruikersnaam op Commons", "licentie": "CC BY-SA 4.0", "bron_url": "https://commons.wikimedia.org/wiki/File:..." } ],
 "bronnen": [ { "naam": "...", "url": "..." } ],
 "problemen": [ "..." ]
}
```
2. De foto's in `bron/foto/es-1.jpg` … (JPEG, langste zijde 1600 px, hoogstens 350 KB per foto).

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
  `convert in.jpg -auto-orient -resize 1600x1600\> -strip -interlace Plane -quality 80 /home/user/animaties/scout-atlas-2027/bron/foto/es-N.jpg`.
  Kies liggende foto's (breder dan hoog) van landschap of activiteit, scherp en zonder tekst of logo; geen close-ups van herkenbare kinderen.
  Elke foto hoort bij één activiteit (`foto`-index) of bij de kampplaats. Vul auteur en licentie exact in zoals Commons ze geeft (Artist mag
  ontdaan worden van HTML). Lukt een download niet, neem een andere foto; verzin nooit een licentie.
- **Bronnen**: officiële toerismesites, nationale parken, scoutsorganisaties, Wikipedia/Wikivoyage. Reisblogs alleen als wegwijzer.
- **Zoekbudget**: WebSearch is schaars (gedeeld): hoogstens 15 keer voor dit land, alleen als je met WebFetch en de Commons-API niet verder komt.
- Schrijf niets anders dan het JSON-bestand en de foto's. Controleer op het einde: `cd /home/user/animaties/scout-atlas-2027/onderzoek && node valideer-kampbeeld.mjs ES`
  moet "Kampbeeld in orde" zeggen; herstel fouten tot het zover is.

Rapporteer in hoogstens 12 regels: de activiteiten (titel + variabele), het aantal foto's en kampplaatsen, en wat je niet kon bevestigen.
