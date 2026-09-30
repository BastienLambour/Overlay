/* =====================================================================
   Génère LE BOUFFON et LE CHAPEAU de Patagrain (Node, sans dépendance).

   Utilisation (dans le dossier patagrain) :
       node outils/generer-bouffon.mjs

   Produit :
     js/bouffon.js            le dessin, utilisé par le moodboard et les transitions
     assets/bouffon.svg       le buste       assets/bouffon-pied.svg   le personnage en pied
     assets/chapeau.svg       le chapeau seul (icônes, cadre cam, badges, kit)
     assets/logo-couleur.svg  le logo, avec ce même chapeau sur le « n »
     assets/logo-contour.svg  le même logo avec un contour crème (lisible sur un jeu)
   Ensuite : refaire les vidéos (node outils/generer-transitions.mjs) et le kit
   (node outils/exporter-chaine.mjs).
   ===================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');   // dossier de l'overlay
// (le chapeau est dessiné ici même : c'est LUI la référence, reprise par assets/chapeau.svg et le logo)

// Nombres formatés comme dans les SVG (1 décimale, ou sans zéros inutiles)
const f1 = v => v.toFixed(1);
const g = v => String(Number(v.toPrecision(6)));

// Couleurs fixes du personnage (peau, cheveux, yeux) ; le reste suit le thème
const [PEAU, PEAU_OMBRE, CHEVEUX, CHEVEUX_FONCE, POILS, IRIS] = ['#F0C8A4', '#DDA982', '#B98B58', '#9C7043', '#8F6540', '#86A08F'];

// Symétrie gauche/droite d'un chemin (x -> 400 - x)
const miroir = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${g(400 - parseFloat(x))} ${y}`);

// Cheveux : raie au milieu, s'arrêtent juste sous les épaules
const CHEVEUX_DOS = 'M200 118 C128 118 104 176 106 250 C108 320 106 380 102 432 L298 432 C294 380 292 320 294 250 C296 176 272 118 200 118 Z';
const MECHE_G = 'M200 132 C160 134 132 160 128 210 C124 260 126 320 121 372 C118 398 119 416 123 432 ' +
  'L160 432 C156 404 152 370 150 330 C148 280 146 230 152 200 C160 172 178 152 200 148 Z';

// Collerette de bouffon : pointes alternées bleu / noir, grelots dorés
function collerette(baseY) {
  const out = [];
  const n = 8, x0 = 104, largeur = 192;
  const base = x => baseY + ((x - 200) / 96) ** 2 * 24;
  for (let i = 0; i < n; i++) {
    const a = x0 + i * largeur / n, b = a + largeur / n, c = (a + b) / 2;
    const classe = i % 2 === 0 ? 'bf-bleu' : 'bf-rouge';
    out.push(`<polygon class="${classe}" points="${f1(a)},${f1(base(a))} ${f1(b)},${f1(base(b))} ${f1(c)},${f1(base(c) + 52)}"/>`);
    out.push(`<circle class="bf-or" cx="${f1(c)}" cy="${f1(base(c) + 55)}" r="6.5"/>`);
  }
  return `<g class="bf-collerette">${out.join('')}</g>`;
}

// Couronne du chapeau porté, courbe sur le front
function couronne() {
  const n = 9, x0 = 110, x1 = 290;
  const bas = x => 176 + 26 * (1 - ((x - 200) / 90) ** 2) * 0.5 + 6;   // bord bas, plus bas au centre
  const haut = x => bas(x) - 24;
  const pts = [];
  for (let i = 0; i < n * 2 + 1; i++) {
    const x = x0 + (x1 - x0) * i / (n * 2);
    pts.push(`${f1(x)} ${f1(haut(x) - (i % 2 ? 16 : 0))}`);
  }
  const bordBas = [];
  for (let k = 20; k >= 0; k--) { const x = x0 + (x1 - x0) * k / 20; bordBas.push(`${f1(x)} ${f1(bas(x))}`); }
  return 'M' + pts.join(' L') + ' L' + bordBas.join(' ') + ' Z';
}
const COURONNE = couronne();

// Petit d20 low-poly (mêmes facettes que l'emblème), centré sur (cx, cy), rayon r
function d20(cx, cy, r) {
  const k = r / 460;
  const P = ([x, y]) => `${f1(cx + (x - 500) * k)},${f1(cy + (y - 500) * k)}`;
  const T = [500, 20], UR = [930, 258], LR = [930, 742], B = [500, 980], LL = [70, 742], UL = [70, 258];
  const A = [500, 190], C = [165, 770], D = [835, 770];
  const faces = [[[T, UL, A], 'bf-d20-clair'], [[T, A, UR], 'bf-d20-clair'], [[UL, C, A], 'bf-bleu'], [[UR, A, D], 'bf-bleu'],
    [[UL, LL, C], 'bf-bleu-fonce'], [[UR, D, LR], 'bf-bleu-fonce'], [[LL, B, C], 'bf-bleu-fonce'], [[LR, D, B], 'bf-bleu-fonce'],
    [[C, B, D], 'bf-bleu-fonce'], [[A, C, D], 'bf-or']];
  return faces.map(([pts, c]) => `<polygon class="${c}" points="${pts.map(P).join(' ')}"/>`).join('');
}
const D20_POINTE = '<line x1="166" y1="8" x2="160" y2="20" stroke="#1b1b1b" stroke-width="2.5"/>' + d20(158, 36, 20);

// Visage, cheveux de devant, oreille, chapeau (sans les cheveux de dos)
const tete = p => `<g class="bf-tete">
      <path fill="${PEAU}" d="M200 150 C244 150 262 182 262 228 C262 282 236 322 200 326 C164 322 138 282 138 228 C138 182 156 150 200 150 Z"/>
      <path fill="${PEAU_OMBRE}" opacity=".75" d="M132 190 C166 202 234 202 268 190 L268 198 C234 210 166 210 132 198 Z"/>
      <g class="bf-sourcils"><path d="M160 205 Q176 198 192 204" stroke="${POILS}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M208 204 Q224 198 240 205" stroke="${POILS}" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g class="bf-oeil-g"><ellipse cx="173" cy="227" rx="9" ry="6.2" fill="#fff"/><circle cx="174" cy="227" r="4.8" fill="${IRIS}"/><circle cx="174" cy="227" r="2" fill="#1b1b1b"/></g>
      <g class="bf-oeil-d"><ellipse cx="227" cy="227" rx="9" ry="6.2" fill="#fff"/><circle cx="226" cy="227" r="4.8" fill="${IRIS}"/><circle cx="226" cy="227" r="2" fill="#1b1b1b"/></g>
      <path class="bf-clin" d="M218 229 Q227 222 236 229" stroke="${POILS}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0"/>
      <path class="bf-expr bf-yeux-dort" d="M164 228 Q173 234 182 228 M218 228 Q227 234 236 228" stroke="#1b1b1b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path class="bf-expr bf-yeux-rire" d="M164 231 Q173 219 182 231 M218 231 Q227 219 236 231" stroke="#1b1b1b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g fill="rgba(255,255,255,.1)" stroke="#121418" stroke-width="6" stroke-linejoin="round">
        <rect x="151" y="212" width="44" height="29" rx="5"/><rect x="205" y="212" width="44" height="29" rx="5"/>
      </g>
      <path d="M195 222 L205 222 M151 220 L139 216 M249 220 L261 216" stroke="#121418" stroke-width="5" stroke-linecap="round"/>
      <path d="M199 234 C197 252 193 261 190 267 C196 271 205 271 210 267" stroke="${PEAU_OMBRE}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path fill="${POILS}" fill-rule="evenodd" d="M181 287 C188 282 195 283 200 285 C205 283 212 282 219 287 C223 297 223 312 216 322 C211 329 206 332 200 332 C194 332 189 329 184 322 C177 312 177 297 181 287 Z
        M185 294 C193 297 207 297 215 294 C217 305 213 318 200 323 C187 318 183 305 185 294 Z"/>
      <path class="bf-bouche" d="M189 302 Q200 310 211 302" stroke="#B4655C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g class="bf-expr bf-bouche-rire"><path d="M186 298 Q200 326 214 298 Z" fill="#7A2E2E" stroke="#7A2E2E" stroke-width="2" stroke-linejoin="round"/>
        <path d="M189 299 H211 L209 304 H191 Z" fill="#fff"/></g>
      <ellipse class="bf-expr bf-bouche-o" cx="200" cy="308" rx="7" ry="9" fill="#7A2E2E"/>
      <circle cx="237" cy="268" r="2.6" fill="#7A4E36"/>
    </g>
    <path fill="${CHEVEUX}" d="${MECHE_G}"/>
    <path fill="${CHEVEUX}" d="${miroir(MECHE_G)}"/>
    <ellipse cx="143" cy="246" rx="7" ry="14" fill="${PEAU}"/>
    <ellipse cx="257" cy="246" rx="7" ry="14" fill="${PEAU}"/>
    <circle cx="259" cy="263" r="5.5" fill="none" stroke="#1b1b1b" stroke-width="3"/>
    <g class="bf-chapeau">
      <!-- Chapeau PORTÉ : pointes larges et anguleuses attachées à la calotte, couronne courbe sur le front -->
      <g transform="translate(-4 0)"><path class="bf-bleu-fonce" d="M160 124 L118 104 C84 92 46 104 26 138 C18 152 16 170 22 186 C34 168 52 158 74 156 C98 154 116 162 126 178 Z"/>
      <path class="bf-bleu" d="M162 122 L120 106 C88 96 54 108 36 138 C29 150 27 164 30 176 C42 160 60 150 80 149 C102 148 118 156 128 170 Z"/></g>
      <g transform="translate(4 0)"><path class="bf-bleu-fonce" d="M240 124 L282 104 C316 92 354 104 374 138 C382 152 384 170 378 186 C366 168 348 158 326 156 C302 154 284 162 274 178 Z"/>
      <path class="bf-bleu" d="M238 122 L280 106 C312 96 346 108 364 138 C371 150 373 164 370 176 C358 160 340 150 320 149 C298 148 282 156 272 170 Z"/></g>
      <path class="bf-rouge" stroke="#C5CCD6" stroke-opacity=".7" stroke-width="2.5" stroke-linejoin="round" d="M236 118 C244 86 240 52 222 28 C208 10 186 2 164 6 C176 14 184 26 186 40 C190 66 182 94 170 118 Z"/>
      <path class="bf-bleu" d="M112 178 C114 138 150 112 200 108 C250 112 286 138 288 178 C258 190 230 194 200 194 C170 194 142 190 112 178 Z"/>
      <path class="bf-or" d="${COURONNE}"/>
      <path class="bf-or-fonce" d="M110 176 C142 190 170 194 200 194 C230 194 258 190 290 176 L290 186 C258 200 230 204 200 204 C170 204 142 200 110 186 Z"/>
      <g class="bf-grelots">
        <circle class="bf-or" cx="20" cy="194" r="13"/><circle class="bf-or" cx="380" cy="194" r="13"/>
        <path d="M14 196 H26 M374 196 H386" stroke="rgba(0,0,0,.28)" stroke-width="3" stroke-linecap="round"/>
        ${D20_POINTE}
      </g>
    </g>`;

const clipChapeau = p => `<clipPath id="${p}-centre" clipPathUnits="userSpaceOnUse"><polygon points="1090,90 1245,90 1218,173 1190,232 1165,180 1095,150"/></clipPath>`;

const buste = p => `<svg class="bouffon-svg" style="overflow:visible" viewBox="0 -100 400 620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le bouffon Patagrain">
  <defs>${clipChapeau(p)}
    <clipPath id="${p}-gauche"><rect x="0" y="300" width="200" height="300"/></clipPath>
    <clipPath id="${p}-droite"><rect x="200" y="300" width="200" height="300"/></clipPath></defs>
  <g class="bf-tout">
    <path fill="${CHEVEUX_FONCE}" d="${CHEVEUX_DOS}"/>
    <path class="bf-bleu" clip-path="url(#${p}-gauche)" d="M58 520 C60 440 100 392 150 378 L200 373 L250 378 C300 392 340 440 342 520 Z"/>
    <path class="bf-habit" clip-path="url(#${p}-droite)" d="M58 520 C60 440 100 392 150 378 L200 373 L250 378 C300 392 340 440 342 520 Z"/>
    <path fill="${PEAU_OMBRE}" d="M178 300 L222 300 L226 386 L174 386 Z"/>
    ${collerette(374)}
    ${tete(p)}
  </g>
</svg>`;

// ---------- Personnage en pied, articulé ----------
// Pivots (en unités du dessin) : épaules (150,392)/(250,392), coudes (x,470), hanches (178,594)/(222,594), genoux (x,682)
function bras(cote, classe, epee = false) {
  const x = cote === 'g' ? 116 : 284;
  const sabre = epee ? `<image class="bf-sabre" href="../assets/epee.svg" x="${x - 32}" y="${556 - 44}" width="64" height="208"/>` : '';
  return `<g class="bf-epaule-${cote}" style="transform-origin:${x}px 392px">
      <rect class="${classe}" x="${x - 15}" y="380" width="30" height="96" rx="15"/>
      <g class="bf-coude-${cote}" style="transform-origin:${x}px 470px">
        <rect class="${classe}" x="${x - 13}" y="462" width="26" height="86" rx="13"/>
        <rect class="bf-or" x="${x - 14}" y="530" width="28" height="9" rx="4"/>
        ${sabre}
        <circle cx="${x}" cy="552" r="15" fill="${PEAU}"/>
      </g>
    </g>`;
}

function jambe(cote, classe) {
  const x = cote === 'g' ? 176 : 224;
  const sens = cote === 'g' ? -1 : 1;   // la pointe du soulier part vers l'extérieur
  const f = dx => g(x + sens * dx);
  const soulier = `M${f(-15)} 760 L${f(-15)} 782 C${f(0)} 790 ${f(30)} 790 ${f(44)} 776 ` +
    `C${f(50)} 770 ${f(52)} 760 ${f(46)} 756 C${f(40)} 765 ${f(26)} 768 ${f(15)} 760 Z`;
  return `<g class="bf-hanche-${cote}" style="transform-origin:${x}px 594px">
      <rect class="${classe}" x="${x - 17}" y="586" width="34" height="100" rx="15"/>
      <g class="bf-genou-${cote}" style="transform-origin:${x}px 682px">
        <rect class="${classe}" x="${x - 15}" y="676" width="30" height="90" rx="13"/>
        <path class="bf-soulier" d="${soulier}"/>
        <circle class="bf-or" cx="${f(47)}" cy="752" r="7"/>
      </g>
    </g>`;
}

function pied(p, epee = false) {
  const pointes = [];
  for (let i = 0; i < 7; i++) {
    const a = 108 + i * 184 / 7, b = a + 184 / 7, c = (a + b) / 2;
    const classe = i % 2 === 0 ? 'bf-bleu' : 'bf-habit';
    pointes.push(`<polygon class="${classe}" points="${f1(a)},588 ${f1(b)},588 ${f1(c)},618"/><circle class="bf-or" cx="${f1(c)}" cy="621" r="5.5"/>`);
  }
  const tunique = 'M112 384 C150 368 250 368 288 384 L268 532 L292 590 L108 590 L132 532 Z';
  return `<svg class="bouffon-svg bouffon-pied" style="overflow:visible" viewBox="0 -110 400 920" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le bouffon Patagrain">
  <defs>${clipChapeau(p)}
    <clipPath id="${p}-gauche"><rect x="0" y="300" width="200" height="400"/></clipPath>
    <clipPath id="${p}-droite"><rect x="200" y="300" width="200" height="400"/></clipPath></defs>
  <g class="bf-tout" style="transform-origin:200px 790px">
    ${jambe('g', 'bf-habit')}
    ${jambe('d', 'bf-bleu')}
    <g class="bf-haut" style="transform-origin:200px 380px"><path fill="${CHEVEUX_FONCE}" d="${CHEVEUX_DOS}"/></g>   <!-- cheveux de dos : bougent avec la tête (même classe bf-haut) -->
    <path fill="${PEAU_OMBRE}" d="M178 300 L222 300 L226 386 L174 386 Z"/>
    <path class="bf-bleu" clip-path="url(#${p}-gauche)" d="${tunique}"/>
    <path class="bf-habit" clip-path="url(#${p}-droite)" d="${tunique}"/>
    ${pointes.join('')}
    <rect class="bf-or" x="130" y="520" width="140" height="16" rx="7"/>
    <rect class="bf-bleu-fonce" x="190" y="517" width="20" height="22" rx="4"/>
    ${collerette(372)}
    ${bras('g', 'bf-habit')}
    ${epee ? '' : bras('d', 'bf-bleu')}
    <g class="bf-haut" style="transform-origin:200px 380px">${tete(p)}</g>
    ${epee ? bras('d', 'bf-bleu', true) : ''}
  </g>
</svg>`;
}

const STYLE_BOUFFON = `.bf-bleu { fill: var(--primaire, #3A9AD9); }
.bf-bleu-fonce { fill: var(--primaire-fonce, #1F6FA8); }
.bf-rouge { fill: var(--bouffon-noir, #232834); }
.bf-or { fill: var(--accent, #F5B82E); }
.bf-d20-clair { fill: color-mix(in srgb, var(--primaire, #3A9AD9) 60%, #fff); }
.bf-or-fonce { fill: color-mix(in srgb, var(--accent, #F5B82E) 70%, #000); }
.bf-habit { fill: var(--bouffon-habit, #16181E); }
.bf-soulier { fill: var(--bouffon-soulier, #2A303C); }
.bf-expr { display: none; }
.expr-rire .bf-oeil-g, .expr-rire .bf-oeil-d, .expr-rire .bf-bouche, .expr-choc .bf-bouche, .expr-clin .bf-oeil-d, .expr-dort .bf-oeil-g, .expr-dort .bf-oeil-d { display: none; }
.expr-dort .bf-yeux-dort { display: inline; }
.sans-chapeau .bf-chapeau { display: none; }
.expr-rire .bf-yeux-rire, .expr-rire .bf-bouche-rire, .expr-choc .bf-bouche-o { display: inline; }
.expr-clin .bf-clin { opacity: 1; }
.expr-clin .bf-bouche { transform: scale(1.25, 1.4); transform-box: fill-box; transform-origin: 50% 0; }
.expr-choc .bf-oeil-g, .expr-choc .bf-oeil-d { transform: scale(1.45); transform-box: fill-box; transform-origin: 50% 50%; }
.expr-choc .bf-sourcils { transform: translateY(-8px); }`;

const avecStyle = s => s.replace('<defs>', `<style>${STYLE_BOUFFON}</style><defs>`);

const js = `/* =====================================================================
   LE BOUFFON — mascotte de Patagrain, dessinée d'après ses photos :
   cheveux longs raides (juste sous les épaules), raie au milieu, lunettes
   noires, yeux vert-gris, collier de barbe, anneau à l'oreille, grain de
   beauté ; chapeau de bouffon du logo.
     Bouffon.svg('buste')          portrait (défaut)
     Bouffon.svg('tete')           portrait recadré sur la tête (emotes)
     Bouffon.svg('pied')           personnage entier articulé
     Bouffon.svg('pied', { epee: true })  … avec l'épée à la main
     Bouffon.svg('tete', { expression: 'clin' | 'rire' | 'choc' | 'dort' })  expressions (emotes)
     classe « sans-chapeau » sur un parent : cache son chapeau (scène Jeu : le chapeau de la cam se soulève)
   Bouffon noir et bleu : bleu du thème, noirs --bouffon-habit / --bouffon-noir, or du thème.
   Articulations animables : .bf-epaule-g/d, .bf-coude-g/d, .bf-hanche-g/d,
   .bf-genou-g/d, .bf-haut (tête), .bf-chapeau, .bf-oeil-d (clin d'œil).
   Fichier généré — ne pas modifier à la main.
   ===================================================================== */
