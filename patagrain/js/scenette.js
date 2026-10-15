/* =====================================================================
   SCÉNETTE — pendant un jet de dés, le personnage passe AU-DESSUS DU CHAT et joue son geste
   (comme l'arène des héros de Patagrain) : il court, se cache, lance un sort, frappe, pare… puis il réagit
   au résultat (il rit à la réussite, il est choqué à l'échec, K.O. à l'échec critique, il danse au critique).
   COMMUN : le geste et le verdict viennent de js/partie.js (jet.geste, jet.verdict), le dessin du style de la chaîne
   (js/persos-style.js : PersosStyle.rendu), les formes de js/apparence.js (fiche du catalogue js/persos.js, sinon un
   aventurier aux couleurs de sa carte).
     Scenette.jouer(ecran, zone, jet, { duree, denouement, carte(el) })  → promesse, finie quand la scénette disparaît
       zone : { x, y, l, h } (au-dessus du chat) ; carte : pour ajouter le compteur du jet de la chaîne (facultatif)
   Styles : chaque overlay habille .scenette, .sc-perso, .sc-effet, .sc-carte dans son css/jdr.css (une base est posée ici).
   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
const Scenette = (() => {
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  const bouger = (el, images, ms, easing = 'ease-in-out') => el.animate(images, { duration: ms, easing, fill: 'forwards' }).finished;
  let style = false;
  function poserStyle() {
    if (style) return; style = true;
    const s = document.createElement('style');
    s.textContent = `.scenette { position: absolute; overflow: hidden; z-index: 20; }
      .scenette .sc-fond { position: absolute; inset: 0; }
      .scenette .sc-perso { position: absolute; left: 50%; bottom: 0; width: 46%; aspect-ratio: 200 / 240; transform-origin: 50% 100%; }
      .scenette .sc-perso svg { width: 100%; height: 100%; display: block; overflow: visible; }
      .scenette .sc-effet { position: absolute; font-size: 44px; line-height: 1; pointer-events: none; }
      .scenette .sc-carte { position: absolute; left: 0; right: 0; top: 0; }`;
    document.head.appendChild(s);
  }
  // La fiche à dessiner : celle du catalogue, sinon un aventurier (tunique et capuche à la couleur de sa carte)
  function ficheDe(jet) {
    const p = jet.perso || jet.inconnu || {};   // inconnu : un perso de joueur sans carte (js/partie.js)
    const f = p.apparence || (typeof Apparence !== 'undefined' && Apparence.trouver(p.nom, p.nomCodex, jet.characterName));   // CodexVTT d'abord, puis le catalogue
    if (f) return f;
    const c = p.couleur || '#5A6E8C';
    return { id: 'aventurier', nom: p.nom || jet.characterName || '?', tenue: { type: 'cape', couleur: c }, accessoire: 'capuche', yeux: { couleur: '#3A2A1A' } };
  }

  async function jouer(ecran, z, jet, { duree = 4000, denouement = 1500, carte = null } = {}) {
    poserStyle();
    const t0 = performance.now();
    const el = document.createElement('div');
    el.className = 'scenette';
    Object.assign(el.style, { left: z.x + 'px', top: z.y + 'px', width: z.l + 'px', height: z.h + 'px' });
    el.innerHTML = '<div class="sc-fond"></div><div class="sc-carte"></div><div class="sc-perso"></div>';
    ecran.appendChild(el);
    const perso = el.querySelector('.sc-perso');
    const fiche = ficheDe(jet), forme = (jet.perso || jet.inconnu || {}).forme || '';
    const dessin = (expression = '') => { perso.innerHTML = typeof PersosStyle !== 'undefined' ? PersosStyle.rendu(fiche, { forme, expression }) : Apparence.svg(fiche, { forme, expression }); };
    dessin();
    if (carte) carte(el.querySelector('.sc-carte'));
    const effet = (texte, x, y = 30, images = null, ms = 1200) => {
      const e = document.createElement('div'); e.className = 'sc-effet'; e.textContent = texte;
      Object.assign(e.style, { left: x + '%', bottom: y + '%' }); el.appendChild(e);
      return bouger(e, images || [{ opacity: 0, transform: 'translateY(0) scale(.6)' }, { opacity: 1, transform: 'translateY(-30px) scale(1.1)', offset: .3 }, { opacity: 0, transform: 'translateY(-70px) scale(1)' }], ms).then(() => e.remove());
    };
    const X = 'translateX(-50%)';
    const entree = jet.geste === 'courir'
      ? bouger(perso, [{ transform: `translateX(160%)` }, { transform: X }], Math.max(900, denouement - 300), 'cubic-bezier(.2,.8,.3,1)')
      : bouger(perso, [{ transform: `${X} translateY(105%)` }, { transform: X }], 450, 'cubic-bezier(.34,1.56,.64,1)');
    el.querySelector('.sc-fond').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
    await entree;

    // --- le geste (pendant que les dés roulent dans CodexVTT) ---
    const g = jet.geste, reste = () => Math.max(0, denouement - (performance.now() - t0));
    const geste = {
      cacher: () => bouger(perso, [{ opacity: 1, transform: X }, { opacity: .25, transform: `${X} translateY(8%) scale(.92)` }], 700),
      crocheter: () => { effet('🔒', 62, 40); return bouger(perso, [{ transform: X }, { transform: `${X} rotate(-4deg)` }, { transform: X }], 600); },
      lire: () => { effet('📖', 64, 45); return bouger(perso, [{ transform: X }, { transform: `${X} translateY(-4%)` }, { transform: X }], 700); },
      observer: () => { effet('👁️', 64, 50); return bouger(perso, [{ transform: X }, { transform: `${X} rotate(6deg)` }, { transform: `${X} rotate(-6deg)` }, { transform: X }], 900); },
      parler: () => { effet('💬', 66, 55); return bouger(perso, [{ transform: X }, { transform: `${X} translateY(-6%)` }, { transform: X }, { transform: `${X} translateY(-6%)` }, { transform: X }], 800); },
      menacer: () => { effet('💢', 66, 55); return bouger(perso, [{ transform: X }, { transform: `${X} scale(1.12)` }, { transform: X }], 600); },
      danser: () => { effet('♪', 30, 50); effet('♫', 70, 55); return bouger(perso, [{ transform: X }, { transform: `${X} rotate(-8deg)` }, { transform: `${X} rotate(8deg)` }, { transform: X }], 900); },
      parer: () => { effet('🛡️', 64, 35); return bouger(perso, [{ transform: X }, { transform: `${X} translateX(-6%)` }, { transform: X }], 500); },
      sort: () => { effet('✨', 30, 60); effet('✨', 70, 40); return bouger(perso, [{ transform: X, filter: 'none' }, { transform: `${X} translateY(-6%)`, filter: 'brightness(1.6)' }, { transform: X, filter: 'none' }], 900); },
      tirer: () => { effet('➶', 70, 45, [{ opacity: 1, transform: 'translateX(-60px)' }, { opacity: 0, transform: 'translateX(140px)' }], 600); return bouger(perso, [{ transform: X }, { transform: `${X} translateX(-8%)` }, { transform: X }], 500); },
      frapper: () => bouger(perso, [{ transform: X }, { transform: `${X} translateX(-10%) rotate(-6deg)` }, { transform: `${X} translateX(14%) rotate(8deg)` }, { transform: X }], 650),
      soigner: () => { effet('💚', 50, 70); return bouger(perso, [{ transform: X, filter: 'none' }, { transform: X, filter: 'brightness(1.4)' }, { transform: X, filter: 'none' }], 800); },
      garde: () => bouger(perso, [{ transform: X }, { transform: `${X} scale(1.06)` }, { transform: X }], 500),
    }[g];
    if (geste) await geste();
    await attendre(reste());
    if (g === 'cacher') bouger(perso, [{ opacity: .25 }, { opacity: 1 }], 300);

    // --- le dénouement : la réaction au résultat ---
    const v = jet.verdict;
    if (v === 'crit') {
      dessin('rire'); ['★', '✦', '★', '✦'].forEach((s, i) => setTimeout(() => effet(s, 15 + i * 22, 55 + (i % 2) * 15), i * 200));
      await bouger(perso, [{ transform: X }, { transform: `${X} translateY(-12%) rotate(-6deg)` }, { transform: X }, { transform: `${X} translateY(-12%) rotate(6deg)` }, { transform: X }], 1100);
    } else if (v === 'ok') {
      dessin('rire');
      if (g === 'frapper' || g === 'tirer') effet('💥', 72, 45);
      await bouger(perso, [{ transform: X }, { transform: `${X} translateY(-14%)` }, { transform: X }], 600, 'cubic-bezier(.34,1.56,.64,1)');
    } else if (v === 'rate') {
      dessin('choc'); effet('💧', 30, 60);
      await bouger(perso, [{ transform: X }, { transform: `${X} translateX(-4%)` }, { transform: `${X} translateX(4%)` }, { transform: X }], 400);
    } else if (v === 'fumble') {
      dessin('ko'); effet('💥', 50, 60);
      await bouger(perso, [{ transform: X }, { transform: `${X} rotate(-14deg) translateY(4%)` }, { transform: `${X} rotate(80deg) translateY(30%)` }], 900, 'cubic-bezier(.5,0,.8,.4)');
    } else if (g === 'soigner') { effet(`+${jet.result}`, 60, 60); }

    // le résultat reste lisible, puis tout s'en va
    await attendre(Math.max(500, duree - (performance.now() - t0 - denouement)));
    await bouger(el, [{ opacity: 1 }, { opacity: 0 }], 400);
    el.remove();
  }

  return { jouer, ficheDe };
})();
