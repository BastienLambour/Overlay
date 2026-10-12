# Le bot Discord « voix » des overlays

Il dit aux overlays **qui parle** dans le salon vocal Discord : sur la scène JDR de Patagrain, la carte
du joueur qui parle s'anime (bouche, rebond, halo) et les autres s'estompent.

- Il tourne sur le VPS, à côté du serveur des mises à jour (service `overlays-voix`).
- Il **suit une personne** (toi, le MJ) : quand tu entres dans un salon vocal, il y entre aussi, micro
  coupé, et il en sort avec toi. Les joueurs le voient dans la liste du salon : c'est normal.
- Il repère qui parle **à l'arrivée du son** : il ne le déchiffre pas, ne l'écoute pas, n'enregistre rien.
- Les overlays se branchent sur `wss://overlays.bastien-lambour.fr/voix` avec une **clé** (secrète).

## Installer (une fois, environ 15 minutes)

Il faut que le serveur des overlays soit déjà installé (`serveur/installer.sh`, voir `serveur/LISEZMOI.md`).

### 1. Créer le bot sur Discord (sur ton PC, dans le navigateur)

1. Va sur <https://discord.com/developers/applications> (connecté à ton compte Discord) › **New Application**.
   Donne-lui un nom (ce sera son nom dans le salon, par exemple « Grelot »), accepte les conditions, **Create**.
2. Facultatif : **General Information** › une image (le logo de la chaîne, par exemple).
3. Menu de gauche › **Bot** :
   - **Reset Token** › **Yes, do it!** › **Copy** : c'est le **jeton** du bot. Garde-le pour l'étape 2.
     C'est un mot de passe : ne le donne à personne, ne le mets dans aucun fichier du dépôt.
   - Décoche **Public Bot** (toi seul pourras l'inviter).
   - Les « Privileged Gateway Intents » : **aucun** à cocher, il n'en a pas besoin.

### 2. L'installer sur le VPS (depuis ton PC, dans le dossier du dépôt)

Pousse d'abord le dépôt (`git push`) pour que le VPS ait le bot, puis :

```bash
scp serveur/voix/installer-voix.sh root@ADRESSE_DU_VPS:
```

```bash
ssh -t root@ADRESSE_DU_VPS "bash installer-voix.sh"
```

Il demande le **jeton** (collé, il ne s'affiche pas) et **ton pseudo Discord** (celui qu'il suivra).
À la fin, il affiche :
- le **lien d'invitation** du bot : ouvre-le, choisis ton serveur Discord, **Autoriser**.
  Il ne demande que deux droits : voir les salons et s'y connecter ;
- la **clé des overlays** : à coller dans `reglages.html` › Scène JDR › « Clé du bot Discord ».

### 3. Dans l'overlay

`reglages.html` › **Scène JDR** : coche « Brancher Discord », laisse l'adresse vide, colle la clé. Dans le
tableau des joueurs, colonne **Discord** : le pseudo Discord de chacun (ou son nom affiché sur le serveur).
**Enregistrer**, puis actualise la source dans OBS.

Vérifier : ajoute `?journal=1` à l'adresse de la scène JDR. Le cadre « 🎙 Discord » dit « salon « … » :
Untel, Untel… » (bord vert) et « parle : Untel » quand quelqu'un parle.

## Au quotidien

Rien à faire : le bot démarre avec le VPS, te suit, et se met à jour tout seul quand le dépôt change
(`overlays-voix-maj.path` le relance).

| Pour… | Commande (sur le VPS, en root) |
|---|---|
| voir ce qu'il fait | `journalctl -u overlays-voix -f` |
| le relancer | `systemctl restart overlays-voix` |
| changer de jeton ou de personne suivie | relancer `bash installer-voix.sh` avec `DISCORD_JETON=…` ou `SUIVRE=…` devant |
| refaire la clé des overlays | `NOUVELLE_CLE=1 bash installer-voix.sh` (puis la recoller dans les réglages) |
| rester dans un salon fixe | `SALON=<identifiant du salon> bash installer-voix.sh` |
| tester sans Discord | `systemctl stop overlays-voix`, puis `runuser -u overlays -- env CLE=<la clé> node /var/www/overlays/depot/serveur/voix/voix.mjs --simulation` (un faux salon où l'on parle au hasard ; Ctrl+C), puis `systemctl start overlays-voix` |

## Dépannage

- **Le bot n'entre pas dans le salon** : `journalctl -u overlays-voix -n 30`. « suit « … » » : vérifie le
  pseudo (celui de ton profil Discord). « impossible d'entrer » : donne-lui « Voir le salon » et
  « Se connecter » sur ce salon.
- **« clé refusée par le bot »** dans le journal de l'overlay : recolle la clé (`CLE=` dans `/etc/overlays-voix.env`).
- **« coupé (1006) »** en boucle : le site ne transmet pas `/voix`. Ouvre `https://overlays.bastien-lambour.fr/voix/sante`
  dans ton navigateur : il doit afficher `ok`. Sinon, relance `bash installer-voix.sh` (il remet `/voix` dans Nginx).
- **Un joueur parle mais sa carte ne bouge pas** : son pseudo dans la colonne « Discord » ne correspond pas.
  Le journal de l'overlay (`?journal=1`) affiche les noms du salon tels que Discord les donne.

## Les fichiers

- `voix.mjs` — le bot (discord.js + @discordjs/voice + ws : la seule partie du projet avec des bibliothèques,
  parce que la voix de Discord est chiffrée de bout en bout et change souvent ; `npm ci` les installe sur le VPS,
  jamais dans le dépôt).
- `package.json`, `package-lock.json` — les versions exactes des bibliothèques.
- `installer-voix.sh` — l'installation (relançable).
- Côté overlay : `patagrain/js/voix.js` (objet `Voix`) et `scenes/jdr.html`.
