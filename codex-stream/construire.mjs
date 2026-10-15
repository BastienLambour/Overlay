/* =====================================================================
   Assemble la boîte à outils : src/*.js → dist/codex-stream.js (UN module ES, sans dépendance),
   avec son numéro de version en tête. dist/ est ce qu'on livre à CodexVTT (codex-web/public/stream/),
   avec dist/socket.io.min.js et les pages de widgets/.
   Et la version CLASSIQUE (un <script> ordinaire : marche en fichiers locaux, file://, comme dans OBS) pour les overlays
   de la famille : ../_modele/js/codex-stream.js, recopiée dans chaque overlay qui a une scène JDR.
     node construire.mjs
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const lire = f => readFileSync(join(ICI, f), 'utf8');
let empreinte = 'local';
try { empreinte = execSync('git log -1 --format=%h', { cwd: ICI }).toString().trim(); } catch {}
const VERSION = `${new Date().toISOString().slice(0, 10)}-${empreinte}`;

const morceaux = ['src/apparence.js', 'src/exemples.js', 'src/filtres.js', 'src/squelette.js', 'src/arene.js', 'src/scenette.js', 'src/coeur.js'];
// Le moteur des gestes du squelette (src/squelette.css) : embarqué dans le module (posé par Squelette.poserStyle), et en fichier CSS
// (dist/squelette.css ; ../_modele/css/squelette.css pour les pages des overlays qui animent le bouffon sans charger la boîte à outils)
const CSS = lire('src/squelette.css');
const embarque = `const SQUELETTE_CSS = ${JSON.stringify(CSS)};
`;
const texte = `/* =====================================================================
   CODEX-STREAM ${VERSION} — la boîte à outils de stream de CodexVTT.
   FICHIER ASSEMBLÉ par codex-stream/construire.mjs (G:\\Projets\\Overlay\\codex-stream) : ne pas le modifier ici.
     import { CodexStream } from './codex-stream.js';   (mode d'emploi : LISEZMOI.md)
   ===================================================================== */
const VERSION = '${VERSION}';
const window = typeof globalThis.window !== 'undefined' ? globalThis.window : globalThis;   // (pour les tests sous Node)
${embarque}${morceaux.map(f => `\n// ----- ${f} -----\n` + lire(f)).join('\n')}
export { CodexStream, Apparence, Filtres, Squelette, Arene, VERSION };
export default CodexStream;
`;
mkdirSync(join(ICI, 'dist'), { recursive: true });
writeFileSync(join(ICI, 'dist', 'codex-stream.js'), texte);

// --- La version classique : pas d'export, pas d'import.meta (le dossier du script vient de document.currentScript) ---
const classique = `/* =====================================================================
   CODEX-STREAM ${VERSION} — la boîte à outils de stream de CodexVTT, version CLASSIQUE (un <script> ordinaire).
   FICHIER ASSEMBLÉ par codex-stream/construire.mjs (G:\\Projets\\Overlay\\codex-stream) : ne pas le modifier ici.
   Donne les objets globaux CodexStream, Apparence, Filtres, Scenette (et window.PERSOS, le catalogue provisoire).
   Les overlays s'en servent pour DESSINER les personnages : CodexStream.fiche(perso), CodexStream.dessiner(fiche, { filtre… }),
   CodexStream.Scenette.jouer(…). FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
const VERSION = '${VERSION}';
const BASE_SCRIPT = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || (typeof location !== 'undefined' ? location.href : '');
${embarque}${morceaux.map(f => `\n// ----- ${f} -----\n` + lire(f)).join('\n')}
`.replace("typeof import.meta !== 'undefined' ? import.meta.url : location.href", 'BASE_SCRIPT');
if (classique.includes('import.meta')) throw new Error('import.meta reste dans la version classique');
writeFileSync(join(ICI, '..', '_modele', 'js', 'codex-stream.js'), classique);
cpSync(join(ICI, 'widgets'), join(ICI, 'dist'), { recursive: true });
writeFileSync(join(ICI, 'dist', 'squelette.css'), CSS);
mkdirSync(join(ICI, '..', '_modele', 'css'), { recursive: true });
writeFileSync(join(ICI, '..', '_modele', 'css', 'squelette.css'), CSS);
console.log(`dist/codex-stream.js  (version ${VERSION}, ${Math.round(texte.length / 1024)} Ko) + widgets ; _modele/js/codex-stream.js (classique)`);
