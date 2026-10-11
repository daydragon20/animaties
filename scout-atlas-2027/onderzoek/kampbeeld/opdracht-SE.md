# Kampbeeld · Zweden (nummer 2 van 39)

Je maakt voor **Scout Atlas 2027** het kampbeeld van Zweden: hoe ziet een tentenkamp van ±10 dagen in juli/augustus 2027 er daar
concreet uit voor een Vlaamse scoutsgroep (verkenners 14–16 jaar, 10–15 leden, 5 à 6 tenten, beperkt budget)? De film toont voor
dit land één activiteit met foto, naast de winnaar; de verkenner toont alles wat jij verzamelt.
**Regel nummer één: elke activiteit hangt aan één variabele uit het model en aan een concrete, controleerbare plek.** Geen reisfolder-taal.

Werkmap: `/home/user/animaties/scout-atlas-2027/`. Context: `onderzoek/model/MODEL.md` (het model), `bron/scout-atlas-2027-data.json` (de data).
Eindscore van Zweden: 68,7 op 100 (3 van 10 rondes gewonnen).
Categoriescores: Kostprijs 47,9 · Avontuur 75,8 · Kamperen 72,3 · Veiligheid en gezondheid 78,5 · Reis en vervoer 79,4 · Weer in de zomer 87,2 · Cultuur en mensen 58,8 · Scoutingnetwerk 78,9 · Praktisch 89,7 · Uniek en niet-toeristisch 78,5.

