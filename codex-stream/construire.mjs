/* =====================================================================
   Assemble la boîte à outils : src/*.js → dist/codex-stream.js (UN module ES, sans dépendance),
   avec son numéro de version en tête. dist/ est ce qu'on livre à CodexVTT (codex-web/public/stream/),
   avec dist/socket.io.min.js et les pages de widgets/.
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

const morceaux = ['src/apparence.js', 'src/exemples.js', 'src/filtres.js', 'src/scenette.js', 'src/coeur.js'];
const texte = `/* =====================================================================
   CODEX-STREAM ${VERSION} — la boîte à outils de stream de CodexVTT.
   FICHIER ASSEMBLÉ par codex-stream/construire.mjs (G:\\Projets\\Overlay\\codex-stream) : ne pas le modifier ici.
     import { CodexStream } from './codex-stream.js';   (mode d'emploi : LISEZMOI.md)
   ===================================================================== */
const VERSION = '${VERSION}';
const window = typeof globalThis.window !== 'undefined' ? globalThis.window : globalThis;   // (pour les tests sous Node)
${morceaux.map(f => `\n// ----- ${f} -----\n` + lire(f)).join('\n')}
export { CodexStream, Apparence, Filtres, VERSION };
export default CodexStream;
`;
mkdirSync(join(ICI, 'dist'), { recursive: true });
writeFileSync(join(ICI, 'dist', 'codex-stream.js'), texte);
cpSync(join(ICI, 'widgets'), join(ICI, 'dist'), { recursive: true });
console.log(`dist/codex-stream.js  (version ${VERSION}, ${Math.round(texte.length / 1024)} Ko) + widgets`);
