// Rendert de film frame voor frame (deterministisch) en muxt de soundtrack.
// Gebruik: node tools/render.cjs [out.mp4] [fps] [scale] [start-s] [eind-s]
//   node tools/render.cjs out/recruitment-ai-de-lus.mp4 60 1
const { chromium } = require('./pw.cjs');
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..');
const out = path.resolve(ROOT, process.argv[2] || 'out/recruitment-ai-de-lus.mp4');
const fps = parseInt(process.argv[3] || '60', 10);
const scale = parseFloat(process.argv[4] || '1');
const T0 = parseFloat(process.argv[5] || '0'), T1 = process.argv[6] ? parseFloat(process.argv[6]) : null;
const W = Math.round(1920 * scale), H = Math.round(1080 * scale);
fs.mkdirSync(path.dirname(out), { recursive: true });
const silent = out.replace(/\.mp4$/, '.video.mp4');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(ROOT, 'index.html') + '?render=1');
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 });
  const dur = await page.evaluate(() => window.__duration);
  const end = T1 ?? dur, first = Math.round(T0 * fps), frames = Math.round(end * fps);

  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
    '-vf', `scale=${W}:${H}:flags=lanczos`, silent], { stdio: ['pipe', 'inherit', 'inherit'] });

  const t0 = Date.now();
  for (let i = first; i < frames; i++) {
    await page.evaluate(t => window.__seek(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${frames} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  if (errs.length) console.log('PAGE ERRORS:\n' + errs.join('\n'));

  // soundtrack erbij (AAC 256k), exact even lang als het beeld
  await new Promise((res, rej) => {
    const mux = spawn('ffmpeg', ['-v', 'error', '-y', '-i', silent, '-ss', String(T0), '-i', fs.existsSync(path.join(ROOT, 'assets/soundtrack.wav')) ? path.join(ROOT, 'assets/soundtrack.wav') : path.join(ROOT, 'assets/soundtrack.mp3'),
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-t', String(end - T0), '-movflags', '+faststart', out], { stdio: 'inherit' });
    mux.on('close', c => c === 0 ? res() : rej(new Error('mux ' + c)));
  });
  if (!process.env.KEEP) fs.unlinkSync(silent);
  // bewijs, geen aanname: de uitvoer moet het verwachte aantal videoframes bevatten
  const { execFileSync } = require('node:child_process');
  const got = parseInt(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', out]).toString().trim() || '0', 10);
  if (got !== frames - first) { console.error(`FOUT: ${got} videoframes in ${out}, verwacht ${frames - first}`); process.exit(1); }
  console.log(`klaar: ${out} · ${frames} frames · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
})();