const Bouffon = (() => {
  const BUSTE = \`${avecStyle(buste('__P__'))}\`;
  const PIED = \`${avecStyle(pied('__P__'))}\`;
  const PIED_EPEE = \`${avecStyle(pied('__P__', true))}\`;
  let n = 0;
  // expression : 'clin' (clin d'œil), 'rire' (mort de rire), 'choc' (choqué), 'dort' (endormi) — rien = sourire
  function svg(forme = 'buste', { epee = false, expression = '' } = {}) {
    const id = 'bf' + (++n);
    let s = forme === 'pied' ? (epee ? PIED_EPEE : PIED).replaceAll('__P__', id) : BUSTE.replaceAll('__P__', id);
    if (forme === 'tete') s = s.replace('viewBox="0 -100 400 620"', 'viewBox="10 -100 380 450"');
    return expression ? s.replace('class="bouffon-svg', 'class="bouffon-svg expr-' + expression) : s;
  }
  return { svg };
})();
`;
const ecrire = (chemin, texte) => writeFileSync(join(RACINE, ...chemin.split('/')), texte, 'utf8');
ecrire('js/bouffon.js', js);
ecrire('assets/bouffon.svg', avecStyle(buste('bf')));
ecrire('assets/bouffon-pied.svg', avecStyle(pied('bf')));
console.log('ok', js.length);

// ---------------------------------------------------------------------
// Le chapeau seul et le logo, repris du dessin ci-dessus
// ---------------------------------------------------------------------
// Extrait un groupe <g …> complet (balises équilibrées) à partir de l'indice i
function groupe(texte, i) {
  let prof = 0, j = i;
  for (;;) {
    const o = texte.indexOf('<g', j), f = texte.indexOf('</g>', j);
    if (o !== -1 && o < f) { prof++; j = o + 2; } else { prof--; j = f + 4; if (prof === 0) return j; }
  }
}
const b = readFileSync(join(RACINE, 'assets', 'bouffon.svg'), 'utf8');
const i = b.indexOf('<g class="bf-chapeau">');
const chapeau = b.slice(i, groupe(b, i)).replace(/<!--.*?-->/g, '');
const versLogo = { 'bf-bleu-fonce': 'pg-bleu-fonce', 'bf-bleu': 'pg-bleu', 'bf-rouge': 'pg-rouge', 'bf-or-fonce': 'pg-or-fonce', 'bf-or': 'pg-or', 'bf-d20-clair': 'pg-d20-clair' };
const classesLogo = s => s.replace(/class="([^"]+)"/g, (_, c) => 'class="' + c.split(/\s+/).map(x => versLogo[x] || x).join(' ') + '"');

const STYLE_LOGO = `<style>
    .pg-bleu { fill: var(--logo-bleu, #3A9AD9); }
    .pg-bleu-fonce { fill: var(--logo-bleu-fonce, #1F6FA8); }
    .pg-or { fill: var(--logo-or, #F5B82E); }
    .pg-or-fonce { fill: #AD8120; }
    .pg-d20-clair { fill: #8CC5EB; }
    .pg-rouge { fill: var(--logo-chapeau, #232834); }
  </style>`;

// 1. Le chapeau seul (icônes, cadre cam, badges, kit)
const seul = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 -4 392 214" role="img" aria-label="Chapeau de bouffon">
  ${STYLE_LOGO}
  ${classesLogo(chapeau).replace('class="pg-chapeau"', '')}
</svg>
`;
ecrire('assets/chapeau.svg', seul);

// 2. Le logo avec ce même chapeau sur le « n »
const logo = readFileSync(join(RACINE, 'design', 'archives', 'logo-ancien-chapeau.svg'), 'utf8');
const k = logo.indexOf('<g id="chapeau">');
const m = groupe(logo, k);
const s = 0.8, cx = 1188, bas = 294;          // échelle, centre du « n », bas de la couronne posé sur le « n »
const nouveau = `<g id="chapeau" transform="translate(${f1(cx - 200 * s)} ${f1(bas - 197 * s)}) scale(${s})">${classesLogo(chapeau)}</g>`;
const logo2 = (logo.slice(0, k) + nouveau + logo.slice(m))
  .replace('<style>', '<style>\n    .pg-or-fonce { fill: #AD8120; }\n    .pg-d20-clair { fill: #8CC5EB; }')
  .replace('viewBox="171 90 1153 397"', 'viewBox="171 90 1185 397"');   // un peu plus large : la cloche droite du chapeau
ecrire('assets/logo-couleur.svg', logo2);

// 3. Le logo avec un contour crème (comme un autocollant) : lisible sur n'importe quel jeu (scène Jeu)
const CONTOUR = `<filter id="pg-contour" x="-4%" y="-8%" width="108%" height="116%">
    <feMorphology in="SourceAlpha" operator="dilate" radius="10" result="epais"/>
    <feFlood flood-color="#FFF3DC"/><feComposite in2="epais" operator="in" result="contour"/>
    <feMerge><feMergeNode in="contour"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;
const logo3 = logo2
  .replace('<defs>', `<defs>\n  ${CONTOUR}`)
  .replace('</defs>', '</defs>\n  <g filter="url(#pg-contour)">')
  .replace(/<\/svg>\s*$/, '</g>\n</svg>\n')
  .replace('viewBox="171 90 1185 397"', 'viewBox="159 78 1209 421"');   // un peu de marge pour le contour
ecrire('assets/logo-contour.svg', logo3);
console.log('ok', seul.length, logo2.length, logo3.length);
