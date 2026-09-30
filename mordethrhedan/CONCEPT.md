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
| Alertes | Streamer.bot, à installer |

## Direction artistique

- **Univers** : **néon sobre**. Refaire proprement son overlay existant (cadres verts « faits sous Paint »), **sans grosses animations**.
- **Fond** : facettes sombres façon cristal avec des éclats lumineux, **recréé et généré** (à partir d'un thème Chrome trouvé en ligne), qui respirent très doucement (désactivable).
- **Couleur** : **une seule couleur d'accent, qui pilote tout** (cadres + éclats du fond). Vert par défaut, changeable selon le jeu (`couleur` dans `config.js` ou `?couleur=rouge`).
- **Cadres** : trait régulier, coins arrondis, liseré sombre, **halo discret** (léger / moyen / fort), version transparente et version « verre » fumée.
- **Police** : **Dyer** (celle de Beyond Good & Evil) pour les titres — fichier à déposer dans `assets/polices/` ; Righteous en attendant. Texte en Nunito.
- **Vocabulaire des alertes** : sobre et direct (« Nouveau follow », « Nouvel abonné », « Raid ! »…). Carillon doux ; les gros événements font pulser le halo.
- **Chat** : en cartes, comme son ancien chat, avec pastilles de badges (streamer, modo, VIP, abonné).

## Ce qui est demandé

- **Scènes** : Jeu + cam (cam dans un coin, **zone libre pour son widget de succès**), **Speedrun** (zones libres pour **sa manette et ses splits LiveSplit**, cadres optionnels), Contenu + chat, Cam seule.
- **Écrans** : Démarrage (compte à rebours), Pause (« Petite pause en cours »), Fin — le titre se pose sur **son image**, avec un léger voile.
- **Sources** : alertes, chat, objectif, **cadre néon à la taille voulue** (pour encadrer ses propres widgets), compte à rebours seul, fond seul.
- **Transitions** : balayage et volets néon (simples).
- **Chaîne Twitch** : bannière, écran hors-ligne, panneaux de bio, emotes, badges d'abonné — fait (`chaine/`), à valider.
- **Contraintes** : ses widgets de succès / speedrun, il les gère lui-même → on leur laisse la place, sans les dessiner.

## Décisions prises

- 2026-09-29 — Fond généré (graine réglable) plutôt que l'image Chrome d'origine.
- 2026-09-29 — Mises en page regroupées dans `js/scenes.js`.
- 2026-09-30 — Dossier `Overlay/mordethrhedan/`, police dans `assets/polices/`, accueil et moodboard remis au format commun, flou de la barre du moodboard retiré (écran noir).

## État d'avancement

| Élément | État |
|---|---|
| Moodboard | ✅ |
| Écrans et scènes | ✅ |
| Sources (pas de `bandeau` ni de `cam` seule : non demandés) | ✅ |
| Transitions (vidéos Stinger : balayage et volets, 800 ms) | ✅ |
| Kit chaîne Twitch (`chaine/`, 40 PNG dans `chaine/export/`) | ✅ (à valider) |
| TUTO.md | ✅ |
| Testé dans OBS / avec Streamer.bot | ⬜ |

## À faire / questions ouvertes

- [ ] Déposer `Dyer.ttf` dans `assets/polices/`.
- [ ] Confirmer l'identifiant Twitch, remplir `objectif.depart`.
- [ ] Installer Streamer.bot.
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
