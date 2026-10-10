// Schrijft per ronde de opdrachten voor de agents: één bestand per pakket (Haiku-onderzoeker) en één voor de scorer (Sonnet).
// Gebruik: node opdrachten.mjs <ronde>     → rondes/rNN/opdracht-pXX.md en opdracht-scoren.md
import { writeFileSync, mkdirSync } from "node:fs";
import { leesJson } from "./lib.mjs";
import { maakVariant } from "./variant.mjs";

const ronde = Number(process.argv[2]);
if (!ronde) { console.error("Gebruik: node opdrachten.mjs <ronde>"); process.exit(1); }
const hier = new URL("./", import.meta.url).pathname;
const model = leesJson(hier + "model/model.json");
const rdir = `rondes/r${String(ronde).padStart(2, "0")}/`;
mkdirSync(hier + rdir, { recursive: true });
writeFileSync(hier + rdir + "variant.json", JSON.stringify(maakVariant(model, ronde), null, 1));
const varById = Object.fromEntries(model.variabelen.map((v) => [v.id, v]));
const catById = Object.fromEntries(model.categorieen.map((c) => [c.id, c]));
const landenLijst = model.landen.map((l) => `${l.naam} (${l.iso2})`).join(", ");
const even = ronde % 2 === 0;

const schaalTekst = (s) => {
  if (!s) return "";
  if (s.type === "ankers") return "ankers (ruwe waarde → score): " + s.punten.map((p) => `${p[0]} → ${p[1]}`).join(", ");
  if (s.type === "rubriek") return "rubriek, kies exact één niveau en vul de SCORE van dat niveau in als waarde:\n" + s.niveaus.map((n) => `      - ${n.score}: ${n.criterium}`).join("\n");
  if (s.type === "log") return `logschaal: ${s.van} → 0, ${s.tot} → 100`;
  return JSON.stringify(s);
};
const meterTekst = (v) => {
  const m = v.meter || {};
  const bronnen = (m.bronnen || []).map((b, i) => `      ${i + 1}. ${b.naam}${b.url ? " — " + b.url : ""}${b.jaar ? " (" + b.jaar + ")" : ""}${b.dekking ? " · dekking: " + b.dekking : ""}${b.opmerking ? " · " + b.opmerking : ""}`).join("\n");
  return `### ${v.id} — ${v.naam}
- Vraag van de groep: ${v.vraag || ""}
- Categorie: ${catById[v.categorie] ? catById[v.categorie].naam : v.categorie} (tier ${catById[v.categorie] ? catById[v.categorie].tier : "?"}) · gewicht ${v.gewicht} %
- WAT precies: ${m.wat || ""}
- Eenheid: ${m.eenheid || ""} · richting: ${m.richting || ""} · type: ${m.type || ""}
- Schaal: ${schaalTekst(m.schaal)}
- Bronnen (in volgorde van voorkeur):
${bronnen || "      (geen opgegeven; zoek zelf een dataset)"}
- Als een land ontbreekt in de bron: ${m.ontbrekend || "schat op basis van buurlanden en zet zekerheid op laag"}
- Zoektips: ${(m.zoektips || []).join(" · ")}
`;
};

