/* =====================================================================
   SON — petits bruitages « pop » générés à la volée (aucun fichier audio).
   Dans OBS, coche « Contrôler l'audio via OBS » sur la source des alertes
   pour régler le volume.
   ===================================================================== */
const Son = (() => {
  const C = (window.CONFIG || {}).alertes || {};
  let ctx;

  // Note qui glisse d'une fréquence à l'autre (pop, boing…)
  function note(t, de, a, duree, volume, forme = 'sine') {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = forme;
    o.frequency.setValueAtTime(de, t);
    o.frequency.exponentialRampToValueAtTime(a, t + duree * .8);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + duree + 0.05);
  }

  // Éclaboussure : souffle filtré très court
  function splash(t, duree, volume) {
    const n = Math.floor(ctx.sampleRate * duree), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = 'highpass'; f.frequency.value = 1400; g.gain.value = volume;
    s.connect(f).connect(g).connect(ctx.destination); s.start(t);
  }

  function jouer(type) {
    if (C.son === false) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const v = (C.volume ?? 0.5) * 0.35, t = ctx.currentTime + 0.05;
      note(t, 220, 900, 0.12, v);                               // « pop » de la bulle
      splash(t + 0.02, 0.25, v * 0.5);                          // éclaboussure
      const gros = ['raid', 'giftbomb', 'objectif'].includes(type);
      const gamme = gros ? [523, 659, 784, 1047, 1319] : [784, 1047];
      gamme.forEach((f, i) => note(t + 0.16 + i * 0.09, f, f * 1.01, 0.16, v * 0.7, 'triangle'));
      if (gros) note(t + 0.2 + gamme.length * 0.09, 180, 90, 0.4, v * 0.8);   // « boing » final
    } catch (e) { /* audio indisponible : on ignore */ }
  }

  return { jouer };
})();
