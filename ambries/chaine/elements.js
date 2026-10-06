/* =====================================================================
   AMBRIES_ — Visuels de la chaîne Twitch (affichés par chaine/kit.html).
   Textes : config.js › chaine. Export PNG : node outils/exporter-chaine.mjs
   ===================================================================== */
(() => {
  const C = window.CONFIG || {};
  const K = C.chaine || {};
  const I = Commun.icones;
  const AV = Commun.AVATAR;

  document.head.insertAdjacentHTML('beforeend', `<style>
    .am { position: absolute; inset: 0; background: var(--fond); color: var(--texte); font-family: var(--f-texte); overflow: hidden; }
    .am-lueur { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 120%, color-mix(in srgb, var(--violet) 45%, transparent), transparent 60%),
      radial-gradient(ellipse at 0% -10%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 50%); }
    .am-trame { position: absolute; background-image: radial-gradient(circle, color-mix(in srgb, var(--violet) 60%, transparent) 28%, transparent 30%); }
    .am-neon { font-family: var(--f-neon); color: #fff; text-shadow: var(--halo-texte); line-height: 1; white-space: nowrap; }
    .am-pop { font-family: var(--f-titre); color: #fff; letter-spacing: .03em; line-height: .95; -webkit-text-stroke: 3px var(--encre); paint-order: stroke fill; text-shadow: 5px 5px 0 var(--encre), 0 0 24px var(--violet); }
    .am .avatar-neon.flotte, .kit-el .clignote-neon, .kit-el .tremble { animation: none; }
    .am-emote { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .am-emote .sticker { transform: rotate(-8deg); box-shadow: 5px 5px 0 var(--encre); border-width: 4px; }
  </style>`);

  // Pseudo-aléatoire stable (l'export est identique à chaque fois)
  const alea = (i, k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;

  // Coulures de peinture blanche depuis le haut, avec ombre néon décalée
  function coulures(l, h, n, graine = 1) {
    const formes = Array.from({ length: n }, (_, i) => {
      const x = (i + alea(i, graine)) * l / n, w = 10 + alea(i, graine + 1) * l / n * .6, y = h * (.08 + alea(i, graine + 2) * .35);
      return `<rect x="${x.toFixed(1)}" y="-10" width="${w.toFixed(1)}" height="${(y + 10).toFixed(1)}"/><circle cx="${(x + w / 2).toFixed(1)}" cy="${y.toFixed(1)}" r="${(w * .62).toFixed(1)}"/>`;
    }).join('') + `<rect x="0" y="-10" width="${l}" height="${(h * .05 + 10).toFixed(1)}"/>`;
    return `<svg style="position:absolute;left:0;top:0" width="${l}" height="${h}">
      <g fill="var(--violet)" transform="translate(${l / 160} ${l / 220})">${formes}</g><g fill="#fff">${formes}</g></svg>`;
  }
  // Petites éclaboussures rondes
  const taches = (l, h, n, graine = 3) => `<svg style="position:absolute;left:0;top:0" width="${l}" height="${h}">${Array.from({ length: n }, (_, i) =>
    `<circle cx="${(alea(i, graine) * l).toFixed(1)}" cy="${(h * .35 + alea(i, graine + 1) * h * .65).toFixed(1)}" r="${(3 + alea(i, graine + 2) * l / 90).toFixed(1)}"
      fill="${['#fff', 'var(--accent)', 'var(--mauve)'][i % 3]}" stroke="var(--encre)" stroke-width="${Math.max(1.5, l / 500)}"/>`).join('')}</svg>`;
  const gribouillis = (nom, x, y, t) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${t}px;height:${t}px">${Commun.gribouillis[nom]}</div>`;
  const icone = (nom, taille, couleur = 'var(--accent)') => `<div style="width:${taille}px;height:${taille}px;color:${couleur}">${I[nom]}</div>`;

  const planning = (K.planning || []).length
    ? K.planning.map(([j, h]) => `<div><span style="color:var(--accent)">${j}</span> · ${h}</div>`).join('')
    : '<div>Suis la chaîne pour être prévenu·e du prochain carnage</div>';
  const icoPanneau = { 'À propos': 'bulle', 'Planning': 'calendrier', 'Règles': 'regles', 'Soutenir': 'coeur', 'Réseaux': 'groupe', 'Discord': 'groupe', 'Matériel': 'camera', 'Commandes': 'manette' };
  const D = K.dons || {};

  // Badge d'abonné : jauge de skill qui se remplit avec l'ancienneté
  const badge = (niveau, etoile = false) => `<svg viewBox="0 0 72 72" width="72" height="72">
    <rect x="4" y="4" width="64" height="64" rx="16" fill="#1D0F33" stroke="#fff" stroke-width="4"/>
    <clipPath id="b${niveau}"><rect x="12" y="12" width="48" height="48" rx="9"/></clipPath>
    <rect x="12" y="12" width="48" height="48" rx="9" fill="#28164A"/>
    <rect x="12" y="${60 - 48 * niveau}" width="48" height="${48 * niveau}" fill="${etoile ? '#FF4FD8' : '#A855F7'}" clip-path="url(#b${niveau})"/>
    ${etoile ? '<path d="M36 18 L40.5 29.5 L52.5 30 L43 37.5 L46.5 49.5 L36 42.5 L25.5 49.5 L29 37.5 L19.5 30 L31.5 29.5 Z" fill="#fff" stroke="#140A24" stroke-width="3" stroke-linejoin="round"/>'
      : `<text x="36" y="47" text-anchor="middle" style="font-family:var(--f-titre)" font-size="26" fill="#fff" stroke="#140A24" stroke-width="3" paint-order="stroke">${Math.round(niveau * 100)}</text>`}</svg>`;

  window.KIT = {
    elements: [
      { id: 'profil', groupe: 'profil', nom: 'Photo de profil', l: 800, h: 800, rendu: el => {
        el.innerHTML = `<div class="am"><div class="am-lueur"></div>
          <div class="am-trame" style="inset:0;background-size:34px 34px;opacity:.5"></div>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${Commun.avatar(700)}</div></div>`;
      } },

      { id: 'banniere', groupe: 'banniere', nom: 'Bannière de profil', l: 1200, h: 480, rendu: el => {
        el.innerHTML = `<div class="am"><div class="am-lueur"></div>
          <div class="am-trame" style="right:0;bottom:0;width:700px;height:360px;background-size:24px 24px;-webkit-mask:radial-gradient(circle at 100% 100%,#000 20%,transparent 70%)"></div>
          ${coulures(1200, 480, 16, 2)}${taches(1200, 480, 14, 5)}
          <div style="position:absolute;left:110px;top:120px">${Commun.avatar(270)}</div>
          ${gribouillis('exclamation', 330, 110, 80)}
          <div style="position:absolute;left:450px;top:170px">
            <div class="am-neon" style="font-size:120px">${C.nomChaine || ''}</div>
            <span class="sticker" style="margin-top:24px;font-size:30px">${K.slogan || ''}</span>
          </div></div>`;
      } },

      { id: 'hors-ligne', groupe: 'hors-ligne', nom: 'Écran hors-ligne', l: 1920, h: 1080, rendu: el => {
        el.innerHTML = `<div class="am"><div class="am-lueur"></div>
          <div class="am-trame" style="right:0;bottom:0;width:1000px;height:700px;background-size:28px 28px;-webkit-mask:radial-gradient(circle at 100% 100%,#000 20%,transparent 70%)"></div>
          ${coulures(1920, 1080, 18, 7)}${taches(1920, 1080, 22, 9)}
          <div style="position:absolute;left:180px;top:330px">${Commun.avatar(460)}</div>
          ${gribouillis('exclamation', 560, 300, 120)}${gribouillis('eclair', 90, 400, 120)}
          <div style="position:absolute;left:780px;top:330px;width:1000px">
            <span class="sticker" style="font-size:30px">● Hors ligne</span>
            <div class="am-pop" style="font-size:104px;margin:26px 0 30px">${K.horsLigne || 'Hors ligne'}</div>
            <div class="am-neon" style="font-size:64px">${C.nomChaine || ''}</div>
            <div style="font:600 32px/1.6 var(--f-texte);color:var(--lilas);margin-top:24px">${planning}</div>
          </div></div>`;
      } },

      ...(K.panneaux || []).map((titre, i) => ({
        id: titre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        groupe: 'panneau', nom: titre, l: 320, h: 160, rendu: el => {
          el.innerHTML = `<div class="am" style="background:var(--fond-2)">${coulures(320, 160, 7, 11 + i)}
            <div style="position:absolute;inset:14px;border:4px solid #fff;border-radius:22px;box-shadow:var(--halo)"></div>
            <div style="position:absolute;left:34px;top:58px">${Reseaux.svg(titre, 58, 'color:var(--accent)') || icone(icoPanneau[titre] || 'etoile', 58)}</div>
            <div class="am-pop" style="position:absolute;left:106px;right:24px;top:0;bottom:0;display:flex;align-items:center;font-size:${Math.min(34, Math.floor(180 / (titre.length * 0.82)))}px;-webkit-text-stroke-width:2px;text-shadow:3px 3px 0 var(--encre)">${titre}</div></div>`;
        },
      })),

      // Page de dons StreamElements : la cagnotte des excuses (le milieu reste libre pour le formulaire)
      { id: 'dons-banniere', groupe: 'dons', nom: 'Bannière de la page de dons', l: 640, h: 200, rendu: el => {
        el.innerHTML = `<div class="am"><div class="am-lueur"></div>
          <div class="am-trame" style="right:0;bottom:0;width:360px;height:200px;background-size:16px 16px;-webkit-mask:radial-gradient(circle at 100% 100%,#000 20%,transparent 70%)"></div>
          ${coulures(640, 200, 9, 4)}${taches(640, 200, 8, 13)}
          <div style="position:absolute;left:22px;top:42px">${Commun.avatar(150)}</div>
          <div style="position:absolute;left:574px;top:132px;transform:rotate(14deg)">${icone('piece', 46)}</div>
          <div style="position:absolute;left:192px;top:62px;right:20px">
            <div class="am-pop" style="font-size:${Math.min(44, Math.floor(420 / ((D.titre || 'x').length * 0.66)))}px;white-space:nowrap;-webkit-text-stroke-width:2px;text-shadow:3px 3px 0 var(--encre)">${D.titre || ''}</div>
            <span class="sticker" style="margin-top:14px;font-size:17px">${D.texte || ''}</span>
          </div></div>`;
      } },
      { id: 'dons-fond', groupe: 'dons', nom: 'Fond de la page de dons', l: 1920, h: 1080, rendu: el => {
        el.innerHTML = `<div class="am"><div class="am-lueur"></div>
          <div class="am-trame" style="right:0;bottom:0;width:900px;height:700px;background-size:28px 28px;-webkit-mask:radial-gradient(circle at 100% 100%,#000 20%,transparent 70%)"></div>
          ${coulures(1920, 1080, 18, 5)}${taches(1920, 1080, 22, 17)}
          <div style="position:absolute;left:110px;top:380px">${Commun.avatar(440)}</div>
          ${gribouillis('exclamation', 470, 330, 120)}${gribouillis('eclair', 60, 820, 130)}
          <div style="position:absolute;left:1340px;top:330px;width:500px">
            <span class="sticker" style="font-size:28px">${C.nomChaine || ''}</span>
            <div class="am-pop" style="font-size:96px;margin:28px 0 30px">${D.titre || ''}</div>
            <div style="font:700 32px/1.5 var(--f-texte);color:var(--lilas)">${D.texte || ''}</div>
          </div>
          ${[[1420, 820, 90, -12], [1560, 880, 70, 18], [1700, 800, 100, 8], [1810, 920, 60, -20], [560, 560, 70, 16]]
            .map(([x, y, t, r]) => `<div style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg)">${icone('piece', t)}</div>`).join('')}</div>`;
      } },

      // Emotes (112 × 112) : lisibles jusqu'à 28 px
      { id: 'panique', groupe: 'emote', nom: 'Panique (son visage)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="am-emote"><div style="width:106px;height:106px;border-radius:50%;overflow:hidden;border:5px solid #fff;box-shadow:0 0 0 3px #A855F7;position:relative;background:#1D0F33">
          <img src="${AV}" style="position:absolute;width:300px;left:-97px;top:-86px" alt=""></div></div>`;
      } },
      { id: 'lag', groupe: 'emote', nom: 'LAG !!', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="am-emote"><span class="sticker" style="font-size:44px;padding:8px 10px 4px">LAG</span></div>`;
      } },
      { id: 'gg', groupe: 'emote', nom: 'GG ? (enfin presque)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="am-emote"><span class="sticker blanc" style="font-size:50px;padding:6px 10px 2px">GG?</span></div>`;
      } },
      { id: 'oups', groupe: 'emote', nom: 'Oups', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="am-emote"><svg viewBox="-60 -60 120 120" width="112" height="112" style="position:absolute"><polygon points="${Commun.eclat(12, 56, 38)}" fill="#fff" stroke="#140A24" stroke-width="5" stroke-linejoin="round"/></svg>
          <span style="position:relative;font:400 28px/1 var(--f-titre);color:#A855F7;transform:rotate(-10deg)">OUPS</span></div>`;
      } },
      { id: 'exclamation', groupe: 'emote', nom: '!! (stress)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="am-emote"><svg viewBox="0 0 60 60" width="100" height="100"><path d="M18 8 L22 36 M22 48 L22 50 M38 6 L40 34 M40 46 L40 48" fill="none" stroke="#A855F7" stroke-width="15" stroke-linecap="round"/>
          <path d="M18 8 L22 36 M22 48 L22 50 M38 6 L40 34 M40 46 L40 48" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg></div>`;
      } },
      { id: 'coeur', groupe: 'emote', nom: 'Cœur néon', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="am-emote"><svg viewBox="0 0 32 32" width="104" height="104"><path d="M16 28 C5 21 2 14 5 8.5 C8 4 14 5 16 9.5 C18 5 24 4 27 8.5 C30 14 27 21 16 28 Z" fill="#FF4FD8" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M9 10 C8 12 8 14 9 15.5" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg></div>`;
      } },

      // Badges d'abonné : la jauge de skill monte avec l'ancienneté (enfin !)
      { id: 'mois-1', groupe: 'badge', nom: '1 mois · Témoin', l: 72, h: 72, rendu: el => { el.innerHTML = badge(.2); } },
      { id: 'mois-3', groupe: 'badge', nom: '3 mois · Complice', l: 72, h: 72, rendu: el => { el.innerHTML = badge(.4); } },
      { id: 'mois-6', groupe: 'badge', nom: '6 mois · Soutien moral', l: 72, h: 72, rendu: el => { el.innerHTML = badge(.6); } },
      { id: 'mois-9', groupe: 'badge', nom: '9 mois · Expert en excuses', l: 72, h: 72, rendu: el => { el.innerHTML = badge(.8); } },
      { id: 'mois-12', groupe: 'badge', nom: '1 an · Légende du carnage', l: 72, h: 72, rendu: el => { el.innerHTML = badge(1, true); } },
    ],
  };
})();
