/* =====================================================================
   METTRE À JOUR LE SERVEUR — récupère la dernière version du dépôt, puis refait
   les zips et la page (serveur/construire.mjs) SEULEMENT si quelque chose a changé.

   Lancé par le webhook (serveur/webhook.mjs) à chaque push, et une fois par heure par
   le minuteur systemd (filet de sécurité si un webhook se perd).
       node serveur/mettre-a-jour.mjs            → seulement si le dépôt a changé
       node serveur/mettre-a-jour.mjs --forcer   → refait tout quoi qu'il arrive
   Variables : BRANCHE (défaut : main), SORTIE, ADRESSE (transmises à construire.mjs).
   ===================================================================== */
import { execFileSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEPOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BRANCHE = process.env.BRANCHE || 'main';
const git = (...args) => execFileSync('git', ['-C', DEPOT, ...args], { encoding: 'utf8' }).trim();
const heure = () => new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

try {
  const avant = git('rev-parse', 'HEAD');
  git('fetch', '--quiet', 'origin', BRANCHE);
  // Le dépôt du serveur ne sert qu'à lire : on se cale exactement sur la branche distante
  git('reset', '--quiet', '--hard', `origin/${BRANCHE}`);
  const apres = git('rev-parse', 'HEAD');
  if (avant === apres && !process.argv.includes('--forcer')) {
    console.log(`[${heure()}] Rien de nouveau (${apres.slice(0, 7)}).`);
    process.exit(0);
  }
  console.log(`[${heure()}] ${avant.slice(0, 7)} → ${apres.slice(0, 7)} : reconstruction…`);
  execFileSync(process.execPath, [join(DEPOT, 'serveur', 'construire.mjs')], { stdio: 'inherit', env: process.env });
  console.log(`[${heure()}] Terminé.`);
} catch (e) {
  console.error(`[${heure()}] Échec de la mise à jour : ${e.message}`);
  process.exit(1);
}
