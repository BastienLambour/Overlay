/* =====================================================================
   JDR — la table de la scène JDR : qui est assis où, et les portraits (cartes de héros).
   AUCUN DESSIN ICI : chaque personnage est une FICHE D'APPARENCE (ses traits), dessinée par la boîte à outils de CodexVTT
   (js/codex-stream.js) : sur les cartes en buste, dans l'arène en pied (le squelette du bouffon, le même moteur de gestes).
   La table vient de config.js › jdr.places (réglable dans reglages.html › Scène JDR) :
     mj, p1 … p6 : { present, joueur, perso, nom, titre, discord }
       perso : un héros de la table (mj, zokhran, namerya, kenai, trayss, trayss-mi, trayss-humaine, baheng, dvergrost : leurs fiches
               sont dans le catalogue de la boîte à outils, en attendant que leur apparence soit liée dans CodexVTT)
               ou "autre" : son apparence CodexVTT, sinon le portrait de sa fiche, sinon un aventurier encapuchonné à la couleur de la carte
       nom, titre : vides = ceux du héros
   JDR.table()            → les places occupées, dans l'ordre : [{ place, joueur, perso, discord, fiche }]
   JDR.portrait(place)    → la carte de héros, HORIZONTALE (le héros à gauche ; nom, sous-titre, PV à droite), avec
                            .placer({ x, y, l, h }, tailleNom), .parler(oui), .pv(pv, max), .coup(delta), .tour(oui), .moi(oui),
                            .dessin(perso) (change de héros), .apparence(fiche, forme) (l'apparence liée dans CodexVTT : elle passe avant tout),
                            .photo(adresse) (le portrait de la fiche CodexVTT, pour un « autre » sans apparence)
   JDR.ficheDe(perso, nom) → la fiche d'apparence d'un héros (et sa forme), ou un aventurier
   JDR.dessinDuNom(nom)   → le héros de ce nom (« Kenai le gardien » → kenai), ou null (le MJ n'est jamais rendu)
   JDR.image(fiche, forme) → le dessin (tête) en image, pour la carte d'un jet
   Styles : css/jdr.css.
   ===================================================================== */
