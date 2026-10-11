# Kampbeeld · Frankrijk (nummer 3 van 39)

Je maakt voor **Scout Atlas 2027** het kampbeeld van Frankrijk: hoe ziet een tentenkamp van ±10 dagen in juli/augustus 2027 er daar
concreet uit voor een Vlaamse scoutsgroep (verkenners 14–16 jaar, 10–15 leden, 5 à 6 tenten, beperkt budget)? De film toont voor
dit land één activiteit met foto, naast de winnaar; de verkenner toont alles wat jij verzamelt.
**Regel nummer één: elke activiteit hangt aan één variabele uit het model en aan een concrete, controleerbare plek.** Geen reisfolder-taal.

Werkmap: `/home/user/animaties/scout-atlas-2027/`. Context: `onderzoek/model/MODEL.md` (het model), `bron/scout-atlas-2027-data.json` (de data).
Eindscore van Frankrijk: 67,4 op 100 (0 van 10 rondes gewonnen).
Categoriescores: Kostprijs 64,4 · Avontuur 72,3 · Kamperen 59,8 · Veiligheid en gezondheid 71,8 · Reis en vervoer 88 · Weer in de zomer 88 · Cultuur en mensen 38,9 · Scoutingnetwerk 61,8 · Praktisch 100 · Uniek en niet-toeristisch 43,4.

