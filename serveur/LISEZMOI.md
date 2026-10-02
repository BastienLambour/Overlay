# Le serveur des overlays

Pour ne plus envoyer de zip à la main. Tu pousses tes modifications sur le dépôt, et quelques secondes plus tard :

- la page de téléchargement est à jour (un bouton par overlay, avec « Ce qui a changé ») ;
- chaque membre de la famille peut mettre son overlay à jour **en un clic** : dans OBS (Outils › Scripts › bouton
  **Mettre à jour l'overlay**), ou en double-cliquant sur `mettre-a-jour.cmd` dans son dossier ;
- **ses réglages sont gardés** : `mes-reglages.js` n'est jamais dans les zips, et n'est jamais remplacé.

```
 toi ── git push ──▶ GitHub / GitLab ── webhook ──▶ VPS : refait les zips ──▶ page de téléchargement
                                                                         └──▶ bouton « Mettre à jour » des overlays
```

Une vérification par heure tourne aussi, au cas où un webhook se perd (VPS redémarré pendant ton push…).
Un overlay qui n'a pas changé garde sa version : son streamer n'a rien à télécharger.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `installer.sh` | installe tout sur le VPS, une seule fois (on peut le relancer sans risque) |
| `construire.mjs` | fabrique le site : un zip, un `version.json` et le `TUTO.pdf` par overlay, et la page `index.html` |
| `mettre-a-jour.mjs` | récupère le dépôt, et relance `construire.mjs` seulement s'il a changé |
| `webhook.mjs` | reçoit les « push » de GitHub ou GitLab (vérifie le secret, ne garde que la bonne branche) |

## 0. Avant tout : la sécurité du VPS

Le mot de passe root du VPS a été écrit dans une conversation : **change-le** dès ta prochaine connexion (`passwd`),
et passe de préférence à une connexion par **clé SSH** (`ssh-copy-id root@217.154.115.223` depuis ton PC, puis
`PasswordAuthentication no` dans `/etc/ssh/sshd_config`).

## 1. Choisir la branche publiée

Le serveur publie **une seule branche**, `main` par défaut. Aujourd'hui, tout le travail récent est sur la branche
`claude/practical-fermat-g8kvmq`, et `main` ne contient qu'un vieux commit. Deux possibilités :

- **le plus propre** : fusionne le travail dans `main` (une pull request sur GitHub), puis publie `main` ;
- **pour essayer tout de suite** : installe avec `BRANCHE=claude/practical-fermat-g8kvmq`, et relance l'installation
  avec `BRANCHE=main` plus tard.

## 2. Installer (une fois, environ 5 minutes)

Depuis ton PC, dans le dossier du dépôt (PowerShell ou un terminal) :

```
scp serveur/installer.sh root@217.154.115.223:
ssh root@217.154.115.223 "bash installer.sh"
```

(Avec une autre branche : `ssh root@217.154.115.223 "BRANCHE=claude/practical-fermat-g8kvmq bash installer.sh"`.)

Le script avance tout seul et s'arrête **une fois** : il affiche une **clé de déploiement** (une ligne qui commence par
`ssh-ed25519`). C'est elle qui permet au serveur de **lire** le dépôt, et rien d'autre.

- **GitHub** : le dépôt › **Settings › Deploy keys › Add deploy key** › colle la clé, donne-lui un nom (« VPS overlays »),
  **ne coche pas** « Allow write access » › **Add key**.
- **GitLab** : le projet › **Settings › Repository › Deploy keys › Add new key** › colle la clé, sans « Grant write
  permissions ».

Reviens au terminal, appuie sur **Entrée** : le script continue. À la fin, il affiche **l'adresse du webhook** et **le secret**.

## 3. Brancher le webhook (une fois)

**GitHub** : le dépôt › **Settings › Webhooks › Add webhook**

1. **Payload URL** : `http://217.154.115.223/webhook`
2. **Content type** : `application/json`
3. **Secret** : le secret affiché par l'installation (il est aussi dans `/etc/overlays.env` sur le VPS)
4. **Which events** : « Just the push event » › **Add webhook**

