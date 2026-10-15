/* =====================================================================
   JDR — la table de la scène JDR : qui est assis où, et les portraits (cartes de héros).
   La table vient de config.js › jdr.places (réglable dans reglages.html › Scène JDR) :
     mj, p1 … p6 : { present, joueur, perso, nom, titre, discord }
       perso : un dessin de js/heros.js (mj, zokhran, namerya, kenai, trayss, trayss-mi, trayss-humaine, baheng, dvergrost)
               ou "autre" : sans dessin → l'aventurier encapuchonné à la couleur de la carte, puis le portrait de sa fiche CodexVTT
       nom, titre : vides = ceux du dessin
   JDR.table()            → les places occupées, dans l'ordre : [{ place, joueur, perso, discord, fiche }]
   JDR.portrait(place)    → la carte de héros, HORIZONTALE (le héros à gauche ; nom, sous-titre, PV à droite), avec
                            .placer({ x, y, l, h }, tailleNom) (sa place et sa taille ; le texte rétrécit s'il ne tient pas),
                            .parler(oui), .pv(pv, max), .coup(delta) (coup reçu < 0, soin > 0), .tour(oui) (son tour de combat),
                            .moi(oui) (« Toi » : le personnage de jdr.monPerso), .dessin(perso) (change de dessin),
                            .photo(adresse) (le portrait de la fiche CodexVTT, pour un personnage « autre »)
   JDR.pied(perso)        → le dessin en pied pour l'arène des jets (« autre » → aventurier)
   JDR.dessinDuNom(nom)   → le héros dessiné de ce nom (« Kenai le gardien » → kenai), ou null (le MJ n'est jamais rendu)
   JDR.normaliser(texte)  → minuscules sans accents (pour retrouver un personnage par son nom)
   Styles : css/jdr.css.
   ===================================================================== */
