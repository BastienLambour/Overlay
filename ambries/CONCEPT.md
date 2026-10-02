# Ambries — Concept

> Résumé vivant de la demande. **Mis à jour à chaque échange** : nouvelle demande, choix validé,
> changement d'avis. Le haut du fichier décrit l'état actuel ; le journal en bas garde l'historique.

## La chaîne

| | |
|---|---|
| Streamer | Ambries_ |
| Identifiant Twitch | `ambries_` — **à confirmer** |
| Ce qui est streamé | — (à préciser) |
| Écran / canevas OBS | — (à préciser) |
| Alertes | Streamer.bot, à installer |

## Direction artistique

- **Univers** : **néon violet / mauve**, esprit **comics / pop art** avec beaucoup d'humour.
- **Élément signature** : **son avatar** (photo de profil HD dans `assets/avatar.png`, 800×800) dans un anneau néon — au centre des transitions, sur les écrans d'attente, dans la jauge d'objectif.
- **Palette** : **néon mauve** (choisi) — nuit violette, néon violet et mauve, blanc pour le fluide, une couleur « pop » pour les stickers.
- **Polices** : titres **Bangers** (validé), enseigne néon (Tilt Neon) pour le pseudo, Fredoka pour le texte.
- **Motifs** : éclaboussures, coulures, trame de points BD, tubes néon qui grésillent, gribouillis « !! », éclats BD.
- **Ton / vocabulaire des alertes** (validé) : « Nouveau témoin ! », « Soutien moral officiel », « Toujours là ?! », « Cadeau empoisonné », « Pièces de consolation », « Invasion !! », « Fonds pour excuses ». Stickers : « 10 % skill · 90 % d'excuses », « C'était facile pourtant », « Lag !! ».

## Ce qui est demandé

- **Transitions** (demande d'origine) : **gouttes blanches**, **néon / pop art**, **bande blanche de fluide qui splash** → **Splash, Gouttes, Pop art** (les trois, validé).
- **Écrans** : « Ça commence bientôt ! » (« Chargement des excuses… 90 % »), enseigne « Pause » qui grésille, « GG ! (enfin… presque) ».
- **Scènes** : Cam seule, Contenu, Jeu.
- **Sources** : alertes en sticker BD qui éclabousse, chat en bulles BD, bandeau, objectif (sa tête avance), cadre cam néon.
- **Chaîne Twitch** : photo de profil, bannière, écran hors-ligne, 4 panneaux de bio, 6 emotes (panique, LAG, GG?, OUPS, !!, cœur), 5 badges d'abonné (jauge de skill qui monte avec l'ancienneté).
- Même architecture que les autres overlays.

## Décisions prises

