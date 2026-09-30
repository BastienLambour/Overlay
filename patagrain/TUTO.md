# 🎭 Patagrain — Tutoriel d'installation

Ce tutoriel installe l'overlay dans **OBS Studio**, de zéro jusqu'au premier live, puis habille ta **chaîne Twitch**.
Chaque page a sa **fiche** : tu peux suivre une fiche seule, sans lire le reste.

> 💡 Pour tout voir en direct : ouvre `index.html` dans ton navigateur. La version à lire confortablement de ce tutoriel est `TUTO.pdf`.

---

## Sommaire

1. Ce qu'il y a dans le dossier
2. Avant de commencer (config, réglages OBS, les 3 gestes de base)
3. Les scènes, fiche par fiche : Starting soon · Pause · Fin · Cam seule · Contenu · Jeu
4. Les sources à la carte : Alertes · Chat · Bandeau · Objectif · Cadre cam
5. Les transitions : Rideau · Coup d'épée · Jet de dé (avec le bouffon)
6. Brancher les alertes avec Streamer.bot
7. Habiller la chaîne Twitch
8. Tester sans être en live
9. Personnaliser
10. Dépannage

---

## 1. Ce qu'il y a dans le dossier

```
patagrain/
├── config.js            ← LE fichier à modifier (textes, chaîne, objectif…)
├── index.html           ← aperçu de tout + mini-guide
├── TUTO.md / TUTO.pdf   ← ce tutoriel
├── CONCEPT.md / .pdf    ← le résumé du projet (DA, choix, ce qu'il reste à faire)
├── scenes/              ← les écrans et overlays de scène (une page = une scène OBS)
├── sources/             ← les éléments à poser où tu veux (alertes, chat…)
├── transitions/         ← les transitions (+ videos/ : prêtes pour OBS)
├── chaine/              ← kit de chaîne Twitch (kit.html + export/ : les PNG)
├── outils/              ← scripts : vidéos de transition, images de la chaîne, PDF, le bouffon
├── assets/              ← logo (+ version à contour crème), emblèmes, épée, chapeau, le bouffon, polices/
├── design/              ← moodboard et pistes de logo
└── css/  js/            ← le moteur (pas besoin d'y toucher)
```

Toutes les pages sont dessinées en **1920 × 1080** et **s'adaptent toutes seules** à la taille de la source (1440p compris), en restant nettes.

---

## 2. Avant de commencer

### 2.1 Remplir `config.js`

Ouvre `config.js` avec le **Bloc-notes** (clic droit › *Ouvrir avec* › *Bloc-notes*) et vérifie au minimum :

```js
nomChaine: "Patagrain",            // le nom affiché sur l'overlay
chaineTwitch: "patagrain",         // l'identifiant dans l'adresse twitch.tv/xxxx (en minuscules)
titreDuJour: "Donjons & Dragons — La quête du grelot perdu",
objectif: { type: "follow", titre: "Guilde des aventuriers", cible: 50,
            depart: 0 },           // ← ton nombre ACTUEL de followers
```

⚠️ Garde les guillemets `"…"` autour des textes et la virgule `,` en fin de ligne. Les apostrophes ne posent pas de problème.
Après chaque modification : **enregistre**, puis dans OBS **clic droit sur la source › Actualiser**.

### 2.2 Régler le canevas d'OBS (une seule fois)

**Paramètres › Vidéo** :

| Paramètre | Valeur conseillée |
|---|---|
| Résolution de base (canevas) | `2560 × 1440` (celle de ton écran) |
| Résolution de sortie | `1920 × 1080` |
| Filtre de mise à l'échelle | Lanczos |

Dans les fiches, les positions sont données pour **les deux canevas** : prends la colonne qui correspond au tien.

### 2.3 Geste A — ajouter une source Navigateur

C'est la même manipulation pour **tous** les fichiers `.html` :

1. Sélectionne la scène, puis dans **Sources** : **+** › **Navigateur**.
2. Donne un nom à la source, puis **OK**.
3. Coche **Fichier local**, **Parcourir**, choisis le fichier `.html` indiqué dans la fiche.
4. **Largeur / Hauteur** : la taille de ton canevas (`2560` × `1440`, ou `1920` × `1080`).
5. Coche les cases indiquées dans la fiche (par exemple *Actualiser le navigateur quand la scène devient active*).
6. **OK**.

### 2.4 Geste B — placer une source au pixel près

Pour la webcam, le jeu ou une capture, sous un overlay :

