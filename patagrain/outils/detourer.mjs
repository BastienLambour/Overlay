// =====================================================================
// DÉTOURER — retire le faux fond « damier » que les IA d'images dessinent
// à la place de la transparence, et enregistre une vraie image transparente (WebP).
//   node outils/detourer.mjs <image> <sortie.webp> [--tolerance=30] [--silhouette=<image détourée>]
// Comment :
//  - les deux teintes du damier sont lues sur le bord de l'image ;
//  - en partant des bords, on efface les pixels gris de la luminosité du damier, sans traverser le personnage
//    (limite : un objet gris collé au fond, comme une lame d'acier, peut partir avec lui) ;
//  - les petits restes isolés sont effacés ;
//  - léger fondu sur le contour.
//  --silhouette=<autre.webp> : reprend la transparence d'une image déjà détourée (même cadrage),
//  par exemple la version « bouche ouverte » d'un portrait prend la silhouette de la version normale.
// Utilise ffmpeg (G:\Applications\ffmpeg\bin\ffmpeg.exe, ou celui du PATH) pour lire et écrire.
// =====================================================================
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const args = process.argv.slice(2);
const option = nom => (args.find(a => a.startsWith(`--${nom}=`)) || '').split('=').slice(1).join('=');
const [entree, sortie] = args.filter(a => !a.startsWith('--'));
if (!entree || !sortie) { console.log('Usage : node outils/detourer.mjs <image> <sortie.webp> [--tolerance=30] [--silhouette=<image détourée>]'); process.exit(1); }
const FFMPEG = ['G:/Applications/ffmpeg/bin/ffmpeg.exe'].find(existsSync) || 'ffmpeg';
const TOL = Number(option('tolerance') || 30);

function lire(fichier, format, octets) {
  const info = spawnSync(FFMPEG, ['-hide_banner', '-i', fichier], { encoding: 'utf8' }).stderr;
  const [, L, H] = info.match(/, (\d{2,5})x(\d{2,5})/).map(Number);
  const donnees = spawnSync(FFMPEG, ['-v', 'error', '-i', fichier, '-f', 'rawvideo', '-pix_fmt', format, '-'], { maxBuffer: 1 << 28 }).stdout;
  if (donnees.length !== L * H * octets) throw new Error(`lecture de ${fichier} incomplète`);
  return { L, H, donnees };
}
const { L, H, donnees: brut } = lire(entree, 'rgb24', 3);
const N = L * H;
const lum = i => (brut[i * 3] + brut[i * 3 + 1] + brut[i * 3 + 2]) / 3;
const sat = i => Math.max(brut[i * 3], brut[i * 3 + 1], brut[i * 3 + 2]) - Math.min(brut[i * 3], brut[i * 3 + 1], brut[i * 3 + 2]);
const efface = new Uint8Array(N);

if (option('silhouette')) {
  // --- la silhouette d'une autre image (même cadrage) ---
  const autre = lire(option('silhouette'), 'rgba', 4);
  if (autre.L !== L || autre.H !== H) throw new Error('la silhouette n\'a pas la même taille');
  for (let i = 0; i < N; i++) efface[i] = autre.donnees[i * 4 + 3] < 128 ? 1 : 0;
  console.log(`${entree} : ${L}×${H}, silhouette reprise de ${option('silhouette')}`);
} else {
  // --- les deux teintes du damier : les deux gris les plus fréquents du bord ---
  const bord = [];
  for (let x = 0; x < L; x++) bord.push(x, (H - 1) * L + x);
  for (let y = 1; y < H - 1; y++) bord.push(y * L, y * L + L - 1);
  const compte = new Map();
  for (const i of bord) if (sat(i) <= 20) { const k = Math.round(lum(i) / 8); compte.set(k, (compte.get(k) || 0) + 1); }
  const [ta, tb] = [...compte.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k * 8);
  const bas = Math.min(ta, tb ?? ta), haut = Math.max(ta, tb ?? ta);
  console.log(`${entree} : ${L}×${H}, damier ${bas}/${haut}`);
  // un pixel « de fond » : gris, et de la luminosité du damier (ou entre ses deux teintes : traits, volutes de fumée)
  const fond = i => sat(i) <= TOL * .8 && lum(i) >= bas - TOL && lum(i) <= haut + TOL;

  // --- effacer en partant des bords (remplissage par voisinage) ---
  const pile = bord.filter(fond);
  pile.forEach(i => { efface[i] = 1; });
  while (pile.length) {
    const i = pile.pop(), x = i % L;
    for (const j of [x > 0 ? i - 1 : -1, x < L - 1 ? i + 1 : -1, i - L, i + L]) {
      if (j < 0 || j >= N || efface[j] || !fond(j)) continue;
      efface[j] = 1; pile.push(j);
    }
  }
  // --- nettoyage : les petits îlots gardés au milieu du fond partent, les petits trous du personnage sont rebouchés ---
  function zones(valeur, maxi, remplace) {
    const vu = new Uint8Array(N);
    for (let d = 0; d < N; d++) {
      if (vu[d] || efface[d] !== valeur) continue;
      const zone = [d]; vu[d] = 1;
      for (let k = 0; k < zone.length && zone.length <= maxi; k++) {
        const i = zone[k], x = i % L;
        for (const j of [x > 0 ? i - 1 : -1, x < L - 1 ? i + 1 : -1, i - L, i + L])
          if (j >= 0 && j < N && !vu[j] && efface[j] === valeur) { vu[j] = 1; zone.push(j); }
      }
      if (zone.length <= maxi) zone.forEach(i => { efface[i] = remplace; });
    }
  }
  zones(0, N * .002, 1);       // îlots de « personnage » minuscules = restes du fond
  // (pas de rebouchage des « trous » : des cases du damier coupées par une bande grise passeraient pour des trous)
}

// --- image RVBA : fond transparent, contour adouci ---
const rgba = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  brut.copy(rgba, i * 4, i * 3, i * 3 + 3);
  if (efface[i]) { rgba[i * 4 + 3] = 0; continue; }
  const x = i % L;
  let vides = 0;
  for (const j of [x > 0 ? i - 1 : i, x < L - 1 ? i + 1 : i, i >= L ? i - L : i, i + L < N ? i + L : i]) vides += efface[j];
  rgba[i * 4 + 3] = vides ? 255 - vides * 45 : 255;
}

// --- enregistrer en WebP avec transparence ---
const r = spawnSync(FFMPEG, ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${L}x${H}`, '-i', '-',
  '-c:v', 'libwebp', '-lossless', '0', '-quality', '92', '-pix_fmt', 'yuva420p', sortie], { input: rgba });
if (r.status) { console.error(String(r.stderr)); process.exit(1); }
console.log(`  → ${sortie} (${Math.round(efface.reduce((a, b) => a + b, 0) / N * 100)} % effacé)`);
