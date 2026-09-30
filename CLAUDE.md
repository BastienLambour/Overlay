# Overlays Twitch de la famille — référence

Ce dossier regroupe les overlays Twitch (OBS) faits pour la famille. Toute nouvelle
conversation ouverte ici doit suivre ce document : **même philosophie, même architecture,
mêmes noms**. On parle français avec l'utilisateur, qui n'est pas graphiste : on explique
simplement, et on montre (moodboard, aperçu) plutôt que de décrire.

## Organisation

```
G:\Projets\Overlay\
├── CLAUDE.md            ← ce document
├── .claude/launch.json  ← un serveur d'aperçu par overlay (un port chacun)
├── outils/serveur-apercu.mjs ← serveur d'aperçu SANS CACHE utilisé par launch.json
├── _modele/             ← fichiers COMMUNS, à copier tels quels dans chaque overlay
├── patagrain/           ← médiéval bouffon + JDR (port 5500)
├── johnvongurt/         ← espace / mission control, le frère (port 5501)
├── mordethrhedan/       ← néon + fond cristal à facettes (port 5502)
└── ambries/             ← néon mauve comics/humour, au stade du moodboard (port 5503)
```

- **Un dossier par streamer, nommé d'après son pseudo Twitch** en minuscules (pas d'après le thème).
  Ce nom sert aussi de `id` dans `config.js` et de nom de serveur dans `launch.json`.
- Nouveau projet : nouveau sous-dossier + nouvelle entrée dans `launch.json` (port suivant libre).
- Chaque overlay est **autonome** (on peut copier son dossier sur le PC du streamer).

## Philosophie

1. **Moodboard d'abord** (`design/moodboard.html`) : 2-3 directions (palettes, polices, motifs,
   vocabulaire des alertes, maquettes de scènes), avec boutons pour basculer en direct.
   On ne construit qu'après les choix de l'utilisateur.
2. **Un système de design** : toutes les couleurs, polices, durées dans `css/theme.css`
   (variables CSS). On change une valeur, tout suit.
3. **Tous les textes dans `config.js`**, commentés, éditables sans rien connaître au code.
4. **Tout en français** : textes, noms de fichiers, variables, fonctions, commentaires.
5. **Un univers de marque** : vocabulaire des alertes propre à la chaîne
   (ex. « Adoubement » pour un sub chez Patagrain, « Astronaute certifié » chez John Von Gurt),
   un élément récurrent toujours identique (la même fusée partout, le même logo…).
6. **Léger pour OBS** : animations `transform`/`opacity`, 1920×1080, fond transparent,
   HTML/CSS/JS pur, aucun build, aucun serveur requis (fichiers locaux).
7. **Vérifier avant d'annoncer** : chaque page chargée dans le navigateur sans erreur,
   en mode normal et `?test=1`. Dire clairement ce qui n'a PAS été testé (OBS, vrai Streamer.bot).
8. **Livrer utilisable** : `index.html` (vitrine), `TUTO.pdf` pas à pas, vidéos de transition prêtes,
   kit de chaîne Twitch exporté en PNG.
9. **`CONCEPT.md` tenu à jour au fil de l'eau** : à chaque échange qui apporte une demande, un choix
   ou un changement d'avis, on met à jour le haut du fichier (état actuel) et on ajoute une ligne au
   journal. C'est la mémoire du projet : on le relit en premier quand on reprend un overlay.

## Architecture standard d'un overlay

```
<pseudo>/
├── CONCEPT.md / .pdf   ← résumé vivant de la demande (modèle : _modele/CONCEPT.md)
├── config.js           ← textes et réglages (voir _modele/config.js pour les clés standard)
├── index.html          ← vitrine : liens (tuto, concept, moodboard, kit, réglages) + aperçu de chaque page
├── reglages.html       ← formulaire qui modifie config.js (commun) ; libellés dans js/reglages-champs.js
├── TUTO.md / .pdf      ← tutoriel complet, une fiche OBS par page (modèle : _modele/TUTO.md)
├── chaine/             ← kit de chaîne Twitch : kit.html + elements.js, export/ (PNG)
├── css/  theme.css (variables) · composants.css · [transitions.css]
├── js/   commun.js (objet global `Commun`) · composants.js · chat.js · evenements.js
│         son.js · transition.js · [scenes.js, fond.js…]
├── scenes/     demarrage · pause · fin · cam-seule · contenu · jeu  (+ scènes propres)
├── sources/    alertes · chat · objectif · bandeau · cam            (+ sources propres)
├── transitions/  <nom>.html  +  videos/<nom>.webm (Stinger OBS)
├── outils/generer-transitions.mjs · exporter-chaine.mjs · generer-pdf.mjs · capturer.mjs
├── design/moodboard.html
└── assets/     images, logos, avatar · assets/polices/ (polices locales)
```

