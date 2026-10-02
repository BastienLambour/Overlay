/* =====================================================================
   AMBIANCE — les sons des scènes « démarrage » et « fin ».
   Les sons sont des fichiers dans assets/audio/ (preparation, chauffe, decollage, propulseur,
   atterrissage, musique) : pour en changer, remplace le fichier en gardant le même nom (.ogg).
   La voix du compte à rebours : TES fichiers assets/audio/voix/15.mp3 … 1.mp3 et 0.mp3 (décollage).
   Un fichier absent = silence : aucune voix synthétique n'est utilisée.
   Dans OBS, coche « Contrôler l'audio via OBS » sur la source de la scène pour régler son volume.
   Réglages : config.js › audio (actif, volume, volume de ta voix…). Dans l'adresse : ?audio=0 coupe tout, ?volume=0.4.
   ===================================================================== */
const Ambiance = (() => {
  const C = (window.CONFIG || {}).audio || {};
  const params = new URLSearchParams(location.search);
  const dossier = new URL('../assets/audio/', document.currentScript ? document.currentScript.src : location.href).href;

  const actif = C.actif !== false && params.get('audio') !== '0';
  const nombre = (v, defaut) => (v === null || v === undefined || v === '' || isNaN(parseFloat(v))) ? defaut : parseFloat(v);
  const clamp = v => Math.min(1, Math.max(0, v));
  const general = clamp(nombre(params.get('volume'), nombre(C.volume, 0.7)));

  const pistes = new Set();
  let bloque = false;

  // --- Une piste = un son (ou une boucle). Son volume et sa vitesse changent en douceur. ---
  function creerPiste(nom, { volume = 1, boucle = false, fondu = 0, vitesse = 1 } = {}) {
    const p = {
      nom, boucle, vol: fondu > 0 ? 0 : volume, cible: volume, pente: Infinity, vitesse, instances: [], fini: false,
      regler(v, ms = 0) { p.cible = clamp(v); p.pente = ms > 0 ? Math.abs(p.cible - p.vol) / (ms / 1000) : Infinity; },
      allure(v) { p.vitesse = v; p.instances.forEach(i => { i.el.playbackRate = v; }); },
      arreter(ms = 400) { p.fini = true; p.regler(0, ms); },
    };
    if (fondu > 0) p.regler(volume, fondu * 1000);
    pistes.add(p);
    surveiller();
    lancerInstance(p);
    return p;
  }

  function lancerInstance(p, entree = 0) {
    const el = new Audio(dossier + p.nom + '.ogg');
    el.preload = 'auto'; el.playbackRate = p.vitesse;
    try { el.preservesPitch = false; } catch (e) {}   // la vitesse change aussi la hauteur : le grondement monte
    const inst = { el, g: entree > 0 ? 0 : 1, gCible: 1, gPente: entree > 0 ? 1 / entree : Infinity, sortant: false };
    el.addEventListener('ended', () => retirer(p, inst));
    el.addEventListener('error', () => retirer(p, inst));
    p.instances.push(inst);
    appliquer(p, inst);
    const lecture = el.play();
    if (lecture && lecture.catch) lecture.catch(() => { bloque = true; });   // navigateur normal : attend un clic (OBS le permet d'office)
    return inst;
  }

  function retirer(p, inst) {
    try { inst.el.pause(); inst.el.removeAttribute('src'); inst.el.load(); } catch (e) {}
    p.instances = p.instances.filter(i => i !== inst);
    if (!p.instances.length && !p.boucle) pistes.delete(p);
  }

  // Volume réel = général × piste × fondu (racine : les raccords de boucle gardent un volume constant)
  const appliquer = (p, inst) => { try { inst.el.volume = clamp(general * p.vol * Math.sqrt(inst.g)); } catch (e) {} };

  // --- Horloge des fondus (toutes les 50 ms) + raccord des boucles (deux copies qui se chevauchent) ---
  const FONDU_BOUCLE = 1.5;
  const vers = (v, cible, pas) => Math.abs(cible - v) <= pas ? cible : v + Math.sign(cible - v) * pas;
  let horloge = null;
  const surveiller = () => { if (!horloge) horloge = setInterval(fondus, 50); };   // l'horloge ne tourne que pendant qu'un son existe
  function fondus() {
    if (!pistes.size) { clearInterval(horloge); horloge = null; return; }
    const dt = 0.05;
    pistes.forEach(p => {
      p.vol = vers(p.vol, p.cible, p.pente * dt);
      p.instances.slice().forEach(inst => {
        inst.g = vers(inst.g, inst.gCible, inst.gPente * dt);
        appliquer(p, inst);
        if (inst.sortant && inst.g <= 0) retirer(p, inst);
      });
      if (p.boucle && !p.fini) {
        const cur = p.instances.find(i => !i.sortant), d = cur && cur.el.duration;
        if (cur && d && isFinite(d) && d - cur.el.currentTime < FONDU_BOUCLE * (p.vitesse || 1)) {
          cur.sortant = true; cur.gCible = 0; cur.gPente = 1 / FONDU_BOUCLE;
          lancerInstance(p, FONDU_BOUCLE);
        }
      }
      if (p.fini && p.vol <= 0.001) { p.instances.slice().forEach(i => retirer(p, i)); pistes.delete(p); }
    });
  }

  // Navigateur normal : le son ne démarre qu'après un clic ou une touche (pas dans OBS)
  const debloquer = () => {
    if (!bloque) return;
    bloque = false;
    pistes.forEach(p => p.instances.forEach(i => { i.el.play().catch(() => {}); }));
  };
  ['pointerdown', 'keydown'].forEach(e => addEventListener(e, debloquer));

  // --- Jouer un son ---
  // jouer('chauffe', { volume: .5, boucle: true, fondu: 2, vitesse: .9 }) → { regler(vol, ms), allure(v), arreter(ms) }
  function jouer(nom, options = {}) {
    if (!actif) return { regler() {}, allure() {}, arreter() {} };
    const reglage = nombre((C.volumes || {})[nom], 1);     // réglage par son : config.js › audio › volumes
    return creerPiste(nom, { ...options, volume: clamp((options.volume ?? 1) * reglage) });
  }

  // --- La voix du compte à rebours : tes fichiers assets/audio/voix/<nombre>.(mp3|ogg|wav) ---
  // Un fichier absent = silence. Chaque nombre n'est dit qu'UNE fois : une annonce déjà lancée n'est pas relancée.
  const dejaDit = {};                                        // clé → heure de la dernière annonce
  let lue = null;                                            // le fichier de voix en train de passer
  function voix(cle) {
    if (!actif) return;
    if (Date.now() - (dejaDit[cle] || 0) < 3000) return;     // jamais deux fois le même nombre de suite
    dejaDit[cle] = Date.now();
    const vol = clamp(general * nombre(C.voixVolume, 1));

    const essayer = exts => {
      if (!exts.length) return;                              // aucun fichier pour ce nombre : silence
      const a = new Audio(`${dossier}voix/${cle}.${exts[0]}`);
      a.volume = vol;
      let suite = false;                                     // « erreur » ET « play refusé » arrivent ensemble : une seule suite
      const suivant = () => { if (suite) return; suite = true; essayer(exts.slice(1)); };
      a.addEventListener('error', suivant);
      const lecture = a.play();
      if (lecture && lecture.then) lecture.then(() => { lue = a; }, suivant);   // un nombre sans fichier ne coupe pas l'enregistrement en cours
    };
    essayer(['mp3', 'ogg', 'wav']);
  }

  // --- Sons personnalisés AVANT les 15 dernières secondes (config.js › audio › reperes) ---
  // Une ligne = « secondes restantes | fichier » (le fichier est facultatif). Exemples :
  //   "60"                       → joue assets/audio/voix/60.mp3 (ou .ogg / .wav) à T-60 s
  //   "30 | sons/ouverture.mp3"  → joue ce fichier à T-30 s (chemin depuis le dossier de l'overlay, ou « C:\\…\\son.mp3 »)
  // Un repère n'est joué que si le compte à rebours est assez long pour l'atteindre, et une seule fois par lancement.
  const RACINE = new URL('../', document.currentScript ? document.currentScript.src : location.href);
  const adresse = f => /^[a-z]:[\\/]/i.test(f) ? 'file:///' + f.replace(/\\/g, '/') : new URL(f.replace(/\\/g, '/'), RACINE).href;
  const reperes = (Array.isArray(C.reperes) ? C.reperes : []).map(ligne => {
    const [s, ...reste] = String(ligne).split('|');
    const secondes = parseFloat(String(s).replace(',', '.')), fichier = reste.join('|').trim();
    return secondes > 0 ? { s: secondes, fichier, fait: false } : null;
  }).filter(Boolean).sort((a, b) => b.s - a.s);

  function jouerRepere(r) {
    const vol = clamp(general * nombre(C.voixVolume, 1));
    const essayer = urls => {
      if (!urls.length) return console.warn('[Ambiance] repère T-' + r.s + ' : aucun fichier trouvé');
      const a = new Audio(urls[0]); a.volume = vol;
      let suite = false;
      const suivant = () => { if (suite) return; suite = true; essayer(urls.slice(1)); };
      a.addEventListener('error', suivant);
      const lecture = a.play(); if (lecture && lecture.catch) lecture.catch(suivant);
    };
    essayer(r.fichier ? [adresse(r.fichier)] : ['mp3', 'ogg', 'wav'].map(e => `${dossier}voix/${r.s}.${e}`));
  }

  // À appeler à chaque « tic » avec les secondes restantes : joue les repères atteints (jamais un repère déjà dépassé de plus de 3 s)
  function suivreReperes(reste) {
    if (!actif) return;
    reperes.forEach(r => { if (!r.fait && reste <= r.s) { r.fait = true; if (reste > r.s - 3) jouerRepere(r); } });
  }
  const reinitialiserReperes = () => reperes.forEach(r => { r.fait = false; });

  // --- Tout couper (changement de scène) ---
  function tout(ms = 400) {
    pistes.forEach(p => p.arreter(ms));
    if (ms === 0) { pistes.forEach(p => p.instances.slice().forEach(i => retirer(p, i))); pistes.clear(); }
    if (lue) { try { lue.pause(); } catch (e) {} lue = null; }
  }

  return { actif, jouer, voix, tout, reperes, suivreReperes, reinitialiserReperes };
})();
