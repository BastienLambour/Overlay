# <emoji> <Nom> — Tutoriel d'installation

Ce tutoriel installe l'overlay dans **OBS Studio**, de zéro jusqu'au premier live, puis habille ta **chaîne Twitch**.
Chaque page a sa **fiche** : tu peux suivre une fiche seule, sans lire le reste.

> 💡 Pour tout voir en direct : ouvre `index.html` dans ton navigateur. La version à lire confortablement de ce tutoriel est `TUTO.pdf`.

<!-- GABARIT : garder ce plan et ces intitulés dans tous les overlays.
     Après modification : node outils/generer-pdf.mjs (régénère TUTO.pdf). -->

---

## Sommaire

1. Ce qu'il y a dans le dossier
2. Avant de commencer (réglages, canevas OBS, les 3 gestes de base, chat intégré, actualiser les sources)
3. Les scènes, fiche par fiche : Démarrage · Pause · Fin · Cam seule · Contenu · Jeu (+ …)
4. Les sources à la carte : Alertes · Chat · Bandeau · Objectif · Cadre cam (+ …)
5. Les transitions : <noms>
6. Brancher le chat et les alertes (Streamer.bot, journal, objectif, sons des alertes)
7. Habiller la chaîne Twitch
8. Tester sans être en live
9. Personnaliser (couleurs et ambiances, les scripts)
10. Dépannage

---

## 1. Ce qu'il y a dans le dossier

<arborescence commentée : reglages.html (LA page des réglages), config.js, index.html, TUTO, CONCEPT, scenes/, sources/, transitions/, chaine/,
 outils/ (les scripts, et actualiser-obs.lua pour OBS : voir 9), assets/ (dont polices/), design/, css/ js/>

---

## 2. Avant de commencer

### 2.1 Remplir les réglages avec `reglages.html`

1. Dans le dossier de l'overlay, double-clique sur **`reglages.html`** : la page s'ouvre dans ton navigateur (**Edge** ou **Chrome**).
2. Vérifie au minimum, dans **La chaîne** : le **nom affiché** et ton **identifiant Twitch** (celui de l'adresse `twitch.tv/…`).
3. Dans **Objectif** : choisis ce que la barre affiche (**followers** ou **abonnés**) et ton objectif. Les vrais nombres de la chaîne viennent de Streamer.bot (section 6.6).
4. Clique **💾 Enregistrer mes réglages** (en bas, ou **Ctrl + S**).
5. **La première fois**, une fenêtre s'ouvre : choisis le **dossier de l'overlay** (celui qui contient `reglages.html`), puis **Sélectionner le dossier**. Le navigateur demande s'il peut modifier les fichiers : clique **Modifier les fichiers** (ou **Autoriser**).
   La page écrit alors tes réglages dans le fichier **`mes-reglages.js`**, à côté de `config.js` : rien à copier à la main. Les fois suivantes, elle s'en souvient et enregistre directement (au plus, le navigateur redemande l'autorisation).
6. Dans OBS : **clic droit sur la source › Actualiser** pour voir le changement.

Un **point** • à côté d'un réglage veut dire qu'il a changé et n'est pas encore enregistré. La section **Alertes** montre un aperçu de chaque alerte avec tes textes, et la section **Tester** ouvre les pages en mode test.
**Où vont tes réglages ?** `config.js` contient les **valeurs par défaut** de l'overlay ; **`mes-reglages.js`** contient **seulement ce que tu as changé**, appliqué par-dessus. En haut de la page, un encadré dit combien de réglages perso tu as. Remettre un réglage à sa valeur d'origine le retire de `mes-reglages.js`.

> ℹ️ Avec **Firefox**, la page ne peut pas écrire dans le dossier : elle **télécharge** `mes-reglages.js`, à mettre dans le dossier de l'overlay (à la place de l'ancien). Préfère Edge ou Chrome.