## De sterkste variabelen (score × gewicht), hier moeten de activiteiten uit komen
- **kost_reis** (Reiskost heen en terug, Kostprijs, gewicht 8 %): score 96,4 op 100 · gemeten: 49 euro per persoon, heen en terug (modelprijs, geen offerte) · bron: OSRM (Open Source Routing Machine), publieke demoserver: wegafstand https://router.project-osrm.org/route/v1/driving/4.3525,50.8467;2.3522,48.8566?overview=false · opmerking onderzoek: Weg 2 × 307 km × 0,08 = 49 (vlucht 114). Realiteitscheck: geen betrouwbare FlixBus-retourprijs gevonden; Kombo toont 9,13-107,98 € zonder onderscheid enkel/retour, dus niet gebruikt.
- **av_bergen** (Bergen en hoogteverschil, Avontuur, gewicht 7 %): score 100 op 100 · gemeten: 4.806 meter boven zeeniveau · bron: Wikipedia, List of countries by highest point https://en.wikipedia.org/wiki/List_of_countries_by_highest_point · opmerking onderzoek: Mont Blanc, gedeeld met Italië.
- **av_kust** (Kust en zee, Avontuur, gewicht 4.5 %): score 99,5 op 100 · gemeten: 4.853 kilometer kustlijn · bron: Wikipedia, List of countries by length of coastline (kolom CIA) https://en.wikipedia.org/wiki/List_of_countries_by_length_of_coastline · opmerking onderzoek: CIA-cijfer in km.
- **kamp_groepsterrein** (Kampterreinen voor groepen, Kamperen, gewicht 7.5 %): score 50 op 100 · gemeten: 50 score 0 tot 100 (aantal vervulde criteria x 25) · niveau: Twee van de vier criteria zijn vervuld. · bron: SGDF Domaine de Jambville + gruppenhaus.de https://jambville.sgdf.fr/ · opmerking onderzoek: A nee: geen lijst van >=10 jeugdkampterreinen gevonden. B ja: Jambville (boekingsformulier, tent onder de sterren; prijs niet getoond); Pfadfinder Kanucamp Tarnschlucht (70 plaatsen, vanaf 6,50 EUR p.p., gezien op https://www.gruppenhaus.de
- **kamp_wild** (Wildkamperen toegestaan, Kamperen, gewicht 6.5 %): score 55 op 100 · gemeten: 55 niveau 0 tot 100 (rubriek) · niveau: Alleen met toestemming van de grondeigenaar of beheerder, en die is doorgaans eenvoudig te krijgen (boer, gemeente, bosbeheerder), of er bestaan officiële natuurkampeer- en bivakzones. Ter oriëntatie (controleer per land): NL, DE, FR, IE. · bron: Département de la Savoie, Bivouac et droit de l'urbanisme (juridisch advies) https://www.savoie.fr/upload/docs/application/pdf/2025-07/analyse_juridique_urbanisme.pdf · opmerking onderzoek: Citeert Code de l'urbanisme R.111-32: kamperen buiten ingericht terrein 'avec l'accord de celui qui a la jouissance du sol'; R.111-33: verboden aan de kust, in beschermde sites en binnen 200 m van waterwinning. Légifrance gaf 403, dus geen 
- **av_grotten** (Grotten en kloven, Avontuur, gewicht 3 %): score 100 op 100 · gemeten: 195 aantal grotten en kloven · bron: showcaves.com, Statistics https://www.showcaves.com/english/explain/Index/Statistics.html · opmerking onderzoek: 112 Showcaves + 70 Caves + 13 Gorges.
- **kost_kampplaats** (Prijs van een kampeerplek, Kostprijs, gewicht 5 %): score 55,6 op 100 · gemeten: 26,4 euro per nacht (2 personen + standplaats) · bron: camp.info, Preisvergleich Camping Europa (tabel overgenomen door Reisefroh) https://reisefroh.de/news/campingpreise-in-europa-2025/ · opmerking onderzoek: Rechtstreeks uit de tabel.
- **kamp_vuur** (Kampvuur in de zomer, Kamperen, gewicht 3.5 %): score 75 op 100 · gemeten: 75 niveau 0 tot 100 (rubriek) · niveau: Open vuur is toegestaan op aangewezen vuurplaatsen of na een eenvoudige melding of toestemming van gemeente of brandweer; er zijn periodieke zomerbeperkingen per regio (brandgevaarkaarten, prefectuurbesluiten, Waldbrandstufen) die kampvuur geregeld tijdelijk verbieden. · bron: Préfecture du Val-de-Marne, arrêté n° 2026-02594 https://www.villecresnes.fr/UserFiles/File/arretes/ap-2026-02594-restrictions-pour-prevention-et-protection-forets-signe.pdf · opmerking onderzoek: Verbiedt vuur (ook kook- en veillée-vuren) in en binnen 200 m van bossen in juli 2026, op grond van art. L.131-6 Code forestier. Yvelines: jaarlijks verbod in en binnen 200 m van bossen. Verschilt per departement. Voorstel 75 bevestigd.
- **kost_voeding** (Eten in de supermarkt, Kostprijs, gewicht 5.5 %): score 45,3 op 100 · gemeten: 73,8 indexpunten (New York = 100) · bron: Numbeo, Cost of Living Index by Country 2026 Mid-Year (kolom Groceries Index) https://www.numbeo.com/cost-of-living/rankings_by_country.jsp?title=2026-mid · opmerking onderzoek: Rechtstreeks uit de tabel.
- **reis_direct** (Rechtstreekse verbinding vanuit België, Reis en vervoer, gewicht 2.2 %): score 100 op 100 · gemeten: 100 niveau 0 tot 100 (rubriek) · niveau: Rechtstreekse trein of nachttrein (zonder overstap) van Brussel naar de hoofdstad of een stad binnen 150 km ervan, met een reistijd van hoogstens 14 uur. · bron: Eurostar/TGV Brussel–Parijs Noord (boekingssite) https://www.b-europe.com/EN/Routes/Brussels-Paris · opmerking onderzoek: Parijs: Eurostar/TGV zonder overstap, ca. 1u22 (boekingssites; niet tegen de officiële Eurostar-dienstregeling gecontroleerd).
- **av_rivieren** (Rivieren, watervallen en wildwater, Avontuur, gewicht 3.5 %): score 55 op 100 · gemeten: 371,1 mm water per jaar · bron: Wereldbank WDI ER.H2O.INTR.K3 (FAO AQUASTAT) ÷ AG.LND.TOTL.K2 https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.H2O.INTR.K3?format=json&date=2000:2024&mrnev=1&per_page=100 · opmerking onderzoek: Afgeleid: ER.H2O.INTR.K3 (2022, mld m³) ÷ AG.LND.TOTL.K2 (2024, km²) × 1.000.000.
- **kamp_beschermd** (Beschermde natuur rond de kampplek, Kamperen, gewicht 2.5 %): score 76,8 op 100 · gemeten: 28,8 % van het landoppervlak · bron: Wereldbank WDI ER.LND.PTLD.ZS (Protected Planet / WDPA) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ER.LND.PTLD.ZS?format=json&date=2020:2025&mrnev=1&per_page=100 · opmerking onderzoek: Rechtstreeks uit WB.
- **weer_temp** (Temperatuur in juli, Weer in de zomer, gewicht 1.8 %): score 100 op 100 · gemeten: 25,7 °C (gemiddelde maximum in juli) · bron: Wikipedia, klimaattabel van de hoofdstad (normalen 1991-2020) https://en.wikipedia.org/wiki/Paris · opmerking onderzoek: Tabel Paris (Parc Montsouris), niet Orly.
- **kost_vervoer** (Prijs van vervoer ter plaatse, Kostprijs, gewicht 3.5 %): score 46,7 op 100 · gemeten: 116,3 EU27 = 100 · bron: Eurostat prc_ppp_ind, ppp_cat A010703 (Vervoersdiensten) https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_ppp_ind?format=JSON&lang=EN&na_item=PLI_EU27_2020&ppp_cat=A010703&time=2024 · opmerking onderzoek: Rechtstreeks uit de tabel.

