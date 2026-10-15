/* =====================================================================
   SCÉNETTE — pendant un jet de dés, le personnage entre dans un rectangle de la page et joue son geste
   (court, se cache, lance un sort, frappe, pare…), puis il réagit au résultat : il rit à la réussite,
   il est choqué à l'échec, il tombe K.O. à l'échec critique, il danse au critique.
     Scenette.jouer(conteneur, jet, { dessin(expression) → <svg>, duree, denouement, zone, carte, pied }) → promesse (finie quand il disparaît)
   pied: true → le personnage EN PIED (squelette de Patagrain, Filtres.rendu(…, { cadrage: 'pied' })) joue le jet avec la mise en scène
   de l'ARÈNE (src/arene.js) : il court, se cache, lance un sort, frappe…, puis saute de joie ou tombe.
   conteneur : n'importe quel élément de la page (on y pose un calque qui le remplit) ;
   zone : { x, y, l, h } en pixels (la scénette se pose à cet endroit du conteneur, au-dessus du reste : scènes des overlays) ;
   carte(el) : pour remplir le bandeau du haut (.cs-carte), ex. le compteur du jet.
   Classes (pour le CSS personnalisé d'OBS, ou le css/jdr.css d'un overlay) : .cs-scenette, .cs-fond, .cs-carte, .cs-perso, .cs-effet
   ===================================================================== */
const Scenette = (() => {
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  const bouger = (el, images, ms, easing = 'ease-in-out') => el.animate(images, { duration: ms, easing, fill: 'forwards' }).finished;
  let style = false;
  function poserStyle() {
    if (style || typeof document === 'undefined') return; style = true;
    const s = document.createElement('style');
    s.textContent = `.cs-scenette { position: absolute; inset: 0; overflow: hidden; }
      .cs-scenette.cs-zone { inset: auto; z-index: 20; }
      .cs-scenette .cs-fond { position: absolute; inset: 0; }
      .cs-scenette .cs-carte { position: absolute; left: 0; right: 0; top: 0; }
      .cs-scenette .cs-perso { position: absolute; left: 50%; bottom: 0; height: 92%; aspect-ratio: 200 / 240; transform-origin: 50% 100%; }
      .cs-scenette .cs-perso svg { width: 100%; height: 100%; display: block; overflow: visible; }
      .cs-scenette .cs-effet { position: absolute; font-size: 44px; line-height: 1; pointer-events: none; }`;
    document.head.appendChild(s);
  }

  async function jouer(conteneur, jet, { dessin, duree = 4000, denouement = 1500, zone = null, carte = null, pied = false } = {}) {
    poserStyle();
    if (pied) {                                    // en pied : la mise en scène de l'arène, dans le même rectangle
      if (getComputedStyle(conteneur).position === 'static') conteneur.style.position = 'relative';
      const el = document.createElement('div');
      el.className = 'cs-scenette cs-pied' + (zone ? ' cs-zone' : '');
      if (zone) Object.assign(el.style, { left: zone.x + 'px', top: zone.y + 'px', width: zone.l + 'px', height: zone.h + 'px' });
      el.innerHTML = '<div class="cs-fond"></div>';
      conteneur.appendChild(el);
      const scene = document.createElement('div'); scene.style.cssText = 'position:absolute;inset:0';
      el.appendChild(scene);
      try { await Arene.jouer(scene, jet, { dessin, carte: false, duree, denouement }); } finally { el.remove(); }
      return;
    }
    if (getComputedStyle(conteneur).position === 'static') conteneur.style.position = 'relative';
    const t0 = performance.now();
    const el = document.createElement('div');
    el.className = 'cs-scenette' + (zone ? ' cs-zone' : '');
    if (zone) Object.assign(el.style, { left: zone.x + 'px', top: zone.y + 'px', width: zone.l + 'px', height: zone.h + 'px' });
    el.innerHTML = '<div class="cs-fond"></div><div class="cs-carte"></div><div class="cs-perso"></div>';
    conteneur.appendChild(el);
    el.querySelector('.cs-fond').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
    if (carte) carte(el.querySelector('.cs-carte'));
    const perso = el.querySelector('.cs-perso');
    const dessiner = (e = '') => { perso.innerHTML = dessin(e); };
    dessiner();
    const effet = (texte, x, y = 30, images = null, ms = 1200) => {
      const e = document.createElement('div'); e.className = 'cs-effet'; e.textContent = texte;
      Object.assign(e.style, { left: x + '%', bottom: y + '%' }); el.appendChild(e);
      return bouger(e, images || [{ opacity: 0, transform: 'translateY(0) scale(.6)' }, { opacity: 1, transform: 'translateY(-30px) scale(1.1)', offset: .3 }, { opacity: 0, transform: 'translateY(-70px) scale(1)' }], ms).then(() => e.remove());
    };
    const X = 'translateX(-50%)';
    await (jet.geste === 'courir'
      ? bouger(perso, [{ transform: 'translateX(160%)' }, { transform: X }], Math.max(900, denouement - 300), 'cubic-bezier(.2,.8,.3,1)')
      : bouger(perso, [{ transform: `${X} translateY(105%)` }, { transform: X }], 450, 'cubic-bezier(.34,1.56,.64,1)'));

    // --- le geste, pendant que les dés roulent dans CodexVTT ---
    const g = jet.geste;
    const gestes = {
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
    };
    if (gestes[g]) await gestes[g]();
    await attendre(Math.max(0, denouement - (performance.now() - t0)));
    if (g === 'cacher') bouger(perso, [{ opacity: .25 }, { opacity: 1 }], 300);

    // --- le dénouement : la réaction au résultat ---
    const v = jet.verdict;
    if (v === 'crit') {
      dessiner('rire'); ['★', '✦', '★', '✦'].forEach((s, i) => setTimeout(() => effet(s, 15 + i * 22, 55 + (i % 2) * 15), i * 200));
      await bouger(perso, [{ transform: X }, { transform: `${X} translateY(-12%) rotate(-6deg)` }, { transform: X }, { transform: `${X} translateY(-12%) rotate(6deg)` }, { transform: X }], 1100);
    } else if (v === 'ok') {
      dessiner('rire');
      if (g === 'frapper' || g === 'tirer') effet('💥', 72, 45);
      await bouger(perso, [{ transform: X }, { transform: `${X} translateY(-14%)` }, { transform: X }], 600, 'cubic-bezier(.34,1.56,.64,1)');
    } else if (v === 'rate') {
      dessiner('choc'); effet('💧', 30, 60);
      await bouger(perso, [{ transform: X }, { transform: `${X} translateX(-4%)` }, { transform: `${X} translateX(4%)` }, { transform: X }], 400);
    } else if (v === 'fumble') {
      dessiner('ko'); effet('💥', 50, 60);
      await bouger(perso, [{ transform: X }, { transform: `${X} rotate(-14deg) translateY(4%)` }, { transform: `${X} rotate(80deg) translateY(30%)` }], 900, 'cubic-bezier(.5,0,.8,.4)');
    } else if (g === 'soigner') effet(`+${jet.resultat}`, 60, 60);

    await attendre(Math.max(500, duree - (performance.now() - t0 - denouement)));
    await bouger(el, [{ opacity: 1 }, { opacity: 0 }], 400);
    el.remove();
  }
  return { jouer };
})();
