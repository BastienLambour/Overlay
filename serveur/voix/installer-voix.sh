#!/usr/bin/env bash
# =====================================================================
#  INSTALLER LE BOT DISCORD « VOIX » — sur le VPS, en root, APRÈS serveur/installer.sh (il s'en sert).
#  Le bot dit aux overlays qui parle dans le salon vocal Discord (serveur/voix/LISEZMOI.md).
#
#  Ce qu'il met en place :
#    - Node.js 22.12 ou plus (la bibliothèque vocale de Discord l'exige), s'il est plus ancien ;
#    - les bibliothèques du bot (npm ci dans le dépôt du serveur, serveur/voix/node_modules — jamais dans Git) ;
#    - /etc/overlays-voix.env (SECRET : le jeton du bot, la personne à suivre, la clé des overlays) ;
#    - le service overlays-voix (tourne sous l'utilisateur « overlays », jamais en root) et sa relance toute
#      seule quand le dépôt apporte une nouvelle version du bot (overlays-voix-maj.path) ;
#    - /voix sur le site des overlays (Nginx ou Caddy), en relançant serveur/installer.sh si besoin.
#
#  Utilisation (depuis ton PC, dans le dossier du dépôt) — après avoir créé le bot sur Discord (LISEZMOI.md) :
#      scp serveur/voix/installer-voix.sh root@ADRESSE_DU_VPS:
#      ssh -t root@ADRESSE_DU_VPS "bash installer-voix.sh"     (-t : il te demande le jeton et ton pseudo)
#  Relançable sans risque : il garde le jeton, la personne suivie et la clé (sauf si tu en donnes d'autres).
#
#  Réglages (variables à mettre devant la commande, toutes facultatives) :
#      DISCORD_JETON   le jeton du bot (sinon il le demande)
#      SUIVRE          ton pseudo Discord : le bot te suit dans les salons vocaux (sinon il le demande)
#      SALON           l'identifiant d'un salon vocal où rester tout le temps (au lieu de suivre quelqu'un)
#      NOUVELLE_CLE=1  refaire la clé des overlays (l'ancienne ne marche plus : la recoller dans les réglages)
# =====================================================================
set -euo pipefail

RACINE="${RACINE:-/var/www/overlays}"
UTILISATEUR=overlays
DEPOT="$RACINE/depot"
VOIX="$DEPOT/serveur/voix"
ENV_SERVEUR=/etc/overlays.env
ENV=/etc/overlays-voix.env
PORT=9322

dire()  { printf '\n\033[1;33m▶ %s\033[0m\n' "$*"; }
ok()    { printf '  \033[32m✔\033[0m %s\n' "$*"; }
stop()  { printf '\n\033[1;31m✖ %s\033[0m\n' "$*" >&2; exit 1; }
[ "$(id -u)" = 0 ] || stop "À lancer en root (ou avec sudo)."
[ -f "$ENV_SERVEUR" ] && [ -d "$DEPOT/.git" ] || stop "Le serveur des overlays n'est pas installé : lance d'abord serveur/installer.sh."
en_overlays() { runuser -u "$UTILISATEUR" -- env HOME="$RACINE" "$@"; }
lire_env() { [ -f "$1" ] && grep "^$2=" "$1" | head -1 | cut -d= -f2- || true; }
clavier() { { true < /dev/tty; } 2>/dev/null; }

# ---------------------------------------------------------------------
dire "1/6 Le dépôt du serveur à jour (avec le bot)"
systemctl start overlays-maj.service || true
[ -f "$VOIX/voix.mjs" ] && [ -f "$VOIX/package-lock.json" ] || stop "Le bot n'est pas encore dans le dépôt ($VOIX) : pousse (git push) la version qui contient serveur/voix, puis relance."
ok "$(en_overlays git -C "$DEPOT" log -1 --format='%h %s')"