## De zwakste (niet verzwijgen in de uitleg als het relevant is, bv. weer of kosten)
- **av_meren** (Meren en binnenwater, Avontuur, gewicht 3.5 %): score 10 op 100 · gemeten: 0,5 % binnenwater van de oppervlakte · bron: Wikipedia, List of countries and dependencies by area (kolom % water) https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area · opmerking onderzoek: Hoofdrij Frankrijk gebruikt (metropolitan 0,3 apart vermeld).
- **cul_buitenland** (Echt buitenland-gevoel, Cultuur en mensen, gewicht 1.7 %): score 10 op 100 · gemeten: 10 aantal 'ja'-antwoorden (0 tot 3) · niveau: Geen enkele 'ja'. Ter oriëntatie: NL, FR, DE, LU, CH, AT, IT, ES, PT, GB, IE, DK, NO, SE, IS, AD, LI, SM. · bron: Wikipedia, Languages of Europe en Religion in Europe https://en.wikipedia.org/wiki/Languages_of_Europe · opmerking onderzoek: A nee (Frans, Romaans); B nee (Latijns); C nee (christendom als grootste groep, bron Religion in Europe) → 0 ja → 10.
- **av_ruimte** (Ruimte en wildernis, Avontuur, gewicht 3.5 %): score 37,9 op 100 · gemeten: 127,2 inwoners per km² · bron: Wereldbank WDI EN.POP.DNST (bevolkingsdichtheid) https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/EN.POP.DNST?format=json&date=2018:2024&mrnev=1&per_page=100 · opmerking onderzoek: Rechtstreeks uit WB.
- **uniek_toerisme** (Weinig massatoerisme, Uniek en niet-toeristisch, gewicht 2.1 %): score 43,4 op 100 · gemeten: 3,23 aankomsten per inwoner · bron: Wereldbank WDI ST.INT.ARVL 2019 / SP.POP.TOTL 2019 https://api.worldbank.org/v2/country/PRT;ESP;AND;FRA;GBR;IRL;ISL;NLD;LUX;DEU;DNK;NOR;SWE;FIN;EST;LVA;LTU;CHE;LIE;AUT;CZE;SVK;ITA;SMR;MLT;HRV;BIH;MNE;SRB;XKX;MKD;GRC;BGR;CYP;TUR;MDA;UKR;BLR;RUS;GEO;ARM;AZE/indicator/ST.INT.ARVL?format=json&date=2019&per_page=100 · opmerking onderzoek: Aankomsten 2019: 217.877.000 / bevolking 2019: 67.382.061.

## Wat het referentieonderzoek over kamperen al vond (controleer het, gebruik het)
- Wildkamperen (voorstel 55): Code de l'urbanisme R.111-32 t/m R.111-34: kamperen buiten een ingericht terrein mag met toestemming van wie het genot van de grond heeft; verboden aan de kust, in beschermde sites, bij historische monumenten en binnen 200 m van waterwinning; gemeente en PLU kunnen het verbieden · Département de la Savoie, Bivouac et droit de l'urbanisme (juridisch advies, 12 juli 2021) https://www.savoie.fr/upload/docs/application/pdf/2025-07/analyse_juridique_urbanisme.pdf · ÖAMTC/ÖCC, Wildcamping in Europa: ein Überblick (17 juli 2024) https://www.oeamtc.at/presse/oecc-informiert-wildcamping-in-europa-ein-ueberblick-72446068
- Kampvuur (voorstel 75): Prefectuurbesluiten (Code forestier L.131-6): per departement tijdelijke of seizoensverboden op vuur in en binnen 200 m van bossen (o.a. Yvelines permanent in/binnen 200 m; Val-de-Marne juli 2026 inclusief kampvuren), 'période rouge' in het zuiden · Préfecture du Val-de-Marne, Arrêté n° 2026-02594 (restrictions temporaires incendie de forêt) https://www.villecresnes.fr/UserFiles/File/arretes/ap-2026-02594-restrictions-pour-prevention-et-protection-forets-signe.pdf · DDT Yvelines, Rappel d'affichage de l'arrêté préfectoral relatif aux usages du feu (30 april 2026) https://www.coignieres.fr/app/uploads/1/2026/05/arrete-prefectoral-feu.pdf
- Kampterreinen (voorstel 50):
  - A: nee Geen nationale lijst van >=10 jeugdkampterreinen geopend (gruppenhaus.de toont maar 5 Zeltplätze in Frankrijk: 3 commerciële ZEBU/Naturoase-camps). 
  - B: ja Vier met naam te noemen terreinen met prijs of boekingsformulier: Jambville (SGDF), Kanucamp Tarnschlucht, Camp Allemand en Naturoase Tendon; de laatste drie zijn via gruppenhaus.de geopend (prijs per persoon). 
    - Domaine de Jambville (Scouts et Guides de France) (Jambville (Vexin, <1 u van Parijs)) http://jambville.sgdf.fr/ · 52 ha prairie en bos; van kamer tot tent 'sous les étoiles'; >500 verblijven per jaar, evenementen van 10 tot 20 000 deelnemers; reservering via online formulier; prijzen niet gelezen.
    - Pfadfinder Kanucamp Tarnschlucht (Montbrun (Gorges du Tarn, Lozère)) https://www.gruppenhaus.de/pfadfinder-kanucamp-tarnschlucht-pfadfinderzeltplatz-in-suedfrankreich-montbrun-hs10532.html · Pfadfinder-Zeltplatz sinds 2015 voor scouts- en jeugdgroepen; plaats voor 70 personen; vanaf 6,50 euro p.p. (zelfverzorging); 16 kano's inbegrepen; alleenbezetting vanaf 40 personen.
    - Camp Allemand (Le Chambon-sur-Lignon (Haute-Loire)) https://www.gruppenhaus.de/camp-allemand-le-chambon-sur-lignon-hs10529.html · Huis voor 14 personen en tentenweide voor 70 personen; 5,50 tot 15 euro p.p. (zelfverzorging); alleenbezetting vanaf 5 personen.
    - Naturoase Tendon (Tendon (Vogezen)) https://www.gruppenhaus.de/naturoase-tendon-vogesen-frankreich-tendon-hs10703.html · 25 bedden, tentenweide; vanaf 12 euro per nacht p.p. volgens de lijstpagina van gruppenhaus.de (detailpagina geopend maar niet gelezen).
  - C: ja Jambville is een SCENES-centrum van WOSM en het activiteitencentrum van Scouts et Guides de France; de pagina meldt niets over buitenlandse groepen maar de reservering staat open. http://jambville.sgdf.fr/
  - D: nee Niet onderzocht. 

