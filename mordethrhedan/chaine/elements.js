/* =====================================================================
   MORDETHRHEDAN — Visuels de la chaîne Twitch (affichés par chaine/kit.html).
   Même couleur d'accent que l'overlay (config.js › couleur, ou ?couleur=rouge).
   Textes : config.js › chaine. Export PNG : node outils/exporter-chaine.mjs
   ===================================================================== */
(() => {
  const C = window.CONFIG || {};
  const K = C.chaine || {};
  const graine = (C.fond || {}).graine || 7;

  document.head.insertAdjacentHTML('beforeend', `<style>
    .mn { position: absolute; inset: 0; background: var(--fond); overflow: hidden; color: var(--texte); font-family: var(--f-texte); }
    .mn .eclat { animation: none; }
    .mn-voile { position: absolute; inset: 0; background: rgba(0,0,0,.35); }
    .mn-centre { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    .mn-emote { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .mn-trait { fill: none; stroke: var(--accent); stroke-linecap: round; stroke-linejoin: round;
      filter: drop-shadow(0 0 2px var(--accent-fonce)) drop-shadow(0 0 5px var(--accent-halo)); }
  </style>`);

  const fond = (l, h, g = graine) => `<div style="position:absolute;inset:0;width:${l}px;height:${h}px">${fondNeon({ graine: g })}</div>`;
  const cadre = (x, y, l, h, extra = '', style = '') => `<div class="cadre ${extra}" style="left:${x}px;top:${y}px;width:${l}px;height:${h}px;${style}"></div>`;
  const neon = (texte, taille, style = '') => `<div class="titre-neon" style="font-size:${taille}px;${style}">${texte}</div>`;
  // Emote en texte néon, ajusté à la largeur
  const emoteTexte = (t, taille) => `<div class="mn-emote">${neon(t, taille, 'letter-spacing:1px')}</div>`;
  // Badge : chiffre néon dans un cadre arrondi
  const badge = n => `<div class="cadre verre" style="left:6px;top:6px;width:60px;height:60px;--rayon:16px;--epaisseur:4px"></div>
    <div class="mn-emote">${neon(n, n.length > 1 ? 30 : 38)}</div>`;

  const D = K.dons || {};
  // Cœur en trait néon (page de dons)
  const coeur = (t, ep = 9) => `<svg viewBox="0 0 120 110" width="${t}" height="${t * 110 / 120}" style="overflow:visible">
    <path class="mn-trait" stroke-width="${ep}" d="M60 98 C22 72 8 52 12 32 C16 12 44 6 60 28 C76 6 104 12 108 32 C112 52 98 72 60 98 Z"/></svg>`;

  const planning = (K.planning || []).length
    ? K.planning.map(([j, h]) => `<div><b style="color:var(--accent)">${j}</b> · ${h}</div>`).join('')
    : '<div>Suis la chaîne pour être prévenu du prochain live</div>';

  window.KIT = {
    avant() {
      Commun.appliquerCouleur(Commun.params.get('couleur') || C.couleur);
      document.documentElement.dataset.halo = Commun.params.get('halo') || C.halo || 'leger';
    },
    elements: [
      { id: 'profil', groupe: 'profil', nom: 'Monogramme néon', l: 800, h: 800, rendu: el => {
        el.innerHTML = `<div class="mn">${fond(800, 800)}<div class="mn-voile"></div>
          ${cadre(150, 150, 500, 500, 'verre', '--rayon:90px;--epaisseur:10px')}
          <div class="mn-centre">${neon((C.nomChaine || 'M').charAt(0), 360)}</div></div>`;
      } },

      { id: 'banniere', groupe: 'banniere', nom: 'Bannière de profil', l: 1200, h: 480, rendu: el => {
        el.innerHTML = `<div class="mn">${fond(1200, 480)}<div class="mn-voile"></div>
          ${cadre(40, 40, 1120, 400)}
          <div class="mn-centre">${neon(C.nomChaine || '', 110)}
            <div style="font:800 28px var(--f-texte);color:var(--texte);margin-top:22px;letter-spacing:.06em">${K.slogan || ''}</div></div></div>`;
      } },

      { id: 'hors-ligne', groupe: 'hors-ligne', nom: 'Écran hors-ligne', l: 1920, h: 1080, rendu: el => {
        el.innerHTML = `<div class="mn">${fond(1920, 1080)}<div class="mn-voile"></div>
          ${cadre(460, 250, 1000, 580, 'verre')}
          <div class="mn-centre">${neon(K.horsLigne || 'Hors ligne', 130)}
            <div style="font:800 34px/1.6 var(--f-texte);color:var(--texte);margin-top:34px">${C.nomChaine || ''}</div>
            <div style="font:700 30px/1.6 var(--f-texte);color:var(--doux);margin-top:6px">${planning}</div></div></div>`;
      } },

      ...(K.panneaux || []).map(titre => ({
        id: titre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        groupe: 'panneau', nom: titre, l: 320, h: 160, rendu: el => {
          el.innerHTML = `<div class="mn">${fond(320, 160, graine + titre.length)}<div class="mn-voile"></div>
            <div class="cadre verre" style="left:12px;top:12px;width:296px;height:136px;--rayon:18px;--epaisseur:4px"></div>
            ${Reseaux.cle(titre)
              // Réseau : son logo en néon à gauche, le nom à droite
              ? `<div style="position:absolute;left:36px;top:44px">${Reseaux.svg(titre, 72, 'color:var(--accent);filter:drop-shadow(0 0 2px var(--accent-fonce)) drop-shadow(0 0 6px var(--accent-halo))')}</div>
                <div class="mn-centre" style="left:120px;right:20px">${neon(titre, Math.min(40, Math.floor(245 / titre.length)))}</div>`
              : `<div class="mn-centre">${neon(titre, titre.length > 9 ? 40 : 50)}</div>`}</div>`;
        },
      })),

      // Page de dons StreamElements : cadres de verre et cœur néon, le milieu reste libre pour le formulaire
      { id: 'dons-banniere', groupe: 'dons', nom: 'Bannière de la page de dons', l: 640, h: 200, rendu: el => {
        el.innerHTML = `<div class="mn">${fond(640, 200, graine + 3)}<div class="mn-voile"></div>
          ${cadre(14, 14, 612, 172, '', '--rayon:22px;--epaisseur:4px')}
          <div style="position:absolute;left:44px;top:52px">${coeur(104, 10)}</div>
          <div class="mn-centre" style="left:150px;right:30px">${neon(D.titre || '', 50)}
            <div style="font:800 18px var(--f-texte);color:var(--texte);margin-top:14px;letter-spacing:.04em">${D.texte || ''}</div></div></div>`;
      } },
      { id: 'dons-fond', groupe: 'dons', nom: 'Fond de la page de dons', l: 1920, h: 1080, rendu: el => {
        el.innerHTML = `<div class="mn">${fond(1920, 1080)}<div class="mn-voile"></div>
          ${cadre(90, 170, 480, 740, 'verre')}${cadre(1350, 170, 480, 740, 'verre')}
          <div class="mn-centre" style="left:90px;width:480px;padding:0 30px">${neon((C.nomChaine || 'M').charAt(0), 230, 'margin-bottom:40px')}${neon(C.nomChaine || '', (C.nomChaine || '').length > 10 ? 52 : 70)}
            <div style="font:800 26px var(--f-texte);color:var(--doux);margin-top:26px;letter-spacing:.06em">${K.slogan || ''}</div></div>
          <div class="mn-centre" style="left:1350px;width:480px;padding:0 30px">${coeur(220)}
            <div style="margin-top:46px">${neon(D.titre || '', (D.titre || '').length > 14 ? 50 : 62)}</div>
            <div style="font:800 26px/1.5 var(--f-texte);color:var(--texte);margin-top:24px">${D.texte || ''}</div></div></div>`;
      } },

      // Emotes (112 × 112) : néon lisible jusqu'en 28 px
      { id: 'gg', groupe: 'emote', nom: 'GG', l: 112, h: 112, rendu: el => { el.innerHTML = emoteTexte('GG', 66); } },
      { id: 'pb', groupe: 'emote', nom: 'PB (record perso)', l: 112, h: 112, rendu: el => { el.innerHTML = emoteTexte('PB', 66); } },
      { id: 'reset', groupe: 'emote', nom: 'Reset', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="mn-emote"><svg viewBox="0 0 112 112" width="112" height="112">
          <path class="mn-trait" stroke-width="11" d="M86 42 A34 34 0 1 0 90 66"/><path class="mn-trait" stroke-width="11" d="M88 18 V44 H62"/></svg></div>`;
      } },
      { id: 'gold', groupe: 'emote', nom: 'Gold split', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="mn-emote"><svg viewBox="0 0 112 112" width="112" height="112">
          <path d="M56 10 L68 42 L102 43 L75 64 L85 98 L56 78 L27 98 L37 64 L10 43 L44 42 Z" fill="#FFD400" stroke="#6B5500" stroke-width="5" stroke-linejoin="round"
            style="filter:drop-shadow(0 0 6px rgba(255,212,0,.7))"/></svg></div>`;
      } },
      { id: 'coeur', groupe: 'emote', nom: 'Cœur néon', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="mn-emote"><svg viewBox="0 0 112 112" width="112" height="112">
          <path class="mn-trait" stroke-width="11" d="M56 94 C22 70 10 52 18 34 C26 18 46 18 56 34 C66 18 86 18 94 34 C102 52 90 70 56 94 Z"/></svg></div>`;
      } },
      { id: 'manette', groupe: 'emote', nom: 'Manette', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="mn-emote"><svg viewBox="0 0 112 112" width="112" height="112">
          <path class="mn-trait" stroke-width="9" d="M30 34 H82 C96 34 104 52 106 70 C108 88 96 94 88 86 L76 74 H36 L24 86 C16 94 4 88 6 70 C8 52 16 34 30 34 Z"/>
          <path class="mn-trait" stroke-width="8" d="M32 50 V66 M24 58 H40"/><circle cx="76" cy="52" r="5" fill="var(--accent)"/><circle cx="86" cy="62" r="5" fill="var(--accent)"/></svg></div>`;
      } },

      // Badges d'abonné : le nombre de mois en néon
      ...[['1', '1 mois'], ['3', '3 mois'], ['6', '6 mois'], ['9', '9 mois'], ['12', '1 an']].map(([n, nom]) => ({
        id: `mois-${n}`, groupe: 'badge', nom, l: 72, h: 72, rendu: el => { el.innerHTML = badge(n); },
      })),
    ],
  };
})();
