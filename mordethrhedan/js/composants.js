/* =====================================================================
   COMPOSANTS — briques réutilisées par les scènes et les sources.
   Une zone s'écrit { x, y, l, h } en pixels (écran 1920×1080).
   La zone = l'intérieur du cadre = l'endroit où placer la source OBS.
   ===================================================================== */
const Composants = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);
  const apercu = params.has('apercu') || params.has('test');
  const E = 5, R = 24;              // épaisseur et arrondi des cadres (voir theme.css)
  const RI = R - E;                 // arrondi intérieur = arrondi des « trous »

  const place = (el, z) => { Object.assign(el.style, { left: z.x + 'px', top: z.y + 'px', width: z.l + 'px', height: z.h + 'px' }); return el; };
  function creer(parent, classe, html, z) {
    const el = document.createElement('div');
    el.className = classe; el.innerHTML = html || '';
    if (z) place(el, z);
    parent.appendChild(el);
    return el;
  }

  // Rectangle arrondi en chemin SVG
  const rr = ({ x, y, l, h }, r) => `M${x + r} ${y}H${x + l - r}A${r} ${r} 0 0 1 ${x + l} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + l - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

  // --- Fond à facettes, découpé là où les sources OBS doivent apparaître ---
  function fond(parent, trous = []) {
    const el = document.createElement('div');
    el.className = 'fond-scene';
    el.innerHTML = fondNeon({ graine: parseInt(params.get('graine') ?? (C.fond || {}).graine ?? 7, 10) });
    if (trous.length) el.style.clipPath = `path(evenodd, "M0 0H1920V1080H0Z ${trous.map(t => rr(t, RI)).join(' ')}")`;
    parent.prepend(el);
    return el;
  }

  // --- Aperçu (?apercu=1 ou ?test=1) : grise les zones et affiche leurs coordonnées ---
  function zoneApercu(parent, z, titre, classe = '') {
    if (!apercu) return;
    const el = creer(parent, 'apercu-zone ' + classe, titre ? `<b>${titre}</b><span>${z.l} × ${z.h} px · x ${z.x} · y ${z.y}</span>` : '', z);
    el.style.borderRadius = RI + 'px';
    return el;
  }

  // --- Cadre néon AUTOUR d'une zone (le trait est à l'extérieur de la zone) ---
  function cadre(parent, z, { verre = false, titre = '', rayon = R } = {}) {
    if (titre) zoneApercu(parent, z, titre);
    const el = creer(parent, 'cadre' + (verre ? ' verre' : ''), '', { x: z.x - E, y: z.y - E, l: z.l + 2 * E, h: z.h + 2 * E });
    el.style.borderRadius = rayon + 'px';
    return el;
  }

  // --- Grand cadre qui fait le tour de l'écran ---
  function exterieur(parent) {
    const el = creer(parent, 'cadre', '', { x: 14, y: 14, l: 1892, h: 1052 });
    el.style.borderRadius = '34px';
    return el;
  }

  // --- Zone réservée à un widget perso (succès, manette, splits…) ---
  function zoneWidget(parent, z, titre, { avecCadre = false } = {}) {
    if (apercu) creer(parent, 'zone-widget', `<b>${titre}</b><span>${z.l} × ${z.h} px · x ${z.x} · y ${z.y}</span>`, z);
    if (avecCadre) cadre(parent, z);
  }

  // --- Chat dans un cadre « verre » ---
  function chat(parent, z, { disparition = 0 } = {}) {
    if (params.get('chat') === '0') return document.createElement('div');   // ?chat=0 : pas de chat intégré (source séparée à la place)
    cadre(parent, z, { verre: true });
    const el = creer(parent, 'chat-boite', '', z);
    Chat.monter(el, { disparition });
    return el;
  }

  // --- Voile sombre dans une zone, pour lire un titre posé sur une image ---
  function voile(parent, z) {
    const v = parseFloat(params.get('voile') ?? C.voile ?? 0.35);
    if (!(v > 0)) return;
    const el = creer(parent, 'voile', '', z);
    el.style.background = `rgba(0,0,0,${v})`;
    el.style.borderRadius = RI + 'px';
  }

  // --- Grand titre néon centré dans une zone ---
  function titre(parent, z, html, taille) {
    const el = creer(parent, 'grand-titre', `<p class="titre-neon" style="font-size:${taille}px">${html}</p>`, z);
    return el.querySelector('p');
  }

  // --- Objectif (barre de progression) ---
  function objectif(parent, z) {
    const o = Evenements.objectif;
    const el = creer(parent, 'objectif', `
      <div class="obj-tete"><span class="obj-titre">${o.titre || 'Objectif'}</span><span class="obj-compte">0 / ${o.cible}</span></div>
      <div class="obj-piste"><div class="obj-plein"></div></div>`, z);
    Evenements.ecouter((e, etat) => {
      const n = etat.compte ?? 0;
      el.querySelector('.obj-compte').textContent = `${n} / ${o.cible}`;
      el.querySelector('.obj-plein').style.width = Math.min(100, n / o.cible * 100) + '%';
    });
    return el;
  }

  // --- Zone lue dans l'URL (?x=&y=&l=&h=), avec valeurs par défaut ---
  function zoneURL(defaut) {
    const z = { ...defaut };
    ['x', 'y', 'l', 'h'].forEach(k => { if (params.has(k)) z[k] = parseFloat(params.get(k)); });
    return z;
  }

  return { E, R, RI, creer, fond, zoneApercu, cadre, exterieur, zoneWidget, chat, voile, titre, objectif, zoneURL, apercu };
})();
