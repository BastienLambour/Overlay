/* =====================================================================
   NUMÉROS — le bouffon en action sur chaque écran.
   Chaque fonction dessine le bouffon (js/bouffon.js) dans un élément et lui
   fait jouer son numéro (animations dans css/bouffon.css).
     Numeros.cirque(el)             Starting soon : jongle, poirier, salut (en boucle)
       el.lancerD20(cible, fini)    … à la fin du compte à rebours : il lance un d20 qui retombe
                                    sur 20 à côté de « cible », puis fini() est appelé
     Numeros.feu(el, scene)         Pause : il rêve d'un d20 lancé au hasard ; sur un 1 il se réveille,
                                    grille un chamallow, le croque, et se rendort.
                                    « scene » contient les Z (.bfx-z) et la bulle de rêve (.bfx-reve)
     Numeros.taverne(el, chat)      Cam seule / Contenu : dépasse de la carte du chat,
                                    ses grelots tintent à chaque nouveau message
     Numeros.rappel(el)             Alertes : accroché d'une main à la corde de l'alerte
     Numeros.coucouJeu(el)          Jeu : sous son chapeau posé sur la cam, il passe la tête (en boucle)
     Numeros.coucouJeu(el, { toutesLes: 60 })   … seulement toutes les 60 s ; el.sortir() le fait
                                    sortir tout de suite (à un follow)
     Numeros.auRevoir(el, bulle)    Fin : coucou, courbette, saut de joie (la bulle change de texte)
   ===================================================================== */
