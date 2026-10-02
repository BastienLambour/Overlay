#!/usr/bin/env bash
# =====================================================================
#  INSTALLER LE SERVEUR DES OVERLAYS — à lancer UNE SEULE FOIS sur le VPS (Debian ou Ubuntu), en root.
#
#  Ce qu'il met en place :
#    - Node.js (18 ou plus) et Git, s'ils manquent ;
#    - un utilisateur système « overlays » (les services ne tournent PAS en root) ;
#    - une clé SSH « de déploiement » en LECTURE SEULE pour lire le dépôt (GitHub ou GitLab) ;
#    - tout dans /var/www/overlays : depot/ (la copie du dépôt, d'où tourne le webhook — jamais servie)
#      et site/ (ce que montre le serveur web : un zip + version.json + TUTO.pdf par overlay, la page) ;
#    - le récepteur du webhook (service overlays-webhook) : un push → le site est refait aussitôt ;
#    - un filet de sécurité : une vérification par heure (minuteur overlays-maj.timer) ;
#    - le serveur web : UN fichier Nginx (aucun autre site touché) — https://overlays.bastien-lambour.fr avec le
#      certificat des autres sites (80 → 443), /webhook transmis au récepteur ; Caddy s'il est là à la place de Nginx.
#
#  Utilisation (depuis ton PC, dans le dossier du dépôt) :
#      scp serveur/installer.sh root@ADRESSE_DU_VPS:
#      ssh -t root@ADRESSE_DU_VPS "bash installer.sh"     (-t : pour pouvoir répondre au script)
#  On peut le relancer sans risque (pour changer de dépôt, de branche…) : il garde le secret et la clé.
#
#  Réglages (variables à mettre devant la commande, toutes facultatives) :
#      DEPOT_URL  le dépôt à lire        (défaut : git@gitlab.com:Bastien.Lambour/overlays.git)
#      BRANCHE    la branche publiée     (défaut : main)
#      ADRESSE    l'adresse publique     (défaut : http://<IP du VPS>) — aussi écrite dans les version.json
#      DOMAINE    l'adresse du site      (défaut : overlays.bastien-lambour.fr ; DOMAINE= vide = sur l'IP, en http)
#      CERTIFICAT, CLE  le certificat HTTPS déjà sur le VPS (défaut : /etc/ssl/private/bastien-lambour.fr.cer et
#                 bastien-lambour.fr-private.key, ceux des autres sites) ; absent = le site reste en http
#  Exemple : ssh root@VPS "BRANCHE=main DEPOT_URL=git@github.com:BastienLambour/Overlay.git bash installer.sh"
# =====================================================================
set -euo pipefail

DEPOT_URL="${DEPOT_URL:-git@gitlab.com:Bastien.Lambour/overlays.git}"
BRANCHE="${BRANCHE:-main}"
DOMAINE="${DOMAINE-overlays.bastien-lambour.fr}"
CERTIFICAT="${CERTIFICAT:-/etc/ssl/private/bastien-lambour.fr.cer}"
CLE="${CLE:-/etc/ssl/private/bastien-lambour.fr-private.key}"
UTILISATEUR=overlays
RACINE="${RACINE:-/var/www/overlays}"   # tout est là (réglable : RACINE=… bash installer.sh)
MAISON="$RACINE"
DEPOT="$MAISON/depot"
SORTIE="$RACINE/site"   # SEUL dossier servi par Nginx/Caddy (depot/ et .ssh/ restent privés)
PORT=9321
ENV=/etc/overlays.env

dire()  { printf '\n\033[1;33m▶ %s\033[0m\n' "$*"; }
ok()    { printf '  \033[32m✔\033[0m %s\n' "$*"; }
stop()  { printf '\n\033[1;31m✖ %s\033[0m\n' "$*" >&2; exit 1; }
[ "$(id -u)" = 0 ] || stop "À lancer en root (ou avec sudo)."
command -v apt-get >/dev/null || stop "Ce script est prévu pour Debian ou Ubuntu (apt-get introuvable)."

IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
# HTTPS si le certificat est là ET couvre ce domaine (ex. un certificat « *.bastien-lambour.fr »)
HTTPS=0
if [ -n "$DOMAINE" ] && [ -f "$CERTIFICAT" ] && [ -f "$CLE" ]; then
  NOMS="$(openssl x509 -in "$CERTIFICAT" -noout -ext subjectAltName 2>/dev/null | tr ',' '\n' | sed -n 's/.*DNS:\(.*\)/\1/p')"
  if printf '%s\n' "$NOMS" | grep -qxF -e "$DOMAINE" -e "*.${DOMAINE#*.}"; then HTTPS=1
  else stop "Le certificat $CERTIFICAT ne couvre pas $DOMAINE (il couvre : $(echo "$NOMS" | xargs)). Choisis un autre nom (DOMAINE=…), ou donne un autre certificat (CERTIFICAT=… CLE=…)."; fi
