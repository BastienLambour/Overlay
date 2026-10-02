/* =====================================================================
   PATAGRAIN — Ce que montre la page reglages.html : les réglages de config.js,
   rangés par écran, avec un libellé et une aide en français simple.
   Un réglage absent d'ici apparaît quand même, dans « Autres réglages ».
   Types : texte · twitch · nombre · case · liste (une ligne = un élément) ·
           paires (« A | B » par ligne) · choix · secret · heure · couleur · son
           (section « scenes: true » : le tableau des options des scènes, construit depuis config.js › options)
   ===================================================================== */
window.ReglagesChamps = {
  logo: 'assets/logo-couleur.svg',
  // Pour l'aperçu des alertes aux couleurs de l'overlay (icônes et styles des vraies alertes)
  scripts: ['js/son.js', 'js/commun.js'],
  styles: ['css/composants.css'],

  // Ambiances en un clic (section Couleurs) : les couleurs non citées reviennent à celles du thème
  ambiances: [
    { nom: '🎃 Halloween', valeurs: { 'couleurs.primaire': '#FF7A1A', 'couleurs.primaire-fonce': '#B34700', 'couleurs.accent': '#B57CFF', 'couleurs.accent-2': '#FFB266', 'couleurs.fond': '#140B1A', 'couleurs.surface': '#24142D', 'couleurs.texte': '' } },
    { nom: '🎄 Noël', valeurs: { 'couleurs.primaire': '#D63A3A', 'couleurs.primaire-fonce': '#962020', 'couleurs.accent': '#F5C542', 'couleurs.accent-2': '#8FE0A0', 'couleurs.fond': '#0E2317', 'couleurs.surface': '#173524', 'couleurs.texte': '' } },
    { nom: '↺ Couleurs d\'origine', valeurs: { 'couleurs.primaire': '', 'couleurs.primaire-fonce': '', 'couleurs.accent': '', 'couleurs.accent-2': '', 'couleurs.fond': '', 'couleurs.surface': '', 'couleurs.texte': '' } },
  ],

  // Options des scènes : noms des lignes et colonnes du tableau (en plus de ceux par défaut)
  scenes: { demarrage: 'Starting soon' },
  elements: { bouffon: '🃏 Bouffon' },

  sections: [
    { titre: 'La chaîne', icone: '🎩', champs: [
      { cle: 'nomChaine', type: 'texte', label: 'Nom affiché sur l\'overlay' },
      { cle: 'chaineTwitch', type: 'twitch', label: 'Identifiant Twitch', aide: 'Celui de l\'adresse twitch.tv/…, en minuscules. Sert à lire le chat (aucun mot de passe).' },
      { cle: 'titreDuJour', type: 'texte', label: 'Ce que tu fais aujourd\'hui', aide: 'Affiché sur Starting soon, le bandeau et la scène Contenu.' },
    ] },
    { titre: 'Options des scènes', icone: '🎬', scenes: true, aide: 'Ce qui s\'affiche dans chaque scène (allumé = affiché). C\'est comme les options de l\'adresse (?cam=…, ?chat=0…), mais réglé une fois pour toutes ; une option écrite dans l\'adresse d\'une source passe avant.', champs: [
      { cle: 'afficherZones', type: 'case', label: 'Afficher la taille et la position des zones (webcam, contenu, jeu)', aide: 'À cocher le temps de placer la webcam et le jeu dans OBS, puis à décocher.' },
    ] },
    { titre: 'Couleurs', icone: '🎨', ambiances: true, aide: 'Choisis une ambiance en un clic, ou change une couleur à la main. ↺ = la couleur d\'origine. Le logo, le chapeau posé sur les cams et l\'emblème sont des images : ils gardent leurs couleurs.', champs: [
      { cle: 'couleurs.primaire', type: 'couleur', label: 'Couleur principale (le bleu)', defaut: '#3A9AD9' },
      { cle: 'couleurs.primaire-fonce', type: 'couleur', label: 'Couleur principale, en foncé', defaut: '#1F6FA8' },
      { cle: 'couleurs.accent', type: 'couleur', label: 'L\'or (couronne, grelots, titres)', defaut: '#F5B82E' },
      { cle: 'couleurs.accent-2', type: 'couleur', label: 'Bleu glacier (fanions, badge « en direct »)', defaut: '#8FD0F5' },
      { cle: 'couleurs.fond', type: 'couleur', label: 'Fond (bleu nuit)', defaut: '#152238' },
      { cle: 'couleurs.surface', type: 'couleur', label: 'Cartes (chat, bandeau, alertes)', defaut: '#1E3050' },
      { cle: 'couleurs.texte', type: 'couleur', label: 'Texte (crème)', defaut: '#FFF3DC' },
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
      { cle: 'objectif.affiche', type: 'choix', label: 'Ce que la barre affiche', options: [['follow', 'Les followers'], ['sub', 'Les abonnés']], aide: 'Change quand tu veux : les deux compteurs tournent toujours, la barre est tout de suite juste.' },
      { cle: 'objectif.automatique', type: 'case', label: 'Les vrais nombres de la chaîne, depuis Streamer.bot', aide: 'Avec l\'action « Overlay – Compteurs » dans Streamer.bot (tuto, section 6). Décoché : compté à la main, depuis « nombre de départ ».' },
      { cle: 'objectif.follow.titre', type: 'texte', label: 'Followers : nom de l\'objectif' },
      { cle: 'objectif.follow.cible', type: 'nombre', label: 'Followers : objectif à atteindre', min: 1 },
      { cle: 'objectif.follow.depart', type: 'nombre', label: 'Followers : nombre de départ', min: 0, aide: 'Seulement sans Streamer.bot (ou avant sa première réponse). Le changer remet ce compteur à cette valeur.' },
      { cle: 'objectif.sub.titre', type: 'texte', label: 'Abonnés : nom de l\'objectif' },
      { cle: 'objectif.sub.cible', type: 'nombre', label: 'Abonnés : objectif à atteindre', min: 1 },
      { cle: 'objectif.sub.depart', type: 'nombre', label: 'Abonnés : nombre de départ', min: 0, aide: 'Seulement sans Streamer.bot (ou avant sa première réponse). Le changer remet ce compteur à cette valeur.' },
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
    { titre: 'Sons des alertes', icone: '🔊', sons: true, aide: 'Chaque alerte a son propre son, pour la reconnaître à l\'oreille en jouant. ▶ pour écouter. Laisse vide pour garder le son de l\'overlay, écris « aucun » pour ne rien jouer, ou mets ton propre fichier (mp3, wav, ogg) dans le dossier sons/ et écris son nom : sons/follow.mp3.', champs: [] },
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
    { titre: 'Mises à jour', icone: '🔄', aide: 'D\'où l\'overlay se met à jour : bouton « Mettre à jour l\'overlay » du script OBS (outils/actualiser-obs.lua), ou double-clic sur mettre-a-jour.cmd. Tes réglages (mes-reglages.js) ne sont jamais remplacés ; l\'ancienne version est gardée dans sauvegardes.', champs: [
      { cle: 'miseAJour.adresse', type: 'texte', label: 'Adresse du serveur des overlays', aide: 'Ex. https://overlays.bastien-lambour.fr (celle de la page de téléchargement). À ne changer que si on te le dit.' },
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
