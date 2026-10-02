/* =====================================================================
   COMPOSANTS — briques réutilisées par les scènes et les sources.
   Chaque fonction reçoit un parent et une zone { x, y, l, h } en pixels.
   ===================================================================== */
const Composants = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);
  const apercu = params.has('apercu') || params.has('test');
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

  // --- Fond opaque avec des trous transparents (cam, contenu…) ---
  function fondDecoupe(parent, trous) {
    const d = 'M0 0H1920V1080H0Z ' + trous.map(t => `M${t.x} ${t.y}h${t.l}v${t.h}h${-t.l}Z`).join(' ');
    parent.insertAdjacentHTML('afterbegin', `
      <svg class="fond-decoupe" viewBox="0 0 1920 1080">
        <defs><pattern id="grille-p" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="var(--faible)" stroke-width="2"/></pattern></defs>
        <path d="${d}" fill="var(--fond)" fill-rule="evenodd"/>
        <path d="${d}" fill="url(#grille-p)" fill-rule="evenodd" opacity=".5"/>
      </svg>`);
  }

  // --- Zone de remplissage pour l'aperçu (?apercu=1) ---
  function zoneApercu(parent, z, titre, jeu = false) {
    if (!apercu) return;
    creer(parent, 'apercu-zone' + (jeu ? ' jeu' : ''), `${titre}<br>${z.l} × ${z.h} px<br>x ${z.x} · y ${z.y}`, z);
  }

  // --- Étiquette permanente : rappelle dans OBS la taille et la position de l'image à mettre dans la zone ---
  // Affichée par défaut (config.js > afficherZones). ?zones=0 la cache, ?zones=1 la force. Ignorée en mode ?apercu=1.
  const zonesVisibles = params.has('zones') ? params.get('zones') !== '0' : C.afficherZones !== false;
  function etiquetteZone(parent, z, nom) {
    if (!zonesVisibles || apercu) return;
    const el = creer(parent, 'zone-info',
      `<b>${nom}</b><span>${z.l} × ${z.h} px</span><span>x ${z.x} · y ${z.y}</span><small>Bornes : à l'extérieur + limites de découpe</small>`);
    Object.assign(el.style, { left: (z.x + z.l / 2) + 'px', top: (z.y + z.h / 2) + 'px' });
    return el;
  }

  // --- Cadre fin autour de l'écran : bord carré, coins très légèrement arrondis ---
  // Collé aux bords de l'écran : le jeu ne dépasse jamais du cadre. Les 4 petits coins arrondis sont remplis
  // (couleur du fond) pour qu'aucun bout de jeu ne dépasse de l'arrondi.
  function cadreEcran(parent) {
    const R = 8, E = 3, W = 1920, H = 1080;
    parent.insertAdjacentHTML('beforeend', `<svg class="cadre-ecran" viewBox="0 0 ${W} ${H}">
      <path d="M0 0H${W}V${H}H0Z M${R} 0H${W - R}A${R} ${R} 0 0 1 ${W} ${R}V${H - R}A${R} ${R} 0 0 1 ${W - R} ${H}H${R}A${R} ${R} 0 0 1 0 ${H - R}V${R}A${R} ${R} 0 0 1 ${R} 0Z" fill="var(--fond)" fill-rule="evenodd"/>
      <rect x="${E / 2}" y="${E / 2}" width="${W - E}" height="${H - E}" rx="${R - E / 2}" fill="none" stroke="var(--trait)" stroke-opacity=".7" stroke-width="${E}"/>
    </svg>`);
  }

  // --- Chronomètre REC : le MÊME dans toutes les scènes ---
  // Le départ est mémorisé (localStorage) : changer de scène ne le remet pas à zéro.
  // Il repart de 0 quand OBS lance le stream ou l'enregistrement, ou si plus aucune page
  // de l'overlay n'avait tourné depuis 10 minutes (= nouveau live). ?reinitialiser force la remise à zéro.
  const CLE_REC = `overlay-${C.id || 'defaut'}-rec`;
  const lireRec = () => { try { return JSON.parse(localStorage.getItem(CLE_REC)) || {}; } catch (e) { return {}; } };
  const ecrireRec = r => { try { localStorage.setItem(CLE_REC, JSON.stringify(r)); } catch (e) {} };
  let rec = lireRec();
  if (params.has('reinitialiser') || !rec.debut || Date.now() - (rec.vu || 0) > 10 * 60 * 1000) rec = { debut: Date.now() };
  rec.vu = Date.now(); ecrireRec(rec);
  ['obsStreamingStarted', 'obsRecordingStarted'].forEach(n => addEventListener(n, () => { rec = { debut: Date.now(), vu: Date.now() }; ecrireRec(rec); }));
  function chrono(el) {
    const maj = () => {
      rec.vu = Date.now(); ecrireRec(rec);
      const s = Math.max(0, Math.floor((Date.now() - rec.debut) / 1000));
      el.textContent = [s / 3600, s / 60 % 60, s % 60].map(n => String(Math.floor(n)).padStart(2, '0')).join(':');
    };
    maj(); setInterval(maj, 1000);
  }

  // --- En-tête compact + indicateur « en direct » ---
  function entete(parent, { marge = 80 } = {}) {   // marge : écart au bord gauche/droit (à caler sur le bord extérieur des cadres de la scène)
    const gauche = creer(parent, 'entete-compacte', `<div class="badge">${Commun.icones.fusee}</div>
      <div class="boite"><div class="interieur"><div class="nom">${C.nomChaine || ''}</div></div></div>
      <div><div class="label doux">Mission Control</div><span class="hachures" style="width:80px;height:12px;margin-top:8px"></span></div>`);
    const droite = creer(parent, 'direct', `<span class="point"></span><span class="label">${(C.scenes || {}).statutEnDirect || 'En direct'}</span>
      <span class="label doux">Heure</span><span class="mono" data-horloge>--:--</span>`);
    gauche.style.left = marge + 'px'; droite.style.right = marge + 'px';
  }

  // --- Cadre de caméra (ou de contenu) autour d'une zone transparente ---
  function cadre(parent, z, { titre = 'Flux caméra', nom = true, rec = true, leger = false } = {}) {
    zoneApercu(parent, z, titre, titre !== 'Flux caméra');
    etiquetteZone(parent, z, titre === 'Flux caméra' ? 'Webcam' : 'Contenu (capture)');
    const S = C.scenes || {};
    const el = creer(parent, 'cam-cadre' + (leger ? ' leger' : ''), `
      <div class="cam-bord"></div>
      <div class="cadre"><i class="coin hg"></i><i class="coin hd"></i><i class="coin bg"></i><i class="coin bd"></i></div>
      ${titre ? `<div class="cam-tete"><span class="label">${titre}</span><span class="hachures"></span>${rec ? '<span class="rec"><i></i><span class="chrono"></span></span>' : ''}</div>` : ''}
      ${nom ? `<span class="etiquette cam-nom">${C.nomChaine || ''}${S.grade ? ' — ' + S.grade : ''}</span>` : ''}`, z);
    const c = el.querySelector('.chrono'); if (c) chrono(c);
    return el;
  }

  // --- Chat (panneau, ou flottant sur le jeu) ---
  function chat(parent, z, { flottant = false, disparition = 0, titreHaut = false } = {}) {
    if (params.get('chat') === '0') return document.createElement('div');   // ?chat=0 : pas de chat intégré (source séparée à la place)
    const titre = (C.chat || {}).titre || 'Canal de communication';
    const el = flottant
      ? creer(parent, 'chat-flottant', '<div class="chat-lignes"></div>', z)
      : creer(parent, 'panneau-chat boite', `<div class="interieur">
          ${titreHaut ? '' : `<div class="cam-tete"><span class="label">${titre}</span><span class="hachures"></span></div>`}
          <div class="chat-lignes"></div></div>`, z);
    // titreHaut : le titre passe AU-DESSUS du panneau, sur la même rangée que « Flux caméra » (bas de rangée = haut du cadre - 5 px).
    // z.y doit alors être le bord extérieur du cadre de cam (zone de la cam - 7 px).
    if (titreHaut && !flottant) {
      const t = creer(parent, 'cam-tete', `<span class="label">${titre}</span><span class="hachures"></span>`);
      Object.assign(t.style, { left: z.x + 'px', width: z.l + 'px', top: (z.y - 29) + 'px', height: '24px', right: 'auto', bottom: 'auto' });
    }
    Chat.monter(el.querySelector('.chat-lignes'), { disparition });
    return el;
  }

  // --- Bandeau d'infos ---
  function bandeau(parent, z, { compact = false } = {}) {
    if (params.get('bandeau') === '0') return document.createElement('div');   // ?bandeau=0 : pas de bandeau intégré
    const o = Evenements.objectif;
    const items = [
      ['recrue', 'groupe', 'Dernière recrue'],
      ...(compact ? [] : [['abonne', 'casque', 'Dernier abonné'], ['soutien', 'coeur', 'Dernier soutien']]),
      ['objectif', 'cible', o.titre || 'Objectif'],
    ].filter(([cle]) => ((C.bandeau || {})[cle === 'recrue' ? 'follow' : cle]) !== false);   // config.js › bandeau : cases au choix
    const el = creer(parent, 'bandeau boite', `<div class="interieur">${items.map(([cle, ic, lib]) =>
      `<div class="bandeau-item" data-cle="${cle}">${ico(ic)}<div style="min-width:0;flex:1"><small>${lib}</small><b>—</b>${cle === 'objectif' ? '<div class="mini-jauge"><i></i></div>' : ''}</div></div>`).join('')}
      <div class="bandeau-item fusee-fin"><span class="ic" style="color:var(--accent)">${Commun.icones.fusee}</span></div></div>`, z);

    const valeurs = { recrue: '', abonne: '', soutien: '', objectif: '' };
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

  // --- Objectif Terre → Lune ---
  function objectif(parent, z) {
    const o = Evenements.objectif;
    const el = creer(parent, 'objectif', `
      <div class="objectif-tete"><b>${o.titre || 'Objectif'}</b><span class="compte">0 / ${o.cible}</span></div>
      <div class="trajet"><div class="astre"></div>
        <div class="piste"><div class="piste-pleine"></div><div class="piste-fusee"><svg viewBox="-170 -170 340 340"><g transform="rotate(90) scale(.9)">${Commun.fusee({ id: 'f-obj', flamme: true })}</g></svg></div></div>
        <div class="astre lune"></div></div>`, z);
    Evenements.ecouter((e, etat) => {
      const p = Math.min(100, (etat.compte ?? 0) / o.cible * 100);
      el.querySelector('.compte').textContent = `${etat.compte ?? 0} / ${o.cible}`;
      el.querySelector('.piste-pleine').style.width = p + '%';
      el.querySelector('.piste-fusee').style.left = p + '%';
    });
    return el;
  }

  // --- Zone lue dans l'URL (?x=&y=&l=&h=), avec valeurs par défaut ---
  function zoneURL(defaut) {
    const z = { ...defaut };
    ['x', 'y', 'l', 'h'].forEach(k => { if (params.has(k)) z[k] = parseFloat(params.get(k)); });
    return z;
  }

  return { zoneURL, fondDecoupe, zoneApercu, etiquetteZone, cadreEcran, entete, cadre, chat, bandeau, objectif, creer };
})();