1. Clique sur la source dans la liste, puis **Ctrl + E** (ou clic droit › *Transformer* › *Modifier la transformation*).
2. **Position** : les valeurs x et y de la fiche.
3. **Type de zone de délimitation** : *Mettre à l'échelle à l'extérieur de la zone*.
4. **Taille de la zone de délimitation** : la largeur et la hauteur de la fiche.
5. Coche **Rogner à la zone de délimitation**, puis **Fermer**.

La source remplit alors tout le cadre, sans bande noire : ce qui dépasse est coupé.

### 2.5 Geste C — ajouter une option dans l'adresse

Certaines pages acceptent des options (durée, coin de la cam…). Un fichier local n'en accepte pas :

1. Dans la source Navigateur, **décoche** *Fichier local*.
2. Colle l'adresse complète dans **URL**, avec les options après un `?` :

```
file:///G:/Projets/Overlay/patagrain/scenes/demarrage.html?minutes=10
```

Plusieurs options se séparent par `&` : `...jeu.html?cam=bas-gauche&test=1`

### 2.6 Astuce — une seule source d'alertes pour toutes les scènes

1. **Scènes › +** : crée une scène **« Global — Alertes »**.
2. Ajoutes-y `sources/alertes.html` (fiche 4.1).
3. Dans chaque autre scène : **Sources › + › Scène** › « Global — Alertes », tout **en haut** de la liste.

> 🔑 **Règle d'or** : dans OBS, ce qui est **en haut** de la liste s'affiche **par-dessus**. Les alertes tout en haut, l'overlay au-dessus de la webcam et du jeu.

---

## 3. Les scènes, fiche par fiche

### 3.1 🎭 Starting soon — `scenes/demarrage.html`

**À quoi ça sert** : l'écran d'avant-live, « Le spectacle va commencer », avec le compte à rebours « Jet d'initiative » (à zéro : « Les dés sont jetés ! »).

**Dans OBS :**
1. **Scènes › +** : « Starting soon ».
2. **Sources › + › Scène** › « Global — Alertes » (voir 2.6).
3. Geste A avec `scenes/demarrage.html`, case **Actualiser le navigateur quand la scène devient active** cochée.
4. Ordre final : `Global — Alertes` puis `Écran`.

**Options** (geste C) : `?minutes=10` (durée, 5 min par défaut) · `?heure=20:30` (heure fixe) · `?titre=…` · `?titreDuJour=…`
**Vérifier** : ouvre `scenes/demarrage.html?minutes=0.5` dans ton navigateur, le décompte dure 30 s.

### 3.2 🔥 Pause — `scenes/pause.html`

**À quoi ça sert** : le « Repos court » avec le feu de camp et le chat « La taverne ».

**Dans OBS :**
1. **Scènes › +** : « Pause ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/pause.html`, case **Actualiser le navigateur quand la scène devient active** cochée.

**Options** : `?minutes=10` (affiche « Retour dans 10:00 ») · `?titre=…` · `?sousTitre=…`

### 3.3 📜 Fin — `scenes/fin.html`

**À quoi ça sert** : « Fin de la session », remerciements, et la carte « Prochaine quête ».

**Dans OBS :**
1. **Scènes › +** : « Fin ».
2. Geste A avec `scenes/fin.html`, case **Actualiser le navigateur quand la scène devient active** cochée.

**Options** : `?prochainStream=Jeudi%2020h30` (ou remplis `fin.prochainStream` dans `config.js`) · `?titre=…` · `?sousTitre=…`

### 3.4 🎙 Cam seule — `scenes/cam-seule.html`

**À quoi ça sert** : l'écran « blabla » : accueil et discussion, ta cam en grand, le chat à côté, le bandeau en bas.

**Dans OBS :**
1. **Scènes › +** : « Cam seule ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/cam-seule.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam », choisis ta caméra.
5. Geste B sur la webcam :

| Canevas | Position (x, y) | Taille (l × h) |
|---|---|---|
| 2560 × 1440 | `93`, `200` | `1653` × `931` |
| 1920 × 1080 | `70`, `150` | `1240` × `698` |

6. Ordre final : `Global — Alertes` · `Overlay` · `Webcam`.

**Vérifier** : mets temporairement l'adresse `cam-seule.html?apercu=1` (geste C) : la zone de la cam est grisée. Retire `?apercu=1` ensuite.

### 3.5 🖥 Contenu — `scenes/contenu.html`

**À quoi ça sert** : le contenu (navigateur, vidéo, fenêtre…) à gauche, la cam et le chat empilés à droite.

**Dans OBS :**
1. **Scènes › +** : « Contenu ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/contenu.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam ».
5. **+ › Capture de fenêtre** (ou *Capture d'écran*, *Navigateur*…) › « Contenu ».
6. Geste B sur chacune :

| Source | Position 1440p | Taille 1440p | Position 1080p | Taille 1080p |
|---|---|---|---|---|
| Contenu | `80`, `173` | `1707` × `960` | `60`, `130` | `1280` × `720` |
| Webcam | `1867`, `200` | `613` × `345` | `1400`, `150` | `460` × `259` |

7. Ordre final : `Global — Alertes` · `Overlay` · `Webcam` · `Contenu`.

**Options** : `?titre=Mon%20titre` (étiquette au-dessus du contenu, `?titre=` pour la masquer)

### 3.6 ⚔️ Jeu — `scenes/jeu.html`

**À quoi ça sert** : le jeu en plein écran, une petite cam dans un coin, le chat en transparence et une barre fine.

**Dans OBS :**
1. **Scènes › +** : « Jeu ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/jeu.html`.
4. **+ › Périphérique de capture vidéo** › « Webcam ».
5. **+ › Capture de jeu** › « Jeu ».
6. Geste B : le **Jeu** en `0`, `0`, taille du canevas (plein écran) ; la **Webcam** selon le coin choisi :

