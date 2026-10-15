/* =====================================================================
   CODEX-STREAM 2026-10-14-4993e34 — la boîte à outils de stream de CodexVTT.
   FICHIER ASSEMBLÉ par codex-stream/construire.mjs (G:\Projets\Overlay\codex-stream) : ne pas le modifier ici.
     import { CodexStream } from './codex-stream.js';   (mode d'emploi : LISEZMOI.md)
   ===================================================================== */
const VERSION = '2026-10-14-4993e34';
const window = typeof globalThis.window !== 'undefined' ? globalThis.window : globalThis;   // (pour les tests sous Node)

// ----- src/apparence.js -----
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
    else if (!accDos || accDos[0] === 'casque') { const or = OREILLE[f.oreilles] || OREILLE.humaines; pousser('oreille-g', or, 'peau', peau); pousser('oreille-d', or === OREILLE.humaines ? rond(144, 106, 8, 12) : miroir(or), 'peau', peau); }   // (un rond ne se retourne pas avec miroir : ses arcs)
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


// ----- src/exemples.js -----
/* =====================================================================
   EXEMPLES — quelques fiches d’apparence (d’après la table de Patagrain), pour la DÉMO de la boîte à outils seulement.
   Le même fichier dans tous les overlays : un personnage ajouté ici existe chez tout le monde, et chaque overlay
   le dessine à son style. Pour en ajouter un : le créateur de personnage (à venir) fabrique la fiche ; on la colle
   ici (dans _modele/js/persos.js), puis on recopie le fichier partout. Le nom doit être celui de CodexVTT.
   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
window.PERSOS = [
  // Exemple de démonstration (son apparence est à refaire avec le créateur)
  { id: 'xaieysi', nom: 'Xaieysi', titre: 'Exemple', couleur: '#5B6CFF',
    peau: '#EBD3C3', yeux: { couleur: '#9B5DE5', forme: 'amande', lueur: true },
    cheveux: { coupe: 'long', couleur: '#D9DCE6', meche: '#9B5DE5' }, oreilles: 'pointues',
    tenue: { type: 'cape', couleur: '#26305E', couleur2: '#C9B26A' }, accessoire: ['bandeau', 'boucles'], signe: 'tatouage', objet: 'baton' },
  // D'après les héros de Patagrain (js/heros.js : mêmes couleurs) — pour comparer les styles
  { id: 'patagrain', nom: 'Patagrain', titre: 'Maître du jeu', couleur: '#F5B82E',
    peau: '#F0C8A4', yeux: { couleur: '#86A08F', forme: 'rond' }, cheveux: { coupe: 'long', couleur: '#B98B58' }, oreilles: 'humaines',
    pilosite: { type: 'barbe', couleur: '#8F6540' }, tenue: { type: 'robe', couleur: '#2B4A7A', couleur2: '#F5B82E' }, accessoire: 'lunettes', objet: 'livre' },
  { id: 'kenai', nom: 'Kenai', titre: 'Le gardien aux ombres', couleur: '#C0743C', tete: 'orc',
    peau: '#7C8D3C', yeux: { couleur: '#2A1A06', forme: 'rond' }, cheveux: { coupe: 'chignon', couleur: '#1A1714' }, oreilles: 'pointues', dents: 'crocs',
    tenue: { type: 'armure', couleur: '#5A4632', couleur2: '#C0743C' }, objet: 'hache', objet2: 'bouclier' },
  { id: 'namerya', nom: 'Namerya', titre: 'L’ondine aux yeux d’océan', couleur: '#3FA7D6',
    peau: '#F1D6C8', yeux: { couleur: '#3AA2DD', forme: 'rond' }, cheveux: { coupe: 'long', couleur: '#1A1C26' }, oreilles: 'humaines',
    tenue: { type: 'robe', couleur: '#2C7DA0', couleur2: '#9FD8F0' }, signe: 'taches', objet: 'baton' },
  { id: 'zokhran', nom: 'Zokhran', titre: 'Poète de la marmite', couleur: '#D64545', tete: 'orc', carrure: 'large',
    peau: '#7FA34A', yeux: { couleur: '#6B4A22', forme: 'rond' }, cheveux: { coupe: 'herisse', couleur: '#1F1A17' }, oreilles: 'pointues',
    dents: 'defenses', pilosite: 'moustache', accessoire: 'toque',
    tenue: { type: 'tunique', couleur: '#8E3A2A', couleur2: '#E0B060' }, signe: 'cicatrice', objet: 'hachoir' },
  { id: 'trayss', nom: 'Trayss', titre: 'Héritage des brumes', couleur: '#9B5DE5',
    peau: '#D6A684', yeux: { couleur: '#9B5DE5', forme: 'amande' }, cheveux: { coupe: 'queue', couleur: '#14151C', meche: '#9B5DE5' }, oreilles: 'humaines',
    tenue: { type: 'armure', couleur: '#3A2E52', couleur2: '#9B5DE5' }, accessoire: 'boucles', objet: 'arbalete',
    formes: {
      'Dragon': { tete: 'draconide', peau: '#7B4BC4', yeux: { couleur: '#C88BFF', forme: 'fendu', lueur: true }, cornes: 'arriere', dents: 'crocs', accessoire: '' },
      'Entre deux': { peau: '#8E70BC', cornes: 'petites', yeux: { couleur: '#E6D8FF', lueur: true } },
    } },
];


// ----- src/filtres.js -----
/* =====================================================================
   FILTRES — les façons de dessiner un personnage (sa fiche d'apparence, voir apparence.js).
   Les mêmes traits partout : « cheveux longs blonds » est UN trait, que chaque filtre dessine à sa façon.
     Filtres.liste                       → [{ id, nom, texte }]
     Filtres.rendu(id, fiche, options)   → <svg>
       options : { expression: '' | 'parle' | 'rire' | 'choc' | 'ko', forme, cadrage: 'buste' | 'tete', accent: '#…' }
   Venus des overlays de la famille : Néon (Mordethrhedan), Sticker (Ambries), Écusson (John Von Gurt),
   Vitrail (les facettes de cristal), Aplat (le dessin de base). Conte (Patagrain) viendra plus tard.
   ===================================================================== */
