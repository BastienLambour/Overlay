/* =====================================================================
   PATAGRAIN — Configuration de l'overlay (écrite par reglages.html).
   Le plus simple pour la modifier : ouvre reglages.html.
   ===================================================================== */
window.CONFIG = {
  nomChaine: "Patagrain",
  id: "patagrain",
  chaineTwitch: "patagrain",
  titreDuJour: "Heave Ho 2 !",
  afficherZones: false,
  options: {
    jeu: {
      cam: "bas-droite",
      chat: true,
      bandeau: true,
      bouffon: true,
    },
    contenu: {
      cam: true,
      chat: true,
      bandeau: true,
      bouffon: true,
    },
    "cam-seule": {
      chat: true,
      bandeau: true,
      bouffon: true,
    },
    pause: {
      chat: true,
      bouffon: true,
    },
    demarrage: {
      bouffon: true,
    },
    fin: {
      bouffon: true,
    },
  },
  couleurs: {
    primaire: "",
    "primaire-fonce": "",
    accent: "",
    "accent-2": "",
    fond: "",
    surface: "",
    texte: "",
  },
  // ---------------------------------------------------------------------
  // StreamElements (gratuit, par internet) : fait le lien entre Twitch et l'overlay pour les follows,
  // abonnements, bits, raids, dons, et les vrais nombres de followers / abonnés de l'objectif. TUTO, section 6.
  // Le jeton se colle dans reglages.html › StreamElements : il reste dans mes-reglages.js (jamais livré ni partagé).
  // ---------------------------------------------------------------------
  streamelements: {
    actif: true,
    jeton: "",           // le « JWT Token » du compte StreamElements (secret !) — ne l'écris pas ici, mais dans reglages.html
  },
  demarrage: {
    titre: "Le spectacle va commencer…",
    minutes: 5,
    heure: "21:30",
    etiquette: "Jet d'initiative",
    texteFin: "Les dés sont jetés !",
  },
  pause: {
    titre: "Repos court…",
    sousTitre: "le bouffon revient vite",
    minutes: 0,
    texteFin: "J'arrive !",
  },
  fin: {
    titre: "Fin de la session",
    sousTitre: "Merci d'être venus, aventuriers !",
    prochainStream: "",
    messages: [
      "Merci pour votre présence, c'était une belle aventure",
      "Suis la chaîne pour être prévenu de la prochaine quête",
      "Pense à faire un raid chez un autre aventurier !",
    ],
  },
  messages: [
    "Installe-toi, prends à boire, l'aventure arrive",
    "Suis la chaîne pour rejoindre la guilde des aventuriers",
    "Dis bonjour dans le chat, le bouffon lit tout",
    "Ce soir : {titreDuJour}",
  ],
  dureeMessage: 7,
  chat: {
    titre: "La taverne",
    maxMessages: 14,
    ignorer: ["nightbot", "streamelements", "streamlabs", "moobot", "fossabot", "wizebot", "sery_bot"],
    masquerCommandes: true,
    memoireMinutes: 10,
  },
  // --- Objectif (bandeau et jauge, l'épée avance) ---
  // La barre affiche au choix les followers OU les abonnés : chacun son titre, sa cible et son compteur.
  // Avec StreamElements (tuto, section 6), les VRAIS nombres de la chaîne
  // arrivent tout seuls ; « depart » ne sert alors qu'au tout premier affichage (ou si automatique: false).
  // Le plus simple : reglages.html › Objectif.
  objectif: {
    affiche: "follow",   // ce que la barre affiche : "follow" (followers) ou "sub" (abonnés)
    automatique: true,   // les vrais nombres depuis StreamElements (false = compté à la main, depuis « depart »)
    follow: { titre: "Guilde des aventuriers", cible: 75, depart: 60 },
    sub:    { titre: "La Table ronde", cible: 10, depart: 0 },
  },
  bandeau: {
    ceSoir: true,
    follow: true,
    abonne: false,
    soutien: false,
    objectif: true,
  },
  alertes: {
    duree: 7,
    son: true,
    volume: 0.5,
    sons: {
      follow: "",
      sub: "",
      resub: "",
      giftsub: "",
      giftbomb: "",
      bits: "",
      raid: "",
      don: "",
      objectif: "",
    },
    anonyme: "un aventurier",
    textes: {
      follow: {
        titre: "Nouvel aventurier",
        message: "rejoint la cour du roi !",
      },
      sub: {
        titre: "Adoubement !",
        message: "devient chevalier de la cour",
      },
      resub: {
        titre: "Chevalier fidèle",
        message: "sert la cour depuis {mois} mois",
      },
      giftsub: {
        titre: "Présent royal",
        message: "adoube {destinataire}",
      },
      giftbomb: {
        titre: "Largesse royale !",
        message: "offre {nombre} adoubements à la cour",
      },
      bits: {
        titre: "Tribut au bouffon",
        message: "lance {montant} pièces d'or",
      },
      raid: {
        titre: "Une horde débarque !",
        message: "arrive avec {montant} compagnons",
      },
      don: {
        titre: "Offrande royale",
        message: "offre {montant} au royaume",
      },
      objectif: {
        titre: "Objectif atteint !",
        message: "la guilde passe au niveau supérieur",
      },
    },
  },
  bouffon: {
    actif: true,
    alertes: true,
    jeuToutesLes: 180,
    jeuAuFollow: true,
    bulles: ["Merci d'être venus !", "À bientôt, aventuriers !"],
  },
  // --- Les Grelots : spectacles du bouffon payés avec les points StreamElements de la chaîne.
  //     Le mystère : les spectateurs ne connaissent que le prix (!spectacle10, !spectacle25…), pas le spectacle.
  //     Dans StreamElements, chaque commande a un coût fixe (« -cost ») ; sa réponse doit être EXACTEMENT
  //     la phrase « reponse » ci-dessous (${user} = le pseudo du spectateur). L'overlay repère cette phrase
  //     dans le chat et joue le spectacle (source Alertes). Pas de !duel : il existe déjà (duel de points).
  grelots: {
    actif: true,
    bot: "streamelements",      // le compte du bot qui répond dans le chat
    rival: "Darktagrain",       // le nom du bouffon maléfique
    essaiModos: false,          // true = les modos peuvent aussi lancer « !essai catapulte » (etc.) gratis (le streamer peut toujours)
    spectacles: {
      chute:     { actif: true, commande: "!spectacle10",  prix: 10,  reponse: "🔔 ${user} jette 10 grelots dans le chapeau du bouffon… 🎭" },
      tarte:     { actif: true, commande: "!spectacle25",  prix: 25,  reponse: "🔔 ${user} jette 25 grelots dans le chapeau du bouffon… 🎭" },
      serenade:  { actif: true, commande: "!spectacle50",  prix: 50,  reponse: "🔔 ${user} jette 50 grelots dans le chapeau du bouffon… 🎭" },
      destin:    { actif: true, commande: "!spectacle75",  prix: 75,  reponse: "🔔 ${user} jette 75 grelots dans le chapeau du bouffon… 🎭" },
      potion:    { actif: true, commande: "!spectacle100", prix: 100, reponse: "🔔 ${user} jette 100 grelots dans le chapeau du bouffon… 🎭" },
      chifoumi:  { actif: true, commande: "!spectacle125", prix: 125, reponse: "🔔 ${user} jette 125 grelots dans le chapeau du bouffon… 🎭" },
      coffre:    { actif: true, commande: "!spectacle150", prix: 150, reponse: "🔔 ${user} jette 150 grelots dans le chapeau du bouffon… 🎭" },
      catapulte: { actif: true, commande: "!spectacle175", prix: 175, reponse: "🔔 ${user} jette 175 grelots dans le chapeau du bouffon… 🎭" },
      duel:      { actif: true, commande: "!spectacle200", prix: 200, reponse: "🔔 ${user} jette 200 grelots dans le chapeau du bouffon… 🎭" },
      dragon:    { actif: true, commande: "!spectacle300", prix: 300, reponse: "🔔 ${user} jette 300 grelots dans le chapeau du bouffon… 🎭" },
    },
  },
  chaine: {
    slogan: "Jeux vidéo & jeu de rôle, à la cour du bouffon",
    horsLigne: "Le bouffon se repose…",
    // Page de dons StreamElements (bannière 640×200 et fond 1920×1080 du kit) : titre et petite phrase
    dons: { titre: "Offrande au royaume", texte: "Chaque pièce fait tinter le grelot du bouffon" },
    planning: [],
    reseaux: [],
    panneaux: ["À propos", "Planning", "Règles", "Matériel", "Commandes", "Soutenir",
      "Discord", "YouTube", "TikTok", "Instagram", "X (Twitter)"],
  },
  test: {
    noms: ["SirMachin", "DameTruc", "Bob_le_Nain", "Ysolde", "Merlin_Pinpin", "Gwendal", "LaDameDuLac", "Perceval"],
  },
  ambiances: [],

  // --- Mises à jour : le serveur d'où l'overlay se met à jour (bouton « Mettre à jour l'overlay » du
  //     script OBS, ou mettre-a-jour.cmd). Tes réglages (mes-reglages.js) ne sont jamais remplacés.
  miseAJour: {
    adresse: "https://overlays.bastien-lambour.fr",
  },
};
