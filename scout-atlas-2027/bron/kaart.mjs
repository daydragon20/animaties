// Bouwt de Europa-kaart (SVG-paden in 1920x1080-coördinaten) uit Natural Earth 1:50m.
// Vereist: npm i d3-geo topojson-client world-atlas@2 (in een werkmap), daarna: node kaart.mjs
import { geoConicConformal, geoEquirectangular, geoPath, geoGraticule10, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import { readFileSync, writeFileSync } from "node:fs";

const topo = JSON.parse(readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
const fc = feature(topo, topo.objects.countries);

// Kandidaten: Nederlandse naam (zoals in de JSON) -> Natural Earth-naam + labelpunt (lon, lat)
const CAND = {
  "Portugal": ["Portugal", -8.1, 39.7],
  "Spanje": ["Spain", -3.6, 40.0],
  "Andorra": ["Andorra", 1.55, 42.55],
  "Frankrijk": ["France", 2.4, 46.7],
  "Verenigd Koninkrijk": ["United Kingdom", -1.8, 52.8],
  "Ierland": ["Ireland", -8.0, 53.3],
  "IJsland": ["Iceland", -18.5, 65.0],
  "Nederland": ["Netherlands", 5.6, 52.3],
  "Luxemburg": ["Luxembourg", 6.1, 49.8],
  "Duitsland": ["Germany", 10.3, 51.1],
  "Denemarken": ["Denmark", 9.3, 56.1],
  "Noorwegen": ["Norway", 8.5, 61.2],
  "Zweden": ["Sweden", 15.0, 61.5],
  "Finland": ["Finland", 26.0, 63.5],
  "Estland": ["Estonia", 25.5, 58.7],
  "Letland": ["Latvia", 25.0, 56.9],
  "Litouwen": ["Lithuania", 23.9, 55.3],
  "Zwitserland": ["Switzerland", 8.2, 46.8],
  "Liechtenstein": ["Liechtenstein", 9.55, 47.15],
  "Oostenrijk": ["Austria", 14.2, 47.55],
  "Tsjechië": ["Czechia", 15.4, 49.8],
  "Slowakije": ["Slovakia", 19.5, 48.7],
  "Italië": ["Italy", 12.6, 42.9],
  "San Marino": ["San Marino", 12.45, 43.95],
  "Malta": ["Malta", 14.4, 35.9],
  "Kroatië": ["Croatia", 16.0, 45.5],
  "Bosnië en Herzegovina": ["Bosnia and Herz.", 17.8, 44.2],
  "Montenegro": ["Montenegro", 19.25, 42.8],
  "Servië": ["Serbia", 20.8, 44.1],
  "Kosovo": ["Kosovo", 20.85, 42.6],
  "Noord-Macedonië": ["Macedonia", 21.7, 41.6],
  "Griekenland": ["Greece", 21.9, 39.4],
  "Bulgarije": ["Bulgaria", 25.2, 42.7],
  "Cyprus": ["Cyprus", 33.2, 35.05],
  "Turkije": ["Turkey", 34.0, 39.1],
  "Moldavië": ["Moldova", 28.5, 47.2],
  "Oekraïne": ["Ukraine", 31.5, 49.0],
  "Belarus": ["Belarus", 28.0, 53.6],
  "Rusland": ["Russia", 40.0, 56.0],
  "Georgië": ["Georgia", 43.6, 42.15],
  "Armenië": ["Armenia", 44.8, 40.3],
  "Azerbeidzjan": ["Azerbaijan", 47.8, 40.4],
};

const W = 1920, H = 1080;
const proj = geoConicConformal().parallels([40, 62]).rotate([-14, 0]).center([0, 52]);
const bbox = { type: "MultiPoint", coordinates: [[-24.5, 63.3], [-22, 66.6], [-10, 36.0], [-10.5, 52], [50.5, 40], [34.5, 34.4], [31, 70.3], [12, 36]] };
proj.fitExtent([[80, 70], [W - 80, H - 60]], bbox);
proj.clipExtent([[-60, -60], [W + 60, H + 60]]);

const path = geoPath(proj);
const r1 = (s) => s.replace(/(\d+\.\d)\d+/g, "$1");

// Alleen landen die (deels) in beeld liggen; bounding test op geprojecteerde bounds
const countries = [];
for (const f of fc.features) {
  const n = f.properties.name;
  if (n === "Canada" || n === "Greenland" || n === "Antarctica" || n === "United States of America") continue;
  // Eilanden ver in de Atlantische Oceaan (Azoren, Madeira, Canarische Eilanden) horen niet op dit diorama
  // ... en Arctische eilanden (Spitsbergen, Jan Mayen, Nova Zembla) evenmin: ze zouden als losse staven boven de kaart uitsteken
  if (f.geometry.type === "MultiPolygon")
    f.geometry.coordinates = f.geometry.coordinates.filter((poly) => {
      const [lon, lat] = geoCentroid({ type: "Polygon", coordinates: poly });
      if (lat > 72 || (lat > 70 && lon < 0)) return false; // incl. Jan Mayen
      if ((n === "Spain" || n === "Portugal") && lon < -11.5) return false;
      return true;
    });
  const b = path.bounds(f);
  if (!isFinite(b[0][0])) continue;
  if (b[1][0] < -100 || b[0][0] > W + 100 || b[1][1] < -100 || b[0][1] > H + 100) continue;
  const d = r1(path(f) || "");
  if (!d) continue;
  const cand = Object.entries(CAND).find(([, v]) => v[0] === n);
  countries.push({ n, nl: cand ? cand[0] : null, home: n === "Belgium", d });
}

const pts = {};
for (const [nl, [, lon, lat]] of Object.entries(CAND)) {
  const [x, y] = proj([lon, lat]);
  pts[nl] = [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}
const [bx, by] = proj([4.47, 50.65]);
pts["België"] = [Math.round(bx * 10) / 10, Math.round(by * 10) / 10];

// Wereldbol: equirectangulaire paden (2048 x 1024) uit 1:110m, voor de bol-textuur
const topo110 = JSON.parse(readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"));
const fc110 = feature(topo110, topo110.objects.countries);
const eq = geoEquirectangular().scale(2048 / (2 * Math.PI)).translate([1024, 512]).precision(0.2);
const eqPath = geoPath(eq);
const r0 = (s) => s.replace(/(\d+)\.\d+/g, "$1");
const globe = fc110.features.map((f) => {
  const n = f.properties.name;
  const cand = Object.entries(CAND).find(([, v]) => v[0] === n);
  return { nl: cand ? cand[0] : null, home: n === "Belgium", d: r0(eqPath(f) || "") };
}).filter((g) => g.d);
const grat = r0(eqPath(geoGraticule10()));
const missing = Object.values(CAND).map((v) => v[0]).filter((n) => !countries.some((c) => c.n === n));
if (missing.length) throw new Error("Niet gevonden in Natural Earth: " + missing.join(", "));
writeFileSync("kaart.json", JSON.stringify({ countries, pts, globe, grat }));
console.log("globe", globe.length, "bytes", JSON.stringify(globe).length);
console.log(countries.length, "landen;", JSON.stringify(pts));
console.log("bytes", JSON.stringify(countries).length);

// Voorbeeld-SVG om de compositie te bekijken
const svg = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe7d4"/>`];
for (const c of countries) svg.push(`<path d="${c.d}" fill="${c.home ? "#e3bd52" : c.nl ? "#9edcc1" : "#f3ead4"}" stroke="#10262c" stroke-width="0.8"/>`);
for (const [nl, [x, y]] of Object.entries(pts)) svg.push(`<circle cx="${x}" cy="${y}" r="4" fill="#d24a2a"/><text x="${x + 6}" y="${y - 4}" font-size="13" font-family="sans-serif" fill="#10262c">${nl}</text>`);
svg.push(`<rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="#10262c" stroke-dasharray="4 4"/></svg>`);
writeFileSync("preview.svg", svg.join(""));
