# Patagrain — Concept

> Résumé vivant de la demande. **Mis à jour à chaque échange** : nouvelle demande, choix validé,
> changement d'avis. Le haut du fichier décrit l'état actuel ; le journal en bas garde l'historique.

## La chaîne

| | |
|---|---|
| Streamer | Patagrain (l'utilisateur lui-même) |
| Identifiant Twitch | `patagrain` — **à confirmer** (Twitch n'a pas confirmé que la chaîne existe) |
| Ce qui est streamé | Jeux vidéo, et de temps en temps des parties de jeu de rôle |
| Écran / canevas OBS | 2560×1440 (sortie conseillée 1920×1080, Lanczos) — les pages s'adaptent |
| Alertes | Streamer.bot, à installer (aucun outil avant) |
| Réseaux | Aucun pour le moment |

## Direction artistique

- **Univers** : médiéval-fantaisie décalé — le **bouffon du roi** (pas l'insulte !) mélangé au **jeu de rôle / donjons**. Style **flat**, dans l'esprit du logo.
- **Logo** : écriture gothique calligraphiée, l'épée fait le « t » (manette retirée), **le chapeau du bouffon posé sur le « n »** — **validé** (l'ancien logo est gardé dans `design/archives/`). **Un seul chapeau partout** — dessiné pour être porté : largeur du crâne, pointes anguleuses bleues, pointe centrale noire soulignée d'un fin liseré gris clair et terminée par un **d20**, couronne dorée courbe, grelots d'or. Généré par `outils/generer-bouffon.mjs` (bouffon, `assets/chapeau.svg`, logo).
- **Le bouffon (mascotte)** : dessiné d'après ses photos, style flat — cheveux longs raides châtain clair juste sous les épaules, raie au milieu, lunettes rectangulaires noires, yeux vert-gris, collier de barbe fin, anneau à l'oreille gauche, grain de beauté ; **habit mi-bleu mi-noir** (buste et personnage en pied identiques), chapeau noir et bleu. `js/bouffon.js` (buste, tête pour les emotes, personnage en pied articulé), `assets/bouffon.svg`, `assets/bouffon-pied.svg`.
- **Emblème** : d20 low-poly avec un « P », en 3 variantes (bleu royal, **bleu glacier** — remplace « rouge bouffon » —, nuit étoilée) — pour la photo de profil et les petits formats.
- **Palette** : **« Royal bleu & or »** (validée) — bleu Patagrain `#3A9AD9`, bleu nuit `#152238`, or `#F5B82E`, et **bleu glacier `#8FD0F5` à la place du rouge** (badge « en direct » en texte foncé, fanions, dés). Plus aucun rouge, sauf le feu de camp de la Pause qui garde de vraies couleurs de feu.
- **Polices** : titres Grenze Gotisch, texte Nunito — **en local** dans `assets/polices/` (plus besoin d'internet).
- **Motifs** : fanions, grelots, dés (d4/d6/d8/d20), chapeau, épée, blason, parchemin. **Arlequin (damier) à éviter en grand** : jugé trop flashy, les transitions sont en aplats unis avec une touche d'or.
- **Ton / vocabulaire des alertes** : cour du roi — « Nouvel aventurier » (follow), « Adoubement » (sub), « Chevalier fidèle » (resub), « Présent royal » / « Largesse royale » (cadeaux), « Tribut au bouffon » (bits), « Une horde débarque » (raid), « Offrande royale » (don).
- **Sons** : tintement de grelots synthétisé, petite fanfare pour les gros événements.

## Ce qui est demandé

- **Écrans** : Starting soon (« Le spectacle va commencer », compte à rebours « Jet d'initiative »), Pause (« Repos court », feu de camp, chat « La taverne »), Fin (« Fin de la session », carte « Prochaine quête »).
- **Scènes** : Cam seule (l'écran « blabla » : accueil, cam en grand + chat), Contenu (contenu, cam et chat côte à côte), Jeu (jeu plein écran, petite cam dans le coin de son choix, chat en transparence, barre fine).
- **Sources** : alertes, chat, bandeau d'infos, objectif « Guilde des aventuriers » (l'épée avance), cadre cam (chapeau au-dessus, dés en bas).
- **Transitions** (toutes avec le bouffon) : **rideau** — le bouffon machiniste tire la corde (Starting soon → Cam seule, vers la Fin) ; **coup d'épée** — le bouffon bretteur tranche l'écran (Cam seule → Jeu) ; **jet de dé** — le bouffon équilibriste marche sur le dé qui roule (Jeu ↔ Pause, Contenu). La page de grimoire est abandonnée.
- **Chaîne Twitch** : bannière, écran hors-ligne, panneaux de bio, emotes, badges d'abonné — fait (`chaine/`), à valider.
- **Contraintes** : tout en français, facilement éditable.

## Décisions prises

- 2026-09-29 — Palette Bouffon royal + Grenze Gotisch par défaut (modifiable en une ligne dans `theme.css`).
- 2026-09-29 — Damier d'arlequin retiré des transitions (trop chargé) ; reste en petit dans quelques liserés (à atténuer si demandé).
- 2026-09-29 — Pages dessinées en 1920×1080 et mises à l'échelle : nettes en 1440p.
- 2026-09-30 — Scène « blabla » renommée `cam-seule` (harmonisation entre overlays).

- 2026-09-30 — Le bouffon et son chapeau sont noir et bleu, et **ce chapeau est le même partout** (logo compris).
- 2026-09-30 — **Logo refait validé** (chapeau du bouffon sur le « n »).
- 2026-09-30 — Palette **Royal bleu & or** retenue : plus de rouge (emblème rouge → bleu glacier).
- 2026-09-30 — Les transitions bouffon **remplacent** rideau, épée et dé ; la page de grimoire est retirée.

## État d'avancement

| Élément | État |
|---|---|
| Moodboard (+ pistes de logo `design/logos.html`) | ✅ |
| Écrans et scènes | ✅ |
| Sources | ✅ |
| Transitions bouffon (vidéos Stinger : rideau 1400 ms, épée 700 ms, dé 1750 ms) | ✅ |
| Kit chaîne Twitch (`chaine/`, 40 PNG dans `chaine/export/`) | ✅ (à valider) |
| TUTO.md | ✅ (coordonnées en 1080p et 1440p) |
| Testé dans OBS / avec Streamer.bot | ⬜ |

## À faire / questions ouvertes

- [ ] **Le bouffon dans l'overlay** — démos dans le moodboard, **à valider** avant intégration : Starting soon = numéro de cirque (jongle avec 3 dés, poirier, salut ; d20 sur 20 à la fin du compte à rebours) ; Pause = il rêve d'un d20 qui roule, se réveille en sursaut quand il tombe sur 1, grille un chamallow, le croque et se rendort ; Cam seule et Contenu = il dépasse de la carte du chat (validé : « Top ! ») ; Alertes = il descend avec l'alerte, tenant la corde d'une main, décalé sur le côté ; Jeu = le chapeau posé sur la cam est le sien, il se lève dessous et passe la tête ; Fin = coucou, courbette, saut de joie, bulle « Merci d'être venus ! » / « À bientôt, aventuriers ! ». Briques : `css/bouffon.css`, `js/numeros.js`.

- [ ] Confirmer l'identifiant Twitch exact (`chaineTwitch` dans `config.js`).
- [ ] Remplir `objectif.depart` avec le nombre actuel de followers.
- [ ] Installer Streamer.bot et vérifier les premiers vrais événements (console F12).
- [ ] Valider le kit de chaîne Twitch (`chaine/kit.html`) puis l'envoyer sur Twitch (TUTO §7).

## Journal

- **2026-09-29** — Logo fourni, direction bouffon + JDR, liste des écrans et scènes. Moodboard (3 palettes, 3 polices, motifs, vocabulaire). Dés redessinés en low-poly, emblème d20 décliné, logo finalisé.
- **2026-09-29** — Transitions rendues plus sobres (plus de damier). Construction complète : écrans, scènes, sources, 4 transitions exportées en vidéo, guide et tuto. Adaptation 1440p.
- **2026-09-30** — Harmonisation avec les autres overlays : dossier `Overlay/patagrain/`, fichiers communs, `cam-seule.html`.
- **2026-09-30** — Kit de chaîne Twitch créé (profil, bannière, hors-ligne, 4 panneaux, 6 emotes, 5 badges). TUTO réécrit fiche par fiche, en PDF ; `index.html` devient une vitrine.
- **2026-09-30** — Retours : ses couleurs sont le **noir et le bleu** (nouveau thème à proposer) ; transitions dé, épée et rideau validées, **page à remplacer** par un bouffon animé à son image (6 photos fournies).
- **2026-09-30** — Moodboard : ajout du thème **Noir & bleu** et du **bouffon** (mascotte + transition), à valider avant production.
- **2026-09-30** — Retours sur le bouffon : chapeau qui flottait, yeux vert-gris, collier de barbe (pas un bouc), cheveux plus courts ; en Noir & bleu, le logo ne doit plus avoir de rouge ; envie d'animations travaillées (bouffon qui marche sur le dé, bouffon qui donne un coup d'épée). → Bouffon corrigé, version en pied articulée, transitions « équilibriste » et « bretteur » dans le moodboard, logo Noir & bleu.
- **2026-09-30** — Retours : chapeau à élargir et poser sur la tête (sans la bande), plus de joues roses, 2e oreille, barbe plus fine, bretteur tronqué ; demande d'une version « rideau » avec le bouffon qui tire une corde. → Corrigé, transition « machiniste » ajoutée au moodboard.
- **2026-09-30** — Décisions : palette Bouffon royal conservée, bouffon et chapeau noir et bleu **partout** (logo, icônes, cadre cam, kit), chapeau du bouffon élargi (plus large que la tête). Transitions bouffon produites (`transitions/rideau|epee|de.html` + vidéos), page de grimoire retirée (config, vitrine, tuto, vidéo). Kit de chaîne réexporté.
- **2026-09-30** — Retours : chapeau « calque » (pas posé sur la tête) → redessiné pour être porté (calotte, pointes attachées, couronne courbe) ; puis plus large et moins rond, **d20 au bout de la pointe centrale** ; buste aux mêmes couleurs que le personnage en pied ; logo à revoir → refait avec ce chapeau ; palette à revoir → 2 variantes sans rouge proposées. Vidéos de transition et kit de chaîne régénérés.
- **2026-09-30** — Retours : chapeau à la largeur du crâne (élargi puis réduit de 10 px par côté) ; palette Royal bleu & or validée, plus de dés ni d'emblème rouges ; liseré de la pointe noire : bleu jugé moche → gris clair discret. Générateur du bouffon rangé dans `outils/generer-bouffon.py`. Vidéos, kit et docs régénérés.
- **2026-09-30** — Logo refait validé (« il est top ! ») ; révérence retirée du moodboard (inutilisée).
- **2026-09-30** — Générateur du bouffon porté en Node (`outils/generer-bouffon.mjs`, sortie identique à l'ancienne version Python, supprimée) pour suivre la convention commune.
- **2026-09-30** — Polices passées en local (`assets/polices/`) ; logo à contour crème (`assets/logo-contour.svg`, utilisé en scène Jeu) ; 4 emotes à sa tête (bouffon, clin d'œil, mort de rire, choqué) ; expressions « endormi » et « sans chapeau » ajoutées au dessin ; correction : les facettes claires du mini-d20 du logo s'affichaient en noir. Idées du bouffon sur chaque écran → 6 démos dans le moodboard, à valider.
- **2026-09-30** — Retours sur les démos du bouffon : cirque trop discret (amplifié, démos agrandies), Pause → histoire du rêve (d20 qui tombe sur 1, réveil, chamallow), alertes → une main sur la corde, décalé sur le côté, Jeu → c'est son propre chapeau qui est sur la cam, Fin → plus de mouvement. Cam seule validée. Vitrine : ajout des aperçus chat, bandeau et cadre cam ; transitions rejouées en boucle.
