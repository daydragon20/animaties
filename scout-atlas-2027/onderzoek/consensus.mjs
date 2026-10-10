// Consensus over alle rondes: per land × variabele de waarde die het vaakst voorkomt (anders de mediaan),
// daaruit de eindscore met de basisgewichten; plus per land de rangverdeling over de rondes en de modale winnaar.
// Schrijft ../bron/scout-atlas-2027-data.json (de enige databron van de film en de verkenner) en CONSENSUS.md.
// Gebruik: node consensus.mjs
import { readdirSync, existsSync, writeFileSync } from "node:fs";
import { leesJson, scoor, gewichtenMet, r1, r2, r3 } from "./lib.mjs";

const hier = (p) => new URL(p, import.meta.url).pathname;
const model = leesJson(hier("./model/model.json"));
const rondeDirs = readdirSync(hier("./rondes/")).filter((d) => /^r\d\d$/.test(d)).sort();
const rondes = [];
for (const d of rondeDirs) {
  const map = hier(`./rondes/${d}/`);
  if (!existsSync(map + "feiten.json") || !existsSync(map + "scores.json")) { console.warn(`ronde ${d}: nog niet volledig, overgeslagen`); continue; }
  const feiten = leesJson(map + "feiten.json");
  rondes.push({ id: Number(d.slice(1)), feiten: feiten.landen || feiten, scores: leesJson(map + "scores.json") });
}
if (!rondes.length) { console.error("Geen volledige rondes gevonden."); process.exit(1); }
const N = rondes.length;

// precisie per meter: afronden vóór we "komt het vaakst voor" tellen (datasets geven exact dezelfde waarde terug, schattingen niet)
const precisie = (v) => {
  const s = v.meter.schaal;
  if (s && s.type === "rubriek") return 0;
  const span = s && s.type === "ankers" ? Math.abs(s.punten[s.punten.length - 1][0] - s.punten[0][0]) : s && s.type === "log" ? Math.abs(s.tot - s.van) : 100;
  return span >= 1000 ? 0 : span >= 100 ? 1 : 2;
};
const mediaan = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
function consensusWaarde(waarden, p) {
  const ws = waarden.filter((x) => x != null && Number.isFinite(Number(x))).map(Number);
  if (!ws.length) return { waarde: null, methode: "geen", n: 0, spreiding: null };
  const telling = {};
  for (const w of ws) { const k = w.toFixed(p); telling[k] = (telling[k] || 0) + 1; }
  const [modus, keer] = Object.entries(telling).sort((a, b) => b[1] - a[1] || Number(a[0]) - Number(b[0]))[0];
  const spreiding = r2(Math.max(...ws) - Math.min(...ws));
  if (keer >= 3 && keer / ws.length >= 0.3) return { waarde: Number(modus), methode: `modus (${keer}/${ws.length})`, n: ws.length, spreiding };
  return { waarde: r3(mediaan(ws)), methode: `mediaan (${ws.length})`, n: ws.length, spreiding };
}

// 1. consensusfeiten
const feitenC = {};
const bronTelling = {};
for (const land of model.landen) {
  feitenC[land.naam] = {};
  for (const v of model.variabelen) {
    const cellen = rondes.map((r) => (r.feiten[land.naam] || {})[v.id]).filter(Boolean);
    const c = consensusWaarde(cellen.map((x) => x.waarde), precisie(v));
    // de bron: die van de ronde waarvan de waarde het dichtst bij de consensus ligt (bij gelijke afstand: de eerste)
    let bron = null, best = Infinity, zeker = null, eenheid = null, opm = null;
    for (const cel of cellen) {
      if (cel.waarde == null) continue;
      const d = Math.abs(Number(cel.waarde) - c.waarde);
      if (d < best) { best = d; bron = cel.bron || null; zeker = cel.zekerheid || null; eenheid = cel.eenheid || v.meter.eenheid; opm = cel.opmerking || null; }
    }
    const zekerheden = cellen.map((x) => x.zekerheid).filter(Boolean);
    const zTel = {}; zekerheden.forEach((z) => (zTel[z] = (zTel[z] || 0) + 1));
    const zMod = Object.entries(zTel).sort((a, b) => b[1] - a[1])[0];
    feitenC[land.naam][v.id] = { waarde: c.waarde, eenheid: eenheid || v.meter.eenheid, bron, zekerheid: zMod ? zMod[0] : zeker, methode: c.methode, rondes: cellen.map((x) => (x.waarde == null ? null : Number(x.waarde))), spreiding: c.spreiding, opmerking: opm };
    if (bron && bron.naam) bronTelling[bron.naam] = (bronTelling[bron.naam] || 0) + 1;
  }
}

// 2. eindscores met de basisgewichten
const w = gewichtenMet(model, null);
const ranglijst = scoor(model, feitenC, w);
const by = Object.fromEntries(ranglijst.map((c) => [c.naam, c]));

// 3. rangen en winnaars per ronde
const rangPerRonde = {};
for (const land of model.landen) rangPerRonde[land.naam] = { ranks: [], totals: [] };
const rondeOverzicht = rondes.map((r) => {
  r.scores.ranglijst.forEach((c) => { rangPerRonde[c.naam].ranks.push(c.rank); rangPerRonde[c.naam].totals.push(c.total); });
  return { ronde: r.id, variant: r.scores.variant, winnaar: r.scores.winnaar, top5: r.scores.ranglijst.slice(0, 5).map((c) => c.naam), ontbrekend: r.scores.aantal_ontbrekend };
});
const winTelling = {};
rondeOverzicht.forEach((r) => (winTelling[r.winnaar] = (winTelling[r.winnaar] || 0) + 1));
const modaleWinnaar = Object.entries(winTelling).sort((a, b) => b[1] - a[1])[0];