## De sterkste variabelen (score × gewicht), hier moeten de activiteiten uit komen
- **kamp_wild** (Wildkamperen toegestaan, Kamperen, gewicht 6.5 %): score 100 op 100 · gemeten: 100 niveau 0 tot 100 (rubriek) · niveau: Allemansrecht: tentkamperen op onbebouwde, niet-landbouwgrond is wettelijk gegarandeerd zonder toestemming, ook voor groepen (hooguit melden bij een grote groep of bij meer dan 2 nachten op dezelfde plek). Ter oriëntatie: NO, SE, FI. · bron: Naturvårdsverket, Allemansrätten https://www.naturvardsverket.se/allemansratten · opmerking onderzoek: Gelezen (overheidsbron): 'övernatta något enstaka dygn i tält nästan var som helst' (tent overnight a few nights almost anywhere). Grondwet (Regeringsformen 2 kap. 15 §) in de eerste bron. Bij grote groep met meerdere tenten moet men de gro
- **av_bergen** (Bergen en hoogteverschil, Avontuur, gewicht 7 %): score 65,9 op 100 · gemeten: 2.097 meter boven zeeniveau · bron: Wikipedia, List of countries by highest point https://en.wikipedia.org/wiki/List_of_countries_by_highest_point · opmerking onderzoek: Kebnekaise.
- **kost_reis** (Reiskost heen en terug, Kostprijs, gewicht 8 %): score 55,8 op 100 · gemeten: 205 euro per persoon, heen en terug (modelprijs, geen offerte) · bron: Grootcirkelafstand (haversine, aardstraal 6371 km), formule p02 https://www.movable-type.co.uk/scripts/latlong.html · opmerking onderzoek: Vlucht goedkoopst: 90 + 0,09 × 1280 km = 205. Weg 2 × 1708 km × 0,08 = 273.
- **av_kust** (Kust en zee, Avontuur, gewicht 4.5 %): score 92,9 op 100 · gemeten: 3.218 kilometer kustlijn · bron: Wikipedia, List of countries by length of coastline (kolom CIA) https://en.wikipedia.org/wiki/List_of_countries_by_length_of_coastline · opmerking onderzoek: CIA-cijfer in km.
- **kamp_groepsterrein** (Kampterreinen voor groepen, Kamperen, gewicht 7.5 %): score 50 op 100 · gemeten: 50 score 0 tot 100 (aantal vervulde criteria x 25) · niveau: Twee van de vier criteria zijn vervuld. · bron: Scouterna – international exchange / scoutstuga.se https://www.scouterna.se/languages/english/international-exchange/ · opmerking onderzoek: A ja (midden): Scouterna noemt ~1000 lokale groepen met scoutstugor en verwijst naar het register scoutstuga.se (gezien); aantal kampterreinen niet geteld. B ja: Vässarö (255 kr p.p./dag, zomer 2027, verhuur aan scoutgroepen; https://vassar
- **av_meren** (Meren en binnenwater, Avontuur, gewicht 3.5 %): score 95 op 100 · gemeten: 9 % binnenwater van de oppervlakte · bron: Wikipedia, List of countries and dependencies by area (kolom % water) https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area · opmerking onderzoek: % water uit de tabel (CIA/VN-cijfers).
- **kost_voeding** (Eten in de supermarkt, Kostprijs, gewicht 5.5 %): score 53,1 op 100 · gemeten: 67,5 indexpunten (New York = 100) · bron: Numbeo, Cost of Living Index by Country 2026 Mid-Year (kolom Groceries Index) https://www.numbeo.com/cost-of-living/rankings_by_country.jsp?title=2026-mid · opmerking onderzoek: Rechtstreeks uit de tabel.
- **av_ruimte** (Ruimte en wildernis, Avontuur, gewicht 3.5 %): score 76,8 op 100 · gemeten: 25,9 inwoners per km² · bron: Wereldbank WDI EN.POP.DNST (bevolkingsdichtheid) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/EN.POP.DNST?format=json&date=2018:2024&mrnev=1&per_page=100
- **kost_kampplaats** (Prijs van een kampeerplek, Kostprijs, gewicht 5 %): score 52,9 op 100 · gemeten: 27,2 euro per nacht (2 personen + standplaats) · bron: camp.info, Preisvergleich Camping Europa (tabel overgenomen door Reisefroh) https://reisefroh.de/news/campingpreise-in-europa-2025/ · opmerking onderzoek: Rechtstreeks uit de tabel.
- **kamp_vuur** (Kampvuur in de zomer, Kamperen, gewicht 3.5 %): score 75 op 100 · gemeten: 75 niveau 0 tot 100 (rubriek) · niveau: Open vuur is toegestaan op aangewezen vuurplaatsen of na een eenvoudige melding of toestemming van gemeente of brandweer; er zijn periodieke zomerbeperkingen per regio (brandgevaarkaarten, prefectuurbesluiten, Waldbrandstufen) die kampvuur geregeld tijdelijk verbieden. · bron: MCF (Myndigheten för samhällsskydd och beredskap), Eldningsförbud + Lag (2003:778) https://www.mcf.se/sv/amnesomraden/skydd-mot-olyckor-och-farliga-amnen/naturolyckor-och-klimat/skogsbrand-och-vegetationsbrand/eldningsforbud/ · opmerking onderzoek: Gelezen (MCF): 'Det är kommunen eller länsstyrelsen som beslutar om att utfärda föreskrifter om eldningsförbud.' Tijdelijke, regionale verboden in droge zomers (grote regio's, referentie: 2018, 2025), geen vaste periode. Regionaal periodiek
- **cul_engels** (Engels spreken, Cultuur en mensen, gewicht 2.8 %): score 88,4 op 100 · gemeten: 609 EF EPI-score · bron: EF English Proficiency Index 2025 (via Wikipedia-tabel) https://en.wikipedia.org/wiki/EF_English_Proficiency_Index · opmerking onderzoek: Wikipedia-tabel EF EPI 2025.
- **vei_vrede** (Vrede en veiligheid, Veiligheid en gezondheid, gewicht 3 %): score 77,8 op 100 · gemeten: 1,73 GPI-score (1 tot 5) · bron: Wikipedia, Global Peace Index (landentabel) https://en.wikipedia.org/wiki/Global_Peace_Index
- **av_rivieren** (Rivieren, watervallen en wildwater, Avontuur, gewicht 3.5 %): score 60,7 op 100 · gemeten: 419,9 mm water per jaar · bron: Wereldbank WDI ER.H2O.INTR.K3 (FAO AQUASTAT) ÷ AG.LND.TOTL.K2 https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.H2O.INTR.K3?format=json&date=2000:2024&mrnev=1&per_page=100 · opmerking onderzoek: Afgeleid: ER.H2O.INTR.K3 (2022, mld m³) ÷ AG.LND.TOTL.K2 (2024, km²) × 1.000.000.
- **av_grotten** (Grotten en kloven, Avontuur, gewicht 3 %): score 67,2 op 100 · gemeten: 29 aantal grotten en kloven · bron: showcaves.com, Statistics https://www.showcaves.com/english/explain/Index/Statistics.html · opmerking onderzoek: 2 Showcaves + 25 Caves + 2 Gorges.

