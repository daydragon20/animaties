// Schrijft per land uit de top 3 (uit de consensusdata) een onderzoeksopdracht voor het kampbeeld:
// concrete activiteiten per sterke variabele, kampplaatsen met URL, foto's van Wikimedia Commons met vrije licentie.
// Gebruik: node kampbeeld-opdrachten.mjs   → kampbeeld/opdracht-<iso2>.md (3 bestanden) + kampbeeld/README.md
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { leesJson } from "./lib.mjs";

const hier = new URL("./", import.meta.url).pathname;
const data = leesJson(hier + "../bron/scout-atlas-2027-data.json");
const model = leesJson(hier + "model/model.json");
const ref = existsSync(hier + "model/referenties-kamperen.json") ? leesJson(hier + "model/referenties-kamperen.json") : null;
mkdirSync(hier + "kampbeeld/", { recursive: true });
const V = data.variables, vById = Object.fromEntries(V.map((v) => [v.id, v]));
const catName = Object.fromEntries(data.categories.map((c) => [c.id, c.naam]));
const top = data.countries.filter((c) => c.status === "ok").sort((a, b) => a.rank - b.rank).slice(0, 3);
const n = top.length;
const fmt = (x) => (x == null ? "—" : Number(x).toLocaleString("nl-BE", { maximumFractionDigits: Math.abs(x) < 10 ? 2 : 1 }));
const rubriekTekst = (v, waarde) => { const s = v.meter && v.meter.schaal; if (!s || s.type !== "rubriek") return ""; const lv = (s.niveaus || []).find((x) => Number(x.score) === Number(waarde)); return lv ? ` · niveau: ${lv.criterium}` : ""; };

