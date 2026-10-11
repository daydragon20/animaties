# Kampbeeld · Duitsland (nummer 1 van 39)

Je maakt voor **Scout Atlas 2027** het kampbeeld van Duitsland: hoe ziet een tentenkamp van ±10 dagen in juli/augustus 2027 er daar
concreet uit voor een Vlaamse scoutsgroep (verkenners 14–16 jaar, 10–15 leden, 5 à 6 tenten, beperkt budget)? De film toont voor
dit land vijf activiteiten met foto, de slaapplaats, en daarna; de verkenner toont alles wat jij verzamelt.
**Regel nummer één: elke activiteit hangt aan één variabele uit het model en aan een concrete, controleerbare plek.** Geen reisfolder-taal.

Werkmap: `/home/user/animaties/scout-atlas-2027/`. Context: `onderzoek/model/MODEL.md` (het model), `bron/scout-atlas-2027-data.json` (de data).
Eindscore van Duitsland: 69,2 op 100 (7 van 10 rondes gewonnen).
Categoriescores: Kostprijs 57,8 · Avontuur 67,6 · Kamperen 70,1 · Veiligheid en gezondheid 86,1 · Reis en vervoer 73,5 · Weer in de zomer 83,5 · Cultuur en mensen 60,2 · Scoutingnetwerk 62,1 · Praktisch 100 · Uniek en niet-toeristisch 88,8.

