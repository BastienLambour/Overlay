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
