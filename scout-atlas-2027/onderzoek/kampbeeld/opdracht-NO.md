# Kampbeeld · Noorwegen (nummer 1 van 39)

Je maakt voor **Scout Atlas 2027** het kampbeeld van Noorwegen: hoe ziet een tentenkamp van ±10 dagen in juli/augustus 2027 er daar
concreet uit voor een Vlaamse scoutsgroep (verkenners 14–16 jaar, 10–15 leden, 5 à 6 tenten, beperkt budget)? De film toont voor
dit land vijf activiteiten met foto, de slaapplaats, en daarna; de verkenner toont alles wat jij verzamelt.
**Regel nummer één: elke activiteit hangt aan één variabele uit het model en aan een concrete, controleerbare plek.** Geen reisfolder-taal.

Werkmap: `/home/user/animaties/scout-atlas-2027/`. Context: `onderzoek/model/MODEL.md` (het model), `bron/scout-atlas-2027-data.json` (de data).
Eindscore van Noorwegen: 66,3 op 100 (10 van 10 rondes gewonnen).
Categoriescores: Kostprijs 76,3 · Avontuur 55,3 · Kamperen 77,1 · Veiligheid en gezondheid 54,7 · Reis en vervoer 59,5 · Weer in de zomer 55 · Cultuur en mensen 83,7 · Scoutingnetwerk 25,3 · Praktisch 51,1 · Uniek en niet-toeristisch 74.

