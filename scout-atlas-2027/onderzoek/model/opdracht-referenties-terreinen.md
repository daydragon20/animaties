# Tweede pas: kampterreinen voor groepen (kamp_groepsterrein), 31 landen met weinig bewijs

Het referentiebestand `model/referenties-kamperen.json` (eerste pas) is klaar en geldig, maar voor `kamp_groepsterrein` staan 31 van de 42
landen op 0 of 25, vaak omdat de nationale scoutssite een JavaScript-app is, een 403 gaf, of omdat de zoekopdrachten op zijn. "Niet gevonden"
is daar nog geen "bestaat niet": Finland, Noorwegen, Zwitserland, het VK, IJsland en Spanje hebben aantoonbaar kampterreinen voor groepen.
Jij doet voor die 31 landen een **tweede, gerichte pas** en verbetert alleen het veld `kamp_groepsterrein` van die landen.

Werkmap: `/home/user/animaties/scout-atlas-2027/onderzoek/`. Lees eerst in `model/model.json` de meter van `kamp_groepsterrein` (criteria A tot D,
rubriek 0/25/50/75/100) en bekijk in `model/referenties-kamperen.json` hoe de bestaande entries eruitzien (structuur ongewijzigd laten).

## De landen (voorstel ≤ 25 in de eerste pas)
Spanje, Andorra, Verenigd Koninkrijk, IJsland, Noorwegen, Finland, Estland, Letland, Litouwen, Zwitserland, Liechtenstein, Oostenrijk, Slowakije,
San Marino, Malta, Kroatië, Bosnië en Herzegovina, Montenegro, Servië, Kosovo, Noord-Macedonië, Griekenland, Bulgarije, Cyprus, Turkije, Moldavië,
Oekraïne, Belarus, Rusland, Armenië, Azerbeidzjan. (Oekraïne, Belarus en Rusland doen niet mee door het reisadvies: hooguit 1 poging elk.)

## Startpunten om te controleren (uit geheugen; verifieer ze, ze kunnen fout of verouderd zijn)
- **Als een site 403 geeft of alleen JavaScript is**: open dezelfde URL via de Wayback Machine, `https://web.archive.org/web/2025/<url>`
  (curl volgt de redirect met `-L`); dat telt als bron als de pagina de lijst of het terrein toont (noteer de archief-URL).
- Noorwegen: Norges Speiderforbund (speiding.no, leirsteder; probeer ook de API of ut.no "speiderhytte"), KFUK-KFUM-speiderne (kmspeider.no,
  "leirsteder" zoals Nordtangen), Hordaland krins (Kvamsøy staat al in de eerste pas).
- Finland: Suomen Partiolaiset (partio.fi: "kämpät ja leirialueet"), Evon leirialue (Hämeen Partiopiiri), Kiljava, de partiopiirit hebben elk leirialueet.
- Verenigd Koninkrijk: scouts.org.uk campsite finder (403 → Wayback), Wikipedia "List of Scout campsites" / "Category:Scout campsites in England",
  Gilwell Park, Youlbury, Walesby Forest, Broadstone Warren, Tolmers, Phasels Wood (elk met eigen site en prijzen).
- IJsland: Úlfljótsvatn Scout Centre (ulfljotsvatn.is; SCENES-geaccrediteerd volgens scout.org/SCENES, controleer).
- Zwitserland: Kandersteg International Scout Centre (kisc.ch; SCENES), pfadiheime.ch (databank van Pfadiheime en Lagerplätze, honderden),
  Pfadibewegung Schweiz "Zeltplätze".
- Oostenrijk: Pfadfinder und Pfadfinderinnen Österreichs (ppoe.at: Lagerplätze), Scout Camp Austria Wassergspreng, gruppenhaus.de/oesterreich.
- Spanje: scout.es, registers van "instal·lacions juvenils / terrenys d'acampada" (Generalitat de Catalunya, jovecat), "campamentos juveniles"
  (Junta de Andalucía, Gobierno Vasco), Scouts de Aragón "campos de acampada".
- Estland: Eesti Skautide Ühing, Tagametsa skaudilaager; Letland: Latvijas Skautu un Gaidu Centrālā Organizācija (skauti.lv) nometņu vietas;
  Litouwen: Lietuvos skautija (skautai.lt) stovyklavietės.
- Slowakije: Slovenský skauting (skauting.sk) táboriská a základne. Kroatië: Savez izviđača Hrvatske (scouts.hr) izviđački centri.
- Griekenland: Σώμα Ελλήνων Προσκόπων (sep.org.gr) Προσκοπικά Κέντρα. Bulgarije: Организация на българските скаути. Servië: Savez izviđača
  Srbije. Bosnië, Montenegro, Noord-Macedonië, Kosovo: nationale verenigingen (WOSM-ledenlijst op scout.org).
- Malta: The Scout Association of Malta, Għajn Tuffieħa Scout Campsite. Cyprus: Cyprus Scouts Association kampterreinen.
- Turkije: Türkiye İzcilik Federasyonu (tif.gov.tr) izci kampları/kamp alanları. Armenië, Azerbeidzjan, Moldavië: nationale scoutsorganisatie.
- Andorra, Liechtenstein, San Marino: kleine staten; 0 mag, maar controleer de buurlanden niet mee (het gaat om het land zelf).

## Regels
- **Zoekbudget: hoogstens 60 WebSearch-aanroepen** in totaal; gebruik eerst WebFetch en curl (`-sS -L -A "ScoutAtlas/1.0 (nathan@charut.be)"`) op
  de startpunten hierboven. Wikimedia geeft 429 bij te veel verzoeken: wacht dan 20 s.
- Per criterium alleen "vervuld": true als je het zelf gezien hebt (lijst met ≥10 terreinen voor A; 3 terreinen met naam, plaats, URL en
  contact of prijs voor B; een centrum dat buitenlandse groepen ontvangt voor C; ≥10 campings met groepsvoorziening op een portaal voor D).
  Noteer altijd de URL die je opende; bij Wayback de archief-URL.
- Vul per land `voorstel` = aantal vervulde criteria × 25, en zet in `opmerking` "tweede pas: …" met wat je vond of niet vond.
- Verander niets aan de andere landen en niets aan `kamp_wild` en `kamp_vuur`. Bewaar de JSON-structuur exact (zie bestaande entries:
  A/B/C/D met vervuld, bewijs, url en bij B `terreinen` [{naam, plaats, url, details}]).
- Sla tussentijds op (na elke 5 landen). Werk de tabel in `model/REFERENTIES-KAMPEREN.md` bij voor de gewijzigde landen en voeg onderaan een
  korte sectie "Tweede pas kampterreinen" toe.
- Controleer op het einde met `node valideer-referenties.mjs` (moet "Referenties in orde" zeggen).

Rapporteer in hoogstens 15 regels: welke landen omhoog gingen (van → naar), hoeveel zoekopdrachten, en welke sites onbereikbaar bleven.
