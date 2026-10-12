# Patagrain — Tuto de la scène JDR et du bot Discord

Ce tuto explique tout, de A à Z, pour streamer tes parties de jeu de rôle avec la scène JDR :
la table CodexVTT en grand, les cartes des héros qui s'animent quand leur joueur parle sur Discord,
les PV, le « à terre », et les héros qui jouent leurs jets de dés à l'écran.

Tu peux le suivre sans avoir lu le tuto général (`TUTO.pdf`). Compte environ **45 minutes** la
première fois, puis **2 minutes** avant chaque partie (chapitre 6).

## Sommaire

1. Comment ça marche
2. La scène dans OBS
3. La table de jeu : qui joue qui
4. Brancher CodexVTT
5. Le bot Discord : qui parle
6. Avant chaque partie
7. Tester sans rien brancher
8. Dépannage
9. Ce qui n'a pas encore été testé en vrai

## 1. Comment ça marche

L'écran est fait en **1920 × 1080**. Il s'adapte tout seul à ton canevas OBS en **2560 × 1440**.

| Zone | Où | Ce qu'on y voit |
|---|---|---|
| La table | en grand à gauche (1500 × 844) | ta fenêtre CodexVTT, capturée par OBS **sous** l'overlay (c'est un trou transparent) |
| Les cartes des héros | sous la table | le MJ et chaque personnage : nom, joueur, PV, « à terre », celui qui parle |
| Le titre de la campagne | en haut à droite | « La Malédiction de Pangée », avec l'emblème |
| Le chat | à droite, sous le titre | le chat Twitch (« La taverne ») |
| L'arène des jets | au même endroit que le chat | pendant un jet de dés, le héros vient le jouer (le chat s'efface, puis revient) |

Trois choses envoient des informations à l'overlay. Aucune n'est obligatoire : sans elles, la scène
s'affiche quand même, les cartes restent simplement immobiles.

- **CodexVTT** (ta table de jeu) : les jets de dés, les PV, le tour de combat, la forme de Trayss.
  L'overlay ne fait que **regarder** : il ne voit ni tes jets privés, ni tes fiches de MJ, ni la carte.
- **Le bot Discord** (sur ton VPS) : qui parle dans le salon vocal.
- **StreamElements** : les alertes (follow, sub…), comme dans toutes les scènes.

## 2. La scène dans OBS

### 2.1 Créer la scène

1. **Scènes › +** : nomme-la « JDR ».
2. Si tu as la scène « Global — Alertes » (tuto général, 2.6) : **Sources › + › Scène** › « Global — Alertes ».

### 2.2 L'overlay

1. **Sources › + › Navigateur**, nomme-la « Overlay JDR », **OK**.
2. Coche **Fichier local**, **Parcourir** › `patagrain/scenes/jdr.html`.
3. **Largeur** `2560`, **Hauteur** `1440` (ou `1920` × `1080` si ton canevas est en 1080p).
4. Coche **Arrêter la source lorsqu'elle n'est pas visible** (en anglais : *Shutdown source when not visible*). C'est grâce à elle que le bot Discord sait
   que tu es en JDR (chapitre 5) : la page ne tourne que quand la scène est affichée.
5. Coche **Actualiser le navigateur quand la scène devient active**.
6. **OK**.

### 2.3 La table (ta fenêtre CodexVTT)

1. Ouvre CodexVTT dans ton navigateur, sur la table de la partie. Mets la fenêtre dans un format
   proche de 16:9, et cache ce qui ne doit pas passer à l'écran (onglets, favoris).
2. Dans la scène JDR : **Sources › + › Capture de fenêtre**, nomme-la « Table », choisis la fenêtre du
   navigateur, **OK**.