## De sterkste variabelen (score × gewicht), hier moeten de activiteiten uit komen
- **kost_reis** (Reiskost heen en terug, Kostprijs, gewicht 8 %): score 94,4 op 100 · gemeten: 56,5 euro per persoon, heen en terug (modelprijs, geen offerte) · bron: OSRM (Open Source Routing Machine), publieke demoserver: wegafstand en rijtijd https://router.project-osrm.org/route/v1/driving/4.3525,50.8467;2.3522,48.8566?overview=false
- **av_bergen** (Bergen en hoogteverschil, Avontuur, gewicht 7 %): score 84,4 op 100 · gemeten: 2.786,4 meter boven zeeniveau · bron: Wikipedia, List of countries by highest point https://en.wikipedia.org/wiki/List_of_countries_by_highest_point
- **kamp_groepsterrein** (Kampterreinen voor groepen, Kamperen, gewicht 7.5 %): score 75 op 100 · gemeten: 75 aantal vervulde criteria (0 tot 4) · niveau: Drie van de vier criteria zijn vervuld. · bron: Nationale scoutsorganisatie van het land (WOSM-lid) en WOSM/SCENES-lijst van scoutscentra https://www.scout.org/SCENES
- **kost_voeding** (Eten in de supermarkt, Kostprijs, gewicht 5.5 %): score 100 op 100 · gemeten: 30 indexpunten (New York = 100) · bron: Numbeo, Cost of Living Index by Country 2026 Mid-Year (kolom Groceries Index) https://www.numbeo.com/cost-of-living/rankings_by_country.jsp?title=2026-mid
- **kamp_wild** (Wildkamperen toegestaan, Kamperen, gewicht 6.5 %): score 80 op 100 · gemeten: 80 niveau 0 tot 100 (rubriek) · niveau: Beperkt vrij kamperen: 1 nacht (bivak) zonder toestemming op onbeschermde natuurgrond of boven de boomgrens, óf een gedoogregeling die uitdrukkelijk groepen van 5 à 6 tenten toelaat. Ter oriëntatie: delen van Oostenrijk (boven de boomgrens in Karinthië, Stiermarken en Salzburg). · bron: Officiële overheids- of natuurbeheerpagina van het land (wet op natuurtoegang, kampeerwet, bosbeheer) https://en.wikipedia.org/wiki/Right_of_public_access_to_the_wilderness
- **kost_kampplaats** (Prijs van een kampeerplek, Kostprijs, gewicht 5 %): score 92 op 100 · gemeten: 16,3 euro per nacht (2 personen + standplaats) · bron: camping.info, Preisvergleich: So viel kostet Camping in Europa (tabel overgenomen door Reisefroh) https://reisefroh.de/news/campingpreise-in-europa-2025/
- **av_grotten** (Grotten en kloven, Avontuur, gewicht 3 %): score 100 op 100 · gemeten: 150 aantal grotten en kloven · bron: showcaves.com, Statistics (aantal per land en categorie) https://www.showcaves.com/english/explain/Index/Statistics.html
- **av_meren** (Meren en binnenwater, Avontuur, gewicht 3.5 %): score 83,1 op 100 · gemeten: 6,62 % binnenwater van de oppervlakte · bron: Wikipedia, List of countries and dependencies by area https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area
- **kamp_vuur** (Kampvuur in de zomer, Kamperen, gewicht 3.5 %): score 75 op 100 · gemeten: 75 niveau 0 tot 100 (rubriek) · niveau: Open vuur is toegestaan op aangewezen vuurplaatsen of na een eenvoudige melding of toestemming van gemeente of brandweer; er zijn periodieke zomerbeperkingen per regio (brandgevaarkaarten, prefectuurbesluiten, Waldbrandstufen) die kampvuur geregeld tijdelijk verbieden. · bron: Nationale brandweer-, bosbeheer- of milieudienst van het land (regels voor open vuur) https://forest-fire.emergency.copernicus.eu/
- **kamp_beschermd** (Beschermde natuur rond de kampplek, Kamperen, gewicht 2.5 %): score 90,3 op 100 · gemeten: 37,8 % van het landoppervlak · bron: Wereldbank WDI, ER.LND.PTLD.ZS (terrestrial protected areas), bron Protected Planet https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.LND.PTLD.ZS?format=json&date=2020:2025&mrnev=1&per_page=100
- **reis_direct** (Rechtstreekse verbinding vanuit België, Reis en vervoer, gewicht 2.2 %): score 100 op 100 · gemeten: 100 niveau 0 tot 100 (rubriek) · niveau: Rechtstreekse trein of nachttrein (zonder overstap) van Brussel naar de hoofdstad of een stad binnen 150 km ervan, met een reistijd van hoogstens 14 uur. · bron: Wikipedia, Brussels Airport en Brussels South Charleroi Airport (tabellen Airlines and destinations) https://en.wikipedia.org/wiki/Brussels_Airport
- **vei_vrede** (Vrede en veiligheid, Veiligheid en gezondheid, gewicht 3 %): score 68,4 op 100 · gemeten: 1,86 GPI-score (1 tot 5) · bron: Wikipedia, Global Peace Index (landentabel) https://en.wikipedia.org/wiki/Global_Peace_Index
- **weer_temp** (Temperatuur in juli, Weer in de zomer, gewicht 1.8 %): score 100 op 100 · gemeten: 25,5 °C (gemiddelde maximum in juli) · bron: Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) https://en.wikipedia.org/wiki/Tbilisi
- **cul_buitenland** (Echt buitenland-gevoel, Cultuur en mensen, gewicht 1.7 %): score 100 op 100 · gemeten: 100 aantal 'ja'-antwoorden (0 tot 3) · niveau: Drie keer 'ja' (A, B en C). Ter oriëntatie: GR, BG, RS, GE, AM, UA, BY, RU, MK, CY. · bron: Wikipedia, Languages of <land> en Religion in <land> https://en.wikipedia.org/wiki/Languages_of_Europe

