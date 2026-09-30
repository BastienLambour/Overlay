/* =====================================================================
   NUMÉROS — le bouffon en action sur chaque écran.
   Chaque fonction dessine le bouffon (js/bouffon.js) dans un élément et lui
   fait jouer son numéro (animations dans css/bouffon.css).
     Numeros.cirque(el)             Starting soon : jongle, poirier, salut (en boucle)
     Numeros.feu(el, scene)         Pause : il rêve d'un d20 ; sur un 1 il se réveille,
                                    grille un chamallow, le croque, et se rendort.
                                    « scene » contient les Z (.bfx-z) et la bulle de rêve (.bfx-reve)
     Numeros.taverne(el, chat)      Cam seule / Contenu : dépasse de la carte du chat,
                                    ses grelots tintent à chaque nouveau message
     Numeros.rappel(el)             Alertes : accroché d'une main à la corde de l'alerte
     Numeros.coucouJeu(el)          Jeu : sous son chapeau posé sur la cam, il passe la tête
     Numeros.auRevoir(el, bulle)    Fin : coucou, courbette, saut de joie (la bulle change de texte)
   ===================================================================== */
const Numeros = (() => {
  const dessiner = (el, forme, options, classes) => {
    el.innerHTML = Bouffon.svg(forme, options);
    el.classList.add(...classes);
    return el;
  };
  // Enchaîne des étapes [classes, durée ms, action facultative] en boucle
  function enchainer(el, etapes) {
    const toutes = [...new Set(etapes.flatMap(([c]) => c.split(' ')))];
    let i = 0;
    (function suivante() {
      const [classes, duree, action] = etapes[i++ % etapes.length];
      el.classList.remove(...toutes); void el.offsetWidth;
      el.classList.add(...classes.split(' '));
      if (action) action();
      setTimeout(suivante, duree);
    })();
  }

  // Trois dés à jongler, ajoutés dans le dessin (ils tournent autour d'une ellipse devant lui)
  const DES = ['d20', 'd6', 'd4'].map((nom, i) =>
    `<g class="bfx-de d${i + 1}"><use href="#i-${nom}" x="-50" y="-50" width="100" height="100"/></g>`).join('');

  function cirque(el) {
    dessiner(el, 'pied', {}, ['cligne']);
    el.querySelector('svg').insertAdjacentHTML('beforeend', `<g class="bfx-des">${DES}</g>`);
    enchainer(el, [['jongle', 6000], ['poirier', 4400], ['salut', 2400]]);
    return el;
  }

  // Le bâton à chamallow, tenu dans la main droite (il prolonge l'avant-bras) : assez long pour atteindre le feu
  const BATON = `<g class="bfx-baton"><line class="bfx-tige" x1="284" y1="552" x2="284" y2="862" stroke="#8B5A2B" stroke-width="8" stroke-linecap="round"/>
    <g class="bfx-guimauve" fill="#fff"><rect x="265" y="832" width="38" height="46" rx="15" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
      <rect x="271" y="839" width="8" height="30" rx="4" fill="#fff" opacity=".6"/></g></g>`;

  function feu(el, scene = el.parentElement) {
    dessiner(el, 'pied', {}, ['au-feu']);
    el.querySelector('.bf-coude-d').insertAdjacentHTML('beforeend', BATON);
    // le bras droit passe DEVANT la tête : quand il croque, le chamallow est devant sa bouche (pas derrière ses cheveux)
    el.querySelector('.bf-tout').appendChild(el.querySelector('.bf-epaule-d'));
    const reve = scene.querySelector('.bfx-reve'), chiffre = scene.querySelector('.bfx-chiffre');
    let roule;
    const rever = () => {
      scene.classList.add('dort'); reve?.classList.remove('pose');
      clearInterval(roule);
      roule = setInterval(() => { if (chiffre) chiffre.textContent = 2 + Math.floor(Math.random() * 19); }, 140);
      setTimeout(() => { clearInterval(roule); if (chiffre) chiffre.textContent = '1'; reve?.classList.add('pose'); }, 5600);
    };
    const reveiller = () => scene.classList.remove('dort');
    enchainer(el, [
      ['dodo expr-dort', 6600, rever],          // il rêve : le d20 roule… et tombe sur 1
      ['reveil expr-choc', 1300, reveiller],    // sursaut !
      ['chamallow', 4400],                      // il grille un chamallow au-dessus du feu
      ['croque expr-rire', 1800],               // et le croque
    ]);
    return el;
  }

  const rappel = el => dessiner(el, 'pied', {}, ['rappel', 'cligne']);
  const coucouJeu = el => dessiner(el, 'buste', {}, ['coucou-jeu']);

  function auRevoir(el, bulle) {
    dessiner(el, 'pied', {}, ['cligne']);
    const textes = ["Merci d'être venus !", 'À bientôt, aventuriers !'];
    let n = 0;
    enchainer(el, [
      ['au-revoir', 3500, () => { if (bulle) bulle.textContent = textes[n++ % textes.length]; }],
      ['salut', 2400],
      ['hop', 1300],
    ]);
    return el;
  }

  // Les grelots tintent à chaque message qui arrive dans le chat
  function taverne(el, chat) {
    dessiner(el, 'buste', {}, ['guette', 'cligne']);
    if (chat) new MutationObserver(liste => {
      if (!liste.some(m => m.addedNodes.length)) return;
      el.classList.remove('ding'); void el.offsetWidth; el.classList.add('ding');
      clearTimeout(el._ding); el._ding = setTimeout(() => el.classList.remove('ding'), 900);
    }).observe(chat, { childList: true, subtree: true });
    return el;
  }

  return { cirque, feu, taverne, rappel, coucouJeu, auRevoir };
})();
