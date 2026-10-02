/* =====================================================================
   CONSTRUIRE — fabrique ce que le serveur distribue, à partir du dépôt.

   Pour chaque overlay du dépôt (un dossier avec un config.js qui a un « id ») :
     <sortie>/<id>/<id>.zip       l'overlay complet, SANS mes-reglages.js ni sauvegardes/
     <sortie>/<id>/version.json   { id, nom, version, date, adresse, changements }
     <sortie>/<id>/TUTO.pdf       le tuto, à lire en ligne
   puis <sortie>/index.html : la page de téléchargement (une carte par overlay).
   Le zip contient aussi version.json : le bouton « Mettre à jour » de l'overlay sait ainsi
   quelle version il a, et à quelle adresse demander la suivante.

   Utilisation (dans le dépôt) :
       node serveur/construire.mjs                   → sortie : /var/www/overlays
       SORTIE=C:\temp\site node serveur/construire.mjs
   Variables : SORTIE (dossier publié), ADRESSE (adresse publique du site, ex. http://217.154.115.223).
   Node 18+, sans dépendance (le zip est écrit ici même, avec zlib).
   ===================================================================== */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, copyFileSync, renameSync } from 'node:fs';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { deflateRawSync } from 'node:zlib';
import vm from 'node:vm';

const DEPOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SORTIE = resolve(process.env.SORTIE || '/var/www/overlays');
const ADRESSE = (process.env.ADRESSE || 'http://217.154.115.223').replace(/\/+$/, '');
// Jamais livrés : les réglages perso du streamer, ses sauvegardes, les fichiers techniques
const EXCLUS_FICHIERS = new Set(['mes-reglages.js', '.DS_Store', 'Thumbs.db', 'desktop.ini']);
const EXCLUS_DOSSIERS = new Set(['sauvegardes', '.git', 'node_modules']);

// ---------- Les overlays du dépôt ----------
function lireConfig(dossier) {
  try {
    const ctx = { window: {} };
    vm.createContext(ctx);
    vm.runInContext(readFileSync(join(dossier, 'config.js'), 'utf8'), ctx, { timeout: 1000 });
    return ctx.window.CONFIG || null;
  } catch (e) { return null; }
}
const overlays = readdirSync(DEPOT, { withFileTypes: true })
  .filter(d => d.isDirectory() && !/^[._]/.test(d.name) && existsSync(join(DEPOT, d.name, 'config.js')))
  .map(d => ({ dossier: join(DEPOT, d.name), nomDossier: d.name, config: lireConfig(join(DEPOT, d.name)) }))
  .filter(o => o.config && o.config.id);

// ---------- Version : la date et l'empreinte du dernier commit qui touche le dossier ----------
function git(args) {
  try { return execFileSync('git', ['-C', DEPOT, ...args], { encoding: 'utf8' }).trim(); } catch (e) { return ''; }
}
function versionDe(o) {
  const [hash, date] = git(['log', '-1', '--format=%h|%cI', '--', o.nomDossier]).split('|');
  const d = date ? new Date(date) : new Date();
  const p = n => String(n).padStart(2, '0');
  const jour = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  return { version: `${jour}_${p(d.getHours())}${p(d.getMinutes())}${hash ? '-' + hash : ''}`, date: d.toISOString() };
}

