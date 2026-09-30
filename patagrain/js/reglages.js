/* =====================================================================
   RÉGLAGES — ce qu'utilise la page reglages.html :
     Reglages.SECTIONS        la liste des réglages, rangés par écran (le formulaire)
     Reglages.ecrire(config)  le texte complet de config.js, avec tous ses commentaires

   config.js est RÉÉCRIT en entier par la page : si on ajoute un réglage,
   on l'ajoute ici (dans SECTIONS et dans ecrire), sinon la page l'effacerait.
   ===================================================================== */
const Reglages = (() => {
  // ---------- Le formulaire ----------
  // type : texte · nombre · case · liste (une ligne = un élément) · paires (« A | B » par ligne) · choix · secret · heure
  const SECTIONS = [
    { titre: 'La chaîne', icone: 'chapeau', champs: [
      { cle: 'nomChaine', type: 'texte', label: 'Nom affiché sur l\'overlay' },
      { cle: 'chaineTwitch', type: 'texte', label: 'Identifiant Twitch', aide: 'Celui de l\'adresse twitch.tv/…, en minuscules. Sert à lire le chat (aucun mot de passe).' },
      { cle: 'titreDuJour', type: 'texte', label: 'Ce que tu fais aujourd\'hui', aide: 'Affiché sur Starting soon, le bandeau et la scène Contenu.' },
    ] },
    { titre: 'Starting soon', icone: 'd20', champs: [
      { cle: 'demarrage.titre', type: 'texte', label: 'Titre' },
      { cle: 'demarrage.minutes', type: 'nombre', label: 'Compte à rebours (minutes)', min: 0 },
      { cle: 'demarrage.heure', type: 'heure', label: '… ou heure fixe', aide: 'Si elle est remplie, elle passe avant les minutes. Vide = compte à rebours en minutes.' },
      { cle: 'demarrage.etiquette', type: 'texte', label: 'Au-dessus du compteur' },
      { cle: 'demarrage.texteFin', type: 'texte', label: 'Quand le compteur arrive à zéro' },
    ] },
    { titre: 'Pause', icone: 'grelot', champs: [
      { cle: 'pause.titre', type: 'texte', label: 'Titre' },
      { cle: 'pause.sousTitre', type: 'texte', label: 'Sous-titre' },
      { cle: 'pause.minutes', type: 'nombre', label: '« Retour dans » (minutes)', min: 0, aide: '0 = pas de compte à rebours.' },
      { cle: 'pause.texteFin', type: 'texte', label: 'Quand le compteur arrive à zéro' },
    ] },
    { titre: 'Fin', icone: 'parchemin', champs: [
      { cle: 'fin.titre', type: 'texte', label: 'Titre' },
      { cle: 'fin.sousTitre', type: 'texte', label: 'Sous-titre' },
      { cle: 'fin.prochainStream', type: 'texte', label: 'Prochain stream', aide: 'Ex. « Jeudi 20h30 · Session 4 ». Vide = la carte « Prochaine quête » est cachée.' },
      { cle: 'fin.messages', type: 'liste', label: 'Messages qui défilent en bas', aide: 'Un message par ligne.' },
    ] },
    { titre: 'Messages des écrans d\'attente', icone: 'grelot', champs: [
      { cle: 'messages', type: 'liste', label: 'Messages en bas de Starting soon et Pause', aide: 'Un message par ligne. {titreDuJour} est remplacé par ce que tu fais aujourd\'hui.' },
      { cle: 'dureeMessage', type: 'nombre', label: 'Secondes par message', min: 2 },
    ] },
    { titre: 'Le chat', icone: 'd6', champs: [
      { cle: 'chat.titre', type: 'texte', label: 'Titre de la carte du chat' },
      { cle: 'chat.maxMessages', type: 'nombre', label: 'Nombre de messages affichés', min: 1 },
      { cle: 'chat.memoireMinutes', type: 'nombre', label: 'Mémoire (minutes)', min: 0, aide: 'En changeant de scène, le chat réaffiche les messages de ces dernières minutes. 0 = jamais.' },
      { cle: 'chat.masquerCommandes', type: 'case', label: 'Cacher les commandes (messages qui commencent par « ! »)' },
      { cle: 'chat.ignorer', type: 'liste', label: 'Comptes cachés (les bots)', aide: 'Un pseudo par ligne.' },
    ] },
    { titre: 'Objectif', icone: 'd20', champs: [
      { cle: 'objectif.type', type: 'choix', label: 'Ce qu\'on compte', options: [['follow', 'Les follows'], ['sub', 'Les abonnements']] },
      { cle: 'objectif.titre', type: 'texte', label: 'Nom de l\'objectif' },
      { cle: 'objectif.cible', type: 'nombre', label: 'Objectif à atteindre', min: 1 },
      { cle: 'objectif.depart', type: 'nombre', label: 'Ton nombre ACTUEL', min: 0, aide: 'Mets ici ton nombre actuel de followers (ou d\'abonnés). Le changer remet le compteur à cette valeur.' },
    ] },
    { titre: 'Alertes', icone: 'bouclier', alertes: true, champs: [
      { cle: 'alertes.duree', type: 'nombre', label: 'Durée d\'affichage (secondes)', min: 2 },
      { cle: 'alertes.son', type: 'case', label: 'Tintement des grelots' },
      { cle: 'alertes.volume', type: 'nombre', label: 'Volume (de 0 à 1)', min: 0, max: 1, pas: 0.05 },
      { cle: 'alertes.anonyme', type: 'texte', label: 'Nom quand Twitch ne donne pas le destinataire d\'un cadeau' },
    ] },
    { titre: 'Le bouffon', icone: 'chapeau', champs: [
      { cle: 'bouffon.actif', type: 'case', label: 'Le bouffon est de sortie (tous les écrans)' },
      { cle: 'bouffon.alertes', type: 'case', label: 'Il descend avec chaque alerte, accroché à sa corde' },
      { cle: 'bouffon.jeuToutesLes', type: 'nombre', label: 'Scène Jeu : il sort la tête toutes les … secondes', min: 0, aide: '0 = jamais tout seul.' },
      { cle: 'bouffon.jeuAuFollow', type: 'case', label: 'Scène Jeu : il sort la tête à chaque follow' },
      { cle: 'bouffon.bulles', type: 'liste', label: 'Écran Fin : ce que dit sa bulle', aide: 'Une phrase par ligne ; elles s\'alternent.' },
    ] },
    { titre: 'Streamer.bot (alertes, bandeau, objectif)', icone: 'epee', champs: [
      { cle: 'streamerbot.actif', type: 'case', label: 'Se connecter à Streamer.bot' },
      { cle: 'streamerbot.hote', type: 'texte', label: 'Adresse', aide: 'Laisse 127.0.0.1 si Streamer.bot tourne sur le même PC.' },
      { cle: 'streamerbot.port', type: 'nombre', label: 'Port', min: 1 },
      { cle: 'streamerbot.motDePasse', type: 'secret', label: 'Mot de passe', aide: 'Seulement si tu as activé l\'authentification dans Streamer.bot.' },
    ] },
    { titre: 'Kit de chaîne Twitch', icone: 'embleme', champs: [
      { cle: 'chaine.slogan', type: 'texte', label: 'Slogan (bannière de profil)' },
      { cle: 'chaine.horsLigne', type: 'texte', label: 'Texte de l\'écran hors-ligne' },
      { cle: 'chaine.planning', type: 'paires', label: 'Planning', aide: 'Une ligne par jour, ex. « Mercredi | 20h30 ».' },
      { cle: 'chaine.reseaux', type: 'paires', label: 'Réseaux', aide: 'Une ligne par réseau, ex. « Discord | discord.gg/… ».' },
      { cle: 'chaine.panneaux', type: 'liste', label: 'Panneaux de bio', aide: 'Un titre par ligne. Ensuite, refais les images : node outils/exporter-chaine.mjs' },
    ] },
    { titre: 'Mode test', icone: 'd4', champs: [
      { cle: 'test.noms', type: 'liste', label: 'Pseudos des fausses alertes (?test=1)', aide: 'Un pseudo par ligne.' },
    ] },
  ];

  // Les alertes, dans l'ordre du tableau du formulaire
  const ALERTES = [['follow', 'Follow'], ['sub', 'Abonnement'], ['resub', 'Réabonnement'], ['giftsub', 'Abonnement offert'],
    ['giftbomb', 'Pluie d\'abonnements offerts'], ['bits', 'Bits'], ['raid', 'Raid'], ['don', 'Don'], ['objectif', 'Objectif atteint']];

  // ---------- Le fichier config.js ----------
  const J = v => JSON.stringify(v ?? '');
  const N = v => String(Number(v) || 0);
  const B = v => (v === false ? 'false' : 'true');
  // Liste de textes, un par ligne (indentation « ind »)
  const L = (l, ind) => (l || []).length ? `[\n${l.map(x => `${ind}  ${J(x)},`).join('\n')}\n${ind}]` : '[]';
  // Liste courte, sur une ligne
  const Lc = l => `[${(l || []).map(J).join(', ')}]`;
  // Liste de paires ["A", "B"]
  const P = (l, ind) => (l || []).length ? `[\n${l.map(([a, b]) => `${ind}  [${J(a)}, ${J(b)}],`).join('\n')}\n${ind}]` : '[]';
  const colonne = (t, n) => t + ' '.repeat(Math.max(1, n - t.length));

  function ecrire(c) {
    const d = c.demarrage || {}, p = c.pause || {}, f = c.fin || {}, ch = c.chat || {}, o = c.objectif || {};
    const a = c.alertes || {}, t = a.textes || {}, bf = c.bouffon || {}, sb = c.streamerbot || {}, k = c.chaine || {};
    const textes = ALERTES.map(([cle]) => {
      const x = t[cle] || {};
      return `      ${colonne(cle + ':', 10)}{ titre: ${colonne(J(x.titre) + ',', 24)}message: ${J(x.message)} },`;
    }).join('\n');
    return `/* =====================================================================
   PATAGRAIN — Configuration de l'overlay : c'est ici qu'on modifie les textes.
   Le plus simple : ouvre reglages.html (un formulaire qui réécrit ce fichier).
   Ou modifie-le à la main : enregistre, puis actualise la source dans OBS
   (clic droit > Actualiser).
   ===================================================================== */
window.CONFIG = {
  nomChaine: ${J(c.nomChaine)},

  // Identifiant technique de l'overlay (nom du dossier) : sépare les compteurs d'un overlay à l'autre.
  id: ${J(c.id || 'patagrain')},

  // Identifiant Twitch de la chaîne (celui de l'adresse twitch.tv/xxxx), en minuscules.
  // Sert à lire le chat (aucun mot de passe nécessaire).
  chaineTwitch: ${J(c.chaineTwitch)},

  // Ce que tu fais aujourd'hui (écrans d'attente et bandeau)
  titreDuJour: ${J(c.titreDuJour)},

  // ---------------------------------------------------------------------
  // Streamer.bot (gratuit) : fait le lien entre Twitch et l'overlay pour
  // les follows, abonnements, bits, raids et dons. Voir TUTO.md.
  // ---------------------------------------------------------------------
  streamerbot: {
    actif: ${B(sb.actif)},
    hote: ${J(sb.hote || '127.0.0.1')},
    port: ${N(sb.port || 8080)},
    motDePasse: ${J(sb.motDePasse)},      // seulement si tu as activé l'authentification dans Streamer.bot
  },

  // --- Écran « Starting soon » ---
  demarrage: {
    titre: ${J(d.titre)},
    // Compte à rebours : durée en minutes, ou heure fixe "20:30" (prioritaire si remplie).
    // Se règle aussi dans l'adresse de la source : demarrage.html?minutes=10
    minutes: ${N(d.minutes)},
    heure: ${J(d.heure)},
    etiquette: ${J(d.etiquette)},
    texteFin: ${J(d.texteFin)},
  },

  // --- Écran « Pause » ---
  pause: {
    titre: ${J(p.titre)},
    sousTitre: ${J(p.sousTitre)},
    minutes: ${N(p.minutes)},          // durée affichée en compte à rebours (0 = pas de compte à rebours)
    texteFin: ${J(p.texteFin)},
  },

  // --- Écran « Fin » ---
  fin: {
    titre: ${J(f.titre)},
    sousTitre: ${J(f.sousTitre)},
    prochainStream: ${J(f.prochainStream)},  // ex. "Jeudi 20h30 · Session 4" (vide = carte masquée)
    messages: ${L(f.messages, '    ')},
  },

  // Messages qui défilent en bas des écrans Starting soon et Pause ({titreDuJour} est remplacé)
  messages: ${L(c.messages, '  ')},
  dureeMessage: ${N(c.dureeMessage)},       // secondes par message

  // --- Chat intégré ---
  chat: {
    titre: ${J(ch.titre)},
    maxMessages: ${N(ch.maxMessages)},
    ignorer: ${Lc(ch.ignorer)},
    masquerCommandes: ${B(ch.masquerCommandes)},  // cache les messages qui commencent par « ! »
    memoireMinutes: ${N(ch.memoireMinutes ?? 10)},      // en changeant de scène, le chat réaffiche les messages des N dernières minutes (0 = jamais)
  },

  // --- Objectif (bandeau et jauge) ---
  objectif: {
    type: ${J(o.type || 'follow')},      // "follow" ou "sub"
    titre: ${J(o.titre)},
    cible: ${N(o.cible)},
    depart: ${N(o.depart)},           // mets ici ton nombre ACTUEL de followers (ou d'abonnés)
  },

  // --- Alertes ---
  alertes: {
    duree: ${N(a.duree)},            // secondes d'affichage de chaque alerte
    son: ${B(a.son)},
    volume: ${N(a.volume)},         // de 0 à 1
    anonyme: ${J(a.anonyme)},   // nom affiché quand Twitch ne donne pas le destinataire d'un abonnement offert
    // {nom} {montant} {mois} {nombre} {destinataire} sont remplacés automatiquement
    textes: {
${textes}
    },
  },

  // --- Le bouffon (la mascotte) sur les écrans ---
  // Pour le cacher sur une seule page : ajoute ?bouffon=0 à son adresse.
  bouffon: {
    actif: ${B(bf.actif)},         // false = plus de bouffon nulle part
    alertes: ${B(bf.alertes)},       // il descend avec chaque alerte, accroché à sa corde
    jeuToutesLes: ${N(bf.jeuToutesLes)},    // scène Jeu : il passe la tête sous son chapeau toutes les N secondes (0 = jamais tout seul)
    jeuAuFollow: ${B(bf.jeuAuFollow)},   // scène Jeu : … et à chaque nouveau follow
    // Écran Fin : ce que dit sa bulle (les phrases s'alternent)
    bulles: ${Lc(bf.bulles)},
  },

  // --- Kit de chaîne Twitch (chaine/kit.html) : textes des visuels de la chaîne ---
  chaine: {
    slogan: ${J(k.slogan)},
    horsLigne: ${J(k.horsLigne)},
    planning: ${P(k.planning, '    ')},   // jours et heures de stream, ex. ["Mercredi", "20h30"]
    reseaux: ${P(k.reseaux, '    ')},    // [nom, pseudo], ex. ["Discord", "discord.gg/…"]
    // Titres des panneaux de bio (320×160) : on n'exporte que ceux listés ici
    panneaux: ${Lc(k.panneaux)},
  },

  // Mode test (?test=1) : pseudos utilisés pour les fausses alertes
  test: {
    noms: ${Lc((c.test || {}).noms)},
  },
};
`;
  }

  return { SECTIONS, ALERTES, ecrire };
})();
if (typeof module !== 'undefined') module.exports = Reglages;   // pour les vérifications en Node
