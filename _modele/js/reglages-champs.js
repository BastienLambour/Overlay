/* =====================================================================
   <NOM> — Ce que montre la page reglages.html : les réglages de config.js,
   rangés par écran, avec un libellé et une aide en français simple.
   GABARIT : clés standard de _modele/config.js. Ajoute les réglages propres au
   thème (couleur, fond…) et range-les par écran. Un réglage absent de config.js
   n'est pas affiché ; un réglage de config.js absent d'ici apparaît dans « Autres réglages ».
   Types : texte · twitch · nombre · case · liste (une ligne = un élément) ·
           paires (« A | B » par ligne) · choix · secret · heure · couleur · son
   Couleurs : section { ambiances: true } avec des champs type 'couleur' (cle 'couleurs.<variable>', defaut: '#…'),
             et ambiances: [{ nom, valeurs: { 'couleurs.accent': '#…', … } }] pour les boutons en un clic.
   Options : logo (image en haut), scripts / styles (chargés pour l'aperçu),
             apercuAlerte(type, { titre, nom, message }) → HTML d'une alerte aux couleurs de l'overlay
   ===================================================================== */
window.ReglagesChamps = {
  scripts: ['js/son.js'],   // pour le bouton ▶ des sons
  // Ambiances en un clic (section Couleurs) : les couleurs non citées reviennent à celles du thème
  ambiances: [
    { nom: '🎃 Halloween', valeurs: { 'couleurs.accent': '#FF7A1A', 'couleurs.fond': '#140B1A' } },
    { nom: '🎄 Noël', valeurs: { 'couleurs.accent': '#D63A3A', 'couleurs.fond': '#0E2317' } },
    { nom: '↺ Couleurs d\'origine', valeurs: { 'couleurs.accent': '', 'couleurs.fond': '' } },
  ],
  sections: [
    { titre: 'La chaîne', icone: '📺', champs: [
      { cle: 'nomChaine', type: 'texte', label: 'Nom affiché sur l\'overlay' },
      { cle: 'chaineTwitch', type: 'twitch', label: 'Identifiant Twitch', aide: 'Celui de l\'adresse twitch.tv/…, en minuscules. Sert à lire le chat (aucun mot de passe).' },
    ] },
    { titre: 'Couleurs', icone: '🎨', ambiances: true, aide: 'Choisis une ambiance en un clic, ou change une couleur à la main. ↺ = la couleur d\'origine.', champs: [
      { cle: 'couleurs.accent', type: 'couleur', label: 'Couleur principale', defaut: '#FF9F1C' },
      { cle: 'couleurs.fond', type: 'couleur', label: 'Fond', defaut: '#101418' },
    ] },
    { titre: 'Démarrage', icone: '⏳', champs: [
      { cle: 'demarrage.titre', type: 'texte', label: 'Titre' },
      { cle: 'demarrage.minutes', type: 'nombre', label: 'Compte à rebours (minutes)', min: 0 },
      { cle: 'demarrage.texteFin', type: 'texte', label: 'Quand le compteur arrive à zéro' },
    ] },
    { titre: 'Pause', icone: '☕', champs: [
      { cle: 'pause.titre', type: 'texte', label: 'Titre' },
    ] },
    { titre: 'Fin', icone: '👋', champs: [
      { cle: 'fin.titre', type: 'texte', label: 'Titre' },
    ] },
    { titre: 'Le chat', icone: '💬', champs: [
      { cle: 'chat.titre', type: 'texte', label: 'Titre de la carte du chat' },
      { cle: 'chat.maxMessages', type: 'nombre', label: 'Nombre de messages affichés', min: 1 },
      { cle: 'chat.masquerCommandes', type: 'case', label: 'Cacher les commandes (messages qui commencent par « ! »)' },
      { cle: 'chat.ignorer', type: 'liste', label: 'Comptes cachés (les bots)', aide: 'Un pseudo par ligne.' },
    ] },
    { titre: 'Objectif', icone: '🎯', champs: [
      { cle: 'objectif.type', type: 'choix', label: 'Ce qu\'on compte', options: [['follow', 'Les follows'], ['sub', 'Les abonnements']] },
      { cle: 'objectif.titre', type: 'texte', label: 'Nom de l\'objectif' },
      { cle: 'objectif.cible', type: 'nombre', label: 'Objectif à atteindre', min: 1 },
      { cle: 'objectif.depart', type: 'nombre', label: 'Ton nombre ACTUEL', min: 0, aide: 'Ton nombre actuel de followers (ou d\'abonnés). Le changer remet le compteur à cette valeur.' },
    ] },
    { titre: 'Bandeau d\'infos', icone: '📰', aide: 'La barre en bas des scènes : décoche ce que tu ne veux pas voir.', champs: [
      { cle: 'bandeau.follow', type: 'case', label: 'Dernier follow' },
      { cle: 'bandeau.abonne', type: 'case', label: 'Dernier abonné', aide: 'Seulement si ta chaîne est affiliée ou partenaire.' },
      { cle: 'bandeau.soutien', type: 'case', label: 'Dernier don ou bits', aide: 'Décoche si tu ne reçois ni dons ni bits.' },
      { cle: 'bandeau.objectif', type: 'case', label: 'L\'objectif et sa mini-jauge' },
    ] },
    { titre: 'Alertes', icone: '🔔', alertes: true, champs: [
      { cle: 'alertes.duree', type: 'nombre', label: 'Durée d\'affichage (secondes)', min: 2 },
      { cle: 'alertes.son', type: 'case', label: 'Son des alertes' },
      { cle: 'alertes.volume', type: 'nombre', label: 'Volume (de 0 à 1)', min: 0, max: 1, pas: 0.05 },
      { cle: 'alertes.anonyme', type: 'texte', label: 'Nom quand Twitch ne donne pas le destinataire d\'un cadeau' },
    ] },
    { titre: 'Sons des alertes', icone: '🔊', sons: true, aide: 'Chaque alerte a son propre son, pour la reconnaître à l\'oreille en jouant. ▶ pour écouter. Laisse vide pour garder le son de l\'overlay, écris « aucun » pour ne rien jouer, ou mets ton propre fichier (mp3, wav, ogg) dans le dossier sons/ et écris son nom : sons/follow.mp3.', champs: [] },
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
    ['⏳ Démarrage', 'scenes/demarrage.html?test=1'],
    ['☕ Pause', 'scenes/pause.html?test=1'],
    ['💬 Cam seule', 'scenes/cam-seule.html?test=1'],
    ['🖥 Contenu', 'scenes/contenu.html?test=1'],
    ['🎮 Jeu', 'scenes/jeu.html?test=1'],
    ['👋 Fin', 'scenes/fin.html?test=1'],
  ],
};
