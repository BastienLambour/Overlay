/* =====================================================================
   Fabrique des captures ANIMÉES (WebP ou GIF) des pages de l'overlay :
   écrans, scènes, alertes, transitions… pour les montrer ou les partager.

   Utilisation (dans le dossier de l'overlay) :
       node outils/animer.mjs captures/liste.json            → toute la liste
       node outils/animer.mjs "scenes/pause.html?test=1" --duree=8
       node outils/animer.mjs sources/alertes.html --duree=8 --nom=alerte-raid
            --script="Evenements.emettre(Evenements.exemple('raid'))"

   Options : --duree=secondes (6) · --ips=images/seconde (15) · --largeur=px (1920 : pleine définition)
             --format=webp | gif | les-deux (webp) · --dossier=… (captures)
             --fond=jeu | aucun : fond derrière les pages transparentes (jeu)
             --script="…" : JavaScript lancé au début (ex. déclencher une alerte)
             --images=1 : garde les images PNG intermédiaires (pour vérifier)
             --manquantes=1 : ne refait pas les captures déjà présentes
             --seulement=nom1,nom2 : seulement ces captures de la liste
             --paralleles=3 : nombre de navigateurs qui travaillent en même temps (liste)
   Liste JSON : [{ "page": "…", "duree": 8, "nom": "…", "script": "…", "fond": "aucun" }, …]

   Le temps de la page est VIRTUEL : il n'avance que d'une image à la fois
   (animations CSS, minuteries, requestAnimationFrame, Date, performance.now).
   L'animation est donc parfaitement fluide, même si chaque capture est lente.

   Nécessite : Microsoft Edge (installé avec Windows) et ffmpeg (cherché via la
   variable FFMPEG, puis dans le PATH, puis dans G:\Applications\ffmpeg\bin).

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
   ===================================================================== */
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (nom, defaut) => { const a = args.find(x => x.startsWith(`--${nom}=`)); return a ? a.slice(nom.length + 3) : defaut; };
const PORT = Number(option('port', 9338));
const premier = args.find(a => !a.startsWith('--'));
if (!premier) { console.error('Indique une page ou une liste, ex. : node outils/animer.mjs captures/liste.json'); process.exit(1); }

const COMMUNES = {
  duree: Number(option('duree', 6)), ips: Number(option('ips', 15)), largeur: Number(option('largeur', 1920)),
  format: option('format', 'webp'), fond: option('fond', 'jeu'), script: option('script', ''),
};
const seulement = option('seulement', '').split(',').filter(Boolean);
const travaux = (premier.endsWith('.json')
  ? JSON.parse(readFileSync(resolve(RACINE, premier), 'utf8')).map(t => ({ ...COMMUNES, ...t }))
  : [{ ...COMMUNES, page: premier, nom: option('nom', '') }])
  .filter(t => !seulement.length || seulement.includes(t.nom));

// Liste + plusieurs navigateurs : on se relance en N morceaux, chacun avec son propre Edge
const paralleles = Number(option('paralleles', 3));
if (premier.endsWith('.json') && paralleles > 1 && travaux.length > 1 && !option('port')) {
  const morceaux = Array.from({ length: Math.min(paralleles, travaux.length) }, () => []);
  travaux.forEach((t, i) => morceaux[i % morceaux.length].push(t.nom));
  const autres = args.filter(a => a !== premier && !/^--(paralleles|seulement)=/.test(a));
  await Promise.all(morceaux.map((noms, i) => new Promise(fini => {
    const p = spawn(process.execPath, [fileURLToPath(import.meta.url), premier, ...autres, `--seulement=${noms.join(',')}`, `--port=${9338 + i}`, '--paralleles=1']);
    // On ne relaie que les lignes utiles : fichier terminé, ou erreur
    p.stdout.on('data', d => String(d).split(/\r?\n/).filter(l => l.includes('→') || l.includes('rreur')).forEach(l => console.log(l)));
    p.stderr.on('data', d => process.stderr.write(d));
    p.on('close', fini);
  })));
  process.exit(0);
}
const SORTIE = resolve(RACINE, option('dossier', 'captures'));
mkdirSync(SORTIE, { recursive: true });

