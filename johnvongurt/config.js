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
  // true = affiché · false = caché · cam (scène Jeu) : "bas-droite", "bas-gauche", "haut-droite", "haut-gauche", "aucune",
  // ou une position perso { x: 1200, y: 700, l: 420, h: 236 } (pixels 1920 × 1080). Les préréglages et leurs coordonnées : js/zones.js.
  // Une option écrite dans l'adresse d'une source passe avant. Le plus simple : reglages.html › Options des scènes.
  options: {
    jeu: { cam: "bas-droite", chat: false, bandeau: true, coins: true },
    contenu: { cam: true, chat: true, bandeau: false, cadre: true },
    "cam-seule": { chat: true, bandeau: false },
  },

  // --- Couleurs : pour changer d'ambiance sans toucher au thème (ex. Halloween) ---
  // Un code couleur (ex. "#FF7A1A") remplace la couleur du thème ; vide = la couleur d'origine.
  // Le plus simple : reglages.html › Couleurs (avec des ambiances en un clic).
  couleurs: {
    accent: "", // Accent (orange « attention »)
    flamme: "", // Flamme de la fusée
    fond: "", // Fond
    "fond-2": "", // Fond des cadres
    trait: "", // Traits et texte
    doux: "", // Texte secondaire
    coque: "", // Remplissage des décors (pas de tir, réservoirs…)
    ok: "", // Validé (vert)
    alerte: "", // Alerte (rouge : balises, REC)
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

  // Écran de démarrage (fusée en ravitaillement sur le pas de tir)
  demarrage: {
    titre: "Préparation au lancement",
    statut: "Ravitaillement en cours — lancement imminent",
    // Durée PAR DÉFAUT du compte à rebours, en minutes.
    // Pas besoin de rouvrir ce fichier pour la changer : dans OBS, clic droit sur la source
    // « démarrage » > Interagir, bouge la souris, clique sur le bouton « ⚙ DURÉE » en haut à gauche.
    // Priorité : adresse ?minutes=10  >  bouton ⚙ DURÉE  >  cette valeur.
    // Le ravitaillement se termine à T-30 s, puis décompte final de 10 s et décollage.
    minutes: 0.5,
    heure: "", // … ou heure fixe "20:30" : prioritaire sur les minutes (vide = compte à rebours en minutes)
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
    statut: "Partage du rapport de mission",
    message:
      "Merci d'avoir suivi la mission ! Rendez-vous au prochain lancement.",
  },

  // Scènes avec cam / contenu / jeu
  scenes: {
    statutEnDirect: "Transmission en direct",
    grade: "", // affiché sous la cam : « John Von Gurt — Commandant »
  },

  // Chat intégré
  chat: {
    titre: "Canal de communication",
    maxMessages: 12,
    ignorer: [
      "nightbot",
      "streamelements",
      "streamlabs",
      "moobot",
      "fossabot",
      "wizebot",
    ],
    masquerCommandes: true, // cache les messages qui commencent par « ! »
    memoireMinutes: 10, // en changeant de scène, le chat réaffiche les messages des 10 dernières minutes (0 = jamais)
  },

  // --- Objectif (bandeau et jauge Terre → Lune) ---
  // La barre affiche au choix les followers OU les abonnés : chacun son titre, sa cible et son compteur.
  // Avec StreamElements (tuto, section 6), les VRAIS nombres de la chaîne
  // arrivent tout seuls ; « depart » ne sert alors qu'au tout premier affichage (ou si automatique: false).
  // Le plus simple : reglages.html › Objectif.
  objectif: {
    affiche: "follow",   // ce que la barre affiche : "follow" (followers) ou "sub" (abonnés)
    automatique: true,   // les vrais nombres depuis StreamElements (false = compté à la main, depuis « depart »)
    follow: { titre: "Objectif ", cible: 50, depart: 5 },
    sub:    { titre: "Pilotes certifiés", cible: 10, depart: 0 },
  },

  // Bandeau d'infos (en bas des scènes) : ce qu'il affiche. Mets false pour cacher une case,
  // ex. soutien: false si tu ne reçois ni dons ni bits.
  bandeau: {
    follow: true, // « Dernière recrue » : dernier follow
    abonne: true, // « Dernier abonné » : dernier abonné (chaîne affiliée ou partenaire)
    soutien: true, // « Dernier soutien » : dernier don ou bits
    objectif: true, // l'objectif et sa mini-jauge
  },

  // Sons des scènes « démarrage » (pas de tir, compte à rebours, décollage) et « fin » (atterrissage, musique).
  // Fichiers : assets/audio/*.ogg (remplaçables, même nom). Dans OBS : coche « Contrôler l'audio via OBS » sur la source.
  audio: {
    actif: true,
    volume: 0.4, // volume général, de 0 à 1 (aussi : ?volume=0.4 dans l'adresse de la scène)
    // Ta voix du compte à rebours : tes propres fichiers assets/audio/voix/15.mp3 … 1.mp3 et 0.mp3 (décollage).
    // Un fichier absent = silence. Aucune voix synthétique n'est utilisée.
    voixVolume: 1, // volume de ta voix (de 0 à 1, multiplié par le volume général)
    // Sons personnalisés AVANT les 15 dernières secondes : une ligne = « secondes restantes | fichier ».
    // "60" joue assets/audio/voix/60.mp3 à T-60 s · "30 | sons/ouverture.mp3" joue ce fichier à T-30 s (le fichier est facultatif).
    reperes: [],
    // Volume de chaque son (1 = comme livré) : preparation, chauffe, decollage, propulseur, atterrissage, musique
    volumes: {
      preparation: 1,
      chauffe: 1,
      decollage: 1,
      propulseur: 1,
      atterrissage: 1,
      musique: 1,
    },
  },

  // Alertes
  alertes: {
    duree: 7, // secondes d'affichage de chaque alerte
    son: true,
    volume: 0.5, // de 0 à 1
    // Un son par alerte. Vide = le son de l'overlay (chaque alerte a le sien) · "aucun" = pas de son ·
    // sinon ton propre fichier, rangé dans le dossier sons/ : ex. "sons/follow.mp3" (mp3, wav ou ogg).
    // Le plus simple : reglages.html › Sons des alertes (avec un bouton ▶ pour écouter).
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
    anonyme: "Un pilote anonyme", // nom affiché quand Twitch ne donne pas le destinataire d'un abonnement offert
    // {nom} {montant} {mois} {nombre} {destinataire} sont remplacés automatiquement
    textes: {
      follow: { titre: "Nouvelle recrue", message: "rejoint l'équipage" },
      sub: { titre: "Pilote certifié", message: "signe pour la mission" },
      resub: {
        titre: "Pilote vétéran",
        message: "rempile pour {mois} mois de mission",
      },
      giftsub: {
        titre: "Billet offert",
        message: "offre un abonnement à {destinataire}",
      },
      giftbomb: {
        titre: "Pluie de billets !",
        message: "offre {nombre} abonnements à l'équipage",
      },
      bits: {
        titre: "Carburant reçu",
        message: "ajoute {montant} bits au réservoir",
      },
      raid: {
        titre: "Flotte en approche !",
        message: "arrive avec {montant} vaisseaux",
      },
      don: {
        titre: "Soutien de mission",
        message: "finance la mission : {montant}",
      },
      objectif: {
        titre: "Objectif atteint !",
        message: "cap sur la prochaine étape",
      },
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
    slogan: "Voyage en direct",
    horsLigne: "Transmission interrompue",
    // Page de dons StreamElements (bannière 640×200 et fond 1920×1080 du kit) : titre et petite phrase
    dons: { titre: "Soutien de mission", texte: "Chaque don remplit le réservoir" },
    planning: [
      // jours et heures de stream, ex. ["Mercredi", "20h30"]
    ],
    reseaux: [], // [nom, pseudo], ex. ["Discord", "discord.gg/…"]
    // Titres des panneaux de bio (320×160) : on n'exporte que ceux listés ici. Un nom de réseau (Discord, YouTube, TikTok,
    // Instagram, X, Twitch, Kick, Bluesky) prend son logo : retire ceux que tu n'utilises pas
    panneaux: ["À propos", "Planning", "Règles", "Matériel", "Commandes", "Soutenir",
      "Discord", "YouTube", "TikTok", "Instagram", "X (Twitter)"],
  },

  // Mode test (?test=1) : pseudos utilisés pour les fausses alertes
  test: {
    noms: [
      "Astro_Lou",
      "Capitaine_K",
      "StarPilot",
      "Nova_77",
      "Kepler",
      "Orbite",
      "Luna_B",
      "Cosmo",
    ],
  },
  // --- Mises à jour : le serveur d'où l'overlay se met à jour (bouton « Mettre à jour l'overlay » du
  //     script OBS, ou mettre-a-jour.cmd). Tes réglages (mes-reglages.js) ne sont jamais remplacés.
  miseAJour: {
    adresse: "https://overlays.bastien-lambour.fr",
  },
};