## De zwakste (niet verzwijgen in de uitleg als het relevant is, bv. weer of kosten)
- **cul_buitenland** (Echt buitenland-gevoel, Cultuur en mensen, gewicht 1.7 %): score 10 op 100 · gemeten: 10 aantal 'ja'-antwoorden (0 tot 3) · niveau: Geen enkele 'ja'. Ter oriëntatie: NL, FR, DE, LU, CH, AT, IT, ES, PT, GB, IE, DK, NO, SE, IS, AD, LI, SM. · bron: Wikipedia, Languages of Europe en Religion in Europe https://en.wikipedia.org/wiki/Languages_of_Europe · opmerking onderzoek: A nee (Zweeds, Germaans); B nee (Latijns); C nee (Zweedse kerk, Lutheraans, bron Religion in Europe) → 0 ja → 10.
- **kost_vervoer** (Prijs van vervoer ter plaatse, Kostprijs, gewicht 3.5 %): score 22,5 op 100 · gemeten: 144,1 EU27 = 100 · bron: Eurostat prc_ppp_ind, ppp_cat A010703 (Vervoersdiensten) https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_ppp_ind?format=JSON&lang=EN&na_item=PLI_EU27_2020&ppp_cat=A010703&time=2024 · opmerking onderzoek: Rechtstreeks uit de tabel.
- **vei_teken** (Tekenencefalitis (TBE), Veiligheid en gezondheid, gewicht 1.3 %): score 33,8 op 100 · gemeten: 4,03 gevallen per 100.000 inwoners per jaar · bron: ECDC, Annual Epidemiological Report TBE 2022, Table 1 https://www.ecdc.europa.eu/sites/default/files/documents/tick-borne-encephalistis-annual-epidemiological-report-2022_0.pdf · opmerking onderzoek: ECDC AER 2022, Table 1 (per 100.000): 2020 2,6; 2021 5,1; 2022 4,4; gemiddelde van de laatste beschikbare jaren.
- **kost_activiteiten** (Prijs van activiteiten en uitstappen, Kostprijs, gewicht 3 %): score 38,2 op 100 · gemeten: 118 EU27 = 100 · bron: Eurostat prc_ppp_ind, ppp_cat A0109 (Recreatie en cultuur) https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_ppp_ind?format=JSON&lang=EN&na_item=PLI_EU27_2020&ppp_cat=A0109&time=2024 · opmerking onderzoek: Rechtstreeks uit de tabel.

## Wat het referentieonderzoek over kamperen al vond (controleer het, gebruik het)
- Wildkamperen (voorstel 100): Allemansrätten (Regeringsformen 2 kap. 15 §: 'Alla ska ha tillgång till naturen enligt allemansrätten'); tenten mogen 'något enstaka dygn' bijna overal; grote groepen vragen de grondeigenaar toestemming · Riksdagen, Regeringsformen (SFS 1974:152) 2 kap. 15 § https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/kungorelse-1974152-om-beslutad-ny-regeringsform_sfs-1974-152/ · Naturvårdsverket, Allemansrätten https://www.naturvardsverket.se/allemansratten · Naturvårdsverket, samtalskort allemansrätt (pdf) https://naturvardsverket.se/4931fb/globalassets/vagledning/allemansratten/material/oversikt-samtalskort-allemansratt.pdf
- Kampvuur (voorstel 100): Lag (2003:778) om skydd mot olyckor 10 kap. 1 §: regering kan eldningsförbud uitvaardigen; kommun of länsstyrelse beslist tijdelijke eldningsförbud bij droogte; geen structureel zomerverbod · Riksdagen, Lag (2003:778) om skydd mot olyckor https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2003778-om-skydd-mot-olyckor_sfs-2003-778/ · MCF (voorheen MSB), Besluta om eldningsförbud https://www.mcf.se/sv/amnesomraden/skydd-mot-olyckor-och-farliga-amnen/naturolyckor-och-klimat/skogsbrand-och-vegetationsbrand/eldningsforbud/ · Wikipedia, Freedom to roam (landsecties) https://en.wikipedia.org/wiki/Freedom_to_roam
- Kampterreinen (voorstel 75):
  - A: ja Scouterna (Zweedse scoutsorganisatie): 'about 1000 local scout groups have cabins' en een register 'Scouternas register över scoutstugor, scoutlokaler och lägerplatser' (scoutstuga.se, 'Hitta anläggning'); uit te huren aan scoutgroepen, bedrijven en particulieren. De database zelf is een JS-app met inlog (niet uit te lezen). https://www.scouterna.se/languages/english/international-exchange/
  - B: ja Drie Zweedse scoutsterreinen met eigen site en prijs of contact geopend: Vässarö (255 SEK p.p. per dag incl. eten, 2027), Kopparbo (1700 SEK per week, service weeks) en Scout Camp Ransberg/Kungshol van NSF (lägerängar, Scouternas partner Nykterhetsrörelsens Scoutförbund). 
    - Vässarö (Scouternas Ö) (Roslagen-archipel (Stockholms skärgård)) https://vassaro.se/lager/scoutlager/ · Scoutkårer slaan eigen tenten op lägerängar, koken zelf; zomerseizoen 13 juni-15 aug; 2027: 255 kr/persoon/dag (4 maaltijden in grondstof) + boot 180 kr; tenten te huur; Engelse pagina 'Camp information'; tel. 0173-370 22.
    - Kopparbo lägergård (Kopparbostiftelsen) (Söderbärke (Dalarna/Västmanland)) https://kopparbo.com/ · Scoutläger in 'serviceveckor' (2026: 1700 kr per volle week, 850 kr per halve week); water, toiletten, brandhout voor kampvuur; Engelse versie van de site; kopparbo@kopparbo.com.
    - Scout Camp Ransberg (Nykterhetsrörelsens Scoutförbund) (nabij Ransäter (Värmland)) https://www.nsf.scout.se/anlaggningar/vara-anlaggningar/ · 'fantastiskt alternativ för dig som söker en lägerplats'; stichting verhuurt aan scoutkårer en anderen; Kungshol (Rättvik) heeft lägerängar; pagina bijgewerkt in 2016, actuele prijs niet gelezen.
  - C: ja Scouterna (WOSM-lid) verwijst buitenlandse scouts expliciet naar scoutstugor en lägerplatser en naar Azimuth; de nationale Jamboree26 was in Norra Åsum bij Kristianstad (25 jul-1 aug 2026). Er is geen SCENES-centrum in Zweden; C is hier ruim gelezen (nationale organisatie biedt terreinen voor buitenlandse groepen). https://www.scouterna.se/languages/english/international-exchange/
  - D: nee Niet onderzocht (geen Zweeds campingportaal met groepsfilter geopend). 

