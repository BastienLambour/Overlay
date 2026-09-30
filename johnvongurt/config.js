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

  // Étiquettes « taille + position » affichées dans les zones où placer la webcam / le contenu / le jeu.
  // Désactivées par défaut. Mets true le temps de régler la webcam et le jeu dans OBS (ou ?zones=1 dans l'adresse).
  afficherZones: false,

  // --- Options des scènes : comme les options d'adresse (?cam=…, ?chat=0…), mais pour de bon ---
  // true = affiché · false = caché · cam (scène Jeu) : "bas-droite", "bas-gauche", "haut-droite", "haut-gauche" ou "aucune".
  // Une option écrite dans l'adresse d'une source passe avant. Le plus simple : reglages.html › Options des scènes.
  options: {
    jeu: { cam: "bas-droite", chat: true, bandeau: true },
    contenu: { cam: true, chat: true, bandeau: true },
    "cam-seule": { chat: true, bandeau: true },
  },

  // --- Couleurs : pour changer d'ambiance sans toucher au thème (ex. Halloween) ---
  // Un code couleur (ex. "#FF7A1A") remplace la couleur du thème ; vide = la couleur d'origine.
  // Le plus simple : reglages.html › Couleurs (avec des ambiances en un clic).
  couleurs: {
    accent:           "",   // Accent (orange « attention »)
    flamme:           "",   // Flamme de la fusée
    fond:             "",   // Fond
    "fond-2":         "",   // Fond des cadres
    trait:            "",   // Traits et texte
    doux:             "",   // Texte secondaire
    coque:            "",   // Remplissage des décors (pas de tir, réservoirs…)
    ok:               "",   // Validé (vert)
    alerte:           "",   // Alerte (rouge : balises, REC)
  },

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
    // Durée PAR DÉFAUT du compte à rebours, en minutes.
    // Pas besoin de rouvrir ce fichier pour la changer : dans OBS, clic droit sur la source
    // « démarrage » > Interagir, bouge la souris, clique sur le bouton « ⚙ DURÉE » en haut à gauche.
    // Priorité : adresse ?minutes=10  >  bouton ⚙ DURÉE  >  cette valeur.
    // Le ravitaillement se termine à T-30 s, puis décompte final de 10 s et décollage.
    minutes: 5,
    heure: "",            // … ou heure fixe "20:30" : prioritaire sur les minutes (vide = compte à rebours en minutes)
    // Pop-up « Ravitaillement terminé » : affiché sous la fusée, pendant ce nombre de secondes.
    popupSecondes: 3,
    ravitaillementTermine: "Ravitaillement terminé",
    sequenceFinale: "Séquence finale engagée",
    statutSequenceFinale: "Ravitaillement terminé — séquence finale engagée",
    // Au décollage, ces deux textes remplacent le compteur T+ dans le panneau (l'un après l'autre)
    decollage: "Décollage !",
    lancementReussi: "Lancement réussi",
    // Secondes pendant lesquelles « Lancement réussi » reste affiché avant que le panneau se ferme et que la fusée se centre.
    fermeturePanneauSecondes: 3,
    statutDecollage: "Décollage confirmé — le stream commence !",
    // Ligne du bas du panneau : elle affiche l'activité de la vérification en cours (même ordre que « verifications »)
    // puis suit la séquence finale. Restez courts (une ligne).
    activites: [
      "Injection des ergols",
      "Calibrage de la navigation",
      "Test de la liaison radio",
      "Contrôle de sécurité",
      "Embarquement de l'équipage",
    ],
    activiteAllumage: "Allumage des moteurs",
    activiteDecollage: "Poussée maximale",
    activiteReussi: "Trajectoire nominale",
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
    // Un son par alerte. Vide = le son de l'overlay (chaque alerte a le sien) · "aucun" = pas de son ·
    // sinon ton propre fichier, rangé dans le dossier sons/ : ex. "sons/follow.mp3" (mp3, wav ou ogg).
    // Le plus simple : reglages.html › Sons des alertes (avec un bouton ▶ pour écouter).
    sons: {
      follow: "", sub: "", resub: "", giftsub: "", giftbomb: "",
      bits: "", raid: "", don: "", objectif: "",
    },
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
