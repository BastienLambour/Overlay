/* =====================================================================
   SQUELETTE — le personnage EN PIED, sur le squelette du bouffon de Patagrain (le même moteur de gestes partout).
   Une fiche d'apparence (ses traits) est HABILLÉE sur le squelette : aucun dessin à la main. La tête est celle du buste
   (Apparence.calques), le corps est construit d'après la tenue, la carrure, la taille et les objets tenus.
     Squelette.svg(fiche, { filtre, expression, forme, accent }) → <svg class="bouffon-svg bouffon-pied cs-squelette">, viewBox 0 -110 400 920
     Squelette.pieces(fiche, partie) → les calques d'un morceau (Apparence.calques(fiche, { cadrage: 'squelette', partie }) y mène)
     Squelette.poserStyle()          → pose le MOTEUR des gestes (src/squelette.css) dans la page (une fois)
   Articulations (les mêmes que le bouffon) : .bf-tout › .bf-hanche-g/d › .bf-genou-g/d · .bf-haut › .bf-cheveux, .bf-tete ·
   .bf-epaule-g/d › .bf-coude-g/d. Un GESTE = une classe sur un parent (marche, saute, chute, hop, danse, gj-courir, gj-sort, attaque…).
   ===================================================================== */
const Squelette = (() => {
  const T = (h, k) => Apparence.teinte(h, k);
  const n = v => +(+v).toFixed(1);
  const pilule = (x, y, l, h, r) => `M${n(x + r)} ${n(y)} H${n(x + l - r)} Q${n(x + l)} ${n(y)} ${n(x + l)} ${n(y + r)} V${n(y + h - r)} Q${n(x + l)} ${n(y + h)} ${n(x + l - r)} ${n(y + h)} H${n(x + r)} Q${n(x)} ${n(y + h)} ${n(x)} ${n(y + h - r)} V${n(y + r)} Q${n(x)} ${n(y)} ${n(x + r)} ${n(y)} Z`;
  const rond = (x, y, r) => `M${n(x - r)} ${n(y)} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
  // (seulement des M / L / C : on peut les élargir et les descendre)
  const etirer = (d, k) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${n(200 + (x - 200) * k)} ${y}`);
  const descendre = (d, dy) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${x} ${n(+y + dy)}`);

  // La taille : petite (nain, halfelin) = jambes plus courtes, le haut du corps descend ; grande = plus élancé
  const GABARITS = { normale: { dy: 0, hanche: 594, genou: 682 }, petite: { dy: 70, hanche: 664, genou: 716 }, grande: { dy: -34, hanche: 560, genou: 666 } };
  function gabarit(f) {
    const g = GABARITS[f.taille] || GABARITS.normale, k = { large: 1.14, petite: .9 }[f.carrure] || 1;
    return { ...g, k, epaule: [n(200 - 84 * k), n(200 + 84 * k)], hancheX: [n(200 - 24 * k), n(200 + 24 * k)],
      tete: { x: 57, y: 90 + g.dy, l: 286, h: 343 } };   // le buste 200 × 240 posé sur le cou (visage 138 → 262, 150 → 326)
  }

  const TRONC = {
    tunique: 'M112 384 C150 368 250 368 288 384 L272 532 L286 590 L114 590 L128 532 Z',
    cuir: 'M112 384 C150 368 250 368 288 384 L274 540 L282 594 L118 594 L126 540 Z',
    armure: 'M108 384 C150 366 250 366 292 384 L278 540 L288 596 L112 596 L122 540 Z',
    robe: 'M112 384 C150 368 250 368 288 384 L306 744 C250 762 150 762 94 744 Z',
    mage: 'M112 384 C150 368 250 368 288 384 L308 746 C250 764 150 764 92 746 Z',
    cape: 'M112 384 C150 368 250 368 288 384 L272 532 L286 590 L114 590 L128 532 Z',
  };
  const longue = t => t === 'robe' || t === 'mage';

  // Les objets tenus : x, y = la main ; s = +1 côté droit de l'image (vers l'extérieur), -1 côté gauche.
  // Les armes pointent VERS LE BAS au repos (le long de la jambe) : quand le bras se lève pour frapper, elles pointent en l'air.
  function objet(nom, x, y, s, f, t2) {
    const X = dx => n(x + s * dx), Y = dy => n(y + dy);
    const bois = '#7A5230', acier = '#C5CBD3', fer = '#5A6270', lueur = f.couleurObjet || '#7FE0FF';
    const P = (d, fond, trait, ep) => ({ id: 'objet', d, partie: 'detail', fond, trait: trait === undefined ? (fond ? T(fond, -.5) : null) : trait, epaisseur: ep || (fond ? 2 : 3) });
    const lame = `M${X(-5)} ${Y(10)} L${X(5)} ${Y(10)} L${X(6)} ${Y(196)} L${X(0)} ${Y(222)} L${X(-6)} ${Y(196)} Z`;
    const garde = `M${X(-24)} ${Y(2)} L${X(24)} ${Y(2)} L${X(24)} ${Y(12)} L${X(-24)} ${Y(12)} Z`;
    const poignee = `M${X(-5)} ${Y(-26)} L${X(5)} ${Y(-26)} L${X(5)} ${Y(4)} L${X(-5)} ${Y(4)} Z`;
    const manche = (a, b) => `M${X(-5)} ${Y(a)} L${X(5)} ${Y(a)} L${X(5)} ${Y(b)} L${X(-5)} ${Y(b)} Z`;
    switch (nom) {
      case 'epee': return [P(lame, '#DDE2E8', fer), P(garde, '#C9A23A'), P(poignee, '#5A3A22')];
      case 'epee-magique': return [P(lame, null, lueur, 14), P(lame, T(lueur, .55), lueur, 3), P(`M${X(0)} ${Y(40)} L${X(0)} ${Y(180)}`, null, '#FFFFFF', 2), P(garde, '#8E6BD6'), P(poignee, '#3A2A5A')];
      case 'hache': return [P(manche(-30, 176), bois),
        P(`M${X(5)} ${Y(112)} C${X(44)} ${Y(96)} ${X(62)} ${Y(124)} ${X(58)} ${Y(178)} C${X(40)} ${Y(166)} ${X(20)} ${Y(160)} ${X(5)} ${Y(164)} Z`, acier, fer),
        P(`M${X(-5)} ${Y(124)} L${X(-22)} ${Y(138)} L${X(-5)} ${Y(152)} Z`, acier, fer)];
      case 'hachoir': return [P(manche(-24, 34), bois), P(`M${X(-8)} ${Y(30)} L${X(50)} ${Y(30)} L${X(50)} ${Y(96)} L${X(-8)} ${Y(96)} Z`, acier, fer), P(rond(X(36), Y(44), 4), '#3A3A3A', null)];
      case 'masse': return [P(manche(-24, 132), bois), P(`M${X(-18)} ${Y(128)} L${X(18)} ${Y(128)} L${X(22)} ${Y(172)} L${X(-22)} ${Y(172)} Z`, '#8A939E', '#4A5260'),
        P(`M${X(-22)} ${Y(140)} L${X(-34)} ${Y(150)} L${X(-22)} ${Y(160)} Z M${X(22)} ${Y(140)} L${X(34)} ${Y(150)} L${X(22)} ${Y(160)} Z`, '#8A939E', '#4A5260')];
      case 'baton': return [P(manche(-176, 232), bois), P(rond(X(0), Y(-190), 15), lueur === '#7FE0FF' ? '#9B5DE5' : lueur), P(rond(X(-4), Y(-195), 4), '#FFFFFF', null)];
      case 'arc': return [P(`M${X(10)} ${Y(-150)} C${X(62)} ${Y(-60)} ${X(62)} ${Y(60)} ${X(10)} ${Y(150)} L${X(18)} ${Y(150)} C${X(72)} ${Y(60)} ${X(72)} ${Y(-60)} ${X(18)} ${Y(-150)} Z`, bois),
        P(`M${X(12)} ${Y(-150)} L${X(12)} ${Y(150)}`, null, '#EDE6D2', 2)];
      case 'arbalete': return [P(`M${X(-12)} ${Y(-9)} L${X(84)} ${Y(-9)} L${X(84)} ${Y(9)} L${X(-12)} ${Y(9)} Z`, bois),
        P(`M${X(72)} ${Y(-44)} C${X(88)} ${Y(-22)} ${X(88)} ${Y(22)} ${X(72)} ${Y(44)}`, null, '#5A3A22', 6), P(`M${X(72)} ${Y(-44)} L${X(60)} ${Y(0)} L${X(72)} ${Y(44)}`, null, '#EDE6D2', 2)];
      case 'bouclier': return [P(rond(X(8), Y(-34), 48), t2, T(t2, -.5), 4), P(rond(X(8), Y(-34), 30), null, T(t2, .3), 3), P(rond(X(8), Y(-34), 10), '#C9A23A')];
      case 'livre': return [P(`M${X(-22)} ${Y(-12)} L${X(28)} ${Y(-18)} L${X(30)} ${Y(36)} L${X(-20)} ${Y(42)} Z`, '#7A2E2E', '#3A1414'), P(`M${X(4)} ${Y(-14)} L${X(6)} ${Y(38)}`, null, '#EDE2C8', 3)];
      case 'kazoo': return [P(`M${X(-10)} ${Y(-8)} L${X(44)} ${Y(-16)} L${X(48)} ${Y(2)} L${X(-8)} ${Y(8)} Z`, '#E8A33A', '#7A4E12'), P(rond(X(22), Y(-6), 4), '#3A2A1A', null)];
      default: return [];
    }
  }

  // Les calques d'UN morceau, en unités du squelette
  function pieces(fiche, partie) {
    const f = fiche || {}, G = gabarit(f), dy = G.dy, k = G.k;
    const t = f.tenue || {}, tt = TRONC[t.type] ? t.type : 'tunique', tc = t.couleur || f.couleur || '#4F7CAC';
    const t2 = t.couleur2 || T(tc, .35), peau = f.peau || '#E8B894', ombre = T(peau, -.18);
    const accs = [].concat(f.accessoire || []);
    const pantalon = T(tc, -.55), souliers = '#3A2A1C', manche = tc, manche2 = T(tc, -.08);
    const L = [];
    const pousser = (id, d, p, fond, trait = null, epaisseur = 0) => { if (d) L.push({ id, d, partie: p, fond, trait, epaisseur }); };
    const haut = d => descendre(etirer(d, k), dy);                       // une forme du haut du corps : élargie (carrure), descendue (taille)
    const cote = partie.slice(-1), x = { g: G.epaule[0], d: G.epaule[1] }[cote], s = cote === 'g' ? -1 : 1;
    if (partie === 'dos') {
      if (accs.includes('ours')) pousser('ours', haut('M116 378 C86 500 78 640 86 722 L102 708 L116 728 L132 708 L148 730 L166 708 L182 730 L200 708 L218 730 L234 708 L252 730 L268 708 L284 728 L298 708 L314 722 C322 640 314 500 284 378 Z'), 'tenue', '#5A4030', '#3A2A1E', 2);
      else if (tt === 'cape' || accs.includes('capuche')) pousser('cape', haut('M124 384 C96 520 86 680 92 772 C150 792 250 792 308 772 C314 680 304 520 276 384 Z'), 'tenue', T(tc, -.3));
      if (f.objet === 'carquois' || f.objet2 === 'carquois') {
        pousser('carquois', haut('M236 380 L266 372 L300 540 L270 548 Z'), 'detail', '#7A5230', '#3A2414', 2);
        pousser('fleches', haut('M244 380 L234 336 M254 376 L248 330 M264 374 L262 332'), 'detail', null, '#EDE6D2', 3);
      }
    } else if (partie === 'torse') {
      pousser('cou', descendre('M178 300 L222 300 L226 386 L174 386 Z', dy), 'peau', ombre);
      pousser('tronc', haut(TRONC[tt]), 'tenue', tc);
      if (tt === 'armure') pousser('plaques', haut('M200 388 L200 520 M134 430 C170 446 230 446 266 430 M128 480 C170 496 230 496 272 480'), 'detail', null, T(tc, -.4), 4);
      if (tt === 'cuir') { pousser('sangle', haut('M130 396 L270 524'), 'detail', null, T(tc, -.45), 9); pousser('rivets', [rond(n(200 - 50 * k), 404 + dy, 4), rond(n(200 + 50 * k), 404 + dy, 4), rond(n(200 - 54 * k), 470 + dy, 4), rond(n(200 + 54 * k), 470 + dy, 4)].join(' '), 'detail', '#D7DCE2', '#6A7078', 1.5); }
      if (tt === 'mage') { pousser('galons', haut('M200 392 L200 744 M98 728 C150 744 250 744 302 728'), 'detail', null, t.couleur2 || '#D9A72E', 6); pousser('etoiles', [rond(150, 620 + dy, 5), rond(250, 560 + dy, 5), rond(162, 500 + dy, 4), rond(244, 680 + dy, 4)].join(' '), 'detail', t.couleur2 || '#D9A72E', null); }
      if (tt !== 'armure') pousser('col', haut('M176 382 L200 422 L224 382 Z'), 'tenue', t2);
      pousser('ceinture', longue(tt) ? pilule(n(200 - 66 * k), 470 + dy, n(132 * k), 14, 6) : pilule(n(200 - 76 * k), 520 + dy, n(152 * k), 16, 6), 'tenue', longue(tt) ? t2 : '#5A3A22');
      if (accs.includes('tablier')) { pousser('tablier', haut('M146 432 L254 432 L266 652 L134 652 Z'), 'tenue', '#F2EEE4', '#B9B2A2', 2); pousser('bretelles', haut('M150 432 L178 386 M250 432 L222 386'), 'detail', null, '#B9B2A2', 5); }
      if (accs.includes('griffes')) { pousser('cordon', haut('M160 390 C180 406 220 406 240 390'), 'detail', null, '#5A3A22', 3);
        pousser('griffes', haut([164, 180, 196, 212, 228].map((gx, i) => `M${gx} ${398 + (i === 2 ? 6 : i % 4 ? 4 : 0)} L${gx + 4} ${420 + (i === 2 ? 6 : i % 4 ? 4 : 0)} L${gx + 8} ${398 + (i === 2 ? 6 : i % 4 ? 4 : 0)} Z`).join(' ')), 'detail', '#EFE6CE', '#7A6A4A', 1.5); }
      if (accs.includes('ours')) pousser('ours-epaules', haut('M110 392 C120 366 160 360 176 372 L170 388 L186 380 L200 392 L214 380 L230 388 L224 372 C240 360 280 366 290 392 C270 384 250 388 236 396 L200 404 L164 396 C150 388 130 384 110 392 Z'), 'tenue', '#6A4C36', '#3A2A1E', 2);
      if (tt === 'cape' || accs.includes('capuche') || accs.includes('ours')) pousser('fermoir', pilule(192, 384 + dy, 16, 16, 4), 'detail', '#F5C542', '#8A6A1A', 1.5);
    } else if (partie === 'bras-g' || partie === 'bras-d') {
      pousser('manche', pilule(x - 15, 380 + dy, 30, 96, 15), 'tenue', manche);
      if (tt === 'armure' || tt === 'cuir') pousser('epauliere', `M${n(x - 28)} ${400 + dy} C${n(x - 28)} ${372 + dy} ${n(x + 28)} ${372 + dy} ${n(x + 28)} ${400 + dy} Z`, 'tenue', tt === 'armure' ? '#9AA3AE' : T(tc, -.3), tt === 'armure' ? '#4A5260' : T(tc, -.6), 2);
    } else if (partie === 'avant-bras-g' || partie === 'avant-bras-d') {
      pousser('avant-bras', pilule(x - 13, 462 + dy, 26, 86, 13), 'tenue', manche2);
      pousser('poignet', pilule(x - 14, 530 + dy, 28, 9, 4), 'tenue', t2);
    } else if (partie === 'main-g' || partie === 'main-d') {
      pousser('main', rond(x, 552 + dy, 15), 'peau', peau, T(peau, -.3), 2);
    } else if (partie === 'objet-g' || partie === 'objet-d') {
      const nom = cote === 'd' ? f.objet : f.objet2;
      if (nom && nom !== 'carquois') L.push(...objet(nom, x, 552 + dy, s, f, t2));
    } else if (/^(cuisse|tibia)-[gd]$/.test(partie)) {
      const hx = { g: G.hancheX[0], d: G.hancheX[1] }[cote];
      if (partie.startsWith('cuisse')) { if (!longue(tt)) pousser('cuisse', pilule(hx - 17, G.hanche - 8, 34, G.genou - G.hanche + 14, 15), 'tenue', pantalon); }
      else {
        if (!longue(tt)) pousser('tibia', pilule(hx - 15, G.genou - 6, 30, 772 - G.genou, 13), 'tenue', T(pantalon, -.1));
        const F = dx => n(hx + s * dx);
        pousser('soulier', `M${F(-15)} 760 L${F(-15)} 782 C${F(0)} 790 ${F(30)} 790 ${F(40)} 778 C${F(44)} 772 ${F(42)} 762 ${F(36)} 758 C${F(28)} 762 ${F(22)} 764 ${F(15)} 760 Z`, 'tenue', souliers);
      }
    }
    return L;
  }

  // ---------- L'assemblage : chaque morceau dessiné par le filtre, posé dans son articulation ----------
  let style = false;
  function poserStyle() {
    if (style || typeof document === 'undefined') return; style = true;
    const s = document.createElement('style'); s.dataset.codexStream = 'squelette';
    s.textContent = typeof SQUELETTE_CSS !== 'undefined' ? SQUELETTE_CSS : '';
    document.head.appendChild(s);
  }
  // TETE_SANS : la tête sans le corps du buste ; CHEVEUX_DOS : ce qui passe derrière le tronc
  const TETE_SANS = ['epaules', 'col', 'cou', 'cheveux-dos', 'accessoire-dos', 'accessoire-corps'], CHEVEUX_DOS = ['cheveux-dos', 'accessoire-dos'];
  function svg(fiche, o = {}, rendre) {
    poserStyle();
    const G = gabarit(fiche || {}), dy = G.dy, TOUT = { x: 0, y: -110, l: 400, h: 920 };
    const poser = (texte, z) => texte.replace('<svg ', `<svg x="${z.x}" y="${z.y}" width="${z.l}" height="${z.h}" `);
    const morceau = partie => poser(rendre({ cadrage: 'squelette', partie }), TOUT);
    const g = (classe, pivot, contenu) => `<g class="${classe}" style="transform-origin:${pivot[0]}px ${pivot[1]}px">${contenu}</g>`;
    const jambe = c => { const hx = G.hancheX[c === 'g' ? 0 : 1]; return g('bf-hanche-' + c, [hx, G.hanche], morceau('cuisse-' + c) + g('bf-genou-' + c, [hx, G.genou], morceau('tibia-' + c))); };
    const bras = c => { const x = G.epaule[c === 'g' ? 0 : 1]; return g('bf-epaule-' + c, [x, 392 + dy], morceau('bras-' + c) + g('bf-coude-' + c, [x, 470 + dy], morceau('avant-bras-' + c) + morceau('objet-' + c) + morceau('main-' + c))); };
    const tete = poser(rendre({ cadrage: 'buste', sans: TETE_SANS }), G.tete);
    return `<svg class="bouffon-svg bouffon-pied cs-squelette" viewBox="0 -110 400 920" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">${g('bf-tout', [200, 790], `
      ${morceau('dos')}${jambe('g')}${jambe('d')}
      ${g('bf-haut', [200, 380 + dy], `<g class="bf-cheveux">${poser(rendre({ cadrage: 'buste', seulement: CHEVEUX_DOS }), G.tete)}</g>`)}
      ${morceau('torse')}${bras('g')}${bras('d')}
      ${g('bf-haut', [200, 380 + dy], `<g class="bf-tete">${tete}</g>`)}`)}</svg>`;
  }
  return { svg, pieces, gabarit, poserStyle };
})();
