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
       node serveur/construire.mjs                   → sortie : /var/www/overlays/site
       SORTIE=C:\temp\site node serveur/construire.mjs
   Variables : SORTIE (dossier publié), ADRESSE (adresse publique du site, ex. https://overlays.bastien-lambour.fr).
   Node 18+, sans dépendance (le zip est écrit ici même, avec zlib).
   ===================================================================== */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, copyFileSync, renameSync } from 'node:fs';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { deflateRawSync } from 'node:zlib';
import vm from 'node:vm';

const DEPOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SORTIE = resolve(process.env.SORTIE || '/var/www/overlays/site');
const ADRESSE = (process.env.ADRESSE || 'https://overlays.bastien-lambour.fr').replace(/\/+$/, '');
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

// ---------- L'identité d'un overlay, pour sa carte sur la page : couleurs, police des titres, images ----------
// Tout est lu dans l'overlay lui-même (css/theme.css, assets/polices/, chaine/export/) : rien à recopier ici.
function identiteDe(o, dossierSortie) {
  const theme = existsSync(join(o.dossier, 'css', 'theme.css')) ? readFileSync(join(o.dossier, 'css', 'theme.css'), 'utf8') : '';
  const variable = (...noms) => { for (const n of noms) { const m = theme.match(new RegExp(`--${n}\\s*:\\s*([^;]+);`)); if (m) return m[1].trim(); } return ''; };
  const hex = v => (/^#[0-9a-f]{6}$/i.test(v) ? v : '');
  const id = { accent: hex(variable('accent')) || '#F5B82E', fond: hex(variable('fond')) || '#151A24', texte: hex(variable('texte', 'trait', 'blanc')) || '#F4F1EA' };
  // La police des titres : la première famille de --f-titre qui a son fichier dans assets/polices/
  const familles = variable('f-titre').split(',').map(f => f.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  for (const famille of familles) {
    const bloc = [...theme.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(m => m[1])
      .filter(b => new RegExp(`font-family:\\s*['"]?${famille.replace(/[.*+?^${}()|[\]\\]/g, '\\// ---------- Construction ----------')}['"]?\\s*;`).test(b));
    const url = bloc.map(b => (b.match(/url\(['"]?([^'")]+)['"]?\)/) || [])[1]).filter(Boolean).sort((a, b) => /-ext/.test(a) - /-ext/.test(b))[0];
    const fichier = url && join(o.dossier, 'css', url);
    if (fichier && existsSync(fichier)) { copyFileSync(fichier, join(dossierSortie, 'titre.woff2')); id.police = famille; break; }
  }
  // La bannière et la photo de profil Twitch (le kit de chaîne exporté)
  for (const [cle, nomFichier] of [['banniere', 'banniere.png'], ['profil', 'profil.png']]) {
    const f = join(o.dossier, 'chaine', 'export', nomFichier);
    if (existsSync(f)) { copyFileSync(f, join(dossierSortie, nomFichier)); id[cle] = nomFichier; }
  }
  // Texte du bouton lisible sur la couleur d'accent (clair ou foncé)
  const [r, g, b] = [1, 3, 5].map(i => parseInt(id.accent.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  id.surAccent = 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.35 ? '#111111' : '#FFFFFF';
  return id;
}

// ---------- Construction ----------
mkdirSync(SORTIE, { recursive: true });
const cartes = [];
for (const o of overlays) {
  const id = o.config.id, nom = o.config.nomChaine || id;
  const { version, date } = versionDe(o);
  const infos = { id, nom, version, date, adresse: ADRESSE, telechargement: `${ADRESSE}/${id}/${id}.zip`, changements: changementsDe(o, 15) };
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
  cartes.push({ ...infos, taille, tuto: existsSync(join(dossierSortie, 'TUTO.pdf')), ...identiteDe(o, dossierSortie) });
  console.log(`  ${id} : ${entrees.length} fichiers, ${taille} Mo, version ${version}`);
}

// ---------- La page de téléchargement ----------
const e = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dateFr = iso => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });
const heureFr = iso => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
const tailleFr = mo => String(mo).replace('.', ',') + ' Mo';
// Les lignes du journal sont écrites pour nous : pour la famille, on garde le début, sans le jargon
const resume = t => {
  let s = t.replace(/\s*→.*$/, '').replace(/^(Demandes?|Retours?|Bug signalé|Choix)\s*:\s*/i, '');
  if (s.length < 30) s = t;
  return s.length > 180 ? s.slice(0, 177).replace(/\s+\S*$/, '') + '…' : s;
};
// Les lignes qui parlent du serveur ou des outils (VPS, GitLab, Nginx…) ne concernent pas la famille
const TECHNIQUE = /\b(VPS|serveur|webhook|GitLab|GitHub|Nginx|DNS|certificat|installer\.sh|construire\.mjs|LISEZMOI|CLAUDE\.md|ffmpeg)\b/i;
for (const c of cartes) c.nouveautes = c.changements.filter(x => !TECHNIQUE.test(x.texte)).slice(0, 5);
const polices = cartes.filter(c => c.police).map(c =>
  `@font-face { font-family: 'Titre ${e(c.id)}'; src: url('${e(c.id)}/titre.woff2') format('woff2'); font-display: swap; }`).join('\n  ');

const carte = c => `
    <article class="carte" style="--a:${c.accent};--sur-a:${c.surAccent};--f:${c.fond};--t:${c.texte}">
      <div class="banniere">${c.banniere ? `<img src="${e(c.id)}/${c.banniere}" alt="">` : ''}</div>
      <div class="corps">
        <div class="tete">
          ${c.profil ? `<img class="profil" src="${e(c.id)}/${c.profil}" alt="">` : `<span class="profil vide">${e(c.nom.slice(0, 1))}</span>`}
          <div>
            <h2 style="${c.police ? `font-family:'Titre ${e(c.id)}',var(--police)` : ''}">${e(c.nom)}</h2>
            <p class="version"><span class="pastille" data-date="${e(c.date)}"></span>Mis à jour le ${e(dateFr(c.date))} à ${e(heureFr(c.date))}</p>
          </div>
        </div>
        <div class="boutons">
          <a class="telecharger" href="${e(c.id)}/${e(c.id)}.zip" download>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16"/></svg>
            Télécharger <span>${e(tailleFr(c.taille))}</span></a>
          ${c.tuto ? `<a class="tuto" href="${e(c.id)}/TUTO.pdf">Le tuto (PDF)</a>` : ''}
        </div>
        ${c.nouveautes.length ? `<details>
          <summary>Ce qui a changé</summary>
          <ol>${c.nouveautes.map(x => `<li><time>${e(new Date(x.date + 'T12:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }))}</time><span>${e(resume(x.texte))}</span></li>`).join('')}</ol>
        </details>` : ''}
      </div>
    </article>`;

const page = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Les overlays de la famille</title>
<meta name="description" content="Les overlays Twitch de la famille : télécharger, installer, mettre à jour.">
<style>
  ${polices}
  :root {
    --police: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --fond: #F4F2EE; --carte: #FFFFFF; --texte: #1B1D22; --doux: #5D6370; --trait: #E3E0D9; --etape: #FFFFFF;
    color-scheme: light;
  }
  @media (prefers-color-scheme: dark) {
    :root { --fond: #0F1115; --carte: #171A20; --texte: #EEF0F4; --doux: #9AA2B1; --trait: #262A33; --etape: #171A20; color-scheme: dark; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--fond); color: var(--texte); font: 16px/1.55 var(--police); -webkit-font-smoothing: antialiased; }
  main { max-width: 1180px; margin: 0 auto; padding: 56px 16px 80px; }

  header { max-width: 760px; margin-bottom: 40px; }
  header h1 { font-size: clamp(32px, 5vw, 48px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 12px; }
  header p { color: var(--doux); font-size: 18px; margin: 0; }

  .etapes { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 0 0 44px; padding: 0; list-style: none; counter-reset: etape; }
  .etapes li { background: var(--etape); border: 1px solid var(--trait); border-radius: 14px; padding: 16px 18px 16px 58px; position: relative; counter-increment: etape; }
  .etapes li::before { content: counter(etape); position: absolute; left: 16px; top: 16px; width: 28px; height: 28px; border-radius: 50%;
    background: var(--texte); color: var(--fond); font-weight: 700; display: grid; place-items: center; font-size: 15px; }
  .etapes b { display: block; }
  .etapes span { color: var(--doux); font-size: 14px; }
  .etapes .plus { display: inline; color: var(--texte); }
  .etapes code { white-space: nowrap; }
  @media (max-width: 1000px) { .etapes { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

  .cartes { display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 440px), 1fr)); align-items: start; }
  .carte { background: var(--f); color: var(--t); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 12px 32px -16px rgba(0,0,0,.35); }
  .banniere { aspect-ratio: 1200 / 480; background: color-mix(in srgb, var(--a) 25%, var(--f)); }
  .banniere img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .corps { padding: 18px 22px 22px; display: flex; flex-direction: column; gap: 18px; flex: 1; }
  .tete { display: flex; gap: 14px; align-items: center; }
  .profil { width: 60px; height: 60px; border-radius: 50%; flex: none; object-fit: cover; background: var(--f);
    border: 3px solid var(--f); box-shadow: 0 0 0 2px var(--a); }
  .profil.vide { display: grid; place-items: center; font-size: 28px; font-weight: 800; color: var(--a); }
  .tete > div { min-width: 0; }
  .carte h2 { margin: 0; font-size: 28px; line-height: 1.1; font-weight: 400; }
  .version { margin: 4px 0 0; font-size: 14px; flex-wrap: wrap; color: color-mix(in srgb, var(--t) 70%, transparent); display: flex; align-items: center; gap: 8px; }
  .pastille:empty { display: none; }
  .pastille { font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 99px; background: var(--a); color: var(--sur-a); }

  .boutons { display: flex; flex-wrap: wrap; gap: 10px; }
  .boutons a { text-decoration: none; font-weight: 700; border-radius: 12px; padding: 12px 18px; display: inline-flex; align-items: center; gap: 8px; }
  .telecharger { background: var(--a); color: var(--sur-a); flex: 1; justify-content: center; }
  .telecharger span { font-weight: 500; opacity: .75; }
  .telecharger svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
  .tuto { color: var(--t); border: 2px solid color-mix(in srgb, var(--t) 30%, transparent); }
  .boutons a:hover { filter: brightness(1.08); }
  .boutons a:focus-visible, summary:focus-visible { outline: 3px solid var(--a); outline-offset: 2px; }

  details { border-top: 1px solid color-mix(in srgb, var(--t) 15%, transparent); padding-top: 14px; }
  summary { cursor: pointer; font-weight: 700; font-size: 15px; list-style: none; display: flex; justify-content: space-between; }
  summary::-webkit-details-marker { display: none; }
  summary::after { content: "+"; font-size: 20px; line-height: 1; color: var(--a); }
  details[open] summary::after { content: "–"; }
  details ol { list-style: none; margin: 12px 0 0; padding: 0; display: grid; gap: 10px; }
  details li { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 10px; font-size: 14px; color: color-mix(in srgb, var(--t) 80%, transparent); }
  details li span { overflow-wrap: anywhere; }
  details time { font-weight: 700; color: var(--a); white-space: nowrap; }

  .aide { margin-top: 48px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; color: var(--doux); font-size: 15px; }
  .aide h3 { color: var(--texte); font-size: 16px; margin: 0 0 6px; }
  .aide p { margin: 0; }
  code { font-family: ui-monospace, Consolas, monospace; font-size: .92em; background: color-mix(in srgb, var(--texte) 8%, transparent); padding: 1px 5px; border-radius: 5px; }

  @media (max-width: 760px) {
    main { padding-top: 32px; }
    .etapes { grid-template-columns: 1fr; }
    .cartes { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<main>
  <header>
    <h1>Les overlays de la famille</h1>
    <p>Chaque chaîne a le sien, toujours dans sa dernière version. Tes réglages ne sont jamais dans ces fichiers : une mise à jour ne les efface pas.</p>
  </header>

  <ol class="etapes">
    <li><b>Télécharge ton overlay</b><span>Le bouton de ta chaîne, ci-dessous.</span></li>
    <li><b>Décompresse-le</b><span>Où tu veux, par exemple dans Documents, puis suis le tuto pour les scènes.</span></li>
    <li><b>Ajoute le script dans OBS</b><span>Outils › Scripts › <b class="plus">+</b> › choisis <code>outils/actualiser-obs.lua</code>, dans le dossier de ton overlay. Une seule fois.</span></li>
    <li><b>Ensuite, mets à jour d'un clic</b><span>Dans cette même fenêtre : « Mettre à jour l'overlay ». Tes réglages sont gardés.</span></li>
  </ol>

  <div class="cartes">${cartes.map(carte).join('')}
  </div>

  <section class="aide">
    <div><h3>Déjà installé ?</h3><p>Pas besoin de revenir ici : le bouton <b>Mettre à jour l'overlay</b> du script OBS installe la nouvelle version tout seul. Sans OBS ouvert : double-clic sur <code>mettre-a-jour.cmd</code> dans ton dossier.</p></div>
    <div><h3>Tes réglages restent</h3><p>Textes, couleurs, sons, position de la cam : tout est dans <code>mes-reglages.js</code>, que les mises à jour ne touchent jamais.</p></div>
    <div><h3>Un fichier modifié à la main ?</h3><p>Avant chaque mise à jour, l'ancienne version est rangée dans le dossier <code>sauvegardes</code> de ton overlay.</p></div>
  </section>
</main>
<script>
  // « Nouveau » sur les versions de moins de 3 jours
  document.querySelectorAll('.pastille').forEach(p => {
    if (Date.now() - new Date(p.dataset.date) < 3 * 864e5) p.textContent = 'Nouveau';
  });
</script>
</body>
</html>
`;
writeFileSync(join(SORTIE, 'index.html'), page);
console.log(`Page de téléchargement : ${join(SORTIE, 'index.html')} (${cartes.length} overlays)`);
