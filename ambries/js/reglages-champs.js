/* =====================================================================
   AMBRIES_ — Ce que montre la page reglages.html : les réglages de config.js,
   rangés par écran, avec un libellé et une aide en français simple.
   Un réglage absent d'ici apparaît quand même, dans « Autres réglages ».
   Types : texte · twitch · nombre · case · liste (une ligne = un élément) ·
           paires (« A | B » par ligne) · choix · secret · heure
   ===================================================================== */
window.ReglagesChamps = {
  sections: [
    { titre: 'La chaîne', icone: '💜', champs: [
      { cle: 'nomChaine', type: 'texte', label: 'Nom affiché sur l\'overlay' },
      { cle: 'chaineTwitch', type: 'twitch', label: 'Identifiant Twitch', aide: 'Celui de l\'adresse twitch.tv/…, en minuscules. Sert à lire le chat (aucun mot de passe).' },
      { cle: 'devise', type: 'texte', label: 'Ta devise', aide: 'Petite phrase fétiche, reprise sur les écrans et la bannière.' },
    ] },
    { titre: 'Démarrage', icone: '⏳', champs: [
      { cle: 'demarrage.titre', type: 'texte', label: 'Titre' },
      { cle: 'demarrage.minutes', type: 'nombre', label: 'Compte à rebours (minutes)', min: 0 },
      { cle: 'demarrage.chargement', type: 'texte', label: 'La jauge qui plafonne à 90 %' },
      { cle: 'demarrage.texteFin', type: 'texte', label: 'Quand le compteur arrive à zéro' },
      { cle: 'demarrage.phrases', type: 'liste', label: 'Petites phrases pendant l\'attente', aide: 'Une phrase par ligne.' },
    ] },
    { titre: 'Pause', icone: '☕', champs: [
      { cle: 'pause.titre', type: 'texte', label: 'Titre' },
      { cle: 'pause.message', type: 'texte', label: 'Message' },
    ] },
    { titre: 'Fin', icone: '🎉', champs: [
      { cle: 'fin.titre', type: 'texte', label: 'Titre' },
      { cle: 'fin.sousTitre', type: 'texte', label: 'Sous-titre' },
      { cle: 'fin.message', type: 'texte', label: 'Message', large: true },
    ] },
    { titre: 'Le chat', icone: '💬', champs: [
      { cle: 'chat.titre', type: 'texte', label: 'Titre de la carte du chat' },
      { cle: 'chat.maxMessages', type: 'nombre', label: 'Nombre de messages affichés', min: 1 },
      { cle: 'chat.memoireMinutes', type: 'nombre', label: 'Mémoire (minutes)', min: 0, aide: 'En changeant de scène, le chat réaffiche les messages de ces dernières minutes. 0 = jamais.' },
      { cle: 'chat.masquerCommandes', type: 'case', label: 'Cacher les commandes (messages qui commencent par « ! »)' },
      { cle: 'chat.ignorer', type: 'liste', label: 'Comptes cachés (les bots)', aide: 'Un pseudo par ligne.' },
    ] },
    { titre: 'Objectif', icone: '🎯', champs: [
      { cle: 'objectif.type', type: 'choix', label: 'Ce qu\'on compte', options: [['follow', 'Les follows'], ['sub', 'Les abonnements']] },
      { cle: 'objectif.titre', type: 'texte', label: 'Nom de l\'objectif' },
      { cle: 'objectif.cible', type: 'nombre', label: 'Objectif à atteindre', min: 1 },
      { cle: 'objectif.depart', type: 'nombre', label: 'Ton nombre ACTUEL', min: 0, aide: 'Ton nombre actuel de followers (ou d\'abonnés). Le changer remet le compteur à cette valeur.' },
    ] },
    { titre: 'Alertes', icone: '🔔', alertes: true, champs: [
      { cle: 'alertes.duree', type: 'nombre', label: 'Durée d\'affichage (secondes)', min: 2 },
      { cle: 'alertes.son', type: 'case', label: 'Son des alertes' },
      { cle: 'alertes.volume', type: 'nombre', label: 'Volume (de 0 à 1)', min: 0, max: 1, pas: 0.05 },
      { cle: 'alertes.anonyme', type: 'texte', label: 'Nom quand Twitch ne donne pas le destinataire d\'un cadeau' },
    ] },
    { titre: 'Streamer.bot (alertes, bandeau, objectif)', icone: '🔌', champs: [
      { cle: 'streamerbot.actif', type: 'case', label: 'Se connecter à Streamer.bot' },
      { cle: 'streamerbot.hote', type: 'texte', label: 'Adresse', aide: 'Laisse 127.0.0.1 si Streamer.bot tourne sur le même PC.' },
      { cle: 'streamerbot.port', type: 'nombre', label: 'Port', min: 1 },
      { cle: 'streamerbot.motDePasse', type: 'secret', label: 'Mot de passe', aide: 'Seulement si tu as activé l\'authentification dans Streamer.bot.' },
    ] },
    { titre: 'Kit de chaîne Twitch', icone: '📺', champs: [
      { cle: 'chaine.slogan', type: 'texte', label: 'Slogan (sous le nom, sur la bannière)' },
      { cle: 'chaine.horsLigne', type: 'texte', label: 'Texte de l\'écran hors-ligne' },
      { cle: 'chaine.planning', type: 'paires', label: 'Planning', aide: 'Une ligne par jour, ex. « Mercredi | 20h30 ».' },
      { cle: 'chaine.reseaux', type: 'paires', label: 'Réseaux', aide: 'Une ligne par réseau, ex. « Discord | discord.gg/… ». Vide = panneau Réseaux masqué.' },
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
    ['🎉 Fin', 'scenes/fin.html?test=1'],
  ],
};
