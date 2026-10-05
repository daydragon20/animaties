# Datacontrole Scout Atlas 2027

Bron: `bron/scout-atlas-2027-data.json` (gegenereerd 2026-10-04). Gecontroleerd met `bron/controle.mjs`.

## 1. Structuur

| Controle | Resultaat |
|---|---|
| Aantal vragen | 188 |
| Aantal landen | 25 |
| Categorieën | 14 |
| Elk land heeft 188 scores | ja ✓ |
| Vraag-id's lopen 1 t/m 188 | ja ✓ |
| Som van de gewichten | 100,000 (≈ 100 ✓) |
| Laagste / hoogste score | 50,7 / 100,0 (binnen 0–100 ✓) |
| Totaal aantal scores | 4700 |

## 2. Gewicht per categorie (som van de vraaggewichten = aandeel in de eindscore)

| Categorie | Vragen | Gewicht | Aandeel |
|---|---:|---:|---:|
| Veiligheid & gezondheid | 15 | 16,005 | 16,0 % |
| Avontuur & activiteiten | 25 | 11,999 | 12,0 % |
| Kostprijs | 15 | 10,005 | 10,0 % |
| Kamp | 18 | 8,996 | 9,0 % |
| Landschap & wow-factor | 11 | 7,999 | 8,0 % |
| Vervoer | 14 | 7,998 | 8,0 % |
| Cultuur | 13 | 7,004 | 7,0 % |
| Weer & natuur | 14 | 5,999 | 6,0 % |
| Internationale scouting | 9 | 5,004 | 5,0 % |
| Kleine groep | 11 | 5,002 | 5,0 % |
| Uniek tegenover andere groepen | 8 | 4,000 | 4,0 % |
| Groepsdynamiek | 11 | 3,998 | 4,0 % |
| Praktisch | 14 | 2,998 | 3,0 % |
| Eindbeleving | 10 | 2,993 | 3,0 % |

Zwaarste vraag: **Algemene veiligheid** (1,067). Lichtste vraag: **Geldautomaten** (0,151). Verhouding: 7,07×.

## 3. Eindscore en volgorde

De eindscore in de JSON is het gewogen gemiddelde van de 188 scores, afgerond op 1 decimaal. Dat klopt voor elk land.
Maar door die afronding staan landen met dezelfde "afgeronde" score soms in de verkeerde volgorde.

| Rang (exact) | Land | Exact | JSON | Rang in JSON | |
|---:|---|---:|---:|---:|---|
| 1 | Slovenië | 91,275 | 91,3 | 1 | ✓ |
| 2 | Portugal | 89,958 | 90,0 | 2 | ✓ |
| 3 | Slowakije | 89,648 | 89,6 | 3 | ✓ |
| 4 | Kroatië | 89,363 | 89,4 | 4 | ✓ |
| 5 | Polen | 89,122 | 89,1 | 6 | **volgorde verschilt** |
| 6 | Oostenrijk | 89,061 | 89,1 | 5 | **volgorde verschilt** |
| 7 | Tsjechië | 88,623 | 88,6 | 7 | ✓ |
| 8 | Zwitserland | 88,444 | 88,4 | 8 | ✓ |
| 9 | Spanje | 88,269 | 88,3 | 9 | ✓ |
| 10 | Griekenland | 88,156 | 88,2 | 10 | ✓ |
| 11 | Frankrijk | 88,027 | 88,0 | 12 | **volgorde verschilt** |
| 12 | Montenegro | 88,013 | 88,0 | 11 | **volgorde verschilt** |
| 13 | Hongarije | 88,003 | 88,0 | 13 | ✓ |
| 14 | Italië | 87,354 | 87,4 | 14 | ✓ |
| 15 | Duitsland | 87,045 | 87,0 | 15 | ✓ |
| 16 | Albanië | 86,863 | 86,9 | 16 | ✓ |
| 17 | Bosnië en Herzegovina | 86,725 | 86,7 | 17 | ✓ |
| 18 | Canada | 86,602 | 86,6 | 18 | ✓ |
| 19 | Roemenië | 86,350 | 86,3 | 19 | ✓ |
| 20 | Noord-Macedonië | 86,189 | 86,2 | 20 | ✓ |
| 21 | Servië | 86,006 | 86,0 | 21 | ✓ |
| 22 | Bulgarije | 85,504 | 85,5 | 22 | ✓ |
| 23 | Turkije | 85,366 | 85,4 | 23 | ✓ |
| 24 | Kosovo | 84,614 | 84,6 | 24 | ✓ |
| 25 | Georgië | 84,502 | 84,5 | 25 | ✓ |

