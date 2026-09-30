/* =====================================================================
   SONS — petits bips « transmission radio » générés à la volée (aucun
   fichier audio nécessaire). Un son différent pour chaque alerte, pour
   les reconnaître à l'oreille en jouant. On peut aussi mettre ses propres
   fichiers : config.js › alertes.sons (ou reglages.html › Sons des alertes).
   Dans OBS, coche « Contrôler l'audio via OBS » sur la source des alertes
   pour régler le volume.
   ===================================================================== */
const Son = (() => {
  const C = (window.CONFIG || {}).alertes || {};
  const VOLUME = 0.25;      // niveau de base des sons fabriqués
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

  // Grésillement radio (ou souffle de réacteur, en plus long et plus grave)
  function souffle(t, duree, volume, freq = 1800) {
    const n = Math.floor(ctx.sampleRate * duree), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; g.gain.value = volume;
    s.connect(f).connect(g).connect(ctx.destination); s.start(t);
  }

  // Sirène d'alarme : une note qui monte et descend
  function sirene(t, fois, volume) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(500, t);
    for (let i = 0; i < fois; i++) { o.frequency.linearRampToValueAtTime(1000, t + i * 0.6 + 0.3); o.frequency.linearRampToValueAtTime(500, t + i * 0.6 + 0.6); }
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(volume * 0.5, t + 0.05);
    g.gain.setValueAtTime(volume * 0.5, t + fois * 0.6 - 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + fois * 0.6);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + fois * 0.6 + 0.05);
  }

  const bips = (t, notes, pas, duree, v) => notes.forEach((f, i) => bip(t + i * pas, f, duree, v, i === notes.length - 1 ? 'sine' : 'square'));

  // Un son par alerte
  const SONS = {
    follow:   (t, v) => { souffle(t, 0.18, v * 0.8); bips(t + 0.2, [880, 1320], 0.13, 0.12, v); },
    sub:      (t, v) => { souffle(t, 0.18, v * 0.8); bips(t + 0.2, [660, 880, 1320], 0.12, 0.1, v); bip(t + 0.6, 1760, 0.45, v, 'sine'); },
    resub:    (t, v) => { souffle(t, 0.12, v * 0.6); [0.06, 0.06, 0.22].forEach((d, i) => bip(t + 0.15 + i * 0.13, 1100, d, v)); },   // morse ..—
    giftsub:  (t, v) => { for (let i = 0; i < 4; i++) bip(t + i * 0.1, i % 2 ? 990 : 1320, 0.09, v, 'sine'); },               // double tonalité
    giftbomb: (t, v) => { souffle(t, 0.2, v * 0.8); bips(t + 0.2, [660, 740, 880, 990, 1100, 1320, 1480, 1760], 0.07, 0.07, v); },
    bits:     (t, v) => { bip(t, 988, 0.07, v); bip(t + 0.08, 1319, 0.35, v); },                                                 // pièce d'arcade
    raid:     (t, v) => { sirene(t, 2, v); bips(t + 1.25, [660, 880, 1100, 1320], 0.13, 0.12, v); },                            // alarme
    don:      (t, v) => [660, 880, 1100].forEach(f => bip(t, f, 1, v * 0.5, 'sine')),                                         // accord doux
    objectif: (t, v) => { [0, 0.35, 0.7].forEach(d => bip(t + d, 660, 0.1, v)); bip(t + 1.05, 1320, 0.7, v, 'sine'); souffle(t + 1.05, 1.4, v * 1.2, 600); }, // 3, 2, 1… décollage
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
