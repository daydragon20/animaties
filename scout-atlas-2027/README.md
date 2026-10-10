# Scout Atlas 2027: de film (versie 3)

Een film van 2 minuten 46 (16:9, met muziek) over de keuze van het buitenlandse kamp, zomer 2027. Na de film opent vanzelf de
**verkenner**: alle data, elke bron, en de spreiding over de tien onderzoeksrondes.

**Openen:** dubbelklik `index.html`. Het is één bestand en werkt ook zonder internet. Zet je geluid aan.

| Toets | Wat |
|---|---|
| spatie | afspelen / pauzeren |
| ← → | 10 seconden terug / vooruit |
| R | opnieuw vanaf het begin |
| M | geluid aan / uit |
| D | naar de data (verkenner) |
| F | volledig scherm |
| H | bediening verbergen (voor een schone schermopname) |
| Esc | terug van de verkenner naar de film |

De bediening en de muiscursor verdwijnen vanzelf tijdens het afspelen. De tijdlijn onderaan is per hoofdstuk opgedeeld.

**Schermopname:** open de film, druk op F, wacht tot onder de startknop "klaar · zet je geluid aan" staat, start je opname met
systeemgeluid en druk dan op spatie.

## Wat er nieuw is tegenover de vorige versies

- **De data is het product van tien onafhankelijke onderzoeksrondes.** Elke variabele heeft een meter (wat, eenheid, bron, schaal).
  Per ronde verzamelden Haiku-agents de cijfers en bronnen opnieuw, en berekende een Sonnet-agent de scores. Per cel telt de waarde die het
  vaakst voorkomt. Zie [`onderzoek/README.md`](onderzoek/README.md) en [`onderzoek/CONSENSUS.md`](onderzoek/CONSENSUS.md).
- **Nieuwe prioriteiten**: kostprijs en avontuur wegen samen 50 %, kamperen (mag het, zijn er kampplaatsen, is het mooi) 22 %, al de rest 28 %.
  Elke variabele weegt minstens 1,2 %.
- **Nieuw ontwerp**, vanaf nul: het begint bij een kampvuur in een miniatuurlandschap, trekt terug naar de wereldbol, en gaat via het
  diorama van Europa (behouden en verbeterd), de rugzak met drie vakken, de meetlatten, de tien rondes, het kubuslandschap, de race,
  een 3D-ruimte met drie assen en het podium naar de bestemming. Grote, leesbare tekst, zoals in de tweede versie.
- **Verkenner met bronnen**: klik op een cel en je ziet de vraag, de meter, de gemeten waarde met eenheid, de bron (klikbaar), de score
  en de waarden van alle tien rondes. Plus: ranglijst met plaats per ronde, gewichten per tier en per categorie, de rondes, bronnen en meters, CSV.

## Het verhaal (tempo 120, 1 tel = 0,5 s)

| Tijd | Hoofdstuk | Licht | Wat je ziet |
|---|---|---|---|
| 0:00 | Het kamp | nacht → dag | een kampvuur tussen drie tenten; dan de wereldbol met een gloeiend puntje op België; de zon komt op; "Welk land?" |
| 0:16 | De kandidaten | dag | het 3D-diorama: 42 landen rijzen op; drie zakken terug (alle reizen afgeraden); 39 doen mee |
| 0:32 | De weging | dag | de rugzak met drie vakken (50 / 22 / 28 %); drie meetlatten met de waarde van de winnaar; tien ranglijsten die samenvallen |
| 1:00 | Het landschap | nacht | alle scores als kubussen, gesorteerd op eindscore; de top tien gaat door |
| 1:18 | De race | nacht | top tien, categorie per categorie, zwaarste eerst; tussenstand en volgorde horen bij elkaar |
| 1:46 | De ruimte | dag | elk land een bol in drie dimensies (kost, avontuur, kamperen); dan het vlakke speelveld met kwadranten |
| 2:04 | Het podium | dag | top drie met eindscore, sterkste en zwakste categorie, en "x van 10 rondes gewonnen"; plaatsen 4–10 |
| 2:20 | De bestemming | gouden uur | de route van België naar de winnaar; wat nog uitgezocht moet worden; aftiteling |

Daarna opent de verkenner.

## Over de getallen

- Alles in beeld wordt in het bestand zelf berekend uit `bron/scout-atlas-2027-data.json` (scores per variabele en gewichten).
  Niets is overgetypt; elke zin over de uitkomst (wie leidt, wie zakt, welk kwadrant) wordt uit de data afgeleid.
- Eindscores met 1 decimaal in de film, 2 in de verkenner; de volgorde volgt de exacte waarde.
- `bron/controle.mjs` herberekent onafhankelijk elke celscore uit de ruwe waarde en de schaal, elke categoriescore, eindscore en rang.
- Landen met een negatief reisadvies (alle reizen afgeraden) krijgen een score maar doen niet mee: knock-out, geen minpunt.

## Bouwen (alleen nodig als je iets aanpast)

```bash
cd onderzoek && node consensus.mjs   # alle rondes → bron/scout-atlas-2027-data.json
cd ../bron && node controle.mjs      # onafhankelijke controle van de data
node bouw.mjs                        # data, kaart, lettertypes, three.js en verkenner → ../index.html
```

De film zit in `bron/js/` (één bestand per onderdeel, op volgorde van naam), de verkenner in `bron/js/95-verkenner.js`,
`bron/verkenner.html` en `bron/verkenner.css`. De kaart komt uit `bron/kaart.mjs` (Natural Earth).
Testhaakjes in de adresbalk: `?t=95` (spring naar 95 s), `?clean` (zonder bediening), `?nosound`, `?data` (meteen de verkenner),
`?q=0.6` (lagere 3D-kwaliteit voor trage computers).

## Bronnen en licenties

- Cijfers en methode: `onderzoek/` (model, rondes, consensus) en het tabblad "Bronnen en meters" in de verkenner.
- Kaartdata: Natural Earth (publiek domein), via `world-atlas`.
- 3D: three.js r149 (MIT, zie `bron/vendor/three-LICENSE.txt`).
- Lettertypes: Big Shoulders Display, Fraunces, IBM Plex Mono (SIL Open Font License).
- Muziek en geluidseffecten: zelf opgewekt in het bestand (een kleine synthesizer in JavaScript). Geen stockmateriaal, geen stem.
