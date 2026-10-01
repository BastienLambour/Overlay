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
- **Le bouffon sur chaque écran** (validé, intégré) : Starting soon = numéro de cirque (jongle, poirier, salut) et, à zéro, il lance un d20 qui retombe sur 20 ; Pause = il rêve au coin du feu d'un d20 qui tombe sur 1, se réveille, grille un chamallow au bout des flammes, le croque devant sa bouche et se rendort ; Cam seule et Contenu = il dépasse du haut de la carte du chat (tête, chapeau, deux mains), ses grelots tintent à chaque message ; Alertes = la carte descend du plafond sur deux cordes, lui sur une troisième, une main levée, il salue de l'autre ; Jeu = le chapeau posé sur la cam est le sien, il sort la tête toutes les 60 s et à chaque follow ; Fin = coucou, courbette, saut de joie, bulle qui alterne ses phrases. Ses cheveux de dos ne bougent qu'en réaction à ses mouvements. Briques : `css/bouffon.css`, `js/numeros.js` ; réglages `config.js › bouffon`, `?bouffon=0` par page.
- **Réglages sans toucher au code** : `reglages.html`, un formulaire (par écran, avec aperçu des alertes) qui réécrit `config.js` (Edge/Chrome : écriture directe ; sinon téléchargement). Le modèle du fichier est dans `js/reglages.js` : tout nouveau réglage doit y être ajouté.
- **Chat et bandeau intégrés aux scènes** (décision) : gardés dans les scènes (placés au pixel près à côté des trous, le bouffon accoudé au chat) ; `?chat=0` / `?bandeau=0` pour les retirer et utiliser `sources/chat.html` / `bandeau.html` à la place. Le chat garde en mémoire ses messages des 10 dernières minutes (`chat.memoireMinutes`) : il ne repart pas à vide en changeant de scène.
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
| Écrans et scènes (avec le bouffon) | ✅ |
| Page de réglages `reglages.html` | ✅ (écriture du fichier testée seulement en génération, pas le clic « Enregistrer » dans Edge) |
| Options des scènes (webcam ou pas, coin, chat, bandeau, bouffon) dans `reglages.html` | ✅ (vérifié dans le navigateur, pas dans OBS) |
| Un son par alerte + sons perso (`reglages.html` › Sons des alertes) | ✅ (vérifié dans le navigateur, pas dans OBS) |
| Webcam placée toute seule dans OBS (script `actualiser-obs.lua`) + position perso en Jeu + Options des scènes en tableau | ✅ navigateur + faux OBS ; pas testé dans le vrai OBS |
| Sources | ✅ |
| Transitions bouffon (vidéos Stinger : rideau 1400 ms, épée 700 ms, dé 1750 ms) | ✅ |
| Kit chaîne Twitch (`chaine/`, 40 PNG dans `chaine/export/`) | ✅ (à valider) |
| TUTO.md | ✅ (coordonnées en 1080p et 1440p ; §6 : chat, Streamer.bot, chaque événement, dons, objectif) |
| Testé dans OBS / avec Streamer.bot | ⬜ |

## À faire / questions ouvertes

