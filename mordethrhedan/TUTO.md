# 🟢 Mordethrhedan — Tutoriel d'installation

Ce tutoriel installe l'overlay dans **OBS Studio**, de zéro jusqu'au premier live, puis habille ta **chaîne Twitch**.
Chaque page a sa **fiche** : tu peux suivre une fiche seule, sans lire le reste.

> 💡 Pour tout voir en direct : ouvre `index.html` dans ton navigateur (et `design/moodboard.html` pour essayer les couleurs). La version à lire confortablement de ce tutoriel est `TUTO.pdf`.

---

## Sommaire

1. Ce qu'il y a dans le dossier
2. Avant de commencer (config, police Dyer, réglages OBS, les 3 gestes de base)
3. Les scènes, fiche par fiche : Démarrage · Pause · Fin · Cam seule · Contenu · Jeu · Speedrun
4. Les sources à la carte : Alertes · Chat · Objectif · Cadre néon · Compte à rebours · Fond · Cadre de la cam
5. Les transitions : Balayage · Volets
6. Brancher le chat et les alertes (Streamer.bot, journal, objectif, sons des alertes)
7. Habiller la chaîne Twitch
8. Tester sans être en live
9. Personnaliser (couleur selon le jeu…)
10. Dépannage

---

## 1. Ce qu'il y a dans le dossier

```
mordethrhedan/
├── reglages.html       ← LA page pour changer les textes et réglages (elle modifie config.js)
├── config.js            ← LE fichier à modifier (pseudo, couleur, textes…)
├── index.html           ← aperçu de tout
├── TUTO.md / TUTO.pdf   ← ce tutoriel
├── CONCEPT.md / .pdf    ← le résumé du projet (DA, choix, ce qu'il reste à faire)
├── scenes/              ← les overlays de scène (une page = une scène OBS)
├── sources/             ← les éléments à poser où tu veux (alertes, chat, cadre…)
├── sons/                ← tes propres sons d'alerte, si tu veux (facultatif, voir 6.8)
├── transitions/         ← les transitions (+ videos/ : prêtes pour OBS)
├── chaine/              ← kit de chaîne Twitch (kit.html + export/ : les PNG)
├── assets/polices/      ← les polices (locales, sans internet) · dépose ici la police Dyer
├── outils/              ← les scripts (vidéos, images du kit, PDF) et actualiser-obs.lua pour OBS : voir 9
├── design/moodboard.html
└── css/  js/            ← le moteur (pas besoin d'y toucher)
```

Toutes les pages font **1920 × 1080**. Le fond à facettes est **découpé** là où ta webcam, ton jeu ou ton image doivent apparaître.

---

## 2. Avant de commencer

### 2.1 Remplir les réglages avec `reglages.html`

1. Dans le dossier de l'overlay, double-clique sur **`reglages.html`** : la page s'ouvre dans ton navigateur (**Edge** ou **Chrome**).
2. Vérifie au minimum, dans **La chaîne** : le **nom affiché** et ton **identifiant Twitch** (celui de l'adresse `twitch.tv/…`) ; dans **Couleur et fond**, la couleur des cadres.
3. Dans **Objectif** : mets ton nombre **actuel** de followers dans **Ton nombre ACTUEL**.
4. Clique **💾 Enregistrer config.js** (en bas, ou **Ctrl + S**).
5. **La première fois**, une fenêtre s'ouvre : va dans le dossier de l'overlay, clique sur **`config.js`**, puis **Ouvrir**. Le navigateur demande s'il peut modifier le fichier : clique **Modifier le fichier** (ou **Autoriser**).
   La page **remplace alors elle-même** `config.js` : rien à copier à la main. Les fois suivantes, elle s'en souvient et enregistre directement (au plus, le navigateur redemande l'autorisation).
6. Dans OBS : **clic droit sur la source › Actualiser** pour voir le changement.

Un **point** • à côté d'un réglage veut dire qu'il a changé et n'est pas encore enregistré. La section **Alertes** montre un aperçu de chaque alerte avec tes textes, et la section **Tester** ouvre les pages en mode test.
La page ne change **que** les réglages modifiés : les commentaires et tout le reste de `config.js` restent tels quels.

> ℹ️ Avec **Firefox**, la page ne peut pas modifier un fichier : elle **télécharge** un nouveau `config.js` (sans les commentaires), à mettre à la place de l'ancien. Préfère Edge ou Chrome.

**À la main (sans la page)** : ouvre `config.js` avec le **Bloc-notes** (clic droit › *Ouvrir avec* › *Bloc-notes*). Garde les guillemets `"…"` autour des textes et la virgule `,` en fin de ligne, enregistre, puis **Actualiser** dans OBS.

### 2.2 Installer la police Dyer

Dépose le fichier de la police de *Beyond Good & Evil* dans `assets/polices/`, nommé **`Dyer.ttf`** (ou `Dyer.otf` / `Dyer.woff2`). Tous les titres l'utiliseront. En attendant, « Righteous » la remplace.

### 2.3 Régler le canevas d'OBS (une seule fois)

**Paramètres › Vidéo** : résolution de base `1920 × 1080`, résolution de sortie `1920 × 1080`.

### 2.4 Geste A — ajouter une source Navigateur

1. Sélectionne la scène, puis dans **Sources** : **+** › **Navigateur**.
2. Donne un nom à la source, puis **OK**.
3. Coche **Fichier local**, **Parcourir**, choisis le fichier `.html` indiqué dans la fiche.
4. **Largeur : `1920`**, **Hauteur : `1080`**.
5. Coche les cases indiquées dans la fiche.
6. **OK**.

