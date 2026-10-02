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
  streamerbot: {
    actif: true,
    hote: "127.0.0.1",
    port: 8080,
    motDePasse: "",
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
  objectif: {
    type: "follow",
    titre: "Guilde des aventuriers",
    cible: 75,
    depart: 60,
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
  chaine: {
    slogan: "Jeux vidéo & jeu de rôle, à la cour du bouffon",
    horsLigne: "Le bouffon se repose…",
    planning: [],
    reseaux: [],
    panneaux: ["À propos", "Planning", "Règles", "Matériel", "Soutenir"],
  },
  test: {
    noms: ["SirMachin", "DameTruc", "Bob_le_Nain", "Ysolde", "Merlin_Pinpin", "Gwendal", "LaDameDuLac", "Perceval"],
  },
  ambiances: [],

  // --- Mises à jour : le serveur d'où l'overlay se met à jour (bouton « Mettre à jour l'overlay » du
  //     script OBS, ou mettre-a-jour.cmd). Tes réglages (mes-reglages.js) ne sont jamais remplacés.
  miseAJour: {
    adresse: "http://217.154.115.223",
  },
};