**À la main (sans la page)** : ouvre `config.js` avec le **Bloc-notes** (clic droit › *Ouvrir avec* › *Bloc-notes*). Garde les guillemets `"…"` autour des textes et la virgule `,` en fin de ligne, enregistre, puis **Actualiser** dans OBS. Attention : un changement fait à la main dans `config.js` sera perdu à la prochaine mise à jour ; dans `reglages.html`, il est gardé.

#### Quand tu reçois une nouvelle version de l'overlay
<en un clic : bouton « Mettre à jour l'overlay » du script OBS ou mettre-a-jour.cmd ; mes-reglages.js jamais remplacé ; sauvegardes\<date> (3 dernières) ; page de téléchargement ; à la main : copier par-dessus>

1. Copie les nouveaux fichiers par-dessus les anciens (remplacer).
2. **Ton `mes-reglages.js` n'est pas dans la nouvelle version** : il reste en place, tes réglages sont gardés. Les nouvelles fonctions arrivent avec leurs valeurs par défaut.
3. Dans OBS : actualise les sources.

> 🔁 **La toute première fois seulement** (si tes réglages étaient encore dans l'ancien `config.js`) : **avant** de remplacer les fichiers, fais une copie de ton `config.js` (ex. sur le bureau). Après la mise à jour, ouvre `reglages.html` › **📥 Reprendre les réglages d'un ancien config.js** › choisis cette copie : tes réglages reviennent dans le formulaire (marqués •). Clique **Enregistrer**, c'est fini : ils sont maintenant dans `mes-reglages.js`.

### 2.2 Régler le canevas d'OBS (une seule fois)
<résolution de base / sortie ; si 1440p : les fiches donnent les deux colonnes>

### 2.3 Geste A — ajouter une source Navigateur
<+ › Navigateur, Fichier local, taille du canevas, cases de la fiche>

### 2.4 Geste B — placer une source au pixel près
<Ctrl+E, position, « Mettre à l'échelle à l'extérieur de la zone », taille, Rogner ; 💡 reglages.html › Options des scènes › « Afficher la taille et la position des zones » (ou ?zones=1)>

### 2.5 Geste C — ajouter une option dans l'adresse
<décocher Fichier local, file:///G:/Projets/Overlay/<pseudo>/…?option=…>
<plus simple et pour de bon : reglages.html › Options des scènes (config.js › options) ; l'adresse passe avant>

### 2.6 Astuce — une seule source d'alertes pour toutes les scènes
<scène « Global — Alertes » + règle d'or de l'ordre des sources>

### 2.7 Le chat et le bandeau : déjà dans les scènes
<rien à ajouter ; sources séparées seulement pour une scène à soi, avec ?chat=0 / ?bandeau=0 sur la scène ; mémoire du chat 10 min>

### 2.8 Actualiser toutes les sources d'un coup (après un changement de réglages)
<OBS › Outils › Scripts › + › outils/actualiser-obs.lua : bouton, case « tout seul quand les réglages changent » (config.js ou mes-reglages.js), raccourci clavier ;
 une page actualisée repart de zéro ;
 #### Placer les webcams tout seul : bouton « Placer les webcams sur toutes les scènes (et les ajouter là où elles manquent) » + case
 « Replacer tout seul » ; nom de la webcam avec « cam » ; carte d'acquisition jamais déplacée ; « Pas de webcam » = cachée ; js/zones.js ; 1440p converti ;
 rognage auto OBS 30.1+>

---

## 3. Les scènes, fiche par fiche

### 3.1 <emoji> <Nom> — `scenes/<fichier>.html`

**À quoi ça sert** : <une phrase>

**Dans OBS :**
1. **Scènes › +** : « <Nom> ».
2. **+ › Scène** › « Global — Alertes ».
3. Geste A avec `scenes/<fichier>.html` <+ cases à cocher>.
4. <chaque source placée dessous : type de source OBS, puis geste B avec position et taille>
5. Ordre final : `Global — Alertes` · `Overlay` · `<sources>`.

**Options** (geste C) : <…>
**Vérifier** : <…?apercu=1 ou ?minutes=0.5>

<une fiche par scène>

---

## 4. Les sources à la carte

### 4.1 🔔 Alertes — `sources/alertes.html`
**À quoi ça sert** · **Dans OBS** · **Options** · **Nécessite** Streamer.bot

<une fiche par source>

---

## 5. Les transitions
<étapes Stinger + tableau vidéo / point de transition / pour quelles scènes + « Remplacer la transition » + commande de régénération>

---

## 6. Brancher le chat et les alertes
<tableau « Quoi / Comment ça arrive / À installer » (chat : rien ; alertes : Streamer.bot), puis :
 6.1 Le chat (identifiant Twitch ; emotes, bots, commandes, modération, mémoire ; limites)
 6.2 Installer Streamer.bot (Platforms › Twitch › Accounts › Broadcaster ; WebSocket Server 127.0.0.1:8080, Auto Start, Start Server ;
     reconnexion automatique, peu importe l'ordre de lancement)
 6.3 Vérifier avec le journal : ?journal=1 sur la source d'alertes (OBS n'a pas de F12) ; « ✅ Connecté » ; retirer ensuite
 6.4 Événement par événement (tableau du vocabulaire ; conditions affilié)
 6.8 Les sons des alertes (tableau : un son par alerte ; reglages.html › Sons des alertes, ▶ ; fichier perso dans sons/ ; « aucun »)
 6.5 Les dons (Integrations de Streamer.bot ; décocher la case du bandeau si pas de dons)
 6.6 L'objectif (une barre : followers OU abonnés ; A choisir ; B action Streamer.bot « Overlay – Compteurs » = outils/streamerbot-compteurs.cs
     + Timed Action 5 min ; vérifier « 📊 Compteurs de la chaîne » dans ?journal=1 ; sans Streamer.bot : nombre de départ)
 6.7 Tester les vraies alertes (?test=1, un ami qui suit la chaîne)>

