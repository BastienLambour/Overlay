/* =====================================================================
   Exporte les transitions en vidéos .webm transparentes pour OBS (Stinger).

   Utilisation (dans le dossier de l'overlay) :
       node outils/generer-transitions.mjs                  → toutes les transitions
       node outils/generer-transitions.mjs rideau epee      → seulement celles-ci
       node outils/generer-transitions.mjs couleur=rouge    → option passée à la page
                                                              (vidéo suffixée -rouge)

   Chaque page de transitions/ doit charger js/transition.js, qui fournit
   dureeTransition() et allerA(ms). Elle peut aussi définir pointTransition()
   (sinon : la moitié de la durée).

   Nécessite : Microsoft Edge (installé avec Windows) et ffmpeg, cherché via
   la variable FFMPEG, puis dans le PATH, puis dans G:\Applications\ffmpeg\bin.
   Sans ffmpeg, les images sont quand même générées dans un dossier temporaire.

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
   ===================================================================== */
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SORTIE = join(RACINE, 'transitions', 'videos');
const IPS = 60;
const PORT = 9334;

const args = process.argv.slice(2);
const options = args.filter(a => a.includes('='));
const noms = args.filter(a => !a.includes('='));
const TRANSITIONS = noms.length ? noms
  : readdirSync(join(RACINE, 'transitions')).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5));
const requete = options.map(o => { const [k, ...v] = o.split('='); return `&${encodeURIComponent(k)}=${encodeURIComponent(v.join('='))}`; }).join('');
const suffixe = options.map(o => '-' + o.split('=').slice(1).join('=').replace(/[^\w-]/g, '')).join('');

const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe']
  .find(p => existsSync(p));
if (!EDGE) { console.error('Microsoft Edge introuvable.'); process.exit(1); }
const FFMPEG = [process.env.FFMPEG, 'ffmpeg', 'G:/Applications/ffmpeg/bin/ffmpeg.exe']
  .filter(Boolean).find(f => { try { return spawnSync(f, ['-version']).status === 0; } catch { return false; } });

const attendre = ms => new Promise(r => setTimeout(r, ms));

// --- Lance Edge sans fenêtre, avec le protocole de débogage ---
const profil = mkdtempSync(join(tmpdir(), 'overlay-edge-'));
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`,
  '--hide-scrollbars', '--allow-file-access-from-files', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });

let cible;
for (let i = 0; i < 50 && !cible; i++) {
  await attendre(200);
  try { cible = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(t => t.type === 'page'); } catch {}
}
if (!cible) { console.error('Impossible de piloter Edge.'); edge.kill(); process.exit(1); }

// --- Petit client pour le protocole Chrome DevTools ---
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0;
const attentes = new Map(), ecouteurs = [];
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && attentes.has(m.id)) { attentes.get(m.id)(m); attentes.delete(m.id); }
  else ecouteurs.forEach(f => f(m));
});
const cdp = (method, params = {}) => new Promise((ok, ko) => {
  const n = ++id;
  attentes.set(n, m => m.error ? ko(new Error(m.error.message)) : ok(m.result));
  ws.send(JSON.stringify({ id: n, method, params }));
});
const evaluer = async expr => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

await cdp('Page.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await cdp('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });

mkdirSync(SORTIE, { recursive: true });
const recap = [];
for (const nom of TRANSITIONS) {
  const url = pathToFileURL(join(RACINE, 'transitions', `${nom}.html`)).href + '?mode=complet&capture=1' + requete;
  const charge = new Promise(r => ecouteurs.push(m => m.method === 'Page.loadEventFired' && r()));
  await cdp('Page.navigate', { url });
  await charge;
  await evaluer('document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.decode().catch(() => {})))).then(() => true)');
  await attendre(500);

  const duree = await evaluer('dureeTransition()');
  const point = await evaluer(`typeof pointTransition === 'function' ? pointTransition() : Math.round(${duree} / 2)`);
  const images = Math.ceil(duree / 1000 * IPS) + 1;
  const dossier = mkdtempSync(join(tmpdir(), `transition-${nom}-`));
  process.stdout.write(`${nom} : ${images} images `);
  for (let i = 0; i < images; i++) {
    await evaluer(`allerA(${(i * 1000 / IPS).toFixed(2)})`);
    await evaluer('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
    const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(dossier, String(i).padStart(4, '0') + '.png'), Buffer.from(data, 'base64'));
    if (i % 20 === 0) process.stdout.write('.');
  }
  console.log();

  if (FFMPEG) {
    const video = join(SORTIE, `${nom}${suffixe}.webm`);
    const r = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(IPS), '-i', join(dossier, '%04d.png'),
      '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '24', '-auto-alt-ref', '0', video], { stdio: 'inherit' });
    if (r.status === 0) {
      console.log(`  → ${video}`);
      recap.push([`${nom}${suffixe}`, point]);
      rmSync(dossier, { recursive: true, force: true });
    }
  } else {
    console.log(`  ffmpeg absent : images laissées dans ${dossier}`);
  }
}

ws.close();
edge.kill();
await attendre(500);
try { rmSync(profil, { recursive: true, force: true }); } catch {}
if (recap.length) {
  console.log('\nDans OBS : Transitions de scène › + › Stinger, puis « Point de transition » :');
  recap.forEach(([nom, point]) => console.log(`  ${nom}.webm  →  ${point} ms`));
}
if (!FFMPEG) console.log('\nffmpeg introuvable : installe-le (winget install Gyan.FFmpeg) puis relance ce script.');