const NAV = [process.env.NAVIGATEUR, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe']
  .find(p => p && existsSync(p));
if (!NAV) { console.error('Microsoft Edge introuvable.'); process.exit(1); }
const FFMPEG = [process.env.FFMPEG, 'ffmpeg', 'G:/Applications/ffmpeg/bin/ffmpeg.exe']
  .filter(Boolean).find(f => { try { return spawnSync(f, ['-version']).status === 0; } catch { return false; } });
if (!FFMPEG) { console.error('ffmpeg introuvable : installe-le (winget install Gyan.FFmpeg).'); process.exit(1); }
const attendre = ms => new Promise(r => setTimeout(r, ms));

// ---------- Horloge virtuelle, injectée avant les scripts de la page ----------
const HORLOGE = `(() => {
  let maintenant = 0;
  const origine = Date.now(), DateReel = Date;
  window.Date = class extends DateReel {
    constructor(...a) { if (a.length) super(...a); else super(origine + maintenant); }
    static now() { return origine + maintenant; }
  };
  performance.now = () => maintenant;
  const minuteries = new Map(); let suivant = 1;
  const programmer = (fn, ms, args, repete) => { const id = suivant++; ms = Math.max(repete ? 1 : 0, Number(ms) || 0); minuteries.set(id, { fn, t: maintenant + ms, args, repete: repete ? ms : 0 }); return id; };
  window.setTimeout = (fn, ms, ...a) => programmer(fn, ms, a, false);
  window.setInterval = (fn, ms, ...a) => programmer(fn, ms, a, true);
  window.clearTimeout = window.clearInterval = id => minuteries.delete(id);
  let rafs = new Map(); let rafId = 1;
  window.__rafReel = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = fn => { rafs.set(rafId, fn); return rafId++; };
  window.cancelAnimationFrame = id => rafs.delete(id);
  const vues = new WeakSet();
  const executer = (fn, a) => { try { typeof fn === 'function' ? fn(...a) : (0, eval)(fn); } catch (e) { console.error(e); } };
  window.__avancer = dt => {
    const fin = maintenant + dt;
    for (;;) {            // minuteries dues, dans l'ordre
      let id = null, m = null;
      for (const [i, x] of minuteries) if (x.t <= fin && (!m || x.t < m.t)) { id = i; m = x; }
      if (!m) break;
      maintenant = Math.max(maintenant, m.t);
      if (m.repete) m.t += m.repete; else minuteries.delete(id);
      executer(m.fn, m.args);
    }
    maintenant = fin;
    const r = rafs; rafs = new Map();
    r.forEach(fn => executer(fn, [maintenant]));
    for (const a of document.getAnimations()) {   // animations CSS : une image de plus
      if (!vues.has(a)) { vues.add(a); a.pause(); a.currentTime = 0; }
      else a.currentTime = (a.currentTime || 0) + dt;
    }
  };
})();`;

const FOND_JEU = `html { background: #0c1220 linear-gradient(160deg, #2d3a55, #172033 60%, #0c1220) !important; }
  html.transparent body, html.transparent #ecran { background: transparent !important; }`;

// ---------- Edge sans fenêtre ----------
const profil = mkdtempSync(join(tmpdir(), 'overlay-edge-'));
const edge = spawn(NAV, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`, '--mute-audio',
  '--hide-scrollbars', '--allow-file-access-from-files', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
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
const erreurs = [];
ecouteurs.push(m => { if (m.method === 'Runtime.exceptionThrown') erreurs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });

await cdp('Page.enable');
await cdp('Runtime.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await cdp('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
const { identifier: script } = await cdp('Page.addScriptToEvaluateOnNewDocument', { source: HORLOGE });

for (const t of travaux) {
  const [chemin, requete] = t.page.split('?');
  const nom = t.nom || basename(chemin, '.html');
  if (option('manquantes') && existsSync(join(SORTIE, `${nom}.${t.format === 'gif' ? 'gif' : 'webp'}`))) { console.log(`${nom} : déjà fait`); continue; }
  // La page est rendue directement à la largeur voulue (bien plus rapide que réduire une capture 1920)
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: t.largeur / 1920, mobile: false });
  const url = pathToFileURL(join(RACINE, chemin)).href + (requete ? '?' + requete : '');
  const charge = new Promise(r => ecouteurs.push(m => m.method === 'Page.loadEventFired' && r()));
  erreurs.length = 0;
  await cdp('Page.navigate', { url });
  await charge;
  await evaluer('document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.decode().catch(() => {})))).then(() => true)');
  if (t.fond === 'jeu') await evaluer(`document.head.insertAdjacentHTML('beforeend', ${JSON.stringify('<style>' + FOND_JEU + '</style>')}); true`);
  await attendre(300);   // images des SVG
  if (t.script) await evaluer(t.script);

  const dossier = mkdtempSync(join(tmpdir(), `animation-${nom}-`));
  const images = Math.round(t.duree * t.ips), dt = 1000 / t.ips;
  const ext = '.png';   // PNG : aucune perte sur les petits textes colorés
  process.stdout.write(`${nom} : ${images} images `);
  for (let i = 0; i < images; i++) {
    await evaluer(`__avancer(${i ? dt : 0}); new Promise(r => __rafReel(() => __rafReel(r)))`);
    const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(dossier, String(i).padStart(4, '0') + ext), Buffer.from(data, 'base64'));
    if (i % 30 === 0) process.stdout.write('.');
  }
  console.log();

  const entree = ['-y', '-loglevel', 'error', '-framerate', String(t.ips), '-i', join(dossier, '%04d' + ext)];
  const formats = t.format === 'les-deux' ? ['webp', 'gif'] : [t.format];
  for (const f of formats) {
    const fichier = join(SORTIE, `${nom}.${f}`);
    const sortie = f === 'gif'
      ? ['-vf', 'split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3', '-loop', '0', fichier]
      // WebP SANS PERTE : textes et néons nets (la version avec perte bave sur les petits textes colorés)
      : ['-c:v', 'libwebp_anim', '-lossless', '1', '-quality', '75', '-compression_level', '4', '-pix_fmt', 'bgra', '-loop', '0', fichier];
    const r = spawnSync(FFMPEG, [...entree, ...sortie], { stdio: 'inherit' });
    if (r.status === 0) console.log(`  → ${fichier}  (${(statSync(fichier).size / 1048576).toFixed(1)} Mo)`);
  }
  if (t.images ?? option('images')) console.log(`  images gardées dans ${dossier}`); else rmSync(dossier, { recursive: true, force: true });
  if (erreurs.length) console.log('  Erreurs JavaScript :\n    ' + [...new Set(erreurs)].join('\n    '));
}

await cdp('Page.removeScriptToEvaluateOnNewDocument', { identifier: script }).catch(() => {});
ws.close();
edge.kill();
await attendre(500);
try { rmSync(profil, { recursive: true, force: true }); } catch {}
