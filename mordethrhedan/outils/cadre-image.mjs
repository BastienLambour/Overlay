/* =====================================================================
   MORDETHRHEDAN — Fabrique le cadre néon (sources/cadre.html) en IMAGE PNG,
   fond transparent, à la taille voulue : à poser dans OBS comme une simple
   source Image (plus léger qu'une source Navigateur), ou à utiliser ailleurs.

   Utilisation (dans le dossier de l'overlay) :
       node outils/cadre-image.mjs                 → intérieur 400 × 400
       node outils/cadre-image.mjs 380x290         → intérieur 380 × 290 (taille de ce qu'on encadre)
       node outils/cadre-image.mjs 380x290 verre   → intérieur fumé

   Résultat : assets/cadres/cadre-380x290.png (… -verre.png). L'image est plus grande que
   l'intérieur (MARGE de chaque côté, pour le trait et le halo) : dans OBS, place-la
   MARGE px plus haut et plus à gauche que ce qu'elle encadre.
   Couleur et halo : ceux de l'overlay (reglages.html › Couleur et fond) ; à refaire si on les change.
   ===================================================================== */
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MARGE = 50;
const args = process.argv.slice(2);
const [l, h] = ((args.find(a => /^\d+x\d+$/i.test(a)) || '400x400').toLowerCase().split('x')).map(Number);
const verre = args.includes('verre');
// La page est dessinée en 1920 × 1080 : le cadre (avec sa marge) doit y tenir
if (!l || !h || l + 2 * MARGE > 1920 || h + 2 * MARGE > 1080) { console.error(`Taille impossible : au plus ${1920 - 2 * MARGE}x${1080 - 2 * MARGE}.`); process.exit(1); }
const fichier = `assets/cadres/cadre-${l}x${h}${verre ? '-verre' : ''}.png`;

const r = spawnSync(process.execPath, [join(RACINE, 'outils', 'capturer.mjs'),
  `sources/cadre.html?x=${MARGE}&y=${MARGE}&l=${l}&h=${h}${verre ? '&verre=1' : ''}`,
  `--decoupe=0,0,${l + 2 * MARGE},${h + 2 * MARGE}`, '--transparent', `--fichier=${fichier}`], { stdio: 'inherit' });
if (r.status === 0) console.log(`\nImage : ${fichier}  (${l + 2 * MARGE} × ${h + 2 * MARGE} ; intérieur ${l} × ${h} à ${MARGE} px du bord)`);
process.exit(r.status ?? 1);
