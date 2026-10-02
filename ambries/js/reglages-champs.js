/* =====================================================================
   AMBRIES_ — Ce que montre la page reglages.html : les réglages de config.js,
   rangés par écran, avec un libellé et une aide en français simple.
   Un réglage absent d'ici apparaît quand même, dans « Autres réglages ».
   Types : texte · twitch · nombre · case · liste (une ligne = un élément) ·
           paires (« A | B » par ligne) · choix · secret · heure · couleur · son
           (section « scenes: true » : le tableau des options des scènes, construit depuis config.js › options)
   ===================================================================== */
window.ReglagesChamps = {
  // Pour l'aperçu des alertes aux couleurs de l'overlay (icônes et styles des vraies alertes)
  scripts: ['js/commun.js', 'js/son.js'],   // son.js : pour le bouton ▶ des sons
  styles: ['css/composants.css'],

  // Ambiances en un clic (section Couleurs) : les couleurs non citées reviennent à celles du thème
  ambiances: [
    { nom: '🎃 Halloween', valeurs: { 'couleurs.violet': '#FF7A1A', 'couleurs.mauve': '#FFB266', 'couleurs.accent': '#B57CFF', 'couleurs.lilas': '#FFE3CC', 'couleurs.fond': '#160A1E', 'couleurs.fond-2': '', 'couleurs.surface': '', 'couleurs.texte': '' } },
    { nom: '🎄 Noël', valeurs: { 'couleurs.violet': '#2FD37A', 'couleurs.mauve': '#8CF0B5', 'couleurs.accent': '#FF4D4D', 'couleurs.lilas': '#E0FFEC', 'couleurs.fond': '#07170F', 'couleurs.fond-2': '#0D2418', 'couleurs.surface': '#143322', 'couleurs.texte': '' } },
    { nom: '↺ Couleurs d\'origine', valeurs: { 'couleurs.violet': '', 'couleurs.mauve': '', 'couleurs.accent': '', 'couleurs.lilas': '', 'couleurs.fond': '', 'couleurs.fond-2': '', 'couleurs.surface': '', 'couleurs.texte': '' } },
  ],

  sections: [
    { titre: 'La chaîne', icone: '💜', champs: [
      { cle: 'nomChaine', type: 'texte', label: 'Nom affiché sur l\'overlay' },
      { cle: 'chaineTwitch', type: 'twitch', label: 'Identifiant Twitch', aide: 'Celui de l\'adresse twitch.tv/…, en minuscules. Sert à lire le chat (aucun mot de passe).' },
      { cle: 'devise', type: 'texte', label: 'Ta devise', aide: 'Petite phrase fétiche, reprise sur les écrans et la bannière.' },
    ] },
    { titre: 'Options des scènes', icone: '🎬', scenes: true, aide: 'Ce qui s\'affiche dans chaque scène (allumé = affiché). C\'est comme les options de l\'adresse (?cam=…, ?chat=0…), mais réglé une fois pour toutes ; une option écrite dans l\'adresse d\'une source passe avant.', champs: [
      { cle: 'afficherZones', type: 'case', label: 'Afficher la taille et la position des zones (webcam, contenu, jeu)', aide: 'À cocher le temps de placer la webcam et le jeu dans OBS, puis à décocher.' },
    ] },
    { titre: 'Couleurs', icone: '🎨', ambiances: true, aide: 'Choisis une ambiance en un clic, ou change une couleur à la main. ↺ = la couleur d\'origine.', champs: [
      { cle: 'couleurs.violet', type: 'couleur', label: 'Néon principal (violet)', defaut: '#A855F7' },
      { cle: 'couleurs.mauve', type: 'couleur', label: 'Mauve', defaut: '#C084FC' },
      { cle: 'couleurs.accent', type: 'couleur', label: 'Néon secondaire (rose)', defaut: '#FF4FD8' },
      { cle: 'couleurs.lilas', type: 'couleur', label: 'Lilas (reflets clairs)', defaut: '#EBDDFF' },
      { cle: 'couleurs.fond', type: 'couleur', label: 'Fond (nuit violette)', defaut: '#12081F' },
      { cle: 'couleurs.fond-2', type: 'couleur', label: 'Fond, plus clair', defaut: '#1D0F33' },
      { cle: 'couleurs.surface', type: 'couleur', label: 'Cartes et bulles', defaut: '#28164A' },
      { cle: 'couleurs.texte', type: 'couleur', label: 'Texte', defaut: '#F6EEFF' },
    ] },
    { titre: 'Démarrage', icone: '⏳', champs: [
      { cle: 'demarrage.titre', type: 'texte', label: 'Titre' },
      { cle: 'demarrage.minutes', type: 'nombre', label: 'Compte à rebours (minutes)', min: 0 },
      { cle: 'demarrage.heure', type: 'heure', label: '… ou heure fixe', aide: 'Si elle est remplie, elle passe avant les minutes (ex. 20:30 : le compteur arrive à zéro à 20 h 30). Vide = compte à rebours en minutes.' },
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
      { cle: 'objectif.affiche', type: 'choix', label: 'Ce que la barre affiche', options: [['follow', 'Les followers'], ['sub', 'Les abonnés']], aide: 'Change quand tu veux : les deux compteurs tournent toujours, la barre est tout de suite juste.' },
      { cle: 'objectif.automatique', type: 'case', label: 'Les vrais nombres de la chaîne, depuis Streamer.bot', aide: 'Avec l\'action « Overlay – Compteurs » dans Streamer.bot (tuto, section 6). Décoché : compté à la main, depuis « nombre de départ ».' },
      { cle: 'objectif.follow.titre', type: 'texte', label: 'Followers : nom de l\'objectif' },
      { cle: 'objectif.follow.cible', type: 'nombre', label: 'Followers : objectif à atteindre', min: 1 },
      { cle: 'objectif.follow.depart', type: 'nombre', label: 'Followers : nombre de départ', min: 0, aide: 'Seulement sans Streamer.bot (ou avant sa première réponse). Le changer remet ce compteur à cette valeur.' },
      { cle: 'objectif.sub.titre', type: 'texte', label: 'Abonnés : nom de l\'objectif' },
      { cle: 'objectif.sub.cible', type: 'nombre', label: 'Abonnés : objectif à atteindre', min: 1 },
      { cle: 'objectif.sub.depart', type: 'nombre', label: 'Abonnés : nombre de départ', min: 0, aide: 'Seulement sans Streamer.bot (ou avant sa première réponse). Le changer remet ce compteur à cette valeur.' },
    ] },
    { titre: 'Bandeau d\'infos', icone: '📰', aide: 'La barre en bas des scènes : décoche ce que tu ne veux pas voir.', champs: [
      { cle: 'bandeau.follow', type: 'case', label: '« Dernier témoin » : dernier follow' },
      { cle: 'bandeau.abonne', type: 'case', label: '« Soutien moral » : dernier abonné', aide: 'Seulement si ta chaîne est affiliée ou partenaire.' },
      { cle: 'bandeau.soutien', type: 'case', label: '« Fonds pour excuses » : dernier don ou bits', aide: 'Décoche si tu ne reçois ni dons ni bits.' },
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
      { cle: 'chaine.slogan', type: 'texte', label: 'Slogan (sous le nom, sur la bannière)' },
      { cle: 'chaine.horsLigne', type: 'texte', label: 'Texte de l\'écran hors-ligne' },
      { cle: 'chaine.planning', type: 'paires', label: 'Planning', aide: 'Une ligne par jour, ex. « Mercredi | 20h30 ».' },
      { cle: 'chaine.reseaux', type: 'paires', label: 'Réseaux', aide: 'Une ligne par réseau, ex. « Discord | discord.gg/… ». Vide = panneau Réseaux masqué.' },
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
    ['⏳ Démarrage', 'scenes/demarrage.html?test=1'],
    ['☕ Pause', 'scenes/pause.html?test=1'],
    ['💬 Cam seule', 'scenes/cam-seule.html?test=1'],
    ['🖥 Contenu', 'scenes/contenu.html?test=1'],
    ['🎮 Jeu', 'scenes/jeu.html?test=1'],
    ['🎉 Fin', 'scenes/fin.html?test=1'],
  ],

  // Aperçu d'une alerte, avec les mêmes styles et icônes que la vraie source (sources/alertes.html)
  apercuAlerte(type, { titre, nom, message }) {
    const ICONES = { follow: 'oeil', sub: 'coeur', resub: 'trophee', giftsub: 'cadeau', giftbomb: 'cadeau', bits: 'piece', raid: 'fusee', don: 'eclair', objectif: 'etoile' };
    const e = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const ico = typeof Commun !== 'undefined' ? (Commun.icones[ICONES[type]] || '') : '';
    const tache = (c, r1, r2, r3) => `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="${r1}" fill="${c}" stroke="var(--encre)" stroke-width="4"/>
      <circle cx="9" cy="48" r="${r2}" fill="${c}" stroke="var(--encre)" stroke-width="3"/><circle cx="51" cy="9" r="${r3}" fill="${c}" stroke="var(--encre)" stroke-width="3"/></svg>`;
    return `<div style="zoom:.42;padding:34px 30px"><div class="alerte">
      <div class="eclabousse" style="left:-30px;top:-30px;width:70px;height:70px">${tache('#fff', 16, 7, 5)}</div>
      <div class="eclabousse" style="right:-24px;bottom:-32px;width:64px;height:64px">${tache('var(--accent)', 13, 6, 4)}</div>
      <div class="alerte-ic">${ico}</div>
      <div class="alerte-corps"><div class="alerte-tete">Alerte !!</div><div class="alerte-titre">${e(titre)}</div>
        <div class="alerte-nom">${e(nom)}</div><div class="alerte-msg">${e(message)}</div></div></div></div>`;
  },
};
