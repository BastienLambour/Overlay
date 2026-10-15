/* =====================================================================
   CODEX-STREAM — le cœur : la partie CodexVTT (mode spectateur, lecture seule) pour une page de stream.
     const cs = CodexStream.brancher({ adresse, cle, filtre, monPerso, demo, accent })
       adresse  : celle de CodexVTT (défaut : l'origine de la page, quand elle est servie par CodexVTT)
       cle      : la clé spectateur de la table
       filtre   : 'neon' | 'sticker' | 'ecusson' | 'vitrail' | 'aplat' (Filtres.liste)
       monPerso : id de fiche ou nom : « mon » personnage (moi: true) ; demo : true = une partie inventée, sans CodexVTT
     cs.on('etat', e => …)      'connexion' | 'en-ligne' | 'refusee' | 'revoquee' | 'hors-ligne' | 'demo'
     cs.on('table', persos => …)    [{ id, nom, pv, pvMax, aTerre, forme, apparence, joueur, moi }]
     cs.on('perso', perso => …)     un perso qui change (PV, forme, apparence…)
     cs.on('coup', (perso, delta) => …)
     cs.on('jet', jet => …)         { persoId, nom, libelle, formule, resultat, dd, des, verdict, geste, mot, pnj, moi }
     cs.on('combat', c => …)        { tour, actif, ordre: [{ id, nom, init, pnj, persoId }] } ou null
     cs.on('parle', (perso, oui) => …)
     const p = cs.portrait(el, persoId, { cadrage })  le personnage dessiné dans el, animé tout seul (parle, K.O., forme) ; p.detruire()
     const s = cs.scenette(el, { duree, pnj, seulement, pied }) joue chaque jet dans le rectangle el (un à la fois) ; s.detruire()
       (pied: true → le personnage en pied, sur le squelette de Patagrain : la mise en scène de l'arène)
     cs.parle(persoId, oui)                           relai d'un bot Discord ; cs.dessin(persoId, options) → <svg> ; cs.fermer()
   Sans se brancher : CodexStream.fiche(perso) · CodexStream.dessiner(fiche, { filtre, expression, forme, cadrage })
     CodexStream.code(fiche) → « PERSO1-… » (l'apparence en une ligne) · CodexStream.depuisCode(texte) → la fiche (ou null)
     CodexStream.Scenette.jouer(el, jet, { dessin, zone, carte }) · CodexStream.themes() / .theme(id) · .Filtres · .Apparence
   ===================================================================== */