---

## 7. Habiller la chaîne Twitch
<tableau visuel / fichier de chaine/export/ / où l'envoyer (Marque, À propos › panneaux, Récompenses des spectateurs) + panneaux pas à pas + node outils/exporter-chaine.mjs>

---

## 8. Tester sans être en live
<tableau des options ?test=1, ?apercu=1, ?journal=1, ?chat=0 / ?bandeau=0 / ?cam=0…>

---

## 9. Personnaliser
Presque tout se règle dans **`reglages.html`** (2.1), sans toucher au code.
<tableau « Je veux changer… / Où » : d'abord reglages.html › <section>>

### Changer d'ambiance (Halloween, Noël…) en un clic
<reglages.html › Couleurs : ambiances en un clic, nuanciers, ↺ ; « Mes ambiances » : nommer + 💾 Sauvegarder ces couleurs (écrit mes-reglages.js › ambiances), clic = remettre, × = supprimer ; puis refaire vidéos et kit avec les scripts>

### Les scripts du dossier `outils/`
<installer Node.js LTS (nodejs.org ou winget install OpenJS.NodeJS.LTS) + ffmpeg (winget install Gyan.FFmpeg) ; ouvrir le Terminal
 dans le dossier ; tableau Script / À quoi il sert / Quand / Commande : actualiser-obs.lua, generer-transitions, exporter-chaine,
 generer-pdf, capturer, polices-locales (+ scripts propres à l'overlay)>

---

## 10. Dépannage
<problèmes fréquents : page blanche, polices, chat vide, alertes, son, alerte mal affichée (journal ?journal=1), les réglages ne changent rien (actualiser / script), cam décalée, compte à rebours, ancienne image encore affichée (Ctrl+F5 / OBS › Actualiser le cache de la page actuelle), réglages disparus après une mise à jour (garder mes-reglages.js ; 📥 reprendre un ancien config.js)>
