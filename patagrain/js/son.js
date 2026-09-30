/* =====================================================================
   SONS — grelots, clochettes et tambour, générés à la volée (aucun
   fichier audio nécessaire). Un son différent pour chaque alerte, pour
   les reconnaître à l'oreille en jouant. On peut aussi mettre ses propres
   fichiers : config.js › alertes.sons (ou reglages.html › Sons des alertes).
   Dans OBS, coche « Contrôler l'audio via OBS » sur la source des alertes
   pour régler le volume.
   ===================================================================== */
const Son = (() => {
  const C = (window.CONFIG || {}).alertes || {};
  const VOLUME = 0.3;       // niveau de base des sons fabriqués
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

  // Un petit bruit filtré (base du grelot et du tambour)
  function bruit(t, duree, volume, filtre, freq, q = 1) {
    const n = Math.floor(ctx.sampleRate * duree), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3;
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = filtre; f.frequency.value = freq; f.Q.value = q; g.gain.value = volume;
    s.connect(f).connect(g).connect(ctx.destination); s.start(t);
  }

  // Un grelot secoué : petit bruit aigu très court + tintement
  function grelot(t, volume) {
    bruit(t, 0.05, volume * 1.4, 'bandpass', 6500, 3);
    clochette(t, 2600 + Math.random() * 900, 0.35, volume * 0.35);
  }

  // Un coup de tambour (grave qui descend + peau)
  function tambour(t, volume) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.25);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(volume * 1.6, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.4);
    bruit(t, 0.08, volume * 0.8, 'lowpass', 500);
  }

  const grelots = (t, n, v) => { for (let i = 0; i < n; i++) grelot(t + i * 0.075 + Math.random() * 0.02, v); };
  const melodie = (t, notes, pas, duree, v) => notes.forEach((f, i) => clochette(t + i * pas, f, duree, v));

  // Un son par alerte
  const SONS = {
    follow:   (t, v) => { grelots(t, 4, v); melodie(t + 0.35, [1568, 2093], 0.14, 1.4, v * 0.7); },                      // ding-ding
    sub:      (t, v) => { tambour(t, v); tambour(t + 0.22, v); melodie(t + 0.45, [1047, 1319, 1568, 2093], 0.16, 1.6, v * 0.7); }, // adoubement
    resub:    (t, v) => { grelots(t, 3, v); melodie(t + 0.3, [1568, 1319, 1568, 2093], 0.15, 1.4, v * 0.7); },
    giftsub:  (t, v) => melodie(t, [3136, 2637, 2093, 2637, 3136], 0.08, 0.9, v * 0.5),                                   // paquet cadeau qui scintille
    giftbomb: (t, v) => { grelots(t, 10, v); melodie(t + 0.6, [1047, 1319, 1568, 2093, 2637], 0.14, 1.6, v * 0.7); melodie(t + 1.4, [3136, 2637, 3136], 0.07, 0.8, v * 0.4); },
    bits:     (t, v) => { for (let i = 0; i < 6; i++) { const u = t + i * 0.09 + Math.random() * 0.03; bruit(u, 0.02, v, 'highpass', 5000); clochette(u, 3300 + Math.random() * 800, 0.3, v * 0.5); } }, // pièces d'or qui tombent
    raid:     (t, v) => { for (let i = 0; i < 8; i++) tambour(t + i * 0.09, v * (0.6 + i * 0.05)); melodie(t + 0.85, [1047, 1319, 1568, 2093, 2637], 0.14, 1.6, v * 0.7); }, // roulement + fanfare
    don:      (t, v) => melodie(t, [523, 659, 784, 1047, 1319], 0.1, 2.2, v * 0.6),                                        // harpe
    objectif: (t, v) => { grelots(t, 6, v); melodie(t + 0.4, [1047, 1319, 1568, 2093, 2637], 0.14, 1.4, v * 0.7); [1047, 1319, 1568].forEach(f => clochette(t + 1.2, f, 2.6, v * 0.5)); },
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