## De zwakste (niet verzwijgen in de uitleg als het relevant is, bv. weer of kosten)
- **av_rivieren** (Rivieren, watervallen en wildwater, Avontuur, gewicht 3.5 %): score 0 op 100 · gemeten: 50 mm water per jaar · bron: Wereldbank WDI, ER.H2O.INTR.K3 (hernieuwbare interne zoetwatervoorraden) en AG.LND.TOTL.K2 (landoppervlakte) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.H2O.INTR.K3?format=json&date=2000:2024&mrnev=1&per_page=100
- **reis_ov** (Openbaar vervoer ter plaatse, Reis en vervoer, gewicht 1.5 %): score 0 op 100 · gemeten: 2 % van het personenvervoer per bus of trein · bron: Eurostat, tran_hv_psmod (modal split van het personenvervoer) https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tran_hv_psmod?format=JSON&lang=EN&unit=PC&sinceTimePeriod=2021
- **weer_regen** (Neerslag in juli, Weer in de zomer, gewicht 1.6 %): score 4,4 op 100 · gemeten: 162,3 mm neerslag in juli · bron: Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) https://en.wikipedia.org/wiki/Vaduz
- **vei_verkeer** (Verkeersveiligheid, Veiligheid en gezondheid, gewicht 1.4 %): score 6,4 op 100 · gemeten: 15,5 doden per 100.000 inwoners · bron: Our World in Data / WHO, death-rate-from-road-accidents-ghe (2021) https://ourworldindata.org/grapher/death-rate-from-road-accidents-ghe.csv?csvType=filtered&time=2021

## Wat het referentieonderzoek over kamperen al vond (controleer het, gebruik het)
- Wildkamperen (voorstel 100): Friluftsloven (1957) §9: telting in utmark mag; niet dichter dan 150 m bij een bewoond huis/hytte; langer dan 2 dagen op dezelfde plek alleen met toestemming (uitzondering: hooggebergte en gebied ver van bebouwing) · Lovdata, Lov om friluftslivet (friluftsloven) LOV-1957-06-28-16 https://lovdata.no/dokument/NL/lov/1957-06-28-16 · Wikipedia, Freedom to roam (landsecties) https://en.wikipedia.org/wiki/Freedom_to_roam
- Kampvuur (voorstel 50): Forskrift om brannforebygging (FOR-2015-12-17-1710) §3: van 15 april tot 15 september verboden om vuur te maken in of nabij bos en andere utmark, tenzij de gemeente toestemming geeft, de gemeenteraad lokaal toelaat of het duidelijk is dat geen brand kan ontstaan · Lovdata, Forskrift om brannforebygging §3 https://lovdata.no/dokument/SF/forskrift/2015-12-17-1710 · Wikipedia, Freedom to roam (landsecties) https://en.wikipedia.org/wiki/Freedom_to_roam
- Kampterreinen (voorstel 0):
  - A: nee Geen landelijke lijst van >=10 leirsteder gevonden: speiding.no is een Angular-app zonder leesbare inhoud voor curl/WebFetch, speiderne.no heeft geen leirsteder-lijst. Zoekopdracht 'speiderhytter leirsteder oversikt Norge' gaf alleen losse plaatsen. 
  - B: nee Slechts 1 terrein met naam, plaats, prijs en capaciteit geopend (Kvamsøy); er moeten 3 zijn. 
    - Kvamsøy Leirsted (Hordaland krins, Norges Speiderforbund) (Kvamsøy bij Øystese (Hordaland)) https://ut.no/hytte/101111465 · Eigendom van Hordaland krins; speiders 60 NOK p.p. per nacht, minimum 1800 NOK per weekend (incl. boot); ruimte voor tenten voor minstens 200 personen; huis met ~25 bedden; bereikbaar per boot.
  - C: nee Geen SCENES-centrum in Noorwegen; geen geopende pagina van Norges Speiderforbund die een centrum voor buitenlandse groepen toont. 
  - D: nee Geen campingportaal met groepsfilter bereikbaar gevonden (niet gezocht op camping.no). 

