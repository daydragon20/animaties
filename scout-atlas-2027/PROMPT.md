# Prompt: Scout Atlas 2027 als motion design

Bijlagen meegeven (of de paden laten lezen):
- `C:\Users\natha\Downloads\preview (1).html` — de huidige scorekaart (alleen als inhoud en sfeerreferentie)
- `C:\Users\natha\Downloads\scout-atlas-2027-data.json` — de data (enige bron voor alle cijfers)

---

## De prompt

Ik wil van deze scorekaart een **motion design** maken: een korte geanimeerde film, geen
PowerPoint, geen dashboard en geen webpagina om doorheen te scrollen. Hij speelt zelf van
begin tot eind en ik moet hem kunnen schermopnemen.

**Waar gaat het over.** Mijn scoutsgroep (verkenners 14–16 jaar, 10 à 15 leden) kiest waar
het buitenlandse kamp van zomer 2027 plaatsvindt. We hebben 25 landen beoordeeld op 188
variabelen, in 14 categorieën, met een gewicht per variabele. De film moet de groep laten
voelen *waarom* het ene land wint. De bijgevoegde HTML toont al alle inhoud; de JSON bevat
de echte cijfers.

**Het verhaal dat ik wil vertellen.**
1. De vraag: waar moet ons beste buitenlandkamp ooit plaatsvinden?
2. Hoe we kiezen: 188 factoren, niet allemaal even zwaar. Veiligheid, avontuur en
   kampbaarheid wegen zwaarder dan bijvoorbeeld esthetiek.
3. De 25 kandidaten die strijden, en hoe de eindrangschikking tot stand komt.
4. De winnaar, Slovenië, en wat hem draagt (en waar hij punten laat liggen, bv. kostprijs).
5. Een eerlijke afsluiter: dit is een V1. Niet elke score is al bron-per-bron gevalideerd,
   en de echte keuze moet nog langs kampplaats, vervoer, budget en actuele reisadviezen.

**Richting (niet dwingend).** Iets met het gevoel van een atlas of een expeditie: kaart,
kompas, route, avontuur. De huidige kleuren (donker met mintgroen en zachtgeel) mogen
vertrekpunt zijn, maar als jij iets sterkers ziet, doe dat. Het moet voelen als iets dat
een scoutsgroep kippenvel geeft, niet als een zakelijk rapport.

**Wat vaststaat.**
- Elk getal en elke landnaam komt uit de JSON. Niets afronden op eigen houtje en niets
  verzinnen of schatten.
- Tekst in het Nederlands, kort en leesbaar op een groot scherm.
- 16:9, ongeveer 60 tot 90 seconden, geen stockmateriaal, geen geluid nodig.
- Één bestand dat ik gewoon in de browser kan openen, met afspelen/pauzeren.

**Klaar is het als** je hem zelf hebt geopend en van begin tot eind hebt afgespeeld, en
de getallen in beeld hebt vergeleken met de JSON. Zeg erbij wat je nog niet goed vindt.

Je beslist zelf hoe je het bouwt.

---

## Waarom zo (uit het onderzoek, 04-10-2026)

Gevonden bij mensen die Fable 5.1 voor motion design en UI gebruiken:

- **Definieer wat "klaar" betekent, niet elke stap.** Anthropic en de handleidingen zeggen
  hetzelfde: beschrijf uitkomst, doel, controle en beperkingen; laat de rest aan het model.
  ([Four ways you should be prompting Fable 5.1](https://alexmcfarland.substack.com/p/four-ways-you-should-be-prompting))
- **Het motion-voorbeeld van Agentic Amit** legt vast: formaat (1920×1080), één tijdlijn,
  geen stockbeeld, het verhaal als blokken, een controle aan het eind. Het laat open: stijl,
  kleur, lettertype, timing, camerabewegingen.
  ([Motion Graphic Design with Fable 5.1](https://www.maraj.ai/resources/motion-graphic-design-with-fable-5-1))
- **Data-story prompts werken met:** duur en beeldverhouding, één kernverhaal in plaats van
  een lijst functies, exacte tekst en getallen, het gevoel dat het moet geven, en ruimte
  voor eigen interpretatie. Vermijd: afvinklijsten, vage lengte, geschatte data,
  voorgeschreven visuele aanpak.
  ([5 Claude Motion Graphics Prompts](https://www.iart.ai/blog/claude-motion-graphics))
- **Veel "motion"-prompts zijn één zin** ("maak een dynamische 15-seconden showreel, ga er
  volledig voor"). Je hoeft dus geen essay te schrijven.
- **Generieke uitkomst vermijden:** vraag om iets onderscheidends en geef een
  stemming/richting mee, anders krijg je het standaard "AI-uiterlijk".
  ([Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices))
- **Tip:** zet de sessie op een hogere inspanning (High of XHigh) en zeg erbij hoe je het
  resultaat controleert (staat al in "Klaar is het als").

## Gegevens die ik uit je bestanden heb gehaald

- 25 landen, 188 variabelen, 14 categorieën (Avontuur & activiteiten telt 25, Kamp 18,
  Kostprijs 15, Veiligheid 15, ...).
- Top 5: Slovenië 91,3 · Portugal 90,0 · Slowakije 89,6 · Kroatië 89,4 · Oostenrijk 89,1.
  Laatste: Georgië 84,5.
- Slovenië: sterkst in Avontuur (94,6) en Landschap (93,2), zwakst in Kostprijs (84,4).
- De JSON bevat geen bronnen; die staan alleen in de HTML. Wil je ze in de film, geef dan
  mee dat hij ze uit de HTML moet halen.
