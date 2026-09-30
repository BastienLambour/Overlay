# 🚀 John Von Gurt — Tutoriel d'installation

Ce tutoriel installe l'overlay dans **OBS Studio**, de zéro jusqu'au premier live, puis habille ta **chaîne Twitch**.
Chaque page a sa **fiche** : tu peux suivre une fiche seule, sans lire le reste.

> 💡 Pour tout voir en direct : ouvre `index.html` dans ton navigateur. La version à lire confortablement de ce tutoriel est `TUTO.pdf`.

---

## Sommaire

1. Ce qu'il y a dans le dossier
2. Avant de commencer (config, réglages OBS, les 3 gestes de base)
3. Les scènes, fiche par fiche : Démarrage · Pause · Fin · Cam seule · Contenu · Jeu
4. Les sources à la carte : Alertes · Chat · Bandeau · Objectif · Cadre cam
5. Les transitions : Sas · Passage
6. Brancher le chat et les alertes (Streamer.bot, journal, objectif)
7. Habiller la chaîne Twitch
8. Tester sans être en live
9. Personnaliser
10. Dépannage

---

## 1. Ce qu'il y a dans le dossier

```
johnvongurt/
├── reglages.html       ← LA page pour changer les textes et réglages (elle modifie config.js)
├── config.js            ← LE fichier à modifier (textes, pseudo, objectif…)
├── index.html           ← aperçu de tout
├── TUTO.md / TUTO.pdf   ← ce tutoriel
├── CONCEPT.md / .pdf    ← le résumé du projet (DA, choix, ce qu'il reste à faire)
├── scenes/              ← les écrans et overlays de scène (une page = une scène OBS)
├── sources/             ← les éléments à poser où tu veux (alertes, chat…)
├── transitions/         ← les transitions (+ videos/ : prêtes pour OBS)
├── chaine/              ← kit de chaîne Twitch (kit.html + export/ : les PNG)
├── outils/              ← les scripts (vidéos, images du kit, PDF) et actualiser-obs.lua pour OBS : voir 9
├── design/moodboard.html
└── css/  js/            ← le moteur (pas besoin d'y toucher)
```

Toutes les pages font **1920 × 1080**, avec un fond transparent là où il faut.

---

## 2. Avant de commencer

### 2.1 Remplir les réglages avec `reglages.html`

1. Dans le dossier de l'overlay, double-clique sur **`reglages.html`** : la page s'ouvre dans ton navigateur (**Edge** ou **Chrome**).
2. Vérifie au minimum, dans **La chaîne** : le **nom affiché** et ton **identifiant Twitch** (celui de l'adresse `twitch.tv/…`).
3. Dans **Objectif** : mets ton nombre **actuel** de followers dans **Ton nombre ACTUEL**.
4. Clique **💾 Enregistrer config.js** (en bas, ou **Ctrl + S**).
5. **La première fois**, une fenêtre s'ouvre : va dans le dossier de l'overlay, clique sur **`config.js`**, puis **Ouvrir**. Le navigateur demande s'il peut modifier le fichier : clique **Modifier le fichier** (ou **Autoriser**).
   La page **remplace alors elle-même** `config.js` : rien à copier à la main. Les fois suivantes, elle s'en souvient et enregistre directement (au plus, le navigateur redemande l'autorisation).
6. Dans OBS : **clic droit sur la source › Actualiser** pour voir le changement.

Un **point** • à côté d'un réglage veut dire qu'il a changé et n'est pas encore enregistré. La section **Alertes** montre un aperçu de chaque alerte avec tes textes, et la section **Tester** ouvre les pages en mode test.
La page ne change **que** les réglages modifiés : les commentaires et tout le reste de `config.js` restent tels quels.

> ℹ️ Avec **Firefox**, la page ne peut pas modifier un fichier : elle **télécharge** un nouveau `config.js` (sans les commentaires), à mettre à la place de l'ancien. Préfère Edge ou Chrome.