| Coin (option `cam`) | Position 1440p | Position 1080p |
|---|---|---|
| `bas-droite` *(défaut)* | `1933`, `987` | `1450`, `740` |
| `bas-gauche` | `67`, `987` | `50`, `740` |
| `haut-droite` | `1933`, `173` | `1450`, `130` |
| `haut-gauche` | `67`, `173` | `50`, `130` |

Taille de la webcam : `560` × `315` en 1440p, `420` × `236` en 1080p.

7. Ordre final : `Global — Alertes` · `Overlay` · `Webcam` · `Jeu`.

**Options** : `?cam=bas-gauche` (le chat passe automatiquement de l'autre côté).

---

## 4. Les sources à la carte

Ces pages se posent **en plus**, dans n'importe quelle scène, pour composer tes propres mises en page. Chacune se règle avec `?x=&y=&l=&h=` (position et taille en pixels 1920 × 1080).

### 4.1 🔔 Alertes — `sources/alertes.html`

**À quoi ça sert** : follows, abonnements, bits, raids et dons, avec le tintement des grelots (petite fanfare pour les grosses alertes).

**Dans OBS :**
1. Dans la scène « Global — Alertes » (voir 2.6) : geste A avec `sources/alertes.html`.
2. Coche **Contrôler l'audio via OBS** : le son apparaît dans le mélangeur audio, règle son volume.

**Options** : `?position=haut` (défaut), `centre` ou `bas` · `?test=1`
**Nécessite** Streamer.bot (section 6).

### 4.2 💬 Chat — `sources/chat.html`

**À quoi ça sert** : le chat seul, déjà inclus dans les scènes ; utile pour une scène à toi.

**Dans OBS :** geste A avec `sources/chat.html`, puis geste C pour le placer.
**Options** : `?x=1400&y=90&l=480&h=800` · `?flottant=1` (sans carte, messages posés sur le jeu) · `?disparition=45` (messages effacés après 45 s) · `?test=1`

### 4.3 📰 Bandeau — `sources/bandeau.html`

**À quoi ça sert** : titre du jour, dernier aventurier, dernier chevalier, dernier tribut et objectif.
**Dans OBS :** geste A avec `sources/bandeau.html`.
**Options** : `?x=60&y=950&l=1800&h=100` · `?compact=1` (dernier aventurier + objectif) · `?test=1`

### 4.4 ⚔️ Objectif — `sources/objectif.html`

**À quoi ça sert** : la jauge « Guilde des aventuriers » où l'épée avance à chaque follow (ou abonnement, selon `config.js`).
**Dans OBS :** geste A avec `sources/objectif.html`.
**Options** : `?x=560&y=40&l=800&h=150` · `?test=1`

### 4.5 🎩 Cadre cam — `sources/cam.html`

**À quoi ça sert** : le cadre de webcam seul (chapeau au-dessus, dés en bas), pour une cam placée où tu veux.

**Dans OBS :**
1. Place ta webcam où tu veux et note sa position et sa taille (Ctrl + E).
2. Geste A avec `sources/cam.html`, **au-dessus** de la webcam, puis geste C avec les mêmes chiffres : `?x=1450&y=740&l=420&h=236`.

**Options** : `?nom=1` (plaque dorée au nom de la chaîne) · `?decor=0` (sans chapeau ni dés) · `?apercu=1`

---

## 5. Les transitions

Les trois transitions mettent en scène **le bouffon**, la mascotte de la chaîne. Les vidéos sont **déjà prêtes** dans `transitions/videos/` (fond transparent). Pour chacune :

1. Panneau **Transitions de scène** › **+** › **Stinger**, donne-lui un nom.
2. **Fichier vidéo** : la vidéo du tableau.
3. **Type de point de transition** : *Temps (millisecondes)* ; **Point de transition** : la valeur du tableau.
4. **OK**.

| Transition | Vidéo | Point de transition | Pour |
|---|---|---|---|
| 🎭 Rideau — le bouffon tire la corde du rideau | `rideau.webm` | `1400 ms` | Starting soon → Cam seule, et vers la Fin |
| ⚔️ Coup d'épée — le bouffon tranche l'écran | `epee.webm` | `700 ms` | Cam seule → Jeu |
| 🎲 Jet de dé — le bouffon marche sur le dé qui roule | `de.webm` | `1750 ms` | Jeu ↔ Pause, Contenu |

**Une transition par scène** : clic droit sur la scène › **Remplacer la transition** › choisis-la.

**Sans vidéo** : ajoute la page (ex. `transitions/epee.html`) **tout en haut** de la scène d'arrivée, case *Actualiser…* cochée, et mets la transition d'OBS sur **Coupure**.

**Refaire les vidéos** (après un changement de couleurs ou du bouffon), dans PowerShell :

```
cd G:\Projets\Overlay\patagrain
node outils/generer-transitions.mjs
```

---

## 6. Brancher les alertes avec Streamer.bot

Le **chat** marche tout seul. Les **alertes**, le **bandeau** et l'**objectif** passent par **Streamer.bot**, un logiciel **gratuit** qui tourne sur ton PC pendant le live.

1. Télécharge Streamer.bot sur le site officiel **streamer.bot**, décompresse-le (ex. `G:\Applications\Streamer.bot\`) et lance `Streamer.bot.exe`.
2. **Platforms › Twitch › Accounts** : connecte ton compte **Broadcaster**.
3. **Servers/Clients › WebSocket Server** : Address `127.0.0.1`, Port `8080`, coche **Auto Start**, clique **Start Server**.
4. Dans OBS, clic droit sur la source d'alertes › **Actualiser**.

✅ Streamer.bot doit être **lancé à chaque live**.
**Dons** : si tu utilises StreamElements, Streamlabs, Ko-fi ou Tipeee, connecte-le dans l'onglet **Integrations** de Streamer.bot.

| Événement Twitch | Alerte |
|---|---|
| Follow | **Nouvel aventurier** — rejoint la cour du roi ! |
| Abonnement | **Adoubement !** — devient chevalier de la cour |
| Réabonnement | **Chevalier fidèle** — sert la cour depuis X mois |
| Abonnement offert | **Présent royal** — adoube… |
| Pluie d'abonnements | **Largesse royale !** *(grande alerte)* |
| Bits | **Tribut au bouffon** — lance X pièces d'or |
| Raid | **Une horde débarque !** *(grande alerte)* |
| Don | **Offrande royale** — offre X au royaume |
| Objectif atteint | **Objectif atteint !** *(grande alerte)* |

---

## 7. Habiller la chaîne Twitch

Tous les visuels sont dans `chaine/` : ouvre `chaine/kit.html` pour les voir. Les images prêtes à envoyer sont dans `chaine/export/`.

| Visuel | Fichier | Où l'envoyer sur Twitch |
|---|---|---|
| Photo de profil | `profil.png` (800 × 800) | Tableau de bord des créateurs › Paramètres › Chaîne › **Marque** › Photo de profil |
| Bannière de profil | `banniere.png` (1200 × 480) | … › **Marque** › Bannière de profil |
| Écran hors-ligne | `hors-ligne.png` (1920 × 1080) | … › **Marque** › Bannière du lecteur vidéo |
| Panneaux de bio | `panneau-a-propos.png`, `panneau-planning.png`, `panneau-regles.png`, `panneau-soutenir.png` (320 × 160) | Ta chaîne › onglet **À propos** › **Modifier les panneaux** › **+** |
| Emotes | `emote-nat20`, `nat1`, `gg`, `grelot`, `epee`, et le bouffon : `bouffon`, `bouffon-clin`, `bouffon-rire`, `bouffon-choc` (-112, -56, -28) | Tableau de bord › **Récompenses des spectateurs** › Emotes *(affilié ou partenaire)* |
| Badges d'abonné | `badge-mois-1` (d4), `-3` (d6), `-6` (d8), `-9` (bouclier), `-12` (d20) (-72, -36, -18) | Tableau de bord › **Récompenses des spectateurs** › Badges d'abonné |

**Les panneaux, pas à pas :**
1. Va sur ta chaîne, onglet **À propos**, active **Modifier les panneaux**.
2. **+** › **Ajouter un panneau texte ou image**.
3. **Image** : choisis le PNG du panneau. **Description** : écris le texte (qui tu es, le planning, les règles du chat…).
4. **Envoyer**, puis recommence pour les autres panneaux.

**Changer les textes** (slogan, planning, titres des panneaux) : `config.js` › `chaine`, puis refais les images dans PowerShell :

```
cd G:\Projets\Overlay\patagrain
node outils/exporter-chaine.mjs
```

> Les noms des menus Twitch changent parfois un peu : si tu ne trouves pas un intitulé, cherche « Marque » ou « Récompenses des spectateurs » dans le tableau de bord.

---

## 8. Tester sans être en live

| Option | Effet |
|---|---|
| `?test=1` | faux messages de chat et fausses alertes qui défilent |
| `?apercu=1` | affiche les zones de la cam et du jeu |
| `?minutes=0.5` | *(Starting soon)* compte à rebours de 30 s |
| `?mode=complet` | *(transitions)* animation entière |

Le mode test **ne modifie pas** le vrai compteur de l'objectif. Le plus simple : ouvre `index.html` dans ton navigateur, tout y tourne en mode test.

---

## 9. Personnaliser

| Je veux changer… | Où |
|---|---|
| Les textes, titres, messages | `config.js` |
| Le vocabulaire des alertes | `config.js` › `alertes.textes` |
| La durée, le volume ou le son des alertes | `config.js` › `alertes.duree`, `alertes.volume`, `alertes.son` |
| Les bots masqués du chat | `config.js` › `chat.ignorer` |
| Les visuels de la chaîne | `config.js` › `chaine` (puis `node outils/exporter-chaine.mjs`) |
| Les couleurs | début de `css/theme.css` (palette « Royal bleu & or »), puis refaire les vidéos et le kit |
| Les polices | fichiers dans `assets/polices/` (déjà fournis : Grenze Gotisch et Nunito), déclarés au début de `css/theme.css` |
| Le bouffon ou son chapeau | `outils/generer-bouffon.mjs` : `node outils/generer-bouffon.mjs` refait le bouffon, le chapeau et le logo, puis refaire les vidéos et le kit |
| Remettre l'objectif à zéro | changer `objectif.depart` dans `config.js` |

Dans les textes des alertes, `{nom}`, `{montant}`, `{mois}`, `{nombre}` et `{destinataire}` sont remplacés automatiquement.

---

## 10. Dépannage

**Une ancienne image s'affiche encore (ancien chapeau, ancienne couleur)**
→ Dans le navigateur : **Ctrl + F5** (recharge en ignorant la mémoire du navigateur).
→ Dans OBS : clic droit sur la source › **Propriétés** › **Actualiser le cache de la page actuelle**.

**Rien ne s'affiche / page blanche**
→ Vérifie la taille de la source (celle du canevas), puis clic droit › **Actualiser**. Si tu viens de modifier `config.js`, cherche un guillemet ou une virgule manquant.

**L'overlay est décalé ou trop petit**
→ La source doit faire **exactement** la taille du canevas. Clic droit › *Transformer* › *Réinitialiser la transformation*.

**Les polices ne sont pas les bonnes**
→ Elles sont dans `assets/polices/` (pas besoin d'internet) : vérifie que le dossier est bien là, à côté de `css/`, puis actualise la source.

**Le chat n'affiche rien**
→ Vérifie `chaineTwitch` (identifiant exact, en minuscules). Le chat n'affiche que les messages envoyés **après** l'ouverture de la page.

**Les alertes ne s'affichent pas**
→ Streamer.bot est-il lancé, serveur WebSocket **démarré** (port `8080`), compte Broadcaster connecté ? Actualise la source d'alertes.

**On n'entend pas les grelots**
→ Coche **Contrôler l'audio via OBS** sur la source d'alertes, puis vérifie son volume dans le mélangeur.

**Une alerte s'affiche mal (pseudo manquant, « ? »…)**
→ Clic droit sur la source d'alertes › **Interagir**, puis **F12** › **Console** : chaque événement reçu y est détaillé. Copie la ligne pour faire corriger l'overlay.

**La cam ne tombe pas pile dans le cadre**
→ Refais le geste B avec les chiffres de ton canevas, et vérifie que la webcam est bien **sous** l'overlay.

**Le compte à rebours ne repart pas de zéro**
→ Coche **Actualiser le navigateur quand la scène devient active** sur la source.

---

Bon live, et que les dés te soient favorables ! 🎲
