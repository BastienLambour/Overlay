/* =====================================================================
   SON — petit carillon doux généré à la volée (aucun fichier audio).
   Un son différent pour chaque alerte, pour les reconnaître à l'oreille
   en jouant. On peut aussi mettre ses propres fichiers : config.js ›
   alertes.sons (ou reglages.html › Sons des alertes).
   Dans OBS, coche « Contrôler l'audio via OBS » sur la source des alertes.
   ===================================================================== */
const Son = (() => {
  const C = (window.CONFIG || {}).alertes || {};
  const VOLUME = 1;         // niveau de base des sons fabriqués (plus fort : on baisse dans OBS si besoin)
  const RENFORT = 2;        // gain final, avant le limiteur
  let ctx, sortieCtx, sortieNoeud;

  // Sortie commune : gain fort + limiteur (compresseur) qui empêche la saturation
  // quand plusieurs notes se superposent. Pour baisser : le mélangeur audio d'OBS,
  // ou config.js › alertes.volume.
  function sortie() {
    if (sortieCtx !== ctx) {
      const g = ctx.createGain(), lim = ctx.createDynamicsCompressor();
      g.gain.value = RENFORT;
      lim.threshold.value = -10; lim.knee.value = 4; lim.ratio.value = 20;
      lim.attack.value = 0.002; lim.release.value = 0.2;
      g.connect(lim).connect(ctx.destination);
      sortieCtx = ctx; sortieNoeud = g;
    }
    return sortieNoeud;
  }

  function note(t, freq, duree, volume) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain();
    o.type = 'sine'; o2.type = 'triangle';
    o.frequency.setValueAtTime(freq, t); o2.frequency.setValueAtTime(freq * 2, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    g2.gain.value = 0.18;
    o.connect(g); o2.connect(g2).connect(g); g.connect(sortie());
    o.start(t); o2.start(t); o.stop(t + duree + 0.05); o2.stop(t + duree + 0.05);
  }

  // Basse qui monte (pour le raid)
  function basse(t, duree, volume) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(55, t); o.frequency.exponentialRampToValueAtTime(110, t + duree);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(volume * 1.5, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree + 0.2);
    o.connect(g).connect(sortie()); o.start(t); o.stop(t + duree + 0.25);
  }

  const suite = (t, notes, pas, duree, v) => notes.forEach((f, i) => note(t + i * pas, f, duree, v));

  // Un son par alerte
  const SONS = {
    follow:   (t, v) => suite(t, [784, 1175], 0.11, 0.7, v),
    sub:      (t, v) => suite(t, [659, 784, 988], 0.12, 0.8, v),
    resub:    (t, v) => suite(t, [988, 784, 988, 1319], 0.11, 0.7, v),
    giftsub:  (t, v) => suite(t, [1319, 988, 1175], 0.08, 0.6, v * 0.8),
    giftbomb: (t, v) => suite(t, [523, 659, 784, 1047, 1319, 1568, 2093, 2637], 0.06, 0.6, v * 0.8),
    bits:     (t, v) => { suite(t, [1568, 2093], 0.06, 0.25, v * 0.8); suite(t + 0.18, [1568, 2093], 0.06, 0.25, v * 0.6); },
    raid:     (t, v) => { basse(t, 0.8, v); suite(t + 0.5, [659, 784, 988, 1319], 0.11, 0.9, v); },
    don:      (t, v) => [523, 659, 784].forEach(f => note(t, f, 1.3, v * 0.6)),
    objectif: (t, v) => { suite(t, [659, 784, 988, 1319], 0.11, 0.9, v); [1319, 1568, 1976].forEach(f => note(t + 0.5, f, 1.5, v * 0.5)); },
  };

  // ------------------------------------------------------------------
  // Partie commune aux overlays : choisir le son, ou jouer un fichier.
  // config.js › alertes.sons.<type> : "" = le son de l'overlay ci-dessus,
  // "aucun" = pas de son pour cette alerte, sinon un fichier (ex. "sons/follow.mp3",
  // chemin depuis le dossier de l'overlay, ou chemin complet "C:\…\son.mp3").
  // ------------------------------------------------------------------
  const RACINE = new URL('../', (document.currentScript && document.currentScript.src) || location.href);
  const adresse = f => /^[a-z]:[\\/]/i.test(f) ? 'file:///' + f.replace(/\\/g, '/') : new URL(f.replace(/\\/g, '/'), RACINE).href;

  // jouer(type) : pendant le live · jouer(type, fichier, true) : essai depuis reglages.html
  function jouer(type, fichier, essai = false) {
    if (C.son === false && !essai) return;
    const perso = String(fichier ?? (C.sons || {})[type] ?? '').trim();
    if (perso.toLowerCase() === 'aucun') return;
    const volume = Math.max(0, Math.min(1, Number(C.volume ?? 0.5)));
    if (perso) {
      try {
        const a = new Audio(adresse(perso));
        a.volume = volume;
        a.play().catch(e => console.warn('[Son] impossible de jouer', perso, '—', e.message));
      } catch (e) { console.warn('[Son]', e.message); }
      return;
    }
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      (SONS[type] || SONS.follow)(ctx.currentTime + 0.05, volume * VOLUME);
    } catch (e) { /* audio indisponible : on ignore */ }
  }

  return { jouer, types: Object.keys(SONS) };
})();