**À la main (sans la page)** : ouvre `config.js` avec le **Bloc-notes** (clic droit › *Ouvrir avec* › *Bloc-notes*). Garde les guillemets `"…"` autour des textes et la virgule `,` en fin de ligne, enregistre, puis **Actualiser** dans OBS.

### 2.2 Régler le canevas d'OBS (une seule fois)

**Paramètres › Vidéo** : résolution de base `1920 × 1080`, résolution de sortie `1920 × 1080`.
Les positions des fiches sont données pour ce canevas.

### 2.3 Geste A — ajouter une source Navigateur

C'est la même manipulation pour **tous** les fichiers `.html` :

1. Sélectionne la scène, puis dans **Sources** : **+** › **Navigateur**.
2. Donne un nom à la source, puis **OK**.
3. Coche **Fichier local**, **Parcourir**, choisis le fichier `.html` indiqué dans la fiche.
4. **Largeur : `1920`**, **Hauteur : `1080`**.
5. Coche les cases indiquées dans la fiche.
6. **OK**.

### 2.4 Geste B — placer une source au pixel près

1. Clique sur la source (webcam, jeu, capture), puis **Ctrl + E**.
2. **Position** : x et y de la fiche.
3. **Type de zone de délimitation** : *Mettre à l'échelle à l'extérieur de la zone*.
4. **Taille de la zone de délimitation** : largeur et hauteur de la fiche.
5. Coche **Rogner à la zone de délimitation**, puis **Fermer**.

### 2.5 Geste C — ajouter une option dans l'adresse

1. Dans la source Navigateur, **décoche** *Fichier local*.
2. Colle l'adresse complète dans **URL**, avec les options après un `?` :

```
file:///G:/Projets/Overlay/johnvongurt/scenes/demarrage.html?minutes=10
```

Plusieurs options se séparent par `&` : `...jeu.html?cam=bas-gauche&test=1`

### 2.6 Astuce — une seule source d'alertes pour toutes les scènes

1. **Scènes › +** : crée une scène **« Global — Alertes »** et ajoutes-y `sources/alertes.html` (fiche 4.1).
2. Dans chaque autre scène : **Sources › + › Scène** › « Global — Alertes », tout **en haut** de la liste.

> 🔑 **Règle d'or** : dans OBS, ce qui est **en haut** de la liste s'affiche **par-dessus**.

### 2.7 Le chat et le bandeau : déjà dans les scènes

Les scènes contiennent **déjà** leur chat et leur bandeau, placés pile à côté des zones de la cam et du jeu : **tu n'as rien à ajouter.**
La source séparée `sources/chat.html` (ou `sources/bandeau.html`) sert seulement pour une scène à toi, ou pour placer le chat autrement : dans ce cas, ajoute `?chat=0` (ou `?bandeau=0`) à l'adresse de la scène pour retirer celui qui est intégré, puis ajoute la source séparée.

Quand tu changes de scène, le chat **réaffiche les derniers messages** (ceux des 10 dernières minutes, réglable dans `reglages.html` › **Le chat**) : il ne repart pas à vide.

### 2.8 Actualiser toutes les sources d'un coup (après un changement de réglages)

OBS n'a pas de bouton pour actualiser toutes les sources Navigateur : l'overlay en fournit un, sous forme de petit script OBS.

1. OBS › **Outils › Scripts** › onglet **Scripts** › **+** › choisis `outils/actualiser-obs.lua` (dans le dossier `johnvongurt`).
2. À droite : le bouton **Actualiser toutes les sources Navigateur**, et la case **Actualiser tout seul les sources de l'overlay quand config.js change** (cochée) : après **Enregistrer** dans `reglages.html`, les sources se mettent à jour en 2 secondes.
3. **Fermer** : le script reste installé. Raccourci clavier possible : **Paramètres › Raccourcis clavier** › « Actualiser toutes les sources Navigateur ».

> ⚠️ Une page actualisée repart de zéro (un compte à rebours recommence).

---

## 3. Les scènes, fiche par fiche

### 3.1 🚀 Démarrage — `scenes/demarrage.html`

