/* =====================================================================
   AMBRIES_ — Configuration de l'overlay : c'est ici qu'on modifie les textes.
   Le plus simple : ouvre reglages.html (un formulaire qui modifie ce fichier).
   Pas besoin de toucher au reste : enregistre, puis actualise la source
   dans OBS (clic droit > Actualiser).
   Règles : garde les guillemets "…" autour des textes et la virgule en fin de ligne.
   ===================================================================== */
window.CONFIG = {
  nomChaine: "Ambries_",

  // Identifiant technique de l'overlay (nom du dossier) : sépare les compteurs d'un overlay à l'autre.
  id: "ambries",

  // Identifiant Twitch de la chaîne (celui de l'adresse twitch.tv/xxxx), en minuscules.
  // Sert à lire le chat (aucun mot de passe nécessaire). ⚠ À CONFIRMER.
  chaineTwitch: "ambries_",

  // Petite phrase fétiche, reprise sur les écrans et la bannière
  devise: "10 % skill · 90 % d'excuses",

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

  // --- Écran de démarrage ---
  demarrage: {
    titre: "Ça commence bientôt !",
    // Durée du compte à rebours en minutes (ou dans l'URL : demarrage.html?minutes=10)
    minutes: 5,
    chargement: "Chargement des excuses…",   // la jauge qui plafonne à 90 %
    texteFin: "C'est parti… (courage)",
    // Petites phrases qui défilent pendant l'attente
    phrases: [
      "Recherche d'une excuse crédible…",
      "Calibrage du lag…",
      "Échauffement des doigts (ça ne servira à rien)",
      "Installation de la mauvaise foi…",
      "Vérification : skill toujours à 10 %",
    ],
  },

  // --- Écran de pause ---
  pause: {
    titre: "Pause",
    message: "Je reviens… avec une excuse.",
  },

  // --- Écran de fin ---
  fin: {
    titre: "GG !",
    sousTitre: "(enfin… presque)",
    message: "Merci d'avoir assisté au carnage 💜",
  },

  // --- Chat intégré ---
  chat: {
    titre: "Le chat",
    maxMessages: 12,
    ignorer: ["nightbot", "streamelements", "streamlabs", "moobot", "fossabot", "wizebot"],
    masquerCommandes: true,  // cache les messages qui commencent par « ! »
    memoireMinutes: 10,      // en changeant de scène, le chat réaffiche les messages des 10 dernières minutes (0 = jamais)
  },

  // --- Objectif (bandeau et jauge où ta tête avance) ---
  objectif: {
    type: "follow",      // "follow" ou "sub"
    titre: "Objectif : 50 témoins",
    cible: 50,
    depart: 0,           // mets ici ton nombre ACTUEL de followers (ou d'abonnés)
  },

  // --- Alertes ---
  alertes: {
    duree: 7,            // secondes d'affichage de chaque alerte
    son: true,
    volume: 0.5,         // de 0 à 1
    anonyme: "quelqu’un de chanceux",   // nom affiché quand Twitch ne donne pas le destinataire d'un abonnement offert
    // {nom} {montant} {mois} {nombre} {destinataire} sont remplacés automatiquement
    textes: {
      follow:   { titre: "Nouveau témoin !",        message: "va assister au carnage" },
      sub:      { titre: "Soutien moral officiel",  message: "croit encore en moi (courageux)" },
      resub:    { titre: "Toujours là ?!",          message: "supporte ça depuis {mois} mois" },
      giftsub:  { titre: "Cadeau empoisonné",       message: "offre un abonnement à {destinataire}" },
      giftbomb: { titre: "Pluie de cadeaux !",      message: "offre {nombre} abonnements (qui a dit « pitié » ?)" },
      bits:     { titre: "Pièces de consolation",   message: "envoie {montant} bits pour me remonter le moral" },
      raid:     { titre: "Invasion !!",             message: "débarque avec {montant} personnes" },
      don:      { titre: "Fonds pour excuses",      message: "finance ma prochaine excuse : {montant}" },
      objectif: { titre: "Objectif atteint !",      message: "même moi je n'y croyais pas" },
    },
  },

  // --- Kit de chaîne Twitch (chaine/kit.html) : textes des visuels de la chaîne ---
  chaine: {
    slogan: "10 % skill · 90 % d'excuses",   // phrase sous le nom sur la bannière
    horsLigne: "Hors ligne… sûrement en train de rater un truc facile",
    planning: [                       // jours et heures de stream (panneau Planning)
      // ["Mercredi", "20h30"],
    ],
    reseaux: [                        // [nom, pseudo] (panneau Réseaux) — vide = panneau masqué
      // ["Discord", "discord.gg/…"],
    ],
    // Titres des panneaux de bio (320×160) : on n'exporte que ceux listés ici
    panneaux: ["À propos", "Planning", "Règles", "Soutenir"],
  },

  // Mode test (?test=1) : pseudos utilisés pour les fausses alertes
  test: {
    noms: ["Pixel_Lou", "Choco_Chat", "Mr_Patate", "Kiwi", "Luna", "Toto_42"],
  },
};
