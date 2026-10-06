/* =====================================================================
   GRELOTS — les spectacles que les spectateurs offrent avec leurs grelots
   (points de fidélité StreamElements). Le fil rouge : la rivalité entre Patagrain et
   DARKTAGRAIN, son double maléfique (même dessin, habit violet et noir, yeux rouges).
   Du plus petit au plus grand :
     chute    — Darktagrain pose une peau de banane : le bouffon glisse, s'étale… et le chasse
     tarte    — Darktagrain lui lance une tarte à la crème : il s'essuie, goûte… « Miam ! »
     serenade — il gratte le banjo et chante faux… jusqu'à ce qu'un grelot lui tombe sur la tête
     destin   — il lance un d20 géant (vrai tirage) : danse sur 20, dé sur le pied sur 1
     potion   — il boit une potion mystère : géant, minuscule, vert ou ballon (au hasard), puis « pouf »
     chifoumi — pierre, feuille, ciseaux contre Darktagrain (au hasard) : le gagnant danse, le perdant…
     coffre   — il ouvre un coffre : objet légendaire, commun ou nul (au hasard)
     catapulte — pile ou face : l'un envoie l'autre en catapulte ; 7 atterrissages au hasard
     duel     — il désarme Darktagrain, qui s'enfuit… chercher son dragon
     dragon   — Darktagrain revient à dos de dragon : le bouffon saute les flammes et les terrasse
   Grelots.jouer(scene, spectacle, nom, forcer) : joue le spectacle (son nom ci-dessus) dans
   « scene » (un élément plein écran) et renvoie une promesse tenue quand c'est fini.
   « forcer » (facultatif, pour les essais) : { de: 1..20 }, { effet: 'geant'|'minuscule'|'vert'|'ballon' },
   { chifoumi: 'gagne'|'perd'|'egalite' } ou { tresor: 'couronne'|'epee'|'chope'|'fromage'|'chaussette'|'poisson' },
   { piece: 'pile'|'face', atterrissage: 'pieds'|'foin'|'vitre'|'eau'|'bouse'|'lac'|'taverne' }.
   Dessins : js/bouffon.js et js/dragon.js ; gestes : css/bouffon.css (section 7).
   ===================================================================== */
