/* =====================================================================
   Capture une page de l'overlay en PNG, éventuellement figée à des instants
   précis : pratique pour vérifier une transition ou une animation image par
   image, sans OBS et même quand l'aperçu du navigateur ne fait pas de capture.

   Utilisation (dans le dossier de l'overlay) :
       node outils/capturer.mjs scenes/jeu.html?test=1
       node outils/capturer.mjs "transitions/rideau.html?mode=complet" 0 700 1400
       node outils/capturer.mjs chaine/kit.html --largeur=1240 --hauteur=3000 --dossier=C:\temp

   Les nombres sont des instants en millisecondes : toutes les animations sont
   mises en pause à cet instant (getAnimations → currentTime) avant la capture.
   Sans nombre : capture après 1,5 s d'animation normale.
   Résultat : un PNG par instant, dans --dossier (par défaut : dossier temporaire affiché).
   Nécessite : Microsoft Edge (installé avec Windows).

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
   ===================================================================== */
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 9337;
const args = process.argv.slice(2);
const option = (nom, defaut) => (args.find(a => a.startsWith(`--${nom}=`)) || '').split('=')[1] || defaut;
const page = args.find(a => !a.startsWith('--') && !/^\d+(\.\d+)?$/.test(a));
const instants = args.filter(a => /^\d+(\.\d+)?$/.test(a)).map(Number);
if (!page) { console.error('Indique une page, ex. : node outils/capturer.mjs scenes/jeu.html?test=1'); process.exit(1); }
const L = Number(option('largeur', 1920)), H = Number(option('hauteur', 1080));
const SORTIE = option('dossier', mkdtempSync(join(tmpdir(), 'overlay-capture-')));
mkdirSync(SORTIE, { recursive: true });

const [chemin, requete] = page.split('?');
const url = pathToFileURL(join(RACINE, chemin)).href + (requete ? '?' + requete : '');
const nom = basename(chemin, '.html');

const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe']
  .find(p => existsSync(p));
if (!EDGE) { console.error('Microsoft Edge introuvable.'); process.exit(1); }
const attendre = ms => new Promise(r => setTimeout(r, ms));
const profil = mkdtempSync(join(tmpdir(), 'overlay-edge-'));
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`,
  '--hide-scrollbars', '--allow-file-access-from-files', `--window-size=${L},${H}`, 'about:blank'], { stdio: 'ignore' });
let cible;
for (let i = 0; i < 50 && !cible; i++) {
  await attendre(200);
  try { cible = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(t => t.type === 'page'); } catch {}
}
if (!cible) { console.error('Impossible de piloter Edge.'); edge.kill(); process.exit(1); }
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
const evaluer = async expr => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result;

await cdp('Page.enable');
await cdp('Runtime.enable');
const erreurs = [];
ecouteurs.push(m => { if (m.method === 'Runtime.exceptionThrown') erreurs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });
await cdp('Emulation.setDeviceMetricsOverride', { width: L, height: H, deviceScaleFactor: 1, mobile: false });
const charge = new Promise(r => ecouteurs.push(m => m.method === 'Page.loadEventFired' && r()));
await cdp('Page.navigate', { url });
await charge;
await evaluer('document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.decode().catch(() => {})))).then(() => true)');

async function capture(fichier) {
  const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(SORTIE, fichier), Buffer.from(data, 'base64'));
  console.log(`  ${join(SORTIE, fichier)}`);
}
if (!instants.length) {
  await attendre(1500);
  await capture(`capture-${nom}.png`);
} else {
  for (const t of instants) {
    await evaluer(`document.getAnimations().forEach(a => { a.pause(); a.currentTime = ${t}; }); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
    await capture(`capture-${nom}-${t}ms.png`);
  }
}
if (erreurs.length) console.log('\nErreurs JavaScript sur la page :\n  ' + erreurs.join('\n  '));

ws.close();
edge.kill();
await attendre(500);
try { rmSync(profil, { recursive: true, force: true }); } catch {}
