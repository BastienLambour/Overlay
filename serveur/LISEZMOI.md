# Le serveur des overlays

Pour ne plus envoyer de zip à la main. Tu pousses tes modifications sur le dépôt, et quelques secondes plus tard :

- la page de téléchargement est à jour (un bouton par overlay, avec « Ce qui a changé ») ;
- chaque membre de la famille peut mettre son overlay à jour **en un clic** : dans OBS (Outils › Scripts › bouton
  **Mettre à jour l'overlay**), ou en double-cliquant sur `mettre-a-jour.cmd` dans son dossier ;
- **ses réglages sont gardés** : `mes-reglages.js` n'est jamais dans les zips, et n'est jamais remplacé.

```
 toi ── git push ──▶ GitLab ── webhook ───────── ──▶ VPS : refait les zips ──▶ page de téléchargement
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

## 1. Mettre le dépôt sur GitLab (une fois)

Le dépôt : <https://gitlab.com/Bastien.Lambour/overlays> (projet privé, de préférence). Le serveur publie la branche
**`main`**. Sur ton PC, dans le dossier du dépôt :

```
git remote add gitlab git@gitlab.com:Bastien.Lambour/overlays.git
git push gitlab claude/practical-fermat-g8kvmq:main
```

Tout le travail récent devient ainsi le `main` de GitLab. Ensuite : tu travailles sur `main` et tu pousses avec
`git push gitlab main`. (Pour en faire le dépôt par défaut : `git remote rename origin github` puis
`git remote rename gitlab origin`.)

## 2. Installer le serveur (une fois, environ 5 minutes)

Depuis ton PC, dans le dossier du dépôt (PowerShell ou un terminal) :

```
scp serveur/installer.sh root@217.154.115.223:
ssh root@217.154.115.223 "bash installer.sh"
```

Le script lit `git@gitlab.com:Bastien.Lambour/overlays.git`, branche `main` (pour un autre dépôt ou une autre branche :
`ssh root@217.154.115.223 "DEPOT_URL=… BRANCHE=… bash installer.sh"`).

Il avance tout seul et s'arrête **une fois** : il affiche une **clé de déploiement** (une ligne qui commence par
`ssh-ed25519`). C'est elle qui permet au serveur de **lire** le dépôt, et rien d'autre.

- GitLab : le projet › **Settings › Repository › Deploy keys › Add new key** › colle la clé, nomme-la « VPS overlays »,
  **ne coche pas** « Grant write permissions » › **Add key**.

Reviens au terminal, appuie sur **Entrée** : le script continue. À la fin, il affiche **l'adresse du webhook** et **le secret**.

## 3. Brancher le webhook GitLab (une fois)

Le projet › **Settings › Webhooks › Add new webhook** :

1. **URL** : `http://217.154.115.223/webhook`
2. **Secret token** : le secret affiché par l'installation (il est aussi dans `/etc/overlays.env` sur le VPS)
3. **Trigger** : coche **Push events**, branche `main`
4. Décoche **Enable SSL verification** (le site est en `http` tant qu'il n'a pas de nom de domaine)
5. **Add webhook**, puis **Test › Push events** : la réponse doit être « Mise à jour lancée ».

## 4. Vérifier

- La page : <http://217.154.115.223/> (un bouton par overlay).
- Pousse une petite modification : quelques secondes après, la date de version de l'overlay change sur la page.
- Les journaux, sur le VPS :
  - `journalctl -u overlays-webhook -f` : les push reçus, en direct ;
  - `journalctl -u overlays-maj -n 30` : les reconstructions.
- Refaire le site à la main : `systemctl start overlays-maj` (seulement s'il y a du nouveau) ; tout refaire quoi qu'il
  arrive : `runuser -u overlays -- bash -c 'set -a; . /etc/overlays.env; node /opt/overlays/depot/serveur/mettre-a-jour.mjs --forcer'`.

## 5. Une seule fois chez chaque membre de la famille

Leurs copies actuelles n'ont pas encore le système de mise à jour : une dernière fois « à la main ».

1. Télécharger le zip de son overlay sur <http://217.154.115.223/>, le décompresser **par-dessus** son dossier actuel
   (son `mes-reglages.js` n'est pas dans le zip : il reste).
2. OBS › **Outils › Scripts** › **+** › `outils/actualiser-obs.lua` (déjà installé : le sélectionner › **Recharger**).

Ensuite, à chaque nouvelle version : bouton **Mettre à jour l'overlay** dans cette fenêtre (ou double-clic sur
`mettre-a-jour.cmd`). Le dépôt n'est jamais lu par leurs PC : seulement le VPS.

> Revenir un jour sur GitHub : relance l'installation avec `DEPOT_URL=git@github.com:BastienLambour/Overlay.git`
> (la même clé de déploiement, à ajouter dans GitHub › Settings › Deploy keys), et un webhook GitHub : Settings ›
> Webhooks › Payload URL `http://217.154.115.223/webhook`, Content type `application/json`, même secret, « Just the push event ».

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
- **Pas testé** : sur ton vrai VPS, avec le vrai GitLab (clé de déploiement, webhook), avec systemd.
