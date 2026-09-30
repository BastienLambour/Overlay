# 💜 Ambries_ — Tutoriel d'installation

Ce tutoriel installe l'overlay dans **OBS Studio**, de zéro jusqu'au premier live, puis habille ta **chaîne Twitch**.
Chaque page a sa **fiche** : tu peux suivre une fiche seule, sans lire le reste.

> 💡 Pour tout voir en direct : ouvre `index.html` dans ton navigateur. La version à lire confortablement de ce tutoriel est `TUTO.pdf`.

---

## Sommaire

1. Ce qu'il y a dans le dossier
2. Avant de commencer (config, réglages OBS, les 3 gestes de base)
3. Les scènes, fiche par fiche : Démarrage · Pause · Fin · Cam seule · Contenu · Jeu
4. Les sources à la carte : Alertes · Chat · Bandeau · Objectif · Cadre cam
5. Les transitions : Splash · Gouttes · Pop art
6. Brancher les alertes avec Streamer.bot
7. Habiller la chaîne Twitch
8. Tester sans être en live
9. Personnaliser
10. Dépannage

---

## 1. Ce qu'il y a dans le dossier

```
ambries/
├── reglages.html       ← LA page pour changer les textes et réglages (elle modifie config.js)
├── config.js            ← LE fichier à modifier (textes, pseudo, objectif…)
├── index.html           ← aperçu de tout
├── TUTO.md / TUTO.pdf   ← ce tutoriel
├── CONCEPT.md / .pdf    ← le résumé du projet (DA, choix, ce qu'il reste à faire)
├── scenes/              ← les écrans et overlays de scène (une page = une scène OBS)
├── sources/             ← les éléments à poser où tu veux (alertes, chat…)
├── transitions/         ← les transitions (+ videos/ : prêtes pour OBS)
├── chaine/              ← kit de chaîne Twitch (kit.html + export/ : les PNG)
├── outils/              ← scripts : vidéos de transition, images de la chaîne, PDF
├── assets/avatar.png    ← ta photo de profil (utilisée partout)
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

Les zones de la cam ont des **coins arrondis** : l'overlay recouvre les angles de ta webcam, c'est normal.

### 2.5 Geste C — ajouter une option dans l'adresse

1. Dans la source Navigateur, **décoche** *Fichier local*.
2. Colle l'adresse complète dans **URL**, avec les options après un `?` :

```
file:///G:/Projets/Overlay/ambries/scenes/demarrage.html?minutes=10
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

---

## 3. Les scènes, fiche par fiche

### 3.1 ⏳ Démarrage — `scenes/demarrage.html`

**À quoi ça sert** : « Ça commence bientôt ! » avec ton avatar, le compte à rebours, la jauge **« Chargement des excuses… »** qui monte… et bloque à 90 %, et de petites phrases qui défilent. À zéro : « 90 %… ça suffira » et l'éclat **« C'est parti… (courage) »**.

**Dans OBS :**
1. **Scènes › +** : « Démarrage ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/demarrage.html`, case **Actualiser le navigateur quand la scène devient active** cochée.
4. Ordre final : `Global — Alertes` · `Démarrage`.

**Options** (geste C) : `?minutes=10` (durée, 5 min par défaut). Les phrases se changent dans `config.js › demarrage.phrases`.
**Vérifier** : ouvre `scenes/demarrage.html?minutes=0.5` dans ton navigateur, la fin arrive en 30 s.

### 3.2 ⏸ Pause — `scenes/pause.html`

**À quoi ça sert** : l'enseigne néon **« Pause »** qui grésille, « Je reviens… avec une excuse. », le temps de pause et le chat qui reste visible.

**Dans OBS :**
1. **Scènes › +** : « Pause ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/pause.html`, case **Actualiser le navigateur quand la scène devient active** cochée (le chrono de pause repart de zéro).
4. Ordre final : `Global — Alertes` · `Pause`.

### 3.3 🎉 Fin — `scenes/fin.html`

**À quoi ça sert** : **« GG ! (enfin… presque) »**, « Merci d'avoir assisté au carnage », ton dernier témoin et ton dernier soutien moral, sous une pluie d'éclaboussures.

**Dans OBS :**
1. **Scènes › +** : « Fin ».
2. Geste A avec `scenes/fin.html`, case **Actualiser le navigateur quand la scène devient active** cochée.

**Nécessite** Streamer.bot pour afficher les derniers noms (section 6) ; sinon un tiret s'affiche.

### 3.4 🎙 Cam seule — `scenes/cam-seule.html`

**À quoi ça sert** : la discussion : ta cam en grand dans son tube néon, le chat en bulles à côté, le bandeau en bas.