## De sterkste variabelen (score × gewicht), hier moeten de activiteiten uit komen
- **kost_reis** (Reiskost heen en terug, Kostprijs, gewicht 8 %): score 77,7 op 100 · gemeten: 121 euro per persoon, heen en terug (modelprijs, geen offerte) · bron: OSRM (Open Source Routing Machine), publieke demoserver: wegafstand https://router.project-osrm.org/route/v1/driving/4.3525,50.8467;13.405,52.52?overview=false · opmerking onderzoek: Weg 2 × 759 km × 0,08 = 121 (vlucht 149).
- **av_bergen** (Bergen en hoogteverschil, Avontuur, gewicht 7 %): score 87,1 op 100 · gemeten: 2.962 meter boven zeeniveau · bron: Wikipedia, List of countries by highest point https://en.wikipedia.org/wiki/List_of_countries_by_highest_point · opmerking onderzoek: Zugspitze.
- **kamp_groepsterrein** (Kampterreinen voor groepen, Kamperen, gewicht 7.5 %): score 75 op 100 · gemeten: 75 score 0 tot 100 (aantal vervulde criteria x 25) · niveau: Drie van de vier criteria zijn vervuld. · bron: gruppenhaus.de Zeltplatz-overzicht https://www.gruppenhaus.de/zeltplatz.html · opmerking onderzoek: A ja: 'Treffer: 546 Zeltplätze' gezien. B ja: Jugendzeltplatz Hollfeld (ab 5 EUR), Pöhlde, Joshofen, Hilst, Breitenbrunn en Pfadfinderheim Rachtig met prijs gezien. C ja: Zentrum Pfadfinden Immenhausen, VCP-centrum en Westernohe op SCENES (
- **av_kust** (Kust en zee, Avontuur, gewicht 4.5 %): score 88,1 op 100 · gemeten: 2.389 kilometer kustlijn · bron: Wikipedia, List of countries by length of coastline (kolom CIA) https://en.wikipedia.org/wiki/List_of_countries_by_length_of_coastline · opmerking onderzoek: CIA-cijfer in km.
- **kamp_wild** (Wildkamperen toegestaan, Kamperen, gewicht 6.5 %): score 55 op 100 · gemeten: 55 niveau 0 tot 100 (rubriek) · niveau: Alleen met toestemming van de grondeigenaar of beheerder, en die is doorgaans eenvoudig te krijgen (boer, gemeente, bosbeheerder), of er bestaan officiële natuurkampeer- en bivakzones. Ter oriëntatie (controleer per land): NL, DE, FR, IE. · bron: gesetze-im-internet.de, BNatSchG §59 (en BWaldG §14) https://www.gesetze-im-internet.de/bnatschg_2009/__59.html · opmerking onderzoek: Federale wet noemt geen kamperen; betreden van de vrije landschap voor recreatie; bos volgens BWaldG en deelstaten. Geen landelijk verbod gevonden. Jugendzeltplätze gebruikelijk. Voorstel 55 bevestigd.
- **kost_voeding** (Eten in de supermarkt, Kostprijs, gewicht 5.5 %): score 56,8 op 100 · gemeten: 64,6 indexpunten (New York = 100) · bron: Numbeo, Cost of Living Index by Country 2026 Mid-Year (kolom Groceries Index) https://www.numbeo.com/cost-of-living/rankings_by_country.jsp?title=2026-mid · opmerking onderzoek: Rechtstreeks uit de tabel.
- **av_grotten** (Grotten en kloven, Avontuur, gewicht 3 %): score 100 op 100 · gemeten: 156 aantal grotten en kloven · bron: showcaves.com, Statistics https://www.showcaves.com/english/explain/Index/Statistics.html · opmerking onderzoek: 54 Showcaves + 79 Caves + 23 Gorges.
- **kamp_vuur** (Kampvuur in de zomer, Kamperen, gewicht 3.5 %): score 75 op 100 · gemeten: 75 niveau 0 tot 100 (rubriek) · niveau: Open vuur is toegestaan op aangewezen vuurplaatsen of na een eenvoudige melding of toestemming van gemeente of brandweer; er zijn periodieke zomerbeperkingen per regio (brandgevaarkaarten, prefectuurbesluiten, Waldbrandstufen) die kampvuur geregeld tijdelijk verbieden. · bron: Bayern.Recht, BayWaldG Art. 17 (Feuergefahr) https://www.gesetze-bayern.de/Content/Document/BayWaldG-17 · opmerking onderzoek: Art. 17: in of binnen 100 m van bos vuur alleen met vergunning; DWD-Waldbrandgefahrenstufen met tijdelijke district-verboden. Alleen Beieren gelezen. Voorstel 75 bevestigd.
- **cul_engels** (Engels spreken, Cultuur en mensen, gewicht 2.8 %): score 90,6 op 100 · gemeten: 615 EF EPI-score · bron: EF English Proficiency Index 2025 (via Wikipedia-tabel) https://en.wikipedia.org/wiki/EF_English_Proficiency_Index · opmerking onderzoek: Wikipedia-tabel EF EPI 2025.
- **vei_vrede** (Vrede en veiligheid, Veiligheid en gezondheid, gewicht 3 %): score 81,6 op 100 · gemeten: 1,66 GPI-score (1 tot 5) · bron: Wikipedia, Global Peace Index (landentabel) https://en.wikipedia.org/wiki/Global_Peace_Index
- **kamp_beschermd** (Beschermde natuur rond de kampplek, Kamperen, gewicht 2.5 %): score 92,3 op 100 · gemeten: 39,2 % van het landoppervlak · bron: Wereldbank WDI ER.LND.PTLD.ZS (Protected Planet / WDPA) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.LND.PTLD.ZS?format=json&date=2020:2025&mrnev=1&per_page=100 · opmerking onderzoek: Rechtstreeks uit WB.
- **kost_kampplaats** (Prijs van een kampeerplek, Kostprijs, gewicht 5 %): score 41,9 op 100 · gemeten: 30,3 euro per nacht (2 personen + standplaats) · bron: camp.info, Preisvergleich Camping Europa (tabel overgenomen door Reisefroh) https://reisefroh.de/news/campingpreise-in-europa-2025/ · opmerking onderzoek: Rechtstreeks uit de tabel.
- **uniek_toerisme** (Weinig massatoerisme, Uniek en niet-toeristisch, gewicht 2.1 %): score 88,8 op 100 · gemeten: 0,48 aankomsten per inwoner · bron: Wereldbank WDI ST.INT.ARVL 2019 / SP.POP.TOTL 2019 https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ST.INT.ARVL?format=json&date=2019&per_page=100 · opmerking onderzoek: Aankomsten 2019: 39.563.000 / bevolking 2019: 83.092.962.
- **weer_temp** (Temperatuur in juli, Weer in de zomer, gewicht 1.8 %): score 100 op 100 · gemeten: 25 °C (gemiddelde maximum in juli) · bron: Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) https://en.wikipedia.org/wiki/Berlin · opmerking onderzoek: Tabel Berlin (Brandenburg), eerste tabel van de pagina. Dahlem-tabel is 1961-1990 en niet gebruikt.

