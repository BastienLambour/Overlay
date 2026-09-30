/* =====================================================================
   PATAGRAIN — Ce que montre la page reglages.html : les réglages de config.js,
   rangés par écran, avec un libellé et une aide en français simple.
   Un réglage absent d'ici apparaît quand même, dans « Autres réglages ».
   Types : texte · twitch · nombre · case · liste (une ligne = un élément) ·
           paires (« A | B » par ligne) · choix · secret · heure
   ===================================================================== */
window.ReglagesChamps = {
  logo: 'assets/logo-couleur.svg',
  // Pour l'aperçu des alertes aux couleurs de l'overlay (icônes et styles des vraies alertes)
  scripts: ['js/commun.js'],
  styles: ['css/composants.css'],

  sections: [
    { titre: 'La chaîne', icone: '🎩', champs: [
      { cle: 'nomChaine', type: 'texte', label: 'Nom affiché sur l\'overlay' },
      { cle: 'chaineTwitch', type: 'twitch', label: 'Identifiant Twitch', aide: 'Celui de l\'adresse twitch.tv/…, en minuscules. Sert à lire le chat (aucun mot de passe).' },
      { cle: 'titreDuJour', type: 'texte', label: 'Ce que tu fais aujourd\'hui', aide: 'Affiché sur Starting soon, le bandeau et la scène Contenu.' },
    ] },
    { titre: 'Starting soon', icone: '🎭', champs: [
      { cle: 'demarrage.titre', type: 'texte', label: 'Titre' },
      { cle: 'demarrage.minutes', type: 'nombre', label: 'Compte à rebours (minutes)', min: 0 },
      { cle: 'demarrage.heure', type: 'heure', label: '… ou heure fixe', aide: 'Si elle est remplie, elle passe avant les minutes. Vide = compte à rebours en minutes.' },
      { cle: 'demarrage.etiquette', type: 'texte', label: 'Au-dessus du compteur' },
      { cle: 'demarrage.texteFin', type: 'texte', label: 'Quand le compteur arrive à zéro' },
    ] },
    { titre: 'Pause', icone: '🔥', champs: [
      { cle: 'pause.titre', type: 'texte', label: 'Titre' },
      { cle: 'pause.sousTitre', type: 'texte', label: 'Sous-titre' },
      { cle: 'pause.minutes', type: 'nombre', label: '« Retour dans » (minutes)', min: 0, aide: '0 = pas de compte à rebours.' },
      { cle: 'pause.texteFin', type: 'texte', label: 'Quand le compteur arrive à zéro' },
    ] },
    { titre: 'Fin', icone: '👋', champs: [
      { cle: 'fin.titre', type: 'texte', label: 'Titre' },
      { cle: 'fin.sousTitre', type: 'texte', label: 'Sous-titre' },
      { cle: 'fin.prochainStream', type: 'texte', label: 'Prochain stream', aide: 'Ex. « Jeudi 20h30 · Session 4 ». Vide = la carte « Prochaine quête » est cachée.' },
      { cle: 'fin.messages', type: 'liste', label: 'Messages qui défilent en bas', aide: 'Un message par ligne.' },
    ] },
    { titre: 'Messages des écrans d\'attente', icone: '📜', champs: [
      { cle: 'messages', type: 'liste', label: 'Messages en bas de Starting soon et Pause', aide: 'Un message par ligne. {titreDuJour} est remplacé par ce que tu fais aujourd\'hui.' },
      { cle: 'dureeMessage', type: 'nombre', label: 'Secondes par message', min: 2 },
    ] },
    { titre: 'Le chat', icone: '💬', champs: [
      { cle: 'chat.titre', type: 'texte', label: 'Titre de la carte du chat' },
      { cle: 'chat.maxMessages', type: 'nombre', label: 'Nombre de messages affichés', min: 1 },
      { cle: 'chat.memoireMinutes', type: 'nombre', label: 'Mémoire (minutes)', min: 0, aide: 'En changeant de scène, le chat réaffiche les messages de ces dernières minutes. 0 = jamais.' },
      { cle: 'chat.masquerCommandes', type: 'case', label: 'Cacher les commandes (messages qui commencent par « ! »)' },
      { cle: 'chat.ignorer', type: 'liste', label: 'Comptes cachés (les bots)', aide: 'Un pseudo par ligne.' },
    ] },
    { titre: 'Objectif', icone: '⚔️', champs: [
      { cle: 'objectif.type', type: 'choix', label: 'Ce qu\'on compte', options: [['follow', 'Les follows'], ['sub', 'Les abonnements']] },
      { cle: 'objectif.titre', type: 'texte', label: 'Nom de l\'objectif' },
      { cle: 'objectif.cible', type: 'nombre', label: 'Objectif à atteindre', min: 1 },
      { cle: 'objectif.depart', type: 'nombre', label: 'Ton nombre ACTUEL', min: 0, aide: 'Ton nombre actuel de followers (ou d\'abonnés). Le changer remet le compteur à cette valeur.' },
    ] },
    { titre: 'Bandeau d\'infos', icone: '📰', aide: 'La barre en bas des scènes Cam seule, Contenu et Jeu : décoche ce que tu ne veux pas voir.', champs: [
      { cle: 'bandeau.ceSoir', type: 'case', label: '« Ce soir » (ce que tu fais aujourd\'hui)' },
      { cle: 'bandeau.follow', type: 'case', label: '« Aventurier » : dernier follow' },
      { cle: 'bandeau.abonne', type: 'case', label: '« Chevalier » : dernier abonné', aide: 'Seulement si ta chaîne est affiliée ou partenaire.' },
      { cle: 'bandeau.soutien', type: 'case', label: '« Tribut » : dernier don ou bits', aide: 'Décoche si tu ne reçois ni dons ni bits.' },
      { cle: 'bandeau.objectif', type: 'case', label: 'L\'objectif et sa mini-jauge' },
    ] },
    { titre: 'Alertes', icone: '🔔', alertes: true, champs: [
      { cle: 'alertes.duree', type: 'nombre', label: 'Durée d\'affichage (secondes)', min: 2 },
      { cle: 'alertes.son', type: 'case', label: 'Tintement des grelots' },
      { cle: 'alertes.volume', type: 'nombre', label: 'Volume (de 0 à 1)', min: 0, max: 1, pas: 0.05 },
      { cle: 'alertes.anonyme', type: 'texte', label: 'Nom quand Twitch ne donne pas le destinataire d\'un cadeau' },
    ] },
    { titre: 'Le bouffon', icone: '🃏', champs: [
      { cle: 'bouffon.actif', type: 'case', label: 'Le bouffon est de sortie (tous les écrans)' },
      { cle: 'bouffon.alertes', type: 'case', label: 'Il descend avec chaque alerte, accroché à sa corde' },
      { cle: 'bouffon.jeuToutesLes', type: 'nombre', label: 'Scène Jeu : il sort la tête environ toutes les … secondes', min: 0, aide: '180 = toutes les 3 minutes environ (le délai varie un peu). 0 = jamais tout seul.' },
      { cle: 'bouffon.jeuAuFollow', type: 'case', label: 'Scène Jeu : il sort la tête à chaque follow' },
      { cle: 'bouffon.bulles', type: 'liste', label: 'Écran Fin : ce que dit sa bulle', aide: 'Une phrase par ligne ; elles s\'alternent.' },
    ] },
    { titre: 'Streamer.bot (alertes, bandeau, objectif)', icone: '🔌', champs: [
      { cle: 'streamerbot.actif', type: 'case', label: 'Se connecter à Streamer.bot' },
      { cle: 'streamerbot.hote', type: 'texte', label: 'Adresse', aide: 'Laisse 127.0.0.1 si Streamer.bot tourne sur le même PC.' },
      { cle: 'streamerbot.port', type: 'nombre', label: 'Port', min: 1 },
      { cle: 'streamerbot.motDePasse', type: 'secret', label: 'Mot de passe', aide: 'Seulement si tu as activé l\'authentification dans Streamer.bot.' },
    ] },
    { titre: 'Kit de chaîne Twitch', icone: '📺', champs: [
      { cle: 'chaine.slogan', type: 'texte', label: 'Slogan (bannière de profil)' },
      { cle: 'chaine.horsLigne', type: 'texte', label: 'Texte de l\'écran hors-ligne' },
      { cle: 'chaine.planning', type: 'paires', label: 'Planning', aide: 'Une ligne par jour, ex. « Mercredi | 20h30 ».' },
      { cle: 'chaine.reseaux', type: 'paires', label: 'Réseaux', aide: 'Une ligne par réseau, ex. « Discord | discord.gg/… ».' },
      { cle: 'chaine.panneaux', type: 'liste', label: 'Panneaux de bio', aide: 'Un titre par ligne. Ensuite, refais les images : node outils/exporter-chaine.mjs' },
    ] },
    { titre: 'Mode test', icone: '🧪', champs: [
      { cle: 'test.noms', type: 'liste', label: 'Pseudos des fausses alertes (?test=1)', aide: 'Un pseudo par ligne.' },
    ] },
  ],

  tests: [
    ['🔔 Alertes', 'sources/alertes.html?test=1'],
    ['🎭 Starting soon (12 s)', 'scenes/demarrage.html?minutes=0.2'],
    ['🔥 Pause', 'scenes/pause.html?test=1&minutes=1'],
    ['💬 Cam seule', 'scenes/cam-seule.html?test=1'],
    ['🖥 Contenu', 'scenes/contenu.html?test=1'],
    ['🎮 Jeu', 'scenes/jeu.html?test=1'],
    ['👋 Fin', 'scenes/fin.html?prochainStream=Jeudi%2020h30'],
  ],

  // Aperçu d'une alerte, avec les mêmes styles et icônes que la vraie source (sources/alertes.html)
  apercuAlerte(type, { titre, nom, message }) {
    const ICONES = { follow: 'chapeau', sub: 'bouclier', resub: 'bouclier', giftsub: 'parchemin', giftbomb: 'parchemin', bits: 'grelot', raid: 'epee', don: 'embleme', objectif: 'd20' };
    const e = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const ico = typeof Commun !== 'undefined' ? Commun.ico(ICONES[type] || 'd20').replaceAll('../assets/', 'assets/') : '';
    const grande = ['raid', 'giftbomb', 'objectif'].includes(type);
    return `<div class="alerte${grande ? ' grande' : ''}" style="position:relative;left:auto;translate:none;zoom:.42;min-width:0;width:100%;max-width:none">
      <div class="alerte-icone">${ico}</div><div><div class="alerte-titre">${e(titre)}</div><div class="alerte-nom">${e(nom)}</div>
      <div class="alerte-msg">${e(message)}</div></div></div>`;
  },
};
