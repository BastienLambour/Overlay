/* =====================================================================
   FLUIDE — les transitions « splash », « gouttes » et « pop art ».
   Chaque transition est dessinée dans un <svg viewBox="0 0 1920 1080">
   et calculée uniquement à partir du temps t (en secondes) : on peut donc
   la jouer en direct ou l'exporter image par image en vidéo.

   const tr = Fluide.creer(svg, 'splash', { avatar: '../assets/avatar.png' });
   tr.rendre(0.5);  tr.duree;  tr.milieu;
   ===================================================================== */
const Fluide = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  let compteur = 0;

  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  };
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const doux = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;   // entrée/sortie en douceur
  const acc = x => x * x * x;                                                // accélère
  const rebond = x => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  function hasard(graine) {             // générateur pseudo-aléatoire reproductible
    let a = graine;
    return (min = 0, max = 1) => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return min + (((t ^ t >>> 14) >>> 0) / 4294967296) * (max - min);
    };
  }

  // --- Structure commune : fluide blanc + ombre néon décalée + médaillon central ---
  function socle(svg, avatar) {
    const n = ++compteur;
    svg.innerHTML = '';
    const defs = el('defs', {}, svg);
    const f = el('filter', { id: `goo${n}`, x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs);
    el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 16, result: 'flou' }, f);
    el('feColorMatrix', { in: 'flou', mode: 'matrix', values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -13' }, f);
    const lueur = el('filter', { id: `lueur${n}`, x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    el('feGaussianBlur', { stdDeviation: 14, result: 'b' }, lueur);
    const m = el('feMerge', {}, lueur); el('feMergeNode', { in: 'b' }, m); el('feMergeNode', { in: 'b' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);
    const trame = el('pattern', { id: `trame${n}`, width: 34, height: 34, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('circle', { cx: 17, cy: 17, r: 8.5, fill: 'var(--accent)' }, trame);
    const clip = el('clipPath', { id: `rond${n}` }, defs); el('circle', { r: 132 }, clip);

    const fond = el('g', {}, svg);                                                   // couches sans filtre (pop art)
    const ombre = el('g', { filter: `url(#goo${n})`, fill: 'var(--violet)', transform: 'translate(22 16)' }, svg);
    const blanc = el('g', { filter: `url(#goo${n})`, fill: 'var(--blanc)' }, svg);
    const forme = el('g', { id: `forme${n}` }, blanc);
    el('use', { href: `#forme${n}` }, ombre);

    // Médaillon : avatar dans un anneau néon + sticker
    const medaillon = el('g', { transform: 'translate(960 500) scale(0)' }, svg);
    el('circle', { r: 150, fill: 'var(--encre)', stroke: 'var(--violet)', 'stroke-width': 12, filter: `url(#lueur${n})` }, medaillon);
    if (avatar) el('image', { href: avatar, x: -140, y: -140, width: 280, height: 280, 'clip-path': `url(#rond${n})`, preserveAspectRatio: 'xMidYMid slice' }, medaillon);
    el('circle', { r: 138, fill: 'none', stroke: '#fff', 'stroke-width': 6 }, medaillon);
    const s = el('g', { transform: 'translate(0 205) rotate(-4)' }, medaillon);
    el('rect', { x: -223, y: -33, width: 460, height: 80, fill: 'var(--encre)' }, s);
    el('rect', { x: -230, y: -40, width: 460, height: 80, fill: 'var(--accent)', stroke: 'var(--encre)', 'stroke-width': 5 }, s);
    const txt = el('text', { 'text-anchor': 'middle', y: 17, fill: 'var(--encre)', 'font-family': 'Bangers, cursive', 'font-size': 52, 'letter-spacing': 2 }, s);
    txt.textContent = 'CHANGEMENT DE SCÈNE !';

    return { n, fond, forme, trame: `url(#trame${n})`, medaillon };
  }

  // Apparition du médaillon entre a et b (en secondes)
  function medaillonA(med, t, a, b) {
    const entre = rebond(clamp((t - a) / .28)), sort = acc(clamp((t - (b - .22)) / .22));
    const k = t < a || t > b ? 0 : entre * (1 - sort);
    med.setAttribute('transform', `translate(960 500) scale(${k.toFixed(3)}) rotate(${(-8 + 8 * entre).toFixed(2)})`);
  }

  // =================================================================
  // SPLASH : une vague de fluide blanc traverse l'écran en éclaboussant
  // =================================================================
  function splash(svg, { avatar, graine = 3 } = {}) {
    const r = hasard(graine), S = socle(svg, avatar);
    const g = el('g', { transform: 'rotate(-12 960 540)' }, S.forme);
    const corps = el('rect', { y: -500, height: 2100 }, g);
    const N = 16, BAS = -450, HAUT = 1530;
    const avant = [...Array(N)].map((_, i) => ({ e: el('circle', {}, g), y: BAS + i * (HAUT - BAS) / (N - 1), o: r(-70, 90), r: r(70, 135), ph: r(0, 6) }));
    const arriere = [...Array(N)].map((_, i) => ({ e: el('circle', {}, g), y: BAS + i * (HAUT - BAS) / (N - 1) + r(-30, 30), o: r(-50, 40), r: r(60, 120), ph: r(0, 6) }));
    const gouttes = [...Array(26)].map(() => ({ e: el('circle', {}, g), ts: r(.05, .8), y: r(BAS + 200, HAUT - 200), vx: r(250, 900), vy: r(-420, 420), r: r(14, 44), vie: r(.3, .55) }));
    const coulures = [...Array(22)].map(() => ({ e: el('circle', {}, g), tr: r(1.3, 1.85), y: r(-150, 1250), r: r(16, 42), d: r(20, 90) }));

    const E = [0, .95], SORTIE = [1.15, 2.05];
    const front = t => -350 + 2700 * doux(clamp((t - E[0]) / (E[1] - E[0])));
    const dos = t => t < SORTIE[0] ? -1e4 : -350 + 2700 * doux(clamp((t - SORTIE[0]) / (SORTIE[1] - SORTIE[0])));

    function rendre(t) {
      const X = front(t), B = dos(t);
      const x0 = Math.max(-600, B);
      corps.setAttribute('x', x0); corps.setAttribute('width', Math.max(0, X - x0));
      avant.forEach(c => { const v = X > B; c.e.setAttribute('cx', X + c.o); c.e.setAttribute('cy', c.y); c.e.setAttribute('r', v ? c.r * (1 + .14 * Math.sin(t * 9 + c.ph)) : 0); });
      arriere.forEach(c => { c.e.setAttribute('cx', B + c.o); c.e.setAttribute('cy', c.y); c.e.setAttribute('r', B > -1e3 ? c.r * (1 + .14 * Math.sin(t * 8 + c.ph)) : 0); });
      gouttes.forEach(d => {
        const a = t - d.ts, v = a >= 0 && a <= d.vie;
        d.e.setAttribute('cx', front(t) + 70 + d.vx * a); d.e.setAttribute('cy', d.y + d.vy * a + 600 * a * a);   // giclent devant la vague
        d.e.setAttribute('r', v ? d.r * (1 - a / d.vie) : 0);
      });
      coulures.forEach(d => {
        const a = t - d.tr, v = a >= 0 && a <= .7;
        d.e.setAttribute('cx', dos(d.tr) - d.d); d.e.setAttribute('cy', d.y + 2200 * a * a);
        d.e.setAttribute('r', v ? d.r * (1 - a / .7) : 0);
      });
      medaillonA(S.medaillon, t, .78, 1.3);
    }
    return { rendre, duree: 2.1, milieu: 1.05 };
  }

  // =================================================================
  // GOUTTES : un rideau de peinture blanche coule du haut, puis tombe
  // =================================================================
  function gouttes(svg, { avatar, graine = 5 } = {}) {
    const r = hasard(graine), S = socle(svg, avatar);
    const g = el('g', {}, S.forme);
    const K = 17, pas = 2140 / K;
    const colonnes = [...Array(K)].map((_, k) => ({ x: -110 + k * pas, l: pas * 1.02, d: r(0, .3), s: r(.55, .8) }));
    const fines = [...Array(12)].map(() => ({ x: r(0, 1920), l: r(22, 40), d: r(.02, .22), s: r(.3, .45) }));
    [...colonnes, ...fines].forEach(c => { c.rect = el('rect', { x: c.x, y: -400, width: c.l }, g); c.bout = el('circle', { cx: c.x + c.l / 2 }, g); });
    [...Array(22)].forEach((_, i) => el('circle', { cx: -60 + i * 96 + r(-20, 20), cy: -380, r: r(60, 110) }, g));

    const SORTIE = [1.25, 2.15];
    function rendre(t) {
      [...colonnes, ...fines].forEach(c => {
        const q = acc(clamp((t - c.d) / c.s)) * .55 + doux(clamp((t - c.d) / c.s)) * .45;
        const bas = -380 + 1560 * q;
        c.rect.setAttribute('height', Math.max(0, bas + 400));
        c.bout.setAttribute('cy', bas); c.bout.setAttribute('r', t > c.d ? c.l * .62 : 0);
      });
      const Y = 1700 * acc(clamp((t - SORTIE[0]) / (SORTIE[1] - SORTIE[0])));
      g.setAttribute('transform', `translate(0 ${Y.toFixed(1)})`);
      medaillonA(S.medaillon, t, .9, 1.45);
    }
    return { rendre, duree: 2.2, milieu: 1.15 };
  }

  // =================================================================
  // POP ART : cercle néon, trame de points et éclat BD
  // =================================================================
  function pop(svg, { avatar } = {}) {
    const S = socle(svg, avatar);
    const g = S.fond;
    const onde = el('circle', { cx: 960, cy: 540, fill: 'none', stroke: '#fff', 'stroke-width': 36 }, g);
    const disque = el('circle', { cx: 960, cy: 540, fill: 'var(--violet)' }, g);
    const points = el('circle', { cx: 960, cy: 540, fill: S.trame }, g);
    const branches = 18, pts = [];
    for (let i = 0; i < branches * 2; i++) {
      const a = i / (branches * 2) * Math.PI * 2, rr = i % 2 ? 330 : 560 + (i % 4 === 0 ? 90 : 0);
      pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`);
    }
    const eclat = el('g', {}, g);
    el('polygon', { points: pts.join(' '), fill: 'var(--encre)', transform: 'translate(14 14)' }, eclat);
    el('polygon', { points: pts.join(' '), fill: '#fff', stroke: 'var(--encre)', 'stroke-width': 10, 'stroke-linejoin': 'round' }, eclat);

    function rendre(t) {
      const entre = p => rebond(clamp(p)), sortie = p => 1 - acc(clamp(p));
      const R = 1250 * entre(t / .45) * sortie((t - 1.0) / .45);
      disque.setAttribute('r', Math.max(0, R));
      points.setAttribute('r', Math.max(0, 1250 * entre((t - .08) / .45) * sortie((t - .95) / .45)));
      const on = clamp(t / .6);
      onde.setAttribute('r', 1400 * doux(on)); onde.setAttribute('opacity', (1 - on).toFixed(3));
      const k = entre((t - .22) / .35) * sortie((t - .92) / .3);
      eclat.setAttribute('transform', `translate(960 540) scale(${Math.max(0, k).toFixed(3)}) rotate(${(t * 25).toFixed(1)})`);
      medaillonA(S.medaillon, t, .35, 1.1);
    }
    return { rendre, duree: 1.55, milieu: .75 };
  }

  const types = { splash, gouttes, pop };
  return {
    creer(svg, type, options) { return types[type](svg, options); },
    // Joue une transition une fois ; renvoie une promesse résolue à la fin
    jouer(tr, { debut = 0 } = {}) {
      return new Promise(fini => {
        const t0 = performance.now() - debut * 1000;
        (function image() {
          const t = (performance.now() - t0) / 1000;
          tr.rendre(Math.min(t, tr.duree));
          if (t < tr.duree) requestAnimationFrame(image); else fini();
        })();
      });
    },
  };
})();