const Numeros = (() => {
  const dessiner = (el, forme, options, classes) => {
    el.innerHTML = Bouffon.svg(forme, options);
    el.classList.add(...classes);
    return el;
  };
  // Enchaîne des étapes [classes, durée ms, action facultative] en boucle.
  // Renvoie une fonction qui arrête la boucle (et retire ses classes).
  function enchainer(el, etapes) {
    const toutes = [...new Set(etapes.flatMap(([c]) => c.split(' ')))];
    let i = 0, minuteur;
    (function suivante() {
      const [classes, duree, action] = etapes[i++ % etapes.length];
      el.classList.remove(...toutes); void el.offsetWidth;
      el.classList.add(...classes.split(' '));
      if (action) action();
      minuteur = setTimeout(suivante, duree);
    })();
    return () => { clearTimeout(minuteur); el.classList.remove(...toutes); };
  }

  // Position d'un élément en pixels de l'écran 1920×1080 (l'écran est mis à l'échelle par Commun)
  function position(el, ecran) {
    const r = el.getBoundingClientRect(), e = ecran.getBoundingClientRect(), k = e.width / 1920 || 1;
    return { x: (r.x - e.x) / k, y: (r.y - e.y) / k, l: r.width / k, h: r.height / k };
  }

  // Trois dés à jongler, ajoutés dans le dessin (ils tournent autour d'une ellipse devant lui)
  const DES = ['d20', 'd6', 'd4'].map((nom, i) =>
    `<g class="bfx-de d${i + 1}"><use href="#i-${nom}" x="-50" y="-50" width="100" height="100"/></g>`).join('');

  const NUMERO_CIRQUE = [['jongle', 6000], ['poirier', 4400], ['salut', 2400]];
  function cirque(el) {
    dessiner(el, 'pied', {}, ['cligne']);
    el.querySelector('svg').insertAdjacentHTML('beforeend', `<g class="bfx-des">${DES}</g>`);
    let arreter = enchainer(el, NUMERO_CIRQUE);

    // Fin du compte à rebours : il lance un d20… qui retombe sur 20 à côté de « cible »
    el.lancerD20 = (cible, fini) => {
      arreter();
      el.classList.add('lance');
      const ecran = el.closest('#ecran') || document.body;
      const de = document.createElement('div');
      de.className = 'd20-lance';
      de.innerHTML = '<svg viewBox="0 0 100 100"><use href="#i-d20"/></svg>';
      ecran.appendChild(de);
      const T = 150;                                                   // taille du dé (px)
      const main = position(el.querySelector('.bf-epaule-d circle'), ecran);
      const c = position(cible, ecran);
      const x0 = main.x + main.l / 2 - T / 2, y0 = main.y + main.h / 2 - T / 2;
      const x1 = c.x - T - 40, y1 = c.y + c.h / 2 - T / 2;             // il atterrit à gauche de la cible
      const haut = Math.min(y0, y1) - 320;
      const k = (x, y, r, sc, o) => ({ transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${sc})`, offset: o });
      setTimeout(() => {
        de.style.opacity = 1;
        const vol = de.animate([k(x0, y0, 0, .35, 0), k((x0 + x1) / 2, haut, 540, .8, .45), k(x1, y1, 1040, 1, .82),
          k(x1, y1 - 46, 1080, 1, .9), k(x1, y1, 1080, 1, 1)], { duration: 1500, easing: 'ease-in-out', fill: 'forwards' });
        vol.onfinish = () => {
          de.classList.add('critique');                                // 20 ! le dé brille
          el.classList.remove('lance');
          if (fini) fini();
          // la cible a pu changer de taille (nouveau texte) : petit rebond jusqu'à son nouveau bord gauche
          requestAnimationFrame(() => {
            const c2 = position(cible, ecran), x2 = c2.x - T - 40, y2 = c2.y + c2.h / 2 - T / 2;
            if (Math.abs(x2 - x1) + Math.abs(y2 - y1) > 4) de.animate([k(x1, y1, 1080, 1, 0), k((x1 + x2) / 2, Math.min(y1, y2) - 70, 1260, 1, .5), k(x2, y2, 1440, 1, 1)],
              { duration: 450, easing: 'ease-in-out', fill: 'forwards' });
          });
          setTimeout(() => { el.classList.add('hop'); }, 100);
          setTimeout(() => { el.classList.remove('hop'); arreter = enchainer(el, NUMERO_CIRQUE); }, 1500);
        };
      }, 560);                                                         // le dé part quand le bras est en haut
    };
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
    // Il rêve d'un d20 qui roule… et le dé tombe AU HASARD (1 à 20) : sur un 1, il se réveille en sursaut,
    // grille un chamallow et le croque, puis se rendort ; sur un autre chiffre, il dort toujours et relance.
    // (?test=1 : le 2e lancer fait 1, pour voir le réveil tout de suite)
    const ETATS = ['dodo', 'expr-dort', 'reveil', 'expr-choc', 'chamallow', 'croque', 'expr-rire'];
    const poser = classes => { el.classList.remove(...ETATS); void el.offsetWidth; el.classList.add(...classes.split(' ')); };
    const test = new URLSearchParams(location.search).has('test');
    let roule, lancers = 0;
    const apres = (ms, suite) => setTimeout(suite, ms);
    function lancer() {                               // un lancer de dé dans son rêve
      scene.classList.add('dort'); reve?.classList.remove('pose');
      clearInterval(roule);
      roule = setInterval(() => { if (chiffre) chiffre.textContent = 2 + Math.floor(Math.random() * 19); }, 140);
      apres(4600, () => {
        clearInterval(roule);
        lancers++;
        const tirage = test && lancers === 2 ? 1 : 1 + Math.floor(Math.random() * 20);
        if (chiffre) chiffre.textContent = tirage;
        reve?.classList.add('pose');
        el.dataset.tirage = tirage;                 // (pour les vérifications)
        if (tirage === 1) apres(1200, reveil);      // le temps de voir le 1… et sursaut !
        else apres(2200, lancer);                   // il voit son chiffre, et se rendort de plus belle
      });
    }
    function reveil() {
      scene.classList.remove('dort');
      poser('reveil expr-choc');                    // sursaut !
      apres(1300, () => {
        poser('chamallow');                         // il grille un chamallow au-dessus du feu
        apres(4400, () => {
          poser('croque expr-rire');                // et le croque (devant sa bouche)
          apres(2600, () => { poser('dodo expr-dort'); lancer(); });   // puis se rendort
        });
      });
    }
    poser('dodo expr-dort');
    lancer();
    return el;
  }

  const rappel = el => dessiner(el, 'pied', {}, ['rappel', 'cligne']);
  // Scène Jeu : sans option, il ressort en boucle (moodboard) ; avec toutesLes, seulement de temps en temps
  function coucouJeu(el, { toutesLes = null } = {}) {
    dessiner(el, 'buste', {}, ['coucou-jeu']);
    if (toutesLes === null) return el;
    el.classList.add('une-fois');
    let fin;
    el.sortir = () => {
      if (el.classList.contains('sort')) return;
      el.classList.add('sort');
      clearTimeout(fin); fin = setTimeout(() => el.classList.remove('sort'), 10000);   // durée d'une sortie (--duree-coucou)
    };
    // Pas comme une horloge : le délai varie un peu (± 25 %) d'une sortie à l'autre
    if (toutesLes > 0) (function prochaine() { setTimeout(() => { el.sortir(); prochaine(); }, toutesLes * 1000 * (.75 + Math.random() * .5)); })();
    return el;
  }

  function auRevoir(el, bulle) {
    dessiner(el, 'pied', {}, ['cligne']);
    const textes = ((window.CONFIG || {}).bouffon || {}).bulles || ["Merci d'être venus !", 'À bientôt, aventuriers !'];
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