**À quoi ça sert** : la fusée se ravitaille sur le pas de tir au rythme du compte à rebours. À T-30 : « Ravitaillement terminé » ; de T-10 à T-1, le décompte ; à T-0, **décollage** !

**Dans OBS :**
1. **Scènes › +** : « Démarrage ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/demarrage.html`, case **Actualiser le navigateur quand la scène devient active** cochée.

**Options** : `?minutes=10` (durée, 5 min par défaut)
**Vérifier** : ouvre `scenes/demarrage.html?minutes=0.5` dans ton navigateur, le décollage arrive en 30 s.

### 3.2 ⏸ Pause — `scenes/pause.html`

**À quoi ça sert** : l'écran clair « Transmission en pause », la fusée en vol dans l'anneau de chargement.

**Dans OBS :**
1. **Scènes › +** : « Pause ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/pause.html`.

### 3.3 🌙 Fin — `scenes/fin.html`

**À quoi ça sert** : l'alunissage (jambes déployées, poussière, drapeau), puis « Mission accomplie ».

**Dans OBS :**
1. **Scènes › +** : « Fin ».
2. Geste A avec `scenes/fin.html`, case **Actualiser le navigateur quand la scène devient active** cochée.

### 3.4 🎙 Cam seule — `scenes/cam-seule.html`

**À quoi ça sert** : la discussion : ta cam en grand, le chat à côté, le bandeau en bas.

**Dans OBS :**
1. **Scènes › +** : « Cam seule ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/cam-seule.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam », choisis ta caméra.
5. Geste B sur la webcam : position `80`, `210` · taille `1260` × `709`.
6. Ordre final : `Global — Alertes` · `Overlay` · `Webcam`.

**Vérifier** : adresse `cam-seule.html?apercu=1` (geste C), la zone de la cam est grisée. Retire `?apercu=1` ensuite.

### 3.5 🖥 Contenu — `scenes/contenu.html`

**À quoi ça sert** : la cam et le chat en colonne à gauche, le contenu à droite.

