/* =====================================================================
   Exporte le kit de chaîne Twitch (chaine/kit.html) en images PNG.

   Utilisation (dans le dossier de l'overlay) :
       node outils/exporter-chaine.mjs              → tout le kit
       node outils/exporter-chaine.mjs banniere gg  → seulement ces éléments

   Résultat : chaine/export/ (bannière, hors-ligne, panneaux, emotes et badges
   dans toutes les tailles demandées par Twitch, fond transparent).
   Nécessite : Microsoft Edge (installé avec Windows).

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
   ===================================================================== */
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGE = pathToFileURL(join(RACINE, 'chaine', 'kit.html')).href;
const SORTIE = join(RACINE, 'chaine', 'export');
const PORT = 9335;
const choix = process.argv.slice(2);

const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe']
  .find(p => existsSync(p));
if (!EDGE) { console.error('Microsoft Edge introuvable.'); process.exit(1); }

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
async function ouvrir(url) {
  const charge = new Promise(r => ecouteurs.push(m => m.method === 'Page.loadEventFired' && r()));
  await cdp('Page.navigate', { url });
  await charge;
}

await cdp('Page.enable');
await cdp('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });

// Liste des images à produire, fournie par la page elle-même
await ouvrir(PAGE);
const liste = (await evaluer('window.listeExport || []')).filter(x => !choix.length || choix.includes(x.id));
if (!liste.length) console.log('Aucun élément à exporter (chaine/elements.js est-il rempli ?)');

mkdirSync(SORTIE, { recursive: true });
for (const x of liste) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: x.l, height: x.h, deviceScaleFactor: 1, mobile: false });
  await ouvrir(`${PAGE}?seul=${encodeURIComponent(x.id)}&taille=${x.taille}`);
  for (let i = 0; i < 50 && !(await evaluer('window.pret === true')); i++) await attendre(100);
  await attendre(150);
  const { data } = await cdp('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: x.l, height: x.h, scale: 1 } });
  writeFileSync(join(SORTIE, x.fichier), Buffer.from(data, 'base64'));
  console.log(`  ${x.fichier}  (${x.l} × ${x.h})`);
}

ws.close();
edge.kill();
await attendre(500);
try { rmSync(profil, { recursive: true, force: true }); } catch {}
if (liste.length) console.log(`\n${liste.length} images dans ${SORTIE}`);