const JDR = (() => {
  // Le nom, le sous-titre et la couleur de chaque personnage dessiné
  const FICHES = {
    mj: { nom: 'Patagrain', titre: 'Maître du jeu', couleur: '#F5B82E' },
    zokhran: { nom: 'Zokhran', titre: 'Poète de la marmite', couleur: '#D64545' },
    namerya: { nom: 'Namerya', titre: "L'ondine aux yeux d'océan", couleur: '#3FA7D6' },
    kenai: { nom: 'Kenai', titre: 'Le gardien aux ombres', couleur: '#C0743C' },
    trayss: { nom: 'Trayss', titre: 'Héritage des brumes', couleur: '#9B5DE5' },
    'trayss-mi': { nom: 'Trayss', titre: 'Héritage des brumes', couleur: '#9B5DE5' },
    'trayss-humaine': { nom: 'Trayss', titre: 'Héritage des brumes', couleur: '#9B5DE5' },
    baheng: { nom: 'Ba Heng Ze', titre: 'Le savoir du monde', couleur: '#B08D57' },
    dvergrost: { nom: 'Dvergrost', titre: 'Enfant des rocs', couleur: '#7E8C99' },
  };
  const PLACES = ['mj', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
  // la couleur d'un personnage « autre » : tirée de son nom (toujours la même pour le même nom)
  const TEINTES = ['#4F7CAC', '#2F7A4F', '#8E3A3A', '#7A5A9C', '#B07A2E', '#2E8A8A', '#9C4F7A', '#5E6E8C'];
  const teinte = nom => TEINTES[[...String(nom)].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 9973, 7) % TEINTES.length];
  const dessine = perso => (perso === 'autre' ? 'aventurier' : perso);

  function table() {
    const places = ((window.CONFIG || {}).jdr || {}).places || {};
    return PLACES.map(place => ({ place, ...(places[place] || {}) }))
      .filter(p => p.present && p.perso)
      .map(p => {
        const base = FICHES[p.perso] || { nom: p.nom || 'Aventurier', titre: '', couleur: teinte(p.nom || p.place) };
        return { ...p, fiche: { ...base, nom: p.nom || base.nom, titre: p.titre || base.titre } };
      });
  }

  function portrait(p) {
    const el = document.createElement('div');
    el.className = 'portrait cligne';
    el.dataset.place = p.place;
    el.style.setProperty('--c', p.fiche.couleur);
    el.style.setProperty('--c-heros', p.fiche.couleur);           // la cape de l'aventurier
    el.innerHTML = `<div class="pt-cadre"><div class="pt-image"></div><div class="pt-ondes"><i></i><i></i><i></i></div><div class="pt-etat">💀 À terre</div></div>
      <div class="pt-texte"><div class="pt-nom"></div><div class="pt-titre"></div>
        <div class="pt-vie" hidden><div class="pt-pv"><i></i></div><b></b></div></div>`;
    el.querySelector('.pt-nom').textContent = p.fiche.nom;
    el.querySelector('.pt-titre').textContent = p.joueur ? `${p.fiche.titre ? p.fiche.titre + ' · ' : ''}${p.joueur}` : p.fiche.titre;
    // le nom rétrécit (jusqu'à 35 %) au lieu d'être coupé ; le sous-titre un peu (70 %), puis « … »
    const ajuster = () => el.querySelectorAll('.pt-nom, .pt-titre').forEach(e => {
      e.style.fontSize = '';
      const depart = parseFloat(getComputedStyle(e).fontSize);
      const plancher = depart * (e.classList.contains('pt-nom') ? .35 : .7);   // le sous-titre reste lisible (sinon « … »)
      for (let f = depart; e.scrollWidth > e.clientWidth && f > plancher; f -= .5) e.style.fontSize = f + 'px';
    });
    el.placer = (z, tailleNom) => {
      Object.assign(el.style, { left: z.x + 'px', top: z.y + 'px', width: z.l + 'px', height: z.h + 'px', fontSize: z.h / 10 + 'px' });
      el.style.setProperty('--pw', Math.round(Math.min(z.h * .72, z.l * .34)) + 'px');
      el.style.setProperty('--fn', tailleNom + 'em');
      requestAnimationFrame(ajuster);
      if (document.fonts) document.fonts.ready.then(ajuster);
    };
    const boite = el.querySelector('.pt-image');
    el.dessin = perso => {
      if (el.dataset.perso === perso) return;
      el.dataset.perso = perso;
      delete el.dataset.photo;
      if (typeof Heros !== 'undefined' && Heros.liste.includes(dessine(perso))) boite.innerHTML = Heros.svg(dessine(perso), 'tete');
      else boite.innerHTML = '<div class="pt-vide">?</div>';
      boite.querySelector('.heros-svg')?.classList.toggle('expr-ko', el.classList.contains('a-terre'));
    };
    el.dessin(p.perso);
    el.photo = adresse => {
      if (!adresse || el.dataset.photo === adresse) return;
      const img = new Image();
      img.className = 'pt-photo';
      img.alt = p.fiche.nom;
      img.onload = () => { boite.replaceChildren(img); el.dataset.photo = adresse; };   // si l'image ne vient pas, on garde le dessin
      img.src = adresse;
    };
    el.parler = oui => {
      el.classList.toggle('parle', !!oui);
      const bande = el.parentElement;                       // « quelqu'un parle » : les autres peuvent s'éteindre
      if (bande) bande.classList.toggle('parole', !!bande.querySelector('.portrait.parle'));
    };
    el.pv = (pv, max) => {
      const vie = el.querySelector('.pt-vie'), barre = el.querySelector('.pt-pv');
      vie.hidden = false;
      barre.querySelector('i').style.width = Math.max(0, pv / max * 100) + '%';
      vie.querySelector('b').textContent = `${pv} / ${max} PV`;
      barre.classList.toggle('bas', pv <= max / 3);
      el.classList.toggle('a-terre', pv <= 0);
      el.querySelector('.heros-svg')?.classList.toggle('expr-ko', pv <= 0);
    };
    el.coup = delta => {
      if (!delta) return;
      const chiffre = document.createElement('div');
      chiffre.className = 'pt-coup ' + (delta < 0 ? 'blesse' : 'soin');
      chiffre.textContent = (delta > 0 ? '+' : '') + delta;
      el.querySelector('.pt-cadre').appendChild(chiffre);
      el.classList.remove('touche', 'soigne'); void el.offsetWidth;          // relance l'animation
      el.classList.add(delta < 0 ? 'touche' : 'soigne');
      setTimeout(() => chiffre.remove(), 1600);
    };
    el.tour = oui => el.classList.toggle('son-tour', !!oui);
    el.moi = oui => el.classList.toggle('moi', !!oui);
    return el;
  }

  const normaliser = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  function dessinDuNom(nom) {
    const n = normaliser(nom);
    if (!n) return null;
    const trouve = Object.entries(FICHES).find(([id, f]) => id !== 'mj' && (n === normaliser(f.nom) || n.startsWith(normaliser(f.nom) + ' ')));
    return trouve ? trouve[0] : null;
  }

  return { table, portrait, normaliser, pied: dessine, teinte, dessinDuNom, FICHES };
})();