**Dans OBS :**
1. **Scènes › +** : « Contenu ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/contenu.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam ».
5. **+ › Capture de fenêtre** (ou *Capture d'écran*, *Navigateur*…) › « Contenu ».
6. Geste B :

| Source | Position (x, y) | Taille (l × h) |
|---|---|---|
| Webcam | `60`, `250` | `480` × `270` |
| Contenu | `580`, `190` | `1280` × `720` |

7. Ordre final : `Global — Alertes` · `Overlay` · `Webcam` · `Contenu`.

### 3.6 🎮 Jeu — `scenes/jeu.html`

**À quoi ça sert** : le jeu en plein écran, une petite cam dans un coin, le chat en transparence.

**Dans OBS :**
1. **Scènes › +** : « Jeu ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/jeu.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam ».
5. **+ › Capture de jeu** › « Jeu ».
6. Geste B : le **Jeu** en `0`, `0`, `1920` × `1080` ; la **Webcam** en `400` × `225`, selon le coin :

| Coin (option `cam`) | Position de la webcam (x, y) |
|---|---|
| `bas-droite` *(défaut)* | `1456`, `735` |
| `bas-gauche` | `64`, `735` |
| `haut-droite` | `1456`, `180` |
| `haut-gauche` | `64`, `180` |

7. Ordre final : `Global — Alertes` · `Overlay` · `Webcam` · `Jeu`.

**Options** : `?cam=bas-gauche` (le chat passe automatiquement de l'autre côté).

---

## 4. Les sources à la carte

À poser **en plus**, dans n'importe quelle scène. Position et taille avec `?x=&y=&l=&h=` (pixels 1920 × 1080).

### 4.1 🔔 Alertes — `sources/alertes.html`

**À quoi ça sert** : follows, abonnements, bits, raids et dons, avec un petit son radio.

**Dans OBS :**
1. Dans la scène « Global — Alertes » (voir 2.6) : geste A avec `sources/alertes.html`.
2. Coche **Contrôler l'audio via OBS** et règle le volume dans le mélangeur audio.

**Options** : `?position=haut` (défaut), `centre` ou `bas` · `?test=1`
**Nécessite** Streamer.bot (section 6).

### 4.2 💬 Chat — `sources/chat.html`

**À quoi ça sert** : le « Canal de communication » seul, pour une scène à toi.
**Dans OBS :** geste A, puis geste C pour le placer.
**Options** : `?x=1400&y=160&l=460&h=760` · `?flottant=1` (sans panneau) · `?disparition=45` · `?test=1`

### 4.3 📰 Bandeau — `sources/bandeau.html`

**À quoi ça sert** : dernière recrue, dernier abonné, dernier soutien et objectif.
**Options** : `?x=80&y=980&l=1760&h=76` · `?compact=1` · `?test=1`
**Choisir les cases** : `reglages.html` › **Bandeau d'infos** (par exemple, décoche le dernier soutien si tu ne reçois ni dons ni bits, et le dernier abonné si ta chaîne n'est pas encore affiliée).

### 4.4 🌍 Objectif — `sources/objectif.html`

**À quoi ça sert** : la jauge où la fusée va de la Terre à la Lune à chaque follow (ou abonnement).
**Options** : `?x=560&y=60&l=800&h=150` · `?test=1`

### 4.5 🎥 Cadre cam — `sources/cam.html`

**À quoi ça sert** : le cadre « Flux caméra » seul (voyant REC, plaque de nom), pour une cam placée où tu veux.

**Dans OBS :**
1. Place ta webcam et note sa position et sa taille (Ctrl + E).
2. Geste A avec `sources/cam.html` **au-dessus** de la webcam, puis geste C avec les mêmes chiffres : `?x=1456&y=735&l=400&h=225`.

**Options** : `?nom=1` (plaque « Nom — Grade ») · `?titre=Flux%20caméra` (`?titre=` pour masquer) · `?apercu=1`

---

## 5. Les transitions

Les vidéos sont **déjà prêtes** dans `transitions/videos/` (fond transparent). Pour chacune :

1. Panneau **Transitions de scène** › **+** › **Stinger**, donne-lui un nom.
2. **Fichier vidéo** : la vidéo du tableau.
3. **Type de point de transition** : *Temps (millisecondes)* ; **Point de transition** : la valeur du tableau.
4. **OK**.

| Transition | Vidéo | Point de transition |
|---|---|---|
| 🚪 Sas (portes blindées) | `sas.webm` | `1100 ms` |
| 🚀 Passage (la fusée traverse l'écran) | `passage.webm` | `1000 ms` |

**Une transition par scène** : clic droit sur la scène › **Remplacer la transition**.
**Sans vidéo** : ajoute `transitions/sas.html` tout en haut de la scène, case *Actualiser…* cochée, transition d'OBS sur **Coupure**.

**Refaire les vidéos** (après un changement de couleurs), dans PowerShell :

```
cd G:\Projets\Overlay\johnvongurt
node outils/generer-transitions.mjs
```

---

## 6. Brancher le chat et les alertes

Deux choses différentes :

| Quoi | Comment ça arrive | À installer |
|---|---|---|
| **Le chat** | l'overlay lit ton chat Twitch directement | **rien** : ton identifiant Twitch dans les réglages suffit |
| Les alertes, le bandeau et l'objectif (follows, abonnements, bits, raids, dons) | par **Streamer.bot**, un logiciel gratuit qui tourne sur ton PC | Streamer.bot, une fois (6.2) |

### 6.1 Le chat

1. `reglages.html` › **La chaîne** › **Identifiant Twitch** : celui de ton adresse `twitch.tv/…`. Enregistre.
2. C'est tout : dans les scènes, le chat s'affiche dès qu'un message arrive.

Les **emotes Twitch** s'affichent en image ; les **bots** (liste dans `reglages.html` › **Le chat**) et les **commandes** qui commencent par `!` sont cachés ; un message **supprimé par un modo**, ou ceux d'un spectateur **banni**, disparaissent aussi de l'overlay ; en changeant de scène, les messages des 10 dernières minutes sont réaffichés.
Il ne montre pas les messages envoyés **avant** l'ouverture d'OBS, ni les emotes des extensions 7TV, BTTV ou FFZ.

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
   `file:///G:/Projets/Overlay/johnvongurt/sources/alertes.html?journal=1`
3. **OK** : un panneau sombre apparaît en haut à gauche. Tu dois y lire **✅ Connecté à Streamer.bot**.
   - « ⚠️ Déconnecté de Streamer.bot » : Streamer.bot n'est pas lancé, ou son serveur WebSocket n'est pas démarré (6.2).
   - « ⚠️ Streamer.bot désactivé » : coche « Se connecter à Streamer.bot » dans `reglages.html`.
4. Chaque événement reçu s'y ajoute (ex. `Twitch.Follow → follow · Pseudo`), avec **les données brutes** reçues en dessous.
5. Une fois vérifié, **retire `?journal=1`** de l'adresse (sinon le panneau reste à l'écran pendant le live).

### 6.4 Événement par événement

Une fois Streamer.bot branché, **rien à régler par événement** : l'overlay les écoute tous. Les textes se changent dans `reglages.html` › **Alertes** (avec un aperçu).

| Événement Twitch | Alerte |
|---|---|
| Follow | **Nouvelle recrue** — rejoint l'équipage |
| Abonnement | **Astronaute certifié** — signe pour la mission |
| Réabonnement | **Astronaute vétéran** — rempile pour X mois |
| Abonnement offert | **Billet offert** — offre un abonnement à… |
| Pluie d'abonnements | **Pluie de billets !** *(grande alerte)* |
| Bits | **Carburant reçu** — ajoute X bits au réservoir |
| Raid | **Flotte en approche !** *(grande alerte)* |
| Don | **Soutien de mission** — finance la mission |
| Objectif atteint | **Objectif atteint !** *(grande alerte)* |

Abonnements, abonnements offerts et bits demandent une chaîne **affiliée** ou **partenaire**. Les alertes passent **une par une** (file d'attente) : rien n'est perdu pendant un raid.

### 6.5 Les dons (facultatif)

Twitch ne gère pas les dons en argent : ils passent par un service (StreamElements, Streamlabs, Ko-fi, Tipeee). Dans Streamer.bot, onglet **Integrations**, choisis ton service et suis ses indications (en général, coller une **clé** copiée depuis le tableau de bord du service, puis **Connect**).
Si tu ne reçois ni dons ni bits, décoche la case correspondante du bandeau : `reglages.html` › **Bandeau d'infos**.

### 6.6 L'objectif

`reglages.html` › **Objectif** : ce qu'on compte (**les follows** ou **les abonnements**), le nom, la cible et **ton nombre ACTUEL**. Le compteur avance à chaque follow (ou abonnement, une pluie d'abonnements comptant pour tous ses cadeaux) reçu **pendant que OBS est ouvert**, et s'en souvient d'un live à l'autre. De temps en temps, remets ton vrai nombre dans « Ton nombre ACTUEL ».

### 6.7 Tester les vraies alertes

- **Sans Twitch** : `?test=1` sur une page (fausses alertes toutes les 9 secondes, sans toucher au vrai compteur), ou `reglages.html` › **Tester**.
- **Pour de vrai** : demande à un ami (ou à un deuxième compte) de suivre la chaîne, OBS et Streamer.bot ouverts.

> ⚠️ **Pas encore vérifié sur un vrai live** : si une alerte montre « Quelqu'un » ou « ? », fais une capture d'écran du journal (6.3) pour faire corriger l'overlay.
---

## 7. Habiller la chaîne Twitch

Tous les visuels sont dans `chaine/` : ouvre `chaine/kit.html` pour les voir. Les images prêtes à envoyer sont dans `chaine/export/`.

| Visuel | Fichier | Où l'envoyer sur Twitch |
|---|---|---|
| Photo de profil | `profil.png` (800 × 800) | Tableau de bord des créateurs › Paramètres › Chaîne › **Marque** › Photo de profil |
| Bannière de profil | `banniere.png` (1200 × 480) | … › **Marque** › Bannière de profil |
| Écran hors-ligne | `hors-ligne.png` (1920 × 1080) | … › **Marque** › Bannière du lecteur vidéo |
| Panneaux de bio | `panneau-a-propos.png`, `panneau-planning.png`, `panneau-regles.png`, `panneau-materiel.png`, `panneau-soutenir.png` (320 × 160) | Ta chaîne › onglet **À propos** › **Modifier les panneaux** › **+** |
| Emotes | `emote-decollage`, `casque`, `houston`, `o7`, `gg`, `lune` (-112, -56, -28) | Tableau de bord › **Récompenses des spectateurs** › Emotes *(affilié ou partenaire)* |
| Badges d'abonné | `badge-mois-1` (1 galon), `-3` (2 galons), `-6` (3 galons), `-9` (planète), `-12` (fusée) (-72, -36, -18) | Tableau de bord › **Récompenses des spectateurs** › Badges d'abonné |

**Les panneaux, pas à pas :**
1. Va sur ta chaîne, onglet **À propos**, active **Modifier les panneaux**.
2. **+** › **Ajouter un panneau texte ou image**.
3. **Image** : choisis le PNG du panneau. **Description** : écris le texte (qui tu es, le planning, les règles du chat…).
4. **Envoyer**, puis recommence pour les autres panneaux.

**Changer les textes** (slogan, planning, titres des panneaux) : `reglages.html` › **Kit de chaîne Twitch**, puis refais les images dans PowerShell :

```
cd G:\Projets\Overlay\johnvongurt
node outils/exporter-chaine.mjs
```

> Les noms des menus Twitch changent parfois un peu : si tu ne trouves pas un intitulé, cherche « Marque » ou « Récompenses des spectateurs » dans le tableau de bord.

---

## 8. Tester sans être en live

| Option | Effet |
|---|---|
| `?test=1` | faux messages de chat et fausses alertes qui défilent |
| `?apercu=1` | affiche les zones de la cam et du jeu |
| `?journal=1` | affiche le journal : connexion à Streamer.bot et derniers événements reçus (6.3) |
| `?chat=0` · `?bandeau=0` | retire le chat ou le bandeau intégré à la scène |
| `?minutes=0.5` | *(démarrage)* compte à rebours de 30 s, pour voir le décollage vite |
| `?theme=clair` / `?theme=sombre` | force le thème |

Le mode test **ne modifie pas** le vrai compteur de l'objectif. Le plus simple : ouvre `index.html` (tout y tourne en mode test), ou `reglages.html` › **Tester**.

---

## 9. Personnaliser

Presque tout se règle dans **`reglages.html`** (2.1), sans toucher au code.

| Je veux changer… | Où |
|---|---|
| Les textes, titres, messages, l'objectif | `reglages.html` (ou `config.js` à la main) |
| Le vocabulaire des alertes (avec aperçu) | `reglages.html` › Alertes |
| La durée, le volume ou le son des alertes | `reglages.html` › Alertes |
| Les bots masqués, la mémoire du chat | `reglages.html` › Le chat |
| Les cases du bandeau (dons, abonnés…) | `reglages.html` › Bandeau d'infos |
| Les visuels de la chaîne | `reglages.html` › Kit de chaîne Twitch (puis `node outils/exporter-chaine.mjs`, voir « Les scripts ») |
| Les couleurs, une ambiance (Halloween, Noël…) | `reglages.html` › Couleurs (voir ci-dessous) |
| Les couleurs d'origine, les polices | début de `css/theme.css` |
| Remettre l'objectif à zéro | `reglages.html` › Objectif › Ton nombre ACTUEL |

Dans les textes des alertes, `{nom}`, `{montant}`, `{mois}`, `{nombre}` et `{destinataire}` sont remplacés automatiquement.

### Changer d'ambiance (Halloween, Noël…) en un clic

1. Ouvre `reglages.html` › section **Couleurs**.
2. Clique **🎃 Halloween** (ou **🎄 Noël**), ou change une couleur à la main (le nuancier, ou un code comme `#FF7A1A`). **↺** remet la couleur d'origine d'une seule couleur ; **↺ Couleurs d'origine** les remet toutes.
3. **Enregistrer**, puis actualise les sources dans OBS (ou laisse faire le script de la section 2) : toutes les scènes, sources et alertes prennent ces couleurs.

Les **vidéos de transition** et les **images du kit de chaîne** sont déjà fabriquées : pour qu'elles prennent les nouvelles couleurs, refais-les avec les scripts ci-dessous : `node outils/generer-transitions.mjs` puis `node outils/exporter-chaine.mjs` (et quand tu reviens aux couleurs d'origine, pareil).


