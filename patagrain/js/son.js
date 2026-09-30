/* =====================================================================
   SONS — tintement de grelots et petite mélodie de clochettes, générés
   à la volée (aucun fichier audio nécessaire). Dans OBS, coche
   « Contrôler l'audio via OBS » sur la source des alertes pour régler le volume.
   ===================================================================== */
const Son = (() => {
  const C = (window.CONFIG || {}).alertes || {};
  let ctx;

  // Une clochette : quelques harmoniques métalliques qui s'éteignent
  function clochette(t, freq, duree, volume) {
    [[1, 1], [2.76, .45], [5.4, .22], [8.93, .1]].forEach(([ratio, part]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(freq * ratio, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(volume * part, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + duree / ratio ** .4);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + duree + 0.05);
    });
  }

  // Un grelot secoué : petit bruit aigu très court + tintement
  function grelot(t, volume) {
    const n = Math.floor(ctx.sampleRate * 0.05), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3;
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = 'bandpass'; f.frequency.value = 6500; f.Q.value = 3; g.gain.value = volume * 1.4;
    s.connect(f).connect(g).connect(ctx.destination); s.start(t);
    clochette(t, 2600 + Math.random() * 900, 0.35, volume * 0.35);
  }

  const MELODIES = {
    petite:   [1568, 2093],                       // sol, do
    grande:   [1047, 1319, 1568, 2093, 2637],     // do mi sol do mi : petite fanfare
  };

  function jouer(type) {
    if (C.son === false) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const v = (C.volume ?? 0.5) * 0.3, t = ctx.currentTime + 0.05;
      const grande = ['raid', 'giftbomb', 'objectif'].includes(type);
      for (let i = 0; i < (grande ? 7 : 4); i++) grelot(t + i * 0.075 + Math.random() * 0.02, v);
      (grande ? MELODIES.grande : MELODIES.petite).forEach((f, i) => clochette(t + 0.35 + i * 0.14, f, 1.4, v * 0.7));
    } catch (e) { /* audio indisponible : on ignore */ }
  }

  return { jouer };
})();
