/* =====================================================================
   Serveur d'aperçu local SANS CACHE, pour travailler sur un overlay.
   Le serveur Python (http.server) laisse le navigateur resservir d'anciens
   SVG/JS après une modification ; celui-ci envoie « Cache-Control: no-store »,
   donc chaque rechargement affiche les fichiers tels qu'ils sont sur le disque.

   Utilisation :  node outils/serveur-apercu.mjs <port> <dossier de l'overlay>
   (lancé par .claude/launch.json ; inutile pour OBS, qui lit les fichiers locaux)
   ===================================================================== */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, extname, normalize } from 'node:path';

const PORT = Number(process.argv[2]) || 5500;
const RACINE = resolve(process.argv[3] || '.');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  '.webm': 'video/webm', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};

createServer(async (req, res) => {
  const envoyer = (code, corps, type = 'text/plain; charset=utf-8') => {
    res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(corps);
  };
  try {
    let chemin = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let fichier = normalize(join(RACINE, chemin));
    if (!fichier.startsWith(RACINE)) return envoyer(403, 'Interdit');
    if ((await stat(fichier)).isDirectory()) fichier = join(fichier, 'index.html');
    envoyer(200, await readFile(fichier), TYPES[extname(fichier).toLowerCase()] || 'application/octet-stream');
  } catch {
    envoyer(404, 'Introuvable');
  }
}).listen(PORT, () => console.log(`Aperçu sans cache : http://localhost:${PORT}/  (${RACINE})`));
