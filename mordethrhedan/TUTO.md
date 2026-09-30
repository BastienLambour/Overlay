# 🟢 Mordethrhedan — Tutoriel d'installation

Ce tutoriel installe l'overlay dans **OBS Studio**, de zéro jusqu'au premier live, puis habille ta **chaîne Twitch**.
Chaque page a sa **fiche** : tu peux suivre une fiche seule, sans lire le reste.

> 💡 Pour tout voir en direct : ouvre `index.html` dans ton navigateur (et `design/moodboard.html` pour essayer les couleurs). La version à lire confortablement de ce tutoriel est `TUTO.pdf`.

---

## Sommaire

1. Ce qu'il y a dans le dossier
2. Avant de commencer (config, police Dyer, réglages OBS, les 3 gestes de base)
3. Les scènes, fiche par fiche : Démarrage · Pause · Fin · Cam seule · Contenu · Jeu · Speedrun
4. Les sources à la carte : Alertes · Chat · Objectif · Cadre néon · Compte à rebours · Fond
5. Les transitions : Balayage · Volets
6. Brancher les alertes avec Streamer.bot
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
├── transitions/         ← les transitions (+ videos/ : prêtes pour OBS)
├── chaine/              ← kit de chaîne Twitch (kit.html + export/ : les PNG)
├── assets/polices/      ← dépose ici la police Dyer
├── outils/              ← scripts : vidéos de transition, images de la chaîne, PDF
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

### 2.6 Geste C — ajouter une option dans l'adresse

1. Dans la source Navigateur, **décoche** *Fichier local*.
2. Colle l'adresse complète dans **URL**, avec les options après un `?` :

```
file:///G:/Projets/Overlay/mordethrhedan/scenes/jeu.html?cam=bas-droite&couleur=rouge
```

### 2.7 Astuce — une seule source d'alertes pour toutes les scènes

1. **Scènes › +** : crée une scène **« Global — Alertes »** et ajoutes-y `sources/alertes.html` (fiche 4.1).
2. Dans chaque autre scène : **Sources › + › Scène** › « Global — Alertes », tout **en haut** de la liste.

> 🔑 **Règle d'or** : dans OBS, ce qui est **en haut** de la liste s'affiche **par-dessus**. L'overlay est au-dessus de la webcam et du jeu ; **tes widgets** (succès, manette, splits) sont **au-dessus** de l'overlay.

---

## 3. Les scènes, fiche par fiche

### 3.1 ⏳ Démarrage — `scenes/demarrage.html`