## Wat je oplevert
1. `bron/kampbeeld/fr.json`:
```json
{
 "iso2": "FR", "naam": "Frankrijk", "datum": "JJJJ-MM-DD",
 "slogan": "één zin van hoogstens 70 tekens die het kamp daar samenvat, concreet (plaatsnamen mogen)",
 "activiteiten": [
  { "titel": "Kajakken op de Nærøyfjord", "plek": "Gudvangen, Vestland", "variabele": "av_kust",
    "uitleg": "max 220 tekens: wat doe je, waarom kan dat juist hier, wat kost het of wat is gratis; concreet en controleerbaar",
    "bron": { "naam": "Visit Norway, Nærøyfjord", "url": "https://..." }, "foto": 0 }
 ],
 "kampplaatsen": [ { "naam": "...", "plaats": "...", "url": "https://...", "details": "voor jeugdgroepen met tenten · capaciteit of prijs als je die ziet · afstand tot station" } ],
 "fotos": [ { "bestand": "fr-1.jpg", "bijschrift": "wat je ziet, met plaatsnaam", "auteur": "naam of gebruikersnaam op Commons", "licentie": "CC BY-SA 4.0", "bron_url": "https://commons.wikimedia.org/wiki/File:..." } ],
 "bronnen": [ { "naam": "...", "url": "..." } ],
 "problemen": [ "..." ]
}
```
2. De foto's in `bron/foto/fr-1.jpg` … (JPEG, langste zijde 1600 px, hoogstens 350 KB per foto).

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
  `convert in.jpg -auto-orient -resize 1600x1600\> -strip -interlace Plane -quality 80 /home/user/animaties/scout-atlas-2027/bron/foto/fr-N.jpg`.
  Kies liggende foto's (breder dan hoog) van landschap of activiteit, scherp en zonder tekst of logo; geen close-ups van herkenbare kinderen.
  Elke foto hoort bij één activiteit (`foto`-index) of bij de kampplaats. Vul auteur en licentie exact in zoals Commons ze geeft (Artist mag
  ontdaan worden van HTML). Lukt een download niet, neem een andere foto; verzin nooit een licentie.
- **Bronnen**: officiële toerismesites, nationale parken, scoutsorganisaties, Wikipedia/Wikivoyage. Reisblogs alleen als wegwijzer.
- **Zoekbudget**: WebSearch is schaars (gedeeld): hoogstens 15 keer voor dit land, alleen als je met WebFetch en de Commons-API niet verder komt.
- Schrijf niets anders dan het JSON-bestand en de foto's. Controleer op het einde: `cd /home/user/animaties/scout-atlas-2027/onderzoek && node valideer-kampbeeld.mjs FR`
  moet "Kampbeeld in orde" zeggen; herstel fouten tot het zover is.

Rapporteer in hoogstens 12 regels: de activiteiten (titel + variabele), het aantal foto's en kampplaatsen, en wat je niet kon bevestigen.
