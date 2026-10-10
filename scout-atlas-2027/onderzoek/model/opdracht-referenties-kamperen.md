# Referentieonderzoek kamperen (eenmalig, grondig)

Je bent de referentie-onderzoeker van **Scout Atlas 2027**. Een Vlaamse scoutsgroep (verkenners 14–16 jaar, 10–15 leden, 5 à 6 tenten)
kiest het land voor een tentenkamp van ±10 dagen in juli/augustus 2027. De tien onderzoeksrondes (Haiku-agents) hebben voor de drie
kampeervariabelen hieronder te weinig zoekbudget: ze vinden de wetten en de kampterreinen niet en vullen dan "laag" of null in.
Jij legt daarom **één keer, grondig** per land de bronnen vast. De rondes lezen daarna jouw bronnen opnieuw en bepalen zelf het niveau.

Werkmap: `/home/user/animaties/scout-atlas-2027/onderzoek/`. Lees eerst `model/model.json` (de variabelen `kamp_wild`, `kamp_vuur` en
`kamp_groepsterrein`: hun meter, rubriekniveaus en bronnen) en de landenlijst erin (42 landen, gebruik EXACT die Nederlandse namen).

## Wat je oplevert
`model/referenties-kamperen.json`:
```json
{
 "datum": "JJJJ-MM-DD", "versie": 1,
 "landen": {
  "Noorwegen": {
   "kamp_wild": { "voorstel": 100, "regeling": "Friluftsloven (1957) §9: telt in utmark, 150 m van bewoning, max 2 nachten", "regionaal": "",
     "bronnen": [{ "naam": "Lovdata, Friluftsloven", "url": "https://lovdata.no/dokument/NL/lov/1957-06-28-16", "jaar": "2026", "taal": "no", "bereikbaar": "ja", "wat_staat_er": "citaat of samenvatting in max 300 tekens" }],
     "groepen": "wat de regel zegt over groepen van 5 à 6 tenten", "opmerking": "" },
   "kamp_vuur": { "voorstel": 50, "regeling": "Forskrift om brannforebygging §3: algemeen vuurverbod in of bij bos 15 april–15 september, tenzij het duidelijk niet kan branden", "bronnen": [ ... ], "opmerking": "" },
   "kamp_groepsterrein": { "voorstel": 75,
     "A": { "vervuld": true, "bewijs": "lijst van 60 speiderhytter en leirsteder", "url": "..." },
     "B": { "vervuld": true, "terreinen": [{ "naam": "...", "plaats": "...", "url": "...", "details": "capaciteit, prijs, voor groepen" }] },
     "C": { "vervuld": true, "bewijs": "...", "url": "..." },
     "D": { "vervuld": false, "bewijs": "niets gevonden op ...", "url": "" },
     "opmerking": "" }
  }
 },
 "werkwijze": "korte beschrijving", "problemen": ["..."]
}
```
Het "voorstel" is exact één rubriekniveau uit model.json (kamp_wild: 100/80/55/30/0 · kamp_vuur: 100/75/50/25/0 · kamp_groepsterrein: aantal
vervulde criteria × 25). Elke bron die je opgeeft heb je zelf geopend (WebFetch of curl); "bereikbaar" is ja of nee.

Schrijf ook `model/REFERENTIES-KAMPEREN.md`: een tabel land × (wild, vuur, terrein) met het voorstel en de belangrijkste bron, en
onderaan de landen waar je twijfelt en waarom.

## Werkwijze en budget
- **WebSearch is schaars (gedeeld budget): gebruik het hoogstens 60 keer in totaal.** Gebruik het alleen voor landen waarvan je de
  officiële bron niet kent. Voor de rest gebruik je WebFetch op URL's die je kent of logisch afleidt, en curl voor grote pagina's
  (`curl -sS -A "ScoutAtlas/1.0 (nathan@charut.be)"`; Wikimedia geeft 429 bij te veel verzoeken, wacht dan 20 s).
- Vaste wegwijzers die je zeker leest: https://en.wikipedia.org/wiki/Freedom_to_roam en
  https://en.wikipedia.org/wiki/Right_of_public_access_to_the_wilderness (landsecties met verwijzing naar de wet),
  https://en.wikivoyage.org/wiki/Camping en de landenpagina's van Wikivoyage (sectie Sleep), de ÖAMTC-overzichtspagina uit model.json,
  https://www.scout.org/SCENES en de websites van de nationale scoutsorganisaties (WOSM-leden), gruppenhaus.de (DE/AT/CH/FR/IT/NL),
  de officiële toerismesites (visitnorway, visitsweden, visitfinland, visitscotland, …) voor de kampeer- en vuurregels.
- Voorrang: eerst de wet of de officiële overheids- of natuurbeheerpagina, dan de officiële toerismesite, dan Wikipedia/Wikivoyage, dan
  de pers. Reisblogs tellen niet als bron (hooguit als wegwijzer naar de wet).
- Werk in volgorde: eerst de 15 landen die het meest kans maken (NO, SE, FI, EE, LV, LT, IS, GB, IE, FR, DE, AT, CH, CZ, SK), dan de rest.
  Voor UA, BY en RU volstaat een korte vermelding (ze doen niet mee door het reisadvies).
- **Sla tussentijds op**: schrijf het JSON-bestand na elke 5 landen opnieuw weg, zodat niets verloren gaat.
- Verzin niets. Weet je het niet, schrijf "niet gevonden" en geef een voorstel op basis van het meest vergelijkbare buurland met
  "opmerking": "afgeleid van <land>". Ken je een wet uit je geheugen maar kun je de tekst niet openen: zeg dat, met de naam van de wet.
- Voor criterium B (groepsterrein) zoek je terreinen die uitdrukkelijk jeugd- of scoutsgroepen met tenten ontvangen; noteer per terrein
  de plaats en één regel details. Die lijst wordt later gebruikt om concrete kampplaatsen te tonen, dus liever 3 goede dan 10 vage.
- Controleer je JSON op het einde: `node valideer-referenties.mjs` (vanuit de werkmap) moet "Referenties in orde" zeggen.
- Schrijf nergens anders dan de twee bestanden in `model/`. Kijk niet in `rondes/`.

Rapporteer in hoogstens 15 regels: hoeveel landen per variabele een officiële bron hebben, hoeveel zoekopdrachten je gebruikte, en de
grootste twijfels.