**À quoi ça sert** : « Ça commence bientôt » et le compte à rebours, posés sur **ton image** (« C'est parti ! » à zéro).

**Dans OBS :**
1. **Scènes › +** : « Démarrage ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/demarrage.html`, case **Actualiser le navigateur quand la scène devient active** cochée.
4. **+ › Image** › « Ton image », choisis ton image. Geste B : position `505`, `149` · taille `1380` × `776`.
5. Ordre final : `Global — Alertes` · `Overlay` · `Ton image`.

**Options** : `?minutes=5` (10 min par défaut) · `?couleur=rouge`

### 3.2 ☕ Pause — `scenes/pause.html`

**À quoi ça sert** : « Petite pause en cours » posé sur ton image, le chat à gauche.

**Dans OBS :**
1. **Scènes › +** : « Pause ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/pause.html`.
4. **+ › Image** › « Ton image ». Geste B : position `505`, `149` · taille `1380` × `776`.
5. Ordre final : `Global — Alertes` · `Overlay` · `Ton image`.

### 3.3 👋 Fin — `scenes/fin.html`

**À quoi ça sert** : « Merci d'être passés ! » posé sur ton image, le chat à gauche.

**Dans OBS :** comme la Pause, avec `scenes/fin.html` (image en `505`, `149` · `1380` × `776`).

### 3.4 🎙 Cam seule — `scenes/cam-seule.html`

**À quoi ça sert** : ta webcam en grand, le chat à droite.

**Dans OBS :**
1. **Scènes › +** : « Cam seule ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/cam-seule.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam ». Geste B : position `45`, `95` · taille `1370` × `770`.
5. Ordre final : `Global — Alertes` · `Overlay` · `Webcam`.

### 3.5 🖥 Contenu — `scenes/contenu.html`

**À quoi ça sert** : le chat à gauche, le contenu (16:9) à droite.

**Dans OBS :**
1. **Scènes › +** : « Contenu ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/contenu.html`.
4. **+ › Capture de fenêtre** (ou *Capture d'écran*, *Navigateur*…) › « Contenu ». Geste B : position `505`, `149` · taille `1380` × `776`.
5. Ordre final : `Global — Alertes` · `Overlay` · `Contenu`.

### 3.6 🎮 Jeu — `scenes/jeu.html`

**À quoi ça sert** : le jeu en plein écran, ta cam dans un coin, une place libre pour ton widget de succès.

**Dans OBS :**
1. **Scènes › +** : « Jeu ».
2. **+ › Scène** › « Global — Alertes ».
3. Ajoute ton **widget de succès** (ta source habituelle). Geste B : position `1440`, `45` · taille `420` × `250`.
4. Geste A avec `scenes/jeu.html`.
5. **+ › Périphérique de capture vidéo** › « Webcam ». Geste B : taille `320` × `300`, position selon le coin :

| Coin (option `cam`) | Position de la webcam (x, y) |
|---|---|
| `haut-gauche` *(défaut)* | `60`, `55` |
| `haut-droite` | `1540`, `55` |
| `bas-gauche` | `60`, `725` |
| `bas-droite` | `1540`, `725` |

Quand la cam est à droite, la zone du widget succès passe à gauche (`60`, `45`).

6. **+ › Capture de jeu** › « Jeu ». Geste B : `0`, `0` · `1920` × `1080`.
7. Ordre final : `Global — Alertes` · `Widget succès` · `Overlay` · `Webcam` · `Jeu`.

**Options** : `?cam=bas-droite` · `?cadre=0` (sans le grand cadre extérieur) · `?couleur=rouge`

### 3.7 ⏱ Speedrun — `scenes/speedrun.html`

**À quoi ça sert** : ta manette et tes splits à gauche, le jeu à droite.

**Dans OBS :**
1. **Scènes › +** : « Speedrun ».
2. **+ › Scène** › « Global — Alertes ».
3. Ajoute ton **widget manette** et ta **capture LiveSplit** (tes sources habituelles).
4. Geste A avec `scenes/speedrun.html`.
5. **+ › Capture de jeu** › « Jeu ».
6. Geste B :

| Source | Position (x, y) | Taille (l × h) |
|---|---|---|
| Manette | `40`, `40` | `380` × `290` |
| LiveSplit | `40`, `355` | `380` × `685` |
| Jeu | `450`, `122` | `1440` × `810` |

7. Ordre final : `Global — Alertes` · `Manette` · `LiveSplit` · `Overlay` · `Jeu`.

**Options** : cadres autour de la manette et des splits réglables dans `config.js` › `speedrun.cadreManette` / `cadreSplits`.

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

**À quoi ça sert** : le fond à facettes seul, **tout en bas** d'une scène à toi.
**Options** : `?couleur=rouge` · `?graine=12` (autre motif) · `?fixe` (sans animation)

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

## 6. Brancher les alertes avec Streamer.bot

Le **chat** marche tout seul. Les **alertes** et l'**objectif** passent par **Streamer.bot**, un logiciel **gratuit** qui tourne sur ton PC pendant le live.

1. Télécharge Streamer.bot sur le site officiel **streamer.bot**, décompresse-le (ex. `C:\Streamer.bot\`) et lance `Streamer.bot.exe`.
2. **Platforms › Twitch › Accounts** : connecte ton compte **Broadcaster**.
3. **Servers/Clients › WebSocket Server** : Address `127.0.0.1`, Port `8080`, coche **Auto Start**, clique **Start Server**.
4. Dans OBS, clic droit sur la source d'alertes › **Actualiser**.

✅ Streamer.bot doit être **lancé à chaque live**.
**Dons** : StreamElements, Streamlabs, Ko-fi ou Tipeee se connectent dans l'onglet **Integrations** de Streamer.bot.

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

---

## 7. Habiller la chaîne Twitch

Tous les visuels sont dans `chaine/` : ouvre `chaine/kit.html` pour les voir. Les images prêtes à envoyer sont dans `chaine/export/`. Ils prennent la même couleur que l'overlay.

| Visuel | Fichier | Où l'envoyer sur Twitch |
|---|---|---|
| Photo de profil | `profil.png` (800 × 800) | Tableau de bord des créateurs › Paramètres › Chaîne › **Marque** › Photo de profil |
| Bannière de profil | `banniere.png` (1200 × 480) | … › **Marque** › Bannière de profil |
| Écran hors-ligne | `hors-ligne.png` (1920 × 1080) | … › **Marque** › Bannière du lecteur vidéo |
| Panneaux de bio | `panneau-a-propos.png`, `panneau-planning.png`, `panneau-regles.png`, `panneau-soutenir.png` (320 × 160) | Ta chaîne › onglet **À propos** › **Modifier les panneaux** › **+** |
| Emotes | `emote-gg`, `pb`, `reset`, `gold`, `coeur`, `manette` (-112, -56, -28) | Tableau de bord › **Récompenses des spectateurs** › Emotes *(affilié ou partenaire)* |
| Badges d'abonné | `badge-mois-1`, `-3`, `-6`, `-9`, `-12` (-72, -36, -18) | Tableau de bord › **Récompenses des spectateurs** › Badges d'abonné |

**Les panneaux, pas à pas :**
1. Va sur ta chaîne, onglet **À propos**, active **Modifier les panneaux**.
2. **+** › **Ajouter un panneau texte ou image**.
3. **Image** : choisis le PNG du panneau. **Description** : écris le texte (qui tu es, le planning, les règles du chat…).
4. **Envoyer**, puis recommence pour les autres panneaux.

**Refaire les images** (autre couleur, police Dyer installée, textes changés dans `config.js` › `chaine`), dans PowerShell :

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
| `?minutes=0.5` | *(démarrage)* compte à rebours de 30 s |
| `?couleur=rouge` | essaie une autre couleur |

Le mode test **ne modifie pas** le vrai compteur de l'objectif.

---

## 9. Personnaliser

| Je veux changer… | Où |
|---|---|
| La couleur partout | `config.js` › `couleur` (`vert`, `rouge`, `bleu`, `violet`, `orange`, `cyan`, `jaune`, `rose` ou `"#FFD400"`) |
| La couleur d'une seule scène | `?couleur=rouge` dans l'adresse de l'overlay (pratique pour une scène « Jeu rouge ») |
| Le halo | `config.js` › `halo` (`leger`, `moyen`, `fort`) |
| Le motif du fond / son animation | `config.js` › `fond.graine` / `fond.animation` |
| Les titres des écrans | `config.js` › `demarrage`, `pause`, `fin` |
| Le vocabulaire des alertes | `config.js` › `alertes.textes` |
| Les visuels de la chaîne | `config.js` › `chaine` (puis `node outils/exporter-chaine.mjs`) |
| Remettre l'objectif à zéro | changer `objectif.depart` dans `config.js` |

Dans les textes des alertes, `{nom}`, `{montant}`, `{mois}`, `{nombre}` et `{destinataire}` sont remplacés automatiquement.

---

## 10. Dépannage

**Page blanche / rien ne s'affiche**
→ Vérifie `1920` × `1080` sur la source, puis clic droit › **Actualiser**. Si tu viens de modifier `config.js`, vérifie les guillemets et les virgules.

**Les titres ne sont pas dans la police Dyer**
→ Vérifie le nom du fichier dans `assets/polices/` (`Dyer.ttf`), puis actualise.

**Le chat n'affiche rien**
→ Vérifie `chaineTwitch` (identifiant exact, en minuscules). Le chat n'affiche que les messages envoyés **après** l'ouverture de la page.

**Les alertes ne s'affichent pas**
→ Streamer.bot est-il lancé, serveur WebSocket **démarré** (port `8080`), compte Broadcaster connecté ? Actualise la source d'alertes.

**Pas de son sur les alertes**
→ Coche **Contrôler l'audio via OBS** sur la source d'alertes et vérifie son volume dans le mélangeur.

**Une alerte s'affiche mal (pseudo manquant, « ? »…)**
→ Clic droit sur la source d'alertes › **Interagir**, puis **F12** › **Console** : chaque événement reçu y est détaillé. Copie la ligne pour faire corriger.

**Une ancienne image s'affiche encore après une modification**
→ Dans le navigateur : **Ctrl + F5** (recharge en ignorant la mémoire du navigateur).
→ Dans OBS : clic droit sur la source › **Propriétés** › **Actualiser le cache de la page actuelle**.

**La cam ne tombe pas pile dans le cadre**
→ Refais le geste B, et vérifie que la webcam est bien **sous** l'overlay.

---

Bon live ! 🎮
