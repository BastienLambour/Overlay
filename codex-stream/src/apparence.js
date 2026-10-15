/* =====================================================================
   APPARENCE — un personnage décrit par une FICHE (ses traits), pas par un dessin.
   Chaque overlay le dessine ensuite à SON style, à partir des mêmes formes : le même perso est reconnaissable
   partout (Xaieysi créé chez Patagrain = le même chez Mordeth, en néon).

   La fiche (apparence liée dans CodexVTT, ou catalogue provisoire : exemples.js). Tout est FACULTATIF : un overlay qui ne dessine pas un trait l'ignore.
     { id, nom, titre, couleur,                       // couleur = sa couleur de carte
       tete (la FORME du visage) : 'ovale'|'ronde'|'allongee'|'carree'|'coeur'|'large'|'anguleuse'
         (anciens noms toujours compris : humaine = ovale, longue = allongee, orc = large, draconide = anguleuse + museau dragon),
       museau: ''|'dragon'   (museau, crête et collerette de dragon ; ni cheveux ni oreilles), carrure: 'normale'|'large'|'petite',
       peau, yeux: { couleur, forme: 'rond'|'amande'|'fendu'|'grand'|'petit'|'mi-clos', lueur },
       cheveux: { coupe: 'court'|'long'|'queue'|'chignon'|'frange'|'herisse'|'boucle'|'carre'|'tresses'|'couettes'|'iroquoise'|'rase'|'chauve',
                  couleur, meche }   (meche = la couleur de la 2e couche : elle dépasse sous la 1re, et colore les cheveux de derrière),
       oreilles: 'petites'|'pointues'|'longues'|'rondes'|'decollees'|'tombantes'|'nageoires'   (ancien nom compris : humaines = petites),
       cornes: ''|'petites'|'belier'|'arriere'|'longues'|'courbes'|'licorne'|'bois',
       dents: ''|'crocs'|'defenses'|'canines'|'lapin'   (elles suivent la bouche : ouverte, rire, surprise),
       pilosite: ''|'barbe'|'barbe-longue'|'moustache'|'guidon'|'menton'|'bouc'|'anneau'|'favoris'  ou  { type, couleur }  (couleur : celle des cheveux par défaut),
       tenue: { type: 'tunique'|'robe'|'armure'|'cuir'|'mage'|'cape', couleur, couleur2 },   (cuir : épaulières et rivets ; mage : robe à galons et étoiles)
       taille: 'normale'|'petite'|'grande'   (en pied : petite = nain, halfelin)
       accessoire: un nom ou une LISTE : 'capuche'|'chapeau'|'toque'|'turban'|'couronne'|'bandeau'|'lunettes'|'lunettes-carrees'|'casque'|'boucles'|'boucle-gauche'|'boucle-droite' (une seule, côté de l'image)
                   |'tablier'|'griffes' (collier de griffes)|'ours' (cape en peau d'ours) ; couleurCoiffe : la couleur de la toque, du turban,
                   du chapeau, de la capuche (sinon celle de la tenue ; la toque est blanche)
       signe: ''|'cicatrice'|'tatouage'|'taches'|'grain' (grain de beauté),
       objet, objet2: ''|'epee'|'epee-magique'|'hache'|'masse'|'hachoir'|'baton'|'arbalete'|'arc'|'bouclier'|'livre'|'kazoo'|'carquois'
                      (main droite / main gauche de l'image, ou dos ; dessinés en pied) ; couleurObjet : la lueur de l'épée magique, l'orbe du bâton,
       formes: { "Dragon": { …les traits qui changent } } }    // la forme active (CodexVTT : nom du portrait actif)

     Apparence.calques(fiche, { expression, forme }) → [{ id, d, fond, trait, epaisseur, partie }] dans l'ordre (dos → devant),
       viewBox 0 0 200 240 (un buste) ; partie : 'peau' | 'cheveux' | 'tenue' | 'yeux' | 'detail' | 'accessoire'
       expression : '' | 'parle' (bouche ouverte) | 'rire' | 'choc' | 'ko'
       options aussi : sans: [ids], seulement: [ids] (ne garder qu'une partie des calques, ex. la tête sans le corps)
     EN PIED : le squelette du bouffon de Patagrain (src/squelette.js) : Apparence.calques(fiche, { cadrage: 'squelette', partie })
       → les calques d'un morceau (torse, bras-g, avant-bras-g, main-g, objet-g, cuisse-g, tibia-g…, dos) ; la tête = le buste sans le corps.
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
    ovale: 'M100 42 C128 42 142 66 142 98 C142 134 125 160 100 162 C75 160 58 134 58 98 C58 66 72 42 100 42 Z',
    large: 'M100 44 C134 44 150 68 150 100 C150 140 134 164 100 168 C66 164 50 140 50 100 C50 68 66 44 100 44 Z',
    anguleuse: 'M100 46 C134 46 154 66 156 94 C158 116 150 132 140 146 C130 162 116 172 100 172 C84 172 70 162 60 146 C50 132 42 116 44 94 C46 66 66 46 100 46 Z',
    ronde: 'M100 44 C134 44 148 70 148 104 C148 138 128 158 100 158 C72 158 52 138 52 104 C52 70 66 44 100 44 Z',
    allongee: 'M100 36 C128 36 140 62 140 96 C140 136 124 168 100 170 C76 168 60 136 60 96 C60 62 72 36 100 36 Z',
    carree: 'M100 42 C132 42 146 62 146 96 C146 126 142 146 128 156 C118 162 110 164 100 164 C90 164 82 162 72 156 C58 146 54 126 54 96 C54 62 68 42 100 42 Z',
    coeur: 'M100 42 C132 42 146 64 146 94 C146 124 124 150 100 166 C76 150 54 124 54 94 C54 64 68 42 100 42 Z',
  };
  const JOUE = 'M124 70 C138 84 142 104 140 124 C136 144 124 156 112 160 C126 146 132 128 132 108 C132 92 128 80 124 70 Z';
  const MUSEAU = 'M100 112 C118 112 130 122 132 138 C134 154 120 166 100 166 C80 166 66 154 68 138 C70 122 82 112 100 112 Z';
  const CRETE = 'M100 50 L106 62 L100 70 L94 62 Z M100 72 L105 82 L100 88 L95 82 Z';
  const COLLERETTE = paire('M50 96 L18 80 L30 96 L14 108 L34 112 L22 126 L50 120 Z');
  const COU = { normale: 'M89 150 L111 150 L113 186 L87 186 Z', large: 'M84 150 L116 150 L119 186 L81 186 Z', petite: 'M90 152 L110 152 L111 186 L89 186 Z' };
  const EPAULES = {
    tunique: 'M18 240 C22 198 54 182 100 180 C146 182 178 198 182 240 Z',
    robe: 'M14 240 C20 196 52 178 100 176 C148 178 180 196 186 240 Z',
    armure: 'M10 240 C10 200 36 182 64 178 C76 176 88 180 100 180 C112 180 124 176 136 178 C164 182 190 200 190 240 Z',
    cape: 'M6 240 C14 192 50 174 100 172 C150 174 186 192 194 240 Z',
    cuir: 'M10 240 C10 200 36 182 64 178 C76 176 88 180 100 180 C112 180 124 176 136 178 C164 182 190 200 190 240 Z',
    mage: 'M14 240 C20 196 52 178 100 176 C148 178 180 196 186 240 Z',
  };
  const COL = { tunique: 'M80 182 L100 210 L120 182 Z', robe: 'M72 180 L100 226 L128 180 Z', armure: 'M64 178 C76 196 88 204 100 204 C112 204 124 196 136 178 L136 190 C124 210 112 216 100 216 C88 216 76 210 64 190 Z', cape: 'M70 176 C80 190 90 196 100 196 C110 196 120 190 130 176 L134 186 C122 202 110 208 100 208 C90 208 78 202 66 186 Z',
    cuir: 'M80 182 L100 210 L120 182 Z', mage: 'M72 180 L100 226 L128 180 Z' };
  const DOS = {
    long: 'M100 34 C58 34 44 70 46 112 C48 150 46 186 40 214 L160 214 C154 186 152 150 154 112 C156 70 142 34 100 34 Z',
    queue: 'M114 40 C150 34 164 70 158 110 C154 140 158 170 168 196 C146 186 138 160 140 128 C142 96 138 66 118 56 Z',
    boucle: rond(64, 70, 18) + rond(136, 70, 18) + rond(54, 104, 16) + rond(146, 104, 16) + rond(100, 46, 26),
    frange: 'M100 36 C62 36 50 66 52 100 C54 124 54 136 52 148 L148 148 C146 136 146 124 148 100 C150 66 138 36 100 36 Z',
    chignon: rond(100, 26, 18, 15),
    carre: 'M100 34 C60 34 44 66 46 104 C48 128 50 144 54 156 L146 156 C150 144 152 128 154 104 C156 66 140 34 100 34 Z',
    tresses: 'M100 36 C62 36 50 66 52 100 C54 124 54 136 52 148 L148 148 C146 136 146 124 148 100 C150 66 138 36 100 36 Z',
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
    carre: CALOTTE + ' ' + paire('M56 90 C50 110 52 132 56 152 L68 152 C64 132 62 112 64 96 Z'),
    tresses: CALOTTE + ' ' + paire('M60 118 C56 140 58 162 54 192 C60 196 66 196 70 192 C70 162 70 140 68 120 Z'),
    couettes: CALOTTE + ' ' + paire('M54 72 C32 70 20 94 28 118 C34 134 46 130 50 118 C46 108 46 90 58 82 Z'),
    iroquoise: 'M88 66 C86 40 90 16 100 4 C110 16 114 40 112 66 C106 62 94 62 88 66 Z',
    rase: 'M58 92 C56 60 76 40 100 40 C124 40 144 60 142 92 C132 72 118 64 100 64 C82 64 68 72 58 92 Z',
  };
  const OREILLE = { petites: rond(57, 106, 7.5, 11.5), pointues: 'M60 100 L26 76 L40 98 L58 120 Z', longues: 'M60 98 L16 88 L34 106 L58 122 Z',
    rondes: rond(52, 104, 12, 15), decollees: 'M60 94 C38 80 26 98 32 116 C36 128 50 126 60 118 Z',
    tombantes: 'M60 98 C40 104 26 118 18 138 C34 130 48 122 60 116 Z', nageoires: 'M60 90 L30 76 L38 90 L26 100 L40 106 L28 120 L58 118 Z' };
  // (un rond ne se retourne pas avec miroir : ses arcs ; l'oreille de droite des oreilles rondes est écrite à part)
  const OREILLE_D = { petites: rond(143, 106, 7.5, 11.5), rondes: rond(148, 104, 12, 15) };
  const CORNES = {
    petites: paire('M74 50 L64 22 L84 44 Z'),
    belier: paire('M74 58 C44 38 18 60 28 90 C34 108 58 112 66 94 C72 82 62 70 50 74 C42 78 44 90 54 90 C46 96 36 88 38 76 C42 58 62 58 74 68 Z'),
    longues: paire('M76 52 L66 4 L86 46 Z'),
    courbes: paire('M74 54 C54 44 48 22 60 2 C62 22 72 36 86 46 Z'),
    licorne: 'M95 46 L100 2 L105 46 Z',
    bois: paire('M80 50 C74 38 70 26 72 8 L77 8 C77 18 78 26 80 32 C84 26 86 18 86 10 L91 12 C90 22 86 32 82 38 C88 34 94 30 98 24 L101 28 C96 36 90 42 86 48 Z'),
    arriere: paire('M72 58 C60 40 46 30 24 26 C40 34 52 46 58 64 Z M84 50 C76 32 66 20 48 12 C60 24 68 38 72 54 Z'),   // rabattues vers l'arrière (draconide)
  };
  // Les dents, posées sur la bouche de l'expression (bas = la lèvre du bas, haut = celle du haut, ecart = la bouche plus large ou plus étroite)
  const deplacer = (d, dx, dy) => d.replace(/([MLC])([^A-Za-z]*)/g, (_, c, n) => c + n.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (__, x, y) => `${+(+x + dx).toFixed(1)} ${+(+y + dy).toFixed(1)}`));
  const BOUCHE = { '': { bas: 141, haut: 136, ecart: 0 }, parle: { bas: 145, haut: 135, ecart: 0 }, rire: { bas: 150, haut: 133, ecart: 3 }, choc: { bas: 147, haut: 133, ecart: -4 }, ko: { bas: 141, haut: 136, ecart: 0 } };
  function dents(type, expression, yb) {
    const b = BOUCHE[expression] || BOUCHE[''], e = b.ecart, bas = b.bas + yb, haut = b.haut + yb;
    const DENTS = {
      crocs: `M${88 - e} ${bas} L${91 - e} ${bas - 8} L${94 - e} ${bas} Z`,
      defenses: deplacer('M80 146 C78 136 80 126 86 120 C86 130 88 138 90 146 Z', -e, bas - 141),
      canines: `M${91 - e} ${haut} L${93.5 - e} ${haut + 8} L${96 - e} ${haut} Z`,
      lapin: `M95.5 ${haut} L99.5 ${haut} L99.5 ${haut + 7} L95.5 ${haut + 7} Z`,
    };
    return DENTS[type] ? paire(DENTS[type]) : '';
  }
  const PILOSITE = {
    barbe: 'M58 116 C60 150 78 172 100 174 C122 172 140 150 142 116 C136 140 122 150 110 150 C106 146 94 146 90 150 C78 150 64 140 58 116 Z',
    'barbe-longue': 'M58 116 C58 160 74 206 100 230 C126 206 142 160 142 116 C136 140 122 150 110 150 C106 146 94 146 90 150 C78 150 64 140 58 116 Z',
    moustache: 'M100 128 C92 124 82 126 78 134 C86 132 94 134 100 132 C106 134 114 132 122 134 C118 126 108 124 100 128 Z',
    guidon: 'M100 127 C90 121 78 123 70 131 C68 123 62 123 59 127 C65 138 82 136 100 132 C118 136 135 138 141 127 C138 123 132 123 130 131 C122 123 110 121 100 127 Z',
    menton: 'M80 146 C84 162 92 172 100 174 C108 172 116 162 120 146 C112 152 106 154 100 154 C94 154 88 152 80 146 Z',
    bouc: 'M100 126 C90 122 80 126 78 134 C78 148 86 162 100 166 C114 162 122 148 122 134 C120 126 110 122 100 126 Z',
    favoris: paire('M56 94 C54 116 58 134 68 144 L74 136 C66 126 64 110 64 94 Z'),
    anneau: 'M100 125 C88 121 78 127 77 137 C76 151 86 165 100 167 C114 165 124 151 123 137 C122 127 112 121 100 125 Z M100 133 C110 133 115 137 115 143 C114 151 108 157 100 158 C92 157 86 151 85 143 C85 137 90 133 100 133 Z',
  };
  const ACCESSOIRE = {
    capuche: { dos: 'M100 22 C46 22 30 80 34 132 C36 162 44 186 54 200 L146 200 C156 186 164 162 166 132 C170 80 154 22 100 22 Z', devant: 'M100 30 C60 30 44 70 46 104 C50 80 70 58 100 58 C130 58 150 80 154 104 C156 70 140 30 100 30 Z' },
    chapeau: { devant: 'M22 72 C40 60 70 56 100 56 C130 56 160 60 178 72 C160 78 130 80 100 80 C70 80 40 78 22 72 Z M64 64 C66 30 82 14 100 14 C118 14 134 30 136 64 C124 58 112 56 100 56 C88 56 76 58 64 64 Z' },
    toque: { devant: 'M64 66 L68 40 C56 36 54 18 70 16 C74 4 92 2 100 10 C108 2 126 4 130 16 C146 18 144 36 132 40 L136 66 C124 60 112 58 100 58 C88 58 76 60 64 66 Z', blanc: true },
    couronne: { devant: 'M64 52 L70 26 L84 44 L100 18 L116 44 L130 26 L136 52 C124 48 112 46 100 46 C88 46 76 48 64 52 Z', or: true },
    bandeau: { devant: 'M56 74 C70 66 86 62 100 62 C114 62 130 66 144 74 L144 84 C130 76 114 72 100 72 C86 72 70 76 56 84 Z' },
    lunettes: { trait: rond(82, 100, 14, 12) + rond(118, 100, 14, 12) + ' M96 100 L104 100 M68 98 L56 94 M132 98 L144 94' },
    'lunettes-carrees': { trait: 'M68 90 L96 90 L96 109 L68 109 Z M104 90 L132 90 L132 109 L104 109 Z M96 98 L104 98 M68 96 L56 92 M132 96 L144 92', verre: 'M68 90 L96 90 L96 109 L68 109 Z M104 90 L132 90 L132 109 L104 109 Z' },
    casque: { dos: 'M100 18 C52 18 34 60 36 104 C38 132 46 150 56 160 L144 160 C154 150 162 132 164 104 C166 60 148 18 100 18 Z', devant: 'M62 84 C70 70 84 64 100 64 C116 64 130 70 138 84 L138 92 C126 82 114 78 100 78 C86 78 74 82 62 92 Z' },
    boucles: { bijou: rond(56, 124, 4) + rond(144, 124, 4) },
    'boucle-gauche': { bijou: rond(56, 124, 4) }, 'boucle-droite': { bijou: rond(144, 124, 4) },   // (côté de l'image)
    turban: { devant: 'M52 84 C40 60 52 30 80 26 C88 12 112 12 120 26 C148 30 160 60 148 84 C132 70 116 66 100 66 C84 66 68 70 52 84 Z M64 62 C80 50 120 50 136 62 M60 74 C80 60 120 60 140 74', coiffe: true, bijou: rond(100, 46, 5) },
    tablier: { epaules: 'M76 196 L124 196 L130 240 L70 240 Z', couleur: '#F2EEE4' },
    griffes: { epaules: 'M78 186 L82 200 L86 186 Z M90 191 L94 206 L98 191 Z M102 191 L106 206 L110 191 Z M114 186 L118 200 L122 186 Z', couleur: '#EFE6CE' },
    ours: { epaules: 'M6 240 C8 204 28 182 56 174 L66 192 L80 178 L100 194 L120 178 L134 192 L144 174 C172 182 192 204 194 240 Z', couleur: '#5A4030' },
  };
  const SIGNE = { cicatrice: 'M118 112 L132 132 M121 118 L126 115 M125 124 L130 121', tatouage: 'M124 112 C132 116 134 124 130 132 M70 112 C64 118 64 126 68 132', taches: rond(80, 118, 1.6) + rond(86, 122, 1.6) + rond(76, 124, 1.6) + rond(120, 118, 1.6) + rond(114, 122, 1.6) + rond(124, 124, 1.6),
    grain: rond(126, 126, 2) };
  // Carrure : les épaules plus larges ou plus étroites (transformation des formes autour du milieu)
  const etirer = (d, k) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${+(100 + (parseFloat(x) - 100) * k).toFixed(1)} ${y}`);

  function calques(fiche0, { expression = '', forme = '', cadrage = '', partie = '', sans = null, seulement = null } = {}) {
    if (cadrage === 'squelette' && partie) return Squelette.pieces(fusion(fiche0 || {}, forme), partie);   // en pied : src/squelette.js
    const L = calquesBuste(fiche0, { expression, forme });
    return seulement ? L.filter(c => seulement.includes(c.id)) : sans ? L.filter(c => !sans.includes(c.id)) : L;
  }

  function calquesBuste(fiche0, { expression = '', forme = '' } = {}) {
    const f = fusion(fiche0 || {}, forme);
    const ALIAS = { humaine: 'ovale', longue: 'allongee', orc: 'large', draconide: 'anguleuse' };   // les anciens noms (apparences déjà enregistrées)
    const nomTete = ALIAS[f.tete] || f.tete, tete = VISAGE[nomTete] ? nomTete : 'ovale';
    const dragon = f.museau === 'dragon' || (f.tete === 'draconide' && f.museau !== '');
    const carrure = COU[f.carrure] ? f.carrure : 'normale', kCarrure = { large: 1.14, petite: .9, normale: 1 }[carrure] * .88;   // (des épaules fines : le buste ne doit pas écraser la tête)
    const peau = f.peau || '#E8B894', ombre = teinte(peau, -.12);
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
    if (accDos) pousser('accessoire-dos', accDos[1].dos, 'accessoire', f.couleurCoiffe && accDos[0] === 'capuche' ? teinte(f.couleurCoiffe, -.15) : teinte(tc, -.25));
    if (DOS[coupe] && !accDos) pousser('cheveux-dos', DOS[coupe], 'cheveux', ch.meche ? teinte(ch.meche, -.08) : teinte(cc, -.12));
    pousser('epaules', etirer(EPAULES[tt], kCarrure), 'tenue', tc);
    pousser('col', etirer(COL[tt], kCarrure), 'tenue', t.couleur2 || teinte(tc, .35));
    accs.forEach(([, a]) => { if (a.epaules) pousser('accessoire-corps', etirer(a.epaules, kCarrure), 'accessoire', a.couleur, teinte(a.couleur, -.45), 1.5); });
    pousser('cou', COU[carrure], 'peau', ombre);
    if (f.cornes && CORNES[f.cornes]) { const cc2 = f.couleurCornes || (dragon ? teinte(peau, -.35) : '#E8DCC2'); pousser('cornes', CORNES[f.cornes], 'detail', cc2, teinte(cc2, -.5), 2.2); }   // (un contour : elles se voient sur toutes les peaux)
    if (dragon) pousser('collerette', COLLERETTE, 'peau', teinte(peau, -.25));
    else if (!accDos || accDos[0] === 'casque') { const nomOr = f.oreilles === 'humaines' || !OREILLE[f.oreilles] ? 'petites' : f.oreilles, or = OREILLE[nomOr]; pousser('oreille-g', or, 'peau', peau); pousser('oreille-d', OREILLE_D[nomOr] || miroir(or), 'peau', peau); }
    pousser('visage', VISAGE[tete], 'peau', peau);
    pousser('joue', dragon ? etirer(JOUE, 1.15) : JOUE, 'peau', ombre);
    if (dragon) { pousser('museau', MUSEAU, 'peau', teinte(peau, .18)); pousser('crete', CRETE, 'detail', teinte(peau, -.3)); }
    if (f.signe && SIGNE[f.signe]) { const point = f.signe === 'taches' || f.signe === 'grain'; pousser('signe', SIGNE[f.signe], 'detail', point ? teinte(peau, f.signe === 'grain' ? -.55 : -.3) : null, point ? null : teinte(peau, -.45), 2.5); }
    // yeux
    if (expression === 'ko') {
      pousser('yeux', 'M74 94 L90 106 M90 94 L74 106 M110 94 L126 106 M126 94 L110 106', 'yeux', null, '#1A1418', 4);
    } else if (expression === 'rire') {
      pousser('yeux', 'M72 102 C78 94 88 94 92 102 M108 102 C112 94 122 94 128 102', 'yeux', null, '#1A1418', 4);
    } else {
      const forme = y.forme || 'rond', grand = forme === 'grand', petit = forme === 'petit';
      const ry = forme === 'amande' ? 4.4 : grand ? (expression === 'choc' ? 10.5 : 9) : expression === 'choc' ? 8 : 5.8, rx = grand ? 11 : 8.6;
      if (petit) {                                   // de petits yeux ronds, sans blanc (dessin animé)
        pousser('iris', rond(83, 98, expression === 'choc' ? 4.2 : 3.4) + rond(117, 98, expression === 'choc' ? 4.2 : 3.4), 'yeux', y.lueur ? iris : '#1A1418');
        if (y.lueur) pousser('lueur', rond(83, 98, 7) + rond(117, 98, 7), 'yeux', null, iris, 2);
      }
      if (!petit) pousser('blanc', rond(82, 98, rx, ry) + rond(118, 98, rx, ry), 'yeux', y.lueur ? teinte(iris, .7) : '#FFFFFF');
      if (!petit) pousser('iris', y.forme === 'fendu' ? 'M80 91 C84 95 84 101 80 105 C78 101 78 95 80 91 Z M116 91 C120 95 120 101 116 105 C114 101 114 95 116 91 Z' : rond(83, 98, grand ? 6.2 : 4.3) + rond(119, 98, grand ? 6.2 : 4.3), 'yeux', y.forme === 'fendu' ? '#1A1418' : iris);
      if (!petit && y.forme !== 'fendu') pousser('pupille', rond(83.5, 98, grand ? 2.8 : 1.9) + rond(119.5, 98, grand ? 2.8 : 1.9), 'yeux', '#1A1418');
      if (grand) pousser('reflet', rond(86, 94, 2.2) + rond(122, 94, 2.2), 'yeux', '#FFFFFF');
      if (forme === 'mi-clos') pousser('paupieres', paire('M70 99 C74 87 90 87 94 99 C88 95 76 95 70 99 Z'), 'peau', peau, teinte(peau, -.4), 2);
      if (y.lueur && !petit) pousser('lueur', rond(82, 98, rx + 3, ry + 3) + rond(118, 98, rx + 3, ry + 3), 'yeux', null, iris, 2);
    }
    pousser('sourcils', dragon ? 'M68 84 L92 88 M108 88 L132 84' : expression === 'choc' ? 'M70 80 C76 74 86 74 92 78 M108 78 C114 74 124 74 130 80' : 'M70 85 C76 80 86 80 92 83 M108 83 C114 80 124 80 130 85', 'cheveux', null, dragon ? teinte(peau, -.4) : teinte(cc, -.2), 2.8);
    pousser('nez', dragon ? 'M92 126 C94 122 96 122 96 126 M104 126 C104 122 106 122 108 126' : 'M100 104 C98 116 96 120 93 123 C98 127 104 127 108 123', 'detail', null, dragon ? teinte(peau, -.45) : teinte(peau, -.22), 2.2);
    const yb = dragon ? 12 : 0;
    const bouches = { parle: `M90 ${134 + yb} C94 ${146 + yb} 106 ${146 + yb} 110 ${134 + yb} C104 ${137 + yb} 96 ${137 + yb} 90 ${134 + yb} Z`, rire: `M86 ${132 + yb} C90 ${152 + yb} 110 ${152 + yb} 114 ${132 + yb} C104 ${136 + yb} 96 ${136 + yb} 86 ${132 + yb} Z`, choc: rond(100, 140 + yb, 6, 8) };
    if (pil.type && PILOSITE[pil.type] && !dragon) pousser('pilosite', PILOSITE[pil.type], 'cheveux', pil.couleur || cc);   // sous la bouche
    if (bouches[expression]) pousser('bouche', bouches[expression], 'detail', f.bouche || '#5A2A2A');
    else pousser('bouche', dragon ? 'M80 150 C92 156 108 156 120 150' : 'M90 136 C95 140.5 105 140.5 110 136', 'detail', null, f.bouche || '#7A3A3A', 2.4);
    if (f.dents) pousser('dents', dents(f.dents, expression, yb), 'detail', '#F4EEDC', '#3A2A1A', 1.2);
    // devant
    if (!accDos || accDos[0] === 'casque') {
      if (ch.meche && DEVANT[coupe]) pousser('meche', deplacer(DEVANT[coupe], 0, 7), 'cheveux', ch.meche);   // la 2e couche, juste dessous
      pousser('cheveux', DEVANT[coupe], 'cheveux', cc);
    }
    accs.forEach(([nom, a]) => {
      const coiffe = f.couleurCoiffe && ['toque', 'turban', 'chapeau', 'capuche', 'bandeau'].includes(nom) ? f.couleurCoiffe : null;
      if (a.devant) pousser('accessoire', a.devant, 'accessoire', coiffe || (a.or ? '#F5C542' : a.blanc ? '#F7F4EC' : nom === 'bandeau' ? (t.couleur2 || teinte(tc, .3)) : teinte(tc, -.1)));
      if (a.verre) pousser('verres', a.verre, 'accessoire', 'rgba(255,255,255,.14)');
      if (a.trait) pousser('accessoire', a.trait, 'accessoire', null, '#16181C', 3.5);
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

  // La fiche du catalogue provisoire (window.PERSOS, exemples.js) d'un personnage, d'après son nom (« Kenai le gardien » → Kenai) ou son id ; sinon null
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
