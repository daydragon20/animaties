// Maakt de stem voor de film met Fish Audio (https://fish.audio).
//
//   1. Zet je API-sleutel in bron/.env  →  FISH_API_KEY=jouw_sleutel
//      (optioneel: FISH_VOICE_ID=<id van een stem>, FISH_MODEL=s2.1-pro)
//   2. node stem.mjs            maakt alle zinnen die nog niet bestaan (stem/v01.mp3 …)
//      node stem.mjs --opnieuw  maakt alles opnieuw
//      node stem.mjs v05 v18    maakt enkel deze zinnen (opnieuw)
//      node stem.mjs --toon     toont enkel de ingevulde teksten (geen sleutel nodig)
//   3. node bouw.mjs            bakt de stem in index.html
//
// De sleutel blijft op je eigen computer: .env staat in .gitignore.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const here = (p) => new URL(p, import.meta.url);
const require = createRequire(import.meta.url);
const { berekenModel } = require("./js/00-data.js");

// .env inlezen (KEY=waarde per regel)
if (existsSync(here("./.env"))) {
  for (const line of readFileSync(here("./.env"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const KEY = process.env.FISH_API_KEY || process.env.FISH_AUDIO_API_KEY;
// standaardstem: "Rustige Nederlandse Stem" uit de openbare bibliotheek van Fish Audio.
// Andere ideeën: Vlaamse Vertelstem 1c2edf7e681a46db9ab376a9e538d820 · Polygoonjournaalstem 467f454e4ec14c0b8beb1a5644837549
//                Epic Game Announcer 92e3ee13d7524fee904324e350a532a0 · of je eigen gekloonde stem.
const VOICE = process.env.FISH_VOICE_ID || "add4d395494c4ed0ba2018e77b39ea54";
const MODEL = process.env.FISH_MODEL || "s2.1-pro";

const args = process.argv.slice(2);
const toon = args.includes("--toon"), opnieuw = args.includes("--opnieuw");
const alleen = args.filter((a) => /^v\d+$/.test(a));

// getallen voluit in het Nederlands (voor de stem)
function getal(n) {
  const een = ["nul", "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien"];
  const tien = ["", "", "twintig", "dertig", "veertig", "vijftig", "zestig", "zeventig", "tachtig", "negentig"];
  if (n < 20) return een[n];
  if (n < 100) { const e = n % 10, z = Math.floor(n / 10); return e ? een[e] + (/[ae]$/.test(een[e]) ? "ën" : "en") + tien[z] : tien[z]; }
  if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h > 1 ? een[h] : "") + "honderd" + (r ? getal(r) : ""); }
  const d = Math.floor(n / 1000), r = n % 1000;
  return (d > 1 ? getal(d) : "") + "duizend" + (r ? " " + getal(r) : "");
}
const groot = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const SPREEK = {
  "Veiligheid & gezondheid": "veiligheid", "Avontuur & activiteiten": "avontuur", "Kostprijs": "de kostprijs", "Kamp": "het kamp",
  "Landschap & wow-factor": "het landschap", "Vervoer": "het vervoer", "Cultuur": "cultuur", "Weer & natuur": "het weer",
  "Internationale scouting": "internationale scouting", "Kleine groep": "de kleine groep", "Uniek tegenover andere groepen": "hoe uniek het is",
  "Groepsdynamiek": "de groepsdynamiek", "Praktisch": "het praktische", "Eindbeleving": "de eindbeleving",
};

const DATA = JSON.parse(readFileSync(here("./scout-atlas-2027-data.json"), "utf8"));
const M = berekenModel(DATA);
const W = M.C[0];
const ratio = M.heaviest.weight / M.lightest.weight;
const vul = {
  winnaar: W.name,
  n_landen: groot(getal(M.C.length)),
  n_landen_k: getal(M.C.length),
  n_vragen: getal(M.V.length),
  n_scores: getal(M.nScores),
  verhouding: (ratio - Math.floor(ratio) > 0.05 ? "ruim " : "") + getal(Math.floor(ratio)),
  top1: groot(SPREEK[M.byWeight[0]] || M.byWeight[0].toLowerCase()),
  top2: SPREEK[M.byWeight[1]] || M.byWeight[1].toLowerCase(),
  top3: SPREEK[M.byWeight[2]] || M.byWeight[2].toLowerCase(),
  gewonnen: W.catWins.length === 0 ? "geen enkele categorie" : W.catWins.length === 1 ? "één categorie" : getal(W.catWins.length) + " categorieën",
};
const teksten = JSON.parse(readFileSync(here("./stem/teksten.json"), "utf8"));
const lijnen = teksten.lijnen.map((l) => ({ ...l, ingevuld: l.tekst.replace(/\{(\w+)\}/g, (_, k) => { if (!(k in vul)) throw new Error(`onbekende plaatshouder {${k}} in ${l.id}`); return vul[k]; }) }));

if (toon) {
  for (const l of lijnen) console.log(`${l.id}  @${String(l.t).padEnd(14)} max ${String(l.max).padEnd(4)} s   ${l.ingevuld}`);
  process.exit(0);
}
if (!KEY) {
  console.error("Geen FISH_API_KEY gevonden. Zet hem in bron/.env (FISH_API_KEY=...) of als omgevingsvariabele.");
  process.exit(1);
}
const duur = (f) => { try { return parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString()); } catch (e) { return null; } };
let ok = 0;
for (const l of lijnen) {
  const out = here(`./stem/${l.id}.mp3`);
  if (alleen.length && !alleen.includes(l.id)) continue;
  if (!alleen.length && !opnieuw && existsSync(out)) { console.log(`${l.id}  bestaat al (gebruik --opnieuw)`); continue; }
  const body = {
    text: l.ingevuld, reference_id: VOICE, format: "mp3", mp3_bitrate: 192, normalize: true, latency: "normal",
    temperature: 0.7, top_p: 0.7, prosody: { speed: l.snelheid || 1, volume: 0 },
  };
  for (let poging = 1; poging <= 3; poging++) {
    const r = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", model: MODEL },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      writeFileSync(out, Buffer.from(await r.arrayBuffer()));
      const d = duur(out.pathname);
      console.log(`${l.id}  ✓ ${d ? d.toFixed(2) + " s" : ""}${d && d > l.max ? `  ! langer dan ${l.max} s: zet "snelheid": ${(d / l.max * 1.03).toFixed(2)} in teksten.json en maak opnieuw` : ""}   ${l.ingevuld}`);
      ok++;
      break;
    }
    const msg = await r.text();
    console.error(`${l.id}  ✗ ${r.status} ${msg.slice(0, 200)}`);
    if (r.status === 401 || r.status === 402) process.exit(1);
    await new Promise((res) => setTimeout(res, 2000 * poging));
  }
}
console.log(`\n${ok} zinnen gemaakt. Bouw nu de film opnieuw:  node bouw.mjs`);