const Grelots = (() => {
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  const bouger = (el, images, ms, easing = 'ease-in-out') => el.animate(images, { duration: ms, easing, fill: 'forwards' }).finished;
  const placer = (el, transform) => el.animate([{ transform }, { transform }], { duration: 1, fill: 'forwards' });
  function creer(scene, classe, html = '', style = '') {
    const el = document.createElement('div');
    el.className = classe; el.innerHTML = html; if (style) el.style.cssText = style;
    scene.appendChild(el);
    return el;
  }
  // Un bouffon (ou son double maléfique), placé à « x » (en % de la largeur de l'écran)
  function perso(scene, x, { malefique = false, epee = false, expression = '' } = {}) {
    const boite = creer(scene, 'gr-perso' + (malefique ? ' bouffon-malefique gr-miroir' : ''));
    const corps = document.createElement('div');
    corps.innerHTML = Bouffon.svg('pied', { epee, expression });
    boite.appendChild(corps);
    placer(boite, `translateX(${x}cqw)`);
    boite.pose = (classes, ms) => {                       // ajoute des classes de geste, retirées après « ms »
      const liste = classes.split(' ');
      corps.classList.add(...liste);
      if (ms) setTimeout(() => corps.classList.remove(...liste), ms);
    };
    boite.depose = classes => corps.classList.remove(...classes.split(' '));
    boite.allerA = (x, ms, easing = 'linear') => bouger(boite, [{ transform: getComputedStyle(boite).transform }, { transform: `translateX(${x}cqw)` }], ms, easing);
    boite.svg = corps.querySelector('svg');
    boite.corps = corps;
    boite.expression = e => {                             // change d'expression (« » = la normale)
      boite.svg.classList.forEach(c => c.startsWith('expr-') && boite.svg.classList.remove(c));
      e = e || expression;
      if (e) boite.svg.classList.add('expr-' + e);
    };
    // Met le bras droit devant la tête (pour qu'il touche son visage)
    boite.brasDevant = () => boite.svg.querySelector('.bf-tout').appendChild(boite.svg.querySelector('.bf-epaule-d'));
    return boite;
  }
  function annoncer(scene, titre, nom, texte) {
    const a = creer(scene, 'gr-annonce', `<small>${titre}</small><b><em></em> <span></span></b>`);
    a.querySelector('em').textContent = nom;              // le pseudo est inséré comme du texte (jamais comme du code)
    a.texte = t => { a.querySelector('span').textContent = t; };
    a.titre = t => { a.querySelector('small').textContent = t; };
    a.texte(texte);
    bouger(a, [{ opacity: 0, transform: 'translateY(-4cqh) scale(.8)' }, { opacity: 1, transform: 'none' }], 500, 'cubic-bezier(.34,1.56,.64,1)');
    return a;
  }
  // Centre d'un morceau du dessin, en px de la scène (la page peut être mise à l'échelle)
  function centre(el, scene) {
    const r = el.getBoundingClientRect(), s = scene.getBoundingClientRect(), k = s.width / scene.offsetWidth || 1;
    return { x: (r.x - s.x + r.width / 2) / k, y: (r.y - s.y + r.height / 2) / k };
  }
  // Un objet (élément de la scène) posé avec son centre en (x, y) px
  function poser(el, x, y) { el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.translate = '-50% -50%'; }
  const auHasard = liste => liste[Math.floor(Math.random() * liste.length)];
  function bulle(scene, qui, texte, ms = 1400, haut = .12) {    // « qui » : un perso (ou un élément du décor) ; « haut » : au-dessus (part de l'écran)
    const tete = centre(qui.svg ? qui.svg.querySelector('.bf-tete') : qui, scene);
    const el = creer(scene, 'gr-bulle');
    el.textContent = texte;
    const cote = tete.x > scene.offsetWidth * .6 ? -1 : 1;          // à gauche de la tête quand il est à droite de l'écran
    poser(el, tete.x + cote * scene.offsetHeight * .13, tete.y - scene.offsetHeight * haut);
    bouger(el, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1.1)', offset: .15 }, { opacity: 1, transform: 'none', offset: .25 },
      { opacity: 1, transform: 'none', offset: .85 }, { opacity: 0, transform: 'translateY(-2cqh)' }], ms).then(() => el.remove());
  }
  const effacer = el => bouger(el, [{ opacity: 1 }, { opacity: 0 }], 500);
  function fumee(scene, x, bas) {
    const f = creer(scene, 'gr-fumee', Array.from({ length: 7 }, (_, i) => {
      const t = 8 + (i % 3) * 3;
      return `<span style="width:${t}cqh;height:${t}cqh;left:${(i * 37) % 18}cqh;top:${(i * 53) % 16}cqh"></span>`;
    }).join(''), typeof x === 'number' ? `left:${x}cqw;bottom:${bas}cqh` : `left:${x};bottom:${bas}`);   // en cqw/cqh, ou des longueurs CSS
    return bouger(f, [{ opacity: .95, transform: 'scale(.3)' }, { opacity: .9, transform: 'scale(1.1)', offset: .4 }, { opacity: 0, transform: 'scale(1.5)' }], 1300).then(() => f.remove());
  }

  // ---------- Darktagrain, le rival ----------
  const HEROS = (window.CONFIG || {}).nomChaine || 'Patagrain', RIVAL = ((window.CONFIG || {}).grelots || {}).rival || 'Darktagrain';
  const rival = (scene, x, options = {}) => perso(scene, x, { malefique: true, expression: 'mechant', ...options });
  // un objet qui vole en cloche de « de » à « a » (px de la scène), en tournant de « degres »
  function arc(el, de, a, haut, ms, degres) {
    poser(el, a.x, a.y);
    const images = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, x = (de.x - a.x) * (1 - t), y = (de.y - a.y) * (1 - t) - haut * 4 * t * (1 - t);
      images.push({ transform: `translate(${x}px, ${y}px) rotate(${degres * t}deg)` });
    }
    return bouger(el, images, ms, 'linear');
  }
  const main = (p, scene) => centre(p.svg.querySelector('.bf-coude-d circle'), scene);

  // ---------- 1. La chute : la peau de banane ----------
  const BANANE = `<svg viewBox="0 0 100 60" style="display:block;width:100%;overflow:visible">
    <path d="M14 52 C24 34 46 28 58 32 C66 18 84 14 94 22 C82 26 74 32 70 40 C82 36 94 42 98 52 C84 48 72 50 60 55 C46 60 28 60 14 52 Z"
      fill="#F2CF3A" stroke="#B8901C" stroke-width="3" stroke-linejoin="round"/>
    <path d="M14 52 L6 50" stroke="#6B4F1A" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 50 C42 44 54 42 62 44" stroke="#D9B02A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  async function chute(scene, nom) {
    const annonce = annoncer(scene, 'La peau de banane', nom, `tend une peau de banane à ${RIVAL}…`);
    const H = scene.offsetHeight, W = scene.offsetWidth;
    // Darktagrain pose la peau de banane… et va guetter plus loin
    const m = rival(scene, 112);
    m.pose('marche');
    await m.allerA(50, 1500);
    m.depose('marche');
    const depart = main(m, scene), sol = { x: depart.x, y: H * .93 - H * .02 };
    const banane = creer(scene, 'gr-banane', BANANE);
    await arc(banane, depart, sol, H * .03, 400, 20);
    bulle(scene, m, 'Hé hé hé…', 1300);
    await attendre(1100);
    m.pose('marche');
    await m.allerA(84, 1000);
    m.depose('marche');
    // Patagrain arrive… et marche dessus
    const b = perso(scene, -25);
    const x = (sol.x - H * .11) / W * 100;                  // ses pieds sur la banane
    b.pose('marche');
    await b.allerA(x, 2000);
    b.depose('marche');
    bouger(banane, [{ transform: 'none' }, { transform: 'translate(-14cqw, -16cqh) rotate(-400deg)', offset: .5 }, { transform: 'translate(-24cqw, 0) rotate(-720deg)' }], 900, 'ease-out');
    b.pose('chute expr-choc', 2600);
    await attendre(500);
    m.pose('danse');
    bulle(scene, m, 'HA HA HA !', 1600);
    const etoiles = creer(scene, 'gr-etourdi', '<span></span><span></span><span></span>', `left:calc(${x}cqw - 20cqh);bottom:16cqh`);
    await attendre(600);
    etoiles.style.opacity = 1;
    await attendre(1000);
    etoiles.remove();
    m.depose('danse');
    await attendre(500);
    // Il se relève… furieux
    b.pose('hop', 1300);
    b.expression('mechant');
    await attendre(1300);
    b.pose('menace');
    bulle(scene, b, RIVAL.toUpperCase() + ' !!!', 1500);
    m.expression('choc');
    await attendre(700);
    m.pose('marche');
    m.allerA(125, 900);                                     // il s'enfuit…
    await attendre(500);
    effacer(annonce);
    b.depose('menace');
    b.pose('marche');
    await b.allerA(118, 1700);                              // … et le bouffon lui court après
  }

  // ---------- 2. La tarte à la crème (lancée par Darktagrain) ----------
  const TARTE = `<svg viewBox="0 0 120 70" style="display:block;width:100%;overflow:visible">
    <path d="M8 40 L112 40 L102 64 L18 64 Z" fill="#B97A3E"/><path d="M6 40 L114 40" stroke="#8E5A2A" stroke-width="6" stroke-linecap="round"/>
    <path d="M10 40 C8 22 28 13 42 18 C50 5 72 5 80 16 C95 11 113 22 110 40 Z" fill="#FFF9EE" stroke="#E6D9C2" stroke-width="2"/>
    <circle cx="60" cy="10" r="7" fill="#D6283A"/></svg>`;
  // la crème sur sa figure (dans le dessin de la tête, par-dessus les lunettes), avec la cerise sur le front
  const CREME = `<g class="gr-creme-visage">
    <path fill="#FFF9EE" stroke="#E6D9C2" stroke-width="3" d="M150 200 C140 172 172 160 190 172 C202 150 236 158 242 178 C264 176 270 206 256 222
      C272 240 264 266 249 270 L251 300 C251 311 240 311 240 300 L238 282 C228 293 213 291 206 283 L207 318 C207 329 194 329 194 318 L194 286
      C181 292 166 286 160 273 L158 293 C158 302 147 302 147 293 L146 262 C133 250 135 220 150 200 Z"/>
    <path fill="#fff" opacity=".8" d="M168 190 C180 182 196 186 200 194 C188 192 178 194 168 200 Z"/>
    <circle cx="214" cy="176" r="10" fill="#D6283A"/><circle cx="211" cy="173" r="3" fill="#fff" opacity=".6"/></g>`;
  async function tarte(scene, nom) {
    const annonce = annoncer(scene, 'Tarte à la crème', nom, `arme ${RIVAL} d'une tarte à la crème !`);
    const H = scene.offsetHeight;
    const b = perso(scene, -25), m = rival(scene, 112);
    b.pose('marche'); m.pose('marche');
    await Promise.all([b.allerA(30, 1900), m.allerA(66, 1600)]);
    b.depose('marche'); m.depose('marche');
    b.expression('clin');                                 // tout fier… il ne voit rien venir
    bulle(scene, m, 'Hé hé…', 1100);
    await attendre(1000);
    // Darktagrain lance la tarte, qui s'écrase sur sa figure
    m.pose('lance', 800);
    await attendre(520);
    const visage = centre(b.svg.querySelector('.bf-tete'), scene);
    const t = creer(scene, 'gr-tarte', TARTE);
    await arc(t, main(m, scene), visage, H * .1, 480, -90);
    b.svg.querySelector('.bf-tete').insertAdjacentHTML('beforeend', CREME);
    const creme = b.svg.querySelector('.gr-creme-visage');
    b.expression('choc');
    b.pose('recule ding', 900);
    bouger(t, [{ transform: 'rotate(-90deg)', opacity: 1 }, { transform: 'translate(-3cqh, 30cqh) rotate(-200deg)', opacity: 0 }], 900, 'ease-in').then(() => t.remove());
    await attendre(300);
    m.pose('danse');
    bulle(scene, m, 'HA HA HA !', 1300);
    await attendre(1100);
    m.depose('danse');
    // Il s'essuie les lunettes… la crème part petit à petit
    b.brasDevant();
    b.pose('essuie');
    for (const o of [.65, .35, .12]) {
      await attendre(450);
      bouger(creme, [{ opacity: getComputedStyle(creme).opacity }, { opacity: o }], 400);
    }
    await attendre(500);
    // … il goûte : miam !
    b.depose('essuie');
    b.pose('goute');
    await attendre(600);
    bouger(creme, [{ opacity: .12 }, { opacity: 0 }], 300);
    b.expression('rire');
    bulle(scene, b, 'Miam !');
    await attendre(1200);
    // … ce qui met Darktagrain dans une rage folle
    m.expression('choc');
    m.pose('trepigne');
    bulle(scene, m, 'GRRR !', 1300);
    await attendre(1400);
    m.depose('trepigne');
    m.expression('');
    m.pose('marche');
    m.allerA(125, 1300);
    await attendre(500);
    b.depose('goute');
    effacer(annonce);
    b.pose('marche');
    await b.allerA(118, 2400);
  }

  // ---------- 3. La sérénade ----------
  // le banjo, posé devant lui (dans le dessin, sous les bras) : manche vers la gauche, caisse ronde à peau blanche
  const BANJO = (() => {
    const clous = Array.from({ length: 14 }, (_, i) => {
      const a = i / 14 * Math.PI * 2;
      return `<circle cx="${(232 + 59 * Math.cos(a)).toFixed(1)}" cy="${(505 + 59 * Math.sin(a)).toFixed(1)}" r="3.5" fill="#E2C46A"/>`;
    }).join('');
    return `<g class="gr-banjo"><g transform="rotate(14.5 232 505)">
      <rect x="-40" y="497" width="214" height="16" rx="4" fill="#6B4423"/>
      <rect x="-66" y="491" width="30" height="28" rx="6" fill="#4E3018"/>
      <circle cx="-58" cy="487" r="4.5" fill="#EFE6D0"/><circle cx="-44" cy="487" r="4.5" fill="#EFE6D0"/>
      <circle cx="-58" cy="523" r="4.5" fill="#EFE6D0"/><circle cx="-44" cy="523" r="4.5" fill="#EFE6D0"/>
      <path d="M0 497 V513 M38 497 V513 M74 497 V513 M108 497 V513 M140 497 V513" stroke="#D9C48F" stroke-width="2.5"/></g>
      <circle cx="232" cy="505" r="66" fill="#8A5A2B"/><circle cx="232" cy="505" r="66" fill="none" stroke="#5E3B1A" stroke-width="4"/>
      <circle cx="232" cy="505" r="54" fill="#F4ECD8"/>${clous}
      <g transform="rotate(14.5 232 505)"><rect x="276" y="496" width="12" height="18" rx="3" fill="#B8B8C0"/>
      <rect x="244" y="499" width="5" height="12" rx="1" fill="#6B4423"/>
      <path d="M-38 500 H282 M-38 505 H282 M-38 510 H282" stroke="#F8F8F8" stroke-width="1.6" opacity=".9"/></g></g>`;
  })();
  function note(scene, b, fausse) {
    const tete = centre(b.svg.querySelector('.bf-tete'), scene), H = scene.offsetHeight;
    const n = creer(scene, 'gr-note' + (fausse ? ' fausse' : ''));
    n.textContent = fausse ? 'couac !' : auHasard(['♪', '♫', '♩', '♬']);
    poser(n, tete.x + H * .09, tete.y - H * .02);
    const s = Math.random() < .5 ? -1 : 1;
    bouger(n, [{ opacity: 0, transform: 'none' }, { opacity: 1, transform: `translate(${s * 3}cqh, -8cqh) rotate(${s * 12}deg)`, offset: .25 },
      { opacity: 0, transform: `translate(${8 - s * 2}cqh, -30cqh) rotate(${fausse ? 35 : -s * 15}deg)` }], 1700, 'ease-out').then(() => n.remove());
  }
  async function serenade(scene, nom) {
    const annonce = annoncer(scene, 'La sérénade', nom, 'offre une chanson du bouffon !');
    const H = scene.offsetHeight;
    const b = perso(scene, -25);
    b.svg.querySelector('.bf-epaule-g').insertAdjacentHTML('beforebegin', BANJO);
    b.pose('marche tient-banjo');
    await b.allerA(38, 1900);
    b.depose('marche');
    b.pose('gratte chante');
    let chante = true;
    (async () => { for (let i = 0; chante; i++) { b.expression(i % 2 ? 'choc' : 'rire'); await attendre(420); } })();
    for (let i = 0; i < 12; i++) { note(scene, b, i % 4 === 3); await attendre(330); }
    // Un grelot tombe du ciel… sur sa tête
    const chapeau = centre(b.svg.querySelector('.bf-chapeau'), scene);
    const g = creer(scene, 'gr-grelot');
    poser(g, chapeau.x, chapeau.y - H * .07);
    await bouger(g, [{ transform: `translateY(${-chapeau.y}px)` }, { transform: 'none' }], 600, 'cubic-bezier(.55, 0, 1, .45)');
    chante = false;
    b.depose('gratte chante');
    b.expression('choc');
    b.pose('ding', 900);
    bulle(scene, b, 'BONG !', 1100);
    bouger(g, [{ transform: 'none' }, { transform: 'translate(9cqh, -14cqh) rotate(200deg)', offset: .35 }, { transform: `translate(18cqh, ${H}px) rotate(500deg)` }], 1100, 'ease-out')
      .then(() => g.remove());
    const etoiles = creer(scene, 'gr-etourdi', '<span></span><span></span><span></span>');
    poser(etoiles, chapeau.x, chapeau.y - H * .06);
    etoiles.style.opacity = 1;
    await attendre(1900);
    etoiles.remove();
    b.expression('');
    await attendre(300);
    effacer(annonce);
    b.pose('marche');
    await b.allerA(115, 2200);
  }

  // ---------- 4. Le jet du destin ----------
  const D20 = `<svg viewBox="0 0 100 100" style="display:block;width:100%;overflow:visible">
    <polygon points="50,3 92,27 92,73 50,97 8,73 8,27" fill="#B07A16"/>
    <polygon points="50,3 92,27 78,66 50,22" fill="#C98F1E"/><polygon points="8,27 50,3 50,22 22,66" fill="#D9A23A"/>
    <polygon points="22,66 78,66 50,97" fill="#9C6A10"/>
    <polygon points="50,22 78,66 22,66" fill="var(--accent, #F5B82E)" stroke="#FFE7A8" stroke-width="1.5" stroke-linejoin="round"/>
    <polygon points="50,3 92,27 92,73 50,97 8,73 8,27" fill="none" stroke="#5C3D08" stroke-width="3" stroke-linejoin="round"/>
    <text x="50" y="61" text-anchor="middle" font-size="27" font-weight="900" fill="#3A2606" style="font-family:var(--f-titre)">?</text></svg>`;
  // le pouce levé (caché tant qu'il n'a pas la pose « pouce »), dans le dessin de la main droite
  const POUCE = '<rect class="gr-pouce" x="278" y="548" width="13" height="34" rx="6.5" fill="var(--bouffon-peau, #F0C8A4)" stroke="var(--bouffon-peau-ombre, #DDA982)" stroke-width="2"/>';
  function confettis(scene) {
    const c = creer(scene, 'gr-confettis');
    const teintes = ['var(--primaire)', 'var(--accent)', 'var(--accent-2)', '#E3243B', '#fff'];
    for (let i = 0; i < 46; i++) {
      const s = document.createElement('span');
      s.style.left = (Math.random() * 100) + '%';
      s.style.background = teintes[i % teintes.length];
      c.appendChild(s);
      s.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: `translate(${(Math.random() - .5) * 16}cqh, 112cqh) rotate(${(Math.random() - .5) * 1440}deg)` }],
        { duration: 1800 + Math.random() * 1200, delay: Math.random() * 600, easing: 'cubic-bezier(.3, .2, .7, 1)', fill: 'both' });
    }
    setTimeout(() => c.remove(), 3700);
  }
  async function destin(scene, nom, forcer = {}) {
    const resultat = forcer.de >= 1 && forcer.de <= 20 ? Math.round(forcer.de) : 1 + Math.floor(Math.random() * 20);
    const annonce = annoncer(scene, 'Le jet du destin', nom, 'fait lancer le dé du destin…');
    const H = scene.offsetHeight, T = H * .17, sol = H * .93 - T / 2;
    const b = perso(scene, -25);
    b.svg.querySelector('.bf-coude-d circle').insertAdjacentHTML('afterend', POUCE);
    b.pose('marche');
    await b.allerA(26, 1700);
    b.depose('marche');
    await attendre(300);
    b.pose('lance', 800);
    await attendre(560);
    const depart = main(b, scene);
    const de = creer(scene, 'gr-d20', D20);
    const chiffre = de.querySelector('text');
    let tirage = setInterval(() => { chiffre.textContent = 1 + Math.floor(Math.random() * 20); }, 90);
    if (resultat === 1) {
      // Échec critique : il retombe… sur son pied
      const pied = centre(b.svg.querySelector('.bf-genou-d .bf-soulier'), scene);
      await arc(de, depart, { x: pied.x, y: pied.y - T * .45 }, H * .5, 1300, 1080);
      clearInterval(tirage); chiffre.textContent = 1;
      de.classList.add('echec');
      b.pose('aie chapeau-yeux');
      b.expression('choc');
      bulle(scene, b, 'AÏE AÏE AÏE !', 2200);
      annonce.titre('Échec critique !');
      annonce.texte('fait 1 au dé du destin…');
      arc(de, { x: pied.x, y: pied.y - T * .45 }, { x: pied.x + H * .4, y: sol }, H * .18, 700, 360);
      await attendre(2800);
      b.depose('aie chapeau-yeux');
    } else {
      await arc(de, depart, { x: depart.x + H * .5, y: sol }, H * .5, 1300, 1080);
      clearInterval(tirage); chiffre.textContent = resultat;
      bouger(de, [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: .4 }, { transform: 'scale(1)' }], 450, 'ease-out');
      if (resultat === 20) {
        de.classList.add('critique');
        annonce.titre('Réussite critique !');
        annonce.texte('fait 20 au dé du destin !');
        confettis(scene);
        b.expression('rire');
        b.pose('danse');
        await attendre(3000);
        b.depose('danse');
      } else if (resultat > 10) {
        annonce.texte(`fait ${resultat} au dé du destin. Pas mal !`);
        b.expression('clin');
        b.pose('pouce');
        await attendre(2200);
        b.depose('pouce');
      } else {
        annonce.texte(`fait ${resultat} au dé du destin. Bof…`);
        b.pose('haussement');
        await attendre(2000);
        b.depose('haussement');
      }
    }
    b.expression('');
    effacer(de);
    effacer(annonce);
    b.pose('marche');
    await b.allerA(115, 2000);
  }

  // ---------- 5. La potion mystère ----------
  // la fiole, tenue par le goulot (dans le dessin de la main droite, sous les doigts)
  const FIOLE = `<g class="gr-fiole"><rect x="276" y="532" width="16" height="56" rx="4" fill="#CFE6EE" stroke="#7FA6B4" stroke-width="2"/>
    <rect x="278" y="584" width="12" height="14" rx="3" fill="#A0703A"/>
    <circle cx="284" cy="508" r="32" fill="#CFE6EE" stroke="#7FA6B4" stroke-width="2.5"/><circle cx="284" cy="508" r="25" fill="#9B4BD8"/>
    <circle cx="274" cy="500" r="5" fill="#fff" opacity=".7"/><circle cx="292" cy="516" r="3" fill="#fff" opacity=".5"/></g>`;
  const EFFETS = {                                          // titre de l'annonce, cri du bouffon
    geant: ['Potion de géant !', 'HO HO HO !'],
    minuscule: ['Potion de rétrécissement !', 'hi hi hi !'],
    vert: ['Potion… de crapaud ?', 'Beurk !'],
    ballon: ['Potion de légèreté !', 'Au secours !']
  };
  async function potion(scene, nom, forcer = {}) {
    const effet = EFFETS[forcer.effet] ? forcer.effet : auHasard(Object.keys(EFFETS));
    const annonce = annoncer(scene, 'La potion mystère', nom, 'fait boire une potion au bouffon…');
    const H = scene.offsetHeight;
    const b = perso(scene, -25);
    b.corps.classList.add('gr-effet');
    b.svg.querySelector('.bf-coude-d circle').insertAdjacentHTML('beforebegin', FIOLE);
    b.pose('marche tient-fiole');
    await b.allerA(38, 1900);
    b.depose('marche');
    b.expression('clin');
    await attendre(800);
    b.brasDevant();
    b.depose('tient-fiole');
    b.pose('boit');
    await attendre(500);
    bulle(scene, b, 'glou glou…', 1300);
    await attendre(1300);
    b.svg.querySelector('.gr-fiole').remove();
    b.depose('boit');
    b.expression('choc');
    await attendre(600);
    // L'effet, tiré au sort
    const [titre, cri] = EFFETS[effet];
    annonce.titre(titre);
    if (effet === 'geant') {
      await bouger(b.corps, [{ transform: 'none' }, { transform: 'scale(1.75)', offset: .7 }, { transform: 'scale(1.6)' }], 800, 'ease-out');
      b.expression('rire');
      b.pose('hop', 1300);
    } else if (effet === 'minuscule') {
      await bouger(b.corps, [{ transform: 'none' }, { transform: 'scale(.32)', offset: .7 }, { transform: 'scale(.4)' }], 700, 'ease-in');
      b.pose('hop', 1300);
    } else if (effet === 'vert') {
      b.corps.classList.add('gr-vert');
      bouger(b.corps, [{ transform: 'none' }, { transform: 'translateX(-1cqh)' }, { transform: 'translateX(1cqh)' }, { transform: 'translateX(-1cqh)' }, { transform: 'none' }], 500);
    } else {
      b.pose('ballon');
      bouger(b.corps, [{ transform: 'none' }, { transform: 'translateY(-36cqh) scale(1.1, 1.05)' }], 2000, 'ease-in-out');
    }
    await attendre(400);
    bulle(scene, b, cri, 1600);
    await attendre(2000);
    // Pouf ! Tout redevient normal
    const c = centre(b.svg.querySelector('.bf-tete'), scene);
    fumee(scene, `${c.x - H * .17}px`, `${H - c.y - H * .22}px`);
    await attendre(350);
    b.corps.getAnimations().forEach(a => a.cancel());
    b.corps.classList.remove('gr-vert');
    b.depose('ballon');
    b.expression('rire');
    await attendre(900);
    b.expression('');
    effacer(annonce);
    b.pose('marche');
    await b.allerA(115, 2200);
  }

  // ---------- 6. Pierre, feuille, ciseaux contre Darktagrain ----------
  const SYMBOLES = {
    pierre: `<svg viewBox="0 0 100 100"><path d="M16 70 C8 52 20 30 40 26 C54 12 78 20 84 38 C96 50 92 76 72 82 C56 90 28 88 16 70 Z" fill="#9AA0A8" stroke="#5E646C" stroke-width="4"/>
      <path d="M38 42 C46 36 56 38 60 44 M60 66 C66 63 72 64 76 69" stroke="#5E646C" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
    feuille: `<svg viewBox="0 0 100 100"><path d="M24 10 H68 L80 22 V90 H24 Z" fill="#F4ECD8" stroke="#A88B5A" stroke-width="4" stroke-linejoin="round"/>
      <path d="M34 34 H70 M34 48 H70 M34 62 H70 M34 76 H58" stroke="#A88B5A" stroke-width="4" stroke-linecap="round"/></svg>`,
    ciseaux: `<svg viewBox="0 0 100 100"><path d="M40 62 L86 10 M60 62 L14 10" stroke="#B8BEC6" stroke-width="9" stroke-linecap="round"/>
      <circle cx="33" cy="76" r="13" fill="none" stroke="#D6283A" stroke-width="7"/><circle cx="67" cy="76" r="13" fill="none" stroke="#D6283A" stroke-width="7"/>
      <circle cx="50" cy="44" r="4.5" fill="#5E646C"/></svg>`
  };
  const BAT = { pierre: 'ciseaux', feuille: 'pierre', ciseaux: 'feuille' };            // la pierre bat les ciseaux…
  function crier(scene, mot, x = scene.offsetWidth / 2, y = scene.offsetHeight * .32) {   // « Chi… fou… mi ! » (au milieu de l'écran)
    const el = creer(scene, 'gr-compte');
    el.textContent = mot;
    poser(el, x, y);
    bouger(el, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1.15)', offset: .3 }, { opacity: 1, transform: 'none', offset: .7 }, { opacity: 0, transform: 'scale(.9)' }], 600)
      .then(() => el.remove());
  }
  function symbole(scene, p, nom) {                       // la main jouée, dans un rond au-dessus de sa tête
    const tete = centre(p.svg.querySelector('.bf-tete'), scene);
    const el = creer(scene, 'gr-symbole', SYMBOLES[nom]);
    poser(el, tete.x, tete.y - scene.offsetHeight * .26);
    bouger(el, [{ opacity: 0, transform: 'scale(.3) rotate(-30deg)' }, { opacity: 1, transform: 'scale(1.15)', offset: .6 }, { opacity: 1, transform: 'none' }], 400, 'ease-out');
    return el;
  }
  async function chifoumi(scene, nom, forcer = {}) {
    const annonce = annoncer(scene, 'Pierre, feuille, ciseaux', nom, `défie ${RIVAL} au chifoumi !`);
    const b = perso(scene, -25), m = rival(scene, 112);
    b.pose('marche'); m.pose('marche');
    await Promise.all([b.allerA(27, 1800), m.allerA(61, 1500)]);
    b.depose('marche'); m.depose('marche');
    await attendre(300);
    let fin;
    for (let manche = 1; ; manche++) {
      b.pose('chifoumi', 1350); m.pose('chifoumi', 1350);
      for (const mot of ['Chi…', 'fou…', 'MI !']) { crier(scene, mot); await attendre(450); }
      // le résultat : tiré au sort (au bout de deux égalités, il y a forcément un gagnant)
      fin = manche === 1 && forcer.chifoumi ? forcer.chifoumi : auHasard(manche < 3 ? ['gagne', 'perd', 'egalite'] : ['gagne', 'perd']);
      const jeuB = auHasard(Object.keys(SYMBOLES));
      const jeuM = fin === 'gagne' ? BAT[jeuB] : fin === 'perd' ? Object.keys(BAT).find(k => BAT[k] === jeuB) : jeuB;
      b.pose('montre-main'); m.pose('montre-main');
      const sb = symbole(scene, b, jeuB), sm = symbole(scene, m, jeuM);
      await attendre(1100);
      if (fin !== 'egalite') { (fin === 'gagne' ? sm : sb).classList.add('perdant'); break; }
      // Égalité : on rejoue
      crier(scene, 'Égalité !');
      b.depose('montre-main'); m.depose('montre-main');
      b.pose('haussement', 1100); m.pose('haussement', 1100);
      await attendre(1300);
      sb.remove(); sm.remove();
    }
    if (fin === 'gagne') {
      annonce.titre(HEROS + ' gagne !');
      b.depose('montre-main'); m.depose('montre-main');
      b.expression('rire'); b.pose('danse');
      m.expression('choc'); m.pose('trepigne');
      bulle(scene, m, 'GRRR !', 1500);
      await attendre(1700);
      m.depose('trepigne'); m.expression('');
      m.pose('marche');
      m.allerA(125, 1000);
      await attendre(800);
      b.depose('danse');
    } else {
      annonce.titre(RIVAL + ' gagne…');
      b.depose('montre-main'); m.depose('montre-main');
      m.pose('danse');
      bulle(scene, m, 'HA HA HA !', 1600);
      b.expression('mechant'); b.pose('boude');
      await attendre(2200);
      m.depose('danse');
      m.pose('marche');
      m.allerA(125, 1300);
      await attendre(900);
      b.depose('boude');
    }
    b.expression('');
    scene.querySelectorAll('.gr-symbole').forEach(effacer);
    effacer(annonce);
    b.pose('marche');
    await b.allerA(118, 2200);
  }

  // ---------- 7. Le coffre au trésor ----------
  // fermé : le couvercle bombé ; ouvert : le couvercle relevé derrière, et l'intérieur qui brille
  const COFFRE = `<svg viewBox="0 0 200 160">
    <g class="cf-lueur"><path d="M22 78 V26 C22 8 60 -2 100 -2 C140 -2 178 8 178 26 V78 Z" fill="#5E3B1A" stroke="#3E2610" stroke-width="5" stroke-linejoin="round"/>
      <path d="M48 78 V4 M152 78 V4" stroke="#A8862E" stroke-width="14"/></g>
    <rect x="16" y="72" width="168" height="80" rx="8" fill="#8A5A2B" stroke="#5E3B1A" stroke-width="5"/>
    <rect x="18" y="74" width="164" height="12" fill="#6B4423"/>
    <rect x="40" y="74" width="16" height="76" fill="#C9A23A"/><rect x="144" y="74" width="16" height="76" fill="#C9A23A"/>
    <rect x="86" y="84" width="28" height="30" rx="4" fill="#E2C46A" stroke="#8E6A14" stroke-width="3"/>
    <circle cx="100" cy="96" r="4" fill="#3A2606"/><rect x="98" y="98" width="4" height="9" fill="#3A2606"/>
    <g class="cf-lueur"><ellipse cx="100" cy="76" rx="82" ry="11" fill="#2A1A0A"/><ellipse cx="100" cy="76" rx="66" ry="7" fill="#FFE79A"/></g>
    <g class="cf-couvercle"><path d="M16 74 V46 C16 20 60 10 100 10 C140 10 184 20 184 46 V74 Z" fill="#9C6A34" stroke="#5E3B1A" stroke-width="5" stroke-linejoin="round"/>
      <path d="M48 74 V16 M152 74 V16" stroke="#C9A23A" stroke-width="16"/></g></svg>`;
  const OBJETS = {
    couronne: `<svg viewBox="0 0 100 100" style="overflow:visible"><path d="M14 76 L8 30 L32 50 L50 16 L68 50 L92 30 L86 76 Z" fill="#F5B82E" stroke="#8E6A14" stroke-width="4" stroke-linejoin="round"/>
      <rect x="12" y="72" width="76" height="15" rx="3" fill="#E0A21E" stroke="#8E6A14" stroke-width="4"/>
      <circle cx="50" cy="60" r="7" fill="#D6283A"/><circle cx="29" cy="64" r="5" fill="#3B82C4"/><circle cx="71" cy="64" r="5" fill="#3B82C4"/>
      <circle cx="8" cy="28" r="5" fill="#F5B82E" stroke="#8E6A14" stroke-width="3"/><circle cx="50" cy="13" r="5" fill="#F5B82E" stroke="#8E6A14" stroke-width="3"/>
      <circle cx="92" cy="28" r="5" fill="#F5B82E" stroke="#8E6A14" stroke-width="3"/></svg>`,
    chope: `<svg viewBox="0 0 100 100"><path d="M68 42 C90 42 90 76 68 76" fill="none" stroke="#5E3B1A" stroke-width="9"/>
      <rect x="20" y="30" width="50" height="60" rx="6" fill="#B07A3E" stroke="#5E3B1A" stroke-width="4"/>
      <path d="M20 46 H70 M20 76 H70" stroke="#5E3B1A" stroke-width="4"/>
      <path d="M16 36 C14 18 32 14 40 22 C46 10 66 12 68 24 C80 22 82 36 72 38 Z" fill="#FFF9EE" stroke="#E6D9C2" stroke-width="3"/></svg>`,
    fromage: `<svg viewBox="0 0 100 100"><polygon points="6,74 84,30 96,40 18,82" fill="#F7DC7A" stroke="#B8901C" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="18,82 96,40 96,74 18,92" fill="#F2C94C" stroke="#B8901C" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="44" cy="76" r="6" fill="#D9AE2E"/><circle cx="70" cy="64" r="4" fill="#D9AE2E"/><circle cx="82" cy="72" r="3" fill="#D9AE2E"/></svg>`,
    chaussette: `<svg viewBox="0 0 100 100"><path d="M36 8 H62 V54 C62 62 66 66 74 68 C90 72 92 92 76 92 H40 C28 92 24 82 28 72 C34 60 36 56 36 48 Z" fill="#C9C2B0" stroke="#7E7764" stroke-width="4" stroke-linejoin="round"/>
      <rect x="36" y="8" width="26" height="10" fill="#A85050"/><circle cx="70" cy="84" r="4.5" fill="#5E5848"/><circle cx="44" cy="44" r="3" fill="#5E5848"/></svg>`,
    poisson: `<svg viewBox="0 0 100 100"><path d="M76 50 L96 32 L96 68 Z" fill="#8FA3A0" stroke="#4E625E" stroke-width="4" stroke-linejoin="round"/>
      <path d="M8 50 C28 24 62 24 78 50 C62 76 28 76 8 50 Z" fill="#8FA3A0" stroke="#4E625E" stroke-width="4"/>
      <path d="M22 42 L30 50 M30 42 L22 50" stroke="#2A2A2A" stroke-width="3" stroke-linecap="round"/>
      <path d="M46 40 V60 M56 40 V60 M66 42 V58" stroke="#4E625E" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg>`
  };
  const TRESORS = [                                       // rareté, ce que dit l'annonce, ce que dit le bouffon
    { id: 'couronne', rarete: 'legendaire', nom: 'la couronne du roi' },
    { id: 'epee', rarete: 'legendaire', nom: "l'épée légendaire" },
    { id: 'chope', rarete: 'commun', nom: 'une chope de cervoise', cri: 'Pas mal !' },
    { id: 'fromage', rarete: 'commun', nom: 'un gros fromage', cri: 'Pas mal !' },
    { id: 'chaussette', rarete: 'nul', nom: 'une vieille chaussette', cri: 'Pouah !' },
    { id: 'poisson', rarete: 'nul', nom: 'un poisson pas frais', cri: 'Beurk !' }
  ];
  const RARETES = { legendaire: ['Légendaire !', 20], commun: ['Commun', 45], nul: ['Nul…', 35] };   // titre, chances sur 100
  function tirerTresor(forcer) {
    const force = TRESORS.find(t => t.id === forcer.tresor);
    if (force) return force;
    let n = Math.random() * 100, rarete = 'nul';
    for (const [r, [, chances]] of Object.entries(RARETES)) { if (n < chances) { rarete = r; break; } n -= chances; }
    return auHasard(TRESORS.filter(t => t.rarete === rarete));
  }
  async function coffre(scene, nom, forcer = {}) {
    const tresor = tirerTresor(forcer);
    const annonce = annoncer(scene, 'Le coffre au trésor', nom, 'offre un coffre au bouffon !');
    const H = scene.offsetHeight;
    // Le coffre tombe du ciel
    const c = creer(scene, 'gr-coffre', COFFRE, 'left:55cqw;bottom:7cqh');
    bouger(c, [{ transform: 'translateY(-110cqh)' }, { transform: 'none', offset: .75 }, { transform: 'translateY(-3cqh)', offset: .88 }, { transform: 'none' }], 800, 'ease-in');
    const b = perso(scene, -25);
    b.svg.querySelector('.bf-coude-d circle').insertAdjacentHTML('afterend', POUCE);
    b.pose('marche');
    await b.allerA(37, 1900);
    b.depose('marche');
    b.expression('clin');
    b.pose('frotte');
    await attendre(1100);
    b.depose('frotte');
    c.classList.add('secoue');
    await attendre(720);
    c.classList.remove('secoue');
    c.classList.add('ouvert');
    // L'objet sort du coffre (avec des rayons de lumière s'il est légendaire)
    const cc = centre(c, scene), haut = { x: cc.x, y: cc.y - H * .3 };
    let rayons;
    if (tresor.rarete === 'legendaire') {
      rayons = creer(scene, 'gr-rayons');
      poser(rayons, haut.x, haut.y);
      bouger(rayons, [{ opacity: 0 }, { opacity: 1 }], 600);
    }
    const o = creer(scene, 'gr-objet', tresor.id === 'epee' ? `<img src="${Grelots.chemin}assets/epee.svg" alt="">` : OBJETS[tresor.id]);
    if (tresor.id === 'epee') o.style.width = '6cqh';
    poser(o, haut.x, haut.y);
    await bouger(o, [{ transform: `translateY(${H * .3}px) scale(.3)`, opacity: 0 }, { transform: 'translateY(-2cqh) scale(1.15)', opacity: 1, offset: .7 }, { transform: 'none', opacity: 1 }], 900, 'ease-out');
    const etiquette = creer(scene, 'gr-rarete ' + tresor.rarete);
    etiquette.textContent = { legendaire: 'Légendaire', commun: 'Commun', nul: 'Nul' }[tresor.rarete];
    poser(etiquette, haut.x, haut.y + H * .12);
    bouger(etiquette, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }], 300, 'cubic-bezier(.34,1.56,.64,1)');
    annonce.titre(RARETES[tresor.rarete][0]);
    annonce.texte(`fait trouver ${tresor.nom} au bouffon !`);
    if (tresor.rarete === 'legendaire') {
      confettis(scene);
      b.expression('rire');
      b.pose('danse');
      await attendre(3000);
      b.depose('danse');
    } else if (tresor.rarete === 'commun') {
      b.pose('pouce');
      bulle(scene, b, tresor.cri, 1600);
      await attendre(2200);
      b.depose('pouce');
    } else {
      // ça sent mauvais…
      const odeur = creer(scene, 'gr-odeur', '≈ ≈ ≈');
      poser(odeur, haut.x, haut.y - H * .1);
      bouger(odeur, [{ opacity: 0, transform: 'none' }, { opacity: 1, transform: 'translateY(-3cqh)', offset: .3 }, { opacity: 0, transform: 'translateY(-10cqh)' }], 2000)
        .then(() => odeur.remove());
      b.expression('choc');
      b.pose('haussement');
      bulle(scene, b, tresor.cri, 1600);
      await attendre(2200);
      b.depose('haussement');
    }
    b.expression('');
    [o, etiquette, c, rayons].filter(Boolean).forEach(effacer);
    effacer(annonce);
    b.pose('marche');
    await b.allerA(118, 2200);
  }

  // ---------- 8. La catapulte : pile ou face, puis un atterrissage au hasard ----------
  // pile : Patagrain envoie Darktagrain ; face : Darktagrain envoie Patagrain
  const CATAPULTE = `<svg viewBox="0 0 300 200">
    <path d="M200 150 L176 52 M232 150 L192 52" stroke="#6B4423" stroke-width="12" stroke-linecap="round"/>
    <rect x="160" y="42" width="46" height="14" rx="4" fill="#8A5A2B" stroke="#5E3B1A" stroke-width="3"/>
    <rect x="30" y="146" width="240" height="18" rx="5" fill="#8A5A2B" stroke="#5E3B1A" stroke-width="4"/>
    <path d="M116 150 L150 106 L184 150" stroke="#6B4423" stroke-width="14" fill="none" stroke-linejoin="round"/>
    <g class="cp-bras"><path d="M150 110 L34 168" stroke="#9C6A34" stroke-width="12" stroke-linecap="round"/>
      <path d="M6 154 Q30 198 60 158 Z" fill="#6B4423" stroke="#3E2610" stroke-width="4" stroke-linejoin="round"/></g>
    <circle cx="150" cy="110" r="11" fill="#C9A23A" stroke="#8E6A14" stroke-width="3"/>
    <circle cx="72" cy="176" r="20" fill="#6B4423" stroke="#3E2610" stroke-width="5"/><circle cx="72" cy="176" r="5" fill="#C9A23A"/>
    <circle cx="228" cy="176" r="20" fill="#6B4423" stroke="#3E2610" stroke-width="5"/><circle cx="228" cy="176" r="5" fill="#C9A23A"/></svg>`;
  const DECORS = {
    foin: `<svg viewBox="0 0 200 130"><path d="M6 130 C14 56 56 14 100 14 C144 14 186 56 194 130 Z" fill="#E2B84A" stroke="#B8901C" stroke-width="5" stroke-linejoin="round"/>
      <path d="M40 120 L52 70 M70 124 L76 50 M100 126 L100 34 M130 124 L124 50 M160 120 L148 70 M28 96 L18 84 M172 96 L184 82 M96 18 L88 2 M108 18 L118 4"
        stroke="#B8901C" stroke-width="4" stroke-linecap="round"/></svg>`,
    bouse: `<svg viewBox="0 0 160 70"><path d="M6 66 C4 44 30 36 44 38 C50 20 102 14 112 34 C134 30 156 46 154 66 Z" fill="#6B4A2B" stroke="#4A3018" stroke-width="4"/>
      <path d="M40 42 C48 26 92 22 102 38 C90 34 56 34 40 42 Z" fill="#7E5A36"/><circle cx="76" cy="24" r="11" fill="#7E5A36" stroke="#4A3018" stroke-width="3"/></svg>`,
    eau: `<svg viewBox="0 0 300 70"><ellipse cx="150" cy="35" rx="146" ry="31" fill="#4A90C8" stroke="#2F6C9C" stroke-width="5"/>
      <ellipse cx="110" cy="26" rx="60" ry="8" fill="#8CC8F0" opacity=".6"/></svg>`,
    // le bord de devant de l'eau (par-dessus le bouffon, pour cacher la ligne où il « entre » dans l'eau)
    bord: `<svg viewBox="0 0 300 70" preserveAspectRatio="none"><path d="M4 35 C30 62 270 62 296 35 C280 72 20 72 4 35 Z" fill="#2F6C9C"/></svg>`,
    lac: `<svg viewBox="0 0 600 110"><ellipse cx="300" cy="55" rx="296" ry="51" fill="#4A90C8" stroke="#2F6C9C" stroke-width="5"/>
      <ellipse cx="200" cy="40" rx="120" ry="10" fill="#8CC8F0" opacity=".55"/>
      <path d="M20 60 L16 10 M30 62 L34 18 M574 60 L570 14 M584 58 L590 22" stroke="#3C6E47" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="16" cy="12" rx="5" ry="12" fill="#7A4E36"/><ellipse cx="590" cy="22" rx="5" ry="12" fill="#7A4E36"/></svg>`,
    taverne: `<svg viewBox="0 0 300 280">
      <rect x="30" y="110" width="240" height="170" fill="#8A5A2B" stroke="#5E3B1A" stroke-width="5"/>
      <path d="M30 150 H270 M30 190 H270 M30 230 H270" stroke="#6B4423" stroke-width="4"/>
      <polygon points="8,120 150,18 292,120" fill="#7A2E2E" stroke="#4E1A1A" stroke-width="6" stroke-linejoin="round"/>
      <path d="M50 104 L150 34 L250 104" stroke="#5E2020" stroke-width="4" fill="none"/>
      <polygon class="tv-trou" points="122,40 140,30 166,38 176,58 150,70 126,62" fill="#1E0E0E"/>
      <rect x="78" y="122" width="144" height="28" rx="4" fill="#C9A23A" stroke="#8E6A14" stroke-width="3"/>
      <text x="150" y="143" text-anchor="middle" font-size="20" font-weight="900" fill="#3A2606" style="font-family:var(--f-titre)">TAVERNE</text>
      <rect x="48" y="166" width="54" height="44" rx="4" fill="#FFD27A" stroke="#5E3B1A" stroke-width="5"/><path d="M75 166 V210 M48 188 H102" stroke="#5E3B1A" stroke-width="4"/>
      <rect x="198" y="166" width="54" height="44" rx="4" fill="#FFD27A" stroke="#5E3B1A" stroke-width="5"/><path d="M225 166 V210 M198 188 H252" stroke="#5E3B1A" stroke-width="4"/>
      <path d="M124 280 V214 C124 196 176 196 176 214 V280 Z" fill="#4E3018" stroke="#3E2610" stroke-width="4"/><circle cx="166" cy="244" r="4" fill="#C9A23A"/></svg>`,
    fissures: `<svg viewBox="0 0 400 400"><g stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".9">
      <path d="M200 200 L240 150 L262 156 L300 96 L330 40"/><path d="M200 200 L150 160 L140 120 L96 90 L60 30"/><path d="M200 200 L260 214 L300 260 L370 280"/>
      <path d="M200 200 L176 250 L184 290 L150 360"/><path d="M200 200 L120 210 L80 250 L20 260"/><path d="M200 200 L222 262 L260 300 L270 380"/>
      <path d="M240 150 C226 176 214 186 200 200 M150 160 C176 170 190 186 200 200 M260 214 C232 210 214 204 200 200 M176 250 C186 230 194 214 200 200"/></g>
      <circle cx="200" cy="200" r="10" fill="#fff" opacity=".8"/></svg>`
  };
  // une Dame du Lac : une sirène (longs cheveux, coquillages), dans l'eau jusqu'à la taille ; et le bout de sa queue qui dépasse
  const SIRENE = (cheveux, coquillage) => `<svg viewBox="0 0 120 160">
    <path d="M60 16 C26 16 16 46 19 80 C21 110 12 132 8 152 L112 152 C108 132 99 110 101 80 C104 46 94 16 60 16 Z" fill="${cheveux}"/>
    <path d="M32 152 C32 120 44 108 60 108 C76 108 88 120 88 152 Z" fill="#F2C9A6"/>
    <rect x="53" y="86" width="14" height="26" fill="#E4B590"/>
    <ellipse cx="60" cy="64" rx="22" ry="25" fill="#F2C9A6"/>
    <path d="M38 50 C42 30 78 30 82 50 C74 38 46 38 38 50 Z" fill="${cheveux}"/>
    <ellipse cx="51" cy="64" rx="3.4" ry="4" fill="#2A2A2A"/><ellipse cx="69" cy="64" rx="3.4" ry="4" fill="#2A2A2A"/>
    <circle cx="52.2" cy="62.6" r="1.2" fill="#fff"/><circle cx="70.2" cy="62.6" r="1.2" fill="#fff"/>
    <path d="M45 59 L43 56 M48 58 L47 55 M75 59 L77 56 M72 58 L73 55" stroke="#2A2A2A" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="44" cy="72" r="4" fill="#F29BAA" opacity=".6"/><circle cx="76" cy="72" r="4" fill="#F29BAA" opacity=".6"/>
    <path d="M53 77 Q60 83 67 77" stroke="#D9506E" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M40 42 C26 66 30 110 36 152 L46 152 C42 116 40 74 49 46 Z" fill="${cheveux}"/>
    <path d="M80 42 C94 66 90 110 84 152 L74 152 C78 116 80 74 71 46 Z" fill="${cheveux}"/>
    <path d="M42 138 L50 120 L58 138 Q50 143 42 138 Z M62 138 L70 120 L78 138 Q70 143 62 138 Z" fill="${coquillage}" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/>
    <path d="M50 122 V138 M46 130 L50 122 L54 130 M70 122 V138 M66 130 L70 122 L74 130" stroke="rgba(0,0,0,.18)" stroke-width="1.2" fill="none"/>
    <path d="M40 34 L43 28 L46 34 L52 35 L47 39 L49 45 L43 41 L37 45 L39 39 L34 35 Z" fill="#F5B82E"/>
    <rect x="0" y="148" width="120" height="12" fill="#4A90C8"/></svg>`;
  const NAGEOIRE = couleur => `<svg viewBox="0 0 60 50"><path d="M30 50 C30 32 24 20 6 8 C20 8 28 16 30 24 C32 16 40 8 54 8 C36 20 30 32 30 50 Z" fill="${couleur}" stroke="rgba(0,0,0,.25)" stroke-width="2"/></svg>`;
  const ATTERRISSAGES = ['pieds', 'foin', 'vitre', 'eau', 'bouse', 'lac', 'taverne'];
  function piece(scene, resultat) {                        // la pièce lancée en l'air, qui retombe sur « resultat »
    const H = scene.offsetHeight;
    const p = creer(scene, 'gr-piece');
    poser(p, scene.offsetWidth / 2, H * .55);
    let cote = 0;
    const tourne = setInterval(() => { p.textContent = ++cote % 2 ? 'FACE' : 'PILE'; }, 110);
    p.textContent = 'PILE';
    const images = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      images.push({ transform: `translateY(${-H * .25 * 4 * t * (1 - t)}px) scaleX(${i === 16 ? 1 : Math.abs(Math.cos(t * Math.PI * 7))})` });
    }
    return bouger(p, images, 1500, 'linear').then(() => {
      clearInterval(tourne);
      p.textContent = resultat.toUpperCase();
      bouger(p, [{ transform: 'scale(1)' }, { transform: 'scale(1.35)', offset: .4 }, { transform: 'scale(1)' }], 450, 'ease-out');
      return p;
    });
  }
  async function catapulte(scene, nom, forcer = {}) {
    const resultat = ['pile', 'face'].includes(forcer.piece) ? forcer.piece : auHasard(['pile', 'face']);
    const atterrissage = ATTERRISSAGES.includes(forcer.atterrissage) ? forcer.atterrissage : auHasard(ATTERRISSAGES);
    const annonce = annoncer(scene, 'La catapulte', nom, 'sort la catapulte… pile ou face ?');
    const W = scene.offsetWidth, H = scene.offsetHeight;
    const b = perso(scene, -25), m = rival(scene, 112);
    b.pose('marche'); m.pose('marche');
    await Promise.all([b.allerA(30, 1700), m.allerA(56, 1400)]);
    b.depose('marche'); m.depose('marche');
    // Pile ou face
    const p = await piece(scene, resultat);
    const [lanceur, volant] = resultat === 'pile' ? [b, m] : [m, b];
    const nomVolant = volant === b ? HEROS : RIVAL;
    annonce.texte(`fait voler ${nomVolant} !`);
    annonce.titre(resultat === 'pile' ? `Pile : ${HEROS} envoie ${RIVAL} !` : `Face : ${RIVAL} envoie ${HEROS} !`);
    lanceur.pose('danse', 1200);
    volant.expression('choc');
    await attendre(1300);
    effacer(p);
    // La catapulte arrive ; celui qui vole grimpe dans le godet
    const L = W * .07, u = H * .62 / 300, haut = H * .93 - 200 * u;
    const c = creer(scene, 'gr-catapulte', CATAPULTE, `left:${L}px;bottom:7cqh`);
    const bras = c.querySelector('.cp-bras');
    bouger(c, [{ transform: 'translateX(-70cqh)' }, { transform: 'none' }], 900, 'ease-out');
    const ecran = (x, y) => ({ x: L + x * u, y: haut + y * u });          // unités du dessin → px de la scène
    const godet = deg => { const a = deg * Math.PI / 180, vx = -118, vy = 52;
      return ecran(150 + vx * Math.cos(a) - vy * Math.sin(a), 110 + vx * Math.sin(a) + vy * Math.cos(a)); };
    // position d'un perso par son centre (cx, cy), tourné de r, grossi de s
    const vers = (cx, cy, r = 0, s = 1) => `translate(${cx - H * .1}px, ${cy - H * .7}px) rotate(${r}deg) scale(${s})`;
    const g0 = godet(0);
    volant.pose('marche'); lanceur.pose('marche');
    await Promise.all([volant.allerA((g0.x - H * .1) / W * 100, 1200), lanceur.allerA((ecran(286, 0).x - H * .1) / W * 100, 1200)]);
    volant.depose('marche'); lanceur.depose('marche');
    volant.pose('hop', 600);
    await bouger(volant, [{ transform: vers(g0.x, H * .7) }, { transform: vers(g0.x, g0.y - H * .23 - H * .1) }, { transform: vers(g0.x, g0.y - H * .23) }], 500, 'ease-out');
    bulle(scene, volant, volant === b ? 'Euh… attends…' : 'Non, non, NON !', 1300);
    await attendre(900);
    lanceur.pose('lance', 800);
    bulle(scene, lanceur, 'Bon vol !', 1200);
    await attendre(450);
    // Le lancer : le bras de la catapulte bascule… et il s'envole
    const SWING = 320, VOL = 1300, tot = SWING + VOL, fin = SWING / tot;
    bouger(bras, [{ transform: 'rotate(0)' }, { transform: 'rotate(118deg)', offset: .8 }, { transform: 'rotate(110deg)' }], SWING + 150, 'ease-in');
    volant.pose('vole');
    const g1 = godet(118);
    const arrivees = {
      pieds: [W * .72, H * .7, 720, 1], foin: [W * .72, H * .75, 900, 1], vitre: [W * .5, H * .5, 0, 2.6],
      eau: [W * .72, H * .7, 720, 1], bouse: [W * .72, H * .7, 720, 1], lac: [W * .74, H * .63, 720, 1], taverne: [W * .56 + H * .26, H * .93 - H * .38, 540, 1]
    };
    const [ax, ay, ar, as] = arrivees[atterrissage];
    const images = [];
    for (let i = 0; i <= 6; i++) { const g = godet(118 * i / 6); images.push({ transform: vers(g.x, g.y - H * .23, 50 * i / 6), offset: fin * i / 6 }); }
    const sommet = atterrissage === 'vitre' ? H * .1 : H * .22;
    for (let i = 1; i <= 16; i++) {
      const t = i / 16, x = g1.x + (ax - g1.x) * t, y = (g1.y - H * .23) + (ay - (g1.y - H * .23)) * t - sommet * 4 * t * (1 - t);
      images.push({ transform: vers(x, y, 50 + (ar - 50) * t, 1 + (as - 1) * t), offset: fin + (1 - fin) * t });
    }
    // le décor d'arrivée apparaît pendant le vol
    let decor, bord;
    const decorer = (quoi, x, bas, largeur, z = 1) => { const d = creer(scene, 'gr-decor', DECORS[quoi], `left:${x - largeur / 2}px;bottom:${bas};width:${largeur}px;z-index:${z}`);
      bouger(d, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], 400, 'cubic-bezier(.34,1.56,.64,1)'); return d; };
    volant.style.zIndex = 3;
    if (atterrissage === 'foin') decor = decorer('foin', W * .72, '7cqh', H * .36, 4);
    if (atterrissage === 'bouse') decor = decorer('bouse', W * .72, '6cqh', H * .3, 4);
    if (atterrissage === 'eau') { decor = decorer('eau', W * .72, '4cqh', H * .5); bord = decorer('bord', W * .72, '4cqh', H * .5, 4); }
    let dames = [];                                       // les sirènes (et leurs nageoires)
    if (atterrissage === 'lac') {
      decor = decorer('lac', W * .74, '2cqh', H * .85);
      const nageoires = [];
      dames = [['#E0763C', '#F7A8C0', '#2FA39A', -.3], ['#F2D27A', '#B7E3F2', '#6A5ACD', .2], ['#7A2E3A', '#FFD1DC', '#3B9C5A', .36]].map(([cheveux, coquillage, queue, dx]) => {
        const x = W * .74 + dx * H;
        const n = creer(scene, 'gr-decor gr-nageoire', NAGEOIRE(queue), `left:${x + H * .05}px;bottom:7cqh;width:${H * .07}px;z-index:2`);
        const d = creer(scene, 'gr-decor', SIRENE(cheveux, coquillage), `left:${x - H * .08}px;bottom:5.5cqh;width:${H * .16}px;z-index:2`);
        bouger(d, [{ transform: 'translateY(8cqh)', opacity: 0 }, { transform: 'none', opacity: 1 }], 500, 'ease-out');
        nageoires.push(n);
        return d;
      });
      dames.push(...nageoires);
      bord = decorer('bord', W * .74, '2cqh', H * .85, 4);
    }
    let taverne;
    if (atterrissage === 'taverne') { taverne = decorer('taverne', W * .56 + H * .26, '7cqh', H * .52); taverne.classList.add('gr-taverne'); }
    await bouger(volant, images, tot, 'linear');
    volant.depose('vole');
    // ---- L'atterrissage ----
    let rate = true;                                       // atterrissage raté (le lanceur rigole) ou réussi (le lanceur enrage)
    const cri = (texte, ms) => bulle(scene, volant, texte, ms);
    if (atterrissage === 'pieds') {
      rate = false;
      await bouger(volant, [{ transform: vers(ax, ay) }, { transform: vers(ax, ay + H * .03, 0, 1) + ' scale(1.08, .9)' }, { transform: vers(ax, ay) }], 300, 'ease-out');
      volant.expression('');
      volant.pose('salut');
      cri('Ta-da !', 1600);
      await attendre(2300);
      volant.depose('salut');
    } else if (atterrissage === 'foin') {
      // la tête la première : on ne voit plus que ses jambes qui gigotent
      volant.pose('marche');
      bouger(decor, [{ transform: 'none' }, { transform: 'scale(1.08, .92)' }, { transform: 'none' }], 300);
      await attendre(1900);
      volant.depose('marche');
      await bouger(volant, [{ transform: vers(ax, ay, 900) }, { transform: vers(ax + H * .12, H * .45, 1080) }, { transform: vers(ax + H * .2, H * .7, 1080) }], 700, 'ease-out');
      cri('Atchoum !', 1300);
      await attendre(1300);
    } else if (atterrissage === 'vitre') {
      // SPLAT contre l'écran, il glisse lentement vers le bas
      volant.pose('vitre');
      const f = creer(scene, 'gr-fissures', DECORS.fissures, 'z-index:5');
      poser(f, ax, ay);
      bouger(f, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }], 150, 'ease-out');
      await attendre(900);
      await bouger(volant, [{ transform: vers(ax, ay, 0, 2.6) }, { transform: vers(ax, ay + H * .35, 3, 2.6), offset: .8 }, { transform: vers(ax, ay + H * 1.4, 10, 2.6) }], 2200, 'ease-in');
      volant.depose('vitre');
      await effacer(f);
      volant.style.opacity = 0;                            // il est sorti par le bas
    } else if (atterrissage === 'eau' || atterrissage === 'lac') {
      // PLOUF : il s'enfonce jusqu'à la taille
      const ligne = atterrissage === 'eau' ? H * .89 : H * .88, enfonce = H * .2;
      const coupe = cy => `inset(0 0 ${Math.max(0, (cy + H * .23 - ligne) / (H * .46) * 100)}% 0)`;
      await bouger(volant, [{ transform: vers(ax, ay), clipPath: coupe(ay) }, { transform: vers(ax, ay + enfonce), clipPath: coupe(ay + enfonce) }], 250, 'ease-out');
      for (let i = 0; i < 10; i++) {                        // les éclaboussures
        const g = creer(scene, 'gr-goutte', '', 'z-index:5');
        poser(g, ax + (i - 4.5) * H * .025, ligne);
        bouger(g, [{ transform: 'none', opacity: 1 }, { transform: `translate(${(i - 4.5) * H * .03}px, ${-H * (.12 + (i % 3) * .05)}px)`, opacity: 1, offset: .45 },
          { transform: `translate(${(i - 4.5) * H * .05}px, 0)`, opacity: 0 }], 800, 'ease-out').then(() => g.remove());
      }
      if (atterrissage === 'eau') {
        cri('PLOUF !', 1300);
        await attendre(1500);
        volant.expression('');
        cri('Pfff… trempé.', 1400);
        await attendre(1500);
      } else if (volant === b) {
        // Patagrain chez les Dames du Lac : des cœurs partout
        volant.expression('rire');
        cri('Mesdames…', 1600);
        for (let i = 0; i < 10; i++) {
          const k = creer(scene, 'gr-coeur', '♥', 'z-index:6');
          const d = dames.filter(e => !e.classList.contains('gr-nageoire'))[i % 3].getBoundingClientRect(), s0 = scene.getBoundingClientRect(), z = s0.width / W;
          poser(k, (d.x - s0.x) / z + H * .08, (d.y - s0.y) / z);
          bouger(k, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'translateY(-6cqh) scale(1)', offset: .3 }, { opacity: 0, transform: `translate(${(i % 2 ? 1 : -1) * 4}cqh, -24cqh)` }], 1600)
            .then(() => k.remove());
          await attendre(220);
        }
        rate = false;
        await attendre(500);
      } else {
        // Darktagrain chez les Dames du Lac : elles ne veulent pas de lui
        bulle(scene, dames[1], 'Ouste !', 1500);
        volant.expression('choc');
        await attendre(1700);
      }
      await bouger(volant, [{ transform: vers(ax, ay + enfonce), clipPath: coupe(ay + enfonce) }, { transform: vers(ax + H * .1, ay - H * .1), clipPath: coupe(ay - H * .1), offset: .5 },
        { transform: vers(ax + H * .2, H * .7), clipPath: 'inset(0 0 0% 0)' }], 600, 'ease-out');
    } else if (atterrissage === 'bouse') {
      await bouger(volant, [{ transform: vers(ax, ay) }, { transform: vers(ax, ay + H * .02) + ' scale(1.08, .9)' }, { transform: vers(ax, ay) }], 300, 'ease-out');
      bouger(decor, [{ transform: 'none' }, { transform: 'scale(1.25, .8)' }, { transform: 'none' }], 300);
      const mouches = creer(scene, 'gr-etourdi gr-mouches', '<span></span><span></span><span></span>', 'z-index:6');
      poser(mouches, ax, H * .8);
      mouches.style.opacity = 1;
      const odeur = creer(scene, 'gr-odeur', '≈ ≈ ≈', 'z-index:6');
      poser(odeur, ax, H * .74);
      bouger(odeur, [{ opacity: 0 }, { opacity: 1, transform: 'translateY(-3cqh)', offset: .3 }, { opacity: 0, transform: 'translateY(-12cqh)' }], 2600).then(() => odeur.remove());
      volant.expression('choc');
      cri('BEURK !!!', 1600);
      await attendre(2400);
      mouches.remove();
    } else {
      // à travers le toit de la taverne… et il ressort par la porte, une chope à la main
      rate = false;
      volant.style.opacity = 0;
      taverne.classList.add('troue', 'secoue');
      for (let i = 0; i < 8; i++) {
        const k = creer(scene, 'gr-copeau', '', 'z-index:5');
        poser(k, ax, ay - H * .1);
        bouger(k, [{ transform: 'none', opacity: 1 }, { transform: `translate(${(i - 3.5) * H * .05}px, ${-H * (.08 + (i % 3) * .05)}px) rotate(${i * 90}deg)`, opacity: 1, offset: .4 },
          { transform: `translate(${(i - 3.5) * H * .08}px, ${H * .25}px) rotate(${i * 200}deg)`, opacity: 0 }], 900, 'ease-out').then(() => k.remove());
      }
      crier(scene, 'CRAC !', ax, ay - H * .2);
      await attendre(1300);
      bulle(scene, taverne, 'SANTÉ !', 1400, .05);
      await attendre(1200);
      volant.querySelector('.bf-coude-d circle').insertAdjacentHTML('beforebegin',
        `<svg x="240" y="512" width="100" height="100" viewBox="0 0 100 100" overflow="visible">${OBJETS.chope.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`);
      const porte = ax;
      placer(volant, vers(porte, H * .7, 0, .1));
      volant.style.opacity = 1;
      volant.style.zIndex = 5;
      volant.expression('rire');
      volant.pose('pompette');
      await bouger(volant, [{ transform: vers(porte, H * .7, 0, .3) }, { transform: vers(porte + H * .2, H * .7) }], 900, 'ease-out');
      cri('Hips !', 1200);
      await attendre(1300);
    }
    // Le lanceur réagit : il rigole si c'est raté, il enrage si c'est réussi
    if (volant.style.opacity !== '0') volant.expression('');
    if (rate) { lanceur.pose('danse'); bulle(scene, lanceur, 'HA HA HA !', 1400); }
    else { lanceur.expression('choc'); lanceur.pose('trepigne'); bulle(scene, lanceur, lanceur === m ? 'GRRR !' : 'Hé ! Pas juste !', 1400); }
    await attendre(1600);
    lanceur.depose('danse trepigne'); lanceur.expression('');
    effacer(annonce);
    [decor, bord, taverne, c, ...dames].filter(Boolean).forEach(effacer);
    lanceur.pose('marche'); volant.pose('marche');
    await Promise.all([lanceur.allerA(-30, 2000), volant.style.opacity === '0' ? null : volant.allerA(118, 1600)]);
  }

  // ---------- 9. Le duel contre Darktagrain ----------
  async function duel(scene, nom) {
    const annonce = annoncer(scene, 'Duel !', nom, `lâche ${RIVAL}, le bouffon maléfique !`);
    const b = perso(scene, -25, { epee: true });
    const m = rival(scene, 125, { epee: true });
    b.pose('marche'); m.pose('marche');
    await Promise.all([b.allerA(26, 1700), m.allerA(60, 1700)]);
    b.depose('marche'); m.depose('marche');
    b.pose('en-garde'); m.pose('en-garde');
    await attendre(500);
    const etincelle = creer(scene, 'gr-etincelle', '', 'left:calc(49.5cqw - 7cqh);bottom:32cqh');
    for (let i = 0; i < 3; i++) {
      b.depose('en-garde'); m.depose('en-garde');
      b.pose('attaque', 900); m.pose('attaque', 900);
      b.allerA(31, 450, 'ease-in').then(() => b.allerA(26, 450, 'ease-out'));
      m.allerA(55, 450, 'ease-in').then(() => m.allerA(60, 450, 'ease-out'));
      await attendre(520);
      bouger(etincelle, [{ opacity: 1, transform: 'scale(.2) rotate(0)' }, { opacity: 1, transform: 'scale(1.3) rotate(40deg)', offset: .4 }, { opacity: 0, transform: 'scale(.6) rotate(70deg)' }], 380);
      await attendre(480);
      b.pose('en-garde'); m.pose('en-garde');
      await attendre(250);
    }
    // Le coup décisif : le maléfique est désarmé
    b.depose('en-garde');
    b.pose('attaque', 900);
    b.allerA(33, 450, 'ease-in');
    await attendre(520);
    m.depose('en-garde'); m.pose('gr-cache-epee'); m.expression('choc');
    const epee = creer(scene, 'gr-epee-volante', '<img src="' + Grelots.chemin + 'assets/epee.svg" alt="" style="width:100%">', 'left:62cqw;bottom:24cqh');
    bouger(epee, [{ transform: 'none' }, { transform: 'translate(14cqw, -40cqh) rotate(720deg)', offset: .5 }, { transform: 'translate(30cqw, 10cqh) rotate(1300deg)', opacity: 0 }], 1400, 'ease-out');
    await attendre(900);
    // Désarmé, il menace… et file chercher son dragon (qu'on voit à 300 grelots)
    m.expression('');
    m.pose('menace');
    bulle(scene, m, 'Tu vas voir… je reviens avec mon DRAGON !', 2200);
    await attendre(2000);
    m.depose('menace');
    m.pose('marche');
    m.allerA(125, 900);
    b.allerA(26, 400);
    await attendre(900);
    b.expression('choc');
    bulle(scene, b, 'Glups.', 1300);
    await attendre(1500);
    b.expression('');
    effacer(annonce);
    b.pose('marche');
    await b.allerA(115, 2200);
  }

  // ---------- 10. Le dragon (et Darktagrain sur son dos) ----------
  async function dragon(scene, nom) {
    const voile = creer(scene, 'gr-voile');
    bouger(voile, [{ opacity: 0 }, { opacity: 1 }], 600);
    const annonce = annoncer(scene, RIVAL + ' revient… à dos de dragon !', nom, 'invoque le dragon !');
    const d = creer(scene, 'gr-dragon', Dragon.svg());
    // Darktagrain à califourchon, entre les deux ailes (un dessin du bouffon glissé dans celui du dragon)
    d.querySelector('.dr-aile').insertAdjacentHTML('beforebegin', Bouffon.svg('pied', { expression: 'mechant' }));
    const cavalier = d.querySelector('.dr-corps > .bouffon-svg');
    Object.entries({ x: 236, y: 22, width: 90, height: 207 }).forEach(([k, v]) => cavalier.setAttribute(k, v));
    cavalier.style.width = '90px'; cavalier.style.height = '207px';   // (#ecran .bouffon-svg met 100 % : le style en ligne passe devant)
    cavalier.classList.add('bouffon-malefique', 'cavalier', 'menace');
    placer(d, 'translate(110cqw, -20cqh)');
    const b = perso(scene, -25, { epee: true });
    b.pose('marche');
    const arriveeDragon = bouger(d, [{ transform: 'translate(110cqw, -20cqh)' }, { transform: 'translate(70cqw, -30cqh)', offset: .5 },
      { transform: 'translate(52cqw, -14cqh)' }], 2000, 'ease-out');
    await b.allerA(16, 1700);
    b.depose('marche'); b.pose('en-garde expr-choc');
    await arriveeDragon;
    bulle(scene, { svg: cavalier }, 'Attaque, mon dragon !', 1800, -.04);
    bouger(d, [{ transform: 'translate(52cqw, -14cqh)' }, { transform: 'translate(52cqw, -10cqh)' }], 600);
    await attendre(500);
    // Il crache du feu… le bouffon saute par-dessus
    d.classList.add('crache');
    d.querySelector('.dr-tete').style.animation = 'none';
    d.querySelector('.dr-tete').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(15deg)' }], { duration: 250, fill: 'forwards' });
    await attendre(250);
    b.depose('en-garde expr-choc');
    b.pose('saute', 1100);
    await attendre(1300);
    d.classList.remove('crache');
    d.querySelector('.dr-tete').animate([{ transform: 'rotate(15deg)' }, { transform: 'rotate(0)' }], { duration: 300, fill: 'forwards' });
    // Il charge, bondit et frappe
    b.pose('marche');
    await b.allerA(34, 600, 'ease-in');
    b.depose('marche');
    b.pose('bondit', 1200);
    bouger(b, [{ transform: 'translateX(34cqw)' }, { transform: 'translate(42cqw, -22cqh)', offset: .45 }, { transform: 'translate(46cqw, 0)' }], 1000, 'ease-out');
    await attendre(780);
    const entaille = creer(scene, 'gr-entaille', '', 'left:55cqw;bottom:42cqh');
    bouger(entaille, [{ width: '0', opacity: 1 }, { width: '26cqw', opacity: 1, offset: .5 }, { width: '26cqw', opacity: 0 }], 600);
    await attendre(250);
    // Le dragon est terrassé
    bouger(d, [{ transform: 'translate(52cqw, -10cqh) rotate(0)' }, { transform: 'translate(56cqw, -16cqh) rotate(-8deg)', offset: .2 },
      { transform: 'translate(64cqw, 70cqh) rotate(32deg)', opacity: 1, offset: .9 }, { transform: 'translate(64cqw, 80cqh) rotate(34deg)', opacity: 0 }], 1300, 'ease-in');
    await attendre(900);
    fumee(scene, 62, 0);
    // Pluie de grelots d'or
    cavalier.classList.replace('expr-mechant', 'expr-choc');
    const pluie = creer(scene, 'gr-pluie', '', 'inset:0');
    for (let i = 0; i < 16; i++) {
      const g = document.createElement('span');
      g.style.left = (6 + ((i * 61) % 88)) + 'cqw';
      pluie.appendChild(g);
      bouger(g, [{ transform: 'translateY(0) rotate(0)' }, { transform: `translateY(112cqh) rotate(${(i % 2 ? 1 : -1) * 400}deg)` }], 1400 + (i % 4) * 250, 'cubic-bezier(.5,0,.8,.6)')
        .then(() => g.remove());
      await attendre(70);
    }
    b.pose('hop expr-rire', 1300);
    await attendre(1700);
    effacer(annonce);
    effacer(voile);
    b.pose('marche');
    await b.allerA(115, 2000);
  }

  // Durée maximale de chaque spectacle (ms, mesurée dans tous ses cas, + une marge) : les écrans s'en servent
  // pour cacher leur bouffon pendant ce temps quand ils ne peuvent pas lire la mémoire commune (js/numeros.js › eclipser)
  const DUREES = { chute: 14000, tarte: 14500, serenade: 12000, destin: 10000, potion: 13000, chifoumi: 18000, coffre: 11000, catapulte: 18500, duel: 15000, dragon: 12500 };
  const duree = nom => DUREES[nom] || 15000;

  // Du plus petit au plus grand (les prix sont dans config.js)
  const SPECTACLES = { chute, tarte, serenade, destin, potion, chifoumi, coffre, catapulte, duel, dragon };
  // ---------- Repérer, dans le chat, la réponse du bot quand un spectateur a payé un spectacle ----------
  // config.js › grelots.spectacles.<nom>.reponse : la phrase que le bot StreamElements écrit dans le chat
  // (la même que dans StreamElements), avec ${user} à la place du pseudo du spectateur.
  // Le streamer (et les modos si grelots.essaiModos) peut aussi lancer un spectacle gratis : « !essai catapulte ».
  // Si le bot répond en mode « mention », StreamElements ajoute « @pseudo » devant : c'est accepté.
  const nettoyer = t => String(t).normalize('NFC').replace(/[︎️]/g, '').replace(/\s+/g, ' ').trim();
  const echapperMotif = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function reconnaitre({ login = '', pseudo = '', texte = '', badges = '' }) {
    const CG = (window.CONFIG || {}).grelots || {};
    if (CG.actif === false) return null;
    const essai = texte.trim().match(/^!essai\s+(\S+)/i);
    if (essai && (/(^|,)broadcaster\//.test(badges) || (CG.essaiModos && /(^|,)moderator\//.test(badges)))) {
      const nom = essai[1].toLowerCase();
      return SPECTACLES[nom] ? { spectacle: nom, nom: pseudo || login } : null;
    }
    if (login.toLowerCase() !== String(CG.bot || 'streamelements').toLowerCase()) return null;
    for (const [nom, s] of Object.entries(CG.spectacles || {})) {
      if (!s || s.actif === false || !s.reponse || !SPECTACLES[nom]) continue;
      const morceaux = nettoyer(s.reponse).split(/\$\{(?:user|sender)\}/);
      const r = nettoyer(texte).match(new RegExp('^(?:@\\S+[,:]?\\s+)?' + morceaux.map(echapperMotif).join('@?(.+?)') + '$', 'iu'));
      if (r) return { spectacle: nom, nom: r[1] || 'Un aventurier' };
    }
    return null;
  }

  async function jouer(scene, spectacle, nom = 'Un aventurier', forcer = {}) {
    const zone = creer(scene, 'gr-scene');
    try { await (SPECTACLES[spectacle] || chute)(zone, nom, forcer); } finally { zone.remove(); }
  }

  // Chemin vers la racine de l'overlay (pour les images) : « ../ » depuis design/, scenes/, sources/…
  return { jouer, reconnaitre, duree, liste: Object.keys(SPECTACLES), rival: RIVAL, chemin: '../' };
})();