const CodexStream = (() => {
  const normaliser = t => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const memeNom = (a, b) => { const x = normaliser(a), y = normaliser(b); return !!x && !!y && (x === y || x.startsWith(y + ' ') || y.startsWith(x + ' ') || x.split(' ')[0] === y.split(' ')[0]); };
  const DENOUEMENT = 1500;     // les dés 3D de CodexVTT se posent ~1,5 s après le lancer

  // ---------- Lire un jet : quel geste (d'après la compétence), quel verdict, quel mot ----------
  // Libellés de CodexVTT : compétences D&D 5e, traits Daggerheart, caractéristiques COF2. La première ligne qui correspond l'emporte.
  const COMPETENCES = [
    [/athlet|acrobat|course|agilit|bondir|sauter|esquive/, 'courir'], [/escalad|grimp/, 'grimper'], [/discret|furtiv|cacher|dissimul/, 'cacher'],
    [/escamot|crochet|serrur|desamorc|piege|vol a la tire|outils|finesse/, 'crocheter'], [/investig|fouill|cherch/, 'crocheter'],
    [/arcane|histoire|religion|connaiss|savoir|erudi|lire|dechiffr|nature|medecin|intellig/, 'lire'],
    [/percept|perspica|survie|instinct|observ|pister|vigilan/, 'observer'], [/intimid/, 'menacer'],
    [/persua|tromper|bluff|diplom|negoci|charme|charisme|presence|dressage|commander/, 'parler'], [/represent|musique|chant|danse|spectacle/, 'danser'],
    [/constitution|volonte|endur|resist/, 'parer'], [/sort|magie|incant|focus|rituel|pouvoir/, 'sort'],
    [/arc|arbalet|fronde|lancer|jet|tir|distance/, 'tirer'], [/force|puissance/, 'frapper'],
  ];
  function geste(j) {
    if (j.kind === 'heal') return 'soigner';
    if (j.kind === 'save') return 'parer';
    if (j.kind === 'initiative') return 'garde';
    const l = normaliser(j.label);
    for (const [m, g] of COMPETENCES) if (m.test(l)) return g;
    return j.kind === 'attack' || j.kind === 'damage' ? 'frapper' : 'neutre';
  }
  function verdict(j) {
    if (j.isCritSuccess || j.dhOutcome === 'critical') return 'crit';
    if (j.isCritFail) return 'fumble';
    if (j.isSuccess === true) return 'ok';
    if (j.isSuccess === false) return 'rate';
    return '';
  }
  const MOTS = { crit: 'Critique !', fumble: 'Échec critique…', ok: 'Réussite !', rate: 'Échec…' };
  const MOTS_ATTAQUE = { ok: 'Touché !', rate: 'Raté…' };

  // Un aventurier encapuchonné, à une couleur tirée de son nom, pour un perso sans apparence
  const TEINTES = ['#4F7CAC', '#2F7A4F', '#8E3A3A', '#7A5A9C', '#B07A2E', '#2E8A8A', '#9C4F7A', '#5E6E8C'];
  const aventurier = (nom, couleur) => ({ id: 'aventurier', nom, tenue: { type: 'cape', couleur: couleur || TEINTES[[...String(nom)].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 9973, 7) % TEINTES.length] },
    accessoire: 'capuche', yeux: { couleur: '#3A2A1A' } });

  // Le client Socket.IO : déjà là (window.io), sinon le fichier livré à côté de ce module
  function chargerIo(base) {
    if (typeof io === 'function') return Promise.resolve(io);
    return new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = new URL('socket.io.min.js', base).href;
      s.onload = () => ok(window.io); s.onerror = () => ko(new Error('socket.io.min.js introuvable'));
      document.head.appendChild(s);
    });
  }

  function brancher(o = {}) {
    const options = { adresse: '', cle: '', filtre: 'aplat', monPerso: '', demo: false, accent: '', ...o };
    const ecouteurs = {};
    const emettre = (nom, ...a) => (ecouteurs[nom] || []).forEach(f => { try { f(...a); } catch (e) { console.error('[CodexStream]', nom, e); } });
    let persos = [], combat = null, socket = null, minuteurDemo = null;
    const parlent = new Set(), portraits = new Set();
    const adresse = String(options.adresse || (typeof location !== 'undefined' ? location.origin : '')).replace(/\/+$/, '');
    const url = chemin => !chemin ? '' : /^(https?:|data:)/.test(chemin) ? chemin : adresse + '/' + String(chemin).replace(/^\/+/, '');
    const voulu = String(options.monPerso ?? '').trim();
    const estMoi = c => !!voulu && (/^\d+$/.test(voulu) ? String(c.id) === voulu : memeNom(c.name, voulu));
    const persoDe = c => ({
      id: c.id, nom: c.name || 'Aventurier', pv: c.hp ?? null, pvMax: c.hpMax ?? null, stress: c.stress ?? null, stressMax: c.stressMax ?? null,
      aTerre: !!c.down || (c.hpMax > 0 && c.hp <= 0), forme: c.form || '', portrait: url(c.portrait),
      apparence: c.appearance && typeof c.appearance === 'object' ? c.appearance : null, joueur: c.player ? (c.player.name || '') : '', moi: estMoi(c),
    });
    const trouver = id => persos.find(p => String(p.id) === String(id));
    const trouverJet = j => (j.sheetId != null && trouver(j.sheetId)) || persos.find(p => memeNom(j.characterName, p.nom)) || null;
    const majPortraits = id => portraits.forEach(p => { if (id == null || String(p.id) === String(id)) p.maj(); });

    // ---------- Les événements de CodexVTT ----------
    const R = {
      state(e) {
        persos = (e.characters || []).map(persoDe).sort((a, b) => b.moi - a.moi);
        emettre('table', persos); majPortraits(); R.combat(e.combat);
      },
      character(c) {
        const i = persos.findIndex(p => String(p.id) === String(c.id)), p = persoDe(c);
        if (i < 0) { persos.push(p); persos.sort((a, b) => b.moi - a.moi); emettre('table', persos); }
        else { if (!p.apparence && persos[i].apparence && c.appearance === undefined) p.apparence = persos[i].apparence; persos[i] = p; emettre('perso', p); }
        majPortraits(p.id);
      },
      removed({ id }) { persos = persos.filter(p => String(p.id) !== String(id)); emettre('table', persos); },
      hp(h) {
        const p = trouver(h.sheetId); if (!p) return;
        Object.assign(p, { pv: h.hp, pvMax: h.hpMax, aTerre: h.hpMax > 0 && h.hp <= 0 });
        emettre('perso', p); if (h.delta) emettre('coup', p, h.delta); majPortraits(p.id);
      },
      combat(cb) {
        combat = cb && cb.isActive ? {
          tour: cb.round, actif: cb.currentId,
          ordre: (cb.order || []).map(x => ({ id: x.id, nom: x.name, init: x.initiative, pnj: !!x.isNpc, persoId: x.sheetId ?? null })),
        } : null;
        emettre('combat', combat);
      },
      roll(j) {
        const p = trouverJet(j), v = verdict(j), attaque = j.kind === 'attack' || j.kind === 'damage';
        emettre('jet', {
          persoId: p ? p.id : null, nom: p ? p.nom : j.characterName, libelle: j.label || 'Jet', formule: j.formula || '', resultat: j.result,
          dd: j.nd ?? null, des: j.rolls || [], faces: j.sides || 20, verdict: v, geste: geste(j),
          mot: (attaque && MOTS_ATTAQUE[v]) || MOTS[v] || { hope: 'Espoir', fear: 'Peur' }[j.dhOutcome] || '',
          pnj: j.isNpc === true || (!p && j.isNpc !== false && j.sheetId != null), moi: !!(p && p.moi),
        });
      },
    };

    // ---------- La connexion (ou la démo) ----------
    if (options.demo) { emettre('etat', 'demo'); setTimeout(() => demo(R), 0); }
    else if (!adresse || !options.cle) setTimeout(() => emettre('etat', 'refusee'), 0);
    else {
      emettre('etat', 'connexion');
      chargerIo(typeof import.meta !== 'undefined' ? import.meta.url : location.href).then(io => {
        socket = io(adresse + '/spectator', { path: '/socket.io', transports: ['websocket'], auth: { spectatorKey: options.cle }, reconnectionDelay: 5000, reconnectionDelayMax: 60000 });
        socket.on('connect', () => emettre('etat', 'en-ligne'));
        socket.on('disconnect', raison => { emettre('etat', raison === 'io server disconnect' ? 'refusee' : 'hors-ligne'); if (raison === 'io server disconnect') setTimeout(() => socket.connect(), 60000); });
        socket.on('connect_error', () => emettre('etat', 'hors-ligne'));
        socket.on('revoked', () => { emettre('etat', 'revoquee'); socket.io.opts.reconnection = false; });
        socket.on('state', R.state); socket.on('character', R.character); socket.on('character:removed', R.removed);
        socket.on('hp', R.hp); socket.on('combat', R.combat); socket.on('roll', R.roll);
      }).catch(e => { console.error('[CodexStream]', e); emettre('etat', 'hors-ligne'); });
    }

    // Une partie inventée : une table, des jets, des coups, des voix au hasard
    function demo(R) {
      const ex = typeof PERSOS !== 'undefined' ? PERSOS : [];
      const noms = ['Kenai', 'Namerya', 'Zokhran', 'Trayss'];
      const fiches = noms.map((nom, i) => ({ id: 100 + i, name: nom, hp: 20 + i * 4, hpMax: 20 + i * 4, form: null, down: false, appearance: ex.find(p => memeNom(p.nom, nom)) || undefined }));
      R.state({ characters: fiches, combat: { isActive: true, round: 1, currentId: 'c0', order: fiches.map((f, i) => ({ id: 'c' + i, name: f.name, initiative: 20 - i, isNpc: false, sheetId: f.id })) } });
      const tirages = [['skill', 'Athlétisme', '1d20+5', 15], ['skill', 'Discrétion', '1d20+3'], ['attack', 'Épée longue', '1d20+6', 13], ['skill', 'Persuasion', '1d20+2', 12], ['heal', 'Soins', '2d8+3'], ['skill', 'Arcanes', '1d20+4', 14]];
      let n = 0;
      const lancer = () => {
        const f = fiches[n % fiches.length], [kind, label, formula, nd] = tirages[n % tirages.length], d = 1 + Math.floor(Math.random() * 20), bonus = Number((formula.match(/\+(\d+)/) || [])[1] || 0);
        R.roll({ sheetId: f.id, isNpc: false, characterName: f.name, kind, label, formula, result: d + bonus, rolls: [d], sides: 20, nd, isCritSuccess: d === 20, isCritFail: d === 1, ...(nd ? { isSuccess: d + bonus >= nd } : {}) });
        if (n % 3 === 2) { const c = fiches[(n + 1) % fiches.length], delta = -(1 + Math.floor(Math.random() * 6)); c.hp = Math.max(0, c.hp + delta); R.hp({ sheetId: c.id, delta, hp: c.hp, hpMax: c.hpMax }); }
        n++;
      };
      const voix = () => { persos.forEach(p => api.parle(p.id, false)); if (Math.random() > .2 && persos.length) api.parle(persos[Math.floor(Math.random() * persos.length)].id, true); };
      setTimeout(lancer, 1500);
      minuteurDemo = [setInterval(lancer, 6000), setInterval(voix, 1400)];
    }

    // ---------- Le dessin d'un perso, au filtre choisi ----------
    // l'apparence liée dans le labo de CodexVTT ; en démo seulement, les exemples ; sinon un aventurier encapuchonné
    const ficheDe = p => p.apparence || (options.demo && Apparence.trouver(p.nom)) || aventurier(p.nom);
    const dessin = (id, d = {}) => {
      const p = typeof id === 'object' ? id : trouver(id); if (!p) return '';
      const expression = d.expression ?? (p.aTerre ? 'ko' : '');
      return Filtres.rendu(d.filtre || options.filtre, ficheDe(p), { forme: p.forme, expression, cadrage: d.cadrage, accent: options.accent });
    };

    const api = {
      on(nom, f) { (ecouteurs[nom] = ecouteurs[nom] || []).push(f); if (nom === 'table' && persos.length) f(persos); return api; },
      persos: () => persos.slice(),
      combat: () => combat,
      dessin,
      // Le perso dessiné dans el, animé tout seul : la bouche quand il parle, K.O. à 0 PV, sa forme
      portrait(el, id, { cadrage = 'buste' } = {}) {
        let bouche = null, ouverte = false;
        const p = {
          id, maj() {
            const q = trouver(id);
            if (!q) { el.innerHTML = ''; return; }
            el.innerHTML = dessin(q, { cadrage, expression: q.aTerre ? 'ko' : ouverte ? 'parle' : '' });
            const svg = el.firstElementChild; if (svg) Object.assign(svg.style, { width: '100%', height: '100%', display: 'block' });
            el.classList.toggle('cs-parle', parlent.has(String(id)));
          },
          parler(oui) {
            if (oui && !bouche) bouche = setInterval(() => { ouverte = !ouverte; p.maj(); }, 170);
            if (!oui && bouche) { clearInterval(bouche); bouche = null; ouverte = false; }
            p.maj();
          },
          detruire() { clearInterval(bouche); portraits.delete(p); el.innerHTML = ''; },
        };
        portraits.add(p); p.maj();
        return p;
      },
      // Joue chaque jet dans el, un à la fois
      scenette(el, { duree = 4000, pnj = false, seulement = null, pied = false } = {}) {   // seulement : j => true pour garder ce jet (ex. un seul perso)
        const file = []; let occupe = false, vivant = true;
        const suivant = async () => {
          if (occupe || !file.length || !vivant) return;
          occupe = true;
          const j = file.shift(), p = trouver(j.persoId) || { nom: j.nom, forme: '' };
          try { await Scenette.jouer(el, j, { duree: file.length ? Math.min(duree, 2500) : duree, denouement: DENOUEMENT, pied, dessin: e => dessin(p, { expression: e, cadrage: pied ? 'pied' : undefined }) }); }
          catch (e) { console.error('[CodexStream] scénette', e); }
          finally { occupe = false; suivant(); }
        };
        const surJet = j => { if (j.pnj && !pnj) return; if (seulement && !seulement(j)) return; file.push(j); suivant(); };
        api.on('jet', surJet);
        return { detruire() { vivant = false; ecouteurs.jet = (ecouteurs.jet || []).filter(f => f !== surJet); } };
      },
      parle(id, oui) {
        const k = String(id), avant = parlent.has(k);
        if (oui) parlent.add(k); else parlent.delete(k);
        if (avant === !!oui) return;
        portraits.forEach(p => { if (String(p.id) === k) p.parler(!!oui); });
        const q = trouver(id); if (q) emettre('parle', q, !!oui);
      },
      fermer() { if (socket) socket.close(); (minuteurDemo || []).forEach(clearInterval); portraits.forEach(p => p.detruire()); },
    };
    return api;
  }

  // ---------- Dessiner SANS se brancher (les overlays de la famille ont leur propre moteur, js/partie.js) ----------
  // fiche(perso, { catalogue, nom }) → l'apparence à dessiner : celle de CodexVTT (perso.apparence), sinon le catalogue
  //   (par le nom : Apparence.trouver, catalogue PROVISOIRE en attendant le créateur de CodexVTT), sinon un aventurier encapuchonné
  //   (à la couleur perso.couleur, ou tirée de son nom)
  // dessiner(fiche, { filtre, expression, forme, cadrage, accent }) → <svg>
  //   (aventurier: false → null à la place : l'appelant garde alors le portrait de la fiche CodexVTT)
  function fiche(p = {}, { catalogue = true, nom = '', aventurier: secours = true } = {}) {
    return p.apparence || (catalogue && Apparence.trouver(p.nom, p.nomCodex, nom)) || (secours ? aventurier(p.nom || nom || '?', p.couleur) : null);
  }
  const dessiner = (f, { filtre = 'aplat', ...o } = {}) => Filtres.rendu(filtre, f, o);

  // ---------- Thèmes : couleurs, police et filtre d'un coup (widgets : ?theme=…) ; noms génériques ----------
  const THEMES = {
    neon: { nom: 'Néon', filtre: 'neon', accent: '#1EE88A', fond: '#050607', texte: '#F2F5F3', police: 'Righteous' },
    conte: { nom: 'Conte', filtre: 'conte', accent: '#F5B82E', fond: '#152238', texte: '#FFF3DC', police: 'Grenze Gotisch' },
    mission: { nom: 'Mission', filtre: 'ecusson', accent: '#FF9F1C', fond: '#0B0E13', texte: '#E6EAEE', police: 'Barlow Condensed' },
    comics: { nom: 'Comics', filtre: 'sticker', accent: '#FF4FD8', fond: '#12081F', texte: '#F6EEFF', police: 'Bungee' },
  };

  return { brancher, filtres: () => Filtres.liste, themes: () => Object.entries(THEMES).map(([id, t]) => ({ id, ...t })), theme: id => THEMES[id] || null,
    fiche, dessiner, code: f => Apparence.code(f), depuisCode: t => Apparence.depuisCode(t), Scenette, Filtres, Apparence, Squelette, Arene,
    version: typeof VERSION !== 'undefined' ? VERSION : 'dev', DENOUEMENT };
})();
