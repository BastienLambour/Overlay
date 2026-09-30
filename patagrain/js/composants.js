/* =====================================================================
   COMPOSANTS — briques réutilisées par les scènes et les sources.
   Chaque fonction reçoit un parent et une zone { x, y, l, h } en pixels
   (dans l'écran de 1920×1080).
   ===================================================================== */
const Composants = (() => {
  const C = window.CONFIG || {};
  const P = Commun;
  const params = new URLSearchParams(location.search);
  const apercu = params.has('apercu') || params.has('test');

  const place = (el, z) => {
    if (z) Object.assign(el.style, { left: z.x + 'px', top: z.y + 'px', width: z.l + 'px', height: z.h + 'px' });
    return el;
  };
  const creer = (parent, classe, html, z) => {
    const el = document.createElement('div');
    el.className = classe; el.innerHTML = html;
    parent.appendChild(place(el, z));
    return el;
  };
  const borne = (min, v, max) => Math.max(min, Math.min(max, v));
  // Rectangle à coins arrondis en chemin SVG
  const rr = (x, y, l, h, r) => `M${x + r} ${y}H${x + l - r}A${r} ${r} 0 0 1 ${x + l} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + l - r} ${y + h}` +
    `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

  // --- Fond opaque avec des trous transparents (cam, contenu…) ---
  function fondDecoupe(parent, trous) {
    const d = 'M0 0H1920V1080H0Z ' + trous.map(t => `M${t.x} ${t.y}h${t.l}v${t.h}h${-t.l}Z`).join(' ');
    parent.insertAdjacentHTML('afterbegin', `
      <svg class="fond-decoupe" viewBox="0 0 1920 1080">
        <defs><radialGradient id="lueur" cx="50%" cy="45%" r="65%">
          <stop offset="0" stop-color="var(--primaire)" stop-opacity=".16"/><stop offset="1" stop-color="var(--primaire)" stop-opacity="0"/></radialGradient></defs>
        <path d="${d}" fill="var(--fond)" fill-rule="evenodd"/>
        <path d="${d}" fill="url(#lueur)" fill-rule="evenodd"/>
      </svg>`);
  }

  // --- Zone de remplissage pour l'aperçu (?apercu=1 ou ?test=1) ---
  function zoneApercu(parent, z, titre, jeu = false) {
    if (!apercu) return;
    creer(parent, 'apercu-zone' + (jeu ? ' jeu' : ''), `${titre}<br>${z.l} × ${z.h} px<br>x ${z.x} · y ${z.y}`, z);
  }

  // --- En-tête : logo + « En direct » ---
  function entete(parent) {
    creer(parent, 'entete', `<img class="logo" src="../assets/logo-couleur.svg" alt="${C.nomChaine || ''}"><span class="en-direct"><i></i>En direct</span>`);
  }

  // --- Cadre autour d'une zone transparente ---
  //  decor : chapeau de bouffon au-dessus + dés dans les coins du bas (chapeau: false = les dés seuls)
  //  nom   : plaque dorée avec le nom de la chaîne
  //  titre : petite étiquette en haut à gauche (pour le cadre « contenu »)
  function cadre(parent, z, { decor = true, chapeau = true, nom = true, titre = '', sobre = false, apercuTitre = 'Webcam' } = {}) {
    zoneApercu(parent, z, apercuTitre, apercuTitre !== 'Webcam');
    const b = borne(7, Math.min(z.l, z.h) * 0.022, 12), R = b + 14, r = 14;
    const L = z.l + 2 * b, H = z.h + 2 * b;
    const el = creer(parent, 'cam-cadre' + (sobre ? ' sobre' : ''), '', { x: z.x - b, y: z.y - b, l: L, h: H });
    const anneau = `<svg class="anneau" width="${L}" height="${H + 9}" viewBox="0 0 ${L} ${H + 9}">
      <path class="ombre" fill-rule="evenodd" d="${rr(0, 9, L, H, R)} ${rr(0, 0, L, H, R)}"/>
      <path class="bord" fill-rule="evenodd" d="${rr(0, 0, L, H, R)} ${rr(b, b, z.l, z.h, r)}"/></svg>`;
    let html = anneau;
    if (decor) {
      const lc = borne(110, z.l * 0.22, 260), hc = lc * 214 / 392;   // proportions de assets/chapeau.svg
      const de = borne(40, Math.min(z.l, z.h) * 0.15, 86);
      if (chapeau) html += `<img class="chapeau" src="../assets/chapeau.svg" alt="" style="width:${lc}px;top:${-hc * .93 + b}px">`;
      html += `
        <svg class="de g" viewBox="0 0 100 100" style="width:${de}px;left:${-de * .36}px;bottom:${-de * .36}px"><use href="#i-d20"/></svg>
        <svg class="de d" viewBox="0 0 100 100" style="width:${de * .88}px;right:${-de * .34}px;bottom:${-de * .3}px"><use href="#i-d6"/></svg>`;
    }
    if (nom) {
      const t = borne(20, z.l * 0.03, 40);
      html += `<span class="plaque" style="font-size:${t}px;bottom:${-t * .75}px">${C.nomChaine || ''}</span>`;
    }
    if (titre) html += `<span class="titre-zone" style="top:-22px"><svg viewBox="0 0 100 80"><use href="#i-parchemin"/></svg>${titre}</span>`;
    el.innerHTML = html;
    return el;
  }

  // --- Chat : dans une carte « taverne », ou flottant sur le jeu ---
  //  bouffon : { tete, depasse } — le bouffon prend la hauteur de l'en-tête (tete, en px) à droite,
  //            et son chapeau dépasse de la carte de « depasse » px (nécessite bouffon.js et numeros.js)
  function chat(parent, z, { flottant = false, disparition = 0, bouffon = null } = {}) {
    const el = flottant
      ? creer(parent, 'chat-flottant', '<div class="lignes"></div>', z)
      : creer(parent, 'taverne carte', `<div class="taverne-tete"><svg viewBox="0 0 60 70"><use href="#i-grelot"/></svg>
          <span class="titre">${(C.chat || {}).titre || 'La taverne'}</span></div><div class="lignes"></div>`, z);
    Chat.monter(el.querySelector('.lignes'), { disparition });
    if (bouffon && !flottant && P.bouffon() && typeof Numeros !== 'undefined') bouffonTaverne(el, z, bouffon);
    return el;
  }

  // Le bouffon qui surveille la taverne : visible du haut du chapeau (y ≈ 4 du dessin) jusqu'au
  // menton (y ≈ 320), coupé net par le trait sous l'en-tête, ses deux mains posées dessus.
  function bouffonTaverne(carte, z, { tete = 100, depasse = 30 } = {}) {
    const HAUT = 22, DROITE = 14;                       // marge haute de la carte, retrait à droite
    carte.classList.add('avec-bouffon');
    carte.style.setProperty('--haut-tete', tete + 'px');
    const V = depasse + HAUT + tete, s = V / 316, L = 400 * s;
    const boite = creer(carte, 'taverne-bouffon', '<div class="taverne-perso"></div>',
      { x: z.l - DROITE - L, y: -depasse, l: L, h: V });
    const perso = boite.firstElementChild;
    Object.assign(perso.style, { width: L + 'px', top: V - 424 * s + 'px' });   // le trait tombe à y = 320 du dessin
    const d = 58 * s;                                    // taille des mains
    [.24, .76].forEach(f => creer(carte, 'taverne-main', '', { x: z.l - DROITE - L + f * L - d / 2, y: HAUT + tete - d * .55, l: d, h: d }));
    Numeros.taverne(perso, carte.querySelector('.lignes'));
  }

  // --- Bandeau d'infos : dernier aventurier, chevalier, tribut, objectif ---
  function bandeau(parent, z, { compact = false } = {}) {
    const o = Evenements.objectif;
    const items = [
      ...(compact ? [] : [['jour', 'parchemin', 'Ce soir', 1.7]]),
      ['recrue', 'chapeau', 'Aventurier', 1],
      ...(compact ? [] : [['abonne', 'bouclier', 'Chevalier', 1], ['soutien', 'grelot', 'Tribut', 1]]),
      ['objectif', 'd20', o.titre || 'Objectif', 1.4],
    ];
    const el = creer(parent, 'bandeau carte' + (compact ? ' compact' : ''),
      `<div class="embleme"><img src="../assets/embleme-bleu.svg" alt=""></div>` +
      items.map(([cle, ic, lib, f]) => `<div class="bandeau-item" data-cle="${cle}" style="flex:${f}"><span class="ic">${P.ico(ic)}</span>
        <div style="min-width:0;flex:1"><small>${lib}</small><b>—</b>${cle === 'objectif' ? '<div class="mini-jauge"><i></i></div>' : ''}</div></div>`).join(''), z);

    const jour = el.querySelector('[data-cle="jour"] b');
    if (jour) jour.textContent = C.titreDuJour || '—';
    const valeurs = {};
    Evenements.ecouter((e, etat) => {
      const nouv = { recrue: etat.follow || '—', abonne: etat.abonne || '—', soutien: etat.soutien || '—', objectif: `${etat.compte ?? 0} / ${o.cible}` };
      Object.entries(nouv).forEach(([cle, v]) => {
        const item = el.querySelector(`[data-cle="${cle}"]`);
        if (!item || valeurs[cle] === v) return;
        item.querySelector('b').textContent = v;
        if (e) { item.classList.remove('flash'); void item.offsetWidth; item.classList.add('flash'); }
        valeurs[cle] = v;
      });
      const j = el.querySelector('.mini-jauge i');
      if (j) j.style.width = Math.min(100, (etat.compte ?? 0) / o.cible * 100) + '%';
    });
    return el;
  }

  // --- Objectif : jauge dorée, l'épée avance à chaque follow ---
  function objectif(parent, z) {
    const o = Evenements.objectif;
    const el = creer(parent, 'objectif carte', `
      <div class="objectif-tete"><span class="titre">${P.ico('d20')}${o.titre || 'Objectif'}</span><span class="compte">0 / ${o.cible}</span></div>
      <div class="jauge"><div class="rempli"></div><img class="curseur" src="../assets/epee.svg" alt="" style="rotate:-90deg"></div>`, z);
    Evenements.ecouter((e, etat) => {
      const p = Math.min(100, (etat.compte ?? 0) / o.cible * 100);
      el.querySelector('.compte').textContent = `${etat.compte ?? 0} / ${o.cible}`;
      el.querySelector('.rempli').style.width = p + '%';
      el.querySelector('.curseur').style.left = `max(${p}%, 112px)`;
    });
    return el;
  }

  // --- Zone lue dans l'adresse (?x=&y=&l=&h=), avec valeurs par défaut ---
  function zoneURL(defaut) {
    const z = { ...defaut };
    ['x', 'y', 'l', 'h'].forEach(k => { if (params.has(k)) z[k] = parseFloat(params.get(k)); });
    return z;
  }

  return { zoneURL, fondDecoupe, zoneApercu, entete, cadre, chat, bandeau, objectif, creer };
})();