- 2026-09-29 — Palette néon mauve (choix d'Ambries).
- 2026-09-30 — « Go » : titres Bangers, les trois transitions (splash, gouttes, pop-art), ton humour tel quel, identifiant `ambries_` (gardé « à confirmer »). Ce qui est streamé reste inconnu : on ne bloque pas dessus.

## État d'avancement

| Élément | État |
|---|---|
| Moodboard | ✅ |
| Écrans et scènes | ✅ démarrage, pause, fin, cam-seule, contenu, jeu |
| Sources | ✅ alertes, chat, bandeau, objectif, cam |
| Transitions (vidéos Stinger) | ✅ splash (1050 ms), gouttes (1150 ms), pop-art (750 ms) |
| Kit chaîne Twitch | ✅ 40 PNG dans `chaine/export/` |
| TUTO.md | ✅ + TUTO.pdf |
| Testé dans OBS / avec Streamer.bot | ⬜ |

## À faire / questions ouvertes

- [ ] Confirmer l'identifiant Twitch `ambries_`.
- [ ] Ce qu'Ambries streame, et la taille de son canevas OBS (tout est prévu en 1920×1080).
- [ ] Remplir `objectif.depart` (nombre actuel de followers) et `chaine.planning` dans `config.js`.
- [ ] Tester dans OBS et avec un vrai Streamer.bot (jamais fait : les noms de champs des événements ne sont pas documentés).

## Journal

- **2026-09-29** — Nouvel overlay : photo de profil, violet/mauve néon, idées de transitions. Moodboard (3 palettes, 3 polices, personnage, motifs, composants, 3 transitions jouables, écrans). Avatar HD intégré. Palette néon mauve choisie.
- **2026-09-30** — Dossier déplacé dans `Overlay/ambries/`.
- **2026-09-30** — Le standard inclut maintenant le kit de chaîne Twitch, le TUTO fiche par fiche et les PDF : à faire lors de la construction.
- **2026-09-30** — « Go » reçu (Bangers, 3 transitions, ton humour, `ambries_` à confirmer) : construction de tout l'overlay lancée.
- **2026-09-30** — Overlay construit : 6 scènes, 5 sources, 3 transitions + vidéos Stinger, kit de chaîne (40 PNG), vitrine, TUTO, moodboard aligné sur le plan standard (section 07 « Scènes », tableau du vocabulaire). Tout vérifié dans le navigateur (normal et `?test=1`) ; pas testé dans OBS ni avec Streamer.bot.
- **2026-09-30** — Référence commune mise à jour : serveur d'aperçu en Node (`serveur-apercu.mjs`), outil `capturer.mjs`. TUTO §10 : entrée « Une ancienne image s'affiche encore ».
- **2026-09-30** — Ajout de `reglages.html` (page commune à tous les overlays, aux couleurs du thème) : un formulaire qui modifie `config.js` sans toucher au reste du fichier ; libellés propres à l'overlay dans `js/reglages-champs.js`. TUTO §2.1 mis à jour. Outils communs mis à jour (variable `NAVIGATEUR`, polices locales du thème dans les PDF). PDF à régénérer sur le PC (`node outils/generer-pdf.mjs`).
- **2026-09-30** — Polices passées en local (`assets/polices/`, via `node outils/polices-locales.mjs`) : l'overlay n'a plus besoin d'internet pour s'écrire (vérifié en bloquant Google Fonts).
- **2026-09-30** — Objectif réglé sur les abonnements : une pluie d'abonnements offerts compte maintenant pour tous ses cadeaux (avant : 0). Chat : mémoire des 10 dernières minutes entre scènes (`chat.memoireMinutes`), options `?chat=0` / `?bandeau=0` (TUTO §2). PDF lisibles hors ligne (police du thème si Nunito manque), régénérés.
- **2026-09-30** — Emotes 7TV / BTTV / FFZ : pas prévues (les chaînes n'utilisent pas ces extensions).
- **2026-09-30** — Commun : « pas de F12 dans Interagir » → journal à l'écran `?journal=1` (connexion Streamer.bot + événements bruts) ; client Streamer.bot en copie locale (plus besoin d'internet pour les alertes) ; script OBS `outils/actualiser-obs.lua` (actualiser toutes les sources, et tout seul quand config.js change) — non testé dans OBS.
- **2026-09-30** — Harmonisation avec Patagrain : bandeau aux cases au choix (`reglages.html` › Bandeau d'infos, `config.js › bandeau`) ; panneau de bio « Matériel » ajouté (PNG réexportés).
- **2026-09-30** — Demande : changer les couleurs depuis les réglages (ex. thème Halloween, orange à la place du bleu), sur tous les overlays → `config.js › couleurs` + `js/couleurs.js` (commun) ; `reglages.html` › Couleurs : nuanciers et ambiances en un clic (🎃 Halloween, 🎄 Noël, ↺ Couleurs d'origine). Vidéos de transition et kit à refaire après un changement de couleurs.
- **2026-09-30** — TUTO mis à jour : section « Les scripts » (installer Node.js et ffmpeg, lancer un script, tableau de tous les scripts dont actualiser-obs.lua), section 6 complète (chat, Streamer.bot pas à pas, journal ?journal=1, événements, dons, objectif, tests), réglages via reglages.html partout, options ?journal=1 / ?chat=0.
- **2026-09-30** — Demande : une option `?cam=0` (pas de webcam) → ajoutée (plus de cadre de cam, le chat récupère la place). Puis « cam et tout, on devrait pouvoir le régler depuis les réglages » → `config.js › options` + `js/options.js` (commun) ; `reglages.html` › **Options des scènes** : le coin de la webcam de la scène Jeu (ou « Pas de webcam »), la webcam de Contenu, le chat et le bandeau de chaque scène. Une option écrite dans l'adresse d'une source OBS passe avant.
- **2026-09-30** — Bug signalé : en Cam seule, remettre le chat (et les couleurs) dans les réglages ne marchait pas après actualisation → `js/options.js` ajoutait `?chat=0` à l'adresse, et l'actualisation d'OBS rechargeait cette adresse modifiée. Corrigé : les options ajoutées par les réglages sont notées (`depuisReglages=…`) et retirées au chargement suivant. Couleurs : l'écriture et l'affichage vérifiés (Halloween puis couleurs d'origine) ; pas testé dans OBS.
- **2026-09-30** — Réglages : **« Mes ambiances »** (section Couleurs) — nommer les couleurs affichées puis 💾, gardées dans `config.js › ambiances` (ex. Batman) ; un clic les remet, × les supprime. TUTO §9 mis à jour. Aperçu des alertes dans reglages.html au vrai style de l'overlay (`apercuAlerte`, comme Patagrain).
- **2026-09-30** — Standardisé dans les 4 overlays : **heure fixe** du compte à rebours (`demarrage.heure` / `?heure=20:30`, réglages › Démarrage › « … ou heure fixe ») et **étiquettes de placement** (`afficherZones` / `?zones=1`, réglages › Options des scènes). TUTO §2 et §3.1 mis à jour.
- **2026-09-30** — Demande : des sons différents selon l'alerte, pour les reconnaître en jouant → `js/son.js` : un son par alerte (follow, abonnement, réabonnement, abonnement offert, pluie d'abonnements, bits, raid, don, objectif), dans le thème (tableau dans TUTO 6.8). Et ses propres fichiers possibles : dossier `sons/` + `config.js › alertes.sons` ; `reglages.html` › **Sons des alertes** avec ▶ pour écouter (« aucun » = silence). Vérifié dans le navigateur (sons rendus hors ligne, fichier perso joué) ; pas écouté dans OBS.
- **2026-10-01** — Demande : « quand je donne un nouveau dossier, son config est écrasé » → réglages perso séparés : `config.js` = valeurs par défaut (remplacé à chaque mise à jour), `mes-reglages.js` = ce que le streamer change dans reglages.html (jamais livré, gardé lors d'une mise à jour, `.gitignore`). Migration unique : reglages.html › « 📥 Reprendre les réglages d'un ancien config.js ». TUTO §2.1 (« Quand tu reçois une nouvelle version »). Pas testé dans OBS.
- **2026-10-01** — Demande : captures animées des écrans, alertes, etc. → WebP animé (meilleur que le GIF pour les dégradés néon). Nouvel outil commun `outils/animer.mjs` (horloge virtuelle, liste JSON), 22 captures dans `captures/` + galerie `captures/index.html`.
- **2026-10-01** — Captures trop floues en 960 px (remarque d'Ambries) → refaites en 1920 × 1080 (défaut de `animer.mjs`), qualité WebP relevée, 3 navigateurs en parallèle.
- **2026-10-01** — Encore flou (compression WebP avec perte + images JPEG qui bavent sur les textes colorés) → WebP SANS PERTE à partir d'images PNG : net. Bandeau : l'animation de mise à jour glisse au lieu de grossir (le texte chevauchait son intitulé).
- **2026-10-01** — Demandes : « la cam de l'overlay bouge mais pas la source caméra dans OBS », « un script qui place toutes les cams sur toutes les scènes », « Options des scènes trop fouillis », « la cam de Jeu à un X/Y précis, en gardant les préréglages, et voir leurs coordonnées ». → `js/zones.js` (les zones de la webcam, seule source des chiffres) + `Options.cam()` (commun) ; scène Jeu : préréglage, position perso `{ x, y, l, h }` (`?cam=x,y,l,h`) ou pas de webcam. `reglages.html` › Options des scènes refait : un tableau scènes × éléments avec interrupteurs, et un bloc « La webcam de la scène Jeu » (préréglages avec coordonnées, position perso, plan où l'on fait glisser la cam, zones fixes des autres scènes). Script OBS `actualiser-obs.lua` : bouton « Placer les webcams sur toutes les scènes (et les ajouter là où elles manquent) » + replacement automatique quand les réglages changent. Testé hors OBS (faux OBS, 1440p, groupes, carte d'acquisition non touchée) ; **pas testé dans le vrai OBS**.
- **2026-10-02** — Demande : « ne plus envoyer de zip à la main ; un serveur sur mon VPS ; un push = mis à jour ; et quand eux modifient ? » → dossier `serveur/` (à la racine du dépôt) : le VPS publie une page de téléchargement + un zip et un `version.json` par overlay, refaits à chaque push (webhook GitHub ou GitLab, + vérification horaire), installés par `serveur/installer.sh` (notice : `serveur/LISEZMOI.md`). Côté overlay : bouton **Mettre à jour l'overlay** dans le script OBS `actualiser-obs.lua` (ou `mettre-a-jour.cmd`) : dernière version installée, `mes-reglages.js` gardé, ancienne version dans `sauvegardes\`. `reglages.html` › **Mises à jour** (adresse du serveur). TUTO 2.1, 2.8, scripts, dépannage. Testé : installation en conteneur, webhook, mise à jour avec PowerShell 7 ; **pas testé** : sur le vrai VPS, sous Windows, dans OBS.
- **2026-10-02** — Choix : le dépôt publié par le serveur sera sur GitLab (https://gitlab.com/Bastien.Lambour/overlays, branche main), webhook GitLab. `serveur/installer.sh` et `serveur/LISEZMOI.md` réglés dessus par défaut.
- **2026-10-02** — Le VPS héberge déjà d'autres sites (Nginx, certificat bastien-lambour.fr) → le serveur des overlays sera sur **https://overlays.bastien-lambour.fr** (même certificat, 80 → 443), dans `/var/www/overlays` (`depot/` privé, `site/` servi) ; `installer.sh` n'ajoute qu'un fichier Nginx et ne touche à aucun autre site. `miseAJour.adresse` = cette adresse. À faire : l'enregistrement DNS `overlays` → 217.154.115.223.
