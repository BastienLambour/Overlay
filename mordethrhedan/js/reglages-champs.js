/* =====================================================================
   MORDETHRHEDAN — Ce que montre la page reglages.html : les réglages de
   config.js, rangés par écran, avec un libellé et une aide en français simple.
   Un réglage absent d'ici apparaît quand même, dans « Autres réglages ».
   Types : texte · twitch · nombre · case · liste (une ligne = un élément) ·
           paires (« A | B » par ligne) · choix · secret · heure · couleur · son
           (section « scenes: true » : le tableau des options des scènes, construit depuis config.js › options)
   ===================================================================== */
window.ReglagesChamps = {
  // Pour l'aperçu des alertes : la couleur d'accent de l'overlay (config.js › couleur)
  scripts: ['js/commun.js', 'js/son.js'],   // son.js : pour le bouton ▶ des sons

  // Ambiances en un clic (section Couleurs) : les couleurs non citées reviennent à celles du thème
  ambiances: [
    { nom: '🎃 Halloween', valeurs: { 'couleurs.fond': '#0A0508', 'couleurs.texte': '', 'couleurs.doux': '', 'couleur': 'orange' } },
    { nom: '🎄 Noël', valeurs: { 'couleurs.fond': '#03100A', 'couleurs.texte': '', 'couleurs.doux': '', 'couleur': 'rouge' } },
    { nom: '↺ Couleurs d\'origine', valeurs: { 'couleurs.fond': '', 'couleurs.texte': '', 'couleurs.doux': '', 'couleur': 'vert' } },
  ],

  // Options des scènes : noms des lignes et colonnes du tableau (en plus de ceux par défaut)
  scenes: { cam: 'Cadre de la cam (Jeu)' },
  elements: { pseudo: '🏷️ Pseudo sur le cadre' },

  sections: [
    { titre: 'La chaîne', icone: '💎', champs: [
      { cle: 'nomChaine', type: 'texte', label: 'Nom affiché sur l\'overlay' },
      { cle: 'chaineTwitch', type: 'twitch', label: 'Identifiant Twitch', aide: 'Celui de l\'adresse twitch.tv/…, en minuscules. Sert à lire le chat (aucun mot de passe).' },
    ] },
    { titre: 'Options des scènes', icone: '🎬', scenes: true, aide: 'Ce qui s\'affiche dans chaque scène (allumé = affiché). Speedrun : chat éteint = ton LiveSplit visible à la place. Cadre de la cam (sources/cam.html) : ton pseudo sur le cadre, qui disparaît avec le groupe de la cam dans OBS. Une option écrite dans l\'adresse d\'une source passe avant.', champs: [
      { cle: 'afficherZones', type: 'case', label: 'Afficher la taille et la position des zones (webcam, contenu, jeu)', aide: 'À cocher le temps de placer la webcam et le jeu dans OBS, puis à décocher.' },
    ] },
    { titre: 'Couleur et fond', icone: '🎨', ambiances: true, aide: 'Choisis une ambiance en un clic, ou change une couleur à la main. ↺ = la couleur d\'origine. La couleur des cadres et des éclats se règle juste au-dessus (« Couleur des cadres et des éclats »).', champs: [
      { cle: 'couleur', type: 'texte', label: 'Couleur des cadres et des éclats', aide: 'vert, rouge, bleu, violet, orange, cyan, jaune, rose — ou un code couleur, ex. #FFD400. Aussi source par source : jeu.html?couleur=rouge' },
      { cle: 'couleurs.fond', type: 'couleur', label: 'Fond (autour de ton image)', defaut: '#050607' },
      { cle: 'couleurs.texte', type: 'couleur', label: 'Texte', defaut: '#F2F5F3' },
      { cle: 'couleurs.doux', type: 'couleur', label: 'Texte secondaire', defaut: '#9AA3A0' },
      { cle: 'halo', type: 'choix', label: 'Halo autour des cadres', options: [['leger', 'Léger'], ['moyen', 'Moyen'], ['fort', 'Fort']] },
      { cle: 'fond.graine', type: 'nombre', label: 'Motif des facettes (un nombre)', aide: 'Change ce nombre pour obtenir un autre motif.' },
      { cle: 'fond.animation', type: 'case', label: 'Les éclats du fond respirent doucement', aide: 'Décoché = fond fixe.' },
      { cle: 'voile', type: 'nombre', label: 'Voile sur ton image (de 0 à 0,6)', min: 0, max: 0.6, pas: 0.05, aide: 'Assombrit un peu ton image derrière les grands titres.' },
    ] },
    { titre: 'Écrans avec un grand titre', icone: '🖼️', aide: 'Pour aller à la ligne dans un titre, écris <br>.', champs: [
      { cle: 'demarrage.titre', type: 'texte', label: 'Démarrage : titre' },
      { cle: 'demarrage.minutes', type: 'nombre', label: 'Démarrage : compte à rebours (minutes)', min: 0 },
      { cle: 'demarrage.heure', type: 'heure', label: '… ou heure fixe', aide: 'Si elle est remplie, elle passe avant les minutes (ex. 20:30 : le compteur arrive à zéro à 20 h 30). Vide = compte à rebours en minutes.' },
      { cle: 'demarrage.finCompte', type: 'texte', label: 'Démarrage : quand le compteur arrive à zéro' },
      { cle: 'pause.titre', type: 'texte', label: 'Pause : titre' },
      { cle: 'fin.titre', type: 'texte', label: 'Fin : titre' },
    ] },
    { titre: 'Derniers événements (ligne du bas)', icone: '🏷️', aide: 'Sub, raid et série de visionnage arrivent tout seuls par le chat Twitch. Le dernier follow a besoin de ta clé Streamlabs.', champs: [
      { cle: 'streamlabs.jeton', type: 'secret', label: 'Clé Streamlabs (pour le dernier follow)', aide: 'streamlabs.com › Paramètres › API Settings › API Tokens › « Your Socket API Token ». Clé privée : ne la montre pas en live.' },
      { cle: 'derniers.follow', type: 'texte', label: 'Titre de la case « follow »' },
      { cle: 'derniers.sub', type: 'texte', label: 'Titre de la case « sub »' },
      { cle: 'derniers.raid', type: 'texte', label: 'Titre de la case « raid »' },
      { cle: 'derniers.serie', type: 'texte', label: 'Titre de la case « série de visionnage »' },
      { cle: 'derniers.vide', type: 'texte', label: 'Affiché tant qu\'il n\'y a personne' },
    ] },
    { titre: 'Le chat', icone: '💬', champs: [
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
    { titre: 'Sons des alertes', icone: '🔊', sons: true, aide: 'Chaque alerte a son propre son, pour la reconnaître à l\'oreille en jouant. ▶ pour écouter. Laisse vide pour garder le son de l\'overlay, écris « aucun » pour ne rien jouer, ou mets ton propre fichier (mp3, wav, ogg) dans le dossier sons/ et écris son nom : sons/follow.mp3.', champs: [] },
    { titre: 'Streamer.bot (alertes, objectif)', icone: '🔌', champs: [
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
    ['⏱️ Démarrage', 'scenes/demarrage.html?test=1'],
    ['☕ Pause', 'scenes/pause.html?test=1'],
    ['💬 Cam seule', 'scenes/cam-seule.html?test=1'],
    ['🖥 Contenu', 'scenes/contenu.html?test=1'],
    ['🎮 Jeu', 'scenes/jeu.html?test=1'],
    ['🏁 Speedrun', 'scenes/speedrun.html?test=1'],
    ['👋 Fin', 'scenes/fin.html?test=1'],
  ],

  // Aperçu d'une alerte, comme la vraie source (sources/alertes.html) : carte « verre » néon
  apercuAlerte(type, { titre, nom, message }) {
    const e = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    if (typeof Commun !== 'undefined' && !this.couleurAppliquee) { Commun.appliquerCouleur(Commun.C.couleur); this.couleurAppliquee = true; }
    const grand = ['raid', 'giftbomb', 'objectif'].includes(type);
    return `<div style="position:relative;zoom:.42;padding:26px 40px 30px;text-align:center;color:var(--texte)">
      <div class="cadre verre" style="position:absolute;inset:0${grand ? ';box-shadow:0 0 0 2px var(--accent-fonce),0 0 40px var(--accent-halo),inset 0 0 0 2px var(--accent-fonce),inset 0 0 30px var(--accent-halo)' : ''}"></div>
      <div class="titre-neon" style="position:relative;font-size:64px">${e(titre)}</div>
      <div style="position:relative;font:900 56px/1.1 var(--f-texte);margin-top:12px;overflow-wrap:anywhere">${e(nom)}</div>
      <div style="position:relative;font:700 30px var(--f-texte);color:var(--doux);margin-top:6px">${e(message)}</div></div>`;
  },
};
