/* =====================================================================
   PATAGRAIN — Visuels de la chaîne Twitch (affichés par chaine/kit.html).
   Textes : config.js › chaine. Export PNG : node outils/exporter-chaine.mjs
   ===================================================================== */
(() => {
  const C = window.CONFIG || {};
  const K = C.chaine || {};
  const ico = Commun.ico;

  // Petit style commun aux visuels (couleurs du thème)
  document.head.insertAdjacentHTML('beforeend', `<style>
    .pg-fond { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 40%, var(--surface), var(--fond) 70%); }
    .pg-liseré { position: absolute; left: 0; right: 0; height: 10px; background: var(--accent); }
    .pg-titre { font: 800 1em/1 var(--f-titre); color: var(--texte); letter-spacing: 1px; }
    .pg-centre { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    .pg-fanions { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-around; }
    .pg-fanions i { width: 0; height: 0; border-left: 26px solid transparent; border-right: 26px solid transparent; border-top: 44px solid var(--c); }
    .pg-deco svg, .pg-deco img { position: absolute; opacity: .16; }
    .pg-emote { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .pg-emote svg, .pg-emote img { filter: drop-shadow(0 4px 0 rgba(0,0,0,.35)); }
    .pg-texte-emote { font: 900 44px/1 var(--f-texte); color: #fff; -webkit-text-stroke: 8px #152238; paint-order: stroke fill; }
  </style>`);

  const fanions = n => `<div class="pg-fanions">${Array.from({ length: n }, (_, i) =>
    `<i style="--c:${['var(--primaire)', 'var(--accent)', 'var(--accent-2)'][i % 3]}"></i>`).join('')}</div>`;
  // Dés et symboles discrets en fond (positions fixes)
  const deco = liste => `<div class="pg-deco">${liste.map(([nom, x, y, t, r]) =>
    ico(nom).replace(/^<(svg|img)/, `<$1 style="left:${x}px;top:${y}px;width:${t}px;height:${t}px;transform:rotate(${r}deg)"`)).join('')}</div>`;
  // Un d20 simple dont on choisit le chiffre et la couleur (emotes « nat 20 » / « nat 1 »)
  const d20 = (chiffre, face, bord) => `<svg viewBox="0 0 100 100" width="104" height="104">
    <polygon points="50,2 93,26 93,74 50,98 7,74 7,26" fill="${bord}"/>
    <polygon points="50,19 83.5,77 16.5,77" fill="${face}"/>
    <path d="M50 2 L50 19 M7 26 L50 19 L93 26 M7 74 L16.5 77 M93 74 L83.5 77 M50 98 L16.5 77 L83.5 77 Z" stroke="rgba(0,0,0,.25)" stroke-width="2" fill="none"/>
    <text x="50" y="66" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="${String(chiffre).length > 1 ? 24 : 30}" fill="#152238">${chiffre}</text></svg>`;

  // Pièces d'or (page de dons) : une pièce à plat, et une pile vue de côté
  const piece = (x, y, t, r = 0) => `<svg viewBox="0 0 40 40" style="position:absolute;left:${x}px;top:${y}px;width:${t}px;height:${t}px;transform:rotate(${r}deg);filter:drop-shadow(0 4px 0 rgba(0,0,0,.3))">
    <circle cx="20" cy="20" r="18" fill="var(--accent)" stroke="#AD8120" stroke-width="3"/><circle cx="20" cy="20" r="11.5" fill="none" stroke="#AD8120" stroke-width="2"/>
    <path d="M20 12.5 L22.1 17.6 L27.5 18 L23.4 21.4 L24.7 26.8 L20 23.9 L15.3 26.8 L16.6 21.4 L12.5 18 L17.9 17.6 Z" fill="#FFF3DC" opacity=".9"/></svg>`;
  const pile = (x, bas, n, t = 120) => {
    const h = n * 12 + 30;
    return `<svg viewBox="0 0 110 ${h}" style="position:absolute;left:${x}px;top:${bas - h * t / 110}px;width:${t}px;filter:drop-shadow(0 6px 0 rgba(0,0,0,.3))">${Array.from({ length: n }, (_, i) => {
      const y = h - 16 - i * 12, d = (i % 2 ? 2 : -2);
      return `<g transform="translate(${d} 0)"><ellipse cx="55" cy="${y + 10}" rx="50" ry="13" fill="#AD8120"/><rect x="5" y="${y}" width="100" height="10" fill="#AD8120"/>
        <ellipse cx="55" cy="${y}" rx="50" ry="13" fill="var(--accent)" stroke="#AD8120" stroke-width="2"/></g>`;
    }).join('')}</svg>`;
  };
  const D = K.dons || {};

  const planning = (K.planning || []).length
    ? K.planning.map(([j, h]) => `<div><b>${j}</b> · ${h}</div>`).join('')
    : '<div>Suis la chaîne pour être prévenu de la prochaine quête</div>';

  // Icône de chaque panneau de bio (par titre)
  const icoPanneau = { 'À propos': 'parchemin', 'Planning': 'd20', 'Règles': 'bouclier', 'Soutenir': 'grelot', 'Réseaux': 'chapeau', 'Discord': 'chapeau', 'Matériel': 'd6', 'Commandes': 'd4' };

  window.KIT = {
    elements: [
      // Photo de profil : le bouffon (tête et chapeau), cadré pour le rond de Twitch
      { id: 'profil', groupe: 'profil', nom: 'Le bouffon', l: 800, h: 800, rendu: el => {
        el.innerHTML = `<div class="pg-fond"></div>
          <div style="position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 0 26px var(--accent), inset 0 0 0 40px var(--primaire-fonce)"></div>
          <div style="position:absolute;inset:0">${Bouffon.svg('buste').replace(/viewBox="[^"]*"/, 'viewBox="-38 -20 476 476" width="800" height="800"')}</div>`;
      } },
      { id: 'profil-embleme', groupe: 'profil', nom: 'Emblème d20 (autre choix)', l: 800, h: 800, rendu: el => {
        el.innerHTML = `<div class="pg-fond"></div><img src="../assets/embleme-bleu.svg" alt="" style="position:absolute;left:110px;top:110px;width:580px;height:580px">`;
      } },

      { id: 'banniere', groupe: 'banniere', nom: 'Bannière de profil', l: 1200, h: 480, rendu: el => {
        el.innerHTML = `<div class="pg-fond"></div>${fanions(15)}
          ${deco([['d20', 60, 150, 120, -12], ['d6', 1040, 110, 100, 14], ['grelot', 190, 330, 80, 10], ['d8', 930, 320, 90, -8]])}
          <div class="pg-centre" style="padding-top:30px">
            <img src="../assets/logo-couleur.svg" alt="" style="width:620px">
            <div style="font:700 26px var(--f-texte);color:var(--texte-doux);margin-top:18px">${K.slogan || ''}</div>
          </div>
          <div class="pg-liseré" style="bottom:0"></div>`;
      } },

      { id: 'hors-ligne', groupe: 'hors-ligne', nom: 'Écran hors-ligne', l: 1920, h: 1080, rendu: el => {
        el.innerHTML = `<div class="pg-fond"></div>${fanions(23)}
          ${deco([['d20', 150, 260, 190, -12], ['d6', 1620, 220, 150, 14], ['grelot', 300, 760, 120, 10], ['d8', 1500, 740, 140, -8], ['d4', 900, 880, 110, 6]])}
          <!-- Le bouffon s'est endormi debout, la tête qui penche ; les « Z » s'envolent -->
          <style>.pg-dort .bf-haut { transform: rotate(9deg) translateY(12px); transform-box: view-box; }
            .pg-z { position: absolute; font: 800 var(--t) var(--f-titre); color: var(--texte); opacity: var(--o); transform: rotate(12deg); }</style>
          <div class="pg-dort" style="position:absolute;left:170px;top:150px;width:370px;height:851px">${Bouffon.svg('pied', { expression: 'dort' })}</div>
          <span class="pg-z" style="left:470px;top:250px;--t:70px;--o:.55">z</span>
          <span class="pg-z" style="left:530px;top:170px;--t:95px;--o:.75">z</span>
          <span class="pg-z" style="left:610px;top:70px;--t:130px;--o:.95">Z</span>
          <div class="pg-centre" style="left:560px">
            <img src="../assets/logo-couleur.svg" alt="" style="width:560px;margin-bottom:34px">
            <div class="pg-titre" style="font-size:110px">${K.horsLigne || 'Le bouffon se repose'}</div>
            <div style="font:700 34px/1.5 var(--f-texte);color:var(--texte-doux);margin-top:30px">${planning}</div>
          </div>`;
      } },

      ...(K.panneaux || []).map(titre => ({
        id: titre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        groupe: 'panneau', nom: titre, l: 320, h: 160, rendu: el => {
          el.innerHTML = `<div class="pg-fond" style="border-radius:16px;border:6px solid var(--accent)"></div>
            <div style="position:absolute;left:22px;top:38px;width:84px;height:84px">${ico(icoPanneau[titre] || 'd20').replace(/^<(svg|img)/, '<$1 style="width:84px;height:84px"')}</div>
            <div class="pg-titre" style="position:absolute;left:122px;right:14px;top:0;bottom:0;display:flex;align-items:center;font-size:${titre.length > 8 ? 38 : 50}px">${titre}</div>`;
        },
      })),

      // Page de dons StreamElements : la bourse du bouffon
      { id: 'dons-banniere', groupe: 'dons', nom: 'Bannière de la page de dons', l: 640, h: 200, rendu: el => {
        el.innerHTML = `<div class="pg-fond"></div>${fanions(8)}
          ${piece(560, 122, 54, 18)}${piece(592, 66, 34, -10)}
          <div style="position:absolute;left:4px;top:26px;width:176px;height:176px">${Bouffon.svg('buste', { expression: 'clin' }).replace(/viewBox="[^"]*"/, 'viewBox="-20 -10 440 440" width="176" height="176"')}</div>
          <div class="pg-centre" style="left:180px;right:70px;padding-top:34px">
            <img src="../assets/logo-couleur.svg" alt="" style="width:200px">
            <div class="pg-titre" style="font-size:34px;margin-top:6px">${D.titre || ''}</div>
            <div style="font:700 17px var(--f-texte);color:var(--texte-doux);margin-top:6px">${D.texte || ''}</div>
          </div>
          <div class="pg-liseré" style="bottom:0;height:6px"></div>`;
      } },
      { id: 'dons-fond', groupe: 'dons', nom: 'Fond de la page de dons', l: 1920, h: 1080, rendu: el => {
        el.innerHTML = `<div class="pg-fond"></div>${fanions(23)}
          ${deco([['d20', 60, 760, 170, -12], ['d6', 1700, 140, 130, 14], ['grelot', 560, 180, 90, 10], ['d8', 1290, 860, 120, -8], ['d4', 600, 900, 100, 6]])}
          <div style="position:absolute;left:150px;top:170px;width:370px;height:851px">${Bouffon.svg('pied', { expression: 'rire' })}</div>
          ${piece(470, 300, 70, 20)}${piece(530, 420, 50, -14)}${piece(455, 520, 40, 8)}
          <div class="pg-centre" style="left:1330px;right:60px;bottom:330px">
            <img src="../assets/logo-couleur.svg" alt="" style="width:470px;margin-bottom:30px">
            <div class="pg-titre" style="font-size:84px;line-height:1.05">${D.titre || ''}</div>
            <div style="font:700 30px/1.4 var(--f-texte);color:var(--texte-doux);margin-top:24px">${D.texte || ''}</div>
          </div>
          ${pile(1390, 1010, 7)}${pile(1500, 1010, 11, 130)}${pile(1625, 1010, 5)}${piece(1760, 920, 80, 12)}${piece(1460, 760, 46, -20)}`;
      } },

      // Emotes : dessinées en 112 × 112, lisibles jusqu'en 28 × 28
      { id: 'nat20', groupe: 'emote', nom: 'Nat 20 (coup critique)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="pg-emote">${d20(20, '#F5B82E', '#3A9AD9')}</div>`;
      } },
      { id: 'nat1', groupe: 'emote', nom: 'Nat 1 (échec critique)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="pg-emote">${d20(1, '#FFF3DC', '#8FD0F5')}</div>`;
      } },
      { id: 'gg', groupe: 'emote', nom: 'GG (bouclier)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="pg-emote">${ico('bouclier').replace(/^<svg/, '<svg style="width:100px;height:108px"')}</div>
          <div class="pg-emote" style="padding-bottom:6px"><span class="pg-texte-emote" style="font-size:40px">GG</span></div>`;
      } },
      { id: 'grelot', groupe: 'emote', nom: 'Grelot (ding !)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="pg-emote">${ico('grelot').replace(/^<svg/, '<svg style="width:88px;height:102px;transform:rotate(-14deg)"')}</div>`;
      } },
      // Le bouffon (js/bouffon.js), recadré au carré sur le visage (lisible jusqu'en 28 px)
      ...[['bouffon', 'Bouffon', ''], ['bouffon-clin', 'Clin d’œil', 'clin'], ['bouffon-rire', 'Mort de rire', 'rire'], ['bouffon-choc', 'Choqué', 'choc']].map(([id, nom, expression]) => ({
        id, groupe: 'emote', nom, l: 112, h: 112, rendu: el => {
          el.innerHTML = `<div class="pg-emote">${Bouffon.svg('tete', { expression }).replace(/viewBox="[^"]*"/, 'viewBox="66 84 268 268" style="width:112px;height:112px"')}</div>`;
        },
      })),
      { id: 'epee', groupe: 'emote', nom: 'Épée (à l\'attaque !)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="pg-emote"><img src="../assets/epee.svg" alt="" style="width:150px;height:150px;flex:none;object-fit:contain;transform:rotate(-45deg)"></div>`;
      } },

      // Badges d'abonné : la trousse du MJ, du plus petit dé au d20
      ...[['1', 'd4', '1 mois'], ['3', 'd6', '3 mois'], ['6', 'd8', '6 mois'], ['9', 'bouclier', '9 mois'], ['12', 'd20', '1 an']].map(([mois, nom, libelle]) => ({
        id: `mois-${mois}`, groupe: 'badge', nom: libelle, l: 72, h: 72, rendu: el => {
          el.innerHTML = `<div class="pg-emote">${ico(nom).replace(/^<svg/, '<svg style="width:68px;height:68px"')}</div>`;
        },
      })),
    ],
  };
})();
