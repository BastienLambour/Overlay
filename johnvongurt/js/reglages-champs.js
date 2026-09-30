/* =====================================================================
   JOHN VON GURT — Ce que montre la page reglages.html : les réglages de
   config.js, rangés par écran, avec un libellé et une aide en français simple.
   Un réglage absent d'ici apparaît quand même, dans « Autres réglages ».
   Types : texte · twitch · nombre · case · liste (une ligne = un élément) ·
           paires (« A | B » par ligne) · choix · secret · heure
   ===================================================================== */
window.ReglagesChamps = {
  // Pour l'aperçu des alertes aux couleurs de l'overlay (icônes et styles des vraies alertes)
  scripts: ['js/commun.js'],
  styles: ['css/composants.css'],

  // Ambiances en un clic (section Couleurs) : chacune règle les 9 couleurs ; '' = la couleur d'origine du thème
  ambiances: [
    { nom: '❄️ Bleu glace', valeurs: { 'couleurs.accent': '#4CC9F0', 'couleurs.flamme': '#B8F0FF', 'couleurs.trait': '#E4F1FA', 'couleurs.doux': '#7A8FA3', 'couleurs.fond': '#08101A', 'couleurs.fond-2': '#0E1926', 'couleurs.coque': '#101C2A', 'couleurs.ok': '#5BD69A', 'couleurs.alerte': '#FF4D4D' } },
    { nom: '💚 Vert terminal', valeurs: { 'couleurs.accent': '#39FF88', 'couleurs.flamme': '#C8FFD9', 'couleurs.trait': '#DFF5E6', 'couleurs.doux': '#6B8A75', 'couleurs.fond': '#050A07', 'couleurs.fond-2': '#0A130D', 'couleurs.coque': '#0E1A12', 'couleurs.ok': '#7CFFB2', 'couleurs.alerte': '#FF5C5C' } },
    { nom: '🌌 Violet nébuleuse', valeurs: { 'couleurs.accent': '#B388FF', 'couleurs.flamme': '#F0D9FF', 'couleurs.trait': '#EEE8F8', 'couleurs.doux': '#8A7FA0', 'couleurs.fond': '#0D0A16', 'couleurs.fond-2': '#150F22', 'couleurs.coque': '#1A1329', 'couleurs.ok': '#5BD69A', 'couleurs.alerte': '#FF4D4D' } },
    { nom: '🔴 Rouge Mars', valeurs: { 'couleurs.accent': '#FF5A36', 'couleurs.flamme': '#FFC48A', 'couleurs.trait': '#F3E7E2', 'couleurs.doux': '#94807A', 'couleurs.fond': '#120A09', 'couleurs.fond-2': '#1B0F0D', 'couleurs.coque': '#211311', 'couleurs.ok': '#5BD69A', 'couleurs.alerte': '#FFD23F' } },
    { nom: '💗 Rose néon', valeurs: { 'couleurs.accent': '#FF4FA3', 'couleurs.flamme': '#FFC2E2', 'couleurs.trait': '#F6E9F2', 'couleurs.doux': '#8F7FA0', 'couleurs.fond': '#0E0912', 'couleurs.fond-2': '#170F1D', 'couleurs.coque': '#1D1325', 'couleurs.ok': '#5BD69A', 'couleurs.alerte': '#FF4D4D' } },
    { nom: '☀️ Clair', valeurs: { 'couleurs.accent': '#E07B00', 'couleurs.flamme': '#FFE08A', 'couleurs.trait': '#1D242B', 'couleurs.doux': '#6F7880', 'couleurs.fond': '#E4E6E1', 'couleurs.fond-2': '#D8DBD5', 'couleurs.coque': '#EEF0EC', 'couleurs.ok': '#2E9E6B', 'couleurs.alerte': '#E03A3A' } },
    { nom: '🎃 Halloween', valeurs: { 'couleurs.accent': '#FF6A00', 'couleurs.flamme': '#B57CFF', 'couleurs.trait': '#F3E8FF', 'couleurs.doux': '', 'couleurs.fond': '#0E0812', 'couleurs.fond-2': '#180D1E', 'couleurs.coque': '', 'couleurs.ok': '', 'couleurs.alerte': '' } },
    { nom: '🎄 Noël', valeurs: { 'couleurs.accent': '#E63946', 'couleurs.flamme': '#F5C542', 'couleurs.trait': '#EEF6EF', 'couleurs.doux': '', 'couleurs.fond': '#06130C', 'couleurs.fond-2': '#0C1F14', 'couleurs.coque': '', 'couleurs.ok': '', 'couleurs.alerte': '' } },
    { nom: '↺ Couleurs d’origine (orange)', valeurs: { 'couleurs.accent': '', 'couleurs.flamme': '', 'couleurs.trait': '', 'couleurs.doux': '', 'couleurs.fond': '', 'couleurs.fond-2': '', 'couleurs.coque': '', 'couleurs.ok': '', 'couleurs.alerte': '' } },
  ],

  sections: [
    { titre: 'La chaîne', icone: '🚀', champs: [
      { cle: 'nomChaine', type: 'texte', label: 'Nom affiché sur l\'overlay' },
      { cle: 'chaineTwitch', type: 'twitch', label: 'Identifiant Twitch', aide: 'Celui de l\'adresse twitch.tv/…, en minuscules. Sert à lire le chat (aucun mot de passe).' },
      { cle: 'scenes.grade', type: 'texte', label: 'Ton grade', aide: 'Affiché sous la cam : « John Von Gurt — Commandant ».' },
      { cle: 'scenes.statutEnDirect', type: 'texte', label: 'Statut pendant le live' },
    ] },
    { titre: 'Options des scènes', icone: '🎬', aide: 'Ce qui s\'affiche dans chaque scène : c\'est comme les options de l\'adresse (?cam=…, ?chat=0…), mais réglé une fois pour toutes. Une option écrite dans l\'adresse d\'une source passe avant.', champs: [
      { cle: 'options.jeu.cam', type: 'choix', label: 'Jeu : la webcam', options: [['bas-droite','En bas à droite'],['bas-gauche','En bas à gauche'],['haut-droite','En haut à droite'],['haut-gauche','En haut à gauche'],['aucune','Pas de webcam']] },
      { cle: 'options.jeu.chat', type: 'case', label: 'Jeu : le chat' },
      { cle: 'options.jeu.bandeau', type: 'case', label: 'Jeu : le bandeau' },
      { cle: 'options.contenu.cam', type: 'case', label: 'Contenu : une webcam' },
      { cle: 'options.contenu.chat', type: 'case', label: 'Contenu : le chat' },
      { cle: 'options.contenu.bandeau', type: 'case', label: 'Contenu : le bandeau' },
      { cle: 'options.cam-seule.chat', type: 'case', label: 'Cam seule : le chat' },
      { cle: 'options.cam-seule.bandeau', type: 'case', label: 'Cam seule : le bandeau' },
      { cle: 'afficherZones', type: 'case', label: 'Afficher la taille et la position des zones (webcam, contenu, jeu)', aide: 'À cocher le temps de placer la webcam et le jeu dans OBS, puis à décocher.' },
    ] },
    { titre: 'Couleurs', icone: '🎨', ambiances: true, aide: 'Choisis une ambiance en un clic, ou change une couleur à la main. ↺ = la couleur d\'origine.', champs: [
      { cle: 'couleurs.accent', type: 'couleur', label: 'Accent (orange « attention »)', defaut: '#FF9F1C' },
      { cle: 'couleurs.flamme', type: 'couleur', label: 'Flamme de la fusée', defaut: '#FFE08A' },
      { cle: 'couleurs.fond', type: 'couleur', label: 'Fond', defaut: '#0B0E13' },
      { cle: 'couleurs.fond-2', type: 'couleur', label: 'Fond des cadres', defaut: '#11151C' },
      { cle: 'couleurs.trait', type: 'couleur', label: 'Traits et texte', defaut: '#E6EAEE' },
      { cle: 'couleurs.doux', type: 'couleur', label: 'Texte secondaire', defaut: '#7C8793' },
      { cle: 'couleurs.coque', type: 'couleur', label: 'Décors (pas de tir, réservoirs…)', defaut: '#141920' },
      { cle: 'couleurs.ok', type: 'couleur', label: 'Validé (vert)', defaut: '#5BD69A' },
      { cle: 'couleurs.alerte', type: 'couleur', label: 'Alerte (rouge : balises, REC)', defaut: '#FF4D4D' },
    ] },
    { titre: 'Démarrage (la fusée sur le pas de tir)', icone: '⏱️', champs: [
      { cle: 'demarrage.titre', type: 'texte', label: 'Titre' },
      { cle: 'demarrage.statut', type: 'texte', label: 'Statut pendant le ravitaillement' },
      { cle: 'demarrage.minutes', type: 'nombre', label: 'Compte à rebours (minutes)', min: 0, aide: 'Le ravitaillement se termine à T-30 s, puis décompte final de 10 s et décollage. Se change aussi dans OBS : Interagir › bouton ⚙ DURÉE.' },
      { cle: 'demarrage.heure', type: 'heure', label: '… ou heure fixe', aide: 'Si elle est remplie, elle passe avant les minutes (ex. 20:30 : le compteur arrive à zéro à 20 h 30). Vide = compte à rebours en minutes.' },
      { cle: 'demarrage.verifications', type: 'liste', label: 'Liste des vérifications', aide: 'Une vérification par ligne ; elles se cochent pendant le ravitaillement.' },
      { cle: 'demarrage.activites', type: 'liste', label: 'Ligne d’activité (bas du panneau)', aide: 'Une ligne par vérification, dans le même ordre : ce qui s’affiche pendant qu’elle est en cours. Reste court.' },
      { cle: 'demarrage.popupSecondes', type: 'nombre', label: 'Durée du message « Ravitaillement terminé » (secondes)', min: 1 },
      { cle: 'demarrage.ravitaillementTermine', type: 'texte', label: 'Fin du ravitaillement' },
      { cle: 'demarrage.sequenceFinale', type: 'texte', label: 'Séquence finale' },
      { cle: 'demarrage.statutSequenceFinale', type: 'texte', label: 'Statut pendant la séquence finale' },
      { cle: 'demarrage.decollage', type: 'texte', label: 'Au décollage' },
      { cle: 'demarrage.lancementReussi', type: 'texte', label: 'Après le décollage' },
      { cle: 'demarrage.statutDecollage', type: 'texte', label: 'Statut après le décollage' },
      { cle: 'demarrage.fermeturePanneauSecondes', type: 'nombre', label: 'Secondes avant que le panneau se ferme et que la caméra suive la fusée', min: 0 },
      { cle: 'demarrage.activiteAllumage', type: 'texte', label: 'Activité à l’allumage' },
      { cle: 'demarrage.activiteDecollage', type: 'texte', label: 'Activité au décollage' },
      { cle: 'demarrage.activiteReussi', type: 'texte', label: 'Activité après le décollage' },
    ] },
    { titre: 'Pause', icone: '📡', champs: [
      { cle: 'pause.titre', type: 'texte', label: 'Titre' },
      { cle: 'pause.statut', type: 'texte', label: 'Statut' },
    ] },
    { titre: 'Fin (alunissage)', icone: '🌙', champs: [
      { cle: 'fin.titre', type: 'texte', label: 'Titre' },
      { cle: 'fin.statut', type: 'texte', label: 'Statut' },
      { cle: 'fin.message', type: 'texte', label: 'Message', large: true },
    ] },
    { titre: 'Le chat', icone: '💬', champs: [
      { cle: 'chat.titre', type: 'texte', label: 'Titre de la carte du chat' },
      { cle: 'chat.maxMessages', type: 'nombre', label: 'Nombre de messages affichés', min: 1 },
      { cle: 'chat.memoireMinutes', type: 'nombre', label: 'Mémoire (minutes)', min: 0, aide: 'En changeant de scène, le chat réaffiche les messages de ces dernières minutes. 0 = jamais.' },
      { cle: 'chat.masquerCommandes', type: 'case', label: 'Cacher les commandes (messages qui commencent par « ! »)' },
      { cle: 'chat.ignorer', type: 'liste', label: 'Comptes cachés (les bots)', aide: 'Un pseudo par ligne.' },
    ] },
    { titre: 'Objectif (jauge Terre → Lune)', icone: '🎯', champs: [
      { cle: 'objectif.type', type: 'choix', label: 'Ce qu\'on compte', options: [['follow', 'Les follows'], ['sub', 'Les abonnements']] },
      { cle: 'objectif.titre', type: 'texte', label: 'Nom de l\'objectif' },
      { cle: 'objectif.cible', type: 'nombre', label: 'Objectif à atteindre', min: 1 },
      { cle: 'objectif.depart', type: 'nombre', label: 'Ton nombre ACTUEL', min: 0, aide: 'Ton nombre actuel de followers (ou d\'abonnés). Le changer remet le compteur à cette valeur.' },
    ] },
    { titre: 'Bandeau d\'infos', icone: '📰', aide: 'La barre en bas des scènes : décoche ce que tu ne veux pas voir.', champs: [
      { cle: 'bandeau.follow', type: 'case', label: '« Dernière recrue » : dernier follow' },
      { cle: 'bandeau.abonne', type: 'case', label: '« Dernier abonné » : dernier abonné', aide: 'Seulement si ta chaîne est affiliée ou partenaire.' },
      { cle: 'bandeau.soutien', type: 'case', label: '« Dernier soutien » : dernier don ou bits', aide: 'Décoche si tu ne reçois ni dons ni bits.' },
      { cle: 'bandeau.objectif', type: 'case', label: 'L\'objectif et sa mini-jauge' },
    ] },
    { titre: 'Alertes', icone: '🔔', alertes: true, champs: [
      { cle: 'alertes.duree', type: 'nombre', label: 'Durée d\'affichage (secondes)', min: 2 },
      { cle: 'alertes.son', type: 'case', label: 'Son des alertes' },
      { cle: 'alertes.volume', type: 'nombre', label: 'Volume (de 0 à 1)', min: 0, max: 1, pas: 0.05 },
      { cle: 'alertes.anonyme', type: 'texte', label: 'Nom quand Twitch ne donne pas le destinataire d\'un cadeau' },
    ] },
    { titre: 'Petits textes de décor', icone: '🛰️', champs: [
      { cle: 'decor.protocole', type: 'texte', label: 'Version du protocole' },
      { cle: 'decor.capteurs', type: 'texte', label: 'Capteurs' },
      { cle: 'decor.exploration', type: 'texte', label: 'Exploration' },
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
    ['🚀 Démarrage (1 min)', 'scenes/demarrage.html?minutes=1'],
    ['📡 Pause', 'scenes/pause.html?test=1'],
    ['💬 Cam seule', 'scenes/cam-seule.html?test=1'],
    ['🖥 Contenu', 'scenes/contenu.html?test=1'],
    ['🎮 Jeu', 'scenes/jeu.html?test=1'],
    ['🌙 Fin', 'scenes/fin.html'],
  ],

  // Aperçu d'une alerte, avec les mêmes styles et icônes que la vraie source (sources/alertes.html)
  apercuAlerte(type, { titre, nom, message }) {
    const ICONES = { follow: 'casque', sub: 'fusee', resub: 'fusee', giftsub: 'groupe', giftbomb: 'groupe', bits: 'carburant', raid: 'radar', don: 'coeur', objectif: 'cible' };
    const e = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const ico = typeof Commun !== 'undefined' ? (Commun.icones[ICONES[type]] || '') : '';
    return `<div class="alerte" style="position:relative;zoom:.42;width:100%">
      <div class="alerte-icone"><span>${ico}</span></div>
      <div class="alerte-corps"><div class="alerte-tete"><span>Transmission entrante</span><span class="hachures"></span></div>
        <div class="alerte-titre">${e(titre)}</div><div class="alerte-nom">${e(nom)}</div>
        <div class="alerte-msg visible">${e(message)}</div></div></div>`;
  },
};