for (const c of top) {
  const sterk = V.map((v) => ({ v, s: c.scores[v.id], f: c.feiten[v.id] })).filter((x) => x.s != null).sort((a, b) => b.s * b.v.gewicht - a.s * a.v.gewicht);
  const zwak = [...sterk].sort((a, b) => a.s - b.s).slice(0, 4);
  const regel = (x) => `- **${x.v.id}** (${x.v.naam}, ${catName[x.v.categorie]}, gewicht ${x.v.gewicht} %): score ${fmt(x.s)} op 100 · gemeten: ${x.f && x.f.waarde != null ? fmt(x.f.waarde) + " " + (x.f.eenheid || x.v.meter.eenheid || "") : "geen waarde"}${rubriekTekst(x.v, x.f && x.f.waarde)}${x.f && x.f.bron ? ` · bron: ${x.f.bron.naam || ""} ${x.f.bron.url || ""}` : ""}${x.f && x.f.opmerking ? ` · opmerking onderzoek: ${String(x.f.opmerking).slice(0, 240)}` : ""}`;
  const r = ref && ref.landen ? ref.landen[c.naam] : null;
  const refTekst = r ? ["## Wat het referentieonderzoek over kamperen al vond (controleer het, gebruik het)",
    r.kamp_wild ? `- Wildkamperen (voorstel ${r.kamp_wild.voorstel}): ${r.kamp_wild.regeling || ""}${(r.kamp_wild.bronnen || []).map((b) => ` · ${b.naam || ""} ${b.url || ""}`).join("")}` : "",
    r.kamp_vuur ? `- Kampvuur (voorstel ${r.kamp_vuur.voorstel}): ${r.kamp_vuur.regeling || ""}${(r.kamp_vuur.bronnen || []).map((b) => ` · ${b.naam || ""} ${b.url || ""}`).join("")}` : "",
    r.kamp_groepsterrein ? `- Kampterreinen (voorstel ${r.kamp_groepsterrein.voorstel}):` + ["A", "B", "C", "D"].map((k) => { const q = r.kamp_groepsterrein[k] || {}; return `\n  - ${k}: ${q.vervuld ? "ja" : "nee"} ${q.bewijs || ""} ${q.url || ""}${(q.terreinen || []).map((t) => `\n    - ${t.naam} (${t.plaats || ""}) ${t.url || ""} · ${t.details || ""}`).join("")}`; }).join("") : "",
  ].filter(Boolean).join("\n") : "## Referentieonderzoek kamperen\n(nog niet beschikbaar)";
  const minAct = c.rank === 1 ? 6 : 4, minFoto = c.rank === 1 ? 5 : 3;
  const iso = c.iso2.toLowerCase();
  const md = `# Kampbeeld · ${c.naam} (nummer ${c.rank} van ${data.countries.filter((x) => x.status === "ok").length})

Je maakt voor **Scout Atlas 2027** het kampbeeld van ${c.naam}: hoe ziet een tentenkamp van ±10 dagen in juli/augustus 2027 er daar
concreet uit voor een Vlaamse scoutsgroep (verkenners 14–16 jaar, 10–15 leden, 5 à 6 tenten, beperkt budget)? De film toont voor
dit land ${c.rank === 1 ? "vijf activiteiten met foto, de slaapplaats, en daarna" : "één activiteit met foto, naast de winnaar"}; de verkenner toont alles wat jij verzamelt.
**Regel nummer één: elke activiteit hangt aan één variabele uit het model en aan een concrete, controleerbare plek.** Geen reisfolder-taal.

Werkmap: \`/home/user/animaties/scout-atlas-2027/\`. Context: \`onderzoek/model/MODEL.md\` (het model), \`bron/scout-atlas-2027-data.json\` (de data).
Eindscore van ${c.naam}: ${fmt(c.total)} op 100 (${c.rondes && c.rondes.wins != null ? `${c.rondes.wins} van ${data.aantal_rondes} rondes gewonnen` : ""}).
Categoriescores: ${data.categories.map((k) => `${k.naam} ${fmt(c.categories[k.id])}`).join(" · ")}.

## De sterkste variabelen (score × gewicht), hier moeten de activiteiten uit komen
${sterk.slice(0, 14).map(regel).join("\n")}

## De zwakste (niet verzwijgen in de uitleg als het relevant is, bv. weer of kosten)
${zwak.map(regel).join("\n")}

${refTekst}

## Wat je oplevert
1. \`bron/kampbeeld/${iso}.json\`:
\`\`\`json
{
 "iso2": "${c.iso2}", "naam": "${c.naam}", "datum": "JJJJ-MM-DD",
 "slogan": "één zin van hoogstens 70 tekens die het kamp daar samenvat, concreet (plaatsnamen mogen)",
 "activiteiten": [
  { "titel": "Kajakken op de Nærøyfjord", "plek": "Gudvangen, Vestland", "variabele": "av_kust",
    "uitleg": "max 220 tekens: wat doe je, waarom kan dat juist hier, wat kost het of wat is gratis; concreet en controleerbaar",
    "bron": { "naam": "Visit Norway, Nærøyfjord", "url": "https://..." }, "foto": 0 }
 ],
 "kampplaatsen": [ { "naam": "...", "plaats": "...", "url": "https://...", "details": "voor jeugdgroepen met tenten · capaciteit of prijs als je die ziet · afstand tot station" } ],
 "fotos": [ { "bestand": "${iso}-1.jpg", "bijschrift": "wat je ziet, met plaatsnaam", "auteur": "naam of gebruikersnaam op Commons", "licentie": "CC BY-SA 4.0", "bron_url": "https://commons.wikimedia.org/wiki/File:..." } ],
 "bronnen": [ { "naam": "...", "url": "..." } ],
 "problemen": [ "..." ]
}
\`\`\`
2. De foto's in \`bron/foto/${iso}-1.jpg\` … (JPEG, langste zijde 1600 px, hoogstens 350 KB per foto).

## Eisen
- **Activiteiten: minstens ${minAct}**, elk met een bestaande \`variabele\`-id uit de lijst hierboven (verschillende variabelen, hoogstens 2 per categorie),
  een concrete plek (nationaal park, fjord, meer, rivier, grot, kampterrein, stad) en een bron die je zelf geopend hebt (WebFetch of curl).
  Zet de activiteiten in volgorde van kracht: de eerste vijf komen in de film. Minstens één gaat over kamperen zelf (vrij kamperen, een
  kampterrein, kampvuur) en minstens één over de kostprijs als dat een sterke kant is. Wees eerlijk: zeg in de uitleg als iets alleen in
  augustus kan, een vergunning vraagt of geld kost.
- **Kampplaatsen: minstens 2** die aan jeugd- of scoutsgroepen met tenten verhuren, met werkende URL (zelf geopend). Gebruik de
  referentielijst hierboven als vertrekpunt. Noteer afstand tot een station of bushalte als je die vindt.
- **Foto's: minstens ${minFoto}**, alleen van Wikimedia Commons, alleen met licentie CC0, Public domain, CC BY of CC BY-SA (elke versie).
  Werkwijze: zoek via de Commons-API, bv. \`curl -sS -A "ScoutAtlas/1.0 (nathan@charut.be)" "https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=20&format=json&srsearch=Naeroyfjord+kayak"\`,
  haal dan de licentie en de URL op met \`action=query&titles=File:...&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&format=json\`
  (velden LicenseShortName, Artist, ImageDescription; neem de \`thumburl\`), download de thumb met curl en verklein:
  \`convert in.jpg -auto-orient -resize 1600x1600\\> -strip -interlace Plane -quality 80 /home/user/animaties/scout-atlas-2027/bron/foto/${iso}-N.jpg\`.
  Kies liggende foto's (breder dan hoog) van landschap of activiteit, scherp en zonder tekst of logo; geen close-ups van herkenbare kinderen.
  Elke foto hoort bij één activiteit (\`foto\`-index) of bij de kampplaats. Vul auteur en licentie exact in zoals Commons ze geeft (Artist mag
  ontdaan worden van HTML). Lukt een download niet, neem een andere foto; verzin nooit een licentie.
- **Bronnen**: officiële toerismesites, nationale parken, scoutsorganisaties, Wikipedia/Wikivoyage. Reisblogs alleen als wegwijzer.
- **Zoekbudget**: WebSearch is schaars (gedeeld): hoogstens 15 keer voor dit land, alleen als je met WebFetch en de Commons-API niet verder komt.
- Schrijf niets anders dan het JSON-bestand en de foto's. Controleer op het einde: \`cd /home/user/animaties/scout-atlas-2027/onderzoek && node valideer-kampbeeld.mjs ${c.iso2}\`
  moet "Kampbeeld in orde" zeggen; herstel fouten tot het zover is.

Rapporteer in hoogstens 12 regels: de activiteiten (titel + variabele), het aantal foto's en kampplaatsen, en wat je niet kon bevestigen.
`;
  writeFileSync(hier + `kampbeeld/opdracht-${c.iso2}.md`, md);
}
writeFileSync(hier + "kampbeeld/README.md", `# Kampbeeld\n\nOpdrachten voor de top ${n} uit de consensusdata (${data.generated}): ${top.map((c) => `${c.rank}. ${c.naam} (${c.iso2})`).join(", ")}.\n` +
  `Per land draait één Sonnet-agent \`opdracht-<iso2>.md\`; het resultaat is \`../bron/kampbeeld/<iso2>.json\` plus foto's in \`../bron/foto/\`.\n` +
  `Controle: \`node valideer-kampbeeld.mjs <iso2>\`. Het bouwscript \`bron/bouw.mjs\` bakt de JSON en de foto's in de film en de verkenner.\n`);
console.log(`kampbeeld: ${top.map((c) => `${c.rank}. ${c.naam}`).join(", ")} → onderzoek/kampbeeld/opdracht-*.md`);