const Filtres = (() => {
  const T = Apparence.teinte;
  let n = 0;
  const ENCRE = '#140A24';
  const CADRAGES = { buste: '0 0 200 240', tete: '18 2 164 172' };
  const vb = o => CADRAGES[o.cadrage] || CADRAGES.buste;
  const esc = t => String(t || '').replace(/[&<>"]/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]));
  const attr = (c, fond, trait, ep) => `d="${c.d}" fill="${fond || 'none'}" ${trait ? `stroke="${trait}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"` : ''}`;
  const svg = (o, contenu) => `<svg viewBox="${vb(o)}" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">${contenu}</svg>`;

  const FILTRES = {
    aplat: {
      nom: 'Aplat', texte: 'Des aplats de couleur simples, avec un contour doux.',
      rendu: (f, o) => svg(o, Apparence.calques(f, o).map(c => `<path ${attr(c, c.fond, c.trait, c.epaisseur)}/>`).join('')),
    },
    neon: {
      nom: 'Néon', texte: 'Le personnage en traits de néon sur le noir, comme une enseigne : chaque partie garde sa couleur, en lumière.',
      rendu(f, o) {
        const id = 'cs-neon' + (n++);
        return svg(o, `<defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="f"/><feMerge><feMergeNode in="f"/><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          <g filter="url(#${id})">${Apparence.calques(f, o).map(c => {
            const lum = T(c.fond || c.trait, .35);
            if (c.partie === 'yeux' && c.fond) return `<path ${attr(c, c.id === 'blanc' ? '#0B0D0E' : lum, null)}/>`;
            return `<path ${attr(c, c.fond ? T(c.fond, -.82) : null, lum, c.trait ? Math.max(2.4, c.epaisseur * .8) : 2.6)}/>`;
          }).join('')}</g>`);
      },
    },
    sticker: {
      nom: 'Sticker', texte: 'En autocollant découpé : contour noir, grosse bordure blanche, ombre portée, légère inclinaison.',
      rendu(f, o) {
        const tout = Apparence.calques(f, o), pleins = tout.filter(c => c.fond);
        const rot = ((String(f.id || f.nom || '').length % 5) - 2) * 2;
        const plein = c => `<path d="${c.d}" fill="${c.fond || 'none'}" stroke="${c.trait || ENCRE}" stroke-width="${c.trait ? c.epaisseur + 1 : 4}" stroke-linecap="round" stroke-linejoin="round" paint-order="stroke fill"/>`;
        return svg(o, `<g transform="rotate(${rot} 100 120)">
          <g transform="translate(6 6)">${pleins.map(c => `<path d="${c.d}" fill="${ENCRE}" stroke="${ENCRE}" stroke-width="18" stroke-linejoin="round"/>`).join('')}</g>
          ${pleins.map(c => `<path d="${c.d}" fill="#fff" stroke="#fff" stroke-width="18" stroke-linejoin="round"/>`).join('')}
          ${tout.map(plein).join('')}</g>`);
      },
    },
    ecusson: {
      nom: 'Écusson', texte: 'Un écusson brodé, comme ceux des combinaisons d’astronaute : le buste dans un rond, le nom autour.',
      rendu(f, o) {
        const id = 'cs-ecusson' + (n++), accent = o.accent || '#FF9F1C';
        const L = Apparence.calques(f, o);
        return `<svg viewBox="0 0 200 240" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">
          <defs><clipPath id="${id}"><circle cx="100" cy="118" r="80"/></clipPath><path id="${id}a" d="M28 118 A72 72 0 0 0 172 118"/></defs>
          <circle cx="100" cy="118" r="98" fill="#141920" stroke="#E6EAEE" stroke-width="5"/>
          <circle cx="100" cy="118" r="80" fill="#0B0E13" stroke="${accent}" stroke-width="4"/>
          <g clip-path="url(#${id})"><g transform="translate(100 118) scale(.82) translate(-100 -112)">${L.map(c => `<path ${attr(c, c.fond, c.trait || (c.fond ? 'rgba(0,0,0,.35)' : null), c.trait ? c.epaisseur : 1.5)}/>`).join('')}</g></g>
          <text font-family="monospace" font-weight="700" font-size="13" letter-spacing="3" fill="#E6EAEE" text-anchor="middle"><textPath href="#${id}a" startOffset="50%">${esc((f.nom || '').toUpperCase())}</textPath></text>
          <path d="M26 104 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z M174 104 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="${accent}" transform="translate(-3 0)"/></svg>`;
      },
    },
    vitrail: {
      nom: 'Vitrail', texte: 'Des aplats taillés en facettes, comme du verre ou du cristal, avec un liseré de lumière sur les épaules.',
      rendu(f, o) {
        const id = 'cs-vitrail' + (n++), accent = o.accent || '#1EE88A';
        const tri = [];
        for (let y = 0; y < 240; y += 26) for (let x = -13 * ((y / 26) % 2); x < 200; x += 26) {
          const k = Math.abs(Math.sin(x * 12.9 + y * 78.2)) % 1;
          tri.push(`<path d="M${x} ${y}L${x + 26} ${y}L${x + 13} ${y + 26}Z" fill="#fff" fill-opacity="${(k * .22).toFixed(2)}"/><path d="M${x + 13} ${y + 26}L${x + 26} ${y}L${x + 39} ${y + 26}Z" fill="#000" fill-opacity="${((1 - k) * .18).toFixed(2)}"/>`);
        }
        const grandes = new Set(['visage', 'cheveux', 'cheveux-dos', 'epaules', 'accessoire-dos', 'accessoire']);
        const L = Apparence.calques(f, o);
        return svg(o, `<defs><pattern id="${id}" width="200" height="240" patternUnits="userSpaceOnUse">${tri.join('')}</pattern>
            <filter id="${id}h"><feGaussianBlur stdDeviation="1.6" result="f"/><feMerge><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          ${L.map(c => `<path ${attr(c, c.fond, c.trait, c.epaisseur)}/>` + (grandes.has(c.id) && c.fond ? `<path d="${c.d}" fill="url(#${id})"/>` : '')).join('')}
          <g filter="url(#${id}h)">${L.filter(c => c.id === 'epaules').map(c => `<path d="${c.d}" fill="none" stroke="${accent}" stroke-width="2.4"/>`).join('')}</g>`);
      },
    },
  };

  return {
    liste: Object.entries(FILTRES).map(([id, f]) => ({ id, nom: f.nom, texte: f.texte })),
    existe: id => !!FILTRES[id],
    rendu: (id, fiche, o = {}) => (FILTRES[id] || FILTRES.aplat).rendu(fiche, o),
  };
})();


// ----- src/scenette.js -----
/* =====================================================================
   SCÉNETTE — pendant un jet de dés, le personnage entre dans un rectangle de la page et joue son geste
   (court, se cache, lance un sort, frappe, pare…), puis il réagit au résultat : il rit à la réussite,
   il est choqué à l'échec, il tombe K.O. à l'échec critique, il danse au critique.
     Scenette.jouer(conteneur, jet, { dessin(expression) → <svg>, duree, denouement }) → promesse (finie quand il disparaît)
   conteneur : n'importe quel élément de la page (on y pose un calque qui le remplit).
   Classes (pour le CSS personnalisé d'OBS) : .cs-scenette, .cs-fond, .cs-perso, .cs-effet
   ===================================================================== */
const Scenette = (() => {
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  const bouger = (el, images, ms, easing = 'ease-in-out') => el.animate(images, { duration: ms, easing, fill: 'forwards' }).finished;
  let style = false;
  function poserStyle() {
    if (style || typeof document === 'undefined') return; style = true;
    const s = document.createElement('style');
    s.textContent = `.cs-scenette { position: absolute; inset: 0; overflow: hidden; }
      .cs-scenette .cs-fond { position: absolute; inset: 0; }
      .cs-scenette .cs-perso { position: absolute; left: 50%; bottom: 0; height: 92%; aspect-ratio: 200 / 240; transform-origin: 50% 100%; }
      .cs-scenette .cs-perso svg { width: 100%; height: 100%; display: block; overflow: visible; }
      .cs-scenette .cs-effet { position: absolute; font-size: 44px; line-height: 1; pointer-events: none; }`;
    document.head.appendChild(s);
  }

  async function jouer(conteneur, jet, { dessin, duree = 4000, denouement = 1500 } = {}) {
    poserStyle();
    if (getComputedStyle(conteneur).position === 'static') conteneur.style.position = 'relative';
    const t0 = performance.now();
    const el = document.createElement('div');
    el.className = 'cs-scenette';
    el.innerHTML = '<div class="cs-fond"></div><div class="cs-perso"></div>';
    conteneur.appendChild(el);
    const perso = el.querySelector('.cs-perso');
    const dessiner = (e = '') => { perso.innerHTML = dessin(e); };
    dessiner();
    const effet = (texte, x, y = 30, images = null, ms = 1200) => {
      const e = document.createElement('div'); e.className = 'cs-effet'; e.textContent = texte;
      Object.assign(e.style, { left: x + '%', bottom: y + '%' }); el.appendChild(e);
      return bouger(e, images || [{ opacity: 0, transform: 'translateY(0) scale(.6)' }, { opacity: 1, transform: 'translateY(-30px) scale(1.1)', offset: .3 }, { opacity: 0, transform: 'translateY(-70px) scale(1)' }], ms).then(() => e.remove());
    };
    const X = 'translateX(-50%)';
    await (jet.geste === 'courir'
      ? bouger(perso, [{ transform: 'translateX(160%)' }, { transform: X }], Math.max(900, denouement - 300), 'cubic-bezier(.2,.8,.3,1)')
      : bouger(perso, [{ transform: `${X} translateY(105%)` }, { transform: X }], 450, 'cubic-bezier(.34,1.56,.64,1)'));

    // --- le geste, pendant que les dés roulent dans CodexVTT ---
    const g = jet.geste;
    const gestes = {
      cacher: () => bouger(perso, [{ opacity: 1, transform: X }, { opacity: .25, transform: `${X} translateY(8%) scale(.92)` }], 700),
      crocheter: () => { effet('🔒', 62, 40); return bouger(perso, [{ transform: X }, { transform: `${X} rotate(-4deg)` }, { transform: X }], 600); },
      lire: () => { effet('📖', 64, 45); return bouger(perso, [{ transform: X }, { transform: `${X} translateY(-4%)` }, { transform: X }], 700); },
      observer: () => { effet('👁️', 64, 50); return bouger(perso, [{ transform: X }, { transform: `${X} rotate(6deg)` }, { transform: `${X} rotate(-6deg)` }, { transform: X }], 900); },
      parler: () => { effet('💬', 66, 55); return bouger(perso, [{ transform: X }, { transform: `${X} translateY(-6%)` }, { transform: X }, { transform: `${X} translateY(-6%)` }, { transform: X }], 800); },
      menacer: () => { effet('💢', 66, 55); return bouger(perso, [{ transform: X }, { transform: `${X} scale(1.12)` }, { transform: X }], 600); },
      danser: () => { effet('♪', 30, 50); effet('♫', 70, 55); return bouger(perso, [{ transform: X }, { transform: `${X} rotate(-8deg)` }, { transform: `${X} rotate(8deg)` }, { transform: X }], 900); },
      parer: () => { effet('🛡️', 64, 35); return bouger(perso, [{ transform: X }, { transform: `${X} translateX(-6%)` }, { transform: X }], 500); },
      sort: () => { effet('✨', 30, 60); effet('✨', 70, 40); return bouger(perso, [{ transform: X, filter: 'none' }, { transform: `${X} translateY(-6%)`, filter: 'brightness(1.6)' }, { transform: X, filter: 'none' }], 900); },
      tirer: () => { effet('➶', 70, 45, [{ opacity: 1, transform: 'translateX(-60px)' }, { opacity: 0, transform: 'translateX(140px)' }], 600); return bouger(perso, [{ transform: X }, { transform: `${X} translateX(-8%)` }, { transform: X }], 500); },
      frapper: () => bouger(perso, [{ transform: X }, { transform: `${X} translateX(-10%) rotate(-6deg)` }, { transform: `${X} translateX(14%) rotate(8deg)` }, { transform: X }], 650),
      soigner: () => { effet('💚', 50, 70); return bouger(perso, [{ transform: X, filter: 'none' }, { transform: X, filter: 'brightness(1.4)' }, { transform: X, filter: 'none' }], 800); },
      garde: () => bouger(perso, [{ transform: X }, { transform: `${X} scale(1.06)` }, { transform: X }], 500),
    };
    if (gestes[g]) await gestes[g]();
    await attendre(Math.max(0, denouement - (performance.now() - t0)));
    if (g === 'cacher') bouger(perso, [{ opacity: .25 }, { opacity: 1 }], 300);

    // --- le dénouement : la réaction au résultat ---
    const v = jet.verdict;
    if (v === 'crit') {
      dessiner('rire'); ['★', '✦', '★', '✦'].forEach((s, i) => setTimeout(() => effet(s, 15 + i * 22, 55 + (i % 2) * 15), i * 200));
      await bouger(perso, [{ transform: X }, { transform: `${X} translateY(-12%) rotate(-6deg)` }, { transform: X }, { transform: `${X} translateY(-12%) rotate(6deg)` }, { transform: X }], 1100);
    } else if (v === 'ok') {
      dessiner('rire');
      if (g === 'frapper' || g === 'tirer') effet('💥', 72, 45);
      await bouger(perso, [{ transform: X }, { transform: `${X} translateY(-14%)` }, { transform: X }], 600, 'cubic-bezier(.34,1.56,.64,1)');
    } else if (v === 'rate') {
      dessiner('choc'); effet('💧', 30, 60);
      await bouger(perso, [{ transform: X }, { transform: `${X} translateX(-4%)` }, { transform: `${X} translateX(4%)` }, { transform: X }], 400);
    } else if (v === 'fumble') {
      dessiner('ko'); effet('💥', 50, 60);
      await bouger(perso, [{ transform: X }, { transform: `${X} rotate(-14deg) translateY(4%)` }, { transform: `${X} rotate(80deg) translateY(30%)` }], 900, 'cubic-bezier(.5,0,.8,.4)');
    } else if (g === 'soigner') effet(`+${jet.resultat}`, 60, 60);

    await attendre(Math.max(500, duree - (performance.now() - t0 - denouement)));
    await bouger(el, [{ opacity: 1 }, { opacity: 0 }], 400);
    el.remove();
  }
  return { jouer };
})();


// ----- src/coeur.js -----
/* =====================================================================
   CODEX-STREAM — le cœur : la partie CodexVTT (mode spectateur, lecture seule) pour une page de stream.
     const cs = CodexStream.brancher({ adresse, cle, filtre, monPerso, demo, accent })
       adresse  : celle de CodexVTT (défaut : l'origine de la page, quand elle est servie par CodexVTT)
       cle      : la clé spectateur de la table
       filtre   : 'neon' | 'sticker' | 'ecusson' | 'vitrail' | 'aplat' (Filtres.liste)
       monPerso : id de fiche ou nom : « mon » personnage (moi: true) ; demo : true = une partie inventée, sans CodexVTT
     cs.on('etat', e => …)      'connexion' | 'en-ligne' | 'refusee' | 'revoquee' | 'hors-ligne' | 'demo'
     cs.on('table', persos => …)    [{ id, nom, pv, pvMax, aTerre, forme, apparence, joueur, moi }]
     cs.on('perso', perso => …)     un perso qui change (PV, forme, apparence…)
     cs.on('coup', (perso, delta) => …)
     cs.on('jet', jet => …)         { persoId, nom, libelle, formule, resultat, dd, des, verdict, geste, mot, pnj, moi }
     cs.on('combat', c => …)        { tour, actif, ordre: [{ id, nom, init, pnj, persoId }] } ou null
     cs.on('parle', (perso, oui) => …)
     const p = cs.portrait(el, persoId, { cadrage })  le personnage dessiné dans el, animé tout seul (parle, K.O., forme) ; p.detruire()
     const s = cs.scenette(el, { duree, pnj, seulement }) joue chaque jet dans le rectangle el (un à la fois) ; s.detruire()
     cs.parle(persoId, oui)                           relai d'un bot Discord ; cs.dessin(persoId, options) → <svg> ; cs.fermer()
   ===================================================================== */
const CodexStream = (() => {
  const normaliser = t => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const memeNom = (a, b) => { const x = normaliser(a), y = normaliser(b); return !!x && !!y && (x === y || x.startsWith(y + ' ') || y.startsWith(x + ' ') || x.split(' ')[0] === y.split(' ')[0]); };
  const DENOUEMENT = 1500;     // les dés 3D de CodexVTT se posent ~1,5 s après le lancer

  // ---------- Lire un jet : quel geste (d'après la compétence), quel verdict, quel mot ----------
  // Libellés de CodexVTT : compétences D&D 5e, traits Daggerheart, caractéristiques COF2. La première ligne qui correspond l'emporte.
  const COMPETENCES = [
    [/athlet|acrobat|course|agilit|bondir|sauter|esquive/, 'courir'], [/escalad|grimp/, 'grimper'], [/discret|furtiv|cacher|dissimul/, 'cacher'],
    [/escamot|crochet|serrur|desamorc|piege|vol a la tire|outils|finesse/, 'crocheter'], [/investig|fouill|cherch/, 'crocheter'],
    [/arcane|histoire|religion|connaiss|savoir|erudi|lire|dechiffr|nature|medecin|intellig/, 'lire'],
    [/percept|perspica|survie|instinct|observ|pister|vigilan/, 'observer'], [/intimid/, 'menacer'],
    [/persua|tromper|bluff|diplom|negoci|charme|charisme|presence|dressage|commander/, 'parler'], [/represent|musique|chant|danse|spectacle/, 'danser'],
    [/constitution|volonte|endur|resist/, 'parer'], [/sort|magie|incant|focus|rituel|pouvoir/, 'sort'],
    [/arc|arbalet|fronde|lancer|jet|tir|distance/, 'tirer'], [/force|puissance/, 'frapper'],
  ];
  function geste(j) {
    if (j.kind === 'heal') return 'soigner';
    if (j.kind === 'save') return 'parer';
    if (j.kind === 'initiative') return 'garde';
    const l = normaliser(j.label);
    for (const [m, g] of COMPETENCES) if (m.test(l)) return g;
    return j.kind === 'attack' || j.kind === 'damage' ? 'frapper' : 'neutre';
  }
  function verdict(j) {
    if (j.isCritSuccess || j.dhOutcome === 'critical') return 'crit';
    if (j.isCritFail) return 'fumble';
    if (j.isSuccess === true) return 'ok';
    if (j.isSuccess === false) return 'rate';
    return '';
  }
  const MOTS = { crit: 'Critique !', fumble: 'Échec critique…', ok: 'Réussite !', rate: 'Échec…' };
  const MOTS_ATTAQUE = { ok: 'Touché !', rate: 'Raté…' };

  // Un aventurier encapuchonné, à une couleur tirée de son nom, pour un perso sans apparence
  const TEINTES = ['#4F7CAC', '#2F7A4F', '#8E3A3A', '#7A5A9C', '#B07A2E', '#2E8A8A', '#9C4F7A', '#5E6E8C'];
  const aventurier = nom => ({ id: 'aventurier', nom, tenue: { type: 'cape', couleur: TEINTES[[...String(nom)].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 9973, 7) % TEINTES.length] },
    accessoire: 'capuche', yeux: { couleur: '#3A2A1A' } });

  // Le client Socket.IO : déjà là (window.io), sinon le fichier livré à côté de ce module
  function chargerIo(base) {
    if (typeof io === 'function') return Promise.resolve(io);
    return new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = new URL('socket.io.min.js', base).href;
      s.onload = () => ok(window.io); s.onerror = () => ko(new Error('socket.io.min.js introuvable'));
      document.head.appendChild(s);
    });
  }

  function brancher(o = {}) {
    const options = { adresse: '', cle: '', filtre: 'aplat', monPerso: '', demo: false, accent: '', ...o };
    const ecouteurs = {};
    const emettre = (nom, ...a) => (ecouteurs[nom] || []).forEach(f => { try { f(...a); } catch (e) { console.error('[CodexStream]', nom, e); } });
    let persos = [], combat = null, socket = null, minuteurDemo = null;
    const parlent = new Set(), portraits = new Set();
    const adresse = String(options.adresse || (typeof location !== 'undefined' ? location.origin : '')).replace(/\/+$/, '');
    const url = chemin => !chemin ? '' : /^(https?:|data:)/.test(chemin) ? chemin : adresse + '/' + String(chemin).replace(/^\/+/, '');
    const voulu = String(options.monPerso ?? '').trim();
    const estMoi = c => !!voulu && (/^\d+$/.test(voulu) ? String(c.id) === voulu : memeNom(c.name, voulu));
    const persoDe = c => ({
      id: c.id, nom: c.name || 'Aventurier', pv: c.hp ?? null, pvMax: c.hpMax ?? null, stress: c.stress ?? null, stressMax: c.stressMax ?? null,
      aTerre: !!c.down || (c.hpMax > 0 && c.hp <= 0), forme: c.form || '', portrait: url(c.portrait),
      apparence: c.appearance && typeof c.appearance === 'object' ? c.appearance : null, joueur: c.player ? (c.player.name || '') : '', moi: estMoi(c),
    });
    const trouver = id => persos.find(p => String(p.id) === String(id));
    const trouverJet = j => (j.sheetId != null && trouver(j.sheetId)) || persos.find(p => memeNom(j.characterName, p.nom)) || null;
    const majPortraits = id => portraits.forEach(p => { if (id == null || String(p.id) === String(id)) p.maj(); });

    // ---------- Les événements de CodexVTT ----------
    const R = {
      state(e) {
        persos = (e.characters || []).map(persoDe).sort((a, b) => b.moi - a.moi);
        emettre('table', persos); majPortraits(); R.combat(e.combat);
      },
      character(c) {
        const i = persos.findIndex(p => String(p.id) === String(c.id)), p = persoDe(c);
        if (i < 0) { persos.push(p); persos.sort((a, b) => b.moi - a.moi); emettre('table', persos); }
        else { if (!p.apparence && persos[i].apparence && c.appearance === undefined) p.apparence = persos[i].apparence; persos[i] = p; emettre('perso', p); }
        majPortraits(p.id);
      },
      removed({ id }) { persos = persos.filter(p => String(p.id) !== String(id)); emettre('table', persos); },
      hp(h) {
        const p = trouver(h.sheetId); if (!p) return;
        Object.assign(p, { pv: h.hp, pvMax: h.hpMax, aTerre: h.hpMax > 0 && h.hp <= 0 });
        emettre('perso', p); if (h.delta) emettre('coup', p, h.delta); majPortraits(p.id);
      },
      combat(cb) {
        combat = cb && cb.isActive ? {
          tour: cb.round, actif: cb.currentId,
          ordre: (cb.order || []).map(x => ({ id: x.id, nom: x.name, init: x.initiative, pnj: !!x.isNpc, persoId: x.sheetId ?? null })),
        } : null;
        emettre('combat', combat);
      },
      roll(j) {
        const p = trouverJet(j), v = verdict(j), attaque = j.kind === 'attack' || j.kind === 'damage';
        emettre('jet', {
          persoId: p ? p.id : null, nom: p ? p.nom : j.characterName, libelle: j.label || 'Jet', formule: j.formula || '', resultat: j.result,
          dd: j.nd ?? null, des: j.rolls || [], faces: j.sides || 20, verdict: v, geste: geste(j),
          mot: (attaque && MOTS_ATTAQUE[v]) || MOTS[v] || { hope: 'Espoir', fear: 'Peur' }[j.dhOutcome] || '',
          pnj: j.isNpc === true || (!p && j.isNpc !== false && j.sheetId != null), moi: !!(p && p.moi),
        });
      },
    };

    // ---------- La connexion (ou la démo) ----------
    if (options.demo) { emettre('etat', 'demo'); setTimeout(() => demo(R), 0); }
    else if (!adresse || !options.cle) setTimeout(() => emettre('etat', 'refusee'), 0);
    else {
      emettre('etat', 'connexion');
      chargerIo(typeof import.meta !== 'undefined' ? import.meta.url : location.href).then(io => {
        socket = io(adresse + '/spectator', { path: '/socket.io', transports: ['websocket'], auth: { spectatorKey: options.cle }, reconnectionDelay: 5000, reconnectionDelayMax: 60000 });
        socket.on('connect', () => emettre('etat', 'en-ligne'));
        socket.on('disconnect', raison => { emettre('etat', raison === 'io server disconnect' ? 'refusee' : 'hors-ligne'); if (raison === 'io server disconnect') setTimeout(() => socket.connect(), 60000); });
        socket.on('connect_error', () => emettre('etat', 'hors-ligne'));
        socket.on('revoked', () => { emettre('etat', 'revoquee'); socket.io.opts.reconnection = false; });
        socket.on('state', R.state); socket.on('character', R.character); socket.on('character:removed', R.removed);
        socket.on('hp', R.hp); socket.on('combat', R.combat); socket.on('roll', R.roll);
      }).catch(e => { console.error('[CodexStream]', e); emettre('etat', 'hors-ligne'); });
    }

    // Une partie inventée : une table, des jets, des coups, des voix au hasard
    function demo(R) {
      const ex = typeof PERSOS !== 'undefined' ? PERSOS : [];
      const noms = ['Kenai', 'Namerya', 'Zokhran', 'Trayss'];
      const fiches = noms.map((nom, i) => ({ id: 100 + i, name: nom, hp: 20 + i * 4, hpMax: 20 + i * 4, form: null, down: false, appearance: ex.find(p => memeNom(p.nom, nom)) || undefined }));
      R.state({ characters: fiches, combat: { isActive: true, round: 1, currentId: 'c0', order: fiches.map((f, i) => ({ id: 'c' + i, name: f.name, initiative: 20 - i, isNpc: false, sheetId: f.id })) } });
      const tirages = [['skill', 'Athlétisme', '1d20+5', 15], ['skill', 'Discrétion', '1d20+3'], ['attack', 'Épée longue', '1d20+6', 13], ['skill', 'Persuasion', '1d20+2', 12], ['heal', 'Soins', '2d8+3'], ['skill', 'Arcanes', '1d20+4', 14]];
      let n = 0;
      const lancer = () => {
        const f = fiches[n % fiches.length], [kind, label, formula, nd] = tirages[n % tirages.length], d = 1 + Math.floor(Math.random() * 20), bonus = Number((formula.match(/\+(\d+)/) || [])[1] || 0);
        R.roll({ sheetId: f.id, isNpc: false, characterName: f.name, kind, label, formula, result: d + bonus, rolls: [d], sides: 20, nd, isCritSuccess: d === 20, isCritFail: d === 1, ...(nd ? { isSuccess: d + bonus >= nd } : {}) });
        if (n % 3 === 2) { const c = fiches[(n + 1) % fiches.length], delta = -(1 + Math.floor(Math.random() * 6)); c.hp = Math.max(0, c.hp + delta); R.hp({ sheetId: c.id, delta, hp: c.hp, hpMax: c.hpMax }); }
        n++;
      };
      const voix = () => { persos.forEach(p => api.parle(p.id, false)); if (Math.random() > .2 && persos.length) api.parle(persos[Math.floor(Math.random() * persos.length)].id, true); };
      setTimeout(lancer, 1500);
      minuteurDemo = [setInterval(lancer, 6000), setInterval(voix, 1400)];
    }

    // ---------- Le dessin d'un perso, au filtre choisi ----------
    // l'apparence liée dans le labo de CodexVTT ; en démo seulement, les exemples ; sinon un aventurier encapuchonné
    const ficheDe = p => p.apparence || (options.demo && Apparence.trouver(p.nom)) || aventurier(p.nom);
    const dessin = (id, d = {}) => {
      const p = typeof id === 'object' ? id : trouver(id); if (!p) return '';
      const expression = d.expression ?? (p.aTerre ? 'ko' : '');
      return Filtres.rendu(d.filtre || options.filtre, ficheDe(p), { forme: p.forme, expression, cadrage: d.cadrage, accent: options.accent });
    };

    const api = {
      on(nom, f) { (ecouteurs[nom] = ecouteurs[nom] || []).push(f); if (nom === 'table' && persos.length) f(persos); return api; },
      persos: () => persos.slice(),
      combat: () => combat,
      dessin,
      // Le perso dessiné dans el, animé tout seul : la bouche quand il parle, K.O. à 0 PV, sa forme
      portrait(el, id, { cadrage = 'buste' } = {}) {
        let bouche = null, ouverte = false;
        const p = {
          id, maj() {
            const q = trouver(id);
            if (!q) { el.innerHTML = ''; return; }
            el.innerHTML = dessin(q, { cadrage, expression: q.aTerre ? 'ko' : ouverte ? 'parle' : '' });
            const svg = el.firstElementChild; if (svg) Object.assign(svg.style, { width: '100%', height: '100%', display: 'block' });
            el.classList.toggle('cs-parle', parlent.has(String(id)));
          },
          parler(oui) {
            if (oui && !bouche) bouche = setInterval(() => { ouverte = !ouverte; p.maj(); }, 170);
            if (!oui && bouche) { clearInterval(bouche); bouche = null; ouverte = false; }
            p.maj();
          },
          detruire() { clearInterval(bouche); portraits.delete(p); el.innerHTML = ''; },
        };
        portraits.add(p); p.maj();
        return p;
      },
      // Joue chaque jet dans el, un à la fois
      scenette(el, { duree = 4000, pnj = false, seulement = null } = {}) {   // seulement : j => true pour garder ce jet (ex. un seul perso)
        const file = []; let occupe = false, vivant = true;
        const suivant = async () => {
          if (occupe || !file.length || !vivant) return;
          occupe = true;
          const j = file.shift(), p = trouver(j.persoId) || { nom: j.nom, forme: '' };
          try { await Scenette.jouer(el, j, { duree: file.length ? Math.min(duree, 2500) : duree, denouement: DENOUEMENT, dessin: e => dessin(p, { expression: e }) }); }
          catch (e) { console.error('[CodexStream] scénette', e); }
          finally { occupe = false; suivant(); }
        };
        const surJet = j => { if (j.pnj && !pnj) return; if (seulement && !seulement(j)) return; file.push(j); suivant(); };
        api.on('jet', surJet);
        return { detruire() { vivant = false; ecouteurs.jet = (ecouteurs.jet || []).filter(f => f !== surJet); } };
      },
      parle(id, oui) {
        const k = String(id), avant = parlent.has(k);
        if (oui) parlent.add(k); else parlent.delete(k);
        if (avant === !!oui) return;
        portraits.forEach(p => { if (String(p.id) === k) p.parler(!!oui); });
        const q = trouver(id); if (q) emettre('parle', q, !!oui);
      },
      fermer() { if (socket) socket.close(); (minuteurDemo || []).forEach(clearInterval); portraits.forEach(p => p.detruire()); },
    };
    return api;
  }

  return { brancher, filtres: () => Filtres.liste, version: typeof VERSION !== 'undefined' ? VERSION : 'dev', DENOUEMENT };
})();

export { CodexStream, Apparence, Filtres, VERSION };
export default CodexStream;