Eindscores die niet kloppen met de ruwe data: **0**. Landen op een andere plaats dan in de JSON: **4**.

**Aangepast in de film:** eindscores met 2 decimalen en volgorde op de exacte waarde (Polen vóór Oostenrijk, Frankrijk vóór Montenegro).

## 4. Categoriescores

In de JSON is een categoriescore het **ongewogen** gemiddelde van de vragen in die categorie, terwijl de eindscore **gewogen** is.
De film gebruikt het gewogen gemiddelde. Dan geldt exact: eindscore = Σ (categoriegewicht × categoriescore) / 100.

Categoriescores die met weging anders uitkomen (≥ 0,1): **156** van 350. Grootste verschil: 0,4 punt.

| Land | Categorie | JSON (ongewogen) | Film (gewogen) | Verschil |
|---|---|---:|---:|---:|
| Kroatië | Landschap & wow-factor | 94,6 | 95,0 | +0,4 |
| Georgië | Vervoer | 67,9 | 67,6 | -0,3 |
| Portugal | Weer & natuur | 89,2 | 89,5 | +0,3 |
| Tsjechië | Landschap & wow-factor | 84,2 | 84,5 | +0,3 |
| Tsjechië | Kostprijs | 78,0 | 77,7 | -0,3 |
| Hongarije | Weer & natuur | 83,5 | 83,8 | +0,3 |
| Roemenië | Landschap & wow-factor | 89,6 | 89,3 | -0,3 |
| Bulgarije | Weer & natuur | 82,3 | 82,0 | -0,3 |
| Slovenië | Landschap & wow-factor | 93,2 | 93,4 | +0,2 |
| Slovenië | Kleine groep | 91,5 | 91,7 | +0,2 |
| Portugal | Landschap & wow-factor | 90,5 | 90,7 | +0,2 |
| Slowakije | Vervoer | 95,1 | 95,3 | +0,2 |
| Kroatië | Weer & natuur | 86,3 | 86,1 | -0,2 |
| Polen | Landschap & wow-factor | 86,2 | 86,0 | -0,2 |
| Polen | Vervoer | 95,0 | 95,2 | +0,2 |
| Tsjechië | Avontuur & activiteiten | 82,3 | 82,5 | +0,2 |
| Griekenland | Kleine groep | 91,2 | 91,4 | +0,2 |
| Hongarije | Vervoer | 91,3 | 91,5 | +0,2 |
| Italië | Landschap & wow-factor | 94,2 | 94,4 | +0,2 |
| Albanië | Vervoer | 73,0 | 73,2 | +0,2 |
| Bosnië en Herzegovina | Kostprijs | 96,2 | 96,4 | +0,2 |
| Canada | Landschap & wow-factor | 98,7 | 98,9 | +0,2 |
| Canada | Kostprijs | 64,0 | 63,8 | -0,2 |
| Turkije | Landschap & wow-factor | 96,7 | 96,5 | -0,2 |
| Kosovo | Kamp | 69,6 | 69,8 | +0,2 |
| Georgië | Kostprijs | 96,7 | 96,9 | +0,2 |
| Portugal | Avontuur & activiteiten | 87,4 | 87,6 | +0,2 |
| Slowakije | Avontuur & activiteiten | 84,9 | 85,1 | +0,2 |
| Hongarije | Landschap & wow-factor | 82,4 | 82,6 | +0,2 |
| Duitsland | Avontuur & activiteiten | 81,6 | 81,4 | -0,2 |
| Duitsland | Landschap & wow-factor | 84,9 | 85,1 | +0,2 |
| Duitsland | Kostprijs | 70,9 | 71,1 | +0,2 |
| Duitsland | Weer & natuur | 89,1 | 88,9 | -0,2 |
| Bosnië en Herzegovina | Avontuur & activiteiten | 95,4 | 95,6 | +0,2 |
| Slovenië | Praktisch | 90,9 | 90,8 | -0,1 |
| Portugal | Kostprijs | 85,7 | 85,6 | -0,1 |
| Portugal | Vervoer | 90,2 | 90,1 | -0,1 |
| Portugal | Groepsdynamiek | 89,9 | 89,8 | -0,1 |
| Kroatië | Kamp | 89,2 | 89,1 | -0,1 |
| Polen | Cultuur | 89,1 | 89,2 | +0,1 |
| Polen | Groepsdynamiek | 90,2 | 90,1 | -0,1 |
| Oostenrijk | Kostprijs | 67,7 | 67,6 | -0,1 |
| Tsjechië | Weer & natuur | 86,8 | 86,9 | +0,1 |
| Zwitserland | Vervoer | 97,7 | 97,6 | -0,1 |
| Zwitserland | Kamp | 97,4 | 97,3 | -0,1 |
| Zwitserland | Cultuur | 90,7 | 90,6 | -0,1 |
| Griekenland | Avontuur & activiteiten | 92,8 | 92,9 | +0,1 |
| Griekenland | Praktisch | 86,2 | 86,1 | -0,1 |
| Frankrijk | Kleine groep | 83,7 | 83,6 | -0,1 |
| Frankrijk | Weer & natuur | 87,6 | 87,7 | +0,1 |
| Frankrijk | Groepsdynamiek | 88,9 | 88,8 | -0,1 |
| Montenegro | Kleine groep | 95,1 | 95,2 | +0,1 |
| Montenegro | Vervoer | 75,7 | 75,6 | -0,1 |
| Montenegro | Kamp | 82,1 | 82,2 | +0,1 |
| Montenegro | Weer & natuur | 82,3 | 82,4 | +0,1 |
| Montenegro | Eindbeleving | 95,3 | 95,4 | +0,1 |
| Hongarije | Cultuur | 94,3 | 94,4 | +0,1 |
| Italië | Cultuur | 96,9 | 96,8 | -0,1 |
| Italië | Groepsdynamiek | 90,8 | 90,9 | +0,1 |
| Duitsland | Kamp | 93,9 | 93,8 | -0,1 |
| Duitsland | Groepsdynamiek | 85,9 | 85,8 | -0,1 |
| Albanië | Kamp | 76,2 | 76,1 | -0,1 |
| Bosnië en Herzegovina | Weer & natuur | 83,2 | 83,1 | -0,1 |
| Bosnië en Herzegovina | Groepsdynamiek | 91,2 | 91,1 | -0,1 |
| Roemenië | Cultuur | 88,8 | 88,9 | +0,1 |
| Roemenië | Praktisch | 83,4 | 83,3 | -0,1 |
| Noord-Macedonië | Avontuur & activiteiten | 92,7 | 92,6 | -0,1 |
| Noord-Macedonië | Cultuur | 87,8 | 87,9 | +0,1 |
| Servië | Avontuur & activiteiten | 88,7 | 88,6 | -0,1 |
| Servië | Kostprijs | 94,4 | 94,3 | -0,1 |
| Servië | Kleine groep | 92,1 | 92,2 | +0,1 |
| Servië | Kamp | 79,3 | 79,4 | +0,1 |
| Servië | Weer & natuur | 82,6 | 82,7 | +0,1 |
| Bulgarije | Vervoer | 83,1 | 83,2 | +0,1 |
| Bulgarije | Groepsdynamiek | 86,9 | 86,8 | -0,1 |
| Turkije | Weer & natuur | 74,3 | 74,4 | +0,1 |
| Turkije | Praktisch | 69,8 | 69,9 | +0,1 |
| Kosovo | Avontuur & activiteiten | 91,4 | 91,3 | -0,1 |
| Kosovo | Praktisch | 69,6 | 69,7 | +0,1 |
| Georgië | Kleine groep | 93,1 | 93,2 | +0,1 |
| Georgië | Kamp | 69,9 | 69,8 | -0,1 |
| Georgië | Weer & natuur | 76,6 | 76,7 | +0,1 |
| Zwitserland | Kostprijs | 55,1 | 55,0 | -0,1 |
| Canada | Praktisch | 63,3 | 63,4 | +0,1 |
| Slovenië | Avontuur & activiteiten | 94,6 | 94,5 | -0,1 |
| Slovenië | Weer & natuur | 90,3 | 90,2 | -0,1 |
| Portugal | Kleine groep | 88,3 | 88,2 | -0,1 |
| Slowakije | Landschap & wow-factor | 87,5 | 87,6 | +0,1 |
| Slowakije | Kostprijs | 83,0 | 82,9 | -0,1 |
| Slowakije | Kleine groep | 90,1 | 90,0 | -0,1 |
| Slowakije | Kamp | 93,1 | 93,0 | -0,1 |
| Slowakije | Weer & natuur | 88,0 | 88,1 | +0,1 |
| Slowakije | Cultuur | 90,3 | 90,2 | -0,1 |
| Slowakije | Groepsdynamiek | 90,5 | 90,4 | -0,1 |
| Slowakije | Praktisch | 95,2 | 95,3 | +0,1 |
| Kroatië | Kostprijs | 81,5 | 81,4 | -0,1 |
| Kroatië | Vervoer | 84,5 | 84,6 | +0,1 |
| Kroatië | Cultuur | 94,0 | 94,1 | +0,1 |
| Kroatië | Groepsdynamiek | 90,0 | 89,9 | -0,1 |
| Kroatië | Praktisch | 86,1 | 86,0 | -0,1 |
| Polen | Avontuur & activiteiten | 83,8 | 83,7 | -0,1 |
| Polen | Kostprijs | 87,2 | 87,3 | +0,1 |
| Polen | Kleine groep | 87,6 | 87,5 | -0,1 |
| Polen | Weer & natuur | 87,7 | 87,8 | +0,1 |
| Polen | Praktisch | 95,3 | 95,2 | -0,1 |
| Oostenrijk | Weer & natuur | 91,5 | 91,6 | +0,1 |
| Tsjechië | Vervoer | 97,1 | 97,0 | -0,1 |
| Tsjechië | Kamp | 90,9 | 91,0 | +0,1 |
| Tsjechië | Cultuur | 91,2 | 91,3 | +0,1 |
| Tsjechië | Groepsdynamiek | 92,0 | 91,9 | -0,1 |
| Tsjechië | Praktisch | 96,2 | 96,3 | +0,1 |
| Zwitserland | Avontuur & activiteiten | 95,2 | 95,3 | +0,1 |
| Zwitserland | Kleine groep | 79,0 | 79,1 | +0,1 |
| Zwitserland | Groepsdynamiek | 85,0 | 85,1 | +0,1 |
| Zwitserland | Praktisch | 96,5 | 96,4 | -0,1 |
| Spanje | Avontuur & activiteiten | 92,7 | 92,8 | +0,1 |
| Spanje | Landschap & wow-factor | 94,9 | 95,0 | +0,1 |
| Spanje | Kostprijs | 77,0 | 77,1 | +0,1 |
| Spanje | Vervoer | 92,1 | 92,0 | -0,1 |
| Spanje | Weer & natuur | 77,5 | 77,6 | +0,1 |
| Griekenland | Vervoer | 84,9 | 85,0 | +0,1 |
| Griekenland | Kamp | 79,6 | 79,5 | -0,1 |
| Griekenland | Weer & natuur | 79,3 | 79,2 | -0,1 |
| Frankrijk | Vervoer | 93,6 | 93,5 | -0,1 |
| Frankrijk | Praktisch | 91,3 | 91,2 | -0,1 |
| Montenegro | Avontuur & activiteiten | 95,5 | 95,6 | +0,1 |
| Montenegro | Cultuur | 91,2 | 91,3 | +0,1 |
| Montenegro | Groepsdynamiek | 93,5 | 93,4 | -0,1 |
| Montenegro | Praktisch | 78,7 | 78,8 | +0,1 |
| Hongarije | Praktisch | 96,0 | 96,1 | +0,1 |
| Italië | Avontuur & activiteiten | 91,9 | 92,0 | +0,1 |
| Italië | Kamp | 86,7 | 86,8 | +0,1 |
| Duitsland | Kleine groep | 82,2 | 82,3 | +0,1 |
| Duitsland | Vervoer | 96,2 | 96,3 | +0,1 |
| Duitsland | Praktisch | 96,0 | 96,1 | +0,1 |
| Albanië | Avontuur & activiteiten | 95,7 | 95,8 | +0,1 |
| Albanië | Cultuur | 94,2 | 94,3 | +0,1 |
| Bosnië en Herzegovina | Vervoer | 75,0 | 74,9 | -0,1 |
| Bosnië en Herzegovina | Kamp | 76,0 | 75,9 | -0,1 |
| Canada | Cultuur | 95,1 | 95,0 | -0,1 |
| Canada | Eindbeleving | 99,0 | 98,9 | -0,1 |
| Roemenië | Avontuur & activiteiten | 89,6 | 89,5 | -0,1 |
| Noord-Macedonië | Landschap & wow-factor | 94,6 | 94,5 | -0,1 |
| Noord-Macedonië | Vervoer | 76,0 | 76,1 | +0,1 |
| Servië | Landschap & wow-factor | 86,7 | 86,8 | +0,1 |
| Servië | Cultuur | 90,4 | 90,5 | +0,1 |
| Servië | Groepsdynamiek | 88,2 | 88,3 | +0,1 |
| Bulgarije | Avontuur & activiteiten | 88,5 | 88,6 | +0,1 |
| Bulgarije | Landschap & wow-factor | 87,9 | 88,0 | +0,1 |
| Bulgarije | Kleine groep | 91,0 | 90,9 | -0,1 |
| Bulgarije | Kamp | 79,0 | 78,9 | -0,1 |
| Turkije | Avontuur & activiteiten | 95,0 | 94,9 | -0,1 |
| Kosovo | Kostprijs | 98,5 | 98,6 | +0,1 |
| Georgië | Landschap & wow-factor | 97,6 | 97,5 | -0,1 |
| Georgië | Groepsdynamiek | 95,0 | 95,1 | +0,1 |
| Georgië | Praktisch | 65,2 | 65,3 | +0,1 |

