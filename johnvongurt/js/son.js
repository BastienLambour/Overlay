/* =====================================================================
   SONS — petits bips « transmission radio » générés à la volée
   (aucun fichier audio nécessaire). Dans OBS, coche « Contrôler l'audio
   via OBS » sur la source des alertes pour régler le volume.
   ===================================================================== */
const Son = (() => {
  const C = (window.CONFIG || {}).alertes || {};
  let ctx;

  function bip(t, freq, duree, volume, forme = 'square') {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = forme; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + duree + 0.05);
  }

  function souffle(t, duree, volume) {
    const n = ctx.sampleRate * duree, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = 'bandpass'; f.frequency.value = 1800; g.gain.value = volume;
    s.connect(f).connect(g).connect(ctx.destination); s.start(t);
  }

  function jouer(type) {
    if (C.son === false) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const v = (C.volume ?? 0.5) * 0.25, t = ctx.currentTime + 0.05;
      souffle(t, 0.18, v * 0.8);                                  // grésillement radio
      const notes = { raid: [660, 880, 1100, 1320], giftbomb: [880, 1100, 1320, 1760], objectif: [660, 880, 1320, 1760] }[type] || [880, 1320];
      notes.forEach((f, i) => bip(t + 0.2 + i * 0.13, f, 0.12, v, i === notes.length - 1 ? 'sine' : 'square'));
    } catch (e) { /* audio indisponible : on ignore */ }
  }

  return { jouer };
})();
