/* =====================================================================
   MORDETHRHEDAN — Configuration de l'overlay : c'est ici qu'on modifie les textes.
   Le plus simple : ouvre reglages.html (un formulaire qui modifie ce fichier).
   Enregistre, puis actualise la source dans OBS (clic droit > Actualiser).
   Règles : garde les guillemets "…" autour des textes et la virgule en fin de ligne.
   ===================================================================== */
window.CONFIG = {
  nomChaine: "Mordethrhedan",

  // Identifiant technique de l'overlay (nom du dossier) : sépare les compteurs d'un overlay à l'autre.
  id: "mordethrhedan",

  // Identifiant Twitch de la chaîne (celui de l'adresse twitch.tv/xxxx), en minuscules.
  // Sert à lire le chat (aucun mot de passe nécessaire).
  chaineTwitch: "mordethrhedan",

  // Couleur des cadres ET des éclats du fond.
  // Nom : "vert", "rouge", "bleu", "violet", "orange", "cyan", "jaune", "rose"
  // ou un code couleur, ex. "#FFD400".
  // Peut aussi se changer source par source dans OBS : jeu.html?couleur=rouge
  couleur: "vert",

  // Intensité du halo autour des cadres : "leger", "moyen" ou "fort"
  halo: "leger",

  fond: {
    graine: 7,          // change ce nombre pour obtenir un autre motif de facettes
    animation: true,    // éclats qui respirent très doucement (false = fond fixe)
  },

  // Étiquettes « taille + position » affichées dans les zones où placer la webcam / le contenu / le jeu.
  // Désactivées par défaut. Mets true le temps de régler la webcam et le jeu dans OBS (ou ?zones=1 dans l'adresse).
  afficherZones: false,

  // --- Options des scènes : comme les options d'adresse (?cam=…, ?chat=0…), mais pour de bon ---
  // true = affiché · false = caché · cam (scène Jeu) : "bas-droite", "bas-gauche", "haut-droite", "haut-gauche", "aucune",
  // ou une position perso { x: 1200, y: 700, l: 420, h: 236 } (pixels 1920 × 1080). Les préréglages et leurs coordonnées : js/zones.js.
  // Une option écrite dans l'adresse d'une source passe avant. Le plus simple : reglages.html › Options des scènes.
  // derniers : la ligne du bas (dernier follow / sub / raid / série). chat en Speedrun : false = LiveSplit visible.
  options: {
    jeu: { cam: "haut-gauche" },
    cam: { pseudo: true },          // sources/cam.html : le pseudo sur le cadre de la cam (false = sans)
    "cam-seule": { chat: true },
    contenu: { chat: true },
    speedrun: { chat: false },
    demarrage: { chat: true },
    pause: { chat: true },
    fin: { chat: true },
  },

  // --- Couleurs : pour changer d'ambiance sans toucher au thème (ex. Halloween) ---
  // Un code couleur (ex. "#FF7A1A") remplace la couleur du thème ; vide = la couleur d'origine.
  // Le plus simple : reglages.html › Couleurs (avec des ambiances en un clic).
  couleurs: {
    fond:             "",   // Fond (autour de ton image)
    texte:            "",   // Texte
    doux:             "",   // Texte secondaire
  },

  // ---------------------------------------------------------------------
  // Streamer.bot (gratuit) : fait le lien entre Twitch et l'overlay pour
  // les follows, abonnements, bits, raids et dons. Voir TUTO.md.
  // ---------------------------------------------------------------------
  streamerbot: {
    actif: true,
    hote: "127.0.0.1",
    port: 8080,
    motDePasse: "",     // seulement si tu as activé l'authentification dans Streamer.bot
  },

  // Écrans avec un grand titre (posés sur ton image)
  demarrage: {
    titre: "Ça commence bientôt",
    // Durée du compte à rebours en minutes (ou dans l'URL : demarrage.html?minutes=10)
    minutes: 10,
    heure: "",            // … ou heure fixe "20:30" : prioritaire sur les minutes (vide = compte à rebours en minutes)
    finCompte: "C'est parti !",
  },
  pause: {
    titre: "Petite pause<br>en cours",   // <br> = retour à la ligne
  },
  fin: {
    titre: "Merci d'être<br>passés !",
  },
  // Assombrit légèrement ton image derrière les titres (0 = pas du tout, 0.6 = beaucoup)
  voile: 0.35,

  // --- Ligne du bas : derniers événements ---
  // Sub, raid et série de visionnage arrivent tout seuls par le chat Twitch.
  // Le follow a besoin de Streamlabs (voir « streamlabs » juste en dessous).
  derniers: {
    follow: "Dernier follow",
    sub:    "Dernier sub",
    raid:   "Dernier raid",
    serie:  "Série de visionnage",
    vide:   "—",                // affiché tant qu'il n'y a encore personne
  },

  // --- Streamlabs : pour afficher le dernier follow ---
  // Streamlabs (site) › Paramètres › API Settings › API Tokens › « Your Socket API Token » : copie-le ici.
  // C'est une clé privée : ne partage pas ce fichier une fois rempli.
  streamlabs: {
    jeton: "",
  },

  // Chat intégré
  chat: {
    maxMessages: 12,
    ignorer: ["nightbot", "streamelements", "streamlabs", "moobot", "fossabot", "wizebot"],
    masquerCommandes: true,     // cache les messages qui commencent par « ! »
    memoireMinutes: 10,      // en changeant de scène, le chat réaffiche les messages des 10 dernières minutes (0 = jamais)
  },

  // Objectif (source objectif.html)
  objectif: {
    type: "follow",             // "follow" ou "sub"
    titre: "Objectif followers",
    cible: 100,
    depart: 0,                  // mets ici ton nombre ACTUEL de followers (ou d'abonnés)
  },

  // Alertes
  alertes: {
    duree: 6,                   // secondes d'affichage de chaque alerte
    son: true,
    volume: 0.5,                // de 0 à 1
    // Un son par alerte. Vide = le son de l'overlay (chaque alerte a le sien) · "aucun" = pas de son ·
    // sinon ton propre fichier, rangé dans le dossier sons/ : ex. "sons/follow.mp3" (mp3, wav ou ogg).
    // Le plus simple : reglages.html › Sons des alertes (avec un bouton ▶ pour écouter).
    sons: {
      follow: "", sub: "", resub: "", giftsub: "", giftbomb: "",
      bits: "", raid: "", don: "", objectif: "",
    },
    anonyme: "quelqu’un",   // nom affiché quand Twitch ne donne pas le destinataire d'un abonnement offert
    // {nom} {montant} {mois} {nombre} {destinataire} sont remplacés automatiquement
    textes: {
      follow:   { titre: "Nouveau follow",        message: "rejoint l'aventure" },
      sub:      { titre: "Nouvel abonné",         message: "s'abonne à la chaîne" },
      resub:    { titre: "Réabonnement",          message: "est abonné depuis {mois} mois" },
      giftsub:  { titre: "Abonnement offert",     message: "offre un abonnement à {destinataire}" },
      giftbomb: { titre: "Pluie d'abonnements !", message: "offre {nombre} abonnements" },
      bits:     { titre: "Bits !",                message: "envoie {montant} bits" },
      raid:     { titre: "Raid !",                message: "arrive avec {montant} viewers" },
      don:      { titre: "Merci pour le don !",   message: "offre {montant}" },
      objectif: { titre: "Objectif atteint !",    message: "merci à tous !" },
    },
  },

  // --- Kit de chaîne Twitch (chaine/kit.html) : textes des visuels de la chaîne ---
  chaine: {
    slogan: "Speedrun & jeux, en néon",
    horsLigne: "Hors ligne",
    planning: [                       // jours et heures de stream, ex. ["Mercredi", "20h30"]
    ],
    reseaux: [],                      // [nom, pseudo], ex. ["Discord", "discord.gg/…"]
    // Titres des panneaux de bio (320×160) : on n'exporte que ceux listés ici
    panneaux: ["À propos", "Planning", "Règles", "Matériel", "Soutenir"],
  },

  // Mode test (?test=1) : pseudos utilisés pour les fausses alertes
  test: {
    noms: ["Kaelis", "Pey_J", "Shauni", "Double_H", "Jade_BGE", "Secundo", "Zaltar", "Hillys"],
  },

  // --- Mises à jour : le serveur d'où l'overlay se met à jour (bouton « Mettre à jour l'overlay » du
  //     script OBS, ou mettre-a-jour.cmd). Tes réglages (mes-reglages.js) ne sont jamais remplacés.
  miseAJour: {
    adresse: "https://overlays.bastien-lambour.fr",
  },
};