const JDR = (() => {
  // Le nom, le sous-titre et la couleur de chaque héros de la table ; fiche = son id dans le catalogue (et sa forme)
  const FICHES = {
    mj: { nom: 'Patagrain', titre: 'Maître du jeu', couleur: '#F5B82E', fiche: 'patagrain' },
    zokhran: { nom: 'Zokhran', titre: 'Poète de la marmite', couleur: '#D64545', fiche: 'zokhran' },
    namerya: { nom: 'Namerya', titre: "L'ondine aux yeux d'océan", couleur: '#3FA7D6', fiche: 'namerya' },
    kenai: { nom: 'Kenai', titre: 'Le gardien aux ombres', couleur: '#C0743C', fiche: 'kenai' },
    trayss: { nom: 'Trayss', titre: 'Héritage des brumes', couleur: '#9B5DE5', fiche: 'trayss' },
    'trayss-mi': { nom: 'Trayss', titre: 'Héritage des brumes', couleur: '#9B5DE5', fiche: 'trayss', forme: 'Entre deux' },
    'trayss-humaine': { nom: 'Trayss', titre: 'Héritage des brumes', couleur: '#9B5DE5', fiche: 'trayss', forme: 'Humaine' },
    baheng: { nom: 'Ba Heng Ze', titre: 'Le savoir du monde', couleur: '#B08D57', fiche: 'baheng' },
    dvergrost: { nom: 'Dvergrost', titre: 'Enfant des rocs', couleur: '#7E8C99', fiche: 'dvergrost' },
  };
  const PLACES = ['mj', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
  // la couleur d'un personnage « autre » : tirée de son nom (toujours la même pour le même nom)
  const TEINTES = ['#4F7CAC', '#2F7A4F', '#8E3A3A', '#7A5A9C', '#B07A2E', '#2E8A8A', '#9C4F7A', '#5E6E8C'];
  const teinte = nom => TEINTES[[...String(nom)].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 9973, 7) % TEINTES.length];
  // Le style des personnages : un filtre de js/codex-stream.js (réglages › Scène JDR › Style des personnages ; Conte par défaut)
  const DESSIN = ((window.CONFIG || {}).jdr || {}).dessin || 'conte';
  const catalogue = id => (window.PERSOS || []).find(p => p.id === id) || null;
  // La fiche d'un héros de la table (et sa forme), sinon un aventurier encapuchonné à la couleur donnée
  function ficheDe(perso, nom = '', couleur = '') {
    const h = FICHES[perso];
    const f = h && catalogue(h.fiche);
    if (f) return { fiche: f, forme: h.forme || '' };
    return { fiche: CodexStream.fiche({ nom: nom || 'Aventurier', couleur: couleur || teinte(nom || 'Aventurier') }, { catalogue: false }), forme: '' };
  }
  const image = (fiche, forme) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(CodexStream.dessiner(fiche, { filtre: DESSIN, forme, cadrage: 'tete' }));

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
    el.className = 'portrait';
    el.dataset.place = p.place;
    el.style.setProperty('--c', p.fiche.couleur);
    el.innerHTML = `<div class="pt-cadre"><div class="pt-image"></div><div class="pt-ondes"><i></i><i></i><i></i></div><div class="pt-etat">💀 À terre</div></div>
      <div class="pt-texte"><div class="pt-nom"></div><div class="pt-titre"></div>
        <div class="pt-vie" hidden><div class="pt-pv"><i></i></div><b></b></div></div>`;
    el.querySelector('.pt-nom').textContent = p.fiche.nom;
    el.querySelector('.pt-titre').textContent = p.joueur ? `${p.fiche.titre ? p.fiche.titre + ' · ' : ''}${p.joueur}` : p.fiche.titre;
    // le nom rétrécit (jusqu'à 35 %) au lieu d'être coupé ; le sous-titre un peu (70 %), puis « … »
    const ajuster = () => el.querySelectorAll('.pt-nom, .pt-titre').forEach(e => {
      e.style.fontSize = '';
      const depart = parseFloat(getComputedStyle(e).fontSize);
      const plancher = depart * (e.classList.contains('pt-nom') ? .35 : .7);
      for (let f = depart; e.scrollWidth > e.clientWidth && f > plancher; f -= .5) e.style.fontSize = f + 'px';
    });
    el.placer = (z, tailleNom) => {
      Object.assign(el.style, { left: z.x + 'px', top: z.y + 'px', width: z.l + 'px', height: z.h + 'px', fontSize: z.h / 10 + 'px' });
      el.style.setProperty('--pw', Math.round(Math.min(z.h * .72, z.l * .34)) + 'px');
      el.style.setProperty('--fn', tailleNom + 'em');
      requestAnimationFrame(ajuster);
      if (document.fonts) document.fonts.ready.then(ajuster);
    };
    // Le dessin : la fiche d'apparence en buste, posée en bas du médaillon ; la bouche bouge quand il parle, K.O. à 0 PV
    const boite = el.querySelector('.pt-image');
    let fiche = null, forme = '', parle = false, bouge = null, aTerre = false;
    const peindre = () => { if (fiche) boite.innerHTML = `<div class="pt-conte">${CodexStream.dessiner(fiche, { filtre: DESSIN, forme, cadrage: 'mi-corps', expression: aTerre ? 'ko' : parle ? 'parle' : '' })}</div>`; };   // mi-corps : la tête et le torse, sur le squelette
    el.dessin = perso => {
      if (el.dataset.perso === perso && fiche) return;
      el.dataset.perso = perso;
      if (el.dataset.apparence) return;                    // l'apparence liée dans CodexVTT garde la main
      ({ fiche, forme } = ficheDe(perso, p.fiche.nom, p.fiche.couleur));
      // un « autre » sans apparence : l'aventurier en attendant le portrait de sa fiche CodexVTT
      peindre();
      el.dataset.photo = image(fiche, forme);              // le même dessin sur la carte de ses jets
    };
    el.apparence = (f, fo = '') => {
      const cle = JSON.stringify([f, fo]);
      if (el.dataset.apparence === cle) return;
      el.dataset.apparence = cle;
      fiche = f; forme = fo; peindre();
      el.dataset.photo = image(f, fo);
    };
    el.photo = adresse => {
      if (!adresse || el.dataset.photo === adresse || el.dataset.apparence || FICHES[el.dataset.perso]) return;   // un héros garde son dessin
      const img = new Image();
      img.className = 'pt-photo';
      img.alt = p.fiche.nom;
      img.onload = () => { boite.replaceChildren(img); el.dataset.photo = adresse; fiche = null; };
      img.src = adresse;
    };
    el.dessin(p.perso);
    el.parler = oui => {
      el.classList.toggle('parle', !!oui);
      if (oui && !bouge && fiche) bouge = setInterval(() => { parle = !parle; peindre(); }, 170);
      if (!oui && bouge) { clearInterval(bouge); bouge = null; parle = false; peindre(); }
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
      if (aTerre !== (pv <= 0)) { aTerre = pv <= 0; peindre(); }
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
    el.fiche = () => ({ fiche, forme });
    return el;
  }

  const normaliser = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  function dessinDuNom(nom) {
    const n = normaliser(nom);
    if (!n) return null;
    const trouve = Object.entries(FICHES).find(([id, f]) => id !== 'mj' && (n === normaliser(f.nom) || n.startsWith(normaliser(f.nom) + ' ')));
    return trouve ? trouve[0] : null;
  }

  return { table, portrait, normaliser, teinte, dessinDuNom, ficheDe, image, FICHES, DESSIN };
})();
