/* =====================================================================
   PATAGRAIN — Configuration de l'overlay : c'est ici qu'on modifie les textes.
   Le plus simple : ouvre reglages.html (un formulaire qui modifie ce fichier).
   Ou modifie-le à la main : enregistre, puis actualise la source dans OBS
   (clic droit > Actualiser).
   ===================================================================== */
window.CONFIG = {
  nomChaine: "Patagrain",

  // Identifiant technique de l'overlay (nom du dossier) : sépare les compteurs d'un overlay à l'autre.
  id: "patagrain",

  // Identifiant Twitch de la chaîne (celui de l'adresse twitch.tv/xxxx), en minuscules.
  // Sert à lire le chat (aucun mot de passe nécessaire).
  chaineTwitch: "patagrain",

  // Ce que tu fais aujourd'hui (écrans d'attente et bandeau)
  titreDuJour: "Donjons & Dragons — La quête du grelot perdu",

  // ---------------------------------------------------------------------
  // Streamer.bot (gratuit) : fait le lien entre Twitch et l'overlay pour
  // les follows, abonnements, bits, raids et dons. Voir TUTO.md.
  // ---------------------------------------------------------------------
  streamerbot: {
    actif: true,
    hote: "127.0.0.1",
    port: 8080,
    motDePasse: "",      // seulement si tu as activé l'authentification dans Streamer.bot
  },

  // --- Écran « Starting soon » ---
  demarrage: {
    titre: "Le spectacle va commencer…",
    // Compte à rebours : durée en minutes, ou heure fixe "20:30" (prioritaire si remplie).
    // Se règle aussi dans l'adresse de la source : demarrage.html?minutes=10
    minutes: 5,
    heure: "",
    etiquette: "Jet d'initiative",
    texteFin: "Les dés sont jetés !",
  },

  // --- Écran « Pause » ---
  pause: {
    titre: "Repos court…",
    sousTitre: "le bouffon revient vite",
    minutes: 0,          // durée affichée en compte à rebours (0 = pas de compte à rebours)
    texteFin: "J'arrive !",
  },

  // --- Écran « Fin » ---
  fin: {
    titre: "Fin de la session",
    sousTitre: "Merci d'être venus, aventuriers !",
    prochainStream: "",  // ex. "Jeudi 20h30 · Session 4" (vide = carte masquée)
    messages: [
      "Merci pour votre présence, c'était une belle aventure",
      "Suis la chaîne pour être prévenu de la prochaine quête",
      "Pense à faire un raid chez un autre aventurier !",
    ],
  },

  // Messages qui défilent en bas des écrans Starting soon et Pause ({titreDuJour} est remplacé)
  messages: [
    "Installe-toi, prends à boire, l'aventure arrive",
    "Suis la chaîne pour rejoindre la guilde des aventuriers",
    "Dis bonjour dans le chat, le bouffon lit tout",
    "Ce soir : {titreDuJour}",
  ],
  dureeMessage: 7,       // secondes par message

  // --- Chat intégré ---
  chat: {
    titre: "La taverne",
    maxMessages: 14,
    ignorer: ["nightbot", "streamelements", "streamlabs", "moobot", "fossabot", "wizebot", "sery_bot"],
    masquerCommandes: true,  // cache les messages qui commencent par « ! »
    memoireMinutes: 10,      // en changeant de scène, le chat réaffiche les messages des N dernières minutes (0 = jamais)
  },

  // --- Objectif (bandeau et jauge) ---
  objectif: {
    type: "follow",      // "follow" ou "sub"
    titre: "Guilde des aventuriers",
    cible: 50,
    depart: 0,           // mets ici ton nombre ACTUEL de followers (ou d'abonnés)
  },

  // --- Alertes ---
  alertes: {
    duree: 7,            // secondes d'affichage de chaque alerte
    son: true,
    volume: 0.5,         // de 0 à 1
    anonyme: "un aventurier",   // nom affiché quand Twitch ne donne pas le destinataire d'un abonnement offert
    // {nom} {montant} {mois} {nombre} {destinataire} sont remplacés automatiquement
    textes: {
      follow:   { titre: "Nouvel aventurier",    message: "rejoint la cour du roi !" },
      sub:      { titre: "Adoubement !",         message: "devient chevalier de la cour" },
      resub:    { titre: "Chevalier fidèle",     message: "sert la cour depuis {mois} mois" },
      giftsub:  { titre: "Présent royal",        message: "adoube {destinataire}" },
      giftbomb: { titre: "Largesse royale !",    message: "offre {nombre} adoubements à la cour" },
      bits:     { titre: "Tribut au bouffon",    message: "lance {montant} pièces d'or" },
      raid:     { titre: "Une horde débarque !", message: "arrive avec {montant} compagnons" },
      don:      { titre: "Offrande royale",      message: "offre {montant} au royaume" },
      objectif: { titre: "Objectif atteint !",   message: "la guilde passe au niveau supérieur" },
    },
  },

  // --- Le bouffon (la mascotte) sur les écrans ---
  // Pour le cacher sur une seule page : ajoute ?bouffon=0 à son adresse.
  bouffon: {
    actif: true,         // false = plus de bouffon nulle part
    alertes: true,       // il descend avec chaque alerte, accroché à sa corde
    jeuToutesLes: 60,    // scène Jeu : il passe la tête sous son chapeau toutes les N secondes (0 = jamais tout seul)
    jeuAuFollow: true,   // scène Jeu : … et à chaque nouveau follow
    // Écran Fin : ce que dit sa bulle (les phrases s'alternent)
    bulles: ["Merci d'être venus !", "À bientôt, aventuriers !"],
  },

  // --- Kit de chaîne Twitch (chaine/kit.html) : textes des visuels de la chaîne ---
  chaine: {
    slogan: "Jeux vidéo & jeu de rôle, à la cour du bouffon",
    horsLigne: "Le bouffon se repose…",
    planning: [],   // jours et heures de stream, ex. ["Mercredi", "20h30"]
    reseaux: [],    // [nom, pseudo], ex. ["Discord", "discord.gg/…"]
    // Titres des panneaux de bio (320×160) : on n'exporte que ceux listés ici
    panneaux: ["À propos", "Planning", "Règles", "Soutenir"],
  },

  // Mode test (?test=1) : pseudos utilisés pour les fausses alertes
  test: {
    noms: ["SirMachin", "DameTruc", "Bob_le_Nain", "Ysolde", "Merlin_Pinpin", "Gwendal", "LaDameDuLac", "Perceval"],
  },
};
