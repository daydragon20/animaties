/* ═════════════ 8 · HET KAMP DAAR (140–178 s): de kamptafel met polaroids van de winnaar ═════════════
   Elke activiteit hangt aan één variabele uit de data: de ruwe waarde en de score staan erbij. De foto's en de concrete
   plekken komen uit bron/kampbeeld/<iso2>.json (eenmalig onderzocht, met vrije licenties); ontbreken ze, dan toont de film
   de activiteit die bij de sterkste variabelen hoort, met een getekende kaart in plaats van een foto. */
const KB = (() => {
  const KBC = CUE.kb;
  const KAMPD = (typeof KAMP !== "undefined" && KAMP && KAMP.landen) || {};
  const kampVan = (c) => KAMPD[c.iso2] || KAMPD[c.name] || null;
  // generieke activiteit per variabele (terugval als het kampbeeld niets zegt)
  const GEN = {
    kost_reis: "Goedkoop heen en terug", kost_voeding: "Boodschappen kosten er weinig", kost_kampplaats: "Een kampplaats kost bijna niets",
    kost_activiteiten: "Uitstappen zijn betaalbaar", kost_vervoer: "Bus en trein ter plaatse zijn goedkoop",
    av_bergen: "Een echte bergtocht", av_kust: "Een dag aan zee", av_meren: "Kajakken en zwemmen op de meren", av_rivieren: "Kanoën op de rivieren",
    av_grotten: "Grotten verkennen", av_ruimte: "Ruimte: bijna niemand om je heen",
    kamp_wild: "Vrij kamperen in de natuur", kamp_groepsterrein: "Echte kampterreinen voor groepen", kamp_vuur: "Elke avond kampvuur",
    kamp_beschermd: "Nationale parken om de hoek", kamp_bos: "Bos tot aan de tent",
    vei_vrede: "Een veilig, rustig land", vei_verkeer: "Veilig op de weg", vei_zorg: "Goede zorg als er iets gebeurt", vei_teken: "Weinig tekenrisico", vei_brand: "Weinig bosbranden",
    reis_direct: "Rechtstreeks te bereiken", reis_ov: "Goed openbaar vervoer", weer_temp: "Warme zomerdagen", weer_regen: "Een droge zomer",
    cul_engels: "Engels werkt overal", cul_buitenland: "Echt buitenland", scout_leden: "Veel scouts om te ontmoeten",
    prak_documenten: "Alleen je identiteitskaart", prak_roaming: "Bellen zoals thuis", prak_betalen: "Betalen zoals thuis", uniek_toerisme: "Weinig toeristen",
  };
  const fmtRaw = (f, v) => {
    if (!f || f.waarde == null) return "";
    const x = Number(f.waarde), sch = v.meter && v.meter.schaal;
    if (sch && sch.type === "rubriek") {
      const lv = (sch.niveaus || []).find((n) => Number(n.score) === x);
      if (lv && lv.criterium) { const c = lv.criterium.split(/[:(]/)[0].trim(); return c.length <= 64 ? c : c.slice(0, 62).replace(/\s+\S*$/, "") + "…"; }
      return `niveau ${nl(x, 0)} op 100`;
    }
    const s = Math.abs(x) >= 1000 ? nl(x, 0) : x % 1 ? nl(x, Math.abs(x) < 10 ? 2 : 1) : nl(x, 0);
    const u = (f.eenheid || v.meter.eenheid || "").replace(/\s*\(.*$/, "");
    return `${s}${u ? " " + u : ""}`;
  };
  // de kaarten: uit het kampbeeld, aangevuld tot 5 met de sterkste variabelen (max 2 per categorie)
  function kaartenVoor(c, n) {
    const kb = kampVan(c), out = [];
    const used = new Set();
    for (const a of (kb && kb.activiteiten) || []) {
      const v = V.find((x) => x.id === a.variabele);
      if (!v || used.has(v.id)) continue;
      out.push({ v, titel: a.titel, plek: a.plek || "", uitleg: a.uitleg || "", foto: kb.fotos && a.foto != null ? kb.fotos[a.foto] : null, bron: a.bron || null, eigen: true });
      used.add(v.id); if (out.length >= n) break;
    }
    if (out.length < n) {
      const perCat = {};
      out.forEach((k) => (perCat[k.v.categorie] = (perCat[k.v.categorie] || 0) + 1));
      const cand = V.map((v) => ({ v, s: c.scores[v.i] })).filter((x) => x.s != null && !used.has(x.v.id))
        .sort((a, b) => b.s * b.v.gewicht - a.s * a.v.gewicht || b.s - a.s);
      for (const x of cand) {
        if ((perCat[x.v.categorie] || 0) >= 2) continue;
        out.push({ v: x.v, titel: GEN[x.v.id] || x.v.naam, plek: "", uitleg: "", foto: null, bron: null, eigen: false });
        perCat[x.v.categorie] = (perCat[x.v.categorie] || 0) + 1; used.add(x.v.id);
        if (out.length >= n) break;
      }
    }
    return out;
  }
  const kaarten = kaartenVoor(WIN, 5);
  const anderen = [ELIG[1], ELIG[2]].filter(Boolean).map((c) => ({ c, k: kaartenVoor(c, 1)[0] }));
  const kbWin = kampVan(WIN);

  /* ── 3D: de kamptafel ── */
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 16 / 9, 10, 12000);
  const hemi = new THREE.HemisphereLight(0xfff6e6, 0x9a7a52, 0.75);
  const sun = new THREE.DirectionalLight(0xffe9c4, 0.95);
  sun.position.set(-900, 1500, 900); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -1900, right: 1900, top: 1900, bottom: -1900, near: 10, far: 5000 });
  sun.shadow.bias = -0.0006;
  scene.add(hemi, sun);
  // tafelblad met houtnerf
  const wood = (() => {
    const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 1024; const g = cv.getContext("2d"), rnd = mulberry32(44);
    g.fillStyle = "#b8895b"; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 260; i++) { g.strokeStyle = `rgba(${90 + rnd() * 40},${55 + rnd() * 30},${30 + rnd() * 20},${0.08 + rnd() * 0.16})`; g.lineWidth = 1 + rnd() * 5; g.beginPath(); const y = rnd() * 1024, a = rnd() * 40; g.moveTo(0, y); for (let x = 0; x <= 1024; x += 32) g.lineTo(x, y + Math.sin(x / 90 + a) * (4 + rnd() * 6)); g.stroke(); }
    const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(5, 3); tex.anisotropy = 8;
    return tex;
  })();
  const table = new THREE.Mesh(new THREE.PlaneGeometry(9000, 5400), new THREE.MeshStandardMaterial({ map: wood, roughness: 0.88 }));
  table.rotation.x = -Math.PI / 2; table.receiveShadow = true; scene.add(table);
  // spullen op tafel: kompas, beker, potlood, touw, een kaart
  const props = new THREE.Group(); scene.add(props);
  const std = (c, r = 0.6) => new THREE.MeshStandardMaterial({ color: col(c), roughness: r });
  const add = (m, x, z, ry = 0) => { m.position.x = x; m.position.z = z; m.rotation.y = ry; m.castShadow = true; m.receiveShadow = true; props.add(m); return m; };
  add(new THREE.Mesh(new THREE.CylinderGeometry(95, 95, 26, 40), std("#e8dfc6", 0.4)), 1250, 640).position.y = 13;
  add(new THREE.Mesh(new THREE.CylinderGeometry(80, 80, 6, 40), std("#f8f3e6", 0.5)), 1250, 640).position.y = 29;
  add(new THREE.Mesh(new THREE.BoxGeometry(8, 4, 120), std("#d24a2a", 0.5)), 1250, 640, 0.6).position.y = 34;
  add(new THREE.Mesh(new THREE.CylinderGeometry(70, 60, 150, 24, 1, true), new THREE.MeshStandardMaterial({ color: col("#2a5b63"), roughness: 0.5, side: THREE.DoubleSide })), -1500, 760).position.y = 75;
  add(new THREE.Mesh(new THREE.CylinderGeometry(60, 60, 4, 24), std("#2a5b63", 0.5)), -1500, 760).position.y = 2;
  add(new THREE.Mesh(new THREE.TorusGeometry(44, 10, 10, 30), std("#2a5b63", 0.5)), -1560, 760, 0).position.y = 70;
  add(new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 360, 8), std("#e3bd52", 0.5)), -1200, -820, 0).rotation.z = Math.PI / 2;
  add(new THREE.Mesh(new THREE.TorusGeometry(120, 34, 12, 36), std("#c9b18a", 0.9)), 1500, -720).rotation.x = Math.PI / 2;
  (() => {
    const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 768; const g = cv.getContext("2d");
    g.fillStyle = "#efe7d4"; g.fillRect(0, 0, 1024, 768); g.drawImage(contDay, -160, -140, 1024 + 320, 768 + 280);
    g.strokeStyle = "rgba(16,38,44,.35)"; g.lineWidth = 3; g.strokeRect(8, 8, 1008, 752);
    const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding;
    const m = add(new THREE.Mesh(new THREE.PlaneGeometry(1500, 1125), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })), -300, -300, 0);
    m.rotation.x = -Math.PI / 2; m.rotation.z = 0.12; m.position.y = 2;
  })();
  // polaroids
  const CW = 520, CH = 560, PW = 470, PH = 352, PY = CH / 2 - 25 - PH / 2;
  const loaders = [];
  function fotoMateriaal(k, i, c) {
    const f = k.foto;
    if (f && f.data) {
      const img = new Image(), tex = new THREE.Texture(img);
      tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8; tex.minFilter = THREE.LinearFilter;
      loaders.push(new Promise((res) => {
        img.onload = () => { const r = img.width / img.height, tr = PW / PH; if (r > tr) { tex.repeat.set(tr / r, 1); tex.offset.set((1 - tr / r) / 2, 0); } else { tex.repeat.set(1, r / tr); tex.offset.set(0, (1 - r / tr) / 2); } tex.needsUpdate = true; res(); };
        img.onerror = () => res();
      }));
      img.src = f.data;
      return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 });
    }
    // terugval: een getekend kaartje in de kleur van de categorie, met het woord van de variabele
    const cv = document.createElement("canvas"); cv.width = 940; cv.height = 704; const g = cv.getContext("2d");
    const base = (TIERCOL[k.v.tier] || {}).n || COL.mint;
    const gr = g.createLinearGradient(0, 0, 940, 704); gr.addColorStop(0, hexLerp(base, "#ffffff", 0.55)); gr.addColorStop(1, hexLerp(base, "#10262c", 0.25));
    g.fillStyle = gr; g.fillRect(0, 0, 940, 704);
    g.globalAlpha = 0.35; g.drawImage(contDay, -160 - i * 300, -140, 2240, 1360); g.globalAlpha = 1;
    g.fillStyle = "rgba(16,38,44,.82)"; g.font = "800 150px 'Big Shoulders Display'"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(c.scores[k.v.i] == null ? "—" : String(Math.round(c.scores[k.v.i])), 470, 300);
    g.font = "500 40px 'IBM Plex Mono'"; g.fillText(k.v.naam.toUpperCase().slice(0, 30), 470, 470);
    g.font = "italic 34px 'Fraunces'"; g.fillStyle = "rgba(16,38,44,.6)"; g.fillText("nog geen foto · zie de verkenner", 470, 560);
    const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 });
  }
  const cardMat = new THREE.MeshStandardMaterial({ color: col("#fbf8f0"), roughness: 0.7 });
  function polaroid(k, i, c, x, z, rot) {
    const grp = new THREE.Group();
    const card = new THREE.Mesh(new THREE.BoxGeometry(CW, CH, 6), cardMat); card.castShadow = true; card.receiveShadow = true; grp.add(card);
    const ph = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), fotoMateriaal(k, i, c)); ph.position.set(0, PY, 3.5); grp.add(ph);
    const pivot = new THREE.Group(); pivot.position.set(x, 4, z); pivot.rotation.y = rot;
    grp.rotation.x = -Math.PI / 2; grp.position.y = 3;
    pivot.add(grp); scene.add(pivot);
    return { pivot, grp, x, z, rot };
  }
  const rnd = mulberry32(2027 + ELIG.length);
  const SLOTS = [[-1050, 150], [-350, -420], [350, 170], [1050, -380], [0, 760]];
  const pols = kaarten.map((k, i) => polaroid(k, i, WIN, SLOTS[i][0], SLOTS[i][1], (rnd() - 0.5) * 0.5));
  const OSLOTS = [[-1500, -1050], [1450, -1080]];
  const opols = anderen.map((a, i) => polaroid(a.k, 7 + i, a.c, OSLOTS[i][0], OSLOTS[i][1], (rnd() - 0.5) * 0.4));
  const ready = Promise.all(loaders);

  // camera: overzicht, dan per activiteit een nadering; de actieve polaroid komt omhoog en kantelt naar de camera
  const over = { target: [0, 0, 60], dist: 3400, elev: 62, az: 0, off: 0 };
  function camFor(p) { return { target: [p.x, 150, p.z - 40], dist: 1560, elev: 54, az: (p.rot * 180) / Math.PI * 0.4, off: 300 }; }
  const camAt = (a, b, q) => ({ target: lerp3(a.target, b.target, q), dist: lerp(a.dist, b.dist, q), elev: lerp(a.elev, b.elev, q), az: lerp(a.az, b.az, q), off: lerp(a.off, b.off, q) });
  function activeIndex(t) { let k = -1; KBC.acts.forEach((a, i) => { if (t >= a) k = i; }); return t < KBC.sleep ? k : -1; }
  function update(t) {
    const lt = t - T.s8;
    let view = over;
    const k = activeIndex(t);
    if (k >= 0) {
      const a = KBC.acts[k], prev = k > 0 ? camFor(pols[k - 1]) : over;
      view = camAt(prev, camFor(pols[k]), E.inOut(seg(t, a - 0.3, a + 0.6)));
    } else if (t >= KBC.others - 0.4) {
      view = camAt({ target: [0, 0, -120], dist: 3600, elev: 64, az: 0, off: -520 }, { target: [0, 0, -420], dist: 3900, elev: 66, az: 0, off: 0 }, E.inOut(seg(t, KBC.others - 0.4, KBC.others + 0.8)));
    } else if (t >= KBC.sleep) {
      view = camAt(camFor(pols[pols.length - 1]), { target: [0, 0, -120], dist: 3600, elev: 64, az: 0, off: -520 }, E.inOut(seg(t, KBC.sleep - 0.3, KBC.sleep + 0.8)));
    } else {
      view = camAt({ target: [0, 0, 60], dist: 4200, elev: 70, az: -6, off: -700 }, { ...over, off: -560 }, E.out(seg(lt, 0, 2.6)));
    }
    aimCam(cam, view.target, view.dist, view.elev, view.az);
    cam.setViewOffset(1920, 1080, view.off, 0, 1920, 1080); cam.updateProjectionMatrix();
    pols.forEach((p, i) => {
      const a = KBC.acts[i], on = t >= KBC.sleep ? 0 : E.inOut(seg(t, a - 0.2, a + 0.6)) * (1 - E.inOut(seg(t, a + KBC.actD - 0.5, a + KBC.actD + 0.1)));
      p.grp.position.y = 3 + 90 * on; p.grp.rotation.x = -Math.PI / 2 + 0.62 * on;
      p.pivot.rotation.y = p.rot * (1 - on) + (-(p.rot * 0.6)) * on;
      const seen = E.out(seg(lt, 0.2 + i * 0.25, 0.9 + i * 0.25));
      p.pivot.scale.setScalar(Math.max(0.001, seen)); p.pivot.visible = seen > 0.001;
    });
    opols.forEach((p, i) => {
      const on = E.inOut(seg(t, KBC.others + 0.2 + i * 0.5, KBC.others + 1.0 + i * 0.5));
      p.grp.position.y = 3 + 120 * on; p.grp.rotation.x = -Math.PI / 2 + 0.7 * on;
      const seen = E.out(seg(lt, 1.6 + i * 0.3, 2.3 + i * 0.3));
      p.pivot.scale.setScalar(Math.max(0.001, seen)); p.pivot.visible = seen > 0.001;
    });
    const warm = E.inOut(seg(t, T.s9 - 2.5, T.s9));
    sun.color.set(hexLerp("#ffe9c4", "#ffcf8a", warm)); hemi.intensity = 0.75 - 0.2 * warm;
  }
  GL.add({ scene, cam, update, vis: (t) => (t >= T.s8 - 0.2 && t < T.s9 + 0.05 ? E.inOut(seg(t, T.s8 - 0.2, T.s8 + 0.5)) * (1 - E.inOut(seg(t, T.s9 - 1.2, T.s9 - 0.2))) : 0) });

  /* ── DOM: titel, activiteitenkaarten, slaapplaats, nummer 2 en 3 ── */
  const L = el("div", { class: "L", style: `color:${D.ink};--hlc:${D.mint}` }, sceneRoot);
  const PAP = "239,231,212";
  const panR = el("div", { class: "L", style: `background:linear-gradient(90deg, rgba(${PAP},0) 46%, rgba(${PAP},.88) 54%, rgba(${PAP},.94) 100%)` }, L);
  const panL = el("div", { class: "L", style: `background:linear-gradient(90deg, rgba(${PAP},.94) 0%, rgba(${PAP},.88) 42%, rgba(${PAP},0) 52%)` }, L);
  const panB = el("div", { class: "L", style: `background:linear-gradient(180deg, rgba(${PAP},0) 44%, rgba(${PAP},.9) 56%, rgba(${PAP},.95) 100%)` }, L);
  const head = el("div", { class: "a", style: "left:120px;top:150px;width:860px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${D.mint}` }, head, "Hoofdstuk 8 · Het kamp daar");
  const hw = words(el("div", { class: "serif", style: `font-size:${WIN.name.length > 10 ? 72 : 84}px;line-height:1.02;margin-top:14px;color:${D.ink}` }, head), `Hoe ziet *een kamp in ${WIN.name}* eruit?`);
  const sub = el("div", { class: "mono", style: `font-size:26px;margin-top:18px;color:${D.sub}` }, head,
    kbWin && kbWin.slogan ? escapeHtml(kbWin.slogan) : `Vijf dingen die ${escapeHtml(WIN.name)} sterk maken, elk met het cijfer erachter.`);
  const fotoCredit = (f) => (f ? `Foto: ${escapeHtml(f.auteur || "onbekend")} · ${escapeHtml(f.licentie || "")} · Wikimedia Commons` : "");
  const cards = kaarten.map((k, i) => {
    const c = el("div", { class: "a", style: "left:1010px;top:150px;width:860px;white-space:normal" }, L);
    const sc = WIN.scores[k.v.i], rank = M.varRank[k.v.i][WIN.name], f = WIN.feiten[k.v.id];
    el("div", { class: "kick", style: `color:${D.mint}` }, c, `Activiteit ${i + 1} van ${kaarten.length} · ${escapeHtml(catName(k.v.categorie))}`);
    const ttl = el("div", { class: "serif", style: `font-size:${k.titel.length > 34 ? 56 : 66}px;line-height:1.05;margin-top:16px;color:${D.ink}` }, c, escapeHtml(k.titel));
    if (k.plek) el("div", { class: "roman", style: `font-size:30px;margin-top:12px;color:${D.sub}` }, c, escapeHtml(k.plek));
    const row = el("div", { class: "a", style: "position:relative;margin-top:26px;display:flex;align-items:baseline;gap:18px" }, c);
    el("div", { class: "disp", style: `font-size:112px;line-height:.9;color:${D.ink}` }, row, sc == null ? "—" : sc === 100 ? "100" : nl(sc, 0));
    el("div", { class: "mono", style: `font-size:22px;line-height:1.4;color:${D.sub}` }, row, `score op 100<br>${rank ? `nummer ${rank} van ${ELIG.length} landen` : ""}`);
    el("div", { class: "mono", style: `font-size:24px;margin-top:14px;color:${D.ink}` }, c, `${escapeHtml(k.v.naam)}: <b>${escapeHtml(fmtRaw(f, k.v)) || "geen waarde"}</b>`);
    if (k.uitleg) el("div", { class: "roman", style: `font-size:27px;line-height:1.35;margin-top:16px;color:${D.ink};max-width:820px` }, c, escapeHtml(k.uitleg));
    const srcTxt = k.bron && (k.bron.naam || k.bron.url) ? `Bron: ${escapeHtml(k.bron.naam || k.bron.url)}` : f && f.bron && f.bron.naam ? `Bron: ${escapeHtml(f.bron.naam)}` : "";
    el("div", { class: "mono", style: `font-size:15px;line-height:1.7;margin-top:18px;color:${D.sub};letter-spacing:.06em` }, c, [srcTxt, fotoCredit(k.foto)].filter(Boolean).join("<br>"));
    return c;
  });
  // de slaapplaats
  const sleep = el("div", { class: "a", style: "left:120px;top:190px;width:760px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${D.mint}` }, sleep, "Waar we slapen");
  const slaap = (kbWin && kbWin.kampplaatsen && kbWin.kampplaatsen.length) ? kbWin.kampplaatsen.slice(0, 3) : null;
  el("div", { class: "serif", style: `font-size:60px;line-height:1.05;margin-top:14px;color:${D.ink}` }, sleep, slaap ? "Een echt kampterrein." : "Kampterrein of vrij in de natuur.");
  const sleepList = el("div", { style: "margin-top:22px" }, sleep);
  const sleepRows = (slaap || [
    { naam: V.find((v) => v.id === "kamp_groepsterrein") ? V.find((v) => v.id === "kamp_groepsterrein").naam : "Kampterreinen", details: `score ${fv1(WIN.scores[V.findIndex((v) => v.id === "kamp_groepsterrein")])} op 100` },
    { naam: "Vrij kamperen", details: `score ${fv1(WIN.scores[V.findIndex((v) => v.id === "kamp_wild")])} op 100` },
    { naam: "Kampvuur in de zomer", details: `score ${fv1(WIN.scores[V.findIndex((v) => v.id === "kamp_vuur")])} op 100` },
  ]).map((p, i) => {
    const r = el("div", { style: `display:flex;gap:16px;align-items:baseline;margin-top:${i ? 14 : 0}px` }, sleepList);
    el("div", { class: "disp", style: `font-size:34px;color:${D.mint};width:34px` }, r, String(i + 1));
    el("div", { style: "white-space:normal" }, r, `<span class="roman" style="font-size:31px;color:${D.ink}">${escapeHtml(p.naam)}</span>${p.plaats ? `<span class="mono" style="font-size:20px;color:${D.sub}"> · ${escapeHtml(p.plaats)}</span>` : ""}${p.details ? `<div class="mono" style="font-size:18px;color:${D.sub};margin-top:2px">${escapeHtml(p.details)}</div>` : ""}`);
    return r;
  });
  function fv1(x) { return x == null ? "—" : x === 100 ? "100" : nl(x, 0); }
  // nummer 2 en 3
  const others = anderen.map((a, i) => {
    const box = el("div", { class: "a", style: `left:${i ? 1010 : 120}px;top:700px;width:790px;white-space:normal` }, L);
    el("div", { class: "kick", style: `color:${D.gold}` }, box, `Nummer ${i + 2} · ${fTot(a.c)} punten`);
    el("div", { class: "serif", style: `font-size:46px;line-height:1.08;margin-top:10px;color:${D.ink}` }, box, `${escapeHtml(a.c.name)}: <i>${escapeHtml(a.k ? a.k.titel.toLowerCase() : "")}</i>`);
    const f = a.k ? a.c.feiten[a.k.v.id] : null;
    el("div", { class: "mono", style: `font-size:20px;margin-top:8px;color:${D.sub}` }, box, a.k ? `${escapeHtml(a.k.v.naam)}: ${escapeHtml(fmtRaw(f, a.k.v))} · score ${fv1(a.c.scores[a.k.v.i])}${a.k.plek ? " · " + escapeHtml(a.k.plek) : ""}` : "");
    if (a.k && a.k.foto) el("div", { class: "mono", style: `font-size:13px;margin-top:8px;color:${D.sub};letter-spacing:.06em` }, box, fotoCredit(a.k.foto));
    return box;
  });
  const othersHead = el("div", { class: "a", style: "left:120px;top:560px;width:1680px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${D.gold}` }, othersHead, "En als het toch anders loopt");
  el("div", { class: "serif", style: `font-size:54px;line-height:1.05;margin-top:10px;color:${D.ink}` }, othersHead, "Nummer 2 en 3 hebben elk hun eigen troef.");

  renders.push((t) => {
    const o = win(t, T.s8 - 0.1, T.s9, 0.01, 0.5);
    op(L, o);
    if (o <= 0) return;
    op(panL, Math.max(win(t, KBC.title - 0.3, KBC.acts[0] - 0.2, 0.5, 0.4), win(t, KBC.sleep + 0.2, KBC.others - 0.3, 0.5, 0.4)));
    op(panR, win(t, KBC.acts[0] + 0.1, KBC.sleep - 0.3, 0.5, 0.4));
    op(panB, win(t, KBC.others, T.s9 - 0.6, 0.5, 0.4));
    inout(head, t, KBC.title, KBC.acts[0] - 0.2, 0.5, 14); revealWords(hw, t, KBC.title, 0.08, 0.5);
    op(sub, win(t, KBC.title + 1.0, KBC.acts[0] - 0.2, 0.4, 0.3));
    cards.forEach((c, i) => { const a = KBC.acts[i]; inout(c, t, a + 0.25, Math.min(a + KBC.actD - 0.15, KBC.sleep - 0.3), 0.45, 26); });
    inout(sleep, t, KBC.sleep + 0.4, KBC.others - 0.3, 0.5, 20);
    sleepRows.forEach((r, i) => set(r, E.out5(seg(t, KBC.sleep + 0.9 + i * 0.3, KBC.sleep + 1.4 + i * 0.3)), (1 - E.out5(seg(t, KBC.sleep + 0.9 + i * 0.3, KBC.sleep + 1.4 + i * 0.3))) * -16, 0));
    inout(othersHead, t, KBC.others + 0.2, T.s9 - 0.6, 0.5, 14);
    others.forEach((b, i) => inout(b, t, KBC.others + 0.7 + i * 0.5, T.s9 - 0.6, 0.5, 20));
  });
  return { ready, kaarten, anderen, kaartenVoor, fmtRaw, kampVan, GEN };
})();
