/* =====================================================================
   JOHN VON GURT — Configuration de l'overlay : c'est ici qu'on modifie les textes.
   Le plus simple : ouvre reglages.html (un formulaire qui modifie ce fichier).
   Pas besoin de toucher au reste : enregistre, puis actualise la source
   dans OBS (clic droit > Actualiser).
   ===================================================================== */
window.CONFIG = {
  nomChaine: "John Von Gurt",

  // Identifiant technique de l'overlay (nom du dossier) : sépare les compteurs d'un overlay à l'autre.
  id: "johnvongurt",

  // Identifiant Twitch de la chaîne (celui de l'URL twitch.tv/xxxx), en minuscules.
  // Sert à lire le chat (aucun mot de passe nécessaire).
  chaineTwitch: "johnvongurt",

  // ---------------------------------------------------------------------
  // Streamer.bot (gratuit) : fait le lien entre Twitch et l'overlay pour
  // les follows, abonnements, bits, raids et dons. Voir le guide (index.html).
  // ---------------------------------------------------------------------
  streamerbot: {
    actif: true,
    hote: "127.0.0.1",
    port: 8080,
    motDePasse: "",      // seulement si tu as activé l'authentification dans Streamer.bot
  },

  // Écran de démarrage (fusée en ravitaillement sur le pas de tir)
  demarrage: {
    titre: "Préparation au lancement",
    statut: "Ravitaillement en cours — lancement imminent",
    // Durée du compte à rebours en minutes.
    // Peut aussi se régler dans l'URL de la source OBS : demarrage.html?minutes=10
    // Le ravitaillement se termine à T-30 s, puis décompte final de 10 s et décollage.
    minutes: 5,
    ravitaillementTermine: "Ravitaillement terminé",
    sequenceFinale: "Séquence finale engagée",
    statutSequenceFinale: "Ravitaillement terminé — séquence finale engagée",
    decompte: "Décollage dans",
    decollage: "Décollage !",
    lancementReussi: "Lancement réussi",
    statutDecollage: "Décollage confirmé — le stream commence !",
    verifications: [
      "Ergols cryogéniques",
      "Systèmes de navigation",
      "Liaison radio sol-bord",
      "Protocole de sécurité",
      "Équipage à bord",
    ],
  },

  // Écran d'attente / pause (fusée en vol dans l'anneau de chargement)
  pause: {
    titre: "Transmission en pause",
    statut: "Communication interrompue — retour imminent",
  },

  // Écran de fin (alunissage)
  fin: {
    titre: "Mission accomplie",
    statut: "Retour au centre de contrôle",
    message: "Merci d'avoir suivi la mission ! Rendez-vous au prochain lancement.",
  },

  // Scènes avec cam / contenu / jeu
  scenes: {
    statutEnDirect: "Transmission en direct",
    grade: "Commandant",            // affiché sous la cam : « John Von Gurt — Commandant »
  },

  // Chat intégré
  chat: {
    titre: "Canal de communication",
    maxMessages: 12,
    ignorer: ["nightbot", "streamelements", "streamlabs", "moobot", "fossabot", "wizebot"],
    masquerCommandes: true,         // cache les messages qui commencent par « ! »
    memoireMinutes: 10,      // en changeant de scène, le chat réaffiche les messages des 10 dernières minutes (0 = jamais)
  },

  // Objectif affiché dans le bandeau et la jauge Terre → Lune
  objectif: {
    type: "follow",                 // "follow" ou "sub"
    titre: "Objectif : 50 recrues",
    cible: 50,
    depart: 0,                      // valeur de départ : mets ici ton nombre actuel de followers/abonnés
  },

  // Bandeau d'infos (en bas des scènes) : ce qu'il affiche. Mets false pour cacher une case,
  // ex. soutien: false si tu ne reçois ni dons ni bits.
  bandeau: {
    follow: true,        // « Dernière recrue » : dernier follow
    abonne: true,        // « Dernier abonné » : dernier abonné (chaîne affiliée ou partenaire)
    soutien: true,       // « Dernier soutien » : dernier don ou bits
    objectif: true,      // l'objectif et sa mini-jauge
  },

  // Alertes
  alertes: {
    duree: 7,                       // secondes d'affichage de chaque alerte
    son: true,
    volume: 0.5,                    // de 0 à 1
    anonyme: "un membre de l’équipage",   // nom affiché quand Twitch ne donne pas le destinataire d'un abonnement offert
    // {nom} {montant} {mois} {nombre} {destinataire} sont remplacés automatiquement
    textes: {
      follow:   { titre: "Nouvelle recrue",      message: "rejoint l'équipage" },
      sub:      { titre: "Astronaute certifié",  message: "signe pour la mission" },
      resub:    { titre: "Astronaute vétéran",   message: "rempile pour {mois} mois de mission" },
      giftsub:  { titre: "Billet offert",        message: "offre un abonnement à {destinataire}" },
      giftbomb: { titre: "Pluie de billets !",   message: "offre {nombre} abonnements à l'équipage" },
      bits:     { titre: "Carburant reçu",       message: "ajoute {montant} bits au réservoir" },
      raid:     { titre: "Flotte en approche !", message: "arrive avec {montant} vaisseaux" },
      don:      { titre: "Soutien de mission",   message: "finance la mission : {montant}" },
      objectif: { titre: "Objectif atteint !",   message: "cap sur la prochaine étape" },
    },
  },

  // Petits textes de décor en bas d'écran
  decor: {
    protocole: "Protocole v1.2",
    capteurs: "Capteurs externes",
    exploration: "Exploration spatiale profonde",
  },

  // --- Kit de chaîne Twitch (chaine/kit.html) : textes des visuels de la chaîne ---
  chaine: {
    slogan: "Exploration spatiale en direct",
    horsLigne: "Transmission interrompue",
    planning: [                       // jours et heures de stream, ex. ["Mercredi", "20h30"]
    ],
    reseaux: [],                      // [nom, pseudo], ex. ["Discord", "discord.gg/…"]
    // Titres des panneaux de bio (320×160) : on n'exporte que ceux listés ici
    panneaux: ["À propos", "Planning", "Règles", "Matériel", "Soutenir"],
  },

  // Mode test (?test=1) : pseudos utilisés pour les fausses alertes
  test: {
    noms: ["Astro_Lou", "Capitaine_K", "StarPilot", "Nova_77", "Kepler", "Orbite", "Luna_B", "Cosmo"],
  },
};