// ---------- Ce qui a changé : les dernières lignes du journal de CONCEPT.md ----------
function changementsDe(o, n = 6) {
  const f = join(o.dossier, 'CONCEPT.md');
  if (!existsSync(f)) return [];
  const texte = readFileSync(f, 'utf8');
  const journal = texte.slice(texte.indexOf('## Journal'));
  return journal.split('\n').filter(l => /^- \*\*\d{4}-\d{2}-\d{2}\*\*/.test(l)).slice(-n).reverse().map(l => {
    const [, date, reste] = l.match(/^- \*\*(\d{4}-\d{2}-\d{2})\*\*\s*[—-]?\s*(.*)$/) || [];
    let t = (reste || '').replace(/\*\*|`/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim();
    if (t.length > 260) t = t.slice(0, 257).replace(/\s+\S*$/, '') + '…';
    return { date, texte: t };
  });
}

// ---------- Un zip, écrit à la main (zlib) : noms en UTF-8, compression « deflate » ----------
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function dateDos(d) {
  return { heure: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    jour: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate() };
}
function zip(entrees) {   // entrees : [{ nom, donnees: Buffer, date }]
  const morceaux = [], central = [];
  let pos = 0;
  for (const e of entrees) {
    const nom = Buffer.from(e.nom, 'utf8');
    const comprime = deflateRawSync(e.donnees, { level: 9 });
    const garder = comprime.length < e.donnees.length;      // déjà compressé (webm, png…) : stocké tel quel
    const corps = garder ? comprime : e.donnees;
    const crc = crc32(e.donnees), { heure, jour } = dateDos(e.date);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(garder ? 8 : 0, 8); local.writeUInt16LE(heure, 10); local.writeUInt16LE(jour, 12);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(corps.length, 18); local.writeUInt32LE(e.donnees.length, 22);
    local.writeUInt16LE(nom.length, 26); local.writeUInt16LE(0, 28);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8);
    c.writeUInt16LE(garder ? 8 : 0, 10); c.writeUInt16LE(heure, 12); c.writeUInt16LE(jour, 14);
    c.writeUInt32LE(crc, 16); c.writeUInt32LE(corps.length, 20); c.writeUInt32LE(e.donnees.length, 24);
    c.writeUInt16LE(nom.length, 28); c.writeUInt32LE(pos, 42);
    morceaux.push(local, nom, corps);
    central.push(c, nom);
    pos += 30 + nom.length + corps.length;
  }
  const tailleCentral = central.reduce((s, b) => s + b.length, 0);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0); fin.writeUInt16LE(entrees.length, 8); fin.writeUInt16LE(entrees.length, 10);
  fin.writeUInt32LE(tailleCentral, 12); fin.writeUInt32LE(pos, 16);
  return Buffer.concat([...morceaux, ...central, fin]);
}
function fichiersDe(dossier, base = dossier) {
  return readdirSync(dossier, { withFileTypes: true }).flatMap(d => {
    const chemin = join(dossier, d.name);
    if (d.isDirectory()) return EXCLUS_DOSSIERS.has(d.name) ? [] : fichiersDe(chemin, base);
    return EXCLUS_FICHIERS.has(d.name) ? [] : [chemin];
  });
}

// ---------- Construction ----------
mkdirSync(SORTIE, { recursive: true });
const cartes = [];
for (const o of overlays) {
  const id = o.config.id, nom = o.config.nomChaine || id;
  const { version, date } = versionDe(o);
  const infos = { id, nom, version, date, adresse: ADRESSE, telechargement: `${ADRESSE}/${id}/${id}.zip`, changements: changementsDe(o) };
  const dossierSortie = join(SORTIE, id);
  mkdirSync(dossierSortie, { recursive: true });
  const entrees = fichiersDe(o.dossier).map(f => ({
    nom: `${id}/${relative(o.dossier, f).split(sep).join('/')}`, donnees: readFileSync(f), date: statSync(f).mtime,
  }));
  entrees.push({ nom: `${id}/version.json`, donnees: Buffer.from(JSON.stringify(infos, null, 2) + '\n'), date: new Date(date) });
  // Écrit à côté puis renommé : un téléchargement en cours ne voit jamais un zip à moitié écrit
  writeFileSync(join(dossierSortie, `${id}.zip.tmp`), zip(entrees));
  renameSync(join(dossierSortie, `${id}.zip.tmp`), join(dossierSortie, `${id}.zip`));
  writeFileSync(join(dossierSortie, 'version.json'), JSON.stringify(infos, null, 2) + '\n');
  if (existsSync(join(o.dossier, 'TUTO.pdf'))) copyFileSync(join(o.dossier, 'TUTO.pdf'), join(dossierSortie, 'TUTO.pdf'));
  const taille = (statSync(join(dossierSortie, `${id}.zip`)).size / 1048576).toFixed(1);
  cartes.push({ ...infos, taille, tuto: existsSync(join(dossierSortie, 'TUTO.pdf')) });
  console.log(`  ${id} : ${entrees.length} fichiers, ${taille} Mo, version ${version}`);
}

// ---------- La page de téléchargement ----------
const e = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dateFr = iso => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
const page = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Overlays Twitch — Téléchargements</title>
<style>
  :root { --fond: #101319; --carte: #1A1F29; --texte: #EEF1F5; --doux: #9AA4B2; --accent: #F5B82E; --trait: #2A3140; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--fond); color: var(--texte); font: 16px/1.55 system-ui, 'Segoe UI', sans-serif; }
  main { max-width: 1100px; margin: 0 auto; padding: 40px 16px 80px; }
  h1 { font-size: 40px; margin: 0 0 6px; }
  .intro { color: var(--doux); max-width: 70ch; margin: 0 0 30px; }
  .cartes { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
  .carte { background: var(--carte); border: 1px solid var(--trait); border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 12px; }
  .carte h2 { margin: 0; font-size: 26px; }
  .version { color: var(--doux); font-size: 14px; }
  .boutons { display: flex; flex-wrap: wrap; gap: 10px; }
  .boutons a { text-decoration: none; font-weight: 700; border-radius: 10px; padding: 10px 16px; border: 2px solid var(--accent); color: var(--texte); }
  .boutons a.principal { background: var(--accent); color: #111; }
  details { color: var(--doux); font-size: 14px; }
  summary { cursor: pointer; color: var(--texte); font-weight: 700; }
  details li { margin: 6px 0; }
  details b { color: var(--texte); }
  .aide { margin-top: 40px; background: var(--carte); border: 1px solid var(--trait); border-radius: 16px; padding: 22px; }
  .aide h2 { margin-top: 0; }
  .aide li { margin: 6px 0; }
  code { background: #0B0E13; padding: 1px 6px; border-radius: 4px; }
</style>
</head>
<body>
<main>
  <h1>Overlays Twitch</h1>
  <p class="intro">Les overlays de la famille, toujours dans leur dernière version. Tes réglages (fichier <code>mes-reglages.js</code>) ne sont jamais dans ces fichiers : une mise à jour ne les efface pas.</p>
  <div class="cartes">
${cartes.map(c => `    <section class="carte">
      <h2>${e(c.nom)}</h2>
      <div class="version">Version du ${e(dateFr(c.date))} · ${e(c.taille)} Mo</div>
      <div class="boutons"><a class="principal" href="${e(c.id)}/${e(c.id)}.zip" download>⬇️ Télécharger</a>${c.tuto ? `<a href="${e(c.id)}/TUTO.pdf">📘 Tuto</a>` : ''}</div>
      ${c.changements.length ? `<details><summary>Ce qui a changé</summary><ul>${c.changements.map(x => `<li><b>${e(x.date)}</b> — ${e(x.texte)}</li>`).join('')}</ul></details>` : ''}
    </section>`).join('\n')}
  </div>
  <section class="aide">
    <h2>Installer ou mettre à jour</h2>
    <ul>
      <li><b>Première fois</b> : télécharge le zip de ton overlay, décompresse-le où tu veux (ex. <code>Documents\\Overlay</code>), puis suis le tuto.</li>
      <li><b>Mettre à jour</b> : dans OBS › Outils › Scripts › script de l'overlay › <b>« Mettre à jour l'overlay »</b>. Ou double-clique sur <code>mettre-a-jour.cmd</code> dans le dossier de l'overlay.</li>
      <li>Avant chaque mise à jour, l'ancienne version est gardée dans le dossier <code>sauvegardes</code> de l'overlay.</li>
    </ul>
  </section>
</main>
</body>
</html>
`;
writeFileSync(join(SORTIE, 'index.html'), page);
console.log(`Page de téléchargement : ${join(SORTIE, 'index.html')} (${cartes.length} overlays)`);
