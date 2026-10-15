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
      { cle: 'objectif.automatique', type: 'case', label: 'Les vrais nombres de la chaîne, depuis StreamElements', aide: 'Lus au branchement, puis à chaque nouveau follow ou abonnement. Décoché : compté à la main, depuis « nombre de départ ».' },
      { cle: 'objectif.follow.titre', type: 'texte', label: 'Followers : nom de l\'objectif' },
      { cle: 'objectif.follow.cible', type: 'nombre', label: 'Followers : objectif à atteindre', min: 1 },
      { cle: 'objectif.follow.depart', type: 'nombre', label: 'Followers : nombre de départ', min: 0, aide: 'Seulement sans StreamElements (ou avant sa première réponse). Le changer remet ce compteur à cette valeur.' },
      { cle: 'objectif.sub.titre', type: 'texte', label: 'Abonnés : nom de l\'objectif' },
      { cle: 'objectif.sub.cible', type: 'nombre', label: 'Abonnés : objectif à atteindre', min: 1 },
      { cle: 'objectif.sub.depart', type: 'nombre', label: 'Abonnés : nombre de départ', min: 0, aide: 'Seulement sans StreamElements (ou avant sa première réponse). Le changer remet ce compteur à cette valeur.' },
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
    { titre: 'StreamElements (alertes, bandeau, objectif)', icone: '🔌', aide: 'Le lien entre ta chaîne Twitch et l\'overlay, par internet : rien à installer. Le jeton est un SECRET : il reste dans mes-reglages.js, sur ton PC (jamais dans les mises à jour). Ne le montre pas en live.', champs: [
      { cle: 'streamelements.actif', type: 'case', label: 'Se connecter à StreamElements' },
      { cle: 'streamelements.jeton', type: 'secret', label: 'Ton jeton StreamElements (JWT Token)', aide: 'streamelements.com › ton avatar en haut à droite › ta chaîne › « Afficher les secrets » › copie le JWT Token, colle-le ici (tuto, section 6).' },
    ] },
    { titre: 'Kit de chaîne Twitch', icone: '📺', aide: 'Les textes des images de ta chaîne Twitch (ouvre chaine/kit.html pour les voir). Après un changement, refais les images : OBS › Outils › Scripts › « Refaire les images du kit Twitch ».', champs: [
      { cle: 'chaine.slogan', type: 'texte', label: 'Slogan (sous le nom, sur la bannière)' },
      { cle: 'chaine.horsLigne', type: 'texte', label: 'Texte de l\'écran hors-ligne' },
      { cle: 'chaine.dons.titre', type: 'texte', label: 'Page de dons StreamElements : titre' },
      { cle: 'chaine.dons.texte', type: 'texte', label: 'Page de dons StreamElements : petite phrase' },
      { cle: 'chaine.panneaux', type: 'liste', label: 'Panneaux de bio', aide: 'Un titre par ligne, dans l’ordre de ta chaîne. Un nom de réseau (Discord, YouTube, TikTok, Instagram, X (Twitter), Twitch, Kick, Bluesky), « Mes sites » ou « Mes créations » prend son logo : retire ceux que tu n’utilises pas.' },
      { cle: 'chaine.planning', type: 'paires', planning: true, label: 'Planning (panneau de bio)', aide: 'Une ligne par jour : « Mercredi | 20h30 », ou avec le jeu : « Mercredi | 20h30 | Minecraft ». Rempli, le panneau Planning affiche ta semaine ; vide, il garde juste son titre.' },
    ] },
    { titre: 'Scène JDR (CodexVTT)', icone: '🎲', aide: 'La scène des parties de jeu de rôle (scenes/jdr.html) : la table, les personnages, leurs PV et les jets viennent tout seuls de CodexVTT. La carte de celui qui parle sur Discord s’anime.', champs: [
      { cle: 'jdr.titre', type: 'texte', label: 'Nom de la campagne' },
      { cle: 'jdr.monPerso', type: 'texte', label: 'Mon personnage (si je joue)', aide: 'Son nom dans CodexVTT (ex. Kenai) : sa carte est mise en avant (« toi ») et tes jets sont joués en grand. Laisse vide si tu es le MJ.' },
      { cle: 'jdr.dessin', type: 'choix', label: 'Style des personnages', aide: 'Le dessin des personnages sur les cartes et dans les scénettes. Le même personnage (son apparence dans CodexVTT) est dessiné à ce style.', options: [['neon', 'Néon (traits lumineux)'], ['sticker', 'Sticker (autocollant)'], ['ecusson', 'Écusson (brodé, mission spatiale)'], ['vitrail', 'Vitrail (facettes de cristal)'], ['conte', 'Conte (livre d’images)'], ['aplat', 'Aplat (simple)']] },
      { cle: 'jdr.enPied', type: 'case', label: 'Personnages en pied dans les scénettes', aide: 'Coché : pendant un jet, le personnage apparaît en entier et joue le geste avec ses bras et ses jambes (il court, frappe, lève les bras pour un sort, se réjouit…). Décoché : le buste, comme avant.' },
      { cle: 'jdr.mj.nom', type: 'texte', label: 'Le MJ : son nom', aide: 'Une carte à son nom (le MJ n’est pas un personnage de CodexVTT). Vide = pas de carte de MJ.' },
      { cle: 'jdr.mj.discord', type: 'texte', label: 'Le MJ : son pseudo Discord', aide: 'Pour animer sa carte quand il parle.' },
      { cle: 'jdr.joueurs', type: 'paires', label: 'Qui joue qui sur Discord', aide: 'Une ligne par personnage : « Kenai | pseudo Discord » (le nom comme dans CodexVTT). Les cartes s’affichent tout de suite, même avant CodexVTT.' },
      { cle: 'jdr.ajouterAutres', type: 'case', label: 'Ajouter aussi les autres persos de joueurs de la table CodexVTT', aide: 'Décoché (conseillé) : seulement le MJ et les persos de « Qui joue qui ». Coché : tous les persos de joueurs de la table CodexVTT, même les anciens ou les absents, ont une carte en bout de rang.' },
      { cle: 'jdr.autresJets', type: 'case', label: 'Montrer aussi les jets des autres joueurs (en petit)' },
      { cle: 'jdr.pnj', type: 'case', label: 'Montrer les jets publics des PNJ du MJ (en petit)' },
      { cle: 'jdr.dureeResultat', type: 'nombre', label: 'Le résultat d’un jet reste affiché … secondes', min: 1, max: 20 },
      { cle: 'jdr.attenue', type: 'case', label: 'Quand quelqu’un parle, les autres cartes s’éteignent un peu' },
      { cle: 'jdr.codex.actif', type: 'case', label: 'Brancher CodexVTT (jets de dés, PV, combat)' },
      { cle: 'jdr.codex.adresse', type: 'texte', label: 'Adresse de CodexVTT', aide: 'La même pour toute la table (ex. https://codex.exemple.fr, sans rien après).' },
      { cle: 'jdr.codex.cle', type: 'secret', label: 'Clé spectateur de la table', aide: 'Donnée par le MJ (CodexVTT › Tableau de bord › Modifier la table › « Overlay de stream (spectateur) »). La même pour tous les overlays de la partie. Elle ne permet que de regarder.' },
      { cle: 'jdr.discord.actif', type: 'case', label: 'Brancher Discord (la carte de celui qui parle s’anime)' },
      { cle: 'jdr.discord.adresse', type: 'texte', label: 'Adresse du bot Discord', aide: 'Vide = celle du serveur des mises à jour (…/voix).' },
      { cle: 'jdr.discord.cle', type: 'secret', label: 'Clé du bot Discord', aide: 'Donnée par Bastien (affichée à la fin de l’installation du bot sur le VPS).' },
    ] },
    { titre: 'Mises à jour', icone: '🔄', aide: 'D\'où l\'overlay se met à jour : bouton « Mettre à jour l\'overlay » du script OBS (outils/actualiser-obs.lua), ou double-clic sur mettre-a-jour.cmd. Tes réglages (mes-reglages.js) ne sont jamais remplacés ; l\'ancienne version est gardée dans sauvegardes.', champs: [
      { cle: 'miseAJour.adresse', type: 'texte', label: 'Adresse du serveur des overlays', aide: 'Ex. https://overlays.bastien-lambour.fr (celle de la page de téléchargement). À ne changer que si on te le dit.' },
    ] },
    { titre: 'Mode test', icone: '🧪', champs: [
      { cle: 'test.noms', type: 'liste', label: 'Pseudos des fausses alertes (?test=1)', aide: 'Un pseudo par ligne.' },
    ] },
  ],

  tests: [
    ['🎲 Scène JDR', 'scenes/jdr.html?test=1'],
    ['🔔 Alertes', 'sources/alertes.html?test=1'],
    ['⏳ Démarrage', 'scenes/demarrage.html?test=1'],
    ['☕ Pause', 'scenes/pause.html?test=1'],
    ['💬 Cam seule', 'scenes/cam-seule.html?test=1'],
    ['🖥 Contenu', 'scenes/contenu.html?test=1'],
    ['🎮 Jeu', 'scenes/jeu.html?test=1'],
    ['🎉 Fin', 'scenes/fin.html?test=1'],
  ],

  // Aperçu d'une alerte, avec les mêmes styles et icônes que la vraie source (sources/alertes.html)
  // L'alerte à sa vraie largeur (900 px, comme sources/alertes.html), réduite pour tenir dans sa case ; puis un titre long
  // (« Soutien moral officiel ») voit sa police se réduire jusqu’à ce qu’il tienne, comme dans la vraie alerte
  apresApercu(boite) {
    boite.querySelectorAll('.apercu-alerte').forEach(a => { a.style.zoom = ''; a.style.zoom = Math.min(.5, a.getBoundingClientRect().width / 960); });
    boite.querySelectorAll('.alerte-titre').forEach(t => { t.style.fontSize = ''; for (let taille = 64; t.scrollWidth > t.clientWidth - 6 && taille > 34; taille -= 2) t.style.fontSize = taille + 'px'; });
  },
  apercuAlerte(type, { titre, nom, message }) {
    const ICONES = { follow: 'oeil', sub: 'coeur', resub: 'trophee', giftsub: 'cadeau', giftbomb: 'cadeau', bits: 'piece', raid: 'fusee', don: 'eclair', objectif: 'etoile' };
    const e = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const ico = typeof Commun !== 'undefined' ? (Commun.icones[ICONES[type]] || '') : '';
    const tache = (c, r1, r2, r3) => `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="${r1}" fill="${c}" stroke="var(--encre)" stroke-width="4"/>
      <circle cx="9" cy="48" r="${r2}" fill="${c}" stroke="var(--encre)" stroke-width="3"/><circle cx="51" cy="9" r="${r3}" fill="${c}" stroke="var(--encre)" stroke-width="3"/></svg>`;
    return `<div class="apercu-alerte" style="zoom:.42;padding:34px 30px"><div class="alerte" style="width:900px;box-sizing:border-box">
      <div class="eclabousse" style="left:-30px;top:-30px;width:70px;height:70px">${tache('#fff', 16, 7, 5)}</div>
      <div class="eclabousse" style="right:-24px;bottom:-32px;width:64px;height:64px">${tache('var(--accent)', 13, 6, 4)}</div>
      <div class="alerte-ic">${ico}</div>
      <div class="alerte-corps"><div class="alerte-tete">Alerte !!</div><div class="alerte-titre">${e(titre)}</div>
        <div class="alerte-nom">${e(nom)}</div><div class="alerte-msg">${e(message)}</div></div></div></div>`;
  },
};