// referenties: eenmalig grondig verzamelde bronnen per land (model/referenties-kamperen.json) voor variabelen met meter.referenties
const refCache = {};
const laadRef = (p) => { if (!(p in refCache)) { try { refCache[p] = leesJson(hier + p); } catch { refCache[p] = null; } } return refCache[p]; };
const kort = (s, n = 320) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const bronRegel = (b) => `${b.naam || ""}${b.url ? " — " + b.url : ""}${b.jaar ? " (" + b.jaar + ")" : ""}${b.bereikbaar === "nee" ? " [was onbereikbaar]" : ""}${b.wat_staat_er ? ": " + kort(b.wat_staat_er) : ""}`;
function referentieTekst(vars) {
  const metRef = vars.filter((v) => v.meter && v.meter.referenties);
  if (!metRef.length) return "";
  const out = ["## Referenties per land (eenmalig grondig verzameld; jij controleert ze en bepaalt zelf het niveau)"];
  for (const v of metRef) {
    const ref = laadRef(v.meter.referenties);
    out.push(`\n### Referenties voor ${v.id}`);
    if (!ref) { out.push(`(Het referentiebestand ${v.meter.referenties} ontbreekt nog: werk dan volgens de bronnen en zoektips van de meter en zet zekerheid op laag waar je geen officiële bron leest.)`); continue; }
    for (const l of model.landen) {
      const r = ((ref.landen || {})[l.naam] || {})[v.id];
      if (!r) { out.push(`- **${l.naam}**: geen referentie (meest vergelijkbare buurland, zekerheid laag)`); continue; }
      const even2 = even ? "" : "";
      let regel = `- **${l.naam}** · voorstel ${r.voorstel}`;
      if (v.id === "kamp_groepsterrein") {
        regel += ["A", "B", "C", "D"].map((k) => {
          const c = r[k] || {}; const terr = (c.terreinen || []).map((t) => `${t.naam}${t.plaats ? " (" + t.plaats + ")" : ""}${t.url ? " " + t.url : ""}${t.details ? " · " + kort(t.details, 120) : ""}`).join("; ");
          return `\n    - ${k}: ${c.vervuld ? "ja" : "nee"}${c.bewijs ? " · " + kort(c.bewijs, 200) : ""}${c.url ? " · " + c.url : ""}${terr ? " · terreinen: " + terr : ""}`;
        }).join("");
      } else {
        regel += `${r.regeling ? " · " + kort(r.regeling, 240) : ""}${r.regionaal ? " · regionaal: " + kort(r.regionaal, 160) : ""}${r.groepen ? " · groepen: " + kort(r.groepen, 160) : ""}`;
        (r.bronnen || []).forEach((b, i) => (regel += `\n    - bron ${i + 1}: ${bronRegel(b)}`));
      }
      if (r.opmerking) regel += `\n    - opmerking: ${kort(r.opmerking, 200)}`;
      out.push(regel + even2);
    }
  }
  return out.join("\n") + "\n";
}

for (const p of model.pakketten || []) {
  const vars = p.variabelen.map((id) => varById[id]);
  const uit = `${rdir}pakket-${p.id}.json`;
  const md = `# Onderzoeksopdracht · ronde ${ronde} · pakket ${p.id}: ${p.naam}

Je bent een onderzoeksagent voor **Scout Atlas 2027**: een Vlaamse scoutsgroep (verkenners 14–16 jaar, 10–15 leden) kiest het land voor
een tentenkamp van ±10 dagen in juli/augustus 2027. Jij verzamelt in deze ronde, **onafhankelijk van alle andere rondes**, voor ALLE
42 landen de ruwe waarde en de bron van ${vars.length} variabele(n). Je kent de cijfers van andere rondes niet en zoekt ze niet op.

## De landen (gebruik EXACT deze Nederlandse namen als sleutel)
${landenLijst}

## Instructie van dit pakket
${p.instructie || ""}

${even ? "**Deze ronde is een even ronde: begin bij elke variabele met de TWEEDE voorziene bron als die bestaat; val terug op de eerste als de tweede niet werkt of het land niet dekt.**" : "**Deze ronde is een oneven ronde: begin bij elke variabele met de EERSTE voorziene bron; val terug op de tweede als de eerste niet werkt of het land niet dekt.**"}
Gebruik WebFetch om datasets en tabellen te lezen en WebSearch om landen te vinden die in geen tabel staan. Geschatte omvang: ±${p.geschatte_opzoekingen || 60} opzoekingen; werk efficiënt (één tabel dekt vaak 30+ landen in één keer).

## De variabelen en hun meters
${vars.map(meterTekst).join("\n")}
${referentieTekst(vars)}
## Werkwijze
1. Open per variabele de voorkeursbron en lees de tabel; noteer per land de waarde in de gevraagde eenheid (reken om als de bron een andere eenheid gebruikt, en zeg dat in de opmerking).
2. Landen die in de bron ontbreken: zoek een tweede bron; lukt dat niet, pas dan de "als een land ontbreekt"-regel toe en zet \`zekerheid\` op "laag" met een opmerking die zegt hoe je schatte.
3. Rubriek-variabelen: zoek per land de feitelijke situatie (wet, officiële regel, betrouwbare reisinformatie), kies het niveau dat exact bij het criterium past en zet de SCORE van dat niveau als waarde; zet de reden en de bron-URL in de opmerking.
4. Zet \`zekerheid\`: "hoog" = rechtstreeks uit een dataset of officiële pagina; "midden" = afgeleid/omgerekend of uit een secundaire bron; "laag" = geschat.
5. Nooit een waarde verzinnen zonder dat te zeggen: liever \`null\` met een opmerking dan een gok zonder label.

## Uitvoer (verplicht)
Schrijf EXACT dit JSON naar \`${hier}${uit}\`:
\`\`\`json
{
  "ronde": ${ronde},
  "pakket": "${p.id}",
  "datum": "JJJJ-MM-DD",
  "landen": {
    "Portugal": {
      "${vars[0].id}": { "waarde": 87.4, "eenheid": "${(vars[0].meter && vars[0].meter.eenheid) || ""}", "bron": { "naam": "…", "url": "https://…", "jaar": "2025" }, "zekerheid": "hoog", "opmerking": "" }${vars.length > 1 ? `,\n      "${vars[1].id}": { … }` : ""}
    },
    "Spanje": { … }
  },
  "bronnenlijst": [ { "naam": "…", "url": "…", "wat": "…" } ],
  "problemen": [ "…" ]
}
\`\`\`
Alle 42 landen, alle ${vars.length} variabele(n) van dit pakket, \`waarde\` als getal (punt als decimaalteken) of \`null\`.
Controleer daarna met: \`node ${hier}valideer-pakket.mjs ${hier}${uit}\` en herstel fouten tot het script "Pakket in orde" zegt.

## Rapporteer (max 12 regels)
Per variabele: hoeveel landen uit welke bron, hoeveel geschat; welke bronnen niet werkten; wat je zelf twijfelachtig vindt.
`;
  writeFileSync(hier + rdir + `opdracht-${p.id}.md`, md);
}

