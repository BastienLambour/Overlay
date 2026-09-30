# <emoji> <Nom> — Tutoriel d'installation

Ce tutoriel installe l'overlay dans **OBS Studio**, de zéro jusqu'au premier live, puis habille ta **chaîne Twitch**.
Chaque page a sa **fiche** : tu peux suivre une fiche seule, sans lire le reste.

> 💡 Pour tout voir en direct : ouvre `index.html` dans ton navigateur. La version à lire confortablement de ce tutoriel est `TUTO.pdf`.

<!-- GABARIT : garder ce plan et ces intitulés dans tous les overlays.
     Après modification : node outils/generer-pdf.mjs (régénère TUTO.pdf). -->

---

## Sommaire

1. Ce qu'il y a dans le dossier
2. Avant de commencer (config, réglages OBS, les 3 gestes de base)
3. Les scènes, fiche par fiche : Démarrage · Pause · Fin · Cam seule · Contenu · Jeu (+ …)
4. Les sources à la carte : Alertes · Chat · Bandeau · Objectif · Cadre cam (+ …)
5. Les transitions : <noms>
6. Brancher les alertes avec Streamer.bot
7. Habiller la chaîne Twitch
8. Tester sans être en live
9. Personnaliser
10. Dépannage

---

## 1. Ce qu'il y a dans le dossier

<arborescence commentée : config.js, index.html, TUTO, CONCEPT, scenes/, sources/, transitions/, chaine/, outils/, assets/, design/, css/ js/>

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
<résolution de base / sortie ; si 1440p : les fiches donnent les deux colonnes>

### 2.3 Geste A — ajouter une source Navigateur
<+ › Navigateur, Fichier local, taille du canevas, cases de la fiche>

### 2.4 Geste B — placer une source au pixel près
<Ctrl+E, position, « Mettre à l'échelle à l'extérieur de la zone », taille, Rogner>

### 2.5 Geste C — ajouter une option dans l'adresse
<décocher Fichier local, file:///G:/Projets/Overlay/<pseudo>/…?option=…>

### 2.6 Astuce — une seule source d'alertes pour toutes les scènes
<scène « Global — Alertes » + règle d'or de l'ordre des sources>

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

## 6. Brancher les alertes avec Streamer.bot
<4 étapes + dons + tableau du vocabulaire des alertes>

---

## 7. Habiller la chaîne Twitch
<tableau visuel / fichier de chaine/export/ / où l'envoyer (Marque, À propos › panneaux, Récompenses des spectateurs) + panneaux pas à pas + node outils/exporter-chaine.mjs>

---

## 8. Tester sans être en live
<tableau des options ?test=1, ?apercu=1…>

---

## 9. Personnaliser
<tableau « Je veux changer… / Où »>

---

## 10. Dépannage
<problèmes fréquents : page blanche, polices, chat vide, alertes, son, alerte mal affichée (F12), cam décalée, compte à rebours, ancienne image encore affichée (Ctrl+F5 / OBS › Actualiser le cache de la page actuelle)>
