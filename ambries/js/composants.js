/* =====================================================================
   COMPOSANTS — briques réutilisées par les scènes et les sources.
   Chaque fonction reçoit un parent et une zone { x, y, l, h } en pixels.
   ===================================================================== */
const Composants = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);
  const apercu = params.has('apercu') || params.has('test');
  const RAYON = 22;   // arrondi des zones transparentes (cam, contenu)

  // z = { x, y, l, h } ; 'plein' = occupe tout le parent ; rien = position gérée par le CSS
  const place = (el, z) => {
    if (z === 'plein') el.style.inset = '0';
    else if (z) Object.assign(el.style, { left: z.x + 'px', top: z.y + 'px', width: z.l + 'px', height: z.h + 'px' });
    return el;
  };
  const creer = (parent, classe, html, z) => {
    const el = document.createElement('div');
    el.className = classe; el.innerHTML = html;
    parent.appendChild(place(el, z));
    return el;
  };
  const ico = nom => `<span class="ic">${Commun.icones[nom] || ''}</span>`;
  const rejouer = (el, classe) => { el.classList.remove(classe); void el.offsetWidth; el.classList.add(classe); };

  // --- Fond opaque (nuit violette, lueurs, trame de points) avec des trous arrondis ---
  function fondDecoupe(parent, trous) {
    const r = RAYON;
    const trou = t => `M${t.x + r} ${t.y}H${t.x + t.l - r}A${r} ${r} 0 0 1 ${t.x + t.l} ${t.y + r}V${t.y + t.h - r}A${r} ${r} 0 0 1 ${t.x + t.l - r} ${t.y + t.h}H${t.x + r}A${r} ${r} 0 0 1 ${t.x} ${t.y + t.h - r}V${t.y + r}A${r} ${r} 0 0 1 ${t.x + r} ${t.y}Z`;
    const d = 'M0 0H1920V1080H0Z ' + trous.map(trou).join(' ');
    parent.insertAdjacentHTML('afterbegin', `
      <svg class="fond-decoupe" viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="lueur-bas" cx="50%" cy="115%" r="70%"><stop offset="0" stop-color="var(--violet)" stop-opacity=".45"/><stop offset="1" stop-color="var(--violet)" stop-opacity="0"/></radialGradient>
          <radialGradient id="lueur-haut" cx="0%" cy="-10%" r="55%"><stop offset="0" stop-color="var(--accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></radialGradient>
          <pattern id="trame-fond" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="13" cy="13" r="3.2" fill="var(--violet)"/></pattern>
          <linearGradient id="fondu-trame" x1="0" y1="0" x2="1" y2="1"><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient>
          <mask id="masque-trame"><rect width="1920" height="1080" fill="url(#fondu-trame)"/></mask>
        </defs>
        <path d="${d}" fill="var(--fond)" fill-rule="evenodd"/>
        <path d="${d}" fill="url(#lueur-bas)" fill-rule="evenodd"/>
        <path d="${d}" fill="url(#lueur-haut)" fill-rule="evenodd"/>
        <path d="${d}" fill="url(#trame-fond)" fill-rule="evenodd" mask="url(#masque-trame)"/>
      </svg>`);
  }

  // --- Zone de remplissage pour l'aperçu (?apercu=1) ---
  function zoneApercu(parent, z, titre, jeu = false) {
    if (!apercu) return;
    creer(parent, 'apercu-zone' + (jeu ? ' jeu' : ''), `${titre}<br>${z.l} × ${z.h} px<br>x ${z.x} · y ${z.y}`, z);
  }

  // --- En-tête : avatar + pseudo néon + devise ; à droite « en direct » + heure ---
  function entete(parent) {
    creer(parent, 'entete', `${Commun.avatar(120)}
      <div><div class="nom">${C.nomChaine || ''}</div><span class="sticker">${C.devise || ''}</span></div>`);
    creer(parent, 'direct', `<span class="sticker"><span class="point"></span>En direct</span><span class="heure" data-horloge>--:--</span>`);
  }

  // --- Cadre néon autour d'une zone transparente (cam ou contenu) ---
  function cadre(parent, z, { titre = '', nom = true, doodle = true, petit = false, jeu = false } = {}) {
    zoneApercu(parent, z, titre || 'Webcam', jeu);
    return creer(parent, 'cam-cadre' + (petit ? ' petit' : ''), `
      <div class="cam-trame trame"></div>
      <div class="cam-tube"></div>
      ${titre ? `<span class="sticker blanc cam-titre">${titre}</span>` : ''}
      ${nom ? `<span class="sticker cam-nom">${C.nomChaine || ''}</span>` : ''}
      ${doodle ? `<div class="cam-doodle tremble">${Commun.gribouillis.exclamation}</div>` : ''}`, z);
  }

  // --- Chat (panneau à bulles, ou bulles flottantes sur le jeu) ---
  function chat(parent, z, { flottant = false, disparition = 0 } = {}) {
    if (params.get('chat') === '0') return document.createElement('div');   // ?chat=0 : pas de chat intégré (source séparée à la place)
    const titre = (C.chat || {}).titre || 'Le chat';
    const el = flottant
      ? creer(parent, 'chat-flottant', '<div class="chat-lignes"></div>', z)
      : creer(parent, 'panneau-chat', `<span class="sticker">${titre}</span><div class="chat-lignes"></div>`, z);
    Chat.monter(el.querySelector('.chat-lignes'), { disparition });
    return el;
  }

  // --- Bandeau d'infos ---
  function bandeau(parent, z, { compact = false } = {}) {
    if (params.get('bandeau') === '0') return document.createElement('div');   // ?bandeau=0 : pas de bandeau intégré
    const o = Evenements.objectif;
    const items = [
      ['follow', 'oeil', 'Dernier témoin'],
      ...(compact ? [] : [['abonne', 'coeur', 'Soutien moral'], ['soutien', 'piece', 'Fonds pour excuses']]),
      ['objectif', 'etoile', o.titre || 'Objectif'],
    ];
    const el = creer(parent, 'bandeau' + (compact ? ' compact' : ''), `${Commun.avatar(z.h - 12)}${items.map(([cle, ic, lib]) =>
      `<div class="bandeau-item" data-cle="${cle}">${ico(ic)}<div style="min-width:0;flex:1"><small>${lib}</small><b>—</b>${cle === 'objectif' ? '<div class="mini-jauge"><i></i></div>' : ''}</div></div>`).join('')}`, z);

    const valeurs = {};
    Evenements.ecouter((e, etat) => {
      const nouv = { follow: etat.follow || '—', abonne: etat.abonne || '—', soutien: etat.soutien || '—', objectif: `${etat.compte ?? 0} / ${o.cible}` };
      Object.entries(nouv).forEach(([cle, v]) => {
        const item = el.querySelector(`[data-cle="${cle}"]`);
        if (!item || valeurs[cle] === v) return;
        item.querySelector('b').textContent = v;
        if (e) rejouer(item, 'flash');
        valeurs[cle] = v;
      });
      const j = el.querySelector('.mini-jauge i');
      if (j) j.style.width = Math.min(100, (etat.compte ?? 0) / o.cible * 100) + '%';
    });
    return el;
  }

  // --- Objectif : la tête d'Ambries avance dans la jauge ---
  function objectif(parent, z) {
    const o = Evenements.objectif;
    const el = creer(parent, 'objectif', `
      <div class="objectif-tete"><b>${o.titre || 'Objectif'}</b><span class="compte">0 / ${o.cible}</span></div>
      <div class="barre"><div class="barre-pleine"></div><div class="barre-tete">${Commun.avatar(88)}</div></div>`, z);
    Evenements.ecouter((e, etat) => {
      const p = Math.min(100, (etat.compte ?? 0) / o.cible * 100);
      el.querySelector('.compte').textContent = `${etat.compte ?? 0} / ${o.cible}`;
      el.querySelector('.barre-pleine').style.width = `calc(${p}% - 8px)`;
      el.querySelector('.barre-tete').style.left = p + '%';
    });
    return el;
  }

  // --- Zone lue dans l'URL (?x=&y=&l=&h=), avec valeurs par défaut ---
  function zoneURL(defaut) {
    const z = { ...defaut };
    ['x', 'y', 'l', 'h'].forEach(k => { if (params.has(k)) z[k] = parseFloat(params.get(k)); });
    return z;
  }

  // --- Position d'une petite cam dans un coin (?cam=bas-droite…) ---
  function coinCam(l, h, { marge = 64, haut = 190, bas = 120 } = {}) {
    const coin = params.get('cam') || 'bas-droite';
    const droite = coin.includes('droite'), enBas = !coin.includes('haut');
    return { coin, droite, z: { x: droite ? 1920 - marge - l : marge, y: enBas ? 1080 - bas - h : haut, l, h } };
  }

  return { zoneURL, coinCam, fondDecoupe, zoneApercu, entete, cadre, chat, bandeau, objectif, creer, rejouer };
})();
