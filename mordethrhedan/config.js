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

  // Scène speedrun : dessiner un cadre autour de la zone manette et de la zone splits
  speedrun: {
    cadreManette: true,
    cadreSplits: true,
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
    panneaux: ["À propos", "Planning", "Règles", "Soutenir"],
  },

  // Mode test (?test=1) : pseudos utilisés pour les fausses alertes
  test: {
    noms: ["Kaelis", "Pey_J", "Shauni", "Double_H", "Jade_BGE", "Secundo", "Zaltar", "Hillys"],
  },
};