## De zwakste (niet verzwijgen in de uitleg als het relevant is, bv. weer of kosten)
- **cul_buitenland** (Echt buitenland-gevoel, Cultuur en mensen, gewicht 1.7 %): score 10 op 100 · gemeten: 10 aantal 'ja'-antwoorden (0 tot 3) · niveau: Geen enkele 'ja'. Ter oriëntatie: NL, FR, DE, LU, CH, AT, IT, ES, PT, GB, IE, DK, NO, SE, IS, AD, LI, SM. · bron: Wikipedia, Languages of Europe en Religion in Europe https://en.wikipedia.org/wiki/Languages_of_Europe · opmerking onderzoek: A nee (Duits, Germaans); B nee (Latijns); C nee (rooms-katholiek en geen religie elk ca. 30%, bron Religion in Europe) → 0 ja → 10.
- **av_ruimte** (Ruimte en wildernis, Avontuur, gewicht 3.5 %): score 22,5 op 100 · gemeten: 239 inwoners per km² · bron: Wereldbank WDI EN.POP.DNST (bevolkingsdichtheid) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/EN.POP.DNST?format=json&date=2018:2024&mrnev=1&per_page=100 · opmerking onderzoek: Rechtstreeks uit WB.
- **av_meren** (Meren en binnenwater, Avontuur, gewicht 3.5 %): score 40 op 100 · gemeten: 2,2 % binnenwater van de oppervlakte · bron: Wikipedia, List of countries and dependencies by area (kolom % water) https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area · opmerking onderzoek: % water uit de tabel (CIA/VN-cijfers).
- **kost_kampplaats** (Prijs van een kampeerplek, Kostprijs, gewicht 5 %): score 41,9 op 100 · gemeten: 30,3 euro per nacht (2 personen + standplaats) · bron: camp.info, Preisvergleich Camping Europa (tabel overgenomen door Reisefroh) https://reisefroh.de/news/campingpreise-in-europa-2025/ · opmerking onderzoek: Rechtstreeks uit de tabel.

## Wat het referentieonderzoek over kamperen al vond (controleer het, gebruik het)
- Wildkamperen (voorstel 55): Geen recht op vrij kamperen: BNatSchG §59 geeft toegang tot de vrije natuur voor recreatie en het Bundeswaldgesetz §14 het betreden van het bos; kamperen valt daar niet onder en de Länder regelen de details; in de praktijk toestemming van de eigenaar of een Trekkingplatz/Biwakzone · gesetze-im-internet.de, § 59 BNatSchG Betreten der freien Landschaft https://www.gesetze-im-internet.de/bnatschg_2009/__59.html · gesetze-im-internet.de, § 14 BWaldG Betreten des Waldes https://www.gesetze-im-internet.de/bwaldg/__14.html · ÖAMTC/ÖCC, Wildcamping in Europa: ein Überblick (17 juli 2024) https://www.oeamtc.at/presse/oecc-informiert-wildcamping-in-europa-ein-ueberblick-72446068
- Kampvuur (voorstel 75): Bosrecht van de Länder (bv. BayWaldG Art. 17: in of binnen 100 m van een bos vuur maken alleen met toestemming; Waldbrandgefahrenstufen van de DWD met tijdelijke verboden per district) · Bayern.Recht, Bayerisches Waldgesetz (BayWaldG) Art. 17 Feuergefahr https://www.gesetze-bayern.de/Content/Document/BayWaldG-17 · Deutscher Wetterdienst, Waldbrandgefahrenindex https://www.dwd.de/DE/leistungen/waldbrandgef/waldbrandgef.html
- Kampterreinen (voorstel 75):
  - A: ja gruppenhaus.de (groepsaccommodatieportaal) toont 546 Zeltplätze/Jugendzeltplätze ('Hier findest du 541 Zeltplätze für Zeltlager und Jugendreisen'), de meeste in Duitsland. https://www.gruppenhaus.de/zeltplatz.html
  - B: ja Drie scoutsbondscentra met eigen site, contact en prijzenpagina's; plus tientallen Jugendzeltplätze met prijs op gruppenhaus.de. 
    - VCP Bundeszeltplatz Großzerlang (Großzerlang (Mecklenburgische Seenplatte, Brandenburg)) https://vcp-bundeszeltplatz.de/ · 12 ha, uitsluitend voor pfadfinder- en andere kinder- en jeugdgroepen sinds 1997; kanustation; pagina's Preise/Anfrage/Buchung.
    - Zentrum Pfadfinden Immenhausen (Bundeszentrum BdP) (Immenhausen bij Kassel) https://zentrum.pfadfinden.de/ · Großzeltplatz, 5 ha, 'Zeltlager mit 1.000 Kindern', groepen vanaf 10 personen; 65 bedden; tel. +49 5673 99584-0, zentrum@pfadfinden.de; pagina's Zeltplatz en Preise.
    - DPSG Bundeszentrum Westernohe (Westernohe (Hoher Westerwald)) http://www.westernohe.org/de · 28 ha; Zeltplätze Altenberg en Kirschbaum; Buchungsanfrage en 'Preise im Überblick'.
    - Jugendzeltplatz Hollfeld (Hollfeld (Fränkische Schweiz)) https://www.gruppenhaus.de/jugendzeltplatz-hollfeld-hollfeld-hs6175.html · 5 tot 6 euro per persoon (zelfverzorging) volgens gruppenhaus.de; zeltplatzwiese, overdekte onderstanden, Lagerfeuerstelle, groepsruimte voor 40, 2+2 douche-/wasruimtes; 25 km ten westen van Bayreuth.
  - C: ja Drie SCENES-centra van WOSM in Duitsland (Immenhausen, VCP-Bundeszeltplatz, Westernohe) plus Burg Rieneck en Bucher Berg in de lijst van Slovenský skauting. https://www.scout.org/SCENES
  - D: nee Geen campingportaal met groepsfilter geopend (camping.info/ADAC niet geprobeerd); gruppenhaus.de is een groepsportaal, geen campingportaal. 