const scoren = `# Scoringsopdracht · ronde ${ronde}

Je bent de scoringsagent van **Scout Atlas 2027** voor ronde ${ronde}. In \`${hier}${rdir}\` staan de pakketbestanden
\`pakket-pXX.json\` van de onderzoeksagents (Haiku). Jij maakt er de feiten en de scores van deze ronde van. Werkmap: \`${hier}\`.

Context: een Vlaamse scoutsgroep (verkenners 14–16, 10–15 leden) kiest het land voor een tentenkamp in juli/augustus 2027.
Het meetmodel staat in \`model/model.json\` (lees het: tiers, categorieën, variabelen met meter en schaal) en \`model/MODEL.md\`.

## Stappen
1. \`node merge-pakketten.mjs ${ronde}\` → schrijft \`feiten.json\` en meldt ontbrekende cellen en pakketten.
2. Controleer \`feiten.json\` variabele per variabele: eenheid consistent met de meter? verdeling plausibel (geen land met een waarde die
   10× afwijkt door een eenheidsfout)? rubriekwaarden geldige niveaus? Bij twijfel zoek je zelf na (WebSearch/WebFetch) en corrigeer je
   de cel, mét bron en een opmerking "gecorrigeerd door scorer: …". Vul ontbrekende cellen (null) in volgens de "ontbrekend"-regel van
   de meter, met zekerheid "laag" en een opmerking. Een ontbrekend pakket onderzoek je zelf (compact, dezelfde kwaliteitsregels).
3. \`node scoor.mjs ${ronde}\` → \`scores.json\` en de ranglijst op het scherm. Lees de ranglijst kritisch: kloppen de top 10 en de staart met
   wat je over die landen weet? Zoek de oorzaak van elke verrassing in de feiten; vind je een datafout, corrigeer feiten.json en draai opnieuw.
4. Schrijf \`${rdir}verslag.md\`: (a) de top 10 met per land één zin waarom, (b) wat je corrigeerde en waarom, (c) welke variabelen je
   onbetrouwbaar vindt en waarom, (d) het aantal cellen met zekerheid laag.

## Regels
- Verander nooit \`model/model.json\`, de gewichten of \`variant.json\`. Scores worden alleen berekend, nooit met de hand gezet: wil je een
  score veranderen, verander dan het feit (met bron).
- Werk onafhankelijk van andere rondes: kijk niet in andere ronde-mappen.
- Wees eerlijk over onzekerheid; liever zekerheid "laag" dan een mooie zekerheid.
- Lever als resultaat: feiten.json, scores.json en verslag.md in \`${rdir}\`. Rapporteer in max 15 regels: winnaar, top 5, aantal
  correcties, aantal lage zekerheden, grootste twijfel.
`;
writeFileSync(hier + rdir + "opdracht-scoren.md", scoren);
console.log(`ronde ${ronde}: ${(model.pakketten || []).length} pakketopdrachten + scoringsopdracht → ${rdir}`);