Ter controle: het ongewogen gemiddelde herberekend uit de ruwe scores wijkt hoogstens 0,050 af van de JSON (afronding). De JSON is dus intern consistent, alleen ongewogen.

## 5. De fout in de vorige film ("Griekenland 87")

In de race van de vorige versie werden de rijen gesorteerd op een **onzichtbare gewogen tussenstand**, terwijl het getal naast elke rij
de **categoriescore** was. Na "+ Avontuur" stond Griekenland zo op plek 9 met 92,8 terwijl Tsjechië erboven 82,3 had. De balken
toonden dus iets anders dan de getallen. In de nieuwe film hoort elk getal bij de balk of rij waar het naast staat.

## 6. Feiten die de film vertelt (alle herberekend)

- Winnaar: **Slovenië** 91,28; nummer 2: Portugal 89,96; verschil 1,32.
- Verschil tussen nummer 1 en nummer 25 (Georgië): 6,77 punten.
- Slovenië wint 0 van de 14 categorieën. Plaats per categorie: Veiligheid & gezondheid 10, Avontuur & activiteiten 8, Kostprijs 15, Kamp 5, Landschap & wow-factor 13, Vervoer 11, Cultuur 25, Weer & natuur 3, Internationale scouting 9, Kleine groep 9, Uniek tegenover andere groepen 9, Groepsdynamiek 4, Praktisch 9, Eindbeleving 13.
- Laagste categorie van Slovenië: Kostprijs 84,4. Dat is de 2e hoogste "bodem" van alle 25 landen (hoogste: Portugal 85,6).
- Laagste categorie ooit: Zwitserland 55,0.
- Zekerheid: 15 landen "hoog", 10 "gemiddeld".

Geen structurele problemen gevonden.
