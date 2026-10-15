/* =====================================================================
   PARTIE — la partie de JDR en cours sur CodexVTT, pour la scène JDR (scenes/jdr.html).
   Le moteur COMMUN : il ne dessine rien. Chaque overlay dessine les cartes et les jets à son style.

   La table vient de CodexVTT (js/codex.js, mode spectateur) : les personnages des joueurs (state.characters),
   avec leur nom, portrait, PV et forme. Rien à recopier à la main dans les réglages.
   « Mon personnage » (config.js › jdr.monPerso : son nom dans CodexVTT, ou l'id de sa fiche) : l'overlay d'un
   JOUEUR met sa carte en avant et joue ses jets en grand. Vide = l'overlay du MJ, ou de quelqu'un qui regarde.

     Partie.brancher({
       table(persos),            // la table a changé (arrivée, perso ajouté ou retiré) : [perso…], « moi » d'abord
       perso(perso, avant),      // un perso a changé (PV, portrait, forme, à terre) ; avant = l'ancienne copie
       coup(perso, delta),       // un coup reçu (delta < 0) ou un soin (delta > 0)
       tour(perso | null, cb),   // à qui c'est le tour de combat (null : un PNJ ou pas de combat) ; cb = le combat brut
       jet(jet),                 // un jet public, déjà lu (voir lire)
       etat(texte),              // « connecté », « déconnecté », « clé révoquée »… (pour un petit voyant)
     })
     perso = { …ta place, id, nom, nomCodex, portrait (adresse complète ou ''), pv, pvMax, stress, stressMax, forme, aTerre, moi, mj,
               apparence (la fiche d'apparence liée dans le labo de CodexVTT, ou null) }
     Partie.lire(jet) → { …jet, perso, moi, pnj, geste, verdict, mot, libelle, resultat }
       perso = sa carte ; null si le personnage n'a pas de carte. Alors inconnu = { id, nom, portrait, apparence, forme }
       si c'est un personnage de joueur de CodexVTT (sans carte, ajouter: false), sinon null (et pnj dit si c'est un PNJ).
       Une scène joue TOUS les jets : perso, sinon inconnu, sinon PNJ / nom du jet.
       geste   : courir, grimper, cacher, crocheter, lire, observer, menacer, parler, danser, parer, sort, tirer,
                 frapper, soigner, garde, neutre (d'après le libellé de la compétence)
       verdict : crit, fumble, ok, rate, ou '' (pas de difficulté donnée : pas de verdict)
       mot     : « Critique ! », « Touché ! », « Échec… »… ; resultat : « 1d20+5 = 17 (DD 15) »
     Partie.persos()  → la table actuelle ; Partie.moi() → mon perso (ou null)
     Partie.placesReglees() → la table réglée de config.js › jdr.mj { nom, discord } + jdr.joueurs [[perso, pseudo Discord]…]
                         (un raccourci : un overlay qui a son propre format de table, ex. Patagrain › jdr.places, passe { places } lui-même)
     Partie.voix((perso, oui) => …) → qui parle sur Discord (js/voix.js, bot « voix » du VPS), d'après le champ discord des places

   TABLE RÉGLÉE (facultative) : Partie.brancher(rappels, { places: [{ nom, mj, fiche, …tes champs }], ajouter })
     ⚠ fiche est RÉSERVÉ : l'id de la fiche CodexVTT (nombre). Tes propres infos (couleur, titre…), range-les sous un autre nom.
     Les places s'affichent TOUT DE SUITE (même sans CodexVTT) ; { mj: true } = une place qui n'est pas un personnage de
     CodexVTT (le MJ). Chaque place se relie à son personnage CodexVTT par fiche (id) ou par le nom, et garde ses champs
     (dessin, pseudo Discord…). Les personnages de CodexVTT absents des places NE s'ajoutent PAS (anciens persos, absents…) :
     ajouter: true pour les ajouter à la fin (réglage commun : config.js › jdr.ajouterAutres). Sans places : toute la table.

   ?test=1 (ou Partie.brancher(…, { demo: true })) : une table de démo et un jet toutes les 6 s, sans CodexVTT.
   Protocole : G:\Projets\Codex\codex-web\docs\SPECTATEUR.md.
   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
const Partie = (() => {
  const J = (window.CONFIG || {}).jdr || {};
  const params = new URLSearchParams(location.search);
  const normaliser = t => String(t ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  // ---------- Lire un jet : quel geste, quel verdict ----------
  // Libellés de CodexVTT (codex-web/public/assets/i18n/fr.json) : compétences D&D 5e, traits Daggerheart, caractéristiques COF2.
  // L'ordre compte : la première ligne qui correspond l'emporte (« arc » de Arcanes est pris avant « arc » de l'arme).
  const COMPETENCES = [
    [/athlet|acrobat|course|agilit|bondir|sauter|esquive/, 'courir'],
    [/escalad|grimp/, 'grimper'],
    [/discret|furtiv|cacher|dissimul/, 'cacher'],
    [/escamot|crochet|serrur|desamorc|piege|vol a la tire|outils|finesse/, 'crocheter'],
    [/investig|fouill|cherch/, 'crocheter'],
    [/arcane|histoire|religion|connaiss|savoir|erudi|lire|dechiffr|nature|medecin|intellig/, 'lire'],
    [/percept|perspica|survie|instinct|observ|pister|vigilan/, 'observer'],
    [/intimid/, 'menacer'],
    [/persua|tromper|bluff|diplom|negoci|charme|charisme|presence|dressage|commander/, 'parler'],
    [/represent|musique|chant|danse|spectacle/, 'danser'],
    [/constitution|volonte|endur|resist/, 'parer'],
    [/sort|magie|incant|focus|rituel|pouvoir/, 'sort'],
    [/arc|arbalet|fronde|lancer|jet|tir|distance/, 'tirer'],
    [/force|puissance/, 'frapper'],
  ];
  function geste(jet) {
    const libelle = normaliser(jet.label);
    if (jet.kind === 'heal') return 'soigner';
    if (jet.kind === 'save') return 'parer';
    if (jet.kind === 'initiative') return 'garde';
    for (const [motif, g] of COMPETENCES) if (motif.test(libelle)) return g;
    if (jet.kind === 'attack' || jet.kind === 'damage') return 'frapper';
    return 'neutre';
  }
  function verdict(jet) {
    if (jet.isCritSuccess || jet.dhOutcome === 'critical') return 'crit';
    if (jet.isCritFail) return 'fumble';
    if (jet.isSuccess === true) return 'ok';
    if (jet.isSuccess === false) return 'rate';
    return '';
  }
  const MOTS = { crit: 'Critique !', fumble: 'Échec critique…', ok: 'Réussite !', rate: 'Échec…' };
  const MOTS_ATTAQUE = { ok: 'Touché !', rate: 'Raté…' };

  // ---------- La table ----------
  // Une liste de persos, dans l'ordre d'affichage. Deux sources :
  //  - la table RÉGLÉE (option places, facultative) : affichée tout de suite, même sans CodexVTT, et qui peut contenir des
  //    places qui ne sont pas des personnages de CodexVTT (le MJ : { mj: true }) ; chaque place garde ses propres champs
  //    (dessin, pseudo Discord…) ; elle se relie à sa fiche CodexVTT par fiche (id) ou par le nom ;
  //  - les personnages de CodexVTT (state.characters) : ils complètent les places, et ceux qui n'y sont pas s'ajoutent à la fin
  //    (sauf ajouter: false).
  let table = [];                        // les persos affichés
  let reglees = [];                      // la table réglée (copie de départ)
  let ajouter = true;
  // Les personnages de CodexVTT reçus mais SANS carte (ajouter: false) : gardés à part, pour que leurs jets soient quand
  // même joués avec leur nom, leur portrait et leur apparence (jet.inconnu)
  let horsTable = new Map();
  const voulu = String(J.monPerso ?? '').trim();
  function estMoi(nom, id) {
    if (!voulu) return false;
    if (/^\d+$/.test(voulu)) return String(id) === voulu;
    const v = normaliser(voulu), n = normaliser(nom);
    return !!n && (n === v || n.startsWith(v + ' ') || v.startsWith(n + ' '));
  }
  // « Kenai le gardien » et « Kenai » : le même
  const memeNom = (a, b) => {
    const x = normaliser(a), y = normaliser(b);
    return !!x && !!y && (x === y || x.startsWith(y + ' ') || y.startsWith(x + ' ') || x.split(' ')[0] === y.split(' ')[0]);
  };
  const copie = p => p && { ...p };
  const VIDE = { id: null, nomCodex: '', apparence: null, portrait: '', pv: null, pvMax: null, stress: null, stressMax: null, forme: '', aTerre: false };
  // Les champs d'un personnage de CodexVTT, posés sur un perso
  function poser(p, c) {
    Object.assign(p, {
      id: c.id, nomCodex: c.name || '',
      portrait: typeof Codex !== 'undefined' && c.portrait ? Codex.url(c.portrait) : (c.portrait || ''),
      pv: c.hp ?? null, pvMax: c.hpMax ?? null, stress: c.stress ?? null, stressMax: c.stressMax ?? null,
      forme: c.form || '', aTerre: !!c.down || (c.hpMax > 0 && c.hp <= 0),
      // l'apparence liée à la fiche dans le labo de CodexVTT (champ facultatif « appearance ») : dessinée par js/codex-stream.js (CodexStream.fiche / .dessiner)
      apparence: c.appearance && typeof c.appearance === 'object' ? c.appearance : (p.apparence || null),
    });
    if (!p.nom) p.nom = c.name || 'Aventurier';
    p.moi = !p.mj && (estMoi(p.nom, p.id) || estMoi(c.name, c.id));
    return p;
  }
  const depart = () => reglees.map(pl => ({ ...VIDE, ...pl, nom: pl.nom || '', mj: !!pl.mj, moi: !pl.mj && estMoi(pl.nom, pl.fiche) }));
  const parId = id => table.find(p => p.id != null && p.id === id);
  // La place d'un personnage de CodexVTT : sa fiche (place.fiche = id), sinon son nom
  // fiche = l'id de la fiche CodexVTT (un nombre, ou un nombre écrit) ; tout autre contenu (objet…) est ignoré : on relie alors par le nom
  const idFiche = p => (typeof p.fiche === 'number' || (typeof p.fiche === 'string' && /^\d+$/.test(p.fiche.trim()))) ? String(p.fiche).trim() : null;
  const placeDe = c => table.find(p => !p.mj && p.id == null
    && (idFiche(p) != null ? idFiche(p) === String(c.id) : memeNom(c.name, p.nom)));
  // Ordre : la table réglée garde son ordre ; sans elle, « moi » d'abord
  const liste = () => reglees.length ? [...table] : [...table].sort((a, b) => (b.moi - a.moi));
  // Le perso d'un jet : par la fiche, sinon par le nom (« Kenai le gardien » → Kenai)
  function persoDe(jet) {
    if (jet.sheetId != null && parId(jet.sheetId)) return parId(jet.sheetId);
    if (!normaliser(jet.characterName)) return null;
    return table.find(p => !p.mj && (memeNom(jet.characterName, p.nom) || (p.nomCodex && memeNom(jet.characterName, p.nomCodex)))) || null;
  }
  // Un personnage de joueur sans carte : { id, nom, portrait, apparence, forme }, ou null
  function inconnuDe(jet) {
    if (jet.sheetId != null && horsTable.has(jet.sheetId)) return horsTable.get(jet.sheetId);
    if (!normaliser(jet.characterName)) return null;
    return [...horsTable.values()].find(i => memeNom(jet.characterName, i.nom)) || null;
  }
  function lire(jet) {
    const perso = persoDe(jet), g = geste(jet), v = verdict(jet);
    const inconnu = perso ? null : inconnuDe(jet);
    const attaque = jet.kind === 'attack' || jet.kind === 'damage';
    return {
      ...jet, perso, inconnu, moi: !!(perso && perso.moi),
      pnj: jet.isNpc === true || (!perso && !inconnu && jet.isNpc !== false && jet.sheetId != null),
      geste: g, verdict: v,
      mot: (attaque && MOTS_ATTAQUE[v]) || MOTS[v] || { hope: 'Espoir', fear: 'Peur' }[jet.dhOutcome] || '',
      libelle: jet.label || 'Jet',
      resultat: `${jet.formula ? jet.formula + ' = ' : ''}${jet.result}${jet.nd ? ` (DD ${jet.nd})` : ''}`,
    };
  }

  // ---------- Brancher ----------
  // options : demo (défaut : ?test=1), places (la table réglée, voir plus haut), ajouter (les persos de CodexVTT hors des places :
  // non par défaut quand il y a des places, sinon on aurait une carte par perso de joueur de la table CodexVTT ; jdr.ajouterAutres)
  function brancher(r = {}, { demo = params.has('test') || params.has('demo'), places = null, ajouter: aj } = {}) {
    const appeler = (nom, ...a) => { if (r[nom]) try { r[nom](...a); } catch (e) { console.error('[Partie]', nom, e); } };
    reglees = Array.isArray(places) ? places.map(copie) : [];
    // (démo sans joueur réglé, seulement le MJ : on ajoute la table de démo, sinon il n'y aurait rien à voir)
    const joueursRegles = reglees.filter(p => !p.mj).length;
    ajouter = aj ?? ((demo && !joueursRegles) || (J.ajouterAutres ?? !reglees.length));
    table = depart();
    const majTable = () => appeler('table', liste());
    if (table.length) majTable();                       // la table réglée : tout de suite, avant CodexVTT
    // Un personnage de CodexVTT arrive ou change (seul : un événement « character » ; sinon : dans « state »)
    const recevoir = (c, seul) => {
      let p = parId(c.id);
      const avant = copie(p);
      if (!p) p = placeDe(c);
      if (!p) {
        if (!ajouter) {
          horsTable.set(c.id, poser({ ...VIDE, nom: '' }, c));
          return;
        }
        p = { ...VIDE, nom: '' };
        table.push(p);
        poser(p, c);
        if (seul) majTable();
        return;
      }
      const nouveau = p.id == null;
      poser(p, c);
      if (seul) { if (nouveau) majTable(); else appeler('perso', p, avant); }
    };
    const rappels = {
      etat: e => {
        table = depart();
        horsTable = new Map();
        (e.characters || []).forEach(c => recevoir(c, false));
        majTable();
        rappels.combat(e.combat);
      },
      perso: c => recevoir(c, true),
      retire: ({ id }) => {
        horsTable.delete(id);
        const p = parId(id);
        if (!p) return;
        if (table.indexOf(p) < reglees.length) Object.assign(p, VIDE);   // une place réglée reste (sans fiche)
        else table = table.filter(x => x !== p);
        majTable();
      },
      pv: h => {
        const p = parId(h.sheetId);
        if (!p) return;
        const avant = copie(p);
        Object.assign(p, { pv: h.hp, pvMax: h.hpMax, aTerre: h.hpMax > 0 && h.hp <= 0 });
        appeler('perso', p, avant);
        if (h.delta) appeler('coup', p, h.delta);
      },
      combat: cb => {
        const actif = cb && cb.isActive && (cb.order || []).find(o => o.id === cb.currentId);
        const p = actif && !actif.isNpc ? (parId(actif.sheetId) || persoDe({ characterName: actif.name })) : null;
        appeler('tour', p || null, cb || null);
      },
      jet: j => appeler('jet', lire(j)),
      revoque: () => appeler('etat', 'clé révoquée'),
    };
    if (demo) return demonstration(rappels);
    if (typeof Codex === 'undefined') return console.warn('[Partie] js/codex.js manquant');
    const socket = Codex.brancher(rappels);
    if (socket && socket.on) {
      socket.on('connect', () => appeler('etat', 'connecté'));
      socket.on('disconnect', () => appeler('etat', 'déconnecté'));
    }
    return socket;
  }

  // ---------- La table réglée depuis les réglages (config.js › jdr.mj et jdr.joueurs) ----------
  // jdr.mj = { nom, discord } (le MJ : une carte, même s'il n'est pas un personnage de CodexVTT)
  // jdr.joueurs = [["Kenai", "pseudo Discord"], …] : les personnages de la partie et qui les joue sur Discord
  // (leurs cartes s'affichent tout de suite ; CodexVTT ajoute ensuite PV et portraits).
  function placesReglees() {
    const mj = J.mj || {}, l = [];
    if (String(mj.nom || '').trim()) l.push({ mj: true, nom: mj.nom.trim(), discord: String(mj.discord || '').trim() });
    (J.joueurs || []).forEach(([nom, discord]) => { if (String(nom || '').trim()) l.push({ nom: nom.trim(), discord: String(discord || '').trim() }); });
    return l;
  }

  // ---------- Qui parle (Discord, bot « voix » du VPS : js/voix.js) ----------
  // Partie.voix((perso, oui) => …) : appelé quand un perso de la table se met à parler ou se tait.
  // Un perso est relié à Discord par son champ discord (pseudo, nom affiché ou identifiant ; jdr.mj / jdr.joueurs).
  // ?test=1 : quelqu'un parle au hasard.
  function voix(rappel) {
    const dire = (p, oui) => { try { rappel(p, oui); } catch (e) { console.error('[Partie] voix', e); } };
    if (params.has('test') || params.has('demo')) {
      const tour = () => {
        const parlants = table.filter(p => Math.random() < .5 && p === table[Math.floor(Math.random() * table.length)]);
        table.forEach(p => dire(p, parlants.includes(p)));
        setTimeout(tour, 900 + Math.random() * 1600);
      };
      return setTimeout(tour, 800);
    }
    if (typeof Voix === 'undefined') return;
    let membres = [];
    const silences = {};
    const persoDuMembre = id => { const m = membres.filter(x => x.id === id); return m.length ? table.find(p => p.discord && Voix.trouver(m, p.discord)) : null; };
    Voix.brancher({
      salon: e => {
        membres = e.membres || [];
        table.forEach(p => dire(p, (e.parlent || []).some(id => persoDuMembre(id) === p)));
      },
      parle: (id, oui) => {
        const p = persoDuMembre(id);
        if (!p) return;
        clearTimeout(silences[id]);
        if (oui) dire(p, true);
        else silences[id] = setTimeout(() => dire(p, false), 250);   // une respiration ne coupe pas l'animation
      },
    });
  }

  // ---------- Démo (?test=1) : une table, des PV qui bougent, un jet toutes les 6 s ----------
  function demonstration(rappels) {
    const noms = [['Kenai', 'kenai'], ['Namerya', 'namerya'], ['Zokhran', 'zokhran'], ['Trayss', 'trayss']];
    const fiches = noms.map(([nom], i) => ({ id: 100 + i, name: nom, portrait: null, hp: 20 + i * 4, hpMax: 20 + i * 4, form: null, down: false }));
    rappels.etat({ room: { name: 'Démo', system: '5e' }, characters: fiches, combat: null });
    const tirages = [
      { kind: 'skill', label: 'Athlétisme', formula: '1d20+5', nd: 15 }, { kind: 'skill', label: 'Discrétion', formula: '1d20+3' },
      { kind: 'attack', label: 'Épée longue', formula: '1d20+6', nd: 13 }, { kind: 'skill', label: 'Persuasion', formula: '1d20+2', nd: 12 },
      { kind: 'heal', label: 'Soins', formula: '2d8+3' }, { kind: 'skill', label: 'Arcanes', formula: '1d20+4', nd: 14 },
    ];
    let n = 0;
    const lancer = () => {
      const f = fiches[n % fiches.length], t = tirages[n % tirages.length], d = 1 + Math.floor(Math.random() * 20);
      const bonus = Number((t.formula.match(/\+(\d+)/) || [])[1] || 0);
      rappels.jet({ id: 'demo-' + n, sheetId: f.id, isNpc: false, player: { id: f.id, name: 'Joueur ' + (n % 4 + 1) }, characterName: f.name,
        ...t, result: d + bonus, rolls: [d], sides: 20, type: 'standard', isCritSuccess: d === 20, isCritFail: d === 1,
        ...(t.nd ? { isSuccess: d + bonus >= t.nd } : {}), timestamp: new Date().toISOString() });
      if (n % 3 === 2) { const c = fiches[(n + 1) % fiches.length], delta = -(1 + Math.floor(Math.random() * 6)); c.hp = Math.max(0, c.hp + delta);
        rappels.pv({ sheetId: c.id, delta, hp: c.hp, hpMax: c.hpMax }); }
      n++;
    };
    rappels.combat({ isActive: true, round: 1, currentId: 'c0', order: fiches.map((f, i) => ({ id: 'c' + i, name: f.name, initiative: 20 - i, isNpc: false, sheetId: f.id })) });
    setTimeout(lancer, 1500);
    return setInterval(lancer, 6000);
  }

  return { brancher, placesReglees, voix, lire, persos: liste, moi: () => table.find(p => p.moi) || null, normaliser, geste, verdict };
})();
