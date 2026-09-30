/* =====================================================================
   Générateur du fond « cristal » : facettes sombres + éclats lumineux
   dans la couleur d'accent. Même graine = même motif, et même instant
   d'animation d'une page à l'autre (voir « Respiration calée sur l'horloge »).
   ===================================================================== */
function fondNeon({ graine = 7, colonnes = 9, lignes = 6 } = {}) {
  const W = 1920, H = 1080;

  // Générateur pseudo-aléatoire reproductible
  let a = graine * 9973 + 17;
  const alea = () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // --- Points : grille déformée (les bords restent sur les bords) ---
  const cw = W / colonnes, ch = H / lignes;
  const pts = [];
  for (let j = 0; j <= lignes; j++) {
    pts[j] = [];
    for (let i = 0; i <= colonnes; i++) {
      const bordX = i === 0 || i === colonnes, bordY = j === 0 || j === lignes;
      pts[j][i] = {
        x: i * cw + (bordX ? 0 : (alea() - .5) * cw * .75),
        y: j * ch + (bordY ? 0 : (alea() - .5) * ch * .75),
        z: alea(),
      };
    }
  }

  // --- Triangles (chaque case coupée par une diagonale au hasard) + arêtes ---
  const tris = [], aretes = new Map(), voisins = new Map();
  const cle = (p, q) => p < q ? p + '|' + q : q + '|' + p;
  const id = (i, j) => j * (colonnes + 1) + i;
  const pt = k => pts[Math.floor(k / (colonnes + 1))][k % (colonnes + 1)];
  function arete(p, q) {
    aretes.set(cle(p, q), [p, q]);
    (voisins.get(p) || voisins.set(p, []).get(p)).push(q);
    (voisins.get(q) || voisins.set(q, []).get(q)).push(p);
  }
  for (let j = 0; j < lignes; j++) for (let i = 0; i < colonnes; i++) {
    const A = id(i, j), B = id(i + 1, j), Cc = id(i + 1, j + 1), D = id(i, j + 1);
    const t = alea() < .5 ? [[A, B, Cc], [A, Cc, D]] : [[A, B, D], [B, Cc, D]];
    t.forEach(tr => { tris.push(tr); arete(tr[0], tr[1]); arete(tr[1], tr[2]); arete(tr[2], tr[0]); });
  }

  // --- Ombrage : chaque facette a une « pente », éclairée depuis le haut-gauche ---
  const L = [-.45, -.55, .7], nL = Math.hypot(...L); L.forEach((v, k) => L[k] = v / nL);
  const RELIEF = 260;
  let svg = '';
  tris.forEach(([p, q, r]) => {
    const P = pt(p), Q = pt(q), R = pt(r);
    const u = [Q.x - P.x, Q.y - P.y, (Q.z - P.z) * RELIEF], v = [R.x - P.x, R.y - P.y, (R.z - P.z) * RELIEF];
    let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    if (n[2] < 0) n = n.map(x => -x);
    const nn = Math.hypot(...n);
    const eclairage = Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / nn);
    const l = (2.5 + Math.pow(eclairage, 3) * 16 + alea() * 2.5).toFixed(1);
    svg += `<polygon points="${P.x.toFixed(1)},${P.y.toFixed(1)} ${Q.x.toFixed(1)},${Q.y.toFixed(1)} ${R.x.toFixed(1)},${R.y.toFixed(1)}" fill="hsl(200 6% ${l}%)"/>`;
  });

  // Fines arêtes claires
  let traits = '';
  aretes.forEach(([p, q]) => {
    if (alea() < .55) return;
    const P = pt(p), Q = pt(q);
    traits += `M${P.x.toFixed(1)},${P.y.toFixed(1)}L${Q.x.toFixed(1)},${Q.y.toFixed(1)}`;
  });
  svg += `<path d="${traits}" stroke="rgba(255,255,255,.05)" stroke-width="1.2" fill="none"/>`;

  // --- Éclats : courts chemins le long des arêtes, dégradés dans la couleur d'accent ---
  let defs = '', eclats = '';
  const interieur = k => { const i = k % (colonnes + 1), j = Math.floor(k / (colonnes + 1)); return i > 0 && i < colonnes && j > 0 && j < lignes; };
  const departs = [...voisins.keys()].filter(interieur);
  for (let e = 0; e < 7; e++) {
    let k = departs[Math.floor(alea() * departs.length)];
    const chemin = [k];
    const pas = 1 + Math.floor(alea() * 3);
    for (let s = 0; s < pas; s++) {
      const options = voisins.get(k).filter(x => !chemin.includes(x));
      if (!options.length) break;
      k = options[Math.floor(alea() * options.length)];
      chemin.push(k);
    }
    const P0 = pt(chemin[0]), P1 = pt(chemin[chemin.length - 1]);
    const g = `eclat${e}`;
    defs += `<linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="${P0.x}" y1="${P0.y}" x2="${P1.x}" y2="${P1.y}">
      <stop offset="0" style="stop-color:var(--accent);stop-opacity:0"/>
      <stop offset="${(.35 + alea() * .3).toFixed(2)}" style="stop-color:var(--accent);stop-opacity:1"/>
      <stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/></linearGradient>`;
    const d = 'M' + chemin.map(c => { const p = pt(c); return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join('L');
    // Respiration calée sur l'horloge : toutes les pages (overlay, source fond…) sont au même
    // instant de l'animation, où qu'elles en soient de leur chargement → fonds raccord.
    const duree = 7 + alea() * 6, decalage = -alea() * 8;
    const style = `--d:${duree.toFixed(1)}s;--r:${(decalage - (Date.now() / 1000) % +duree.toFixed(1)).toFixed(3)}s`;
    eclats += `<g class="eclat" style="${style}">
      <path d="${d}" stroke="url(#${g})" stroke-width="16" fill="none" filter="url(#flou)" opacity=".9"/>
      <path d="${d}" stroke="url(#${g})" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
    // Fuseau lumineux sur un segment du chemin
    if (chemin.length > 1 && alea() < .8) {
      const s = Math.floor(alea() * (chemin.length - 1));
      const A = pt(chemin[s]), B = pt(chemin[s + 1]), t = .3 + alea() * .4;
      const x = A.x + (B.x - A.x) * t, y = A.y + (B.y - A.y) * t;
      const ang = Math.atan2(B.y - A.y, B.x - A.x) * 180 / Math.PI;
      eclats += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(40 + alea() * 40).toFixed(0)}" ry="7" fill="url(#fuseau)" transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" filter="url(#flou-leger)"/>`;
    }
    eclats += '</g>';
  }

  // Quelques reflets blancs discrets
  const liste = [...aretes.values()];
  for (let e = 0; e < 4; e++) {
    const [p, q] = liste[Math.floor(alea() * liste.length)];
    const P = pt(p), Q = pt(q), g = `reflet${e}`;
    defs += `<linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="${P.x}" y1="${P.y}" x2="${Q.x}" y2="${Q.y}">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
    eclats += `<path d="M${P.x},${P.y}L${Q.x},${Q.y}" stroke="url(#${g})" stroke-width="1.6"/>`;
  }

  return `<svg class="plein" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="flou" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
      <filter id="flou-leger" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="2.5"/></filter>
      <radialGradient id="fuseau">
        <stop offset="0" stop-color="#fff" stop-opacity=".95"/>
        <stop offset=".35" style="stop-color:var(--accent);stop-opacity:.9"/>
        <stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/>
      </radialGradient>
      <radialGradient id="vignette" cx=".5" cy=".5" r=".75">
        <stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/>
      </radialGradient>
      ${defs}
    </defs>
    ${svg}
    ${eclats}
    <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  </svg>`;
}