## Wat je oplevert
1. `bron/kampbeeld/de.json`:
```json
{
 "iso2": "DE", "naam": "Duitsland", "datum": "JJJJ-MM-DD",
 "slogan": "één zin van hoogstens 70 tekens die het kamp daar samenvat, concreet (plaatsnamen mogen)",
 "activiteiten": [
  { "titel": "Kajakken op de Nærøyfjord", "plek": "Gudvangen, Vestland", "variabele": "av_kust",
    "uitleg": "max 220 tekens: wat doe je, waarom kan dat juist hier, wat kost het of wat is gratis; concreet en controleerbaar",
    "bron": { "naam": "Visit Norway, Nærøyfjord", "url": "https://..." }, "foto": 0 }
 ],
 "kampplaatsen": [ { "naam": "...", "plaats": "...", "url": "https://...", "details": "voor jeugdgroepen met tenten · capaciteit of prijs als je die ziet · afstand tot station" } ],
 "fotos": [ { "bestand": "de-1.jpg", "bijschrift": "wat je ziet, met plaatsnaam", "auteur": "naam of gebruikersnaam op Commons", "licentie": "CC BY-SA 4.0", "bron_url": "https://commons.wikimedia.org/wiki/File:..." } ],
 "bronnen": [ { "naam": "...", "url": "..." } ],
 "problemen": [ "..." ]
}
```
2. De foto's in `bron/foto/de-1.jpg` … (JPEG, langste zijde 1600 px, hoogstens 350 KB per foto).

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
  `convert in.jpg -auto-orient -resize 1600x1600\> -strip -interlace Plane -quality 80 /home/user/animaties/scout-atlas-2027/bron/foto/de-N.jpg`.
  Kies liggende foto's (breder dan hoog) van landschap of activiteit, scherp en zonder tekst of logo; geen close-ups van herkenbare kinderen.
  Elke foto hoort bij één activiteit (`foto`-index) of bij de kampplaats. Vul auteur en licentie exact in zoals Commons ze geeft (Artist mag
  ontdaan worden van HTML). Lukt een download niet, neem een andere foto; verzin nooit een licentie.
- **Bronnen**: officiële toerismesites, nationale parken, scoutsorganisaties, Wikipedia/Wikivoyage. Reisblogs alleen als wegwijzer.
- **Zoekbudget**: WebSearch is schaars (gedeeld): hoogstens 15 keer voor dit land, alleen als je met WebFetch en de Commons-API niet verder komt.
- Schrijf niets anders dan het JSON-bestand en de foto's. Controleer op het einde: `cd /home/user/animaties/scout-atlas-2027/onderzoek && node valideer-kampbeeld.mjs DE`
  moet "Kampbeeld in orde" zeggen; herstel fouten tot het zover is.

Rapporteer in hoogstens 12 regels: de activiteiten (titel + variabele), het aantal foto's en kampplaatsen, en wat je niet kon bevestigen.
