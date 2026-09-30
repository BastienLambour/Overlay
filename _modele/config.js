/* =====================================================================
   <NOM> — Configuration de l'overlay : c'est ici qu'on modifie les textes.
   Le plus simple : ouvre reglages.html (un formulaire qui modifie ce fichier).
   Pas besoin de toucher au reste : enregistre, puis actualise la source
   dans OBS (clic droit > Actualiser).
   Règles : garde les guillemets "…" autour des textes et la virgule en fin de ligne.
   ===================================================================== */
window.CONFIG = {
  nomChaine: "<Nom affiché>",

  // Identifiant technique de l'overlay (nom du dossier) : sépare les compteurs d'un overlay à l'autre.
  id: "<pseudo>",

  // Identifiant Twitch de la chaîne (celui de l'adresse twitch.tv/xxxx), en minuscules.
  // Sert à lire le chat (aucun mot de passe nécessaire).
  chaineTwitch: "<pseudo>",

  // --- Options des scènes : comme les options d'adresse (?cam=…, ?chat=0…), mais pour de bon ---
  // true = affiché · false = caché · cam (scène Jeu) : "bas-droite", "bas-gauche", "haut-droite", "haut-gauche" ou "aucune".
  options: {
    jeu: { cam: "bas-droite", chat: true, bandeau: true },
    contenu: { cam: true, chat: true, bandeau: true },
    "cam-seule": { chat: true, bandeau: true },
  },

  // --- Couleurs : pour changer d'ambiance sans toucher au thème (ex. Halloween) ---
  // Un code couleur (ex. "#FF7A1A") remplace la variable du même nom de css/theme.css ; vide = la couleur d'origine.
  // Mettre ici les couleurs principales du thème (leurs noms dans theme.css, sans les « -- »).
  couleurs: {
    accent: "",          // <couleur principale du thème>
    fond: "",            // fond
  },

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
    titre: "Ça commence bientôt",
    // Durée du compte à rebours en minutes (ou dans l'URL : demarrage.html?minutes=10)
    minutes: 5,
    texteFin: "C'est parti !",
  },

  // --- Écran de pause ---
  pause: {
    titre: "Petite pause",
  },

  // --- Écran de fin ---
  fin: {
    titre: "Merci d'être passés !",
  },

  // --- Chat intégré ---
  chat: {
    titre: "Le chat",
    maxMessages: 12,
    ignorer: ["nightbot", "streamelements", "streamlabs", "moobot", "fossabot", "wizebot"],
    masquerCommandes: true,  // cache les messages qui commencent par « ! »
  },

  // --- Objectif (bandeau et jauge) ---
  objectif: {
    type: "follow",      // "follow" ou "sub"
    titre: "Objectif followers",
    cible: 50,
    depart: 0,           // mets ici ton nombre ACTUEL de followers (ou d'abonnés)
  },

  // --- Bandeau d'infos (en bas des scènes) : ce qu'il affiche (false = case cachée) ---
  // ex. soutien: false si la chaîne ne reçoit ni dons ni bits. (ceSoir : seulement si le bandeau a cette case)
  bandeau: {
    follow: true,        // dernier follow
    abonne: true,        // dernier abonné (chaîne affiliée ou partenaire)
    soutien: true,       // dernier don ou bits
    objectif: true,      // l'objectif et sa mini-jauge
  },

  // --- Alertes ---
  alertes: {
    duree: 7,            // secondes d'affichage de chaque alerte
    son: true,
    volume: 0.5,         // de 0 à 1
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
    slogan: "",                       // phrase sous le nom sur la bannière
    horsLigne: "Pas de live pour le moment",
    planning: [                       // jours et heures de stream (panneau Planning)
      // ["Mercredi", "20h30"],
    ],
    reseaux: [                        // [nom, pseudo] (panneau Réseaux) — vide = panneau masqué
      // ["Discord", "discord.gg/…"],
    ],
    // Titres des panneaux de bio (320×160) : on n'exporte que ceux listés ici
    panneaux: ["À propos", "Planning", "Règles", "Matériel", "Soutenir"],
  },

  // Mode test (?test=1) : pseudos utilisés pour les fausses alertes
  test: {
    noms: ["Pseudo_1", "Pseudo_2", "Pseudo_3", "Pseudo_4", "Pseudo_5", "Pseudo_6"],
  },
};