const countries = ranglijst.map((c) => {
  const rp = rangPerRonde[c.naam];
  const sorted = [...rp.ranks].sort((a, b) => a - b);
  return { ...c, feiten: feitenC[c.naam],
    rondes: { ranks: rp.ranks, totals: rp.totals, wins: winTelling[c.naam] || 0, rankMin: sorted[0] ?? null, rankMax: sorted[sorted.length - 1] ?? null, rankMediaan: sorted.length ? mediaan(sorted) : null, top3: rp.ranks.filter((x) => x <= 3).length, top10: rp.ranks.filter((x) => x <= 10).length } };
});

// 4. zekerheid per variabele (modus over landen)
const variables = model.variabelen.map((v) => {
  const z = {}; let spreidingen = [];
  for (const land of model.landen) { const f = feitenC[land.naam][v.id]; if (f.zekerheid) z[f.zekerheid] = (z[f.zekerheid] || 0) + 1; if (f.spreiding != null) spreidingen.push(f.spreiding); }
  const zMod = Object.entries(z).sort((a, b) => b[1] - a[1])[0];
  return { ...v, zekerheid: zMod ? zMod[0] : v.zekerheid_verwacht, zekerheid_telling: z, spreiding_mediaan: spreidingen.length ? r2(mediaan(spreidingen)) : null };
});

const out = {
  generated: new Date().toISOString().slice(0, 10), version: 3, model_versie: model.versie, scope: model.scope,
  method: `Elke variabele heeft een meter met een vaste schaal naar 0–100. ${N} onafhankelijke onderzoeksrondes (bronnen verzameld door Haiku-agents, scores door Sonnet-agents); per land en variabele telt de waarde die het vaakst voorkomt, anders de mediaan. Eindscore = som van gewicht × score / 100, met de basisgewichten.`,
  aantal_rondes: N,
  tiers: model.tiers, categories: model.categorieen, variables, countries, rondeOverzicht,
  consensus: { winnaar: ranglijst[0].naam, modaleWinnaar: modaleWinnaar ? modaleWinnaar[0] : null, keerGewonnen: modaleWinnaar ? modaleWinnaar[1] : 0, winTelling },
  bronTelling: Object.entries(bronTelling).sort((a, b) => b[1] - a[1]).map(([naam, n]) => ({ naam, n })),
  buiten: model.buiten || [],
};
writeFileSync(hier("../bron/scout-atlas-2027-data.json"), JSON.stringify(out, null, 1));

// 5. verslag
const L = [];
L.push(`# Consensus over ${N} onderzoeksrondes (${out.generated})`, "");
L.push(`Modale winnaar: **${out.consensus.modaleWinnaar}** (${out.consensus.keerGewonnen} van ${N} rondes). Winnaar op de consensusfeiten met de basisgewichten: **${out.consensus.winnaar}**.`, "");
L.push("| Rang | Land | Score | Rangen per ronde | Min–max | Gewonnen |", "|---:|---|---:|---|---|---:|");
for (const c of countries) L.push(`| ${c.rank} | ${c.naam}${c.status !== "ok" ? " ✗" : ""} | ${c.total} | ${c.rondes.ranks.join(" ")} | ${c.rondes.rankMin}–${c.rondes.rankMax} | ${c.rondes.wins} |`);
L.push("", "## Per ronde", "", "| Ronde | Variant | Winnaar | Top 5 | Ontbrekend |", "|---:|---|---|---|---:|");
for (const r of rondeOverzicht) L.push(`| ${r.ronde} | ${r.variant} | ${r.winnaar} | ${r.top5.join(", ")} | ${r.ontbrekend} |`);
L.push("", "## Variabelen: zekerheid en spreiding tussen de rondes", "", "| Variabele | Gewicht | Zekerheid | Mediane spreiding (ruwe eenheid) |", "|---|---:|---|---:|");
for (const v of variables) L.push(`| ${v.naam} | ${v.gewicht} | ${v.zekerheid} (${Object.entries(v.zekerheid_telling).map(([k, n]) => `${k} ${n}`).join(", ")}) | ${v.spreiding_mediaan ?? "—"} |`);
L.push("", "## Meest gebruikte bronnen", "", ...out.bronTelling.slice(0, 40).map((b) => `- ${b.naam}: ${b.n} cellen`));
writeFileSync(hier("./CONSENSUS.md"), L.join("\n") + "\n");
console.log(`${N} rondes · modale winnaar ${out.consensus.modaleWinnaar} (${out.consensus.keerGewonnen}×) · consensuswinnaar ${out.consensus.winnaar}`);
countries.slice(0, 12).forEach((c) => console.log(`${String(c.rank).padStart(2)} ${c.naam.padEnd(22)} ${String(c.total).padStart(5)}  rangen ${c.rondes.ranks.join(" ")}`));
console.log("→ bron/scout-atlas-2027-data.json en onderzoek/CONSENSUS.md geschreven");
