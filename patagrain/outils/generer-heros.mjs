/* =====================================================================
   Génère LES HÉROS de la scène JDR (Node, sans dépendance), dans le style du bouffon
   et sur SON squelette : mêmes articulations, mêmes classes (bf-tout, bf-epaule-d, bf-coude-d,
   bf-hanche-g, bf-haut, bf-tete…), donc tous les gestes de css/bouffon.css marchent pour eux
   (marcher, sauter, tomber, attaquer, lancer…).

   Utilisation (dans le dossier patagrain) :
       node outils/generer-heros.mjs
   Produit :
     js/heros.js     Heros.svg(id, 'buste' | 'tete' | 'pied', { expression })
                     id : mj (Patagrain en maître du jeu, sans chapeau), zokhran, namerya, kenai, trayss, baheng, dvergrost,
                          aventurier (le personnage sans dessin, encapuchonné, à la couleur de sa carte)
   Expressions (classe « expr-… » sur le dessin) : rire, choc, dort, mechant, ko (à terre : yeux fermés, bandage).
   Bouche qui parle : .bf-bouche-parle (la page l'alterne avec .bf-bouche quand le joueur parle).
   ===================================================================== */
import { writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const g = v => String(Number(v.toPrecision(6)));
const miroir = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${g(400 - parseFloat(x))} ${y}`);
const rond = (x, y, r) => `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
const P = (d, fill, plus = '') => `<path d="${d}" fill="${fill}" ${plus}/>`;
const T = (d, stroke, w, plus = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${plus}/>`;

// ---------- le visage commun (celui du bouffon) ----------
const VISAGE = 'M200 150 C244 150 262 182 262 228 C262 282 236 322 200 326 C164 322 138 282 138 228 C138 182 156 150 200 150 Z';
const OMBRE_JOUE = 'M236 172 C254 190 262 214 260 240 C258 276 240 306 214 322 C236 298 248 268 246 236 C244 208 240 188 236 172 Z';
const NEZ = 'M199 234 C197 252 193 261 190 267 C196 271 205 271 210 267';
const CHEVEUX_DOS = 'M200 118 C128 118 104 176 106 250 C108 320 106 380 102 432 L298 432 C294 380 292 320 294 250 C296 176 272 118 200 118 Z';
const MECHE_G = 'M200 132 C160 134 132 160 128 210 C124 260 126 320 121 372 C118 398 119 416 123 432 L160 432 C156 404 152 370 150 330 C148 280 146 230 152 200 C160 172 178 152 200 148 Z';
const OREILLE_POINTUE = 'M146 232 L98 190 L110 212 L142 266 Z';
const OREILLE_LONGUE = 'M146 236 L108 206 L118 224 L142 262 Z';

// ---------- les expressions (mêmes noms que le bouffon, + parle, ko) ----------
function expressions(h) {
  const brun = h.bouche || '#7A2E2E';
  const [yg, yd] = h.yeux || [[173, 227], [227, 227]];
  const [bx, by] = h.boucheXY || [200, 302];
  return `
      ${T(`M${yg[0] - 9} ${yg[1] + 1} Q${yg[0]} ${yg[1] + 7} ${yg[0] + 9} ${yg[1] + 1} M${yd[0] - 9} ${yd[1] + 1} Q${yd[0]} ${yd[1] + 7} ${yd[0] + 9} ${yd[1] + 1}`, '#1b1b1b', 3.5, 'class="bf-expr bf-yeux-dort"')}
      ${T(`M${yg[0] - 9} ${yg[1] + 4} Q${yg[0]} ${yg[1] - 8} ${yg[0] + 9} ${yg[1] + 4} M${yd[0] - 9} ${yd[1] + 4} Q${yd[0]} ${yd[1] - 8} ${yd[0] + 9} ${yd[1] + 4}`, '#1b1b1b', 3.5, 'class="bf-expr bf-yeux-rire"')}
      <g class="bf-expr bf-bouche-rire">${P(`M${bx - 14} ${by - 4} Q${bx} ${by + 24} ${bx + 14} ${by - 4} Z`, brun)}${P(`M${bx - 11} ${by - 3} H${bx + 11} L${bx + 9} ${by + 2} H${bx - 9} Z`, '#fff')}</g>
      ${P(rond(bx, by + 6, 8), brun, 'class="bf-expr bf-bouche-o"')}
      <g class="bf-expr bf-bouche-parle">${P(`M${bx - 13} ${by - 4} Q${bx} ${by - 7} ${bx + 13} ${by - 4} Q${bx + 10} ${by + 16} ${bx} ${by + 18} Q${bx - 10} ${by + 16} ${bx - 13} ${by - 4} Z`, brun)}${P(`M${bx - 10} ${by - 3} Q${bx} ${by - 5} ${bx + 10} ${by - 3} L${bx + 9} ${by} Q${bx} ${by - 2} ${bx - 9} ${by} Z`, '#F4ECE0')}</g>
      ${T(`M${bx - 10} ${by + 2} Q${bx - 3} ${by - 1} ${bx} ${by + 2} Q${bx + 3} ${by + 5} ${bx + 10} ${by + 2}`, brun, 3.5, 'class="bf-expr bf-bouche-ko"')}
      <g class="bf-expr bf-bandage" transform="rotate(-16 200 ${h.front || 178})">${P(`M156 ${(h.front || 178) - 9} h88 a9 9 0 0 1 0 18 h-88 a9 9 0 0 1 0 -18 Z`, '#EFE4CF', 'stroke="#BFAF92" stroke-width="2"')}
        ${T(`M186 ${(h.front || 178) - 9} v18 M214 ${(h.front || 178) - 9} v18`, '#CDBD9F', 2.5)}${P(rond(230, h.front || 178, 3.5), '#B33A3A')}</g>`;
}

// ---------- les yeux (ronds comme le bouffon, ou fendus pour Trayss) ----------
function yeux(h) {
  const [yg, yd] = h.yeux || [[173, 227], [227, 227]];
  if (h.oeilFendu) {
    const oeil = ([x, y], cote) => `<g class="bf-oeil-${cote}">${P(`M${x - 13} ${y} Q${x} ${y - 11} ${x + 13} ${y + 1} Q${x} ${y + 9} ${x - 13} ${y} Z`, h.blancOeil || '#F3E6FF')}
      ${P(`M${x - 2} ${y - 7} L${x + 2} ${y - 7} L${x + 1.5} ${y + 7} L${x - 1.5} ${y + 7} Z`, '#1b0a2a')}</g>`;
    return P(rond(yg[0], yg[1], 16) + ' ' + rond(yd[0], yd[1], 16), h.lueur, 'opacity=".35"') + oeil(yg, 'g') + oeil(yd, 'd');
  }
  const r = h.tailleOeil || 1;
  const oeil = ([x, y], cote, dx) => `<g class="bf-oeil-${cote}"><ellipse cx="${x}" cy="${y}" rx="${9 * r}" ry="${6.2 * r}" fill="#fff"/><circle cx="${x + dx}" cy="${y}" r="${4.8 * r}" fill="${h.iris}"/><circle cx="${x + dx}" cy="${y}" r="${2 * r}" fill="#1b1b1b"/></g>`;
  return oeil(yg, 'g', 1) + oeil(yd, 'd', -1);
}

// ---------- la tête complète ----------
function tete(h) {
  const visage = h.visage || VISAGE;
  return `<g class="bf-tete">
      ${h.oreillesDerriere || ''}
      ${P(visage, h.peau)}
      ${P(h.ombreJoue || OMBRE_JOUE, h.peauOmbre, 'opacity=".55"')}
      ${h.surVisage || ''}
      ${yeux(h)}
      <g class="bf-sourcils">${h.sourcils}</g>
      ${h.nez || T(NEZ, h.peauOmbre, 3.5)}
      ${h.barbe || ''}
      ${T(h.boucheTrait || 'M189 302 Q200 310 211 302', h.bouche ? h.bouche : '#B4655C', 4, 'class="bf-bouche"')}
      ${h.devant || ''}
      ${expressions(h)}
    </g>
    ${h.cheveuxDevant || ''}
    ${h.oreilles || ''}
    ${h.coiffe || ''}`;
}

// ---------- le corps articulé (comme le bouffon en pied) ----------
function bras(cote, h, objet = '') {
  const x = cote === 'g' ? 116 : 284;
  return `<g class="bf-epaule-${cote}" style="transform-origin:${x}px 392px">
      <rect fill="${h.manche}" x="${x - 15}" y="380" width="30" height="96" rx="15"/>
      <g class="bf-coude-${cote}" style="transform-origin:${x}px 470px">
        <rect fill="${h.manche2 || h.manche}" x="${x - 13}" y="462" width="26" height="86" rx="13"/>
        <rect fill="${h.poignet}" x="${x - 14}" y="530" width="28" height="9" rx="4"/>
        ${objet}
        <circle cx="${x}" cy="552" r="15" fill="${h.main || h.peau}"/>
      </g>
    </g>`;
}
function jambe(cote, h) {
  const x = cote === 'g' ? 176 : 224, sens = cote === 'g' ? -1 : 1, f = dx => g(x + sens * dx);
  const soulier = `M${f(-15)} 760 L${f(-15)} 782 C${f(0)} 790 ${f(30)} 790 ${f(40)} 778 C${f(44)} 772 ${f(42)} 762 ${f(36)} 758 C${f(28)} 762 ${f(22)} 764 ${f(15)} 760 Z`;
  return `<g class="bf-hanche-${cote}" style="transform-origin:${x}px 594px">
      <rect fill="${h.jambe}" x="${x - 17}" y="586" width="34" height="100" rx="15"/>
      <g class="bf-genou-${cote}" style="transform-origin:${x}px 682px">
        <rect fill="${h.jambe2 || h.jambe}" x="${x - 15}" y="676" width="30" height="90" rx="13"/>
        ${P(soulier, h.soulier)}
      </g>
    </g>`;
}
const TUNIQUE = 'M112 384 C150 368 250 368 288 384 L272 532 L286 590 L114 590 L128 532 Z';
function pied(h) {
  return `<svg class="bouffon-svg bouffon-pied heros-svg heros-${h.id}" style="overflow:visible" viewBox="0 -110 400 920" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${h.nom}">
  <g class="bf-tout" style="transform-origin:200px 790px">
    ${h.dosPied || ''}
    ${jambe('g', h)}${jambe('d', h)}
    <g class="bf-haut" style="transform-origin:200px 380px"><g class="bf-cheveux">${h.cheveuxDos || ''}</g></g>
    ${P('M178 300 L222 300 L226 386 L174 386 Z', h.peauOmbre)}
    ${P(h.tuniquePied || TUNIQUE, h.tunique)}
    ${h.torsePied || ''}
    ${bras('g', h, h.objetG || '')}
    ${h.objetDevant ? '' : bras('d', h, h.objet || '')}
    <g class="bf-haut" style="transform-origin:200px 380px">${h.colPied || ''}${tete(h)}</g>
    ${h.objetDevant ? bras('d', h, h.objet || '') : ''}
  </g>
</svg>`;
}
function buste(h) {
  return `<svg class="bouffon-svg heros-svg heros-${h.id}" style="overflow:visible" viewBox="0 -100 400 620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${h.nom}">
  <g class="bf-tout">
    ${h.dosBuste || ''}
    <g class="bf-cheveux">${h.cheveuxDos || ''}</g>
    ${P('M58 520 C60 440 100 392 150 378 L200 373 L250 378 C300 392 340 440 342 520 Z', h.tunique)}
    ${P('M178 300 L222 300 L226 386 L174 386 Z', h.peauOmbre)}
    ${h.torseBuste || ''}
    ${h.colBuste || ''}
    ${tete(h)}
  </g>
</svg>`;
}

// =====================================================================
//  LES HÉROS
// =====================================================================
const H = {};

// ---------- Patagrain en maître du jeu : le visage du bouffon, sans chapeau ni collerette, robe de MJ ----------
H.mj = {
  id: 'mj', nom: 'Patagrain, maître du jeu', peau: '#F0C8A4', peauOmbre: '#DDA982', iris: '#86A08F', front: 176,
  sourcils: T('M160 205 Q176 198 192 204', '#8F6540', 4) + T('M208 204 Q224 198 240 205', '#8F6540', 4),
  barbe: P('M181 287 C188 282 195 283 200 285 C205 283 212 282 219 287 C223 297 223 312 216 322 C211 329 206 332 200 332 C194 332 189 329 184 322 C177 312 177 297 181 287 Z M185 294 C193 297 207 297 215 294 C217 305 213 318 200 323 C187 318 183 305 185 294 Z', '#8F6540', 'fill-rule="evenodd"'),
  surVisage: P(rond(237, 268, 2.6), '#7A4E36'),
  devant: `<g fill="rgba(255,255,255,.1)" stroke="#121418" stroke-width="6" stroke-linejoin="round"><rect x="151" y="212" width="44" height="29" rx="5"/><rect x="205" y="212" width="44" height="29" rx="5"/></g>`
    + T('M195 222 L205 222 M151 220 L139 216 M249 220 L261 216', '#121418', 5),
  cheveuxDos: P(CHEVEUX_DOS, '#9C7043'),
  cheveuxDevant: P(MECHE_G, '#B98B58') + P(miroir(MECHE_G), '#B98B58') + P('M200 132 C176 132 158 142 152 158 C170 146 186 142 200 148 C214 142 230 146 248 158 C242 142 224 132 200 132 Z', '#B98B58'),
  oreilles: `<ellipse cx="143" cy="246" rx="7" ry="14" fill="#F0C8A4"/><ellipse cx="257" cy="246" rx="7" ry="14" fill="#F0C8A4"/><circle cx="259" cy="263" r="5.5" fill="none" stroke="#1b1b1b" stroke-width="3"/>`,
  tunique: '#1F2F5A', manche: '#1F2F5A', poignet: '#D9A72E', jambe: '#18213F', soulier: '#2A1F17',
  torseBuste: T('M150 380 L200 470 L250 380', '#D9A72E', 5) + T('M200 470 L200 520', '#D9A72E', 5)
    + `<g transform="translate(200 470)">${P('M0 -16 L14 -8 L14 8 L0 16 L-14 8 L-14 -8 Z', '#D9A72E')}${P('M0 -9 L8 5 L-8 5 Z', '#F5D27A')}</g>`
    + T('M76 470 C92 430 120 404 150 392 M324 470 C308 430 280 404 250 392', '#D9A72E', 3, 'opacity=".7"'),
  torsePied: T('M150 382 L200 450 L250 382', '#D9A72E', 5) + `<rect x="124" y="520" width="152" height="14" rx="6" fill="#D9A72E"/>`
    + `<g transform="translate(200 450)">${P('M0 -14 L12 -7 L12 7 L0 14 L-12 7 L-12 -7 Z', '#D9A72E')}${P('M0 -8 L7 4 L-7 4 Z', '#F5D27A')}</g>`,
  objet: `<g transform="translate(284 560)">${P('M-16 -6 h32 v52 h-32 Z', '#7A2E2E')}${P('M-12 -2 h24 v44 h-24 Z', '#F2E6C8')}${T('M-7 8 h14 M-7 16 h14 M-7 24 h10', '#9C8A68', 2)}</g>`,
};

// ---------- Zokhran : orc barde cuisinier ----------
H.zokhran = {
  id: 'zokhran', nom: 'Zokhran', peau: '#7FA34A', peauOmbre: '#5F8436', iris: '#6B4A22', bouche: '#3A1A12', front: 186,
  oreillesDerriere: P(OREILLE_POINTUE, '#7FA34A') + P(miroir(OREILLE_POINTUE), '#7FA34A'),
  sourcils: P('M156 206 C168 196 184 196 194 208 L190 212 C182 204 170 204 160 210 Z', '#1F1A17') + P('M244 204 C232 194 216 196 206 208 L210 212 C218 204 230 202 241 208 Z', '#1F1A17'),
  nez: P('M194 236 C190 252 184 260 188 266 C194 272 206 272 212 266 C216 260 210 252 206 236 Z', '#5F8436'),
  barbe: P('M146 280 C154 304 176 324 200 328 C224 324 246 304 254 280 C246 296 230 308 214 312 C208 306 192 306 186 312 C170 308 154 296 146 280 Z', '#1F1A17')
    + P('M184 300 C188 322 194 342 200 352 C206 342 212 322 216 300 C210 308 190 308 184 300 Z', '#1F1A17')
    + P('M178 290 C188 284 196 284 200 288 C204 284 212 284 222 290 C214 296 206 295 200 292 C194 295 186 296 178 290 Z', '#1F1A17'),
  boucheTrait: 'M186 302 Q200 307 214 298',
  devant: P('M188 306 L184 290 L194 304 Z', '#EFE6CE') + P('M212 306 L216 290 L206 304 Z', '#EFE6CE'),
  cheveuxDos: P(CHEVEUX_DOS, '#1F1A17'),
  coiffe: P('M112 186 C72 172 74 110 120 104 C124 64 180 52 200 80 C220 52 276 64 280 104 C326 110 328 172 288 186 C254 172 146 172 112 186 Z', '#A3303A')
    + T('M150 176 C140 148 144 116 158 98 M200 172 C198 140 202 110 214 88 M250 176 C260 148 256 120 242 100', '#7C2029', 4)
    + P('M128 118 C134 102 150 94 162 96 C148 104 140 114 136 128 Z', '#C95A63')
    + P('M114 180 C156 166 244 166 286 180 L288 204 C244 190 156 190 112 204 Z', '#7C2029')
    + T('M150 192 l5 -8 l5 8 M195 188 l5 -8 l5 8 M240 192 l5 -8 l5 8', '#D9A72E', 3),
  tunique: '#8E2430', manche: '#8E2430', poignet: '#D9A72E', main: '#7FA34A', jambe: '#2B2420', soulier: '#3A2A1E',
  dosBuste: P('M40 520 C44 440 94 390 150 378 L250 378 C306 390 356 440 360 520 Z', '#25345A'),
  torseBuste: P('M120 520 L124 440 C150 430 250 430 276 440 L280 520 Z', '#7A1D28') + T('M134 440 L134 520 M266 440 L266 520', '#D9A72E', 3)
    + T('M150 384 C164 430 236 430 250 384', '#D9A72E', 4, 'stroke-dasharray="7 4"') + P('M174 432 L208 426 C212 416 226 412 232 420 C236 430 232 442 222 444 C216 444 210 440 208 436 L174 440 Z', '#D9A72E')
    + `<text x="144" y="480" font-size="22" fill="#D9A72E" font-weight="700">♪ ♫</text><text x="214" y="494" font-size="20" fill="#D9A72E" font-weight="700">♪</text>`,
  colBuste: P('M96 420 C110 396 132 384 152 380 L162 404 C136 410 116 420 104 434 Z M304 420 C290 396 268 384 248 380 L238 404 C264 410 284 420 296 434 Z', '#25345A'),
  torsePied: P('M136 590 L140 450 C160 442 240 442 260 450 L264 590 Z', '#7A1D28') + `<text x="154" y="510" font-size="22" fill="#D9A72E" font-weight="700">♪ ♫</text>`
    + T('M150 384 C162 420 238 420 250 384', '#D9A72E', 4, 'stroke-dasharray="7 4"'),
  colPied: P('M104 400 C120 380 140 374 160 372 L164 392 C142 396 124 404 112 414 Z M296 400 C280 380 260 374 240 372 L236 392 C258 396 276 404 288 414 Z', '#25345A'),
  objet: `<g>${P('M278 552 h12 v26 h-12 Z', '#5A3A22')}${P('M268 576 h44 v62 h-44 Z', '#B8BEC6')}${P('M268 576 h44 v8 h-44 Z', '#8E959C')}${P(rond(302, 586, 3), '#5A5F66')}</g>`,
};

// ---------- Namerya : l'ondine aux yeux d'océan ----------
H.namerya = {
  id: 'namerya', nom: 'Namerya', peau: '#F1D6C8', peauOmbre: '#D9B3A6', iris: '#3AA2DD', bouche: '#9E4656', front: 178,
  visage: 'M200 152 C240 152 258 182 258 228 C258 278 234 316 200 322 C166 316 142 278 142 228 C142 182 160 152 200 152 Z',
  surVisage: P('M158 262 a10 6 0 1 0 20 0 a10 6 0 1 0 -20 0 M222 262 a10 6 0 1 0 20 0 a10 6 0 1 0 -20 0', '#EBA9A6', 'opacity=".7"'),
  sourcils: T('M160 208 Q174 200 190 206', '#15171F', 3.5) + T('M210 206 Q226 200 240 208', '#15171F', 3.5),
  devant: T('M162 222 Q173 214 185 221 M215 221 Q227 214 238 222', '#15171F', 3.5),
  nez: T('M200 236 C199 250 196 258 197 264', '#D9B3A6', 3),
  boucheTrait: 'M190 298 Q200 304 210 298',
  dosBuste: P('M88 520 C72 400 96 210 200 128 C304 210 328 400 312 520 Z', '#1F3D72') + P('M110 520 C98 400 118 230 200 152 C282 230 302 400 290 520 Z', '#1E6E5C'),
  dosPied: P('M118 600 C98 480 104 300 200 236 C296 300 302 480 282 600 Z', '#1F3D72'),
  cheveuxDos: P(CHEVEUX_DOS, '#15171F'),
  cheveuxDevant: P(MECHE_G, '#1A1C26') + P(miroir(MECHE_G), '#1A1C26') + P('M200 132 C170 132 150 146 146 166 C166 150 184 146 200 152 C216 146 234 150 254 166 C250 146 230 132 200 132 Z', '#1A1C26')
    + T('M140 260 C136 300 138 340 132 380 M260 260 C264 300 262 340 268 380', '#3A4766', 3),
  tunique: '#1B4F7C', manche: '#1B4F7C', poignet: '#AEB9C7', jambe: '#163E62', soulier: '#22303F',
  torseBuste: P('M170 376 L200 430 L230 376 Z', '#F1D6C8') + P('M84 470 C82 420 112 392 150 388 C160 410 154 440 136 460 Z', '#AEB9C7') + P(miroir('M84 470 C82 420 112 392 150 388 C160 410 154 440 136 460 Z'), '#AEB9C7')
    + T('M98 446 C108 420 124 408 142 404 M302 446 C292 420 276 408 258 404', '#6F7B8A', 3) + T('M200 400 L200 424', '#AEB9C7', 3)
    + P(rond(200, 446, 18), '#7FDBFF', 'opacity=".35"') + P('M200 428 L211 444 L200 466 L189 444 Z', '#53C8EE') + P('M200 434 L204 444 L200 454 Z', '#E8FBFF'),
  colBuste: P('M110 520 C98 400 118 230 200 152', 'none', 'stroke="#162B52" stroke-width="5"') + P(miroir('M110 520 C98 400 118 230 200 152'), 'none', 'stroke="#162B52" stroke-width="5"'),
  torsePied: P('M176 378 L200 420 L224 378 Z', '#F1D6C8') + P('M90 420 C90 392 112 378 140 382 C144 400 138 416 124 426 Z', '#AEB9C7') + P(miroir('M90 420 C90 392 112 378 140 382 C144 400 138 416 124 426 Z'), '#AEB9C7')
    + P('M200 426 L208 438 L200 454 L192 438 Z', '#53C8EE') + `<rect x="126" y="520" width="148" height="12" rx="5" fill="#AEB9C7"/>`,
  objet: `<g>${P('M279 330 h10 v440 h-10 Z', '#6B4A2E')}${P(rond(284, 318, 22), '#7FDBFF', 'opacity=".35"')}${P(rond(284, 318, 13), '#53C8EE')}${T('M270 336 C276 326 292 326 298 336', '#6B4A2E', 6)}</g>`,
};

// ---------- Kenai : orc au chignon, cuir, cuivre, bouclier et épée ----------
H.kenai = {
  id: 'kenai', nom: 'Kenai', peau: '#7C8D3C', peauOmbre: '#5C6B2A', iris: '#2A1A06', bouche: '#2E1010', front: 184,
  oreillesDerriere: P(OREILLE_POINTUE, '#7C8D3C') + P(miroir(OREILLE_POINTUE), '#7C8D3C'),
  visage: 'M200 148 C246 148 266 180 266 226 C266 276 244 316 200 324 C156 316 134 276 134 226 C134 180 154 148 200 148 Z',
  surVisage: T('M236 196 L224 238 M232 202 l7 4 M229 213 l7 4 M226 224 l7 4', '#3E4A1A', 3),
  yeux: [[173, 228], [227, 228]],
  sourcils: P('M154 206 L194 218 L192 225 L154 214 Z', '#1A1714') + P('M246 206 L206 218 L208 225 L246 214 Z', '#1A1714'),
  nez: P('M193 236 C188 254 182 262 186 268 C192 274 208 274 214 268 C218 262 212 254 207 236 Z', '#5C6B2A'),
  boucheTrait: 'M184 304 Q200 296 216 304',
  devant: P('M186 308 L182 290 L192 306 Z', '#EDE3CB') + P('M214 308 L218 290 L208 306 Z', '#EDE3CB'),
  coiffe: P('M136 210 C134 166 162 140 200 140 C238 140 266 166 264 210 C252 180 230 166 200 166 C170 166 148 180 136 210 Z', '#1A1714')
    + P('M182 132 C178 108 192 96 204 98 C220 100 222 122 212 134 C204 140 190 140 182 132 Z', '#1A1714') + T('M182 132 Q198 140 214 132', '#C27B45', 6),
  tunique: '#6A3D22', manche: '#6A3D22', poignet: '#C27B45', main: '#7C8D3C', jambe: '#3A2A1C', soulier: '#2A1C12',
  torseBuste: T('M140 520 L162 404 M260 520 L238 404', '#4E2C17', 18) + `<rect x="182" y="456" width="36" height="22" rx="3" fill="#9AA1A8"/><rect x="186" y="490" width="28" height="18" rx="3" fill="#9AA1A8"/>`
    + P('M66 470 C64 424 98 396 140 398 C150 420 146 446 128 466 Z', '#4E2C17') + P(miroir('M66 470 C64 424 98 396 140 398 C150 420 146 446 128 466 Z'), '#4E2C17')
    + T('M76 446 C88 424 106 412 130 410 M324 446 C312 424 294 412 270 410', '#C27B45', 6)
    + P(rond(92, 432, 4) + ' ' + rond(112, 420, 4) + ' ' + rond(308, 432, 4) + ' ' + rond(288, 420, 4), '#9AA1A8'),
  colBuste: P('M112 414 C108 388 128 370 150 376 C156 360 176 354 188 364 C194 352 206 352 212 364 C224 354 244 360 250 376 C272 370 292 388 288 414 C250 424 150 424 112 414 Z', '#8B7559')
    + T('M126 404 l7 -12 l5 12 M162 396 l6 -12 l6 12 M196 394 l4 -12 l4 12 M232 396 l6 -12 l6 12 M266 404 l5 -12 l7 12', '#5E4C36', 3),
  torsePied: T('M150 590 L166 400 M250 590 L234 400', '#4E2C17', 14) + `<rect x="184" y="470" width="32" height="18" rx="3" fill="#9AA1A8"/>` + `<rect x="128" y="522" width="144" height="14" rx="5" fill="#C27B45"/>`,
  colPied: P('M118 398 C114 378 132 364 152 370 C158 356 176 350 188 360 C194 350 206 350 212 360 C224 350 242 356 248 370 C268 364 286 378 282 398 C246 406 154 406 118 398 Z', '#8B7559'),
  objetG: `<g>${P(rond(116, 520, 46), '#6B4A2E')}${P(rond(116, 520, 46), 'none', 'stroke="#9AA1A8" stroke-width="7"')}${P(rond(116, 520, 12), '#9AA1A8')}${T('M80 520 H152 M116 484 V556', '#4E341F', 3, 'opacity=".6"')}</g>`,
  objet: `<image class="bf-sabre" href="../assets/epee.svg" x="252" y="512" width="64" height="208"/>`, objetDevant: true,
};

// ---------- Trayss : draconide violette, arbalète ----------
H.trayss = {
  id: 'trayss', nom: 'Trayss', peau: '#6A3FA0', peauOmbre: '#4B2A78', oeilFendu: true, lueur: '#C88BFF', blancOeil: '#E9D2FF', bouche: '#2A0E22', front: 180,
  yeux: [[166, 212], [234, 212]], boucheXY: [200, 322],
  visage: 'M200 142 C246 142 270 170 270 206 C270 232 260 250 248 264 C242 290 228 318 212 330 C206 334 194 334 188 330 C172 318 158 290 152 264 C140 250 130 232 130 206 C130 170 154 142 200 142 Z',
  ombreJoue: 'M242 160 C262 176 270 200 268 222 C266 242 256 256 246 266 C240 292 226 316 212 328 C224 300 232 274 236 250 C240 222 244 190 242 160 Z',
  surVisage: P('M166 246 C168 284 180 314 192 326 C196 329 204 329 208 326 C220 314 232 284 234 246 C220 258 180 258 166 246 Z', '#8A63C0')
    + T('M162 176 q7 -5 14 0 M224 176 q7 -5 14 0 M190 164 q10 -6 20 0 M146 232 q6 -4 12 0 M242 232 q6 -4 12 0 M178 270 q6 -4 12 0 M210 270 q6 -4 12 0 M190 292 q10 -5 20 0', '#4B2A78', 2.5)
    + P('M142 196 C154 182 178 184 190 200 L185 207 C175 196 160 194 148 202 Z M258 196 C246 182 222 184 210 200 L215 207 C225 196 240 194 252 202 Z', '#3E2460')
    + T('M162 268 C170 296 182 314 200 322 C218 314 230 296 238 268', '#2A0E22', 3, 'opacity=".55"'),
  sourcils: '',
  nez: P(rond(189, 310, 3.6) + ' ' + rond(211, 310, 3.6), '#2A0E22'),
  boucheTrait: 'M184 322 Q200 328 216 322',
  devant: P('M172 286 l5 5 l1 -7 Z M228 286 l-5 5 l-1 -7 Z M182 304 l4 5 l1 -7 Z M218 304 l-4 5 l-1 -7 Z', '#F2ECE0'),
  oreillesDerriere: P('M142 214 L102 202 L126 226 L96 240 L130 246 L106 266 L146 258 Z', '#5B3A85') + P(miroir('M142 214 L102 202 L126 226 L96 240 L130 246 L106 266 L146 258 Z'), '#5B3A85'),
  coiffe: P('M170 154 C140 138 110 132 82 150 C110 146 136 156 158 174 Z', '#3E2460') + P(miroir('M170 154 C140 138 110 132 82 150 C110 146 136 156 158 174 Z'), '#3E2460')
    + P('M148 182 C122 178 100 186 86 204 C108 198 130 200 146 208 Z', '#3E2460') + P(miroir('M148 182 C122 178 100 186 86 204 C108 198 130 200 146 208 Z'), '#3E2460')
    + T('M120 146 l4 7 M102 148 l3 7 M280 146 l-4 7 M298 148 l-3 7', '#5B3A85', 3)
    + P('M182 150 L190 128 L198 146 L206 128 L214 150 Z', '#5B3A85'),
  dosBuste: P('M76 520 L118 370 L140 376 L104 520 Z', '#4A2E1C') + T('M120 372 L132 320 M128 374 L144 326 M136 376 L156 332', '#7A5A3A', 5)
    + P('M128 324 l4 -14 l8 12 Z M140 328 l7 -14 l6 13 Z M152 334 l9 -12 l4 14 Z', '#C9C2B6'),
  dosPied: P('M108 560 L142 380 L160 384 L130 566 Z', '#4A2E1C') + T('M144 382 L154 340 M150 384 L164 344', '#7A5A3A', 4) + P('M150 344 l4 -12 l7 10 Z M160 348 l6 -12 l5 12 Z', '#C9C2B6'),
  tunique: '#5E3A22', manche: '#5E3A22', manche2: '#6A3FA0', poignet: '#B8783F', main: '#6A3FA0', jambe: '#43291A', jambe2: '#6A3FA0', soulier: '#4B2A78',
  torseBuste: P('M70 474 C68 428 100 400 140 402 C150 424 146 448 128 468 Z', '#43291A') + P(miroir('M70 474 C68 428 100 400 140 402 C150 424 146 448 128 468 Z'), '#43291A')
    + T('M80 450 C92 428 110 416 134 414 M320 450 C308 428 290 416 266 414', '#B8783F', 6) + T('M184 520 L200 400 L216 520', '#43291A', 14) + `<rect x="188" y="456" width="24" height="16" rx="3" fill="#B8783F"/>`,
  torsePied: `<rect x="128" y="522" width="144" height="14" rx="5" fill="#B8783F"/>` + T('M182 590 L200 410 L218 590', '#43291A', 10),
  objet: `<g>${P('M278 548 h12 v100 h-12 Z', '#5A3A22')}${T('M236 640 Q284 616 332 640', '#7A5A3A', 7)}${T('M236 640 L284 654 L332 640', '#C9C2B6', 2)}${P('M280 600 l4 -40 l4 40 Z', '#C9C2B6')}</g>`,
};

// ---------- Trayss, ses deux autres formes : humaine, et « entre les deux » (cornes, peau violette) ----------
// même tenue sombre (cuir noir, épaulières, rivets d'argent), même carquois et même arbalète que la forme dragon
const CHEVEUX_TRAYSS = MECHE_G;
// coiffure de Trayss (formes humaine et entre-deux) : cheveux tirés en queue de cheval haute, frange de côté, mèche violette
const TRAYSS_CRANE = 'M200 118 C148 118 126 160 130 214 L270 214 C274 160 252 118 200 118 Z';
const TRAYSS_QUEUE = 'M226 124 C286 108 318 160 306 236 C298 290 302 344 318 392 C280 372 262 318 266 254 C270 200 262 156 232 140 Z';
const TRAYSS_FRANGE = 'M136 216 C130 160 160 126 202 126 C244 126 268 158 264 206 C256 176 238 160 220 158 C198 176 166 192 136 216 Z';
const TRAYSS_COIFFURE = {
  cheveuxDos: P(TRAYSS_QUEUE, '#14151C') + T('M256 148 C282 162 290 206 282 252 C276 294 282 334 294 364', '#7B4BC4', 6, 'opacity=".8"') + P(TRAYSS_CRANE, '#14151C'),
  cheveuxDevant: P(TRAYSS_FRANGE, '#17181F') + T('M214 140 C196 156 172 176 150 198', '#9B5DE5', 7) + T('M240 146 C214 162 190 178 166 194', '#3A2E52', 3),
};
const TRAYSS_COMMUN = {
  sourcils: P('M156 200 L192 210 L190 216 L157 207 Z', '#15171F') + P('M244 200 L208 210 L210 216 L243 207 Z', '#15171F'),
  devant: T('M162 222 Q173 215 185 221 M215 221 Q227 215 238 222 M164 221 L153 215 M236 221 L247 215', '#15171F', 3.5),
  boucheTrait: 'M189 299 Q201 305 212 297', bouche: '#7E3A52', front: 178,
  visage: 'M200 152 C242 152 260 182 260 226 C260 266 246 298 224 316 L200 326 L176 316 C154 298 140 266 140 226 C140 182 158 152 200 152 Z',
  ...TRAYSS_COIFFURE,
  dosBuste: H.trayss.dosBuste, dosPied: H.trayss.dosPied,
  tunique: '#2E2622', manche: '#2E2622', poignet: '#9AA1A8', jambe: '#1C1816', soulier: '#2A1F17',
  torseBuste: P('M64 474 C62 424 98 394 142 398 C152 422 146 448 128 470 Z', '#3A302A') + P(miroir('M64 474 C62 424 98 394 142 398 C152 422 146 448 128 470 Z'), '#3A302A')
    + T('M76 448 C90 424 108 412 134 410 M324 448 C310 424 292 412 266 410', '#9AA1A8', 4)
    + P(rond(92, 434, 3.5) + ' ' + rond(110, 422, 3.5) + ' ' + rond(308, 434, 3.5) + ' ' + rond(290, 422, 3.5), '#C9CED4')
    + P('M168 380 L200 420 L232 380 L222 376 L200 404 L178 376 Z', '#3A302A') + P('M200 430 L212 446 L200 466 L188 446 Z', '#9AA1A8')
    + T('M150 470 C170 500 230 500 250 470', '#3A302A', 6),
  torsePied: P('M178 380 L200 408 L222 380 Z', '#3A302A') + `<rect x="126" y="522" width="148" height="14" rx="5" fill="#9AA1A8"/>` + P('M200 524 l8 6 l-8 8 l-8 -8 Z', '#C9CED4'),
  objet: H.trayss.objet,
};
H['trayss-humaine'] = {
  ...TRAYSS_COMMUN, id: 'trayss-humaine', nom: 'Trayss (forme humaine)', peau: '#D6A684', peauOmbre: '#B78464', iris: '#9B5DE5',
  surVisage: T('M232 246 q5 -4 10 0 M240 256 q5 -4 10 0 M228 257 q5 -4 10 0 M236 266 q5 -4 10 0', '#8A5CC9', 2.6, 'opacity=".85"'),
  nez: T('M200 236 C199 250 196 258 197 264', '#B78464', 3),
  oreillesDerriere: `<ellipse cx="141" cy="246" rx="7" ry="14" fill="#D6A684"/><ellipse cx="259" cy="246" rx="7" ry="14" fill="#D6A684"/>`,
  oreilles: `<g fill="none" stroke="#C9CED4" stroke-width="3"><circle cx="140" cy="263" r="5"/><circle cx="260" cy="263" r="5"/><circle cx="262" cy="240" r="3.5"/></g>`,
};
H['trayss-mi'] = {
  ...TRAYSS_COMMUN, id: 'trayss-mi', nom: 'Trayss (entre les deux)', peau: '#8E70BC', peauOmbre: '#6B5096', iris: '#E6D8FF',
  surVisage: T('M178 176 q6 -4 12 0 M210 176 q6 -4 12 0 M194 166 q6 -4 12 0 M150 248 q5 -4 10 0 M156 262 q5 -4 10 0 M240 248 q5 -4 10 0 M234 262 q5 -4 10 0', '#5A3F86', 2.5),
  nez: T('M200 236 C199 250 196 258 197 264', '#6B5096', 3),
  oreillesDerriere: P(OREILLE_LONGUE, '#8E70BC') + P(miroir(OREILLE_LONGUE), '#8E70BC'),
  cheveuxDos: TRAYSS_COIFFURE.cheveuxDos + P(rond(296, 250, 4.5) + ' ' + rond(294, 290, 4.5) + ' ' + rond(298, 330, 4.5), '#B57BFF'),
  coiffe: P('M170 160 C150 130 150 98 172 72 C168 92 170 112 178 128 C182 138 186 146 192 154 Z', '#1B1620') + P(miroir('M170 160 C150 130 150 98 172 72 C168 92 170 112 178 128 C182 138 186 146 192 154 Z'), '#1B1620')
    + T('M164 134 l8 -2 M162 116 l8 0 M166 98 l7 2 M236 134 l-8 -2 M238 116 l-8 0 M234 98 l-7 2', '#3A3044', 2.5),
};

// ---------- Ba Heng Ze : cornes de bélier, longue barbe blanche, masse d'armes ----------
H.baheng = {
  id: 'baheng', nom: 'Ba Heng Ze', peau: '#D7AD86', peauOmbre: '#B88A64', iris: '#4A5A3A', front: 178, tailleOeil: .85,
  oreillesDerriere: P(OREILLE_LONGUE, '#D7AD86') + P(miroir(OREILLE_LONGUE), '#D7AD86'),
  surVisage: T('M168 186 Q200 178 232 186 M172 196 Q200 189 228 196 M150 230 l-8 -4 M150 236 l-8 2 M250 230 l8 -4 M250 236 l8 2', '#9C7452', 2.5),
  sourcils: P('M152 210 C162 194 184 196 196 210 L192 216 C182 206 166 204 156 214 Z', '#ECE8E0') + P('M248 210 C238 194 216 196 204 210 L208 216 C218 206 234 204 244 214 Z', '#ECE8E0'),
  barbe: P('M156 270 C150 330 168 390 186 424 C192 434 208 434 214 424 C232 390 250 330 244 270 C232 292 218 302 200 302 C182 302 168 292 156 270 Z', '#ECE8E0')
    + T('M180 330 C184 360 190 386 196 410 M200 316 L200 420 M220 330 C216 360 210 386 204 410', '#BDB6AA', 3)
    + P('M170 284 C184 276 194 276 200 282 C206 276 216 276 230 284 C220 294 208 292 200 288 C192 292 180 294 170 284 Z', '#ECE8E0'),
  boucheTrait: 'M190 300 Q200 304 210 300', boucheXY: [200, 300],
  cheveuxDos: P(CHEVEUX_DOS, '#D8D2C6'),
  cheveuxDevant: P('M200 136 C166 136 146 154 142 182 C160 160 180 156 200 160 C220 156 240 160 258 182 C254 154 234 136 200 136 Z', '#ECE8E0'),
  coiffe: T('M156 176 C120 150 88 168 90 202 C92 234 126 242 140 218 C148 202 134 190 124 198', '#5E4630', 30) + T('M156 176 C120 150 88 168 90 202 C92 234 126 242 140 218 C148 202 134 190 124 198', '#A07C56', 22)
    + T(miroir('M156 176 C120 150 88 168 90 202 C92 234 126 242 140 218 C148 202 134 190 124 198'), '#5E4630', 30) + T(miroir('M156 176 C120 150 88 168 90 202 C92 234 126 242 140 218 C148 202 134 190 124 198'), '#A07C56', 22)
    + T('M100 170 l10 8 M88 196 l12 2 M96 222 l10 -7 M300 170 l-10 8 M312 196 l-12 2 M304 222 l-10 -7', '#6E5235', 3),
  tunique: '#6B4A2E', manche: '#6B4A2E', poignet: '#B08D57', jambe: '#4E341F', soulier: '#2E2016',
  torseBuste: P('M66 470 C64 424 98 396 140 398 C150 420 146 446 128 466 Z', '#B08D57') + P(miroir('M66 470 C64 424 98 396 140 398 C150 420 146 446 128 466 Z'), '#B08D57')
    + T('M76 446 C88 424 106 412 130 410 M324 446 C312 424 294 412 270 410', '#7E6238', 5)
    + P(rond(92, 432, 4) + ' ' + rond(112, 420, 4) + ' ' + rond(308, 432, 4) + ' ' + rond(288, 420, 4), '#8E8676'),
  torsePied: `<rect x="126" y="522" width="148" height="14" rx="5" fill="#B08D57"/>` + P(rond(200, 529, 12), '#7E6238'),
  objet: `<g>${P('M279 540 h10 v130 h-10 Z', '#5A3A22')}${P(rond(284, 684, 22), '#8E8676')}${P('M284 652 l5 12 h-10 Z M284 716 l5 -12 h-10 Z M252 684 l12 5 v-10 Z M316 684 l-12 5 v-10 Z', '#8E8676')}</g>`,
};

// ---------- Dvergrost : nain, cape d'ours, collier de griffes, hache ----------
H.dvergrost = {
  id: 'dvergrost', nom: 'Dvergrost', peau: '#D49A74', peauOmbre: '#B07A58', iris: '#2A1D14', front: 182, tailleOeil: .8,
  visage: 'M200 152 C248 152 268 184 268 230 C268 280 244 318 200 324 C156 318 132 280 132 230 C132 184 152 152 200 152 Z',
  sourcils: P('M150 210 C162 196 186 198 198 214 L194 222 C182 210 166 208 154 218 Z', '#1C1714') + P('M250 210 C238 196 214 198 202 214 L206 222 C218 210 234 208 246 218 Z', '#1C1714'),
  nez: P('M190 236 C182 256 182 274 200 278 C218 274 218 256 210 236 Z', '#B07A58') + P('M196 246 C194 256 194 264 196 270 L202 270 C202 262 201 254 200 246 Z', '#E8B892'),
  barbe: P('M146 262 C140 326 158 390 180 430 L220 430 C242 390 260 326 254 262 C240 290 222 302 200 302 C178 302 160 290 146 262 Z', '#1C1714')
    + P('M176 410 C172 432 176 448 182 456 L194 456 C190 444 188 430 190 410 Z M224 410 C228 432 224 448 218 456 L206 456 C210 444 212 430 210 410 Z', '#1C1714')
    + `<rect x="176" y="430" width="18" height="10" rx="2" fill="#C9A23A"/><rect x="206" y="430" width="18" height="10" rx="2" fill="#C9A23A"/>`
    + T('M170 320 C174 350 180 376 186 400 M200 310 L200 410 M230 320 C226 350 220 376 214 400', '#3B332C', 3)
    + P('M168 286 C182 274 194 276 200 284 C206 276 218 274 232 286 C220 298 208 294 200 290 C192 294 180 298 168 286 Z', '#1C1714'),
  boucheTrait: 'M190 304 Q200 308 210 304', boucheXY: [200, 304], bouche: '#3A1414',
  cheveuxDos: P('M200 126 C146 126 122 170 124 226 C126 266 130 296 134 316 L266 316 C270 296 274 266 276 226 C278 170 254 126 200 126 Z', '#1C1714'),
  cheveuxDevant: P('M136 214 C130 170 160 140 200 140 C240 140 270 170 264 214 C252 186 230 170 200 170 C170 170 148 186 136 214 Z', '#1C1714'),
  oreilles: `<ellipse cx="135" cy="244" rx="8" ry="14" fill="#D49A74"/><ellipse cx="265" cy="244" rx="8" ry="14" fill="#D49A74"/>`,
  tunique: '#5A3D27', manche: '#5A3D27', poignet: '#9AA2AA', jambe: '#3A2A1C', soulier: '#2A1C12',
  dosBuste: P('M32 520 C36 440 90 392 150 380 L250 380 C310 392 364 440 368 520 Z', '#5E4A38'),
  torseBuste: T('M60 500 l10 -14 l6 14 M90 450 l10 -14 l6 14 M310 450 l-10 -14 l-6 14 M340 500 l-10 -14 l-6 14', '#3C2E22', 4)
    + T('M134 400 C150 432 250 432 266 400', '#5A3D27', 4) + P('M150 414 l-4 18 l11 -15 Z M172 424 l-3 19 l11 -16 Z M228 424 l3 19 l-11 -16 Z M250 414 l4 18 l-11 -15 Z', '#EDE3CF'),
  colBuste: P('M80 430 C96 398 124 384 152 380 L156 410 C128 414 106 424 92 440 Z M320 430 C304 398 276 384 248 380 L244 410 C272 414 294 424 308 440 Z', '#6E5844'),
  dosPied: P('M96 600 C96 490 110 410 150 378 L250 378 C290 410 304 490 304 600 Z', '#5E4A38'),
  torsePied: `<rect x="126" y="522" width="148" height="14" rx="5" fill="#9AA2AA"/>` + P('M156 404 l-3 14 l9 -12 Z M244 404 l3 14 l-9 -12 Z', '#EDE3CF'),
  colPied: P('M104 404 C118 384 140 376 160 374 L162 398 C140 400 122 408 112 418 Z M296 404 C282 384 260 376 240 374 L238 398 C260 400 278 408 288 418 Z', '#6E5844'),
  objet: `<g>${P('M279 540 h10 v140 h-10 Z', '#6B4A2E')}${P('M289 640 C312 628 336 640 340 664 C330 662 316 668 310 680 L289 682 Z', '#9AA2AA')}${T('M296 638 C316 632 332 644 336 660', '#5F666D', 3)}</g>`,
};

// ---------- feuille de style (la même que le bouffon, + parle, ko) ----------
// ---------- L'aventurier : le personnage « autre » (sans dessin), encapuchonné, à la couleur de sa carte ----------
//            (currentColor : la couleur vient de --c-heros, posée par la scène ; gris-bleu sinon)
const CAPUCHE = 'M200 98 C122 98 102 186 110 268 C114 318 128 356 148 384 L252 384 C272 356 286 318 290 268 C298 186 278 98 200 98 Z';
const OUVERTURE = 'M200 144 C150 144 134 188 136 234 C138 290 164 328 200 332 C236 328 262 290 264 234 C266 188 250 144 200 144 Z';
H.aventurier = {
  id: 'aventurier', nom: 'Aventurier', peau: '#E2B48E', peauOmbre: '#C4926C', iris: '#4A3A2A', front: 182,
  sourcils: T('M160 206 Q176 200 192 205', '#5A3E28', 4) + T('M208 205 Q224 200 240 206', '#5A3E28', 4),
  surVisage: P('M136 240 C138 192 156 150 200 150 C244 150 262 192 264 240 C248 204 228 190 200 190 C172 190 152 204 136 240 Z', '#000', 'opacity=".32"'),
  cheveuxDos: P(CAPUCHE, 'currentColor') + P(CAPUCHE, '#000', 'opacity=".35"'),
  coiffe: P(CAPUCHE + ' ' + OUVERTURE, 'currentColor', 'fill-rule="evenodd"')
    + T('M200 100 C160 104 132 140 126 196', '#fff', 5, 'opacity=".14"') + T(OUVERTURE, '#000', 5, 'opacity=".3"'),
  tunique: 'currentColor', manche: 'currentColor', poignet: '#8B7559', jambe: '#3A3328', soulier: '#2A1F17',
  torseBuste: P('M58 520 C60 440 100 392 150 378 L200 373 L250 378 C300 392 340 440 342 520 Z', '#000', 'opacity=".22"')
    + P('M150 380 L200 470 L250 380 C236 400 220 412 200 414 C180 412 164 400 150 380 Z', '#5A4A36') + P(rond(200, 412, 11), '#C9A24A'),
  torsePied: P('M150 382 L200 450 L250 382 C236 398 220 408 200 410 C180 408 164 398 150 382 Z', '#5A4A36') + P(rond(200, 408, 10), '#C9A24A')
    + `<rect x="124" y="520" width="152" height="14" rx="6" fill="#5A4A36"/>`,
};

const STYLE = `.bf-expr { display: none; }
.expr-rire .bf-oeil-g, .expr-rire .bf-oeil-d, .expr-rire .bf-bouche, .expr-choc .bf-bouche, .expr-dort .bf-oeil-g, .expr-dort .bf-oeil-d { display: none; }
.expr-dort .bf-yeux-dort, .expr-rire .bf-yeux-rire, .expr-rire .bf-bouche-rire, .expr-choc .bf-bouche-o { display: inline; }
.expr-choc .bf-oeil-g, .expr-choc .bf-oeil-d { transform: scale(1.4); transform-box: fill-box; transform-origin: 50% 50%; }
.expr-ko .bf-oeil-g, .expr-ko .bf-oeil-d, .expr-ko .bf-bouche, .expr-ko .bf-bouche-parle { display: none !important; }
.expr-ko .bf-yeux-dort, .expr-ko .bf-bandage, .expr-ko .bf-bouche-ko { display: inline; }
.heros-aventurier { color: var(--c-heros, #5E6E8C); }`;

// ---------- écriture de js/heros.js ----------
const DESSINS = Object.fromEntries(Object.values(H).map(h => [h.id, { nom: h.nom, buste: buste(h), pied: pied(h) }]));
const js = `/* =====================================================================
   LES HÉROS de la scène JDR — FICHIER GÉNÉRÉ par outils/generer-heros.mjs : ne pas le modifier à la main.
   Dans le style du bouffon et sur son squelette (mêmes classes bf-…) : les gestes de css/bouffon.css marchent.
     Heros.svg(id)                     buste (portrait)
     Heros.svg(id, 'tete')             portrait recadré sur la tête
     Heros.svg(id, 'pied')             personnage entier articulé
     Heros.svg(id, forme, { expression: 'rire' | 'choc' | 'dort' | 'ko' })
   id : ${Object.keys(H).join(', ')}
   ===================================================================== */
const Heros = (() => {
  const STYLE = ${JSON.stringify(STYLE)};
  const DESSINS = ${JSON.stringify(DESSINS)};
  let style = false;
  function svg(id, forme = 'buste', { expression = '' } = {}) {
    const d = DESSINS[id];
    if (!d) return '';
    if (!style && typeof document !== 'undefined') { const s = document.createElement('style'); s.textContent = STYLE; document.head.appendChild(s); style = true; }
    let s = forme === 'pied' ? d.pied : d.buste;
    if (forme === 'tete') s = s.replace('viewBox="0 -100 400 620"', 'viewBox="10 -100 380 450"');
    if (expression) s = s.replace('class="bouffon-svg', 'class="expr-' + expression + ' bouffon-svg');
    return s;
  }
  return { svg, liste: Object.keys(DESSINS), nom: id => (DESSINS[id] || {}).nom };
})();
`;
writeFileSync(join(RACINE, 'js', 'heros.js'), js, 'utf8');
console.log('→ js/heros.js (' + Object.keys(H).join(', ') + ')');
