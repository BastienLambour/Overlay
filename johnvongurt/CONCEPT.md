# John Von Gurt — Concept

> Résumé vivant de la demande. **Mis à jour à chaque échange** : nouvelle demande, choix validé,
> changement d'avis. Le haut du fichier décrit l'état actuel ; le journal en bas garde l'historique.

## La chaîne

| | |
|---|---|
| Streamer | Le frère de l'utilisateur |
| Nom affiché | « John Von Gurt » — **à confirmer** (repris d'une maquette) |
| Identifiant Twitch | `johnvongurt` — **à confirmer** |
| Ce qui est streamé | — (à préciser) |
| Écran / canevas OBS | 1920×1080 (supposé) |
| Alertes | Streamer.bot, à installer |

## Direction artistique

- **Univers** : l'espace, façon **« mission control » épuré** — coins en équerre, typo condensée en majuscules, étiquettes noires en police machine à écrire, bandes hachurées, illustrations en traits fins (esprit *Minimal Space*).
- **Palette** : fond sombre, trait clair, **orange « attention »** en accent (variantes cyan / vert). Écran de pause en version **claire**.
- **Polices** : titres Barlow Condensed (variantes Rajdhani, Oxanium), texte et données en mono.
- **Élément signature** : **la fusée, toujours identique** (livrée sombre, hublot orange, jambes repliées sauf à l'alunissage). Seul son état change.
- **Vocabulaire des alertes** : « Nouvelle recrue » (follow), « Astronaute certifié » (sub), « Astronaute vétéran » (resub), « Billet offert » / « Pluie de billets » (cadeaux), « Carburant reçu » (bits), « Flotte en approche » (raid), « Soutien de mission » (don).
- **Sons** : petits bips radio.
- **Références fournies** : 6 images d'inspiration (dont un « Waiting Stream » clair).

## Ce qui est demandé

- **Démarrage** : la fusée en **ravitaillement sur le pas de tir**. Le remplissage suit le compte à rebours et atteint 100 % à T-30 (petit message « Ravitaillement terminé » sous la fusée, quelques secondes), puis décompte 10…1 **dans le panneau** (pas de grand décompte à côté de la fusée), allumage à T-3, **décollage à T-0** : « Décollage ! » puis « Lancement réussi » dans le panneau, qui se ferme ; la **caméra suit la fusée** dans l'espace (traînées d'étoiles). Ligne d'activité en bas du panneau, bouton ⚙ Durée dans *Interagir*.
- **Pause** : anneau de chargement « waiting » sur fond clair, avec la fusée en vol au centre **sur fond noir étoilé** (elle est dans l'espace).
- **Fin** : la fusée **alunit** (jambes qui se déploient, poussière, drapeau), « Mission accomplie ». Variante amerrissage en mer envisagée.
- **Scènes** : Cam seule, Contenu, Jeu.
- **Sources** : alertes, chat « Canal de communication », bandeau d'infos, objectif (la fusée va de la Terre à la Lune), cadre cam « Flux caméra » (voyant REC, plaque de nom).
- **Transitions** : sas (portes blindées) et passage (la fusée traverse l'écran).
- **Chaîne Twitch** : bannière, écran hors-ligne, panneaux de bio, emotes, badges d'abonné — fait (`chaine/`), à valider.

## Décisions prises

- 2026-09-29 — Une seule fusée partagée par tous les écrans (dessin commun dans `commun.js`).
- 2026-09-29 — Séquence de décollage liée au compte à rebours (plein à T-30).
- 2026-09-30 — Écran d'attente renommé `pause.html`, dossier `Overlay/johnvongurt/` (harmonisation).
- 2026-09-30 — Reprise du design de l'ancienne copie `Overlay-Espace` : démarrage « caméra qui suit la fusée » **sans le grand décompte**, écrans animés relancés à chaque passage à l'antenne, chrono REC commun aux scènes, étiquettes de zones, chat **sans** la ligne « > transmission », 7 palettes en ambiances de `reglages.html`. On **garde** le chat et le bandeau intégrés aux scènes (pas de sources préplacées) et **pas** de choix de polices (polices locales, sans internet).

## État d'avancement

| Élément | État |
|---|---|
| Moodboard | ✅ |
| Écrans et scènes | ✅ |
| Sources | ✅ |
| Transitions (vidéos Stinger : sas 1100 ms, passage 1000 ms) | ✅ |
| Kit chaîne Twitch (`chaine/`, 40 PNG dans `chaine/export/`) | ✅ (à valider) |
| TUTO.md | ✅ |
| Testé dans OBS / avec Streamer.bot | ⬜ |

## À faire / questions ouvertes

- [ ] Confirmer le nom de chaîne et l'identifiant Twitch.
- [ ] Choix définitifs du frère : thème, accent, police (défauts : sombre, orange, Barlow).
- [ ] Remplir `objectif.depart`.
- [ ] Option : collection de scènes OBS prête à importer.
- [ ] Option : fin en amerrissage.
- [ ] Valider le kit de chaîne Twitch (`chaine/kit.html`) puis l'envoyer sur Twitch (TUTO §7).

## Journal

- **2026-09-29** — Projet dupliqué depuis Patagrain pour le frère. Trois écrans (démarrage, pause, fin), puis moodboard complet, fusée unifiée, fond noir dans l'anneau.
- **2026-09-29** — Séquence de décollage. Construction complète (scènes, sources, alertes Streamer.bot, transitions), guide, TUTO.md, explication du placement de la cam. Vidéos Stinger générées avec ffmpeg.
- **2026-09-30** — Harmonisation : dossier `Overlay/johnvongurt/`, fichiers communs, `pause.html`.
- **2026-09-30** — Kit de chaîne Twitch créé (profil, bannière, hors-ligne, 4 panneaux, 6 emotes, 5 badges). TUTO réécrit fiche par fiche, en PDF ; `index.html` devient une vitrine.
- **2026-09-30** — Ajout de `reglages.html` (page commune à tous les overlays, aux couleurs du thème) : un formulaire qui modifie `config.js` sans toucher au reste du fichier ; libellés propres à l'overlay dans `js/reglages-champs.js`. TUTO §2.1 mis à jour. Outils communs mis à jour (variable `NAVIGATEUR`, polices locales du thème dans les PDF). PDF à régénérer sur le PC (`node outils/generer-pdf.mjs`).
- **2026-09-30** — Polices passées en local (`assets/polices/`, via `node outils/polices-locales.mjs`) : l'overlay n'a plus besoin d'internet pour s'écrire (vérifié en bloquant Google Fonts).
- **2026-09-30** — Objectif réglé sur les abonnements : une pluie d'abonnements offerts compte maintenant pour tous ses cadeaux (avant : 0). Chat : mémoire des 10 dernières minutes entre scènes (`chat.memoireMinutes`), options `?chat=0` / `?bandeau=0` (TUTO §2). PDF lisibles hors ligne (police du thème si Nunito manque), régénérés.
- **2026-09-30** — Emotes 7TV / BTTV / FFZ : pas prévues (les chaînes n'utilisent pas ces extensions).
- **2026-09-30** — Commun : « pas de F12 dans Interagir » → journal à l'écran `?journal=1` (connexion Streamer.bot + événements bruts) ; client Streamer.bot en copie locale (plus besoin d'internet pour les alertes) ; script OBS `outils/actualiser-obs.lua` (actualiser toutes les sources, et tout seul quand config.js change) — non testé dans OBS.
- **2026-09-30** — Harmonisation avec Patagrain : bandeau aux cases au choix (`reglages.html` › Bandeau d'infos, `config.js › bandeau`) ; panneau de bio « Matériel » ajouté (panneaux renumérotés 04/05, PNG réexportés).
- **2026-09-30** — Demande : changer les couleurs depuis les réglages (ex. thème Halloween, orange à la place du bleu), sur tous les overlays → `config.js › couleurs` + `js/couleurs.js` (commun) ; `reglages.html` › Couleurs : nuanciers et ambiances en un clic (🎃 Halloween, 🎄 Noël, ↺ Couleurs d'origine). Vidéos de transition et kit à refaire après un changement de couleurs.
- **2026-09-30** — TUTO mis à jour : section « Les scripts » (installer Node.js et ffmpeg, lancer un script, tableau de tous les scripts dont actualiser-obs.lua), section 6 complète (chat, Streamer.bot pas à pas, journal ?journal=1, événements, dons, objectif, tests), réglages via reglages.html partout, options ?journal=1 / ?chat=0.
- **2026-09-30** — Demande : une option `?cam=0` (pas de webcam) → ajoutée (plus de cadre de cam, le chat récupère la place). Puis « cam et tout, on devrait pouvoir le régler depuis les réglages » → `config.js › options` + `js/options.js` (commun) ; `reglages.html` › **Options des scènes** : le coin de la webcam de la scène Jeu (ou « Pas de webcam »), la webcam de Contenu, le chat et le bandeau de chaque scène. Une option écrite dans l'adresse d'une source OBS passe avant.
- **2026-09-30** — Bug signalé : en Cam seule, remettre le chat (et les couleurs) dans les réglages ne marchait pas après actualisation → `js/options.js` ajoutait `?chat=0` à l'adresse, et l'actualisation d'OBS rechargeait cette adresse modifiée. Corrigé : les options ajoutées par les réglages sont notées (`depuisReglages=…`) et retirées au chargement suivant. Couleurs : l'écriture et l'affichage vérifiés (Halloween puis couleurs d'origine) ; pas testé dans OBS.
- **2026-09-30** — Demande : l'utilisateur a ajouté `Overlay/Overlay-Espace/`, une ancienne copie modifiée de son côté, pour en reprendre le design. Comparatif fait (rien d'intégré pour l'instant). Nouveautés propres à la copie : démarrage qui suit la fusée après le décollage (panneau qui se ferme, caméra qui accompagne la fusée, traînées d'étoiles, ligne d'activité, bouton ⚙ Durée), relance automatique des écrans animés à chaque passage à l'antenne (événements OBS), chrono REC commun à toutes les scènes, étiquettes de zones, scènes sans chat ni bandeau intégrés + sources préplacées, menu de thèmes (7 palettes + polices), chat sans la ligne « > transmission ».
- **2026-09-30** — Choix de l'utilisateur et intégration : démarrage de la copie repris (caméra qui suit la fusée, pop-up sous la fusée, ligne d'activité, ⚙ Durée, statut qui se replie ; grand décompte retiré) ; relance automatique des écrans animés et des transitions (`Commun.cycle`, événements OBS) ; chrono REC partagé (`overlay-johnvongurt-rec`), un seul REC en Contenu ; étiquettes de zones (`afficherZones`, `?zones=1`) ; chat sans « > transmission » (scènes et moodboard) ; ambiances ❄️ Bleu glace, 💚 Vert terminal, 🌌 Violet nébuleuse, 🔴 Rouge Mars, 💗 Rose néon, ☀️ Clair (+ couleurs coque/ok/alerte dans `config.js`). Chat/bandeau intégrés conservés, pas de choix de polices. Vérifié : toutes les pages sans erreur (normal et ?test=1), séquence de démarrage complète, palettes Clair et Rouge Mars. Non testé dans OBS (relance à l'antenne, ⚙ Durée). TUTO mis à jour, PDF régénérés.
- **2026-09-30** — Réglages : **« Mes ambiances »** (section Couleurs) — nommer les couleurs affichées puis 💾, gardées dans `config.js › ambiances` (ex. Batman) ; un clic les remet, × les supprime. TUTO §9 mis à jour. Aperçu des alertes dans reglages.html au vrai style de l'overlay (`apercuAlerte`, comme Patagrain).
- **2026-09-30** — Standardisé dans les 4 overlays : **heure fixe** du compte à rebours (`demarrage.heure` / `?heure=20:30`, réglages › Démarrage › « … ou heure fixe ») et **étiquettes de placement** (`afficherZones` / `?zones=1`, réglages › Options des scènes). TUTO §2 et §3.1 mis à jour.
- **2026-09-30** — Demande : des sons différents selon l'alerte, pour les reconnaître en jouant → `js/son.js` : un son par alerte (follow, abonnement, réabonnement, abonnement offert, pluie d'abonnements, bits, raid, don, objectif), dans le thème (tableau dans TUTO 6.8). Et ses propres fichiers possibles : dossier `sons/` + `config.js › alertes.sons` ; `reglages.html` › **Sons des alertes** avec ▶ pour écouter (« aucun » = silence). Vérifié dans le navigateur (sons rendus hors ligne, fichier perso joué) ; pas écouté dans OBS.
- **2026-10-01** — Demande : « quand je donne un nouveau dossier, son config est écrasé » → réglages perso séparés : `config.js` = valeurs par défaut (remplacé à chaque mise à jour), `mes-reglages.js` = ce que le streamer change dans reglages.html (jamais livré, gardé lors d'une mise à jour, `.gitignore`). Migration unique : reglages.html › « 📥 Reprendre les réglages d'un ancien config.js ». TUTO §2.1 (« Quand tu reçois une nouvelle version »). Pas testé dans OBS.