# ---------------------------------------------------------------------
dire "2/6 Node.js 22.12 ou plus"
version_node() { node -e 'const [a,b]=process.versions.node.split(".").map(Number);console.log(a*100+b)' 2>/dev/null || echo 0; }
if [ "$(version_node)" -lt 2212 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
NODE="$(command -v node)"; NPM="$(command -v npm)"
ok "Node.js $(node --version)"

# ---------------------------------------------------------------------
dire "3/6 Le bot Discord (jeton, personne à suivre, clé des overlays)"
JETON="${DISCORD_JETON:-$(lire_env "$ENV" DISCORD_JETON)}"
SUIVRE="${SUIVRE:-$(lire_env "$ENV" SUIVRE)}"
SALON="${SALON:-$(lire_env "$ENV" SALON)}"
CLE="$(lire_env "$ENV" CLE)"
[ -n "${NOUVELLE_CLE:-}" ] && CLE=""
# une question à l'API de Discord avec le jeton du bot : discord <jeton> <chemin> <champ>
discord() { curl -fsS --max-time 15 -H "Authorization: Bot $1" "https://discord.com/api/v10/$2" 2>/dev/null \
  | node -e 'let t="";process.stdin.on("data",d=>t+=d).on("end",()=>{try{console.log(JSON.parse(t)[process.argv[1]]||"")}catch{}})' "$3"; }
nom_du_bot() { discord "$1" users/@me username; }
until [ -n "$JETON" ] && NOM_BOT="$(nom_du_bot "$JETON")" && [ -n "$NOM_BOT" ]; do
  [ -n "$JETON" ] && printf '  Discord refuse ce jeton.\n'
  clavier || stop "Il me faut le jeton du bot : relance avec ssh -t (pour répondre), ou DISCORD_JETON=… devant la commande."
  read -r -s -p "  Colle le jeton du bot (Discord Developer Portal › ton application › Bot › Reset Token), puis Entrée : " JETON < /dev/tty; echo
done
ok "Jeton accepté : le bot s'appelle « $NOM_BOT »"
if [ -z "$SALON" ] && [ -z "$SUIVRE" ]; then
  clavier || stop "Il me faut ton pseudo Discord : relance avec ssh -t, ou SUIVRE=… devant la commande."
  read -r -p "  Ton pseudo Discord (le bot te suivra dans les salons vocaux) : " SUIVRE < /dev/tty
  [ -n "$SUIVRE" ] || stop "Pseudo vide."
fi
[ -n "$CLE" ] || CLE="$(openssl rand -hex 16)"
cat > "$ENV" <<EOF
# Réglages du bot Discord « voix » des overlays (service overlays-voix). SECRET : ne pas le mettre dans le dépôt.
# Après une modification : systemctl restart overlays-voix
DISCORD_JETON=$JETON
SUIVRE=$SUIVRE
SALON=$SALON
CLE=$CLE
PORT=$PORT
EOF
chown "root:$UTILISATEUR" "$ENV"; chmod 640 "$ENV"
if [ -n "$SALON" ]; then QUOI="reste dans le salon $SALON"; else QUOI="te rejoint dans les salons vocaux (il suit « $SUIVRE »)"; fi
ok "$ENV : le bot $QUOI"
APPLI="$(discord "$JETON" applications/@me id)"
# Voir les salons (1024) + Se connecter (1048576) : rien d'autre
INVITATION="https://discord.com/oauth2/authorize?client_id=${APPLI:-ID-DE-L-APPLICATION}&scope=bot&permissions=1049600"

# ---------------------------------------------------------------------
dire "4/6 Les bibliothèques du bot (npm ci)"
chown -R "$UTILISATEUR:$UTILISATEUR" "$VOIX"
en_overlays sh -c "cd '$VOIX' && '$NPM' ci --omit=dev --no-audit --no-fund --loglevel=error"
sha256sum "$VOIX/package-lock.json" | cut -d' ' -f1 > "$RACINE/.voix-lock"
ok "$VOIX/node_modules"

# ---------------------------------------------------------------------
dire "5/6 Services : overlays-voix + relance à chaque nouvelle version"
cat > /etc/systemd/system/overlays-voix.service <<EOF
[Unit]
Description=Overlays : bot Discord « voix » (dit aux overlays qui parle dans le salon vocal)
After=network-online.target
Wants=network-online.target

[Service]
User=$UTILISATEUR
Environment=HOME=$RACINE
EnvironmentFile=$ENV
WorkingDirectory=$VOIX
ExecStart=$NODE $VOIX/voix.mjs
Restart=always
RestartSec=10
NoNewPrivileges=yes
ProtectSystem=strict
ReadWritePaths=$RACINE
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
EOF
# Le dépôt change (webhook / minuteur) → bibliothèques refaites si package-lock.json a changé, puis bot relancé
# (un petit script : dans une commande ExecStart, systemd remplacerait lui-même les $)
cat > /usr/local/lib/overlays-voix-maj.sh <<EOF
#!/bin/sh
# Écrit par serveur/voix/installer-voix.sh (lancé par overlays-voix-maj.path quand le bot change dans le dépôt)
sleep 5
L="\$(sha256sum $VOIX/package-lock.json | cut -d' ' -f1)"
if [ "\$L" != "\$(cat $RACINE/.voix-lock 2>/dev/null)" ]; then
  runuser -u $UTILISATEUR -- env HOME=$RACINE sh -c "cd $VOIX && $NPM ci --omit=dev --no-audit --no-fund --loglevel=error" && echo "\$L" > $RACINE/.voix-lock
fi
systemctl restart overlays-voix.service
EOF
chmod 755 /usr/local/lib/overlays-voix-maj.sh
cat > /etc/systemd/system/overlays-voix-maj.service <<EOF
[Unit]
Description=Overlays : relance le bot « voix » après une mise à jour du dépôt

[Service]
Type=oneshot
ExecStart=/usr/local/lib/overlays-voix-maj.sh
EOF
cat > /etc/systemd/system/overlays-voix-maj.path <<EOF
[Unit]
Description=Overlays : surveille le bot « voix » dans le dépôt

[Path]
PathChanged=$VOIX/voix.mjs
PathChanged=$VOIX/package-lock.json

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now overlays-voix.service overlays-voix-maj.path >/dev/null 2>&1
systemctl restart overlays-voix.service
sleep 4
systemctl is-active --quiet overlays-voix.service || { journalctl -u overlays-voix -n 15 --no-pager; stop "Le bot ne démarre pas (ci-dessus). Journal complet : journalctl -u overlays-voix -n 50"; }
curl -fsS --max-time 5 "http://127.0.0.1:$PORT/voix/sante" >/dev/null || stop "Le bot tourne mais ne répond pas sur 127.0.0.1:$PORT : journalctl -u overlays-voix -n 50"
ok "overlays-voix actif (127.0.0.1:$PORT)"

# ---------------------------------------------------------------------
dire "6/6 /voix sur le site des overlays"
ADRESSE="$(lire_env "$ENV_SERVEUR" ADRESSE)"
if ! grep -rqs 'location /voix\|handle /voix' /etc/nginx/sites-available/overlays /etc/nginx/conf.d/overlays.conf /etc/caddy/overlays.caddy; then
  # le fichier du site date d'avant le bot : on relance l'installation du serveur (mêmes réglages), qui l'ajoute
  [ -f "$DEPOT/serveur/installer.sh" ] || stop "serveur/installer.sh introuvable dans le dépôt."
  HOTE="$(printf '%s' "$ADRESSE" | sed -E 's#^https?://##; s#[:/].*##')"
  if printf '%s' "$HOTE" | grep -qE '^[0-9.]+$'; then DOM=""; else DOM="$HOTE"; fi
  DEPOT_URL="$(en_overlays git -C "$DEPOT" remote get-url origin)" BRANCHE="$(lire_env "$ENV_SERVEUR" BRANCHE)" DOMAINE="$DOM" \
    bash "$DEPOT/serveur/installer.sh" > /tmp/overlays-installer.log 2>&1 || { tail -20 /tmp/overlays-installer.log; stop "La mise à jour du site a échoué (ci-dessus ; tout est dans /tmp/overlays-installer.log)."; }
fi
if curl -fsS --max-time 10 "$ADRESSE/voix/sante" >/dev/null 2>&1; then ok "$ADRESSE/voix répond"
else printf '  ⚠ %s/voix/sante ne répond pas depuis le VPS (pare-feu, DNS ?). Teste-le depuis ton PC dans un navigateur : il doit afficher « ok ».\n' "$ADRESSE"; fi
WSS="$(printf '%s' "$ADRESSE" | sed 's#^http#ws#')/voix"

# ---------------------------------------------------------------------
cat <<EOF

================================================================================
  ✅ Le bot « $NOM_BOT » est installé.

  1. Invite-le sur ton serveur Discord (une fois) — ouvre ce lien, choisis le serveur, Autoriser :
       $INVITATION
  2. Dans reglages.html de l'overlay › Scène JDR :
       « Brancher Discord » coché · adresse : vide (= $WSS)
       Clé du bot Discord : $CLE
     et, dans le tableau des joueurs, la colonne « Discord » : le pseudo de chacun.
  3. Entre dans un salon vocal : le bot $QUOI, micro coupé.

  Le jeton et la clé sont dans $ENV (secret : pas dans le dépôt).
  Journal du bot : journalctl -u overlays-voix -f
  Tester sans Discord (faux salon, on parle au hasard) :
    systemctl stop overlays-voix
    runuser -u overlays -- env CLE=$CLE node $VOIX/voix.mjs --simulation      (Ctrl+C pour arrêter)
    systemctl start overlays-voix
================================================================================
EOF