### 2.5 Geste B — placer une source au pixel près

1. Clique sur la source (webcam, jeu, image, widget), puis **Ctrl + E**.
2. **Position** : x et y de la fiche.
3. **Type de zone de délimitation** : *Mettre à l'échelle à l'extérieur de la zone*.
4. **Taille de la zone de délimitation** : largeur et hauteur de la fiche.
5. Coche **Rogner à la zone de délimitation**, puis **Fermer**.

> 💡 **Voir les chiffres directement dans OBS** : `reglages.html` › **Options des scènes** › coche **Afficher la taille et la position des zones**, puis **Enregistrer** et actualise. Chaque zone (webcam, contenu, jeu) affiche sa taille et sa position : tu les recopies dans Ctrl + E. Décoche ensuite. (Ou, pour une seule source : `?zones=1` dans l'adresse, geste C.)

### 2.6 Geste C — ajouter une option dans l'adresse

1. Dans la source Navigateur, **décoche** *Fichier local*.
2. Colle l'adresse complète dans **URL**, avec les options après un `?` :

```
file:///G:/Projets/Overlay/mordethrhedan/scenes/jeu.html?cam=bas-droite&couleur=rouge
```

**Plus simple, et pour de bon : `reglages.html` › Options des scènes.** Le coin de la webcam de la scène Jeu (ou « Pas de webcam ») et le chat de chaque écran s'y règlent une fois pour toutes, sans toucher aux adresses dans OBS. Une option écrite dans l'adresse d'une source passe **avant** ce réglage (pratique pour une source particulière).

### 2.7 Astuce — une seule source d'alertes pour toutes les scènes

1. **Scènes › +** : crée une scène **« Global — Alertes »** et ajoutes-y `sources/alertes.html` (fiche 4.1).
2. Dans chaque autre scène : **Sources › + › Scène** › « Global — Alertes », tout **en haut** de la liste.

> 🔑 **Règle d'or** : dans OBS, ce qui est **en haut** de la liste s'affiche **par-dessus**. L'overlay est **au-dessus** de la webcam, du jeu, de la manette et de LiveSplit (il les encadre et arrondit leurs coins) ; le **fond** est tout en bas. Ton widget de succès, lui, se met au-dessus de l'overlay.

### 2.8 Le chat : déjà dans les scènes

Les scènes Démarrage, Pause, Fin, Cam seule et Contenu contiennent **déjà** leur chat : **tu n'as rien à ajouter.** En Speedrun, il est coupé par défaut pour laisser voir LiveSplit (voir 3.7 pour l'afficher d'un clic).
La source séparée `sources/chat.html` sert seulement pour une scène à toi, ou pour placer le chat autrement : dans ce cas, ajoute `?chat=0` à l'adresse de la scène pour retirer celui qui est intégré, puis ajoute la source séparée.

Quand tu changes de scène, le chat **réaffiche les derniers messages** (ceux des 10 dernières minutes, réglable dans `reglages.html` › **Le chat**) : il ne repart pas à vide.

### 2.9 Actualiser toutes les sources d'un coup (après un changement de réglages)

OBS n'a pas de bouton pour actualiser toutes les sources Navigateur : l'overlay en fournit un, sous forme de petit script OBS.

1. OBS › **Outils › Scripts** › onglet **Scripts** › **+** › choisis `outils/actualiser-obs.lua` (dans le dossier `mordethrhedan`).
2. À droite : le bouton **Actualiser toutes les sources Navigateur**, et la case **Actualiser tout seul les sources de l'overlay quand config.js change** (cochée) : après **Enregistrer** dans `reglages.html`, les sources se mettent à jour en 2 secondes.
3. **Fermer** : le script reste installé. Raccourci clavier possible : **Paramètres › Raccourcis clavier** › « Actualiser toutes les sources Navigateur ».

> ⚠️ Une page actualisée repart de zéro (un compte à rebours recommence).

---

## 3. Les scènes, fiche par fiche

Trois dispositions, toutes avec le **même fond** qui se voit là où tu n'as mis aucune source :

| Disposition | Pages | En bref |
|---|---|---|
| **Grande** | Démarrage · Pause · Fin · Cam seule | pseudo en haut, grand cadre, ligne des **derniers événements** en bas, chat à droite |
| **Petite** | Contenu · Speedrun | manette ou cam en haut à gauche, LiveSplit (ou chat) en bas à gauche, pseudo + grand cadre + derniers à droite |
| **Jeu** | Jeu | jeu plein écran, cadre au ras des bords, pseudo dans un petit encadré ; **le cadre de la cam est une source à part** |

> 💎 **Le fond, tout en bas de chaque scène** : ajoute `sources/fond.html` en **dernière** position (geste A). Il est **synchronisé** avec celui de l'overlay (même motif, mêmes éclats au même instant) : là où tu ne mets pas de source, on voit le fond, parfaitement raccord.

> 🏷️ **La ligne des derniers événements** (dernier follow, dernier sub, dernier raid, série de visionnage) se remplit toute seule : voir **6.1 bis**.

### 3.1 ⏳ Démarrage — `scenes/demarrage.html` (disposition Grande)

**À quoi ça sert** : « Ça commence bientôt » et le compte à rebours dans le grand cadre (« C'est parti ! » à zéro), posés sur ta source (image, cam…).

**Dans OBS :**
1. **Scènes › +** : « Démarrage ».
2. **+ › Scène** › « Global — Alertes » (si tu utilises les alertes de l'overlay ; avec Streamlabs, mets plutôt ta source d'alertes Streamlabs).
3. Geste A avec `scenes/demarrage.html`, case **Actualiser le navigateur quand la scène devient active** cochée.
4. **+ › Image** (ou ta webcam) › « Ta source ». Geste B : position `45`, `130` · taille `1380` × `776`.
5. Geste A avec `sources/fond.html` › « Fond ».
6. Ordre final : `Alertes` · `Overlay` · `Ta source` · `Fond`.

**Changer le texte** : `reglages.html` › **Écrans avec un grand titre** (ou `?message=Je%20arrive` dans l'adresse).
**Options** : `?minutes=5` (10 min par défaut) · `?heure=20:30` (heure fixe : le compteur arrive à zéro à 20 h 30 ; aussi dans `reglages.html` › **… ou heure fixe**, prioritaire sur les minutes) · `?chat=0` · `?derniers=0` · `?couleur=rouge`

### 3.2 ☕ Pause — `scenes/pause.html` (disposition Grande)

**À quoi ça sert** : « Petite pause en cours » dans le grand cadre, posé sur ta source.

**Dans OBS :** comme le Démarrage (étapes 1 à 6) avec `scenes/pause.html` ; ta source en `45`, `130` · `1380` × `776`.
**Changer le texte** : `reglages.html` › **Écrans avec un grand titre** › Pause.

### 3.3 👋 Fin — `scenes/fin.html` (disposition Grande)

**À quoi ça sert** : « Merci d'être passés ! » dans le grand cadre.

**Dans OBS :** comme le Démarrage avec `scenes/fin.html` ; ta source en `45`, `130` · `1380` × `776`.

### 3.4 🎙 Cam seule — `scenes/cam-seule.html` (disposition Grande, sans message)

**À quoi ça sert** : le « blabla » : ta webcam (ou n'importe quel contenu) dans le grand cadre, le chat à droite.

**Dans OBS :**
1. **Scènes › +** : « Cam seule ».
2. Tes alertes en haut (voir 3.1, étape 2).
3. Geste A avec `scenes/cam-seule.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam » (ou une capture de fenêtre). Geste B : position `45`, `130` · taille `1380` × `776`.
5. Geste A avec `sources/fond.html` › « Fond ».
6. Ordre final : `Alertes` · `Overlay` · `Webcam` · `Fond`.

### 3.5 🖥 Contenu — `scenes/contenu.html` (disposition Petite)

**À quoi ça sert** : une fenêtre ou un jeu dans le grand cadre, ta webcam (ou ta manette) en haut à gauche, le chat en bas à gauche.

**Dans OBS :**
1. **Scènes › +** : « Contenu ».
2. Tes alertes en haut.
3. Geste A avec `scenes/contenu.html`.
4. Ajoute tes sources, puis geste B pour chacune :

| Source | Position (x, y) | Taille (l × h) |
|---|---|---|
| Fenêtre / jeu | `460`, `128` | `1415` × `796` |
| Webcam ou manette (en haut à gauche) | `45`, `45` | `380` × `285` |

5. Geste A avec `sources/fond.html` › « Fond ».
6. Ordre final : `Alertes` · `Overlay` · `Webcam` · `Fenêtre` · `Fond`.

**Le chat** : en bas à gauche par défaut. Pour mettre autre chose à sa place : `reglages.html` › **Options des scènes** › « Contenu : le chat » décoché (la case devient un trou, comme pour LiveSplit en 3.7).

### 3.6 🎮 Jeu — `scenes/jeu.html` + `sources/cam.html`

**À quoi ça sert** : le jeu en plein écran, un cadre au ras des bords (ses coins arrondis sont bouchés par le fond, raccord avec le reste), ton pseudo dans un petit encadré posé sur le cadre, et ta cam dans un coin.
**Le cadre de la cam et ton pseudo sont une source à part** (`sources/cam.html`) : tu la mets dans un **groupe** avec ta webcam (et ton compteur de morts, etc.) pour tout masquer d'un seul raccourci pendant une cinématique : cam, cadre et pseudo disparaissent ensemble.

**Dans OBS :**
1. **Scènes › +** : « Jeu ».
2. Tes alertes en haut.
3. **Le groupe de la cam** :
   1. Geste A avec `sources/cam.html` › « Cadre cam ».
   2. **+ › Périphérique de capture vidéo** › « Webcam ». Geste B : taille `320` × `300`, position selon le coin (tableau ci-dessous).
   3. Ajoute tes autres widgets à masquer en même temps (compteur de morts…).
   4. Sélectionne-les tous (Ctrl + clic), **clic droit › Grouper la sélection**, nomme le groupe « Cam ». Dans le groupe, `Cadre cam` doit être **au-dessus** de `Webcam`.
4. Geste A avec `scenes/jeu.html` › « Overlay ».
5. **+ › Capture de jeu** › « Jeu ». Geste B : `0`, `0` · `1920` × `1080`.
6. Geste A avec `sources/fond.html` › « Fond ».
7. Ordre final : `Alertes` · `Cam` (le groupe) · `Overlay` · `Jeu` · `Fond`.
8. **Le raccourci** : **Paramètres › Raccourcis clavier**, cherche « Cam » : règle une touche pour **Afficher « Cam »** et une pour **Masquer « Cam »** (ou la même pour les deux). La cam, son cadre, ton pseudo et tes widgets disparaissent ensemble.

**Changer de coin** : `reglages.html` › **Options des scènes** › « Jeu : la webcam ». Le cadre de la cam **et** le pseudo suivent (pseudo au-dessus quand la cam est en haut, en dessous quand elle est en bas). Déplace ensuite ta webcam :

| Coin | Position de la webcam (x, y) |
|---|---|
| `haut-gauche` *(défaut)* | `56`, `56` |
| `haut-droite` | `1544`, `56` |
| `bas-gauche` | `56`, `724` |
| `bas-droite` | `1544`, `724` |

> ⚠️ Si tu écris le coin dans l'adresse (`?cam=bas-droite`) au lieu des réglages, mets **le même** sur `scenes/jeu.html` et sur `sources/cam.html`.

**Options** : `?cam=0` sur `scenes/jeu.html` (pas de webcam : pas de groupe, le pseudo est alors affiché par l'overlay, en haut à gauche) · cadre sans le pseudo : `reglages.html` › **Options des scènes** › « Jeu : ton pseudo sur le cadre de la cam » décoché (ou `?pseudo=0` sur `sources/cam.html`) · `?couleur=rouge`

### 3.7 ⏱ Speedrun — `scenes/speedrun.html` (disposition Petite)

**À quoi ça sert** : comme le Contenu, pour le speedrun : ta manette (ou ta cam) en haut à gauche, **LiveSplit** en bas à gauche, le jeu dans le grand cadre.

**Dans OBS :**
1. **Scènes › +** : « Speedrun ».
2. Tes alertes en haut.
3. Geste A avec `scenes/speedrun.html` › « Overlay ».
4. Ajoute tes sources, puis geste B pour chacune :

| Source | Position (x, y) | Taille (l × h) |
|---|---|---|
| Jeu | `460`, `128` | `1415` × `796` |
| Manette ou webcam | `45`, `45` | `380` × `285` |
| LiveSplit | `45`, `360` | `380` × `675` |

5. Geste A avec `sources/fond.html` › « Fond ».
6. Ordre final : `Alertes` · `Overlay` · `Manette` · `LiveSplit` · `Jeu` · `Fond`.

**Le chat à la place de LiveSplit, d'un clic** : ajoute `sources/chat.html` **au-dessus** de l'overlay, avec l'adresse `…/sources/chat.html?place=petite` (geste C). Il se pose pile dans la case du bas : l'**œil** d'OBS (ou un raccourci, comme en 3.6 étape 8) l'affiche par-dessus LiveSplit ou le cache.
Pour l'avoir toujours : `reglages.html` › **Options des scènes** › « Speedrun : le chat ».

---

## 4. Les sources à la carte

À poser **en plus**, dans n'importe quelle scène. Position et taille avec `?x=&y=&l=&h=` (pixels 1920 × 1080).

### 4.1 🔔 Alertes — `sources/alertes.html`

**À quoi ça sert** : follows, abonnements, bits, raids et dons, avec un carillon doux (les gros événements font pulser le halo).

**Dans OBS :**
1. Dans la scène « Global — Alertes » (voir 2.7) : geste A avec `sources/alertes.html`.
2. Coche **Contrôler l'audio via OBS** et règle le volume dans le mélangeur audio.

**Options** : `?position=haut` (défaut), `centre` ou `bas` · `?test=1`
**Nécessite** Streamer.bot (section 6).

### 4.2 💬 Chat — `sources/chat.html`

**À quoi ça sert** : le chat seul, en cartes, dans son cadre « verre ».
**Options** : `?x=40&y=75&l=430&h=930` · `?nu=1` (sans cadre) · `?disparition=60` · `?test=1`

### 4.3 📊 Objectif — `sources/objectif.html`

**À quoi ça sert** : la barre d'objectif (followers ou abonnés, selon `config.js`).
**Options** : `?x=560&y=960&l=800&h=100` · `?test=1`

### 4.4 ▢ Cadre néon — `sources/cadre.html`

**À quoi ça sert** : un cadre néon seul pour encadrer n'importe quoi (widget, image…). La zone donnée est l'**intérieur** du cadre.

**Dans OBS :**
1. Place ton widget et note sa position et sa taille (Ctrl + E).
2. Geste A avec `sources/cadre.html`, puis geste C avec ces chiffres : `?x=40&y=40&l=380&h=290`.

**Options** : `?verre=1` (intérieur fumé) · `?apercu=1`

### 4.5 ⏲ Compte à rebours — `sources/compte-a-rebours.html`

**À quoi ça sert** : un compte à rebours seul, en police néon, à poser où tu veux.
**Dans OBS :** geste A, case **Actualiser le navigateur quand la scène devient active** cochée, puis geste C.
**Options** : `?minutes=10&x=0&y=0&l=1920&h=1080&taille=260`

### 4.6 💎 Fond — `sources/fond.html`

**À quoi ça sert** : le fond à facettes seul, **tout en bas de chaque scène** (fiches 3.x) : il se voit là où il n'y a pas de source. Il est synchronisé avec le fond des overlays (même motif, même respiration au même instant).
**Options** : `?couleur=rouge` · `?graine=12` (autre motif) · `?fixe` (sans animation). Si tu mets une option sur l'overlay d'une scène, mets la même sur son fond.

### 4.7 🎥 Cadre de la cam — `sources/cam.html`

**À quoi ça sert** : le cadre néon de la webcam de la scène Jeu **et ton pseudo** (dans son petit encadré sur le grand cadre), en source séparée, pour les mettre dans un **groupe** avec la webcam et les masquer d'un raccourci (fiche 3.6). Ses coins sont bouchés : la webcam, rectangulaire, ne dépasse pas du cadre arrondi.
**Options** : `?cam=bas-droite` (même coin que la scène Jeu ; par défaut celui des réglages) · `?x=56&y=56&l=320&h=300` (taille libre) · `?pseudo=0` (sans le pseudo) · `?apercu=1`

---

## 5. Les transitions

Les vidéos sont **déjà prêtes** dans `transitions/videos/` (fond transparent). Pour chacune :

1. Panneau **Transitions de scène** › **+** › **Stinger**, donne-lui un nom.
2. **Fichier vidéo** : `transitions/videos/balayage.webm` ou `volets.webm`.
3. **Type de point de transition** : *Temps (millisecondes)* ; **Point de transition** : `800 ms`.
4. **OK**.

**Une transition par scène** : clic droit sur la scène › **Remplacer la transition**.

**Transitions dans une autre couleur**, dans PowerShell :

```
cd G:\Projets\Overlay\mordethrhedan
node outils/generer-transitions.mjs couleur=rouge
```

Crée `balayage-rouge.webm` et `volets-rouge.webm`.

---

## 6. Brancher le chat et les alertes

Deux choses différentes :

| Quoi | Comment ça arrive | À installer |
|---|---|---|
| **Le chat** | l'overlay lit ton chat Twitch directement | **rien** : ton identifiant Twitch dans les réglages suffit |
| Les alertes et l'objectif (follows, abonnements, bits, raids, dons) | par **Streamer.bot**, un logiciel gratuit qui tourne sur ton PC | Streamer.bot, une fois (6.2) |

> 🔔 **Tu utilises les alertes de Streamlabs ?** Alors tu n'as **pas besoin** de Streamer.bot ni de `sources/alertes.html` : garde ta source d'alertes Streamlabs en haut de chaque scène. Seule la clé de 6.1 bis est utile (pour le dernier follow).

### 6.1 Le chat

1. `reglages.html` › **La chaîne** › **Identifiant Twitch** : celui de ton adresse `twitch.tv/…`. Enregistre.
2. C'est tout : dans les scènes, le chat s'affiche dès qu'un message arrive.

Les **emotes Twitch** s'affichent en image ; les **bots** (liste dans `reglages.html` › **Le chat**) et les **commandes** qui commencent par `!` sont cachés ; un message **supprimé par un modo**, ou ceux d'un spectateur **banni**, disparaissent aussi de l'overlay ; en changeant de scène, les messages des 10 dernières minutes sont réaffichés.
Il ne montre pas les messages envoyés **avant** l'ouverture d'OBS, ni les emotes des extensions 7TV, BTTV ou FFZ.

### 6.1 bis La ligne des derniers événements

| Case | D'où ça vient | À régler |
|---|---|---|
| Dernier sub | annonces du chat Twitch (abonnement, réabonnement, cadeau) | **rien** |
| Dernier raid (pseudo · nombre de viewers) | annonces du chat Twitch | **rien** |
| Série de visionnage (pseudo · nombre de streams d'affilée) | annonces du chat Twitch, quand un spectateur partage sa série | **rien** |
| Dernier follow | **Streamlabs** (un follow ne passe pas dans le chat) | ta clé Streamlabs, une fois |

**La clé Streamlabs** :
1. Sur **streamlabs.com**, connecte-toi, puis **Paramètres** (roue dentée) › **API Settings** › onglet **API Tokens**.
2. Copie **Your Socket API Token** (bouton *Copy*).
3. `reglages.html` › **Derniers événements** › **Clé Streamlabs** : colle-la, **Enregistrer**.

> 🔒 C'est une clé **privée** : ne l'affiche pas en live, et ne partage pas `config.js` une fois rempli.

Les cases se souviennent de leur valeur d'un live à l'autre, et toutes les scènes affichent la même chose. Les titres des cases se changent dans `reglages.html` › **Derniers événements**. Pour enlever la ligne sur une scène : `?derniers=0`.

> ⚠️ **Pas encore vérifié sur un vrai live** (les annonces Twitch et Streamlabs n'ont été testées qu'en simulation, `?test=1`).

### 6.2 Installer Streamer.bot (une seule fois)

1. Va sur le site officiel **streamer.bot**, télécharge la dernière version (un fichier `.zip`).
2. Décompresse-le dans un dossier à toi (ex. `C:\Streamer.bot\`), puis lance **`Streamer.bot.exe`**.
3. **Connecter ta chaîne** : onglet **Platforms › Twitch › Accounts**. Dans la partie **Broadcaster** (ton compte de streamer), clique **Connect**, connecte-toi à Twitch dans la fenêtre qui s'ouvre, puis **Autoriser**. *(La partie « Bot » est facultative.)*
4. **Ouvrir la porte à l'overlay** : onglet **Servers/Clients › WebSocket Server** : **Address** `127.0.0.1` · **Port** `8080` · **Endpoint** `/` · coche **Auto Start** · clique **Start Server**.
5. Dans OBS, **clic droit sur la source d'alertes › Actualiser**.

✅ **À chaque live**, Streamer.bot doit être **lancé**. Avant ou après OBS, peu importe : l'overlay s'y reconnecte tout seul dès qu'il est là.

> Si tu as changé le port ou mis un mot de passe dans Streamer.bot, reporte-les dans `reglages.html` › **Streamer.bot**.

### 6.3 Vérifier que l'overlay est bien branché

OBS n'a pas de console (F12) : l'overlay a donc son propre **journal**, affiché directement dans la source.

1. Dans OBS, double-clic sur la source d'alertes (dans la scène « Global — Alertes »).
2. Décoche **Fichier local** et colle dans **URL** l'adresse de la page suivie de `?journal=1` (geste C) :
   `file:///G:/Projets/Overlay/mordethrhedan/sources/alertes.html?journal=1`
3. **OK** : un panneau sombre apparaît en haut à gauche. Tu dois y lire **✅ Connecté à Streamer.bot**.
   - « ⚠️ Déconnecté de Streamer.bot » : Streamer.bot n'est pas lancé, ou son serveur WebSocket n'est pas démarré (6.2).
   - « ⚠️ Streamer.bot désactivé » : coche « Se connecter à Streamer.bot » dans `reglages.html`.
4. Chaque événement reçu s'y ajoute (ex. `Twitch.Follow → follow · Pseudo`), avec **les données brutes** reçues en dessous.
5. Une fois vérifié, **retire `?journal=1`** de l'adresse (sinon le panneau reste à l'écran pendant le live).

### 6.4 Événement par événement

Une fois Streamer.bot branché, **rien à régler par événement** : l'overlay les écoute tous. Les textes se changent dans `reglages.html` › **Alertes** (avec un aperçu).

| Événement Twitch | Alerte |
|---|---|
| Follow | **Nouveau follow** — rejoint l'aventure |
| Abonnement | **Nouvel abonné** — s'abonne à la chaîne |
| Réabonnement | **Réabonnement** — est abonné depuis X mois |
| Abonnement offert | **Abonnement offert** — offre un abonnement à… |
| Pluie d'abonnements | **Pluie d'abonnements !** *(le halo pulse)* |
| Bits | **Bits !** — envoie X bits |
| Raid | **Raid !** *(le halo pulse)* |
| Don | **Merci pour le don !** — offre X |
| Objectif atteint | **Objectif atteint !** *(le halo pulse)* |

Abonnements, abonnements offerts et bits demandent une chaîne **affiliée** ou **partenaire**. Les alertes passent **une par une** (file d'attente) : rien n'est perdu pendant un raid.

### 6.5 Les dons (facultatif)

Twitch ne gère pas les dons en argent : ils passent par un service (StreamElements, Streamlabs, Ko-fi, Tipeee). Dans Streamer.bot, onglet **Integrations**, choisis ton service et suis ses indications (en général, coller une **clé** copiée depuis le tableau de bord du service, puis **Connect**).

### 6.6 L'objectif

`reglages.html` › **Objectif** : ce qu'on compte (**les follows** ou **les abonnements**), le nom, la cible et **ton nombre ACTUEL**. Le compteur avance à chaque follow (ou abonnement, une pluie d'abonnements comptant pour tous ses cadeaux) reçu **pendant que OBS est ouvert**, et s'en souvient d'un live à l'autre. De temps en temps, remets ton vrai nombre dans « Ton nombre ACTUEL ».

### 6.7 Tester les vraies alertes

- **Sans Twitch** : `?test=1` sur une page (fausses alertes toutes les 9 secondes, sans toucher au vrai compteur), ou `reglages.html` › **Tester**.
- **Pour de vrai** : demande à un ami (ou à un deuxième compte) de suivre la chaîne, OBS et Streamer.bot ouverts.

> ⚠️ **Pas encore vérifié sur un vrai live** : si une alerte montre « Quelqu'un » ou « ? », fais une capture d'écran du journal (6.3) pour faire corriger l'overlay.
---

### 6.8 Les sons des alertes

Chaque alerte a **son propre son**, pour savoir ce qui se passe à l'oreille, même en pleine partie :

| Alerte | Le son |
|---|---|
| Follow | deux notes de carillon |
| Abonnement | trois notes qui montent |
| Réabonnement | quatre notes en zigzag |
| Abonnement offert | trois notes aiguës rapides |
| Pluie d'abonnements | une cascade de huit notes |
| Bits | deux petits « tling » cristallins |
| Raid | une basse qui monte puis quatre notes |
| Don | un accord doux et long |
| Objectif atteint | quatre notes et un grand accord |

**Les écouter** : `reglages.html` › **Sons des alertes**, bouton ▶ à côté de chaque alerte.

**Mettre ton propre son** (un mp3, wav ou ogg, court de préférence) :

1. Copie ton fichier dans le dossier `sons/` de l'overlay, par exemple `sons/follow.mp3`.
2. `reglages.html` › **Sons des alertes** : dans la case de l'alerte, écris `sons/follow.mp3`. Clique ▶ pour vérifier.
3. **Enregistrer**, puis dans OBS : clic droit sur la source des alertes › **Actualiser**.

Écris `aucun` dans une case pour que cette alerte reste silencieuse ; vide la case pour revenir au son de l'overlay.
Le volume général et le bouton « son » sont dans `reglages.html` › **Alertes** ; dans OBS, le volume se règle aussi dans le mélangeur audio (case **Contrôler l'audio via OBS** de la source des alertes).

## 7. Habiller la chaîne Twitch

Tous les visuels sont dans `chaine/` : ouvre `chaine/kit.html` pour les voir. Les images prêtes à envoyer sont dans `chaine/export/`. Ils prennent la même couleur que l'overlay.

| Visuel | Fichier | Où l'envoyer sur Twitch |
|---|---|---|
| Photo de profil | `profil.png` (800 × 800) | Tableau de bord des créateurs › Paramètres › Chaîne › **Marque** › Photo de profil |
| Bannière de profil | `banniere.png` (1200 × 480) | … › **Marque** › Bannière de profil |
| Écran hors-ligne | `hors-ligne.png` (1920 × 1080) | … › **Marque** › Bannière du lecteur vidéo |
| Panneaux de bio | `panneau-a-propos.png`, `panneau-planning.png`, `panneau-regles.png`, `panneau-materiel.png`, `panneau-soutenir.png` (320 × 160) | Ta chaîne › onglet **À propos** › **Modifier les panneaux** › **+** |
| Emotes | `emote-gg`, `pb`, `reset`, `gold`, `coeur`, `manette` (-112, -56, -28) | Tableau de bord › **Récompenses des spectateurs** › Emotes *(affilié ou partenaire)* |
| Badges d'abonné | `badge-mois-1`, `-3`, `-6`, `-9`, `-12` (-72, -36, -18) | Tableau de bord › **Récompenses des spectateurs** › Badges d'abonné |

**Les panneaux, pas à pas :**
1. Va sur ta chaîne, onglet **À propos**, active **Modifier les panneaux**.
2. **+** › **Ajouter un panneau texte ou image**.
3. **Image** : choisis le PNG du panneau. **Description** : écris le texte (qui tu es, le planning, les règles du chat…).
4. **Envoyer**, puis recommence pour les autres panneaux.

**Refaire les images** (autre couleur, police Dyer installée, textes changés dans `reglages.html` › **Kit de chaîne Twitch**), dans PowerShell :

```
cd G:\Projets\Overlay\mordethrhedan
node outils/exporter-chaine.mjs
```

> Une fois `Dyer.ttf` déposé, relance cette commande : les titres des visuels passeront en Dyer.
> Les noms des menus Twitch changent parfois un peu : cherche « Marque » ou « Récompenses des spectateurs » dans le tableau de bord.

---

## 8. Tester sans être en live

| Option | Effet |
|---|---|
| `?test=1` | faux chat et fausses alertes qui défilent |
| `?apercu=1` | affiche les zones des sources |
| `?journal=1` | affiche le journal : connexion à Streamer.bot et derniers événements reçus (6.3) |
| `?chat=0` | retire le chat intégré à la scène |
| `?cam=0` | *(Jeu)* pas de webcam : le cadre de la cam disparaît |
| `?minutes=0.5` | *(démarrage)* compte à rebours de 30 s |
| `?couleur=rouge` | essaie une autre couleur |

Le mode test **ne modifie pas** le vrai compteur de l'objectif.

---

## 9. Personnaliser

Presque tout se règle dans **`reglages.html`** (2.1), sans toucher au code.

| Je veux changer… | Où |
|---|---|
| Le coin de la webcam, pas de webcam, le chat d'un écran | `reglages.html` › Options des scènes |
| Une ambiance (Halloween, Noël…) | `reglages.html` › Couleur et fond (voir ci-dessous) |
| La couleur partout | `reglages.html` › Couleur et fond, ou `config.js` › `couleur` (`vert`, `rouge`, `bleu`, `violet`, `orange`, `cyan`, `jaune`, `rose` ou `"#FFD400"`) |
| La couleur d'une seule scène | `?couleur=rouge` dans l'adresse de l'overlay (pratique pour une scène « Jeu rouge ») |
| Le halo | `reglages.html` › Couleur et fond (léger, moyen, fort) |
| Le motif du fond / son animation | `reglages.html` › Couleur et fond |
| Les titres des écrans | `reglages.html` › Écrans avec un grand titre |
| Le vocabulaire des alertes (avec aperçu) | `reglages.html` › Alertes |
| Le son de chaque alerte, ou ton propre fichier | `reglages.html` › Sons des alertes (voir 6.8) |
| Les visuels de la chaîne | `reglages.html` › Kit de chaîne Twitch (puis `node outils/exporter-chaine.mjs`, voir « Les scripts ») |
| Remettre l'objectif à zéro | `reglages.html` › Objectif › Ton nombre ACTUEL |

Dans les textes des alertes, `{nom}`, `{montant}`, `{mois}`, `{nombre}` et `{destinataire}` sont remplacés automatiquement.

### Changer d'ambiance (Halloween, Noël…) en un clic

1. Ouvre `reglages.html` › section **Couleurs** — la couleur des cadres et des éclats y est aussi, dans « Couleur et fond ».
2. Clique **🎃 Halloween** (ou **🎄 Noël**), ou change une couleur à la main (le nuancier, ou un code comme `#FF7A1A`). **↺** remet la couleur d'origine d'une seule couleur ; **↺ Couleurs d'origine** les remet toutes.
3. **Enregistrer**, puis actualise les sources dans OBS (ou laisse faire le script de la section 2) : toutes les scènes, sources et alertes prennent ces couleurs.

#### Créer ta propre ambiance (ex. Batman) et la garder

1. Dans `reglages.html` › **Couleurs**, règle les couleurs comme tu veux (nuancier ou code).
2. Sous **Mes ambiances**, tape un nom (ex. `Batman`) puis clique **💾 Sauvegarder ces couleurs** : l'ambiance est écrite tout de suite dans `config.js`, avec son nom et ses couleurs. Même nom qu'une ambiance existante = elle est remplacée (la page demande confirmation).
3. Elle apparaît ensuite en bouton : **un clic** remet toutes ses couleurs, puis **Enregistrer** pour que l'overlay les prenne. **×** la supprime.

Sauvegarder une ambiance ne change pas les couleurs de l'overlay : seul **Enregistrer** le fait.

Les **vidéos de transition** et les **images du kit de chaîne** sont déjà fabriquées : pour qu'elles prennent les nouvelles couleurs, refais-les avec les scripts ci-dessous : `node outils/generer-transitions.mjs` puis `node outils/exporter-chaine.mjs` (et quand tu reviens aux couleurs d'origine, pareil).


### Les scripts du dossier `outils/`

Ces scripts **refont les fichiers « fabriqués »** : vidéos de transition, images du kit, PDF… On ne s'en sert qu'après un changement (couleurs, textes du kit, tuto modifié). Tout le reste (réglages, textes, alertes) se fait dans `reglages.html`, sans script.

**Une seule fois : installer Node.js** (le programme qui lance les scripts `.mjs`)
1. Va sur le site officiel **nodejs.org**, télécharge la version **LTS** et installe-la (tout laisser par défaut, *Suivant* jusqu'au bout).
   Ou, dans PowerShell : `winget install OpenJS.NodeJS.LTS`
2. Pour **refaire les vidéos de transition**, il faut aussi **ffmpeg** : dans PowerShell, `winget install Gyan.FFmpeg`.
3. Ferme puis rouvre PowerShell.

**Lancer un script**
1. Ouvre le dossier `mordethrhedan` dans l'Explorateur Windows.
2. Clic droit dans un espace vide du dossier › **Ouvrir dans le Terminal** (ou tape `powershell` dans la barre d'adresse du dossier, puis **Entrée**).
3. Tape la commande du tableau, puis **Entrée**. Le script dit ce qu'il fait, puis rend la main.

| Script | À quoi il sert | Quand | Commande |
|---|---|---|---|
| `actualiser-obs.lua` | bouton « Actualiser toutes les sources Navigateur » dans OBS, et actualisation automatique quand `config.js` change | une fois, à installer dans OBS (section 2) | *pas de commande :* OBS › Outils › Scripts › + |
| `generer-transitions.mjs` | refait les vidéos `transitions/videos/*.webm` (Stinger) | après un changement de couleurs | `node outils/generer-transitions.mjs` *(ffmpeg nécessaire)* |
| `exporter-chaine.mjs` | refait les images `chaine/export/*.png` (profil, bannière, panneaux, emotes, badges) | après un changement de couleurs ou des textes du kit | `node outils/exporter-chaine.mjs` |
| `generer-pdf.mjs` | refait `TUTO.pdf` et `CONCEPT.pdf` depuis les `.md` | après une modification de `TUTO.md` ou `CONCEPT.md` | `node outils/generer-pdf.mjs` |
| `capturer.mjs` | fait une capture PNG d'une page (pour vérifier une animation, ou l'envoyer) | pour vérifier | `node outils/capturer.mjs "scenes/jeu.html?test=1"` |
| `polices-locales.mjs` | copie dans `assets/polices/` les polices du thème (pour ne plus dépendre d'internet) | seulement si on change de police (déjà fait) | `node outils/polices-locales.mjs` *(internet nécessaire)* |

Les scripts se servent de **Microsoft Edge** en coulisses (déjà installé avec Windows) : rien d'autre à installer.

---

## 10. Dépannage

**Page blanche / rien ne s'affiche**
→ Vérifie `1920` × `1080` sur la source, puis clic droit › **Actualiser**. Si tu viens de modifier `config.js`, vérifie les guillemets et les virgules.

**Les titres ne sont pas dans la police Dyer**
→ Vérifie le nom du fichier dans `assets/polices/` (`Dyer.ttf`), puis actualise.

**Le chat n'affiche rien**
→ Vérifie l'identifiant Twitch dans `reglages.html` › **La chaîne** (l'identifiant exact, en minuscules). Le chat n'affiche que les messages envoyés **après** l'ouverture de la page, et il a besoin d'internet.

**Les alertes ne s'affichent pas**
→ Streamer.bot est-il lancé, serveur WebSocket **démarré** (port `8080`), compte Broadcaster connecté ? Regarde le journal (6.3, `?journal=1`) : il dit ce qui coince.

**Les réglages ne changent rien dans OBS**
→ Après **Enregistrer** dans `reglages.html`, il faut actualiser les sources : clic droit › **Actualiser**, ou le script `actualiser-obs.lua` (section 2) qui le fait tout seul.

**Pas de son sur les alertes**
→ Coche **Contrôler l'audio via OBS** sur la source d'alertes et vérifie son volume dans le mélangeur.

**Une alerte s'affiche mal (pseudo manquant, « ? »…)**
→ OBS n'a pas de console (F12) : ajoute `?journal=1` à l'adresse de la source d'alertes (décoche *Fichier local*, colle l'adresse de la page suivie de `?journal=1`). Un panneau affiche la connexion à Streamer.bot (« ✅ Connecté ») et chaque événement reçu avec ses données brutes : fais-en une capture d'écran pour faire corriger l'overlay, puis retire `?journal=1`.

**Une ancienne image s'affiche encore après une modification**
→ Dans le navigateur : **Ctrl + F5** (recharge en ignorant la mémoire du navigateur).
→ Dans OBS : clic droit sur la source › **Propriétés** › **Actualiser le cache de la page actuelle**.

**La cam ne tombe pas pile dans le cadre**
→ Refais le geste B, et vérifie que la webcam est bien **sous** l'overlay.

---

Bon live ! 🎮