## Wat je oplevert
1. `bron/kampbeeld/se.json`:
```json
{
 "iso2": "SE", "naam": "Zweden", "datum": "JJJJ-MM-DD",
 "slogan": "één zin van hoogstens 70 tekens die het kamp daar samenvat, concreet (plaatsnamen mogen)",
 "activiteiten": [
  { "titel": "Kajakken op de Nærøyfjord", "plek": "Gudvangen, Vestland", "variabele": "av_kust",
    "uitleg": "max 220 tekens: wat doe je, waarom kan dat juist hier, wat kost het of wat is gratis; concreet en controleerbaar",
    "bron": { "naam": "Visit Norway, Nærøyfjord", "url": "https://..." }, "foto": 0 }
 ],
 "kampplaatsen": [ { "naam": "...", "plaats": "...", "url": "https://...", "details": "voor jeugdgroepen met tenten · capaciteit of prijs als je die ziet · afstand tot station" } ],
 "fotos": [ { "bestand": "se-1.jpg", "bijschrift": "wat je ziet, met plaatsnaam", "auteur": "naam of gebruikersnaam op Commons", "licentie": "CC BY-SA 4.0", "bron_url": "https://commons.wikimedia.org/wiki/File:..." } ],
 "bronnen": [ { "naam": "...", "url": "..." } ],
 "problemen": [ "..." ]
}
```
2. De foto's in `bron/foto/se-1.jpg` … (JPEG, langste zijde 1600 px, hoogstens 350 KB per foto).

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
  `convert in.jpg -auto-orient -resize 1600x1600\> -strip -interlace Plane -quality 80 /home/user/animaties/scout-atlas-2027/bron/foto/se-N.jpg`.
  Kies liggende foto's (breder dan hoog) van landschap of activiteit, scherp en zonder tekst of logo; geen close-ups van herkenbare kinderen.
  Elke foto hoort bij één activiteit (`foto`-index) of bij de kampplaats. Vul auteur en licentie exact in zoals Commons ze geeft (Artist mag
  ontdaan worden van HTML). Lukt een download niet, neem een andere foto; verzin nooit een licentie.
- **Bronnen**: officiële toerismesites, nationale parken, scoutsorganisaties, Wikipedia/Wikivoyage. Reisblogs alleen als wegwijzer.
- **Zoekbudget**: WebSearch is schaars (gedeeld): hoogstens 15 keer voor dit land, alleen als je met WebFetch en de Commons-API niet verder komt.
- Schrijf niets anders dan het JSON-bestand en de foto's. Controleer op het einde: `cd /home/user/animaties/scout-atlas-2027/onderzoek && node valideer-kampbeeld.mjs SE`
  moet "Kampbeeld in orde" zeggen; herstel fouten tot het zover is.

Rapporteer in hoogstens 12 regels: de activiteiten (titel + variabele), het aantal foto's en kampplaatsen, en wat je niet kon bevestigen.
