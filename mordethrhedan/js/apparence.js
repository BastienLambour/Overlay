/* =====================================================================
   APPARENCE — un personnage décrit par une FICHE (ses traits), pas par un dessin.
   Chaque overlay le dessine ensuite à SON style, à partir des mêmes formes : le même perso est reconnaissable
   partout (Xaieysi créé chez Patagrain = le même chez Mordeth, en néon).

   La fiche (catalogue commun : js/persos.js). Tout est FACULTATIF : un overlay qui ne dessine pas un trait l'ignore.
     { id, nom, titre, couleur,                       // couleur = sa couleur de carte
       tete: 'humaine'|'orc'|'draconide', carrure: 'normale'|'large'|'petite',
       peau, yeux: { couleur, forme: 'rond'|'amande'|'fendu', lueur },
       cheveux: { coupe: 'court'|'long'|'queue'|'chignon'|'frange'|'herisse'|'boucle'|'chauve', couleur, meche },
       oreilles: 'humaines'|'pointues'|'longues', cornes: ''|'petites'|'belier'|'arriere', dents: ''|'crocs'|'defenses',
       pilosite: ''|'barbe'|'barbe-longue'|'moustache'  ou  { type, couleur }  (couleur : celle des cheveux par défaut),
       tenue: { type: 'tunique'|'robe'|'armure'|'cape', couleur, couleur2 },
       accessoire: un nom ou une LISTE : 'capuche'|'chapeau'|'toque'|'couronne'|'bandeau'|'lunettes'|'casque'|'boucles',
       signe: ''|'cicatrice'|'tatouage'|'taches',
       objet, objet2: ''|'epee'|'hache'|'masse'|'hachoir'|'baton'|'arbalete'|'arc'|'bouclier'|'livre'|'carquois'
                      (main droite / main gauche ou dos : pour les gestes de l'arène des jets ; le buste ne les dessine pas),
       formes: { "Dragon": { …les traits qui changent } } }    // la forme active (CodexVTT : nom du portrait actif)

     Apparence.calques(fiche, { expression, forme }) → [{ id, d, fond, trait, epaisseur, partie }] dans l'ordre (dos → devant),
       viewBox 0 0 200 240 (un buste) ; partie : 'peau' | 'cheveux' | 'tenue' | 'yeux' | 'detail' | 'accessoire'
       expression : '' | 'parle' (bouche ouverte) | 'rire' | 'choc' | 'ko'
     Apparence.svg(fiche, options) → un dessin simple et neutre (pour l'aperçu) ; chaque overlay a son propre rendu
     Apparence.fusion(fiche, forme) → la fiche avec les traits de la forme
     Apparence.trouver(nom, …)  → la fiche du catalogue de ce personnage (par son nom ou son id ; « Kenai le gardien » → Kenai), sinon null
   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
const Apparence = (() => {
  // --- couleurs : éclaircir / assombrir un « #rrggbb » ---
  const teinte = (hex, k) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '')); if (!m) return hex || '#888888';
    const n = parseInt(m[1], 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  };
  const fusion = (fiche, forme) => {
    const f = forme && fiche.formes && Object.entries(fiche.formes).find(([n]) => n.toLowerCase() === String(forme).toLowerCase());
    if (!f) return fiche;
    const r = { ...fiche };
    Object.entries(f[1]).forEach(([k, v]) => { r[k] = v && typeof v === 'object' && !Array.isArray(v) ? { ...(fiche[k] || {}), ...v } : v; });
    return r;
  };
  const miroir = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${+(200 - parseFloat(x)).toFixed(1)} ${y}`);
  const rond = (x, y, rx, ry = rx) => `M${x - rx} ${y} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0`;
  const paire = d => d + ' ' + miroir(d);

  // --- les formes (un buste, 200 × 240) ---
  const VISAGE = {
    humaine: 'M100 42 C130 42 144 66 144 98 C144 134 126 160 100 162 C74 160 56 134 56 98 C56 66 70 42 100 42 Z',
    orc: 'M100 44 C134 44 150 68 150 100 C150 140 134 164 100 168 C66 164 50 140 50 100 C50 68 66 44 100 44 Z',
    draconide: 'M100 46 C134 46 154 66 156 94 C158 116 150 132 140 146 C130 162 116 172 100 172 C84 172 70 162 60 146 C50 132 42 116 44 94 C46 66 66 46 100 46 Z',
  };
  const JOUE = 'M124 70 C138 84 142 104 140 124 C136 144 124 156 112 160 C126 146 132 128 132 108 C132 92 128 80 124 70 Z';
  const MUSEAU = 'M100 112 C118 112 130 122 132 138 C134 154 120 166 100 166 C80 166 66 154 68 138 C70 122 82 112 100 112 Z';
  const CRETE = 'M100 50 L106 62 L100 70 L94 62 Z M100 72 L105 82 L100 88 L95 82 Z';
  const COLLERETTE = paire('M50 96 L18 80 L30 96 L14 108 L34 112 L22 126 L50 120 Z');
  const COU = { normale: 'M86 148 L114 148 L117 186 L83 186 Z', large: 'M80 148 L120 148 L124 186 L76 186 Z', petite: 'M88 150 L112 150 L114 186 L86 186 Z' };
  const EPAULES = {
    tunique: 'M18 240 C22 198 54 182 100 180 C146 182 178 198 182 240 Z',
    robe: 'M14 240 C20 196 52 178 100 176 C148 178 180 196 186 240 Z',
    armure: 'M10 240 C10 200 36 182 64 178 C76 176 88 180 100 180 C112 180 124 176 136 178 C164 182 190 200 190 240 Z',
    cape: 'M6 240 C14 192 50 174 100 172 C150 174 186 192 194 240 Z',
  };
  const COL = { tunique: 'M80 182 L100 210 L120 182 Z', robe: 'M72 180 L100 226 L128 180 Z', armure: 'M64 178 C76 196 88 204 100 204 C112 204 124 196 136 178 L136 190 C124 210 112 216 100 216 C88 216 76 210 64 190 Z', cape: 'M70 176 C80 190 90 196 100 196 C110 196 120 190 130 176 L134 186 C122 202 110 208 100 208 C90 208 78 202 66 186 Z' };
  const DOS = {
    long: 'M100 34 C58 34 44 70 46 112 C48 150 46 186 40 214 L160 214 C154 186 152 150 154 112 C156 70 142 34 100 34 Z',
    queue: 'M114 40 C150 34 164 70 158 110 C154 140 158 170 168 196 C146 186 138 160 140 128 C142 96 138 66 118 56 Z',
    boucle: rond(64, 70, 18) + rond(136, 70, 18) + rond(54, 104, 16) + rond(146, 104, 16) + rond(100, 46, 26),
    frange: 'M100 36 C62 36 50 66 52 100 C54 124 54 136 52 148 L148 148 C146 136 146 124 148 100 C150 66 138 36 100 36 Z',
    chignon: rond(100, 26, 18, 15),
  };
  const CALOTTE = 'M56 94 C52 58 74 36 100 36 C126 36 148 58 144 94 C134 70 118 60 100 60 C82 60 66 70 56 94 Z';
  const DEVANT = {
    court: CALOTTE, chignon: CALOTTE,
    long: CALOTTE + ' ' + paire('M58 84 C50 110 52 140 48 168 L60 168 C60 140 62 112 66 92 Z'),
    queue: 'M56 94 C52 58 74 36 100 36 C126 36 148 58 144 94 C136 74 124 64 108 62 C94 72 74 82 56 94 Z',
    frange: 'M54 100 C50 60 74 38 100 38 C126 38 150 60 146 100 C140 84 132 76 124 74 C118 84 110 80 104 72 C96 82 86 80 80 72 C72 80 64 84 54 100 Z',
    herisse: 'M56 94 L48 62 L66 68 L64 40 L82 56 L92 28 L102 52 L116 30 L120 56 L140 42 L136 68 L154 64 L144 94 C134 72 118 62 100 62 C82 62 66 72 56 94 Z',
    boucle: rond(70, 58, 14) + rond(90, 46, 15) + rond(112, 46, 15) + rond(132, 58, 14) + rond(60, 76, 11) + rond(142, 76, 11),
    chauve: '',
  };
  const OREILLE = { humaines: rond(56, 106, 8, 12), pointues: 'M60 100 L26 76 L40 98 L58 120 Z', longues: 'M60 98 L16 88 L34 106 L58 122 Z' };
  const CORNES = {
    petites: paire('M74 50 L64 22 L84 44 Z'),
    belier: paire('M70 54 C44 46 36 70 50 84 C58 92 70 88 68 78 C66 70 58 72 60 78 C54 72 58 60 72 64 Z'),
    arriere: paire('M72 58 C60 40 46 30 24 26 C40 34 52 46 58 64 Z M84 50 C76 32 66 20 48 12 C60 24 68 38 72 54 Z'),   // rabattues vers l'arrière (draconide)
  };
  const DENTS = { crocs: paire('M88 140 L91 132 L94 140 Z'), defenses: paire('M80 146 C78 136 80 126 86 120 C86 130 88 138 90 146 Z') };
  const PILOSITE = {
    barbe: 'M58 116 C60 150 78 172 100 174 C122 172 140 150 142 116 C136 140 122 150 110 150 C106 146 94 146 90 150 C78 150 64 140 58 116 Z',
    'barbe-longue': 'M58 116 C58 160 74 206 100 230 C126 206 142 160 142 116 C136 140 122 150 110 150 C106 146 94 146 90 150 C78 150 64 140 58 116 Z',
    moustache: 'M100 128 C92 124 82 126 78 134 C86 132 94 134 100 132 C106 134 114 132 122 134 C118 126 108 124 100 128 Z',
  };
  const ACCESSOIRE = {
    capuche: { dos: 'M100 22 C46 22 30 80 34 132 C36 162 44 186 54 200 L146 200 C156 186 164 162 166 132 C170 80 154 22 100 22 Z', devant: 'M100 30 C60 30 44 70 46 104 C50 80 70 58 100 58 C130 58 150 80 154 104 C156 70 140 30 100 30 Z' },
    chapeau: { devant: 'M22 72 C40 60 70 56 100 56 C130 56 160 60 178 72 C160 78 130 80 100 80 C70 80 40 78 22 72 Z M64 64 C66 30 82 14 100 14 C118 14 134 30 136 64 C124 58 112 56 100 56 C88 56 76 58 64 64 Z' },
    toque: { devant: 'M64 66 L68 40 C56 36 54 18 70 16 C74 4 92 2 100 10 C108 2 126 4 130 16 C146 18 144 36 132 40 L136 66 C124 60 112 58 100 58 C88 58 76 60 64 66 Z', blanc: true },
    couronne: { devant: 'M64 52 L70 26 L84 44 L100 18 L116 44 L130 26 L136 52 C124 48 112 46 100 46 C88 46 76 48 64 52 Z', or: true },
    bandeau: { devant: 'M56 74 C70 66 86 62 100 62 C114 62 130 66 144 74 L144 84 C130 76 114 72 100 72 C86 72 70 76 56 84 Z' },
    lunettes: { trait: rond(82, 100, 14, 12) + rond(118, 100, 14, 12) + ' M96 100 L104 100 M68 98 L56 94 M132 98 L144 94' },
    casque: { dos: 'M100 18 C52 18 34 60 36 104 C38 132 46 150 56 160 L144 160 C154 150 162 132 164 104 C166 60 148 18 100 18 Z', devant: 'M62 84 C70 70 84 64 100 64 C116 64 130 70 138 84 L138 92 C126 82 114 78 100 78 C86 78 74 82 62 92 Z' },
    boucles: { bijou: rond(56, 124, 4) + rond(144, 124, 4) },
  };
  const SIGNE = { cicatrice: 'M118 112 L132 132 M121 118 L126 115 M125 124 L130 121', tatouage: 'M124 112 C132 116 134 124 130 132 M70 112 C64 118 64 126 68 132', taches: rond(80, 118, 1.6) + rond(86, 122, 1.6) + rond(76, 124, 1.6) + rond(120, 118, 1.6) + rond(114, 122, 1.6) + rond(124, 124, 1.6) };
  // Carrure : les épaules plus larges ou plus étroites (transformation des formes autour du milieu)
  const etirer = (d, k) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${+(100 + (parseFloat(x) - 100) * k).toFixed(1)} ${y}`);

  function calques(fiche0, { expression = '', forme = '' } = {}) {
    const f = fusion(fiche0 || {}, forme);
    const tete = VISAGE[f.tete] ? f.tete : 'humaine', dragon = tete === 'draconide';
    const carrure = COU[f.carrure] ? f.carrure : 'normale', kCarrure = { large: 1.14, petite: .9, normale: 1 }[carrure];
    const peau = f.peau || '#E8B894', ombre = teinte(peau, -.18);
    const ch = f.cheveux || {}, cc = ch.couleur || '#2A2018';
    const coupe = dragon ? 'chauve' : DEVANT[ch.coupe] !== undefined ? ch.coupe : 'court';
    const y = f.yeux || {}, iris = y.couleur || '#4A3A2A';
    const t = f.tenue || {}, tt = EPAULES[t.type] ? t.type : 'tunique', tc = t.couleur || f.couleur || '#4F7CAC';
    const accs = (Array.isArray(f.accessoire) ? f.accessoire : [f.accessoire]).filter(a => ACCESSOIRE[a]).map(a => [a, ACCESSOIRE[a]]);
    const accDos = accs.find(([, a]) => a.dos);
    const pil = typeof f.pilosite === 'object' && f.pilosite ? f.pilosite : { type: f.pilosite };
    const L = [];
    const pousser = (id, d, partie, fond, trait = null, epaisseur = 0) => { if (d) L.push({ id, d, partie, fond, trait, epaisseur }); };
    // dos
    if (accDos) pousser('accessoire-dos', accDos[1].dos, 'accessoire', teinte(tc, -.25));
    if (DOS[coupe] && !accDos) pousser('cheveux-dos', DOS[coupe], 'cheveux', teinte(cc, -.12));
    pousser('epaules', etirer(EPAULES[tt], kCarrure), 'tenue', tc);
    pousser('col', etirer(COL[tt], kCarrure), 'tenue', t.couleur2 || teinte(tc, .35));
    pousser('cou', COU[carrure], 'peau', ombre);
    if (f.cornes && CORNES[f.cornes]) pousser('cornes', CORNES[f.cornes], 'detail', f.couleurCornes || (dragon ? teinte(peau, -.35) : '#E8DCC2'));
    if (dragon) pousser('collerette', COLLERETTE, 'peau', teinte(peau, -.25));
    else if (!accDos || accDos[0] === 'casque') { const or = OREILLE[f.oreilles] || OREILLE.humaines; pousser('oreille-g', or, 'peau', peau); pousser('oreille-d', miroir(or), 'peau', peau); }
    pousser('visage', VISAGE[tete], 'peau', peau);
    pousser('joue', dragon ? etirer(JOUE, 1.15) : JOUE, 'peau', ombre);
    if (dragon) { pousser('museau', MUSEAU, 'peau', teinte(peau, .18)); pousser('crete', CRETE, 'detail', teinte(peau, -.3)); }
    if (f.signe && SIGNE[f.signe]) pousser('signe', SIGNE[f.signe], 'detail', f.signe === 'taches' ? teinte(peau, -.3) : null, f.signe === 'taches' ? null : teinte(peau, -.45), 2.5);
    // yeux
    if (expression === 'ko') {
      pousser('yeux', 'M74 94 L90 106 M90 94 L74 106 M110 94 L126 106 M126 94 L110 106', 'yeux', null, '#1A1418', 4);
    } else if (expression === 'rire') {
      pousser('yeux', 'M72 102 C78 94 88 94 92 102 M108 102 C112 94 122 94 128 102', 'yeux', null, '#1A1418', 4);
    } else {
      const ry = y.forme === 'amande' ? 5 : expression === 'choc' ? 9 : 7;
      pousser('blanc', rond(82, 98, 10, ry) + rond(118, 98, 10, ry), 'yeux', y.lueur ? teinte(iris, .7) : '#FFFFFF');
      pousser('iris', y.forme === 'fendu' ? 'M80 91 C84 95 84 101 80 105 C78 101 78 95 80 91 Z M116 91 C120 95 120 101 116 105 C114 101 114 95 116 91 Z' : rond(83, 98, 5.2) + rond(119, 98, 5.2), 'yeux', y.forme === 'fendu' ? '#1A1418' : iris);
      if (y.forme !== 'fendu') pousser('pupille', rond(83.5, 98, 2.3) + rond(119.5, 98, 2.3), 'yeux', '#1A1418');
      if (y.lueur) pousser('lueur', rond(82, 98, 13, ry + 3) + rond(118, 98, 13, ry + 3), 'yeux', null, iris, 2);
    }
    pousser('sourcils', dragon ? 'M68 84 L92 88 M108 88 L132 84' : expression === 'choc' ? 'M70 80 C76 74 86 74 92 78 M108 78 C114 74 124 74 130 80' : 'M70 85 C76 80 86 80 92 83 M108 83 C114 80 124 80 130 85', 'cheveux', null, dragon ? teinte(peau, -.4) : teinte(cc, -.2), 4);
    pousser('nez', dragon ? 'M92 126 C94 122 96 122 96 126 M104 126 C104 122 106 122 108 126' : 'M100 104 C98 116 96 120 93 123 C98 127 104 127 108 123', 'detail', null, dragon ? teinte(peau, -.45) : ombre, 3);
    const yb = dragon ? 12 : 0;
    const bouches = { parle: `M90 ${134 + yb} C94 ${146 + yb} 106 ${146 + yb} 110 ${134 + yb} C104 ${137 + yb} 96 ${137 + yb} 90 ${134 + yb} Z`, rire: `M86 ${132 + yb} C90 ${152 + yb} 110 ${152 + yb} 114 ${132 + yb} C104 ${136 + yb} 96 ${136 + yb} 86 ${132 + yb} Z`, choc: rond(100, 140 + yb, 6, 8) };
    if (bouches[expression]) pousser('bouche', bouches[expression], 'detail', f.bouche || '#5A2A2A');
    else pousser('bouche', dragon ? 'M80 150 C92 156 108 156 120 150' : 'M89 136 C95 141 105 141 111 136', 'detail', null, f.bouche || '#7A3A3A', 3);
    if (f.dents && DENTS[f.dents]) pousser('dents', DENTS[f.dents], 'detail', '#F4EEDC', '#3A2A1A', 1.2);
    if (pil.type && PILOSITE[pil.type] && !dragon) pousser('pilosite', PILOSITE[pil.type], 'cheveux', pil.couleur || cc);
    // devant
    if (!accDos || accDos[0] === 'casque') pousser('cheveux', DEVANT[coupe], 'cheveux', cc);
    if (ch.meche && coupe !== 'chauve') pousser('meche', 'M112 42 C100 56 84 70 64 82', 'cheveux', null, ch.meche, 6);
    accs.forEach(([nom, a]) => {
      if (a.devant) pousser('accessoire', a.devant, 'accessoire', a.or ? '#F5C542' : a.blanc ? '#F7F4EC' : nom === 'bandeau' ? (t.couleur2 || teinte(tc, .3)) : teinte(tc, -.1));
      if (a.trait) pousser('accessoire', a.trait, 'accessoire', null, '#2A2A2A', 3.5);
      if (a.bijou) pousser('bijoux', a.bijou, 'accessoire', '#F5C542', '#8A6A1A', 1);
    });
    return L;
  }

  // Un dessin neutre (aperçu) : des aplats, un contour doux
  function svg(fiche, opts = {}) {
    const L = calques(fiche, opts);
    return `<svg viewBox="0 0 200 240" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">${L.map(c =>
      `<path d="${c.d}" fill="${c.fond || 'none'}" ${c.trait ? `stroke="${c.trait}" stroke-width="${c.epaisseur}" stroke-linecap="round" stroke-linejoin="round"` : ''}/>`).join('')}</svg>`;
  }

  // La fiche du catalogue (js/persos.js) d'un personnage, d'après son nom (« Kenai le gardien » → Kenai) ou son id ; sinon null
  const normaliser = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  function trouver(...noms) {
    const liste = window.PERSOS || [];
    for (const nom of noms) {
      const n = normaliser(nom);
      if (!n) continue;
      const f = liste.find(p => normaliser(p.id) === n || normaliser(p.nom) === n)
        || liste.find(p => { const m = normaliser(p.nom); return n.startsWith(m + ' ') || m.startsWith(n + ' ') || n.split(' ')[0] === m.split(' ')[0]; });
      if (f) return f;
    }
    return null;
  }

  return { calques, svg, fusion, teinte, trouver };
})();
