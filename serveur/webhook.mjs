/* =====================================================================
   WEBHOOK — reçoit les « push » de GitHub ou de GitLab et met le serveur à jour aussitôt.

   Écoute sur 127.0.0.1 (jamais directement sur internet) : Nginx ou Caddy lui transmet
   l'adresse publique /webhook. Chaque appel est vérifié avec le SECRET :
     - GitHub : en-tête X-Hub-Signature-256 = HMAC-SHA256 du message avec le secret ;
     - GitLab : en-tête X-Gitlab-Token = le secret.
   Seuls les push sur la branche suivie (BRANCHE, défaut : main) déclenchent la mise à jour ;
   si un push arrive pendant une mise à jour, une seule autre est relancée juste après.

   Lancé par systemd (service overlays-webhook, voir serveur/installer.sh).
   Variables : SECRET (obligatoire), PORT (défaut : 9321), BRANCHE, SORTIE, ADRESSE.
   ===================================================================== */
import { createServer } from 'node:http';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEPOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SECRET = process.env.SECRET || '';
const PORT = Number(process.env.PORT) || 9321;
const BRANCHE = process.env.BRANCHE || 'main';
if (SECRET.length < 16) { console.error('SECRET manquant ou trop court (16 caractères minimum).'); process.exit(1); }

const egal = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };

// --- Une mise à jour à la fois ; un push pendant ce temps = une seule relance à la fin ---
let enCours = false, aRefaire = false;
function mettreAJour() {
  if (enCours) { aRefaire = true; return; }
  enCours = true;
  const p = spawn(process.execPath, [join(DEPOT, 'serveur', 'mettre-a-jour.mjs')], { stdio: 'inherit', env: process.env });
  p.on('close', () => { enCours = false; if (aRefaire) { aRefaire = false; mettreAJour(); } });
}

createServer((req, res) => {
  const repondre = (code, texte) => { res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(texte + '\n'); };
  if (req.method !== 'POST') return repondre(405, 'Webhook des overlays : POST seulement.');
  const morceaux = [];
  let taille = 0;
  req.on('data', m => { taille += m.length; if (taille > 5e6) req.destroy(); else morceaux.push(m); });
  req.on('end', () => {
    const corps = Buffer.concat(morceaux);
    const github = req.headers['x-hub-signature-256'], gitlab = req.headers['x-gitlab-token'];
    const valide = github ? egal(github, 'sha256=' + createHmac('sha256', SECRET).update(corps).digest('hex'))
      : gitlab ? egal(gitlab, SECRET) : false;
    if (!valide) { console.warn(`Appel refusé (secret absent ou faux) depuis ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`); return repondre(401, 'Secret invalide.'); }

    const evenement = req.headers['x-github-event'] || req.headers['x-gitlab-event'] || '';
    if (evenement === 'ping') return repondre(200, 'pong');   // test d'installation de GitHub
    let donnees = {};
    try { donnees = JSON.parse(corps.toString('utf8') || '{}'); } catch (e) { return repondre(400, 'JSON illisible.'); }
    if (!/push/i.test(evenement)) return repondre(202, `Événement « ${evenement} » ignoré.`);
    if (donnees.ref && donnees.ref !== `refs/heads/${BRANCHE}`) return repondre(202, `Branche ${donnees.ref} ignorée (seule ${BRANCHE} est publiée).`);
    console.log(`Push reçu (${github ? 'GitHub' : 'GitLab'}, ${donnees.ref || '?'}) : mise à jour.`);
    mettreAJour();
    repondre(202, 'Mise à jour lancée.');
  });
}).listen(PORT, '127.0.0.1', () => console.log(`Webhook des overlays : http://127.0.0.1:${PORT} (branche ${BRANCHE})`));
