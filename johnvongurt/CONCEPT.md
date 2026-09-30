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

- **Démarrage** : la fusée en **ravitaillement sur le pas de tir**. Le remplissage suit le compte à rebours et atteint 100 % à T-30 (« Ravitaillement terminé »), puis décompte 10…1, allumage à T-3, **décollage à T-0**, « Lancement réussi ».
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
