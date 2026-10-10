# Waar de cijfers vandaan komen (versie 2, 10 oktober 2026)

## Het model in drie stappen

1. **39 feiten per land** (`bron/feiten.mjs`). Elk feit heeft een bron, een zekerheid en een vaste schaal
   naar 0–100. De schaal is absoluut (bv. prijspeil 50 → 100 punten, 185 → 0 punten), dus een score verandert
   niet als er landen bijkomen of afvallen.
2. **164 vragen in 14 categorieën** (`bron/variabelen.mjs`). Elke vraag is een gewogen mix van feiten.
   Voorbeeld: *Taal bij medische hulp* = 40 % "Nederlands, Frans of Duits ter plaatse" + 60 % "Engels".
3. **Gewichten.** De categoriegewichten zijn de prioriteiten van de groep (Veiligheid 16, Avontuur 12,
   Kostprijs 10, Kamp 9, Landschap 8, Vervoer 8, Cultuur 7, Weer 6, Kleine groep 5, Internationale scouting 5,
   Uniek 4, Groepsdynamiek 4, Praktisch 3, Eindbeleving 3; samen 100). Binnen een categorie wegen zware vragen
   1,45× zwaarder dan lichte, zoals in versie 1.

Eindscore = som van (gewicht × score) / 100. `node bron/bereken.mjs` berekent alles en print de ranglijst.

## Zekerheid per feit

**Hoog (15)**, uit een dataset of een officiële pagina:

| Feit | Bron | Op 10-10-2026 online nagekeken? |
|---|---|---|
| Reisadvies | FOD Buitenlandse Zaken, diplomatie.belgium.be | ja: Rusland (update 23-07-2026), Belarus (17-07-2026), Oekraïne: *alle reizen afgeraden*; Georgië (05-10-2026): enkel Abchazië en Zuid-Ossetië; Armenië (19-06-2025): 5 km van de grens met Azerbeidzjan; Azerbeidzjan: districten rond Nagorno-Karabach; Turkije (02-07-2026): grensstreken met Syrië, Irak en Iran; Kosovo (11-09-2026): de vier noordelijke gemeenten; Moldavië: Transnistrië |
| Vrede en veiligheid | Global Peace Index 2025 (Institute for Economics & Peace), volledige landentabel | ja (pdf) |
| Prijspeil | Eurostat, prijspeil werkelijke individuele consumptie 2025, EU = 100 (publicatie 25-06-2026) | ja, via het Euronews-overzicht van die publicatie; LU, CY, MT, EE, LV en alle niet-Eurostat-landen geschat |
| Engels | EF English Proficiency Index 2025 | ja (ef.com en het Wikipedia-overzicht); IE, VK, MT, IS, LU, LI, SM, AD, ME niet in de index: geschat |
| Scouts per 1.000 inwoners | WOSM-ledencijfers (Wikipedia-overzicht, cijfers 2019), bevolking 2024 | ja (ledencijfers); Kosovo is geen WOSM-lid, Andorra pas sinds 2016 heropgestart |
| Munt | euro, gekoppeld, stabiel of volatiel; Bulgarije is euroland sinds 01-01-2026 | ja (Bulgarije) |
| Roaming | EU-roamingverordening; Oekraïne in de roamingzone sinds 01-01-2026 | ja (Oekraïne) |
| Europese ziekteverzekeringskaart | EU/EER, Zwitserland, VK = geldig; Westelijke Balkan en Turkije: bilaterale verdragen, gedeeltelijk | nee, parate kennis |
| Nederlands, Frans of Duits ter plaatse | officiële en veelgesproken talen | nee, parate kennis |
| Afstand vanuit Brussel | wegafstand naar de typische kampregio | nee, afgerond op 50–100 km |
| Bosbedekking | FAO Global Forest Resources Assessment 2020 | nee, parate kennis |
| Temperatuur en neerslag in juli | klimaatnormalen 1991–2020 voor de kampregio | nee, parate kennis |
| Reisdocumenten | identiteitskaart volstaat / paspoort / visum | nee, parate kennis (VK: paspoort; Rusland: visum; Belarus: paspoort) |
| Compactheid | oppervlakte in km² | nee, parate kennis |

**Midden (17)**, uit meerdere bronnen samengebracht, of een dataset die niet elk land dekt: verkeersdoden
(ETSC/EC 2024 voor de EU, nagekeken: Noorwegen 16, Zweden 20, Bulgarije 74, Roemenië 78, Servië 74–78 per
miljoen; buiten de EU WHO-schattingen), gezondheidszorg (WHO UHC-index), natuurlijke gevaren (INFORM Risk),
rechtstreekse verbinding, openbaar vervoer, bergen, kust en zee, meren en rivieren, nationale parken,
wildkamperen (nagekeken: allemansrecht in Noorwegen, Zweden, Finland; strikt verboden in Kroatië, Portugal en
Griekenland, Griekse wet 5170/2025 met boetes tot 3.000 euro), kampvuur, drinkwater en sanitair, bosbrand
(EFFIS), tekenencefalitis (ECDC), erfgoed, toeristische druk, betalen met kaart.

**Laag (7)**, expertoordeel zonder dataset: reiskost heen en terug, spektakelwaarde van het landschap, aanbod
jeugd- en scoutskampplaatsen, muggen en insecten, cultuurverschil met België, gastvrijheid, en "Vlaamse groepen
gaan er al". **Deze zeven wegen samen zo'n 18 % van het totaal.** Wil je het model harder maken, begin hier.

## Beslissingen die ik genomen heb (en die je kunt terugdraaien)

- **Wat is "heel Europa"?** Alle soevereine staten die op het Europese continent liggen, plus de landen die
  Europa zelf meerekent (Raad van Europa, UEFA): Cyprus, Turkije, Georgië, Armenië, Azerbeidzjan. Kazachstan niet.
- **Vaticaanstad en Monaco** staan er niet in: er is geen plek voor een tent. San Marino, Liechtenstein, Andorra
  en Malta wel, die hebben kampeerterreinen.
- **Rusland, Oekraïne en Belarus** krijgen een score zoals elk ander land, maar doen niet mee aan de race:
  een negatief reisadvies is een knock-out, geen minpunt. Ze staan daarom altijd onderaan de ranglijst, met hun
  score erbij voor de volledigheid.
- **Groepen en allemansrecht.** In Noorwegen, Zweden, Finland en Estland mag je vrij kamperen, maar een groep van
  10–15 hoort de grondeigenaar te verwittigen. Daarom 90–95 en geen 100.
- **De top is dicht bij elkaar.** Noorwegen 75,2, Zweden 74,7, Verenigd Koninkrijk 74,7, Finland 74,1.
  Dat verschil zit binnen de onzekerheid van de zeven geschatte feiten. De film zegt daarom niet "Noorwegen wint
  met voorsprong" maar "Noorwegen staat bovenaan, nu begint het echte plannen".

## Wat niet in de score zit

Een concrete kampplaats, de beschikbaarheid in juli 2027, de reële prijs van de reis op jullie data, en het
reisadvies op het moment van vertrek. Dat staat op de lijst "Nog uitzoeken" aan het eind van de film.