## Wat je oplevert
1. `bron/kampbeeld/no.json`:
```json
{
 "iso2": "NO", "naam": "Noorwegen", "datum": "JJJJ-MM-DD",
 "slogan": "één zin van hoogstens 70 tekens die het kamp daar samenvat, concreet (plaatsnamen mogen)",
 "activiteiten": [
  { "titel": "Kajakken op de Nærøyfjord", "plek": "Gudvangen, Vestland", "variabele": "av_kust",
    "uitleg": "max 220 tekens: wat doe je, waarom kan dat juist hier, wat kost het of wat is gratis; concreet en controleerbaar",
    "bron": { "naam": "Visit Norway, Nærøyfjord", "url": "https://..." }, "foto": 0 }
 ],
 "kampplaatsen": [ { "naam": "...", "plaats": "...", "url": "https://...", "details": "voor jeugdgroepen met tenten · capaciteit of prijs als je die ziet · afstand tot station" } ],
 "fotos": [ { "bestand": "no-1.jpg", "bijschrift": "wat je ziet, met plaatsnaam", "auteur": "naam of gebruikersnaam op Commons", "licentie": "CC BY-SA 4.0", "bron_url": "https://commons.wikimedia.org/wiki/File:..." } ],
 "bronnen": [ { "naam": "...", "url": "..." } ],
 "problemen": [ "..." ]
}
```
2. De foto's in `bron/foto/no-1.jpg` … (JPEG, langste zijde 1600 px, hoogstens 350 KB per foto).

## Eisen
- **Activiteiten: minstens 6**, elk met een bestaande `variabele`-id uit de lijst hierboven (verschillende variabelen, hoogstens 2 per categorie),
  een concrete plek (nationaal park, fjord, meer, rivier, grot, kampterrein, stad) en een bron die je zelf geopend hebt (WebFetch of curl).
  Zet de activiteiten in volgorde van kracht: de eerste vijf komen in de film. Minstens één gaat over kamperen zelf (vrij kamperen, een
  kampterrein, kampvuur) en minstens één over de kostprijs als dat een sterke kant is. Wees eerlijk: zeg in de uitleg als iets alleen in
  augustus kan, een vergunning vraagt of geld kost.
- **Kampplaatsen: minstens 2** die aan jeugd- of scoutsgroepen met tenten verhuren, met werkende URL (zelf geopend). Gebruik de
  referentielijst hierboven als vertrekpunt. Noteer afstand tot een station of bushalte als je die vindt.
- **Foto's: minstens 5**, alleen van Wikimedia Commons, alleen met licentie CC0, Public domain, CC BY of CC BY-SA (elke versie).
  Werkwijze: zoek via de Commons-API, bv. `curl -sS -A "ScoutAtlas/1.0 (nathan@charut.be)" "https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=20&format=json&srsearch=Naeroyfjord+kayak"`,
  haal dan de licentie en de URL op met `action=query&titles=File:...&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&format=json`
  (velden LicenseShortName, Artist, ImageDescription; neem de `thumburl`), download de thumb met curl en verklein:
  `convert in.jpg -auto-orient -resize 1600x1600\> -strip -interlace Plane -quality 80 /home/user/animaties/scout-atlas-2027/bron/foto/no-N.jpg`.
  Kies liggende foto's (breder dan hoog) van landschap of activiteit, scherp en zonder tekst of logo; geen close-ups van herkenbare kinderen.
  Elke foto hoort bij één activiteit (`foto`-index) of bij de kampplaats. Vul auteur en licentie exact in zoals Commons ze geeft (Artist mag
  ontdaan worden van HTML). Lukt een download niet, neem een andere foto; verzin nooit een licentie.
- **Bronnen**: officiële toerismesites, nationale parken, scoutsorganisaties, Wikipedia/Wikivoyage. Reisblogs alleen als wegwijzer.
- **Zoekbudget**: WebSearch is schaars (gedeeld): hoogstens 15 keer voor dit land, alleen als je met WebFetch en de Commons-API niet verder komt.
- Schrijf niets anders dan het JSON-bestand en de foto's. Controleer op het einde: `cd /home/user/animaties/scout-atlas-2027/onderzoek && node valideer-kampbeeld.mjs NO`
  moet "Kampbeeld in orde" zeggen; herstel fouten tot het zover is.

Rapporteer in hoogstens 12 regels: de activiteiten (titel + variabele), het aantal foto's en kampplaatsen, en wat je niet kon bevestigen.
