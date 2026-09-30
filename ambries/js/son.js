/* =====================================================================
   SON — petits bruitages « pop » générés à la volée (aucun fichier audio).
   Un son différent pour chaque alerte, pour les reconnaître à l'oreille
   en jouant. On peut aussi mettre ses propres fichiers : config.js ›
   alertes.sons (ou reglages.html › Sons des alertes).
   Dans OBS, coche « Contrôler l'audio via OBS » sur la source des alertes
   pour régler le volume.
   ===================================================================== */
const Son = (() => {
  const C = (window.CONFIG || {}).alertes || {};
  const VOLUME = 0.35;      // niveau de base des sons fabriqués
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

  const pop = (t, v) => { note(t, 220, 900, 0.12, v); splash(t + 0.02, 0.25, v * 0.5); };
  const gamme = (t, notes, pas, v) => notes.forEach((f, i) => note(t + i * pas, f, f * 1.01, 0.16, v, 'triangle'));
  const boing = (t, v) => note(t, 180, 90, 0.4, v);
  const GRANDE = [523, 659, 784, 1047, 1319];

  // Un son par alerte
  const SONS = {
    follow:   (t, v) => { pop(t, v); gamme(t + 0.16, [784, 1047], 0.09, v * 0.7); },
    sub:      (t, v) => { pop(t, v); note(t + 0.15, 400, 1600, 0.5, v * 0.6); note(t + 0.62, 2093, 2093, 0.5, v * 0.5, 'triangle'); }, // sifflet qui monte + ding
    resub:    (t, v) => { pop(t, v); pop(t + 0.16, v * 0.8); gamme(t + 0.34, [1047, 1319], 0.09, v * 0.7); },
    giftsub:  (t, v) => { pop(t, v); gamme(t + 0.14, [2093, 2637, 3136], 0.06, v * 0.5); },
    giftbomb: (t, v) => { for (let i = 0; i < 6; i++) note(t + i * 0.08, 200 + Math.random() * 200, 800 + Math.random() * 500, 0.12, v * 0.8); gamme(t + 0.55, GRANDE, 0.09, v * 0.7); boing(t + 1.05, v * 0.8); },
    bits:     (t, v) => { note(t, 988, 988, 0.08, v * 0.8, 'square'); note(t + 0.08, 1319, 1319, 0.4, v * 0.8, 'square'); },         // pièce de jeu vidéo
    raid:     (t, v) => { pop(t, v); splash(t, 0.5, v * 0.7); gamme(t + 0.16, GRANDE, 0.09, v * 0.7); boing(t + 0.65, v * 0.8); },
    don:      (t, v) => { note(t, 330, 330, 0.18, v * 0.8, 'sawtooth'); note(t + 0.2, 440, 440, 0.45, v * 0.8, 'sawtooth'); },       // « ta-daa » en kazoo
    objectif: (t, v) => { pop(t, v); gamme(t + 0.16, GRANDE, 0.09, v * 0.7); boing(t + 0.65, v * 0.8); [1047, 1319, 1568].forEach(f => note(t + 1.05, f, f, 0.9, v * 0.4, 'triangle')); },
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
