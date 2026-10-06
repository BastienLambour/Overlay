/* =====================================================================
   JOHN VON GURT — Visuels de la chaîne Twitch (affichés par chaine/kit.html).
   Textes : config.js › chaine. Export PNG : node outils/exporter-chaine.mjs
   ===================================================================== */
(() => {
  const C = window.CONFIG || {};
  const K = C.chaine || {};
  // + icône « terminal » (panneau Commandes), propre au kit
  const I = { ...Commun.icones, terminal: '<svg viewBox="0 0 32 32" class="icone"><rect x="3" y="6" width="26" height="20" rx="2"/><path d="M8 12.5 L12.5 16 L8 19.5 M15 20 H23"/></svg>' };

  document.head.insertAdjacentHTML('beforeend', `<style>
    .jv { position: absolute; inset: 0; background: var(--fond); color: var(--trait); font-family: var(--f-texte); overflow: hidden; }
    .jv-grille { position: absolute; inset: 0; background-image: linear-gradient(var(--faible) 1px, transparent 1px), linear-gradient(90deg, var(--faible) 1px, transparent 1px); background-size: 48px 48px; }
    .jv-coins i { position: absolute; width: 34px; height: 34px; border: 0 solid var(--trait); }
    .jv-coins .hg { left: 20px; top: 20px; border-left-width: 3px; border-top-width: 3px; }
    .jv-coins .hd { right: 20px; top: 20px; border-right-width: 3px; border-top-width: 3px; }
    .jv-coins .bg { left: 20px; bottom: 20px; border-left-width: 3px; border-bottom-width: 3px; }
    .jv-coins .bd { right: 20px; bottom: 20px; border-right-width: 3px; border-bottom-width: 3px; }
    .jv-titre { font: 700 1em/.95 var(--f-titre); text-transform: uppercase; letter-spacing: .01em; }
    .jv .etoile { animation: none; }
    .kit-el .flamme { animation: none; }
    .jv-emote { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .jv-emote .icone { stroke-width: 3.2; }
  </style>`);

  // Ciel étoilé fixe (pseudo-aléatoire stable, pour que l'export soit identique à chaque fois)
  const alea = (i, k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
  const ciel = (l, h, n) => `<svg style="position:absolute;inset:0" width="${l}" height="${h}">${Array.from({ length: n }, (_, i) =>
    `<circle cx="${(alea(i, 1) * l).toFixed(1)}" cy="${(alea(i, 2) * h).toFixed(1)}" r="${(0.8 + alea(i, 3) * 1.6).toFixed(2)}" fill="var(--trait)" opacity="${(0.25 + alea(i, 4) * 0.6).toFixed(2)}"/>`).join('')}</svg>`;
  const coins = '<div class="jv-coins"><i class="hg"></i><i class="hd"></i><i class="bg"></i><i class="bd"></i></div>';
  // La fusée commune de l'overlay, inclinée ou non
  const fusee = (taille, { angle = 0, flamme = false, id = 'f' + Math.random().toString(36).slice(2, 7) } = {}) =>
    `<svg viewBox="-90 -185 180 ${flamme ? 450 : 330}" width="${taille}" height="${taille * (flamme ? 450 : 330) / 180}" style="transform:rotate(${angle}deg);overflow:visible">${Commun.fusee({ id, flamme })}</svg>`;
  const icone = (nom, taille, couleur = 'var(--trait)') => I[nom].replace('class="icone"', `class="icone" style="width:${taille}px;height:${taille}px;color:${couleur}"`);

  const planning = (K.planning || []).length
    ? K.planning.map(([j, h]) => `<div><span class="attention">${j}</span> · ${h}</div>`).join('')
    : '<div>Suis la chaîne pour être prévenu du prochain lancement</div>';
  const icoPanneau = { 'À propos': 'planete', 'Planning': 'horloge', 'Règles': 'alerte', 'Soutenir': 'carburant', 'Réseaux': 'radar', 'Discord': 'groupe', 'Matériel': 'camera', 'Commandes': 'terminal' };

  // Jauge de carburant (page de dons) : n graduations, dont « plein » allumées
  const jauge = (n, plein, l, h) => `<div style="display:flex;flex-direction:column-reverse;gap:${Math.round(h / n / 5)}px;width:${l}px;height:${h}px;padding:10px;border:3px solid var(--trait);box-sizing:border-box">
    ${Array.from({ length: n }, (_, i) => `<i style="flex:1;background:${i < plein ? 'var(--accent)' : 'transparent'};border:2px solid ${i < plein ? 'var(--accent)' : 'var(--faible)'}"></i>`).join('')}</div>`;
  const D = K.dons || {};

  // Badge d'abonné : galons orange sur plaque sombre
  const galons = n => `<svg viewBox="0 0 72 72" width="72" height="72"><rect x="3" y="3" width="66" height="66" rx="10" fill="#141920" stroke="#E6EAEE" stroke-width="3"/>
    ${Array.from({ length: n }, (_, i) => `<path d="M16 ${ (n === 1 ? 40 : n === 2 ? 34 : 28) + i * 12} L36 ${(n === 1 ? 28 : n === 2 ? 22 : 16) + i * 12} L56 ${(n === 1 ? 40 : n === 2 ? 34 : 28) + i * 12}" fill="none" stroke="#FF9F1C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`;

  window.KIT = {
    elements: [
      { id: 'profil', groupe: 'profil', nom: 'Fusée en orbite', l: 800, h: 800, rendu: el => {
        el.innerHTML = `<div class="jv">${ciel(800, 800, 90)}
          <svg style="position:absolute;inset:0" width="800" height="800"><circle cx="400" cy="400" r="300" fill="none" stroke="var(--doux)" stroke-width="3" stroke-dasharray="4 14"/>
          <circle cx="400" cy="400" r="230" fill="none" stroke="var(--accent)" stroke-width="6"/></svg>
          <div style="position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center">${fusee(230, { angle: 35 })}</div></div>`;
      } },

      { id: 'banniere', groupe: 'banniere', nom: 'Bannière de profil', l: 1200, h: 480, rendu: el => {
        el.innerHTML = `<div class="jv"><div class="jv-grille"></div>${ciel(1200, 480, 120)}${coins}
          <div style="position:absolute;left:150px;top:40px">${fusee(150, { angle: 40, flamme: true })}</div>
          <div style="position:absolute;left:470px;top:120px">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px"><span class="label doux" style="font-size:20px">Mission control</span><span class="hachures"></span></div>
            <div class="jv-titre" style="font-size:110px">${C.nomChaine || ''}</div>
            <div class="etiquette" style="margin-top:22px;font-size:20px">${K.slogan || ''}</div>
          </div></div>`;
      } },

      { id: 'hors-ligne', groupe: 'hors-ligne', nom: 'Écran hors-ligne', l: 1920, h: 1080, rendu: el => {
        el.innerHTML = `<div class="jv"><div class="jv-grille"></div>${ciel(1920, 1080, 220)}${coins}
          <svg style="position:absolute;right:-220px;bottom:-260px" width="900" height="900"><circle cx="450" cy="450" r="440" fill="var(--fond-2)" stroke="var(--trait)" stroke-width="3"/>
            <circle cx="300" cy="330" r="60" fill="none" stroke="var(--doux)" stroke-width="3"/><circle cx="520" cy="250" r="34" fill="none" stroke="var(--doux)" stroke-width="3"/><circle cx="420" cy="520" r="90" fill="none" stroke="var(--doux)" stroke-width="3"/></svg>
          <div style="position:absolute;left:1180px;top:230px">${fusee(160, { angle: 0 })}</div>
          <div style="position:absolute;left:140px;top:300px">
            <div style="display:flex;align-items:center;gap:20px;margin-bottom:18px"><span class="label attention">● Hors ligne</span><span class="hachures"></span></div>
            <div class="jv-titre" style="font-size:150px;max-width:1000px">${K.horsLigne || 'Transmission interrompue'}</div>
            <div class="etiquette" style="margin-top:34px">${C.nomChaine || ''}</div>
            <div style="font:600 34px/1.6 var(--f-texte);color:var(--doux);margin-top:30px">${planning}</div>
          </div></div>`;
      } },

      ...(K.panneaux || []).map((titre, i) => ({
        id: titre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        groupe: 'panneau', nom: titre, l: 320, h: 160, rendu: el => {
          el.innerHTML = `<div class="jv" style="background:var(--fond-2)">${coins.replace(/20px/g, '10px')}
            <div style="position:absolute;left:26px;top:30px;font:600 16px var(--f-mono);color:var(--accent)">${String(i + 1).padStart(2, '0')}</div>
            <div style="position:absolute;left:24px;top:58px">${Reseaux.svg(titre, 64, 'color:var(--accent)') || icone(icoPanneau[titre] || 'cible', 64, 'var(--accent)')}</div>
            <div class="jv-titre" style="position:absolute;left:112px;right:16px;top:0;bottom:0;display:flex;align-items:center;font-size:${titre.length > 8 ? 40 : 52}px">${titre}</div>
            <div class="hachures" style="position:absolute;right:26px;bottom:24px;width:70px;height:12px"></div></div>`;
        },
      })),

      // Page de dons StreamElements : on fait le plein de la fusée
      { id: 'dons-banniere', groupe: 'dons', nom: 'Bannière de la page de dons', l: 640, h: 200, rendu: el => {
        el.innerHTML = `<div class="jv"><div class="jv-grille"></div>${ciel(640, 200, 60)}${coins.replace(/20px/g, '10px')}
          <div style="position:absolute;left:62px;top:-4px">${fusee(62, { angle: 40, flamme: true })}</div>
          <div style="position:absolute;left:196px;top:40px;right:36px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">${icone('carburant', 26, 'var(--accent)')}<span class="label doux" style="font-size:15px">${C.nomChaine || ''}</span><span class="hachures" style="flex:1;height:10px"></span></div>
            <div class="jv-titre" style="font-size:52px;white-space:nowrap">${D.titre || ''}</div>
            <div style="font:600 18px var(--f-texte);color:var(--doux);margin-top:10px">${D.texte || ''}</div>
          </div></div>`;
      } },
      { id: 'dons-fond', groupe: 'dons', nom: 'Fond de la page de dons', l: 1920, h: 1080, rendu: el => {
        el.innerHTML = `<div class="jv"><div class="jv-grille"></div>${ciel(1920, 1080, 220)}${coins}
          <svg style="position:absolute;left:-260px;bottom:-330px" width="900" height="900"><circle cx="450" cy="450" r="440" fill="var(--fond-2)" stroke="var(--trait)" stroke-width="3"/>
            <circle cx="560" cy="300" r="60" fill="none" stroke="var(--doux)" stroke-width="3"/><circle cx="380" cy="220" r="34" fill="none" stroke="var(--doux)" stroke-width="3"/></svg>
          <div style="position:absolute;left:300px;top:110px">${fusee(170, { angle: 25, flamme: true })}</div>
          <div style="position:absolute;left:1340px;top:220px;width:480px">
            <div style="display:flex;align-items:center;gap:20px;margin-bottom:18px"><span class="label attention">● Ravitaillement</span><span class="hachures" style="flex:1"></span></div>
            <div class="jv-titre" style="font-size:104px">${D.titre || ''}</div>
            <div style="font:600 32px/1.5 var(--f-texte);color:var(--doux);margin-top:26px">${D.texte || ''}</div>
            <div style="display:flex;align-items:flex-end;gap:26px;margin-top:60px">
              ${jauge(10, 7, 80, 300)}
              <div><div style="margin-bottom:14px">${icone('carburant', 64, 'var(--accent)')}</div>
                <div class="label doux" style="font-size:18px">Réservoir</div><div class="etiquette" style="margin-top:12px">${C.nomChaine || ''}</div></div>
            </div>
          </div></div>`;
      } },

      // Emotes (112 × 112)
      { id: 'decollage', groupe: 'emote', nom: 'Décollage', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="jv-emote"><div style="transform:rotate(40deg);flex:none">${fusee(46, { flamme: true })}</div></div>`;
      } },
      { id: 'casque', groupe: 'emote', nom: 'Casque d\'astronaute', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="jv-emote"><svg viewBox="0 0 32 32" width="104" height="104"><circle cx="16" cy="14" r="12" fill="#141920" stroke="#E6EAEE" stroke-width="2.4"/>
          <rect x="8.5" y="8.5" width="15" height="10" rx="4.5" fill="#FF9F1C" stroke="#E6EAEE" stroke-width="2"/><path d="M11 11 L14 11" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M8 24 L6 30 H26 L24 24" fill="#141920" stroke="#E6EAEE" stroke-width="2.4" stroke-linejoin="round"/></svg></div>`;
      } },
      { id: 'houston', groupe: 'emote', nom: 'Houston, on a un problème', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="jv-emote"><svg viewBox="0 0 32 32" width="106" height="106"><path d="M16 3 L30.5 28.5 H1.5 Z" fill="#FF9F1C" stroke="#07090C" stroke-width="2" stroke-linejoin="round"/>
          <path d="M16 11 V20" stroke="#07090C" stroke-width="3.4" stroke-linecap="round"/><circle cx="16" cy="24.5" r="2" fill="#07090C"/></svg></div>`;
      } },
      { id: 'o7', groupe: 'emote', nom: 'o7 (salut du commandant)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="jv-emote"><div style="background:#07090C;border:4px solid #E6EAEE;padding:10px 12px;font:700 56px/1 var(--f-titre);color:#E6EAEE">o<span style="color:#FF9F1C">7</span></div></div>`;
      } },
      { id: 'gg', groupe: 'emote', nom: 'GG (mission accomplie)', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="jv-emote"><div style="background:#FF9F1C;border:4px solid #07090C;padding:12px 10px;font:700 60px/1 var(--f-titre);color:#07090C">GG</div></div>`;
      } },
      { id: 'lune', groupe: 'emote', nom: 'Cap sur la Lune', l: 112, h: 112, rendu: el => {
        el.innerHTML = `<div class="jv-emote"><svg viewBox="0 0 32 32" width="104" height="104"><circle cx="16" cy="16" r="13.5" fill="#D8DBD5" stroke="#07090C" stroke-width="2"/>
          <circle cx="11" cy="12" r="3" fill="#B7BCB4"/><circle cx="20" cy="19" r="4" fill="#B7BCB4"/><circle cx="19" cy="9" r="1.8" fill="#B7BCB4"/><circle cx="11" cy="22" r="1.6" fill="#B7BCB4"/></svg></div>`;
      } },

      // Badges d'abonné : galons de grade, puis planète et fusée
      { id: 'mois-1', groupe: 'badge', nom: '1 mois · Recrue', l: 72, h: 72, rendu: el => { el.innerHTML = galons(1); } },
      { id: 'mois-3', groupe: 'badge', nom: '3 mois · Pilote', l: 72, h: 72, rendu: el => { el.innerHTML = galons(2); } },
      { id: 'mois-6', groupe: 'badge', nom: '6 mois · Officier', l: 72, h: 72, rendu: el => { el.innerHTML = galons(3); } },
      { id: 'mois-9', groupe: 'badge', nom: '9 mois · Explorateur', l: 72, h: 72, rendu: el => {
        el.innerHTML = `<svg viewBox="0 0 72 72" width="72" height="72"><rect x="3" y="3" width="66" height="66" rx="10" fill="#141920" stroke="#E6EAEE" stroke-width="3"/>
          <circle cx="36" cy="36" r="14" fill="#FF9F1C"/><ellipse cx="36" cy="36" rx="27" ry="8" transform="rotate(-20 36 36)" fill="none" stroke="#E6EAEE" stroke-width="4"/></svg>`;
      } },
      { id: 'mois-12', groupe: 'badge', nom: '1 an · Commandant', l: 72, h: 72, rendu: el => {
        el.innerHTML = `<svg viewBox="0 0 72 72" width="72" height="72" style="position:absolute"><rect x="3" y="3" width="66" height="66" rx="10" fill="#FF9F1C" stroke="#07090C" stroke-width="3"/></svg>
          <div class="jv-emote">${fusee(26, { angle: 35 })}</div>`;
      } },
    ],
  };
})();
