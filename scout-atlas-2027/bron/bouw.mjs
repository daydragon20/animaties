// Bouwt ../index.html: één zelfstandig bestand met data, kaart, lettertypes en three.js ingebakken.
// Gebruik: node bouw.mjs   (vanuit deze map)
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

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

// alle modules in js/ (op volgorde van de bestandsnaam) in één script
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
swap("/*__JS__*/", js);
swap("<!--__THREE__-->", "<script>" + read("./vendor/three.min.js") + "</script>");

writeFileSync(here("../index.html"), html);
console.log("index.html geschreven:", (html.length / 1024).toFixed(0), "KB");
