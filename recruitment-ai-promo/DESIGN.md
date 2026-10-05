# RecruitmentAI — promofilm "De lus"

> Ontwerpdocument. Eerst begrijpen, dan onderzoeken, dan ontwerpen, en pas daarna bouwen.
> Alles wat in de film staat, is herleidbaar naar een bron in de `recruitmentai`-repo of naar de
> research hieronder. Geschreven op 2026-10-05.

---

## 1. Wat ik gelezen heb (stap 1)

| Bron | Wat het zegt voor deze film |
|---|---|
| `docs/BIBLE/00_RECRUITMENT_INTELLIGENCE_BIBLE.md` (branch `feat/apollo-firecrawl-dashboard`, **canoniek, wint van alles**) | Het product is geen scraper, chatbot of ATS, maar een **lerend recruitment-intelligentiesysteem** (§63). Het enige echte bezit is **de levende recruitment graph** (§1). **NEVER DELETE KNOWLEDGE** (§2). Een trefwoord is geen bewijs (§10). Onbekend = `UNKNOWN`, niet gokken (§10, §26). Een vertrek wordt een vervangingssignaal (§13). Zelfverbetering via *observe → measure → find failure → hypothesis → experiment → compare → promote/reject* (§60). Mens beslist (§49). Einddoel: *"Waar zit vandaag de beste recruitment-opportunity?"* (§62). |
| `docs/MASTER-BIBLE.md` | "Maximize capability per unit of complexity." Fouten worden kennis. Autonomie is een ladder, geen schakelaar. |
| `docs/BIBLE/27_WAT_NATHAN_HEEFT_MOETEN_CORRIGEREN.md` | **Verzin geen data** (D1). Een getal dat op een feit lijkt maar het niet is, is erger dan geen getal (D2). Wat aanwezig is, is daarom nog niet zichtbaar (A1). Nathan is de laatste controle, niet de eerste. |
| `KOMPAS.md`, `docs/VOORSTEL-PERFECTE-TOOL.md`, `docs/DE-TOOL-UITGELEGD.md` | De eerlijke stand: één bureau, één echt connectieverzoek (25-08), nog geen antwoord, afspraak of plaatsing. → **De film claimt geen resultaten.** |
| `docs/BIBLE/01_PROJECT_VISION.md`, `05_USER_PERSONAS.md` | Done-for-you voor Belgische recruitmentbureaus. Niets vertrekt zonder goedkeuring. Doelgroep: eigenaar of recruiter van een bureau. |
| `docs/BIBLE/19_DESIGN_SYSTEM.md`, `templates/dashboard.html` | Tool 1 = terracotta `#C2410C` (recruitment), Tool 2 = emerald `#047857` (sales). Fraunces, Inter en Spline Sans Mono. Een gestempeld "seal"-label in de topbar. |
| `docs/marketing-strategie-rory.md` | De klant koopt veiligheid en reputatie, geen mechanisme. Recruiters zijn beroepssceptici. Benoem de vijand: de copy-paste-recruiter en de generieke "AI"-tool. |
| `agents/message_writer.py` | Het product verbiedt zelf al "ik zag je profiel" en AI-clichés. Dat gebruik ik in de hook. |
| AgenticOS (`wiki/rocadelo-hr-project.md`, `framework-ai/*`) | Context: Rocadelo HR × Nathan; Framework AI wil "een werkende organisatie" verkopen, geen tool. |

**In één zin:** RecruitmentAI vindt elke ochtend waar de beste recruitment- en saleskans zit, met
bewijs. Het onthoudt alles en verbetert alleen wat aantoonbaar beter werkt. De recruiter beslist.

## 2. Research (stap 2)

**Skills.sh — motion, video, audio.** De meest gebruikte skills zijn `heygen-com/hyperframes`
(motion-graphics, product-launch-video, hyperframes-audio: HTML + GSAP → deterministische MP4)
en `remotion-dev/skills` / `remotion-motion-graphics` (React). Overgenomen vakregels:

- geen lineaire easing; varieer ease én snelheid (de traagste scène is 3× trager dan de snelste);
- entrances met 2–3 eigenschappen tegelijk, gestaggerd; exits sneller dan entrances;
- *holds*: beweging → volledige stilte → volgende beweging (contrast oogt duur, continu bewegen amateuristisch);
- lagen: achtergrond → inhoud → typografie → grade → grain;
- een lijn moet een begin, een eind en een taak hebben, anders schrappen;
- elk visueel element moet uit de bron komen: "als het rekwisiet ongewijzigd in de video van een ander product kan, komt het niet uit de bron";
- **render, frames eruit halen, ernaar kijken, fixen, opnieuw renderen.** Nooit onbekeken opleveren.

HyperFrames heb ik niet zelf geïnstalleerd: jouw repo-conventie is één map met `index.html`, en
dat patroon (gepauzeerde GSAP-tijdlijn + frame-voor-frame capture) bouw ik hier rechtstreeks.

**Het generieke AI-uiterlijk (wat we vermijden).** Bijna-zwart met paarse/cyane gloed, een
gloeiende bol, sparkle-icoon, chatbox in de hero, "copilot"-zin
([Indie Hackers — The AI Purple Problem](https://www.indiehackers.com/post/the-ai-purple-problem-why-every-ai-brand-looks-the-same-6cb0aa2a02),
[Setproduct — Why every AI startup looks the same](https://www.setproduct.com/blog/why-every-ai-startup-looks-the-same)).
De tegentrend "imperfect, handgemaakt" wordt zelf de volgende eenheidsworst
([Ad Pulse](https://adpulse.com/brand-design-trend-in-2026-maximalism-imperfect-human/)).
→ Een stijl kiezen tegen een trend in levert gewoon de volgende trend op. De stijl moet uit het
**product** komen.

**Platform (LinkedIn, waar de doelgroep zit).** ±80% kijkt zonder geluid. De eerste 2–3 seconden
beslissen. 30–90 s scoort het best. Ondertitelblokken van max 2 regels × 42 tekens, 2–4 s in beeld
([Neal Schaffer](https://nealschaffer.com/linkedin-videos/),
[OpusClip](https://www.opus.pro/blog/linkedin-video-caption-subtitle-best-practices)).
→ De tekst draagt het verhaal. Het geluid is een tweede laag, geen voorwaarde.

**Audio.** Sociale platforms normaliseren naar **−14 LUFS**, true peak ≤ **−1,5 dBTP**
([Clicky — LUFS targets](https://clickyapps.com/creator/video/guides/lufs-targets-2025)).
Standaard "tech"-muziek = synth-plucks op 118–120 BPM, en "vasthouden aan de categoriestijl is
de snelste manier om te verdwijnen" ([MarketingProfs — sonic branding](https://www.marketingprofs.com/articles/2024/51060/sonic-branding-creating-brand-identity-with-sound-music)).

**Muziek, SFX, beelden, 3D: bronnen bekeken, bewust niet gebruikt.**
Pixabay Music (commercieel, geen naamsvermelding), Uppbeat (gratis plan beperkt), YouTube Audio
Library (enkel YouTube) ([Foxi](https://www.foximusic.com/blog/royalty-free-music-for-commercial-use-guide/));
CC0-SFX via Kenney en Freesound (licentie per bestand controleren); CC0-3D via Poly Haven, Kenney en
Quaternius ([Poly Haven license](https://polyhaven.com/license)). **Keuze: alles zelf maken.**
- Muziek en SFX worden in code gecomponeerd (`tools/compose_audio.py`). Zo ligt elke klap exact
  op het beeld, heeft niemand anders deze soundtrack en is er geen licentierisico.
- Geen stockfoto's of stock-3D: een 3D-hand of een generiek kantoor zou in elke andere video
  kunnen staan. De 3D in deze film zijn de **gegevens zelf** (een post die in lagen uiteenvalt,
  rondes die zich als vellen opstapelen).
- Geen echte logo's, personen of bedrijfsnamen. "Bedrijf A" en "Persoon Y" komen uit de notatie
  van de bible zelf.

### Referenties van Nathan (toegevoegd tijdens het bouwen)

Gedownload en frame voor frame bekeken (contactsheets per 0,5 s; kleuren gemeten op 4 fps).

| Referentie | Wat het doet | Overgenomen | Bewust niet overgenomen |
|---|---|---|---|
| [Leon Abboud — 15 s showreel](https://x.com/leonabboud/status/2103576084499358051/video/1) | 60 fps, elke ±0,5 s een nieuw idee, oranje kleurvlak, "CLAUDE." in zware grotesk + cursieve serif, voxelgolf, count-up-grafiek, UI-demo met cursor, hoek-HUD's | **60 fps**, hoek-metadata (HUD + systeemklok), tellers die echt tellen, een cursor die echt klikt (Goedkeuren) | Oranje kleurvlak, voxelgolf, glimmende bol |
| [bohdan — 15 s showreel](https://x.com/bohdan_exe/status/2104629527892959709/video/1) | Typografie die doet wat ze zegt (LOUD gloeit, *soft* vervaagt, SHARP helt, HEAVY sleept) | **Werkwoorden die hun betekenis uitvoeren**: GENEREREN maakt kopieën van zichzelf, EXPERIMENTEREN probeert een zware en een lichte versie, METEN wordt opgemeten, LOSLATEN laat zijn letters vallen, ONTLEDEN valt uiteen | Bauhauspatronen, glazen bel, partikel-attractor |
| [imjustnewatai — 3 min film met eigen score](https://x.com/imjustnewatai/status/2106081142143168580/video/1) | Rustig, één kaderend idee (alle uitvindingen als één dag, met een klok in de hoek), een slotzin die het kader omdraait | **Een tijdsapparaat als ruggengraat**: de *systeemklok* (dag 001 · 06:12 → dag 019 → dag 170), afgeleid van de dagelijkse lus (bible §38). Een slotzin die het kader omdraait. | Donker kosmisch decor |

**Meting: de twee showreels zijn convergent.** Beide gebruiken exact hetzelfde tweekleurensysteem:
oranje `#FB4B1E` / `#E44B21` (onderling ΔE 10,4) + kobalt `#2943E1` / `#3749E8` + ±37% bijna-zwart.
Twee verschillende makers, dezelfde soort prompt, dezelfde look. Dat is letterlijk de stelling van
deze film. Onze terracotta ligt op ΔE 11 van dat oranje. **Gevolg:** het idee om de slotzin op een
vol terracotta vlak te zetten is geschrapt (Abandon). Papier blijft de basis en terracotta blijft
een spaarzaam accent.

## 3. De gedachte achter de film

Jouw filosofie: **Observe → Question → Deconstruct → Generate → Experiment → Measure → Abandon →
Discover → Repeat.** Originaliteit komt niet uit een stijl, maar uit het proces.

De ontdekking bij het lezen: **dat is letterlijk de architectuur van RecruitmentAI** (bible §37,
§60). De film hoeft de filosofie dus niet op het product te plakken. Hij laat zien dat het
product zo gebouwd ís.

Eén spanning maakt het scherp. "Abandon" (loslaten) botst schijnbaar met de grootste regel van de
bible, *NEVER DELETE KNOWLEDGE*. De oplossing is de zin waar de film om draait:

> **"Strategieën laten we los. Kennis nooit."**

**Boodschap:** *RecruitmentAI maakt geen mooiere kopie van wat er al is. Het zoekt, test en meet
tot het beter is, en vergeet nooit wat het leerde.*

**Doelgroep:** eigenaar of recruiter van een Belgisch (Vlaams) recruitmentbureau van 2–15 mensen.
Sceptisch tegenover AI-beloftes en zuinig op de eigen naam. Taal: Nederlands.

**Eerlijkheidsregels (uit de bible, §26/§61 en hoofdstuk 27):**
- geen resultaatclaims (geen "3× meer plaatsingen"): die bestaan nog niet;
- elk getal in beeld is een **voorbeeld uit de bible** (§58: 18 juist · 1 gemist · 1 vals positief;
  §62: 94/100, 89/100, 91%) en draagt het label `voorbeeld`;
- geen prijs in de film: de documenten spreken elkaar daarover tegen (no-cure-no-pay vs.
  maandprijs). Dat is een beslissing van de eigenaar, niet van een film.

## 4. Storyboard (stap 3)

16:9 · 1920×1080 · **60 fps** · **64 s** · 120 BPM (1 maat = 2 s; scènegrenzen op maatgrenzen).
Eén doorlopend verhaal: één publieke post die door alle negen stappen gaat.

| # | Tijd | Stap | In beeld | Waarom deze scène bestaat |
|---|---|---|---|---|
| 1 | 0,0–2,6 | Echo · berichten | Een raster identieke recruiterberichten ("Hoi {voornaam}, ik zag je profiel…") verdubbelt van 1 naar 96. **"Elk bericht lijkt op elkaar."** | Hook in de taal van de klant: hun eigen vijand (copy-paste) in de eerste seconde. |
| 2 | 2,6–5,2 | Echo · tools | Harde cut naar donker: een raster identieke AI-tools (paarse gloed, sparkle, chatbox). **"Elke AI-tool ook."** | Jouw stelling: AI-producten lijken op elkaar. |
| 3 | 5,2–8,0 | Echo · origineel | Een chatbox typt *"maak iets origineels"* en krijgt dezelfde gloeiende bol terug. **"Zelfs 'origineel' bestaat al."** Tape-stop. | De punchline uit je brainstorm, letterlijk getoond. |
| 4 | 8,0–12,0 | Belofte | Stilte, papier. **"RecruitmentAI maakt geen mooiere kopie." / "Het zoekt wat beter kan."** De lus (9 streepjes) tekent zich. | De waardeclaim landt in beat 2 (story-spine-regel). |
| 5 | 12–18 | 01 Waarnemen | Signalen in NL/FR/EN (bible §7, §9) stromen voorbij. Eén signaal klikt vast: *"Vandaag mijn laatste werkdag bij Bedrijf A. Na 7 jaar: tijd voor een nieuw hoofdstuk."* | Het systeem kijkt overal: vacatures, vertrekken, groei. |
| 6 | 18–22 | 02 Bevragen | Het trefwoord wordt omcirkeld. **"Een trefwoord is geen bewijs."** Daarna: *bron gelezen · vertrek bevestigd*. | Bible §10: niet geloven, nalezen. |
| 7 | 22–28 | 03 Ontleden | **3D:** de post valt uit elkaar in zwevende lagen (werkgever, functie, anciënniteit, datum). Nieuwe werkgever krijgt de stempel `UNKNOWN`. **"Niet gokken."** | Bible §10/§26. De enige 3D-scène in de lus, want ontleden is ruimtelijk. |
| 8 | 28–32 | 04 Genereren | De lagen worden knopen in de graph. Hypotheses verschijnen met een gestippelde rand: *vervangingsvacature?* (emerald = sales), *3 profielen in je database passen* (terracotta = recruitment). **"Hypotheses. Geen conclusies."** | Bible §1, §12, §17. Gestippeld = hypothese, vol = bevestigd. Die grammatica loopt door de hele film. |
| 9 | 32–36 | 05 Experimenteren | Twee zoekstrategieën, A en B, draaien naast elkaar. **"Twee strategieën. Eén test."** | Bible §35. |
| 10 | 36–40 | 06 Meten | Tellers: A 18 juist · 1 gemist · 1 vals → 95% precisie. B 12 · 6 · 4 → 75%. **"Meten, niet geloven."** | Bible §31/§58. "Self-critique is geen self-trust" (§34). |
| 11 | 40–44 | 07 Loslaten | B krijgt de stempel `AFGEWEZEN` en valt weg. Muziek valt stil. De knoop van de persoon blijft staan: *status: vertrokken · geschiedenis: bewaard*. **"Strategieën laten we los. Kennis nooit."** | De kernzin. Lost de spanning tussen Abandon en §2 op. |
| 12 | 44–52 | 08 Ontdekken | +18 dagen: vacature *Supply Chain Manager* bij Bedrijf A → **vervangingssignaal** (§13). Alles valt samen in de ochtendbriefing (§62): Bedrijf A, het waarom, 94 sales / 89 recruitment / 91% beslisser. Cursor op *Goedkeuren*, *jij beslist.* | De payoff: het antwoord op de vraag die de klant elke ochtend heeft. Mens-in-de-lus (§49) als zichtbare handeling. |
| 13 | 52–56 | 09 Herhalen | De persoon duikt op bij Bedrijf B: een nieuw account én een kandidatenbron (§44). De negen werkwoorden flitsen opnieuw voorbij, sneller. Elke ronde wordt een vel op een groeiende stapel. **"Elke ronde onthoudt meer."** | Het vliegwiel (§45). De stapel = kennis die blijft. |
| 14 | 56–64 | Afsluiter | De camera trekt terug: de stapel rondes. **"Originaliteit is geen stijl." / "Het is een lus."** → wordmark *RecruitmentAI* · *Jij beslist. Het systeem leert.* · *Op uitnodiging.* | Brengt filosofie en product samen in één zin. "Op uitnodiging" klopt (invite-only) en signaleert selectiviteit (Rory, aanbeveling 6). |

## 5. Stijl — gevonden via de lus zelf

Ik koos de stijl niet, maar liet hem uit dezelfde negen stappen komen (bewijs in
`tools/style-lab.html`, meting in `tools/measure_styles.py`):

| Stap | Wat ik deed |
|---|---|
| Observe | Het generieke AI-uiterlijk (paars op zwart) én het warme "Claude-achtige" editorial-palet (crème + terracotta + serif). |
| Question | Is het huidige productpalet onderscheidend? → `#FAF7F2` = exact het warme-editorial-sjabloon. |
| Deconstruct | Wat is écht eigen aan het product? De gestempelde `seal`, de twee toolkleuren, de mono-labels (bron, tijd, zekerheid), `UNKNOWN`, bevestigd/waarschijnlijk. |
| Generate | Drie kandidaten: **A** product-trouw · **B** bewijsdossier · **C** donkere console. |
| Experiment | Twee sleutelframes per kandidaat gerenderd (Ontleden + Ochtendbriefing). |
| Measure | Kleurafstand ΔE tot generieke paletten · WCAG-contrast · leesbaarheid op gsm-breedte (480 px). |
| Abandon | **A**: achtergrond ΔE **0,0** van warm-editorial → te generiek. **C**: ΔE **1,2** van donker-tech → cliché. Uit B: de harde offset-schaduw (= neo-brutalisme-trend). |
| Discover | **B, bijgestuurd:** koeler papier `#E3E4DE` (ΔE 7,2 van crème), inktkader, grid als meetpapier. |
| Repeat | De stijl evolueert ín de film: hij begint in het geleende paars, dat wordt opgemeten en losgelaten. |

Meting (uit `measure_styles.py`):

| Kandidaat | Contrast inkt | Contrast muted | ΔE achtergrond tot warm-editorial | ΔE achtergrond tot donker-tech |
|---|---|---|---|---|
| A product-trouw | 16,4:1 | 4,9:1 | **0,0** | 94,6 |
| B bewijsdossier | 15,0:1 | 6,2:1 | 6,2 → 7,2 met `#E3E4DE` | 88,6 |
| C console | 15,9:1 | 6,4:1 | 93,9 | **1,2** |

**Het systeem**
- **Kleur:** papier `#E3E4DE` · inkt `#14120F` · terracotta `#C2410C` = recruitment-kant ·
  emerald `#047857` = sales-kant · crimson `#9F1239` alleen voor *afgewezen*. Paars `#7C3AED` en
  cyaan bestaan alleen in de echo-scènes. Hooguit één heldenkleur per frame.
- **Grammatica:** volle rand = bevestigd · gestippelde rand = hypothese · stempel = oordeel
  (`UNKNOWN`, `AFGEWEZEN`, `GOEDGEKEURD`) · mono-label = herkomst (bron, tijd, `voorbeeld`).
- **Type:** *Archivo* extra condensed 850, kapitalen, voor de negen werkwoorden (vult 70–90% van
  de breedte; 14 letters "EXPERIMENTEREN" passen). *Archivo* normaal voor zinnen. *Spline Sans
  Mono* (uit het product) voor herkomst en cijfers. *Fraunces* cursief (uit het product) alleen
  voor de menselijke stem: *jij beslist*.
- **Leesbaarheid op gsm:** verhaaltekst ≥ 56 px op 1080p (= 14 px op een 480 px-feed);
  ondersteunende tekst ≥ 30 px. Mono-labels zijn textuur: leesbaar op desktop, sfeer op gsm.

## 6. Beweging

- **Ritme per stap verschilt** (bewust): Waarnemen *drijft* (sine), Bevragen *aarzelt* (stop-start),
  Ontleden *scheidt* (expo, 3D), Genereren *groeit* (back.out, stagger), Experimenteren *duwt*
  (power3, parallel), Meten *tikt* (stappen, counters), Loslaten *valt* (zwaartekracht, dan
  stilte), Ontdekken *klikt vast* (snap, de grootste beweging), Herhalen *versnelt*.
- **Overgangen:** harde cuts voor de echo (ontwaken). Binnen de lus geen crossfades: de post reist
  van stap naar stap mee, als één continu object.
- **HUD:** de lusring met 9 streepjes en `0X / 09` staat de hele lus in beeld. Zo weet de kijker
  altijd waar hij is.
- **3D:** CSS-perspectief op echte DOM-lagen (scherpe tekst). Alleen waar ruimte betekenis heeft:
  ontleden (lagen) en herhalen (stapel rondes).
- **Textuur:** fijn grid (meetpapier) en een lichte vignet. **Geen filmkorrel**: eerst bewegend,
  daarna statisch getest, en uiteindelijk geschrapt omdat ze als ruis wordt gelezen (zie §9).

## 7. Geluid

**Geen voice-over.** 80% kijkt zonder geluid, de tekst draagt het verhaal, en een synthetische
stem is precies de generieke AI-signatuur die de film bekritiseert. (Geparkeerd: Nathan leest de
zinnen zelf in. Dat zou een echte, menselijke stem zijn.)

**Muziek: gecomponeerd uit de lus.** Een motief van **9 noten** (de negen stappen) op marimba in
een maat van 8 achtsten. Elke maat schuift het motief één tel op (*phasing*, zoals Steve Reich):
herhaling die nooit exact hetzelfde is. Dat is de filosofie als muziek. Hout in plaats van
synth-plucks: warm en menselijk, passend bij papier en inkt.

| Deel | Muziek |
|---|---|
| Echo | Bewust de generieke AI-reclamesound: brede pad, sparkle-arpeggio, notificatiepings die zich vermenigvuldigen. Eindigt met een **tape-stop** precies op de cut. |
| Belofte | Stilte → één marimbanoot → het motief begint solo. |
| 01–03 | Motief solo, radarpings · onopgeloste vraag-interval · ticks bij elke laag die loskomt. |
| 04–06 | Tweede stem + plucks · A links en B rechts in stereo · metronoom, kick erbij. |
| 07 Loslaten | Het B-kanaal valt weg, dan **een volle tel stilte**, daarna enkel een lage drone. |
| 08 Ontdekken | Volledig arrangement, de harmonie lost op van mineur naar majeur. Stempelklap op *Goedkeuren*. |
| 09 + slot | Motief op dubbele snelheid, riser, slotakkoord. **Audiologo:** 3 noten + open kwint (onopgelost, de lus loopt door). |

SFX zijn allemaal gesynthetiseerd: papier/stempel, typen, knoop-*pop*, lijn-*zip*, riser, tape-stop.
Mix: −14 LUFS geïntegreerd, true peak ≤ −1,5 dBTP.

## 8. Bestanden

| Bestand | Wat |
|---|---|
| `index.html` | De film: speelt af in de browser (spatie = pauze, ←/→ = 2 s, klik op de balk om te zoeken). |
| `timeline.js` | Eén bron van waarheid voor scènetijden: het beeld én de muziek lezen hem. |
| `assets/` | Ingesloten lettertypes, GSAP 3.15, soundtrack. |
| `tools/compose_audio.py` | Componeert en mixt de soundtrack (`python3 tools/compose_audio.py`; vereist numpy, scipy en pyloudnorm). |
| `tools/render.cjs` | Rendert frame voor frame naar MP4 (`node tools/render.cjs out/recruitment-ai-de-lus.mp4 60`). |
| `tools/frames.cjs`, `tools/sheet.sh` | Losse frames + contactsheet om te inspecteren. |
| `tools/build_fonts.py` | Haalt de lettertypes op en sluit ze in (`assets/fonts.css`). |
| `tools/style-lab.html`, `tools/measure_styles.py` | Het stijl-experiment uit §5. |
| `out/` | Gerenderde MP4 + contactsheet. |

## 9. Wat er misging tijdens het bouwen, en de regel die eruit volgt

| Wat gebeurde | Oorzaak | Regel |
|---|---|---|
| WAARNEMEN en GENEREREN waren onzichtbaar op de contactsheet | Alleen de letters werden zichtbaar gezet, niet hun container | Kijk naar het frame, niet naar de code: elke scène krijgt een contactsheet vóór er verder gebouwd wordt. |
| De 3D-lagen stonden scheef en de "N" van ONTLEDEN viel weg | Tegenrotatie in de verkeerde volgorde (GSAP doet Z vóór X); de clip-mask knipte uitgeschoven letters af | 3D herontworpen als parallelle lagen in diepte; de mask kreeg ruimte (`inset(… -40% …)`). |
| In een klein venster stond de film uit het midden | Een grid centreert een item dat groter is dan zijn container "veilig", dus links | Expliciete `translate + scale` in `fit()`. Getest in een venster van 1280×800. |
| De speler toonde beeld zonder geluid | Chromium speelt AAC (`.m4a`) niet af zonder propriëtaire codecs | Soundtrack als MP3 (speelt overal). Getest: audio 3,76 s ↔ beeld 3,7 s. |
| Het tussenbestand groeide naar ±28 Mbit/s (±230 MB voor de film) | Bewegende filmkorrel is de duurste inhoud voor een encoder, en LinkedIn vermaalt ze toch | Eerst korrel statisch gemaakt (3,5 Mbit/s). |
| Nathan zag in de film "een soort ruis" | De statische korrel (σ ≈ 4,4 grijswaarden op het papier, gemeten) bleef zichtbaar als ruis, in de browser én in de MP4 | **Korrel helemaal verwijderd** (geen `?grain`-schakelaar). Papier = alleen raster en vignet. Regel: een effect dat de kijker als defect leest, is een defect, ook als het bedoeld was. |
| Een testrender gaf een verdacht kleine 300 kb/s | Een extra `-ss 0` bij het samenvoegen gooide de videostroom weg: de meting mat alleen audio | Vals groen (bible 27, A2). De render controleert nu het aantal videoframes in de uitvoer. |

## 10. Geparkeerd (inbox, niet nu)

- Verticale 4:5- of 9:16-versie voor de LinkedIn-feed op gsm.
- Voice-over door Nathan zelf (founder-led, Rory aanbeveling 4).
- Varianten van 15 s (alleen echo + kernzin + logo) voor advertenties.
- De lusring als echt logomerk (vervangt het generieke "R"-blokje).
- Prijs of verdienmodel in beeld, zodra de eigenaar dat heeft vastgelegd.