Conventions :
- **Scènes** : `demarrage`, `pause`, `fin`, `cam-seule` (cam + chat, « blabla »), `contenu`
  (cam + contenu + chat côte à côte), `jeu` (jeu plein écran, petite cam, chat en transparence).
  Les zones cam/jeu sont des **trous transparents** : OBS place webcam et capture *sous* l'overlay.
  Le TUTO donne les coordonnées exactes (et en 2560×1440 si l'écran du streamer l'est).
- **Objet JS global** : `Commun` (dans `commun.js`) ; un objet par fichier, du nom du fichier
  (`Chat`, `Composants`, `Evenements`, `Son`, `Scenes`).
- **Clés de `config.js`** : `id`, `nomChaine`, `chaineTwitch`, `streamerbot`, `demarrage`,
  `pause`, `fin`, `chat`, `objectif`, `alertes` (`duree`, `son`, `volume`, `anonyme`, `textes`),
  `test.noms`. Les réglages propres au thème s'ajoutent à côté (ex. `couleur`, `fond`).
- **Paramètres d'URL communs** : `?test=1` (faux messages/alertes, ne touche pas au vrai
  compteur), `?apercu=1` (montre les zones cam/jeu), `?reinitialiser` (remet l'objectif à zéro),
  `?minutes=10` (compte à rebours), `?cam=haut-gauche|haut-droite|bas-gauche|bas-droite`.
- Fichiers en UTF-8, fins de ligne LF.

## Pages et documents standard (même plan dans chaque overlay)

- **`index.html` — vitrine** : titre (nom de chaîne), une phrase, une barre de liens
  (`TUTO.pdf` · `CONCEPT.pdf` · moodboard · `chaine/kit.html`), puis `01 Aperçu` : chaque
  écran/scène/source/transition en iframe, mode test. **Pas d'instructions d'installation ici** :
  elles sont toutes dans le tuto. Style du thème, structure identique.
- **Documents à lire en PDF** : les `.md` sont les sources (c'est eux qu'on modifie) ;
  `node outils/generer-pdf.mjs` produit `TUTO.pdf` et `CONCEPT.pdf` (mise en page aux couleurs du
  thème). Les régénérer après chaque modification d'un `.md`. Vérification visuelle :
  `APERCU=<dossier> node outils/generer-pdf.mjs` enregistre une capture PNG de chaque document.
- **`reglages.html` — réglages sans code** (FICHIER COMMUN, avec `js/reglages.js`) : formulaire par écran, aux
  couleurs du thème, aperçu des alertes, qui modifie `config.js` en ne remplaçant QUE les valeurs changées (commentaires
  gardés, réglages inconnus jamais effacés ; refuse le config.js d'un autre overlay). Edge/Chrome : écriture directe
  (`showOpenFilePicker`, fichier retenu dans IndexedDB) ; sinon téléchargement. Propre à l'overlay :
  `js/reglages-champs.js` (libellés, aides, rangement, liens de test ; gabarit dans `_modele/js/`). Tout réglage de
  config.js non décrit apparaît dans « Autres réglages ».
- **`design/moodboard.html`** : barre de réglages en haut (sans `backdrop-filter` : il bloque le
  rendu au-dessus des iframes animées → écran noir), en-tête, puis `01 Couleurs` · `02 Typographies` ·
  `03 <élément signature>` · `04 Motifs & symboles` · `05 Composants` (alertes + tableau du
  vocabulaire, cam, chat, bandeau/objectif) · `06 Transitions` (jouables) · `07 Scènes`.
  Beaucoup d'iframes → ne charger que celles visibles (IntersectionObserver).
- **`TUTO.md`** (modèle `_modele/TUTO.md`) : 1 Contenu du dossier · 2 Avant de commencer
  (config.js, canevas OBS, méthode « ajouter une source Navigateur », méthode Ctrl+E, options
  d'URL) · 3 **Fiches scènes, une par page** · 4 **Fiches sources, une par page** · 5 Fiches
  transitions · 6 Streamer.bot · 7 Chaîne Twitch · 8 Tester · 9 Personnaliser · 10 Dépannage.
  Chaque fiche = à quoi ça sert, **étapes OBS numérotées de A à Z** (créer la scène, chaque source
  dans l'ordre avec fichier, taille, cases à cocher, position Ctrl+E), options, vérification.
  Le streamer doit pouvoir suivre une fiche sans lire le reste.
- **`chaine/` — kit de chaîne Twitch** : `kit.html` (moteur commun `_modele/chaine/`) affiche tous
  les visuels à l'échelle ; `elements.js` (propre à l'overlay) les dessine ; textes dans
  `config.js › chaine`. Formats Twitch : photo de profil 800×800, bannière de profil 1200×480,
  écran hors-ligne 1920×1080, panneaux de bio 320×160, emotes 112/56/28, badges d'abonné 72/36/18.
  `node outils/exporter-chaine.mjs` → PNG transparents dans `chaine/export/`.

## Fichiers communs (`_modele/`)

Copiés **à l'identique** dans chaque overlay ; on ne les personnalise pas sur place.
Si on les améliore, on modifie `_modele/` puis on recopie partout.
- `js/evenements.js` : Streamer.bot (WebSocket local) → événements normalisés
  `{ type, nom, montant, mois, nombre, destinataire }`, objectif persistant (localStorage
  `overlay-<id>-etat`), mode test.
- `outils/generer-transitions.mjs` : capture les pages de `transitions/` avec Edge headless,
  encode en `.webm` transparent avec ffmpeg (60 i/s), affiche le point de transition Stinger.
  `node outils/generer-transitions.mjs [noms…] [cle=valeur…]`.
- `outils/exporter-chaine.mjs` : exporte chaque élément de `chaine/kit.html` en PNG
  (Edge headless, fond transparent, toutes les tailles demandées).
- `outils/generer-pdf.mjs` : `TUTO.md` / `CONCEPT.md` → PDF (Edge headless, sans dépendance).
- `outils/polices-locales.mjs` : Google Fonts de `theme.css` → fichiers dans `assets/polices/` + @font-face locales.
- `outils/capturer.mjs` : capture PNG d'une page, figée à des instants donnés
  (`node outils/capturer.mjs "transitions/x.html?mode=complet" 0 700 1400 --dossier=…`) ;
  signale aussi les erreurs JavaScript. L'outil de vérification visuelle par défaut.
- `chaine/kit.js` + `chaine/kit.css` : moteur de la page kit (galerie, ou un seul élément avec
  `?seul=<id>&taille=<px>` pour l'export).
- `config.js` : gabarit avec toutes les clés standard.
- `reglages.html` + `js/reglages.js` : la page de réglages (identiques partout) ; `js/reglages-champs.js` : gabarit
  des libellés, à adapter dans chaque overlay (un réglage ajouté à config.js → l'ajouter là aussi, dans la bonne section).
- `CONCEPT.md`, `TUTO.md` : gabarits des documents.

Pour `chat.js`, `son.js`, `transition.js`, `commun.js` : partir de la version d'un overlay
existant (le moteur est le même, seul le rendu change). Le chat lit l'IRC Twitch anonyme
(sans mot de passe), masque bots et commandes `!`, gère CLEARMSG/CLEARCHAT.
Il garde en mémoire ses derniers messages entre les scènes (localStorage `overlay-<id>-chat`,
`chat.memoireMinutes`). Les scènes intègrent chat et bandeau ; `?chat=0` / `?bandeau=0` les retirent (dans `Composants`).

## Savoir technique acquis

- **Alertes** : via **Streamer.bot** (gratuit, local). Les noms de champs des événements ne
  sont pas documentés : `evenements.js` essaie plusieurs clés et logue chaque événement en
  console (OBS : clic droit › Interagir › F12). Pas encore validé sur un vrai live.
- **Transitions** : une page HTML ne peut pas être une transition OBS → vidéo **Stinger**.
  Chaque page de transition gère `?mode=entree` (défaut) et `?mode=complet&capture=1`, et peut
  déclarer son point de coupe (`data-coupe` / `pointTransition()`).
- **Navigateur des outils** : Edge par défaut ; `NAVIGATEUR=<chemin de chrome/chromium>` pour en utiliser un autre
  (ex. dans un conteneur Linux, avec un petit script qui ajoute `--no-sandbox`).
- **ffmpeg** : `G:\Applications\ffmpeg\bin\ffmpeg.exe` (hors PATH, trouvé par le script).
- **OBS** : source Navigateur 1920×1080, cocher « Actualiser le navigateur quand la scène
  devient active » pour les écrans animés. Webcam : Ctrl+E, zone de délimitation
  « Mettre à l'échelle à l'extérieur » + « Rogner ».
- **Aperçu** : `preview_start` avec le nom de l'overlay (`outils/serveur-apercu.mjs`, sans cache) ;
  l'aperçu en `file://` ne charge pas les fichiers voisins. Un serveur avec cache (ex. `python -m
  http.server`) ressert d'anciens SVG/JS après modification : c'est pour ça qu'on ne l'utilise plus.
  Côté streamer : Ctrl+F5 dans le navigateur, et dans OBS › Propriétés de la source ›
  « Actualiser le cache de la page actuelle » (entrée prévue dans TUTO §10).
- **Outils** : tout en Node (`.mjs`), sans dépendance, pilotant Edge headless si besoin. Pas de
  Python. Un fichier généré (ex. `js/bouffon.js` de Patagrain) le dit en en-tête et a son
  générateur dans `outils/`.
- **SVG animés (mascottes, personnages articulés)** :
  - un `<svg>` inline coupe tout ce qui sort de son viewBox (bras levé, épée) → `style="overflow:visible"` ;
  - articulations : `transform-box: view-box` sur les groupes et pivots `transform-origin` en px
    d'unités du dessin ; attention aux règles plus spécifiques qui remettent `fill-box` ;
  - une animation CSS sur un `<g>` qui a déjà un attribut `transform` l'écrase → envelopper dans
    un `<g>` parent ;
  - dans les transitions, `#ecran * { position:absolute }` casse un `<svg>` inline → ajouter
    `#ecran .bouffon-svg { position:static; width:100%; height:100% }` (ou équivalent).
- Polices : **toujours locales** dans `assets/polices/` (OBS hors ligne, PDF, kit). On choisit sur Google Fonts dans le
  moodboard, puis `node outils/polices-locales.mjs` télécharge les .woff2 (latin + latin étendu) et remplace l'@import
  de `theme.css` par des @font-face locales. Police non libre (ex. Dyer) : fichier déposé à la main + police de secours.

## Démarrer un nouvel overlay (checklist)

1. Recueillir : pseudo + identifiant Twitch, logo/couleurs, ce qui est streamé, inspirations,
   liste des scènes voulues, écran du streamer (1080p/1440p), outil d'alertes.
2. Créer `<pseudo>/` + entrée `launch.json` + **`CONCEPT.md`** (dès la première demande),
   puis le **moodboard** ; attendre les choix.
3. Construire : `theme.css`, `config.js` + `js/reglages-champs.js` (depuis `_modele/`), copier les fichiers communs,
   scènes, sources, transitions, `index.html`, `TUTO.md`, kit `chaine/`.
4. Vérifier chaque page (normal + `?test=1`), générer les vidéos de transition et les PNG du kit.
5. Récapituler : ce qui est fait, ce qui n'est pas testé, ce qu'il reste à faire au streamer.
   Mettre `CONCEPT.md` à jour à chaque étape.
- Vérification visuelle : si les captures du panneau navigateur échouent (panneau masqué), utiliser
  `node outils/capturer.mjs <page> [instants…]` et lire le PNG.