GitHub envoie tout de suite un essai (« ping ») : une coche verte doit apparaître à côté du webhook.

**GitLab** : le projet › **Settings › Webhooks › Add new webhook**

1. **URL** : `http://217.154.115.223/webhook` · **Secret token** : le secret
2. **Trigger** : « Push events », branche : celle publiée
3. Décoche **Enable SSL verification** tant que le site est en `http` › **Add webhook** › **Test › Push events**

## 4. Vérifier

- La page : <http://217.154.115.223/> (un bouton par overlay).
- Pousse une petite modification : quelques secondes après, la date de version de l'overlay change sur la page.
- Les journaux, sur le VPS :
  - `journalctl -u overlays-webhook -f` : les push reçus, en direct ;
  - `journalctl -u overlays-maj -n 30` : les reconstructions de l'heure.
- Refaire le site à la main : `systemctl start overlays-maj` (seulement s'il y a du nouveau) ; tout refaire quoi qu'il
  arrive : `runuser -u overlays -- bash -c 'set -a; . /etc/overlays.env; node /opt/overlays/depot/serveur/mettre-a-jour.mjs --forcer'`.

## 5. Passer de GitHub à GitLab

1. Pousse le dépôt sur GitLab (sur ton PC : `git remote set-url origin git@gitlab.com:<toi>/overlay.git` puis `git push`).
2. Sur le VPS, relance l'installation avec la nouvelle adresse :
   `ssh root@217.154.115.223 "DEPOT_URL=git@gitlab.com:<toi>/overlay.git bash installer.sh"`.
   Il redonne la **même clé de déploiement** : ajoute-la dans GitLab (étape 2), puis appuie sur Entrée.
3. Ajoute le webhook dans GitLab (étape 3, le secret ne change pas), et supprime celui de GitHub.

Rien à changer chez les streamers : leurs overlays demandent les mises à jour au VPS, pas à GitHub.

## 6. Et quand un membre de la famille fait une modification ?

- **Ses réglages** (textes, couleurs, sons, options des scènes… tout ce qui passe par `reglages.html`) sont dans son
  `mes-reglages.js` : une mise à jour ne les touche jamais. **Il n'a pas besoin de Git.**
- **S'il a modifié un autre fichier** (une image, une scène…) : la mise à jour le remplace par ta version, mais
  l'ancien dossier est gardé dans `sauvegardes\<date>` de son overlay (les 3 dernières). Il t'envoie le fichier, tu
  l'intègres au dépôt et tu pousses : tout le monde a la modification.
- Une image ou un son **à lui** (dans `sons/` par exemple) qui n'existe pas dans ta version n'est jamais supprimé.

## 7. Plus tard : un nom de domaine et HTTPS

Avec un nom de domaine qui pointe vers le VPS : `DOMAINE=overlays.mondomaine.fr bash installer.sh`.

- Si **Caddy** est installé (à la place de Nginx), il obtient le certificat HTTPS tout seul.
- Avec **Nginx** : `apt install certbot python3-certbot-nginx` puis `certbot --nginx -d overlays.mondomaine.fr`.

Change ensuite l'adresse dans `config.js › miseAJour.adresse` des overlays (et dans les webhooks), puis pousse.
Les overlays déjà installés suivent tout seuls : l'adresse vient du `version.json` de chaque mise à jour.

## Ce qui a été testé

- Dans un conteneur Linux : l'installation complète (avec un vrai Nginx, sans systemd, qui était simulé) ; le site
  servi ; le webhook GitHub et GitLab (secret faux refusé, mauvaise branche ignorée, « ping ») ; un nouveau commit
  poussé → seul l'overlay modifié change de version ; zips identiques à l'octet près une fois décompressés.
- **Pas testé** : sur ton vrai VPS, avec le vrai GitHub (clé de déploiement, webhook), avec systemd.
