// Bouwt ../index.html: één zelfstandig bestand met data, kaart, lettertypes, three.js en (optioneel) de stem ingebakken.
// Gebruik: node bouw.mjs   (vanuit deze map)
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const here = (p) => new URL(p, import.meta.url);
const read = (p, enc = "utf8") => readFileSync(here(p), enc);

const data = JSON.parse(read("./scout-atlas-2027-data.json"));
const kaart = JSON.parse(read("./kaart.json"));

const font = (file, family, style, weight) =>
  `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:block;` +
  `src:url(data:font/woff2;base64,${readFileSync(here("./fonts/" + file)).toString("base64")}) format('woff2');}`;
const fonts = [
  font("bigshoulders.woff2", "Big Shoulders Display", "normal", "100 900"),
  font("fraunces-roman.woff2", "Fraunces", "normal", "300 600"),
  font("fraunces-italic.woff2", "Fraunces", "italic", "100 900"),
  font("plexmono-400.woff2", "IBM Plex Mono", "normal", "400"),
  font("plexmono-500.woff2", "IBM Plex Mono", "normal", "500"),
  font("plexmono-600.woff2", "IBM Plex Mono", "normal", "600"),
].join("\n");

// stem: bron/stem/teksten.json + bron/stem/<id>.mp3 (gemaakt met stem.mjs)
let stem = null;
const teksten = JSON.parse(read("./stem/teksten.json"));
const lijnen = [];
for (const l of teksten.lijnen) {
  const f = new URL(`./stem/${l.id}.mp3`, import.meta.url);
  if (!existsSync(f)) continue;
  const buf = readFileSync(f);
  let duur = null;
  try { duur = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f.pathname]).toString()); } catch (e) { /* ffprobe niet aanwezig */ }
  if (duur && duur > l.max) console.warn(`  ! ${l.id} duurt ${duur.toFixed(2)} s, de film geeft ${l.max} s. Kort de zin in of zet "snelheid" hoger in teksten.json.`);
  lijnen.push({ id: l.id, t: l.t, mp3: buf.toString("base64") });
}
if (lijnen.length) stem = { lijnen };
console.log(`stem: ${lijnen.length} van ${teksten.lijnen.length} zinnen ingebakken`);

const js = readdirSync(here("./js/")).filter((f) => f.endsWith(".js")).sort()
  .map((f) => `/* ── ${f} ── */\n` + read("./js/" + f).replace(/^if \(typeof module.*$/m, "")).join("\n");

let html = read("./film.html");
const swap = (marker, value) => {
  if (!html.includes(marker)) throw new Error("Marker ontbreekt: " + marker);
  html = html.replace(marker, () => value);
};
swap("/*__FONTS__*/", fonts);
swap("/*__VERKENNER_CSS__*/", read("./verkenner.css"));
swap("<!--__VERKENNER_HTML__-->", read("./verkenner.html"));
swap("/*__DATA__*/null", JSON.stringify(data));
swap("/*__MAP__*/null", JSON.stringify(kaart));
swap("/*__STEM__*/null", JSON.stringify(stem));
swap("/*__JS__*/", js);
swap("<!--__THREE__-->", "<script>" + read("./vendor/three.min.js") + "</script>");

writeFileSync(here("../index.html"), html);
console.log("index.html geschreven:", (html.length / 1024).toFixed(0), "KB");