fi
if [ -n "$DOMAINE" ]; then
  if [ "$HTTPS" = 1 ]; then ADRESSE="${ADRESSE:-https://$DOMAINE}"; else ADRESSE="${ADRESSE:-http://$DOMAINE}"; fi
else ADRESSE="${ADRESSE:-http://${IP:-127.0.0.1}}"; fi
ADRESSE="${ADRESSE%/}"

# ---------------------------------------------------------------------
dire "1/7 Logiciels : Git, Node.js"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq git curl ca-certificates openssh-client openssl >/dev/null
version_node() { node -e 'console.log(process.versions.node.split(".")[0])' 2>/dev/null || echo 0; }
if [ "$(version_node)" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
NODE="$(command -v node)"
ok "Git $(git --version | awk '{print $3}'), Node.js $(node --version)"

# ---------------------------------------------------------------------
dire "2/7 Utilisateur « $UTILISATEUR » et dossiers"
id "$UTILISATEUR" >/dev/null 2>&1 || useradd --system --home-dir "$MAISON" --create-home --shell /usr/sbin/nologin "$UTILISATEUR"
mkdir -p "$MAISON" "$SORTIE"
chown -R "$UTILISATEUR:$UTILISATEUR" "$MAISON"
# Le serveur web traverse $MAISON (sans pouvoir le lister) et ne lit QUE site/ ; depot/ et .ssh/ restent privés
chmod 711 "$MAISON"
chmod 755 "$SORTIE"
ok "$DEPOT (le dépôt, privé) et $SORTIE (le site)"
en_overlays() { runuser -u "$UTILISATEUR" -- env HOME="$MAISON" "$@"; }

# ---------------------------------------------------------------------
dire "3/7 Accès au dépôt : $DEPOT_URL"
if [[ "$DEPOT_URL" == git@* || "$DEPOT_URL" == ssh://* ]]; then
  # (CLE_GIT, pas CLE : CLE est la clé du certificat HTTPS, utilisée plus bas par Nginx)
  CLE_GIT="$MAISON/.ssh/id_ed25519"
  if [ ! -f "$CLE_GIT" ]; then
    en_overlays mkdir -p "$MAISON/.ssh"
    chmod 700 "$MAISON/.ssh"
    en_overlays ssh-keygen -q -t ed25519 -N '' -C "overlays@$(hostname)" -f "$CLE_GIT"
  fi
  HOTE="$(printf '%s' "$DEPOT_URL" | sed -E 's#^(ssh://)?([^@]+@)?([^:/]+).*#\3#')"
  en_overlays sh -c "ssh-keyscan -t ed25519,rsa '$HOTE' >> '$MAISON/.ssh/known_hosts' 2>/dev/null; sort -u -o '$MAISON/.ssh/known_hosts' '$MAISON/.ssh/known_hosts'"
  until en_overlays git ls-remote --heads "$DEPOT_URL" "$BRANCHE" >/dev/null 2>&1; do
    printf '\n  Le serveur n'"'"'a pas encore le droit de lire le dépôt. Ajoute cette clé, en LECTURE SEULE :\n'
    printf '    GitHub : dépôt › Settings › Deploy keys › Add deploy key (NE PAS cocher « Allow write access »)\n'
    printf '    GitLab : projet › Settings › Repository › Deploy keys › Add new key (sans « Grant write permissions »)\n\n'
    printf '  \033[1m%s\033[0m\n\n' "$(cat "$CLE_GIT.pub")"
    # Sans clavier (ssh lancé sans -t) : on s'arrête proprement ; relancer reprend ici, avec la même clé
    if ! { true < /dev/tty; } 2>/dev/null; then
      stop "Ajoute la clé ci-dessus dans GitLab, puis relance la même commande (avec ssh -t pour pouvoir répondre ici)."
    fi
    read -r -p "  Appuie sur Entrée une fois la clé ajoutée (Ctrl+C pour arrêter)… " _ < /dev/tty
  done
fi
en_overlays git ls-remote --heads "$DEPOT_URL" "$BRANCHE" | grep -q . || stop "La branche « $BRANCHE » n'existe pas dans $DEPOT_URL."
ok "Le dépôt est lisible, branche $BRANCHE"

# ---------------------------------------------------------------------
dire "4/7 Copie du dépôt dans $DEPOT"
if [ -d "$DEPOT/.git" ]; then
  en_overlays git -C "$DEPOT" remote set-url origin "$DEPOT_URL"
else
  en_overlays git clone --quiet --branch "$BRANCHE" "$DEPOT_URL" "$DEPOT"
fi
chmod 750 "$DEPOT"
en_overlays git -C "$DEPOT" fetch --quiet origin "$BRANCHE"
en_overlays git -C "$DEPOT" checkout --quiet -B "$BRANCHE" "origin/$BRANCHE"
ok "À jour : $(en_overlays git -C "$DEPOT" log -1 --format='%h %s')"

# ---------------------------------------------------------------------
dire "5/7 Réglages du serveur ($ENV) et premier site"
if [ -f "$ENV" ] && grep -q '^SECRET=' "$ENV"; then SECRET="$(grep '^SECRET=' "$ENV" | cut -d= -f2-)"; else SECRET="$(openssl rand -hex 24)"; fi
cat > "$ENV" <<EOF
# Réglages du serveur des overlays (lus par les services overlays-webhook et overlays-maj).
# Après une modification : systemctl restart overlays-webhook && systemctl start overlays-maj
SECRET=$SECRET
BRANCHE=$BRANCHE
SORTIE=$SORTIE
ADRESSE=$ADRESSE
PORT=$PORT
EOF
chown "root:$UTILISATEUR" "$ENV"; chmod 640 "$ENV"
en_overlays env SORTIE="$SORTIE" ADRESSE="$ADRESSE" "$NODE" "$DEPOT/serveur/construire.mjs"

# ---------------------------------------------------------------------
dire "6/7 Services : webhook + vérification toutes les heures"
cat > /etc/systemd/system/overlays-webhook.service <<EOF
[Unit]
Description=Overlays : webhook GitHub/GitLab (un push = site mis à jour)
After=network-online.target
Wants=network-online.target

[Service]
User=$UTILISATEUR
Environment=HOME=$MAISON
EnvironmentFile=$ENV
WorkingDirectory=$DEPOT
ExecStart=$NODE $DEPOT/serveur/webhook.mjs
Restart=always
RestartSec=5
NoNewPrivileges=yes
ProtectSystem=strict
ReadWritePaths=$MAISON $SORTIE
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
EOF
cat > /etc/systemd/system/overlays-maj.service <<EOF
[Unit]
Description=Overlays : récupère le dépôt et refait le site s'il a changé
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=$UTILISATEUR
Environment=HOME=$MAISON
EnvironmentFile=$ENV
WorkingDirectory=$DEPOT
ExecStart=$NODE $DEPOT/serveur/mettre-a-jour.mjs
NoNewPrivileges=yes
ProtectSystem=strict
ReadWritePaths=$MAISON $SORTIE
PrivateTmp=yes
EOF
cat > /etc/systemd/system/overlays-maj.timer <<EOF
[Unit]
Description=Overlays : filet de sécurité, une vérification par heure (si un webhook s'est perdu)

[Timer]
OnBootSec=2min
OnUnitActiveSec=1h
Persistent=true

[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable --now overlays-webhook.service overlays-maj.timer >/dev/null 2>&1
systemctl restart overlays-webhook.service
sleep 1
systemctl is-active --quiet overlays-webhook.service && ok "overlays-webhook actif (127.0.0.1:$PORT)" || stop "Le webhook ne démarre pas : journalctl -u overlays-webhook -n 50"
ok "overlays-maj.timer actif (toutes les heures)"

# ---------------------------------------------------------------------
dire "7/7 Serveur web"
if command -v caddy >/dev/null && ! command -v nginx >/dev/null; then
  # Caddy déjà installé : un fichier à part, importé par le Caddyfile
  SITE="${DOMAINE:-:80}"
  cat > /etc/caddy/overlays.caddy <<EOF
# Overlays : la page et les zips, et /webhook transmis au récepteur (serveur/installer.sh)
$SITE {
	handle /webhook {
		reverse_proxy 127.0.0.1:$PORT
	}
	handle {
		root * $SORTIE
		header /*.json Cache-Control "no-cache"
		header /*.zip Cache-Control "no-cache"
		file_server
	}
}
EOF
  grep -q 'import overlays.caddy' /etc/caddy/Caddyfile 2>/dev/null || printf '\nimport overlays.caddy\n' >> /etc/caddy/Caddyfile
  caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1 || stop "La configuration Caddy est refusée : caddy validate --config /etc/caddy/Caddyfile"
  systemctl reload caddy
  ok "Caddy : /etc/caddy/overlays.caddy"
else
  command -v nginx >/dev/null || apt-get install -y -qq nginx >/dev/null
  # Où Nginx range ses sites : sites-available + sites-enabled (Debian/Ubuntu), sinon conf.d
  if [ -d /etc/nginx/sites-enabled ] && grep -rqs 'sites-enabled' /etc/nginx/nginx.conf; then
    FICHIER=/etc/nginx/sites-available/overlays; LIEN=/etc/nginx/sites-enabled/overlays
  else
    FICHIER=/etc/nginx/conf.d/overlays.conf; LIEN=""
  fi
  V6=""; [ -f /proc/net/if_inet6 ] && V6=1   # écouter aussi en IPv6 seulement si la machine l'a
  # Ce que font les deux versions (http ou https) : le site, /webhook transmis au récepteur, pas de cache sur les versions
  EMPLACEMENTS="    root $SORTIE;
    index index.html;

    location = /webhook {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        client_max_body_size 5m;
    }
    # version.json et les zips : toujours la dernière version (pas de cache)
    location ~ \.(json|zip)\$ {
        add_header Cache-Control \"no-cache\";
    }
    location / {
        try_files \$uri \$uri/ =404;
    }"
  if [ -n "$DOMAINE" ] && [ "$HTTPS" = 1 ]; then
    # Comme les autres sites du VPS : le port 80 renvoie vers https, le site est sur le port 443
    cat > "$FICHIER" <<EOF
# Overlays : $DOMAINE (écrit par serveur/installer.sh — relance-le plutôt que de modifier ce fichier)
server {
    listen 80;
${V6:+    listen [::]:80;}
    server_name $DOMAINE;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
${V6:+    listen [::]:443 ssl;}
    server_name $DOMAINE;

    ssl_certificate $CERTIFICAT;
    ssl_certificate_key $CLE;

$EMPLACEMENTS
}
EOF
  else
    # Sans certificat : en http seulement (sur l'IP du VPS si aucun domaine n'est donné)
    DEFAUT=""
    if [ -z "$DOMAINE" ]; then
      # Seulement si le VPS n'a AUCUN autre site : on retire la page « Welcome to nginx » d'origine
      AUTRES=0; for s in /etc/nginx/sites-enabled/*; do [ -e "$s" ] && [ "${s##*/}" != overlays ] && AUTRES=$((AUTRES + 1)); done
      if [ -L /etc/nginx/sites-enabled/default ] && [ "$AUTRES" = 1 ]; then rm -f /etc/nginx/sites-enabled/default; fi
      if ! grep -rls 'default_server' /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null | grep -vq 'overlays'; then DEFAUT=" default_server"; fi
    fi
    cat > "$FICHIER" <<EOF
# Overlays (écrit par serveur/installer.sh — relance-le plutôt que de modifier ce fichier)
server {
    listen 80$DEFAUT;
${V6:+    listen [::]:80$DEFAUT;}
    server_name ${DOMAINE:-_};

$EMPLACEMENTS
}
EOF
  fi
  [ -n "$LIEN" ] && ln -sfn "$FICHIER" "$LIEN"
  if ! nginx -t >/dev/null 2>&1; then
    nginx -t 2>&1 | tail -5
    rm -f "$FICHIER" ${LIEN:+"$LIEN"}
    stop "Nginx refuse la configuration (ci-dessus). Le fichier des overlays a été retiré : tes autres sites ne sont pas touchés."
  fi
  systemctl enable --now nginx >/dev/null 2>&1
  systemctl reload nginx
  ok "Nginx : $FICHIER (tes autres sites ne sont pas modifiés)"
fi
if command -v ufw >/dev/null && ufw status | grep -q 'Status: active'; then ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null; ok "Pare-feu : ports 80 et 443 ouverts"; fi

# ---------------------------------------------------------------------
cat <<EOF

================================================================================
  ✅ C'est installé.

  La page de téléchargement : $ADRESSE/
  L'adresse du webhook      : $ADRESSE/webhook
  Le secret du webhook      : $SECRET
  (le secret est aussi dans $ENV ; ne le mets pas dans le dépôt)

  Dernière étape, le webhook (une fois) :
    GitHub : dépôt › Settings › Webhooks › Add webhook
             Payload URL = $ADRESSE/webhook · Content type = application/json
             Secret = le secret ci-dessus · « Just the push event » · Add webhook
    GitLab : projet › Settings › Webhooks › Add new webhook
             URL = $ADRESSE/webhook · Secret token = le secret ci-dessus · « Push events »
             (branche : $BRANCHE) · (si le site est en http seulement : décoche « Enable SSL verification »)

  Les journaux : journalctl -u overlays-webhook -f    (les push reçus)
                 journalctl -u overlays-maj -n 30     (les reconstructions)
  Vérifier tout de suite (refait le site s'il y a du nouveau) : systemctl start overlays-maj
  Tout refaire, même sans nouveauté :
    runuser -u overlays -- bash -c 'set -a; . $ENV; node $DEPOT/serveur/mettre-a-jour.mjs --forcer'
================================================================================
EOF
