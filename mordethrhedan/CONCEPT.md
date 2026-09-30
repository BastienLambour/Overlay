# Mordethrhedan — Concept

> Résumé vivant de la demande. **Mis à jour à chaque échange** : nouvelle demande, choix validé,
> changement d'avis. Le haut du fichier décrit l'état actuel ; le journal en bas garde l'historique.

## La chaîne

| | |
|---|---|
| Streamer | Mordethrhedan |
| Identifiant Twitch | `mordethrhedan` — **à confirmer** |
| Ce qui est streamé | Jeux, dont du **speedrun** (ex. Beyond Good & Evil, Moonlighter 2) |
| Écran / canevas OBS | 1920×1080 (supposé) |
| Alertes | **Streamlabs** (ses propres alertes : pas de bot). Clé Streamlabs seulement pour le « dernier follow » |

## Direction artistique

- **Univers** : **néon sobre**. Refaire proprement son overlay existant (cadres verts « faits sous Paint »), **sans grosses animations**.
- **Fond** : facettes sombres façon cristal avec des éclats lumineux, **recréé et généré** (à partir d'un thème Chrome trouvé en ligne), qui respirent très doucement (désactivable).
- **Couleur** : **une seule couleur d'accent, qui pilote tout** (cadres + éclats du fond). Vert par défaut, changeable selon le jeu (`couleur` dans `config.js` ou `?couleur=rouge`).
- **Cadres** : trait régulier, coins arrondis, liseré sombre, **halo discret** (léger / moyen / fort), version transparente et version « verre » fumée.
- **Police** : **Dyer** (celle de Beyond Good & Evil) pour les titres — fichier à déposer dans `assets/polices/` ; Righteous en attendant. Texte en Nunito.
- **Vocabulaire des alertes** : sobre et direct (« Nouveau follow », « Nouvel abonné », « Raid ! »…). Carillon doux ; les gros événements font pulser le halo.
- **Chat** : en cartes, comme son ancien chat, avec pastilles de badges (streamer, modo, VIP, abonné).

## Ce qui est demandé

- **Trois dispositions** (refonte d'après ses 3 croquis) :
  - **Grande** — Démarrage (compte à rebours), Pause, Fin, Cam seule : pseudo en haut, grand cadre troué (cam, image, contenu), message au centre facile à changer, **ligne des derniers événements** en bas (follow · sub · raid · série de visionnage), chat à droite.
  - **Petite** — Contenu, Speedrun : manette ou cam en haut à gauche, LiveSplit en bas à gauche (ou le chat, désactivable d'un clic), pseudo + grand cadre + derniers à droite.
  - **Jeu** — cadre au ras des bords, coins bouchés par le fond, pseudo dans un encadré posé sur le cadre (au-dessus / en dessous de la cam), **cadre de cam + pseudo en source séparée** (`sources/cam.html`) à grouper avec la cam et son compteur de morts : tout disparaît d'un raccourci OBS (pseudo compris).
- **Fond synchronisé** : `sources/fond.html` tout en bas de chaque scène, calé sur l'horloge → raccord avec le fond de l'overlay là où il n'y a pas de source.
- **Sources** : alertes, chat, objectif, **cadre néon à la taille voulue** (pour encadrer ses propres widgets), compte à rebours seul, fond seul.
- **Transitions** : balayage et volets néon (simples).
- **Chaîne Twitch** : bannière, écran hors-ligne, panneaux de bio, emotes, badges d'abonné — fait (`chaine/`), à valider.
- **Contraintes** : son widget de succès, il le gère lui-même (non pris en compte). Manette et LiveSplit : des trous encadrés.

## Décisions prises

- 2026-09-29 — Fond généré (graine réglable) plutôt que l'image Chrome d'origine.
- 2026-09-29 — Mises en page regroupées dans `js/scenes.js`.
- 2026-09-30 — Dossier `Overlay/mordethrhedan/`, police dans `assets/polices/`, accueil et moodboard remis au format commun, flou de la barre du moodboard retiré (écran noir).
- 2026-09-30 — Refonte en 3 dispositions (Grande / Petite / Jeu). Derniers événements sans bot : sub, raid, série via les annonces du chat Twitch ; follow via la Socket API Streamlabs (clé dans `config.js › streamlabs.jeton`). Module propre à l'overlay : `js/derniers.js`.

## État d'avancement

| Élément | État |
|---|---|
| Moodboard | ✅ |
| Écrans et scènes | ✅ |
| Sources (dont `cam` : cadre de la cam de la scène Jeu, à grouper) | ✅ |
| Transitions (vidéos Stinger : balayage et volets, 800 ms) | ✅ |
| Kit chaîne Twitch (`chaine/`, 40 PNG dans `chaine/export/`) | ✅ (à valider) |
| TUTO.md | ✅ |
| Refonte des scènes (3 dispositions, derniers événements, fond synchronisé) | ✅ vérifiée en navigateur |
| Testé dans OBS / annonces Twitch et Streamlabs en vrai live | ⬜ |

## À faire / questions ouvertes

- [ ] Déposer `Dyer.ttf` dans `assets/polices/`.
- [ ] Confirmer l'identifiant Twitch, remplir `objectif.depart`.
- [ ] Coller la clé Streamlabs (« Socket API Token ») dans `reglages.html` › Derniers événements, pour le dernier follow.
- [ ] Refaire ses scènes OBS avec les nouvelles fiches (TUTO §3), dont le groupe « Cam » + raccourci.
- [ ] Valider le kit de chaîne Twitch (`chaine/kit.html`) puis l'envoyer sur Twitch (TUTO §7).

## Journal

- **2026-09-29** — Captures de l'ancien overlay fournies. Précisions : widgets ignorés, fond à refaire, halo discret, couleur unique pilotant cadres et fond, police Dyer.
- **2026-09-29** — Socle (fond, cadres, config), moodboard, puis construction complète sur le modèle Espace, vidéos Stinger, tuto.
- **2026-09-30** — Harmonisation : dossier renommé, fichiers communs, accueil et moodboard au format commun.
- **2026-09-30** — Kit de chaîne Twitch créé (profil, bannière, hors-ligne, 4 panneaux, 6 emotes, 5 badges). TUTO réécrit fiche par fiche, en PDF ; `index.html` devient une vitrine.
- **2026-09-30** — Ajout de `reglages.html` (page commune à tous les overlays, aux couleurs du thème) : un formulaire qui modifie `config.js` sans toucher au reste du fichier ; libellés propres à l'overlay dans `js/reglages-champs.js`. TUTO §2.1 mis à jour. Outils communs mis à jour (variable `NAVIGATEUR`, polices locales du thème dans les PDF). PDF à régénérer sur le PC (`node outils/generer-pdf.mjs`).
- **2026-09-30** — Polices passées en local (`assets/polices/`, via `node outils/polices-locales.mjs`) : l'overlay n'a plus besoin d'internet pour s'écrire (vérifié en bloquant Google Fonts). Dyer reste à déposer à la main (Righteous la remplace).
- **2026-09-30** — Objectif réglé sur les abonnements : une pluie d'abonnements offerts compte maintenant pour tous ses cadeaux (avant : 0). Chat : mémoire des 10 dernières minutes entre scènes (`chat.memoireMinutes`), options `?chat=0` (TUTO §2). PDF lisibles hors ligne (police du thème si Nunito manque), régénérés.
- **2026-09-30** — Emotes 7TV / BTTV / FFZ : pas prévues (les chaînes n'utilisent pas ces extensions).
- **2026-09-30** — Commun : « pas de F12 dans Interagir » → journal à l'écran `?journal=1` (connexion Streamer.bot + événements bruts) ; client Streamer.bot en copie locale (plus besoin d'internet pour les alertes) ; script OBS `outils/actualiser-obs.lua` (actualiser toutes les sources, et tout seul quand config.js change) — non testé dans OBS.
- **2026-09-30** — Harmonisation avec Patagrain : panneau de bio « Matériel » ajouté (PNG exporté). Pas de bandeau dans cet overlay.
- **2026-09-30** — Demande : changer les couleurs depuis les réglages (ex. thème Halloween, orange à la place du bleu), sur tous les overlays → `config.js › couleurs` + `js/couleurs.js` (commun) ; `reglages.html` › Couleurs : nuanciers et ambiances en un clic (🎃 Halloween, 🎄 Noël, ↺ Couleurs d'origine). Vidéos de transition et kit à refaire après un changement de couleurs.
- **2026-09-30** — TUTO mis à jour : section « Les scripts » (installer Node.js et ffmpeg, lancer un script, tableau de tous les scripts dont actualiser-obs.lua), section 6 complète (chat, Streamer.bot pas à pas, journal ?journal=1, événements, dons, objectif, tests), réglages via reglages.html partout, options ?journal=1 / ?chat=0.
- **2026-09-30** — Demande : une option `?cam=0` (pas de webcam) → ajoutée (plus de cadre de cam). Puis « cam et tout, on devrait pouvoir le régler depuis les réglages » → `config.js › options` + `js/options.js` (commun) ; `reglages.html` › **Options des scènes** : le coin de la webcam de la scène Jeu (ou « Pas de webcam ») et le chat de chaque écran. Une option écrite dans l'adresse d'une source OBS passe avant.
- **2026-09-30** — Bug signalé : en Cam seule, remettre le chat (et les couleurs) dans les réglages ne marchait pas après actualisation → `js/options.js` ajoutait `?chat=0` à l'adresse, et l'actualisation d'OBS rechargeait cette adresse modifiée. Corrigé : les options ajoutées par les réglages sont notées (`depuisReglages=…`) et retirées au chargement suivant. Couleurs : l'écriture et l'affichage vérifiés (Halloween puis couleurs d'origine) ; pas testé dans OBS.
- **2026-09-30** — Réglages : **« Mes ambiances »** (section Couleurs) — nommer les couleurs affichées puis 💾, gardées dans `config.js › ambiances` (ex. Batman) ; un clic les remet, × les supprime. TUTO §9 mis à jour. Aperçu des alertes dans reglages.html au vrai style de l'overlay (`apercuAlerte`, comme Patagrain).
- **2026-09-30** — **Refonte des scènes demandée (3 croquis)** : ① « grande scène » (démarrage/pause/fin/cam/contenu) : trou dans le grand cadre, message facile à changer, pseudo en haut, cadre central un peu plus bas, ligne en bas « dernier follow / sub / raid / série de visionnage » ; ② « petite scène » (contenu/speedrun) : trous grand cadre (jeu/fenêtre), haut gauche (manette/cam), bas gauche (LiveSplit, ou chat désactivable) + pseudo et derniers ; ③ Jeu : cadre au plus près des bords, coins bouchés par le fond, cam dans les 4 coins, pseudo dans un petit encadré sur le cadre (au-dessus si cam en haut, en dessous si cam en bas), **cadre de cam = source séparée** (à grouper avec la cam pour la masquer d'un raccourci). Partout : **fond synchronisé** visible quand il n'y a pas de source. **Alertes : Streamlabs** (pas de bot) ; widget de succès géré par lui.
- **2026-09-30** — Refonte faite : `js/scenes.js` (3 dispositions), `js/derniers.js` (nouveau), `sources/cam.html` (nouveau), `chat.html?place=petite|grande`, fond calé sur l'horloge (`js/fond.js`), réglages (Derniers événements, chat du Speedrun), TUTO §3 réécrit + 4.7 + 6.1 bis, vitrine et moodboard. Vérifié : toutes les pages sans erreur, normal et `?test=1`. Pas testé : OBS, vraies annonces Twitch / Streamlabs.
- **2026-09-30** — Choix : le pseudo de la scène Jeu **disparaît avec la cam** → déplacé de `scenes/jeu.html` vers `sources/cam.html` (`?pseudo=0` pour l'enlever) ; sans webcam (`?cam=0`), l'overlay Jeu l'affiche en haut à gauche. Vérifié en navigateur (cam en haut, en bas, sans cam).
- **2026-09-30** — Standardisé dans les 4 overlays : **heure fixe** du compte à rebours (`demarrage.heure` / `?heure=20:30`, réglages › Démarrage › « … ou heure fixe ») et **étiquettes de placement** (`afficherZones` / `?zones=1`, réglages › Options des scènes). TUTO §2 et §3.1 mis à jour.
- **2026-09-30** — Pseudo du cadre de cam réglable aussi dans `reglages.html` › Options des scènes (`config.js › options.cam.pseudo`).