- [ ] Confirmer l'identifiant Twitch exact (`reglages.html` › La chaîne).
- [ ] Remplir « Ton nombre ACTUEL » de followers (`reglages.html` › Objectif).
- [ ] Regarder les écrans avec le bouffon en continu (rythme, taille) et dire ce qui va ou pas.
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
- **2026-09-30** — Retours sur la démo Pause : le chamallow se voyait derrière (sa tête et ses cheveux le cachaient quand il croquait) → le bras droit passe devant la tête, le chamallow glisse du bâton et arrive devant sa bouche ; bâton allongé pour que le chamallow grille bien au bout des flammes. « Le fond de ses cheveux ne bouge pas » → les cheveux de dos se balancent en permanence et rebondissent aux sauts, au sursaut, en jonglant et à chaque message (`.bf-cheveux`, dessin régénéré).
- **2026-09-30** — Retours : le chamallow n'était pas devant sa bouche → bras recalculé, il arrive pile sur la bouche et y reste plus longtemps (bouchée en deux temps). « Les cheveux qui pendent au rythme du chapeau, c'est bizarre » → plus de balancement permanent (il avait le même tempo que le chapeau) : les cheveux ne réagissent qu'à ses mouvements. Animations validées (« top ! ») → **intégrées aux vrais écrans**, aux alertes et à la scène Jeu. Question « chat et bandeau en dur ou en .html ? » → gardés dans les scènes, options `?chat=0`/`?bandeau=0`, et mémoire du chat entre scènes. Demande d'une page pour gérer la config → `reglages.html`. TUTO complété (chat, Streamer.bot, chaque événement, dons, objectif, tests). Corrigé au passage : l'épée de l'alerte Raid débordait de sa case. Outils communs : variable `NAVIGATEUR` (un autre navigateur qu'Edge), recopiés dans les 4 overlays.
- **2026-09-30** — Retours : « le chapeau se décale de la tête » (Cam seule, Contenu) → corrigé : sur le buste, le chapeau n'avait pas de pivot et tournait autour du coin du dessin quand ses grelots tintaient (jusqu'à 11 px de décalage, 0,3 px maintenant). « La page de réglages doit être dans chaque overlay, un seul reglages.html à la source qui prend le thème et le config de chacun ? » → oui : `reglages.html` + `js/reglages.js` sont maintenant des fichiers communs (`_modele/`, copiés dans les 4 overlays), aux couleurs du thème de chacun ; chaque overlay n'a que ses libellés (`js/reglages-champs.js`). La page ne remplace plus tout le fichier : elle modifie seulement les valeurs changées dans `config.js` (commentaires gardés) et refuse le config.js d'un autre overlay.
- **2026-09-30** — Objectif réglé sur les abonnements : une pluie d'abonnements offerts compte maintenant pour tous ses cadeaux (avant : 0). PDF lisibles hors ligne (police du thème si Nunito manque), régénérés.
- **2026-09-30** — Emotes 7TV / BTTV / FFZ : pas prévues (les chaînes n'utilisent pas ces extensions).
- **2026-09-30** — Retours Patagrain : plus de chapeau sur la cam en Cam seule et Contenu (le bouffon est déjà sur le chat) et plus d'en-tête (logo + « En direct ») : le logo remplace la plaque « Patagrain » sous la cam, cam remontée (y 100) ; scène Jeu : le bouffon sort environ toutes les 3 min (au hasard ± 25 %) et à chaque follow, et il a maintenant une vraie disparition (élan, plongeon sous le chapeau qui tangue) ; bandeau : cases au choix dans les réglages (dons/bits, abonnés…) ; kit : photo de profil = le bouffon (emblème gardé en autre choix), écran hors-ligne = le bouffon endormi debout, panneau « Matériel » ajouté. Commun : « pas de F12 dans Interagir » → journal à l'écran `?journal=1` (connexion Streamer.bot + événements bruts) ; client Streamer.bot en copie locale (plus besoin d'internet pour les alertes) ; script OBS `outils/actualiser-obs.lua` (actualiser toutes les sources, et tout seul quand config.js change) — non testé dans OBS.
- **2026-09-30** — Retour : « le logo près de la cam c'est bien, mais le cadre jaune était bien » → le logo est maintenant DANS la plaque dorée sous la cam. Réglage du bandeau renommé avec des noms communs à tous les overlays (`bandeau.follow`, `abonne`, `soutien`, `objectif`, `ceSoir`).
- **2026-09-30** — Demande : changer les couleurs depuis les réglages (ex. thème Halloween, orange à la place du bleu), sur tous les overlays → `config.js › couleurs` + `js/couleurs.js` (commun) ; `reglages.html` › Couleurs : nuanciers et ambiances en un clic (🎃 Halloween, 🎄 Noël, ↺ Couleurs d'origine). Limite : le logo, le chapeau des cams et l'emblème sont des images et gardent leurs couleurs. Vidéos de transition et kit à refaire après un changement de couleurs.
- **2026-09-30** — TUTO mis à jour : section « Les scripts » (installer Node.js et ffmpeg, lancer un script, tableau de tous les scripts dont actualiser-obs.lua).
- **2026-09-30** — Demande : une option `?cam=0` (pas de webcam) → ajoutée (plus de cadre de cam, le chat récupère la place). Puis « cam et tout, on devrait pouvoir le régler depuis les réglages » → `config.js › options` + `js/options.js` (commun) ; `reglages.html` › **Options des scènes** : le coin de la webcam de la scène Jeu (ou « Pas de webcam »), la webcam de Contenu, le chat, le bandeau et le bouffon de chaque scène. Une option écrite dans l'adresse d'une source OBS passe avant.
- **2026-09-30** — Bug signalé : en Cam seule, remettre le chat (et les couleurs) dans les réglages ne marchait pas après actualisation → `js/options.js` ajoutait `?chat=0` à l'adresse, et l'actualisation d'OBS rechargeait cette adresse modifiée. Corrigé : les options ajoutées par les réglages sont notées (`depuisReglages=…`) et retirées au chargement suivant. Couleurs : l'écriture et l'affichage vérifiés (Halloween puis couleurs d'origine) ; pas testé dans OBS.
- **2026-09-30** — Réglages : **« Mes ambiances »** (section Couleurs) — nommer les couleurs affichées puis 💾, gardées dans `config.js › ambiances` (ex. Batman) ; un clic les remet, × les supprime. TUTO §9 mis à jour.
- **2026-09-30** — Standardisé dans les 4 overlays : **heure fixe** du compte à rebours (`demarrage.heure` / `?heure=20:30`, réglages › Démarrage › « … ou heure fixe ») et **étiquettes de placement** (`afficherZones` / `?zones=1`, réglages › Options des scènes). TUTO §2 et §3.1 mis à jour.
- **2026-09-30** — Demande : des sons différents selon l'alerte, pour les reconnaître en jouant → `js/son.js` : un son par alerte (follow, abonnement, réabonnement, abonnement offert, pluie d'abonnements, bits, raid, don, objectif), dans le thème (tableau dans TUTO 6.8). Et ses propres fichiers possibles : dossier `sons/` + `config.js › alertes.sons` ; `reglages.html` › **Sons des alertes** avec ▶ pour écouter (« aucun » = silence). Vérifié dans le navigateur (sons rendus hors ligne, fichier perso joué) ; pas écouté dans OBS.
- **2026-10-01** — Demande : « quand je donne un nouveau dossier, son config est écrasé » → réglages perso séparés : `config.js` = valeurs par défaut (remplacé à chaque mise à jour), `mes-reglages.js` = ce que le streamer change dans reglages.html (jamais livré, gardé lors d'une mise à jour, `.gitignore`). Migration unique : reglages.html › « 📥 Reprendre les réglages d'un ancien config.js ». TUTO §2.1 (« Quand tu reçois une nouvelle version »). Pas testé dans OBS.
- **2026-10-01** — Demandes : « la cam de l'overlay bouge mais pas la source caméra dans OBS », « un script qui place toutes les cams sur toutes les scènes », « Options des scènes trop fouillis », « la cam de Jeu à un X/Y précis, en gardant les préréglages, et voir leurs coordonnées ». → `js/zones.js` (les zones de la webcam, seule source des chiffres) + `Options.cam()` (commun) ; scène Jeu : préréglage, position perso `{ x, y, l, h }` (`?cam=x,y,l,h`) ou pas de webcam. `reglages.html` › Options des scènes refait : un tableau scènes × éléments avec interrupteurs, et un bloc « La webcam de la scène Jeu » (préréglages avec coordonnées, position perso, plan où l'on fait glisser la cam, zones fixes des autres scènes). Script OBS `actualiser-obs.lua` : bouton « Placer les webcams sur toutes les scènes (et les ajouter là où elles manquent) » + replacement automatique quand les réglages changent. Testé hors OBS (faux OBS, 1440p, groupes, carte d'acquisition non touchée) ; **pas testé dans le vrai OBS**.