**Dans OBS :**
1. **Scènes › +** : « Cam seule ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/cam-seule.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam », choisis ta caméra.
5. Geste B sur la webcam : position `80`, `200` · taille `1260` × `709`.
6. Ordre final : `Global — Alertes` · `Overlay` · `Webcam`.

**Vérifier** : adresse `cam-seule.html?apercu=1` (geste C), la zone de la cam est grisée et légendée. Retire `?apercu=1` ensuite.

### 3.5 🖥 Contenu — `scenes/contenu.html`

**À quoi ça sert** : la cam et le chat en colonne à gauche, le contenu (jeu, vidéo, navigateur…) en grand à droite.

**Dans OBS :**
1. **Scènes › +** : « Contenu ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/contenu.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam ».
5. **+ › Capture de fenêtre** (ou *Capture d'écran*, *Capture de jeu*, *Navigateur*…) › « Contenu ».
6. Geste B :

| Source | Position (x, y) | Taille (l × h) |
|---|---|---|
| Webcam | `60`, `220` | `480` × `270` |
| Contenu | `590`, `200` | `1270` × `714` |

7. Ordre final : `Global — Alertes` · `Overlay` · `Webcam` · `Contenu`.

**Vérifier** : `contenu.html?apercu=1` (geste C).

### 3.6 🎮 Jeu — `scenes/jeu.html`

**À quoi ça sert** : le jeu en plein écran, une petite cam néon dans un coin, le chat en bulles qui s'effacent toutes seules après 45 secondes, un bandeau discret.

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
| `haut-droite` | `1456`, `190` |
| `haut-gauche` | `64`, `190` |

7. Ordre final : `Global — Alertes` · `Overlay` · `Webcam` · `Jeu`.

**Options** : `?cam=bas-gauche` (le chat passe automatiquement de l'autre côté).

---

## 4. Les sources à la carte

À poser **en plus**, dans n'importe quelle scène. Position et taille avec `?x=&y=&l=&h=` (pixels 1920 × 1080, geste C).

### 4.1 🔔 Alertes — `sources/alertes.html`

**À quoi ça sert** : follows, abonnements, bits, raids et dons, en **sticker BD qui éclabousse**, avec un petit « pop » sonore. Les grands événements (raid, pluie d'abonnements, objectif atteint) ont en plus un éclat BD géant.

**Dans OBS :**
1. Dans la scène « Global — Alertes » (voir 2.6) : geste A avec `sources/alertes.html`.
2. Coche **Contrôler l'audio via OBS** et règle le volume dans le mélangeur audio.

**Options** : `?position=haut` (défaut), `centre` ou `bas` · `?test=1`
**Nécessite** Streamer.bot (section 6).

### 4.2 💬 Chat — `sources/chat.html`

**À quoi ça sert** : le chat en bulles BD seul, pour une scène à toi.
**Dans OBS :** geste A, puis geste C pour le placer.
**Options** : `?x=1400&y=180&l=460&h=760` · `?flottant=1` (bulles sans panneau) · `?disparition=45` · `?test=1`

### 4.3 📰 Bandeau — `sources/bandeau.html`

**À quoi ça sert** : ton avatar, le dernier témoin, le dernier soutien moral, les fonds pour excuses et l'objectif.
**Dans OBS :** geste A, puis geste C pour le placer.
**Options** : `?x=80&y=970&l=1760&h=84` · `?compact=1` (dernier témoin + objectif) · `?test=1`
**Nécessite** Streamer.bot (section 6).

### 4.4 ⭐ Objectif — `sources/objectif.html`

**À quoi ça sert** : la jauge où **ta tête avance** à chaque follow (ou abonnement, selon `config.js › objectif.type`).
**Dans OBS :** geste A, puis geste C pour le placer.
**Options** : `?x=560&y=60&l=800&h=150` · `?test=1`
**Nécessite** Streamer.bot (section 6).

### 4.5 🎥 Cadre cam — `sources/cam.html`

**À quoi ça sert** : le tube néon seul (sticker « Ambries_ », « !! » qui tremble), pour une cam placée où tu veux.

**Dans OBS :**
1. Place ta webcam et note sa position et sa taille (Ctrl + E).
2. Geste A avec `sources/cam.html` **au-dessus** de la webcam, puis geste C avec les mêmes chiffres : `?x=1456&y=735&l=400&h=225`.

**Options** : `?nom=0` (sans plaque de nom) · `?titre=Coucou` (petit sticker au-dessus) · `?apercu=1`

---

## 5. Les transitions

Les vidéos sont **déjà prêtes** dans `transitions/videos/` (fond transparent). Pour chacune :

1. Panneau **Transitions de scène** › **+** › **Stinger**, donne-lui un nom.
2. **Fichier vidéo** : la vidéo du tableau.
3. **Type de point de transition** : *Temps (millisecondes)* ; **Point de transition** : la valeur du tableau.
4. **OK**.

| Transition | Vidéo | Point de transition |
|---|---|---|
| 💦 Splash (bande de fluide blanc qui traverse et éclabousse) | `splash.webm` | `1050 ms` |
| 🎨 Gouttes (la peinture coule du haut puis le rideau tombe) | `gouttes.webm` | `1150 ms` |
| 💥 Pop art (onde de choc, trame de points, éclat BD) | `pop-art.webm` | `750 ms` |

Au milieu de chaque transition, ton avatar apparaît dans son anneau néon avec « Changement de scène ! ».

**Une transition par scène** : clic droit sur la scène › **Remplacer la transition**.
**Sans vidéo** : ajoute `transitions/splash.html` (ou une autre) tout en haut de la scène, case *Actualiser…* cochée, transition d'OBS sur **Coupure** : la scène apparaît en se découvrant.

**Refaire les vidéos** (après un changement de couleurs ou d'avatar), dans PowerShell :

```
cd G:\Projets\Overlay\ambries
node outils/generer-transitions.mjs
```

---

## 6. Brancher les alertes avec Streamer.bot

Le **chat** marche tout seul. Les **alertes**, le **bandeau**, l'**objectif** et les derniers noms de l'écran de fin passent par **Streamer.bot**, un logiciel **gratuit** qui tourne sur ton PC pendant le live.

1. Télécharge Streamer.bot sur le site officiel **streamer.bot**, décompresse-le (ex. `C:\Streamer.bot\`) et lance `Streamer.bot.exe`.
2. **Platforms › Twitch › Accounts** : connecte ton compte **Broadcaster**.
3. **Servers/Clients › WebSocket Server** : Address `127.0.0.1`, Port `8080`, coche **Auto Start**, clique **Start Server**.
4. Dans OBS, clic droit sur la source d'alertes › **Actualiser**.

✅ Streamer.bot doit être **lancé à chaque live**.
**Dons** : StreamElements, Streamlabs, Ko-fi ou Tipeee se connectent dans l'onglet **Integrations** de Streamer.bot.

| Événement Twitch | Alerte |
|---|---|
| Follow | **Nouveau témoin !** — va assister au carnage |
| Abonnement | **Soutien moral officiel** — croit encore en moi (courageux) |
| Réabonnement | **Toujours là ?!** — supporte ça depuis X mois |
| Abonnement offert | **Cadeau empoisonné** — offre un abonnement à… |
| Pluie d'abonnements | **Pluie de cadeaux !** *(grande alerte)* |
| Bits | **Pièces de consolation** — envoie X bits pour me remonter le moral |
| Raid | **Invasion !!** — débarque avec X personnes *(grande alerte)* |
| Don | **Fonds pour excuses** — finance ma prochaine excuse |
| Objectif atteint | **Objectif atteint !** — même moi je n'y croyais pas *(grande alerte)* |

---

## 7. Habiller la chaîne Twitch

Tous les visuels sont dans `chaine/` : ouvre `chaine/kit.html` pour les voir. Les images prêtes à envoyer sont dans `chaine/export/`.

| Visuel | Fichier | Où l'envoyer sur Twitch |
|---|---|---|
| Photo de profil | `profil.png` (800 × 800) | Tableau de bord des créateurs › Paramètres › Chaîne › **Marque** › Photo de profil |
| Bannière de profil | `banniere.png` (1200 × 480) | … › **Marque** › Bannière de profil |
| Écran hors-ligne | `hors-ligne.png` (1920 × 1080) | … › **Marque** › Bannière du lecteur vidéo |
| Panneaux de bio | `panneau-a-propos.png`, `panneau-planning.png`, `panneau-regles.png`, `panneau-soutenir.png` (320 × 160) | Ta chaîne › onglet **À propos** › **Modifier les panneaux** › **+** |
| Emotes | `emote-panique`, `lag`, `gg`, `oups`, `exclamation`, `coeur` (-112, -56, -28) | Tableau de bord › **Récompenses des spectateurs** › Emotes *(affilié ou partenaire)* |
| Badges d'abonné | `badge-mois-1` (jauge 20), `-3` (40), `-6` (60), `-9` (80), `-12` (étoile) (-72, -36, -18) | Tableau de bord › **Récompenses des spectateurs** › Badges d'abonné |

Les badges montrent une **jauge de skill** qui se remplit avec l'ancienneté : 1 mois · Témoin, 3 mois · Complice, 6 mois · Soutien moral, 9 mois · Expert en excuses, 1 an · Légende du carnage.

**Les panneaux, pas à pas :**
1. Va sur ta chaîne, onglet **À propos**, active **Modifier les panneaux**.
2. **+** › **Ajouter un panneau texte ou image**.
3. **Image** : choisis le PNG du panneau. **Description** : écris le texte (qui tu es, le planning, les règles du chat…).
4. **Envoyer**, puis recommence pour les autres panneaux.

**Changer les textes** (slogan, texte hors-ligne, planning, titres des panneaux) : `config.js` › `chaine`, puis refais les images dans PowerShell :

```
cd G:\Projets\Overlay\ambries
node outils/exporter-chaine.mjs
```

> Les noms des menus Twitch changent parfois un peu : si tu ne trouves pas un intitulé, cherche « Marque » ou « Récompenses des spectateurs » dans le tableau de bord.

---

## 8. Tester sans être en live

| Option | Effet |
|---|---|
| `?test=1` | faux messages de chat et fausses alertes qui défilent |
| `?apercu=1` | affiche les zones de la cam et du jeu |
| `?minutes=0.5` | *(démarrage)* compte à rebours de 30 s, pour voir la fin vite |
| `?reinitialiser` | remet le compteur de l'objectif à sa valeur de départ |

Le mode test **ne modifie pas** le vrai compteur de l'objectif. Le plus simple : ouvre `index.html`, tout y tourne en mode test.

---

## 9. Personnaliser

| Je veux changer… | Où |
|---|---|
| Les textes, titres, messages | `config.js` |
| La devise (« 10 % skill · 90 % d'excuses ») | `config.js` › `devise` |
| Les phrases du démarrage | `config.js` › `demarrage.phrases` |
| Le vocabulaire des alertes | `config.js` › `alertes.textes` |
| La durée, le volume ou le son des alertes | `config.js` › `alertes.duree`, `alertes.volume`, `alertes.son` |
| Les bots masqués du chat | `config.js` › `chat.ignorer` |
| Les visuels de la chaîne | `config.js` › `chaine` (puis `node outils/exporter-chaine.mjs`) |
| L'avatar | remplace `assets/avatar.png` (carré, 800 × 800 conseillé), puis refais vidéos et images |
| Les couleurs, les polices | début de `css/theme.css` |
| Remettre l'objectif à zéro | changer `objectif.depart` dans `config.js` |

Dans les textes des alertes, `{nom}`, `{montant}`, `{mois}`, `{nombre}` et `{destinataire}` sont remplacés automatiquement.

---

## 10. Dépannage

**Rien ne s'affiche / page blanche**
→ Vérifie `1920` × `1080` sur la source, puis clic droit › **Actualiser**. Si tu viens de modifier `config.js`, cherche un guillemet ou une virgule manquant.

**Les polices ne sont pas les bonnes**
→ Elles sont dans `assets/polices/` (pas besoin d'internet) : vérifie que le dossier est bien là, à côté de `css/`, puis actualise la source.

**Le chat n'affiche rien**
→ Vérifie `chaineTwitch` (identifiant exact, en minuscules). Le chat n'affiche que les messages envoyés **après** l'ouverture de la page.

**Les alertes ne s'affichent pas**
→ Streamer.bot est-il lancé, serveur WebSocket **démarré** (port `8080`), compte Broadcaster connecté ? Actualise la source d'alertes.

**On n'entend pas le son des alertes**
→ Coche **Contrôler l'audio via OBS** sur la source d'alertes et vérifie son volume dans le mélangeur.

**Une alerte s'affiche mal (pseudo manquant, « ? »…)**
→ Clic droit sur la source d'alertes › **Interagir**, puis **F12** › **Console** : chaque événement reçu y est détaillé. Copie la ligne pour faire corriger l'overlay.

**La cam ne tombe pas pile dans le cadre**
→ Refais le geste B, et vérifie que la webcam est bien **sous** l'overlay.

**Le compte à rebours ou le chrono de pause ne repart pas de zéro**
→ Coche **Actualiser le navigateur quand la scène devient active** sur la source.

**Une ancienne image s'affiche encore** (après une modification de `config.js`, de l'avatar ou des couleurs)
→ Dans OBS : clic droit sur la source › **Propriétés** › **Actualiser le cache de la page actuelle**. Dans un navigateur : **Ctrl + F5**.

---

Bon live, et bon courage pour les excuses ! 💜
