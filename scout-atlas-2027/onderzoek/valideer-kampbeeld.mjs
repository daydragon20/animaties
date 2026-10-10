// Controleert bron/kampbeeld/<iso2>.json en de bijbehorende foto's in bron/foto/.
// Gebruik: node valideer-kampbeeld.mjs <iso2>
import { existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { leesJson } from "./lib.mjs";
const hier = new URL("./", import.meta.url).pathname;
const iso = (process.argv[2] || "").toUpperCase();
if (!iso) { console.error("Gebruik: node valideer-kampbeeld.mjs <iso2>"); process.exit(1); }
const data = leesJson(hier + "../bron/scout-atlas-2027-data.json");
const land = data.countries.find((c) => c.iso2 === iso);
const fouten = [], waarschuwingen = [];
if (!land) { console.error(`Onbekend land ${iso}`); process.exit(1); }
let k;
try { k = leesJson(hier + `../bron/kampbeeld/${iso.toLowerCase()}.json`); } catch (e) { console.error("Ongeldige of ontbrekende JSON:", e.message); process.exit(1); }
if (k.iso2 !== iso) fouten.push(`iso2 is ${k.iso2}, verwacht ${iso}`);
if (k.naam !== land.naam) fouten.push(`naam is "${k.naam}", verwacht "${land.naam}"`);
if (!k.slogan || k.slogan.length > 80) waarschuwingen.push("slogan ontbreekt of is langer dan 80 tekens");
const vIds = new Set(data.variables.map((v) => v.id));
const minAct = land.rank === 1 ? 6 : 4, minFoto = land.rank === 1 ? 5 : 3;
const acts = k.activiteiten || [], fotos = k.fotos || [], plekken = k.kampplaatsen || [];
if (acts.length < minAct) fouten.push(`${acts.length} activiteiten, minstens ${minAct} nodig`);
const perVar = {}, perCat = {};
const catOf = Object.fromEntries(data.variables.map((v) => [v.id, v.categorie]));
acts.forEach((a, i) => {
  const p = `activiteit ${i + 1}`;
  if (!a.titel || a.titel.length > 48) fouten.push(`${p}: titel ontbreekt of is langer dan 48 tekens`);
  if (!vIds.has(a.variabele)) fouten.push(`${p}: variabele "${a.variabele}" bestaat niet`);
  else { perVar[a.variabele] = (perVar[a.variabele] || 0) + 1; perCat[catOf[a.variabele]] = (perCat[catOf[a.variabele]] || 0) + 1; }
  if (!a.plek) waarschuwingen.push(`${p}: geen plek`);
  if (!a.uitleg || a.uitleg.length > 240) fouten.push(`${p}: uitleg ontbreekt of is langer dan 240 tekens`);
  if (!a.bron || !/^https?:\/\//.test(a.bron.url || "")) fouten.push(`${p}: geen bron met URL`);
  if (a.foto != null && (a.foto < 0 || a.foto >= fotos.length)) fouten.push(`${p}: foto-index ${a.foto} bestaat niet`);
  if (land.scores[a.variabele] != null && land.scores[a.variabele] < 40) waarschuwingen.push(`${p}: hangt aan ${a.variabele} met score ${land.scores[a.variabele]} (zwak punt, geen troef)`);
});
Object.entries(perVar).forEach(([v, n]) => { if (n > 1) fouten.push(`variabele ${v} wordt ${n} keer gebruikt`); });
Object.entries(perCat).forEach(([c, n]) => { if (n > 2) waarschuwingen.push(`categorie ${c} wordt ${n} keer gebruikt (hoogstens 2 gevraagd)`); });
if (fotos.length < minFoto) fouten.push(`${fotos.length} foto's, minstens ${minFoto} nodig`);
const LIC = /^(CC0|CC[- ]BY(-SA)?( [0-9.]+)?|Public domain|PD)/i;
fotos.forEach((f, i) => {
  const p = `foto ${i + 1}`;
  if (!f.bestand || !/^[a-z]{2}-\d+\.jpe?g$/.test(f.bestand)) fouten.push(`${p}: bestandsnaam moet <iso2>-N.jpg zijn (${f.bestand})`);
  const fp = hier + "../bron/foto/" + (f.bestand || "");
  if (!f.bestand || !existsSync(fp)) { fouten.push(`${p}: bestand ontbreekt (${f.bestand})`); }
  else {
    const kb = statSync(fp).size / 1024;
    if (kb > 450) fouten.push(`${p}: ${kb.toFixed(0)} KB, hoogstens 350 KB (verklein met convert -quality 75)`);
    else if (kb > 350) waarschuwingen.push(`${p}: ${kb.toFixed(0)} KB, liefst onder 350 KB`);
    try {
      const [w, h] = execFileSync("identify", ["-format", "%w %h", fp]).toString().trim().split(" ").map(Number);
      if (w < 900) fouten.push(`${p}: ${w}×${h} is te klein (minstens 900 px breed)`);
      if (h > w) waarschuwingen.push(`${p}: staande foto (${w}×${h}); liggend past beter in de polaroid`);
    } catch { waarschuwingen.push(`${p}: afmetingen niet te lezen (identify ontbreekt?)`); }
  }
  if (!f.licentie || !LIC.test(f.licentie)) fouten.push(`${p}: licentie "${f.licentie}" is niet toegestaan (CC0, Public domain, CC BY, CC BY-SA)`);
  if (!f.auteur) fouten.push(`${p}: auteur ontbreekt`);
  if (!/^https?:\/\/commons\.wikimedia\.org\//.test(f.bron_url || "")) fouten.push(`${p}: bron_url moet een commons.wikimedia.org-pagina zijn`);
  if (!f.bijschrift) waarschuwingen.push(`${p}: geen bijschrift`);
});
if (plekken.length < 2) fouten.push(`${plekken.length} kampplaatsen, minstens 2 nodig`);
plekken.forEach((p, i) => { if (!p.naam) fouten.push(`kampplaats ${i + 1}: geen naam`); if (!/^https?:\/\//.test(p.url || "")) fouten.push(`kampplaats ${i + 1}: geen URL`); });
fouten.forEach((f) => console.log("FOUT  " + f));
waarschuwingen.forEach((w) => console.log("let op " + w));
console.log(`${land.naam} (nummer ${land.rank}) · ${acts.length} activiteiten · ${fotos.length} foto's · ${plekken.length} kampplaatsen · ${fouten.length} fouten · ${waarschuwingen.length} waarschuwingen`);
if (fouten.length) process.exit(1);
console.log("Kampbeeld in orde.");