3. Glisse « Table » **sous** « Overlay JDR » dans la liste des sources.
4. Clique sur « Table », puis **Ctrl + E** :
   - **Position** et **Taille de la zone de délimitation** :

     | Canevas | Position | Taille |
     |---|---|---|
     | 2560 × 1440 | `53`, `48` | `2000` × `1125` |
     | 1920 × 1080 | `40`, `36` | `1500` × `844` |

   - **Type de zone de délimitation** : *Mettre à l'échelle à l'extérieur de la zone*.
   - Coche **Rogner à la zone de délimitation**, puis **Fermer**.
5. Si des bords de la fenêtre restent visibles (barre d'adresse…) : **Alt + glisser** un bord de la
   source pour la rogner.

> 💡 Pour voir la zone de la table : ouvre `scenes/jdr.html?apercu=1` dans ton navigateur.

> ⚠️ OBS montre **ta** vue de MJ : brouillard levé, jetons cachés… Ne montre à l'écran que ce que les
> joueurs peuvent voir. Une « vue joueur » à mettre directement dans OBS est à l'étude avec CodexVTT.

### 2.4 Le son de Discord (pour que le stream entende les joueurs)

1. **Sources › + › Capture audio d'application**, choisis **Discord**, **OK**.
2. Dans le **Mélangeur audio**, règle son volume pour qu'il ne couvre pas ta voix.

### 2.5 L'ordre final des sources (de haut en bas)

1. `Global — Alertes`
2. `Overlay JDR`
3. `Table`
4. `Discord` (son)

### 2.6 Les options de la scène

À écrire après `jdr.html` dans l'adresse de la source. Il faut alors décocher *Fichier local* et coller
l'adresse complète, par exemple `file:///G:/Projets/Overlay/patagrain/scenes/jdr.html?chat=0`.

| Option | Effet |
|---|---|
| `?chat=0` | pas de chat (aussi dans `reglages.html` › Options des scènes) |
| `?titre=…` | un autre titre que celui des réglages, pour un soir |
| `?test=1` | de faux jets, PV et paroles, pour voir (chapitre 7) |
| `?apercu=1` | montre la zone de la table |
| `?journal=1` | l'état des connexions à CodexVTT et à Discord, à l'écran (chapitre 8) |

## 3. La table de jeu : qui joue qui

Ouvre `reglages.html` (dans le dossier de l'overlay), section **Scène JDR**.

### 3.1 Les réglages de la scène

| Réglage | À quoi il sert |
|---|---|
| Nom de la campagne | le titre en haut à droite |
| Ceux qui se taisent sont un peu éteints | pendant que quelqu'un parle, les autres cartes pâlissent |
| Le résultat d'un jet reste affiché … secondes | une fois les dés posés (4 par défaut ; 2 au plus si d'autres jets attendent) |
| Jouer aussi les jets de mes PNJ et créatures | tes jets **publics** de PNJ, joués par un aventurier encapuchonné (4.4) |
| Couleur de la cape des PNJ | bordeaux par défaut |

### 3.2 Le tableau « la table de jeu »

Une ligne par place : le maître du jeu, puis les places 1 à 6.

| Colonne | Quoi mettre |
|---|---|
| Présent | décoche pour une place vide ce soir (la carte disparaît) |
| Joueur | son prénom ou pseudo (écrit sous le nom du personnage) |
| Personnage | le dessin : Patagrain (MJ), Zokhran, Namerya, Kenai, Trayss (3 formes), Ba Heng Ze, Dvergrost, ou **Autre** |
| Nom du personnage | vide = celui du dessin. Sert à le renommer, et **obligatoire pour « Autre »** |
| Sous-titre | vide = celui du dessin (« Poète de la marmite »…) |
| Discord | son **pseudo Discord** (celui de son profil) ou son nom affiché sur ton serveur |

**Clique sur Enregistrer**, puis actualise la source dans OBS (ou le bouton « Actualiser toutes les
sources Navigateur » du script `actualiser-obs.lua`).

### 3.3 Un nouveau joueur, un nouveau personnage

Pas besoin de dessin :

1. Sur sa ligne, choisis **Personnage › Autre : portrait de sa fiche CodexVTT**.
2. **Nom du personnage** : exactement le nom de sa fiche CodexVTT. Un début suffit : « Elwen » retrouve
   « Elwen la Rousse ».
3. Sa carte prend l'**image de sa fiche** dès que CodexVTT est branché. Avant, et dans l'arène des jets,
   c'est un **aventurier encapuchonné** à la couleur de sa carte.

### 3.4 Comment l'overlay reconnaît les personnages

Par leur **nom** : le nom de la fiche CodexVTT doit commencer comme celui de la carte (« Kenai »,
« Ba Heng Ze »…). Les accents et les majuscules ne comptent pas.

## 4. Brancher CodexVTT

### 4.1 La clé spectateur (une fois)

1. Dans CodexVTT : **Tableau de bord › Modifier la table › « Overlay de stream (spectateur) » › Créer une clé**.
2. La clé ne s'affiche **qu'une fois** : copie-la tout de suite. L'adresse à utiliser est écrite juste en dessous.
3. Dans `reglages.html` › **Scène JDR** :
   - coche **Brancher CodexVTT** ;
   - **Adresse de CodexVTT** : celle de ton site, sans rien après (`https://…`) ;
   - **Clé spectateur de la table** : colle la clé.
4. **Enregistrer**, puis actualise la source dans OBS.

La clé est secrète : elle reste sur ton PC (dans `mes-reglages.js`), jamais dans les mises à jour.
Elle ne permet que de regarder. Une **nouvelle clé remplace l'ancienne** : si tu en recrées une,
recolle-la dans les réglages.

### 4.2 Trayss et ses trois formes

Sur la fiche de Trayss dans CodexVTT, nomme ses portraits **« Dragon »**, **« Entre deux »** et
**« Humaine »**. Quand son joueur change de portrait actif, sa carte change de forme toute seule.

### 4.3 Ce qui se passe pendant la partie

- **Un jet de dés** : le héros vient le jouer dans l'arène. Il prend son élan tout de suite, et le
  dénouement arrive 1,5 seconde plus tard, quand les dés 3D se posent. La carte du jet montre alors
  le résultat et le verdict (si un DD a été saisi).
- **Sans DD saisi** : le héros fait son geste sans verdict. Le critique (20 naturel) et l'échec
  critique (1 naturel) sont toujours joués.
- **Les PV** : sous chaque carte. Un coup reçu fait apparaître « −9 » en rouge, un soin « +5 » en vert.
  À 0 PV : **« 💀 À terre »**, la carte passe en gris et le personnage ferme les yeux.
- **En combat** : « ⚔ Son tour » sur la carte de celui qui joue.

Les gestes, selon le jet :

| Jet | Le héros… | Réussi | Raté |
|---|---|---|---|
| Athlétisme, Acrobaties, Agilité | court | saute | tombe |
| Escalade | grimpe | — | tombe |
| Discrétion | se cache | disparaît | se fait repérer ❗ |
| Escamotage, Investigation, outils | crochète | 🔓 | 💢 |
| Arcanes, Histoire, Religion, Nature, Médecine, Connaissance | lit | 💡 | ❓ |
| Perception, Perspicacité, Survie, Instinct | observe | 👁️ | haussement d'épaules |
| Persuasion, Tromperie, Présence, Charisme | parle | 🤝 | 💧 |
| Intimidation | menace | 😨 | 💧 |
| Représentation | danse | | |
| Sort, magie | lance un sort | 💫 | 💨 |
| Attaque à distance (arc, arbalète…) | tire | la flèche part droit | elle part de travers |
| Attaque, Force | frappe | 💥 | |
| Sauvegarde, Constitution, Volonté | pare | 🛡️ | encaisse |
| Soin | soigne | +PV | |
| Initiative | se met en garde | | |

Et pour finir : **critique** = il danse sous les étoiles ; **échec critique** = 💥 et il tombe K.O.

### 4.4 Tes PNJ et tes créatures

Tes jets **publics** lancés depuis la fiche d'un PNJ ou d'une créature sont joués dans l'arène par un
**aventurier encapuchonné** (cape bordeaux, réglable), avec le nom du PNJ sur la carte.

- **Lance en public.** Avec le réglage « jet privé » de CodexVTT, **aucun** de tes jets n'arrive à
  l'overlay, PNJ compris. C'est voulu : tes secrets restent secrets.
- Les jets que tu lances **sans fiche** (le lanceur de dés seul) ne sont pas joués pour l'instant.
- Tu ne veux pas des PNJ à l'écran : décoche « Jouer aussi les jets de mes PNJ » (3.1).

### 4.5 Vérifier

Ajoute `?journal=1` à l'adresse de la source (ou ouvre `scenes/jdr.html?journal=1` dans ton navigateur).
Un cadre **« 🎲 CodexVTT »** apparaît en haut à droite :

| Bord du cadre | Ce que ça veut dire |
|---|---|
| vert, « connecté » | tout va bien : chaque jet et chaque PV reçus s'affichent dans le cadre |
| rouge, « pas d'adresse ou pas de clé » | remplis les deux champs dans les réglages (4.1) |
| rouge, « refusé par CodexVTT » | la clé n'est pas la bonne |
| rouge, « clé révoquée » | une nouvelle clé a été créée : recolle-la |

Retire `?journal=1` ensuite.

## 5. Le bot Discord : qui parle

Un petit bot tourne sur ton VPS. Il te rejoint dans le salon vocal, **micro coupé**, et repère qui parle
à l'arrivée du son : **il n'écoute rien, ne déchiffre rien, n'enregistre rien**. Il le dit à l'overlay :
la carte de celui qui parle s'anime (sa bouche bouge, la carte rebondit, un halo à sa couleur
s'allume) et les autres pâlissent.

Les joueurs voient le bot dans la liste du salon : préviens-les que c'est normal.

### 5.1 Créer le bot sur Discord (une fois, 5 minutes, dans ton navigateur)

1. Va sur <https://discord.com/developers/applications>, connecté à ton compte Discord.
2. **New Application** : donne-lui un nom. Ce sera son nom dans le salon, par exemple « Grelot ».
   Accepte les conditions, puis **Create**.
3. Facultatif : **General Information** › une image (le logo de la chaîne).
4. Menu de gauche › **Bot** :
   - **Reset Token** › **Yes, do it!** › **Copy** : c'est le **jeton** du bot. Garde-le pour l'étape 5.2.
     C'est un **mot de passe** : ne le donne à personne, ne le mets dans aucun fichier.
   - Décoche **Public Bot** (toi seul pourras l'inviter).
   - Les « Privileged Gateway Intents » : n'en coche **aucun**.

### 5.2 L'installer sur le VPS (une fois, 5 minutes)

Il faut que le serveur des mises à jour soit déjà installé (`serveur/LISEZMOI.md`). Le VPS a déjà le
bot : il l'a récupéré tout seul depuis GitLab.

1. Sur ton PC, ouvre un terminal (PowerShell) et lance, en remplaçant `ADRESSE_DU_VPS` :

```bash
ssh -t root@ADRESSE_DU_VPS "bash /var/www/overlays/depot/serveur/voix/installer-voix.sh"
```

2. Il te pose trois questions :
   - **le jeton du bot** : colle-le (il ne s'affiche pas pendant que tu le colles, c'est normal), puis Entrée ;
   - **ton pseudo Discord** : celui que le bot suivra (le tien, le MJ) ;
   - **les salons** où il a le droit de te suivre : leurs noms, séparés par des virgules (par exemple
     `JDR, Table de jeu`). Entrée sans rien écrire = tous les salons.
3. À la fin, il affiche deux choses à garder :
   - le **lien d'invitation** du bot (5.3) ;
   - la **clé du bot Discord** (5.4).

S'il dit « le bot n'est pas encore dans le dépôt », attends une minute et relance la même commande.

### 5.3 Inviter le bot sur ton serveur Discord (une fois)

1. Ouvre le **lien d'invitation** affiché par le script.
2. Choisis ton serveur Discord, puis **Autoriser**.

Il ne demande que deux droits : voir les salons et s'y connecter. Si tes salons JDR sont privés,
donne-lui ces deux droits sur ces salons-là (clic droit sur le salon › Modifier › Permissions).

### 5.4 Brancher l'overlay (une fois)

Dans `reglages.html` › **Scène JDR** :

1. Coche **Brancher Discord**.
2. **Adresse du bot Discord** : laisse **vide** (c'est `wss://overlays.bastien-lambour.fr/voix`).
3. **Clé du bot Discord** : colle la clé affichée à la fin de l'installation.
4. Dans le tableau des joueurs, colonne **Discord** : le pseudo Discord de chacun, **y compris le tien**
   sur la ligne du maître du jeu.
5. **Enregistrer**, puis actualise la source dans OBS.

### 5.5 Quand le bot vient (et quand il ne vient pas)

Le bot te rejoint seulement si **les deux** conditions sont remplies :

1. tu es dans un **salon permis** (ceux donnés à l'installation ; tous si tu n'en as donné aucun) ;
2. la **scène JDR est ouverte dans OBS**, grâce à la case « Arrêter la source lorsqu'elle n'est pas
   visible » (2.2). Ce réglage-là est automatique.

Il ressort **2 minutes** après que tu as quitté la scène JDR. Le temps d'une pause sur ta scène
« Pause » ne suffit pas à le faire partir.

### 5.6 Changer d'avis plus tard (sur le VPS)

Relance l'installation avec un réglage devant la commande. Le reste est gardé :

| Pour… | Commande |
|---|---|
| changer les salons permis | `ssh -t root@ADRESSE_DU_VPS "SALONS='JDR, Table de jeu' bash /var/www/overlays/depot/serveur/voix/installer-voix.sh"` |
| tous les salons | `ssh -t root@ADRESSE_DU_VPS "SALONS= bash /var/www/overlays/depot/serveur/voix/installer-voix.sh"` |
| qu'il te suive même sans la scène JDR | `ssh -t root@ADRESSE_DU_VPS "AVEC_OVERLAY=0 bash /var/www/overlays/depot/serveur/voix/installer-voix.sh"` |
| changer de jeton (après un Reset Token) | `ssh -t root@ADRESSE_DU_VPS "DISCORD_JETON=le-nouveau bash /var/www/overlays/depot/serveur/voix/installer-voix.sh"` |
| une nouvelle clé pour l'overlay | `ssh -t root@ADRESSE_DU_VPS "NOUVELLE_CLE=1 bash /var/www/overlays/depot/serveur/voix/installer-voix.sh"`, puis la recoller (5.4) |
| voir ce que fait le bot | `ssh root@ADRESSE_DU_VPS "journalctl -u overlays-voix -n 50"` |

Le bot se met à jour tout seul quand le dépôt change : rien à faire.

### 5.7 Vérifier

`?journal=1` à la fin de l'adresse de la source : un cadre **« 🎙 Discord »** apparaît à droite.

| Ce qu'il dit | Ce que ça veut dire |
|---|---|
| bord vert, « salon « JDR » : Léa, Max… » | le bot est dans le salon ; chaque « parle : Léa » montre qui parle |
| « le bot attend dans aucun salon » | tu n'es pas en vocal, ou pas dans un salon permis |
| rouge, « pas d'adresse ou pas de clé » | colle la clé (5.4) |
| rouge, « clé refusée par le bot » | la clé n'est pas la bonne : recolle-la |
| rouge, « coupé (1006) » en boucle | le bot ou le VPS ne répond pas (chapitre 8) |

## 6. Avant chaque partie (2 minutes)

1. `reglages.html` › Scène JDR › le tableau : **qui est là ce soir** (Présent), et les personnages.
   **Enregistrer**.
2. Ouvre CodexVTT sur la bonne table.
3. Entre dans ton **salon vocal JDR** sur Discord.
4. Dans OBS, passe sur la scène **JDR** : le bot te rejoint dans les secondes qui suivent.
5. Parle : ta carte (le MJ) s'anime. Demande à chacun de dire un mot pour vérifier sa carte.
6. Lance un jet public de test dans CodexVTT : le héros le joue dans l'arène.

## 7. Tester sans rien brancher

- **La scène seule** : ouvre `scenes/jdr.html?test=1` dans ton navigateur (ou dans OBS). Les héros
  parlent, prennent des coups, tombent à terre et jouent des jets au hasard.
- **Le bot sans Discord** (sur le VPS) : il fabrique un faux salon où de faux joueurs parlent au hasard.
  Arrête le vrai bot, lance le faux, puis relance le vrai :

```bash
ssh root@ADRESSE_DU_VPS "systemctl stop overlays-voix"
```

```bash
ssh -t root@ADRESSE_DU_VPS "runuser -u overlays -- env CLE=la-clé-du-bot node /var/www/overlays/depot/serveur/voix/voix.mjs --simulation"
```

```bash
ssh root@ADRESSE_DU_VPS "systemctl start overlays-voix"
```

Pendant que le faux tourne, mets dans la colonne Discord les noms `Patagrain`, `Zokhran`,
`Namerya`, `Kenai`, `Trayss`, `Ba Heng Ze` : les cartes s'animent toutes seules. Ctrl + C pour l'arrêter.

## 8. Dépannage

| Ce que tu vois | Ce qu'il faut faire |
|---|---|
| La table est noire | dans OBS, la capture « Table » n'a pas trouvé la fenêtre : rouvre CodexVTT, puis Propriétés de la source › choisis la fenêtre |
| La table déborde ou laisse des bords | refais Ctrl + E avec les chiffres de 2.3 |
| Aucun jet ne s'affiche | `?journal=1` (4.5) ; le jet était-il **public** ? la fiche est-elle à la table (3.4) ? |
| Un héros ne joue pas ses jets | le nom de sa fiche CodexVTT ne commence pas comme celui de sa carte (3.4) |
| Les PV ne bougent pas | la fiche s'est-elle bien enregistrée dans CodexVTT (pas de message d'erreur) ? Puis `?journal=1` : les « hp » doivent arriver |
| Trayss ne change pas de forme | ses portraits doivent s'appeler « Dragon », « Entre deux », « Humaine » (4.2) |
| Le bot ne vient pas | es-tu dans un salon permis, avec la scène JDR affichée dans OBS (5.5) ? Sinon : `journalctl -u overlays-voix -n 50` (5.6) |
| Le bot vient, mais une carte ne bouge pas quand son joueur parle | son pseudo dans la colonne Discord ne correspond pas : `?journal=1` donne les noms exacts du salon |
| « coupé (1006) » en boucle dans le journal Discord | ouvre <https://overlays.bastien-lambour.fr/voix/sante> dans ton navigateur : il doit afficher `ok`. Sinon relance l'installation (5.2), qui répare le site |
| Une modification des réglages ne se voit pas | actualise la source ; si ça ne suffit pas : Propriétés › « Actualiser le cache de la page actuelle » |

## 9. Ce qui n'a pas encore été testé en vrai

Tout a été vérifié avec de faux serveurs : un faux CodexVTT, un faux Discord, le bot en simulation.
**Jamais encore** :

- dans OBS ;
- avec le vrai CodexVTT en ligne (le mode spectateur doit être en ligne sur ton serveur) ;
- avec le vrai Discord, ni le script d'installation sur ton VPS.

Au premier essai, garde `?journal=1` ouvert. Si quelque chose ne marche pas, copie ce qu'il affiche
(ou ce qu'affiche le script d'installation) et envoie-le.