### Les scripts du dossier `outils/`

Ces scripts **refont les fichiers « fabriqués »** : vidéos de transition, images du kit, PDF… On ne s'en sert qu'après un changement (couleurs, textes du kit, tuto modifié). Tout le reste (réglages, textes, alertes) se fait dans `reglages.html`, sans script.

**Une seule fois : installer Node.js** (le programme qui lance les scripts `.mjs`)
1. Va sur le site officiel **nodejs.org**, télécharge la version **LTS** et installe-la (tout laisser par défaut, *Suivant* jusqu'au bout).
   Ou, dans PowerShell : `winget install OpenJS.NodeJS.LTS`
2. Pour **refaire les vidéos de transition**, il faut aussi **ffmpeg** : dans PowerShell, `winget install Gyan.FFmpeg`.
3. Ferme puis rouvre PowerShell.

**Lancer un script**
1. Ouvre le dossier `johnvongurt` dans l'Explorateur Windows.
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

**Rien ne s'affiche / page blanche**
→ Vérifie `1920` × `1080` sur la source, puis clic droit › **Actualiser**. Si tu viens de modifier `config.js`, cherche un guillemet ou une virgule manquant.

**Les polices ne sont pas les bonnes**
→ Elles sont dans `assets/polices/` (pas besoin d'internet) : vérifie que le dossier est bien là, à côté de `css/`, puis actualise la source.

**Le chat n'affiche rien**
→ Vérifie l'identifiant Twitch dans `reglages.html` › **La chaîne** (l'identifiant exact, en minuscules). Le chat n'affiche que les messages envoyés **après** l'ouverture de la page, et il a besoin d'internet.

**Les alertes ne s'affichent pas**
→ Streamer.bot est-il lancé, serveur WebSocket **démarré** (port `8080`), compte Broadcaster connecté ? Regarde le journal (6.3, `?journal=1`) : il dit ce qui coince.

**Les réglages ne changent rien dans OBS**
→ Après **Enregistrer** dans `reglages.html`, il faut actualiser les sources : clic droit › **Actualiser**, ou le script `actualiser-obs.lua` (section 2) qui le fait tout seul.

**On n'entend pas le son des alertes**
→ Coche **Contrôler l'audio via OBS** sur la source d'alertes et vérifie son volume dans le mélangeur.

**Une alerte s'affiche mal (pseudo manquant, « ? »…)**
→ OBS n'a pas de console (F12) : ajoute `?journal=1` à l'adresse de la source d'alertes (décoche *Fichier local*, colle l'adresse de la page suivie de `?journal=1`). Un panneau affiche la connexion à Streamer.bot (« ✅ Connecté ») et chaque événement reçu avec ses données brutes : fais-en une capture d'écran pour faire corriger l'overlay, puis retire `?journal=1`.

**Une ancienne image s'affiche encore après une modification**
→ Dans le navigateur : **Ctrl + F5** (recharge en ignorant la mémoire du navigateur).
→ Dans OBS : clic droit sur la source › **Propriétés** › **Actualiser le cache de la page actuelle**.

**La cam ne tombe pas pile dans le cadre**
→ Refais le geste B, et vérifie que la webcam est bien **sous** l'overlay.

**Le compte à rebours ou l'alunissage ne repart pas de zéro**
→ Coche **Actualiser le navigateur quand la scène devient active** sur la source.

---

Bon live, commandant ! 🚀
