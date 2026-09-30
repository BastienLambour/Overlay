/* =====================================================================
   SON — petit carillon doux généré à la volée (aucun fichier audio).
   Dans OBS, coche « Contrôler l'audio via OBS » sur la source des alertes.
   ===================================================================== */
const Son = (() => {
  const C = (window.CONFIG || {}).alertes || {};
  let ctx;

  function note(t, freq, duree, volume) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain();
    o.type = 'sine'; o2.type = 'triangle';
    o.frequency.setValueAtTime(freq, t); o2.frequency.setValueAtTime(freq * 2, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    g2.gain.value = 0.18;
    o.connect(g); o2.connect(g2).connect(g); g.connect(ctx.destination);
    o.start(t); o2.start(t); o.stop(t + duree + 0.05); o2.stop(t + duree + 0.05);
  }

  function jouer(type) {
    if (C.son === false) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const v = (C.volume ?? 0.5) * 0.3, t = ctx.currentTime + 0.05;
      const grand = ['raid', 'giftbomb', 'objectif'].includes(type);
      const notes = grand ? [659, 784, 988, 1319] : [784, 1175];
      notes.forEach((f, i) => note(t + i * 0.11, f, grand ? 0.9 : 0.7, v));
    } catch (e) { /* audio indisponible : on ignore */ }
  }

  return { jouer };
})();
