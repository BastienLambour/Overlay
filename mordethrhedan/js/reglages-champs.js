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
    { titre: 'Derniers événements (ligne du bas)', icone: '🏷️', aide: 'Sub, raid et série de visionnage arrivent par le chat Twitch ; le dernier follow (et aussi sub et raid) par StreamElements, avec le jeton de la section StreamElements.', champs: [
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
      { cle: 'objectif.affiche', type: 'choix', label: 'Ce que la barre affiche', options: [['follow', 'Les followers'], ['sub', 'Les abonnés']], aide: 'Change quand tu veux : les deux compteurs tournent toujours, la barre est tout de suite juste.' },
      { cle: 'objectif.automatique', type: 'case', label: 'Les vrais nombres de la chaîne, depuis StreamElements', aide: 'Lus au branchement, puis à chaque nouveau follow ou abonnement. Décoché : compté à la main, depuis « nombre de départ ».' },
      { cle: 'objectif.follow.titre', type: 'texte', label: 'Followers : nom de l\'objectif' },
      { cle: 'objectif.follow.cible', type: 'nombre', label: 'Followers : objectif à atteindre', min: 1 },
      { cle: 'objectif.follow.depart', type: 'nombre', label: 'Followers : nombre de départ', min: 0, aide: 'Seulement sans StreamElements (ou avant sa première réponse). Le changer remet ce compteur à cette valeur.' },
      { cle: 'objectif.sub.titre', type: 'texte', label: 'Abonnés : nom de l\'objectif' },
      { cle: 'objectif.sub.cible', type: 'nombre', label: 'Abonnés : objectif à atteindre', min: 1 },
      { cle: 'objectif.sub.depart', type: 'nombre', label: 'Abonnés : nombre de départ', min: 0, aide: 'Seulement sans StreamElements (ou avant sa première réponse). Le changer remet ce compteur à cette valeur.' },
    ] },
    { titre: 'Alertes', icone: '🔔', alertes: true, champs: [
      { cle: 'alertes.duree', type: 'nombre', label: 'Durée d\'affichage (secondes)', min: 2 },
      { cle: 'alertes.son', type: 'case', label: 'Son des alertes' },
      { cle: 'alertes.volume', type: 'nombre', label: 'Volume (de 0 à 1)', min: 0, max: 1, pas: 0.05 },
      { cle: 'alertes.anonyme', type: 'texte', label: 'Nom quand Twitch ne donne pas le destinataire d\'un cadeau' },
    ] },
    { titre: 'Sons des alertes', icone: '🔊', sons: true, aide: 'Chaque alerte a son propre son, pour la reconnaître à l\'oreille en jouant. ▶ pour écouter. Laisse vide pour garder le son de l\'overlay, écris « aucun » pour ne rien jouer, ou mets ton propre fichier (mp3, wav, ogg) dans le dossier sons/ et écris son nom : sons/follow.mp3.', champs: [] },
    { titre: 'StreamElements (alertes, bandeau, objectif)', icone: '🔌', aide: 'Le lien entre ta chaîne Twitch et l\'overlay, par internet : rien à installer. Le jeton est un SECRET : il reste dans mes-reglages.js, sur ton PC (jamais dans les mises à jour). Ne le montre pas en live.', champs: [
      { cle: 'streamelements.actif', type: 'case', label: 'Se connecter à StreamElements' },
      { cle: 'streamelements.jeton', type: 'secret', label: 'Ton jeton StreamElements (JWT Token)', aide: 'streamelements.com › ton avatar en haut à droite › ta chaîne › « Afficher les secrets » › copie le JWT Token, colle-le ici (tuto, section 6).' },
    ] },
    { titre: 'Kit de chaîne Twitch', icone: '📺', champs: [
      { cle: 'chaine.slogan', type: 'texte', label: 'Slogan (bannière de profil)' },
      { cle: 'chaine.horsLigne', type: 'texte', label: 'Texte de l\'écran hors-ligne' },
      { cle: 'chaine.dons.titre', type: 'texte', label: 'Page de dons StreamElements : titre', aide: 'Sur la bannière et le fond de ta page de dons (voir le kit). Ensuite, refais les images du kit.' },
      { cle: 'chaine.dons.texte', type: 'texte', label: 'Page de dons StreamElements : petite phrase' },
      { cle: 'chaine.planning', type: 'paires', label: 'Planning', aide: 'Une ligne par jour, ex. « Mercredi | 20h30 ».' },
      { cle: 'chaine.reseaux', type: 'paires', label: 'Réseaux', aide: 'Une ligne par réseau, ex. « Discord | discord.gg/… ».' },
      { cle: 'chaine.panneaux', type: 'liste', label: 'Panneaux de bio', aide: 'Un titre par ligne. Un nom de réseau (Discord, YouTube, TikTok, Instagram, X (Twitter), Twitch, Kick, Bluesky) prend son logo : retire ceux que tu n’utilises pas. Ensuite, refais les images : node outils/exporter-chaine.mjs' },
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
    return `<div style="position:relative;zoom:.42;padding:26px 40px 30px;text-align:center;color:var(--texte);--f-texte:var(--f-ecran);font-family:var(--f-texte);font-synthesis:none">
      <div class="cadre verre" style="position:absolute;inset:0${grand ? ';box-shadow:0 0 0 2px var(--accent-fonce),0 0 40px var(--accent-halo),inset 0 0 0 2px var(--accent-fonce),inset 0 0 30px var(--accent-halo)' : ''}"></div>
      <div class="titre-neon" style="position:relative;font-size:64px">${e(titre)}</div>
      <div style="position:relative;font:900 56px/1.1 var(--f-texte);margin-top:12px;overflow-wrap:anywhere">${e(nom)}</div>
      <div style="position:relative;font:700 30px var(--f-texte);color:var(--doux);margin-top:6px">${e(message)}</div></div>`;
  },
};
