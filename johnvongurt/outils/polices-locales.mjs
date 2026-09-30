/* =====================================================================
   Rend les polices LOCALES : l'overlay n'a plus besoin d'internet pour s'écrire
   (OBS sans connexion, PDF, kit de chaîne…).

   Utilisation (dans le dossier de l'overlay, une seule fois) :
       node outils/polices-locales.mjs

   Ce que ça fait :
     1. lit l'@import Google Fonts de css/theme.css ;
     2. télécharge les fichiers .woff2 (alphabets latin et latin étendu) dans assets/polices/ ;
     3. remplace l'@import par des @font-face qui pointent vers ces fichiers
        (l'ancienne ligne reste en commentaire, pour mémoire).
   Les polices Google Fonts sont sous licence libre (SIL OFL ou Apache) : on peut les copier.
   Sans @import Google dans theme.css, le script ne fait rien.

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const THEME = join(RACINE, 'css', 'theme.css');
const DOSSIER = join(RACINE, 'assets', 'polices');
const SOUS_ENSEMBLES = ['latin', 'latin-ext'];           // le français et les accents d'Europe
// Un navigateur récent : Google renvoie alors des fichiers .woff2 découpés par alphabet
const NAVIGATEUR = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const theme = readFileSync(THEME, 'utf8');
const imports = theme.match(/@import url\(['"]?(https:\/\/fonts\.googleapis\.com\/[^'")]+)['"]?\);[^\n]*\n?/g) || [];
if (!imports.length) { console.log('Aucune police Google Fonts dans css/theme.css : rien à faire.'); process.exit(0); }

const nomFichier = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
mkdirSync(DOSSIER, { recursive: true });
let texte = theme;

for (const ligne of imports) {
  const url = ligne.match(/https:\/\/fonts\.googleapis\.com\/[^'")]+/)[0];
  const css = await (await fetch(url, { headers: { 'User-Agent': NAVIGATEUR } })).text();
  // Chaque bloc : /* latin */ @font-face { font-family; font-style; font-weight; src: url(…); unicode-range }
  const blocs = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g)]
    .map(([, sous, corps]) => ({ sous, corps, prop: p => (corps.match(new RegExp(`${p}:\\s*([^;]+);`)) || [])[1]?.trim() }))
    .filter(b => SOUS_ENSEMBLES.includes(b.sous));
  // Les blocs qui partagent le même fichier (police « variable ») n'en font qu'un, avec une plage de graisses
  const groupes = new Map();
  for (const b of blocs) {
    const fichier = b.prop('src').match(/url\(([^)]+)\)/)[1];
    const g = groupes.get(fichier) || { ...b, fichier, poids: [] };
    g.poids.push(...String(b.prop('font-weight')).split(/\s+/).map(Number));
    groupes.set(fichier, g);
  }
  const faces = [];
  for (const g of groupes.values()) {
    const famille = g.prop('font-family').replace(/['"]/g, '');
    const style = g.prop('font-style') || 'normal';
    const min = Math.min(...g.poids), max = Math.max(...g.poids);
    const poids = min === max ? String(min) : `${min} ${max}`;
    const nom = `${nomFichier(famille)}${min === max && min !== 400 ? '-' + min : ''}${style === 'italic' ? '-italique' : ''}-${g.sous}.woff2`;
    const donnees = Buffer.from(await (await fetch(g.fichier, { headers: { 'User-Agent': NAVIGATEUR } })).arrayBuffer());
    writeFileSync(join(DOSSIER, nom), donnees);
    console.log(`  ${nom}  (${Math.round(donnees.length / 1024)} Ko)`);
    faces.push(`@font-face {
  font-family: '${famille}'; font-style: ${style}; font-weight: ${poids}; font-display: swap;
  src: url('../assets/polices/${nom}') format('woff2');
  unicode-range: ${g.prop('unicode-range')};
}`);
  }
  texte = texte.replace(ligne, `/* Polices LOCALES (assets/polices/, licences libres Google Fonts) : l'overlay n'a plus besoin d'internet pour s'écrire.
   Refaites par : node outils/polices-locales.mjs — ancienne ligne, pour mémoire :
   ${ligne.trim().replace(/\*\//g, '* /')} */
${faces.join('\n')}
`);
}
writeFileSync(THEME, texte);
console.log('css/theme.css : polices locales en place.');
