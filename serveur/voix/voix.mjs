/* =====================================================================
   LE BOT « VOIX » DES OVERLAYS — dit aux overlays QUI PARLE dans un salon vocal Discord.
   Il tourne sur le VPS (service systemd overlays-voix, installé par serveur/voix/installer-voix.sh).

   Ce qu'il fait :
     - il se connecte à Discord avec le jeton du bot, et SUIT une personne (SUIVRE : le MJ) : quand elle
       entre dans un salon vocal du serveur Discord, il y entre aussi (micro coupé), et en sort avec elle ;
     - il repère qui parle à l'ARRIVÉE du son : il ne le déchiffre pas, ne l'écoute pas, n'enregistre rien ;
     - il le dit aux overlays connectés (WebSocket sur 127.0.0.1:PORT, derrière Nginx en wss://…/voix),
       qui doivent d'abord donner la clé (CLE) : { type: 'bonjour', cle }.

   Messages envoyés aux overlays :
     { type: 'salon', salon: { id, nom } | null, membres: [{ id, nom, pseudo }], parlent: [id…] }   à chaque changement
     { type: 'parle', id, oui }                                                                     quelqu'un parle / se tait

   Réglages (variables d'environnement, dans /etc/overlays-voix.env) :
     DISCORD_JETON   le jeton du bot (Discord Developer Portal › ton application › Bot › Reset Token) — SECRET
     SUIVRE          la personne à suivre : son pseudo Discord, son nom affiché ou son identifiant
     SALON           (facultatif) l'identifiant d'un salon vocal où rester tout le temps, au lieu de suivre quelqu'un
     CLE             la clé que les overlays collent dans leurs réglages — SECRET
     PORT            (défaut 9322)
   Lancer à la main : DISCORD_JETON=… SUIVRE=… CLE=… node serveur/voix/voix.mjs
   Sans Discord, pour tester la chaîne VPS → overlay : CLE=… node serveur/voix/voix.mjs --simulation
     (un faux salon « Taverne » : Patagrain, Zokhran, Namerya, Kenai, Trayss, Ba Heng Ze parlent au hasard)
   ===================================================================== */
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus, entersState } from '@discordjs/voice';
import { WebSocketServer } from 'ws';
import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';

const JETON = (process.env.DISCORD_JETON || '').trim();
const SUIVRE = (process.env.SUIVRE || '').trim();
const SALON = (process.env.SALON || '').trim();
const CLE = (process.env.CLE || '').trim();
const PORT = Number(process.env.PORT) || 9322;
const heure = () => new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
const dire = (...t) => console.log(`[${heure()}]`, ...t);
const SIMULATION = process.argv.includes('--simulation');
if (!JETON && !SIMULATION) { console.error('DISCORD_JETON manquant (le jeton du bot).'); process.exit(1); }
if (!CLE) { console.error('CLE manquante (la clé des overlays).'); process.exit(1); }
if (!SUIVRE && !SALON && !SIMULATION) { console.error('SUIVRE (la personne à suivre) ou SALON (un salon fixe) : il en faut un.'); process.exit(1); }

// ---------------------------------------------------------------------
//  Ce qu'on sait du salon : on l'envoie tel quel à chaque overlay qui arrive
// ---------------------------------------------------------------------
const etat = { salon: null, membres: [], parlent: new Set() };
const photo = () => ({ type: 'salon', salon: etat.salon, membres: etat.membres, parlent: [...etat.parlent] });

// ---------------------------------------------------------------------
//  Le serveur des overlays (WebSocket), seulement sur 127.0.0.1 : Nginx le publie en wss://…/voix
// ---------------------------------------------------------------------
const http = createServer((q, r) => { r.writeHead(q.url === '/voix/sante' ? 200 : 404, { 'Content-Type': 'text/plain; charset=utf-8' }); r.end(q.url === '/voix/sante' ? 'ok' : ''); });
const wss = new WebSocketServer({ server: http, path: '/voix', maxPayload: 4096 });
const abonnes = new Set();
const bonneCle = c => { const a = Buffer.from(String(c || '')), b = Buffer.from(CLE); return a.length === b.length && timingSafeEqual(a, b); };
wss.on('connection', (ws, q) => {
  const qui = q.headers['x-real-ip'] || q.socket.remoteAddress;
  ws.vivant = true;
  ws.on('pong', () => { ws.vivant = true; });
  const delai = setTimeout(() => ws.close(4001, 'clé attendue'), 5000);
  ws.on('message', brut => {
    let m; try { m = JSON.parse(brut); } catch { return; }
    if (m.type !== 'bonjour' || abonnes.has(ws)) return;
    clearTimeout(delai);
    if (!bonneCle(m.cle)) { dire('overlay refusé (mauvaise clé) :', qui); return ws.close(4003, 'mauvaise clé'); }
    abonnes.add(ws);
    dire(`overlay connecté (${abonnes.size}) :`, qui);
    ws.send(JSON.stringify(photo()));
  });
  ws.on('close', () => { clearTimeout(delai); if (abonnes.delete(ws)) dire(`overlay parti (${abonnes.size})`); });
  ws.on('error', () => {});
});
// un « ping » toutes les 30 s : Nginx ne coupe pas, et on oublie les overlays disparus
setInterval(() => wss.clients.forEach(ws => { if (!ws.vivant) return ws.terminate(); ws.vivant = false; ws.ping(); }), 30000);
const envoyer = m => { const t = JSON.stringify(m); abonnes.forEach(ws => ws.readyState === 1 && ws.send(t)); };
http.listen(PORT, '127.0.0.1', () => dire(`Overlays : ws://127.0.0.1:${PORT}/voix`));

// ---------------------------------------------------------------------
//  Simulation : un faux salon, sans Discord
// ---------------------------------------------------------------------
if (SIMULATION) {
  dire('SIMULATION : pas de Discord, un faux salon où l’on parle au hasard');
  etat.salon = { id: '1', nom: 'Taverne (simulation)' };
  etat.membres = ['Patagrain', 'Zokhran', 'Namerya', 'Kenai', 'Trayss', 'Ba Heng Ze'].map((nom, i) => ({ id: String(100 + i), nom, pseudo: normal(nom).replace(/ /g, '') }));
  const tour = () => {
    for (const id of [...etat.parlent]) { etat.parlent.delete(id); envoyer({ type: 'parle', id, oui: false }); }
    if (Math.random() > .2) { const { id } = etat.membres[Math.floor(Math.random() * etat.membres.length)]; etat.parlent.add(id); envoyer({ type: 'parle', id, oui: true }); }
    setTimeout(tour, 700 + Math.random() * 1800);
  };
  tour();
}

// ---------------------------------------------------------------------
//  Discord
// ---------------------------------------------------------------------
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });   // aucun accès privilégié
function normal(t) { return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/^@/, '').trim(); }
const estLui = m => m && !m.user.bot && [m.id, m.user.username, m.user.globalName, m.displayName].some(v => v && normal(v) === normal(SUIVRE));

// le salon où il faut être : celui de SALON, sinon celui où est la personne suivie
function salonVoulu() {
  if (SALON) { const c = client.channels.cache.get(SALON); return c && c.isVoiceBased() ? c : null; }
  for (const g of client.guilds.cache.values())
    for (const v of g.voiceStates.cache.values()) if (v.channel && estLui(v.member)) return v.channel;
  return null;
}

function majMembres(canal) {
  etat.membres = canal ? [...canal.members.values()].filter(m => !m.user.bot)
    .map(m => ({ id: m.id, nom: m.displayName, pseudo: m.user.username })) : [];
  for (const id of etat.parlent) if (!etat.membres.some(m => m.id === id)) etat.parlent.delete(id);
  etat.salon = canal ? { id: canal.id, nom: canal.name } : null;
  envoyer(photo());
}

let ici = null;                    // le salon où le bot est
let enCours = Promise.resolve();
function suivre() { enCours = enCours.then(aller).catch(e => dire('⚠', e.message)); }
async function aller() {
  const voulu = salonVoulu();
  if (voulu?.id === ici?.id) return majMembres(ici);
  if (ici) { getVoiceConnection(ici.guild.id)?.destroy(); dire('sorti de', ici.name); ici = null; etat.parlent.clear(); majMembres(null); }
  if (!voulu) return;
  const connexion = joinVoiceChannel({ channelId: voulu.id, guildId: voulu.guild.id, adapterCreator: voulu.guild.voiceAdapterCreator,
    selfDeaf: false,                // sinon Discord ne lui envoie aucun son : il ne saurait pas qui parle
    selfMute: true });
  try { await entersState(connexion, VoiceConnectionStatus.Ready, 20000); }
  catch { connexion.destroy(); throw new Error(`impossible d'entrer dans « ${voulu.name} » (droits « Voir le salon » et « Se connecter » ?)`); }
  ici = voulu;
  dire('entré dans', voulu.name);
  connexion.receiver.speaking.on('start', id => { if (etat.parlent.has(id)) return; etat.parlent.add(id); envoyer({ type: 'parle', id, oui: true }); });
  connexion.receiver.speaking.on('end', id => { if (!etat.parlent.delete(id)) return; envoyer({ type: 'parle', id, oui: false }); });
  connexion.on(VoiceConnectionStatus.Disconnected, async () => {
    // une coupure réseau : on laisse 5 s à Discord pour se rétablir, sinon on repart de zéro
    try { await Promise.race([entersState(connexion, VoiceConnectionStatus.Signalling, 5000), entersState(connexion, VoiceConnectionStatus.Connecting, 5000)]); }
    catch { connexion.destroy(); if (ici?.id === voulu.id) { ici = null; etat.parlent.clear(); } suivre(); }
  });
  majMembres(ici);
}

client.once(Events.ClientReady, c => {
  dire(`Connecté à Discord : ${c.user.tag} — serveurs : ${c.guilds.cache.map(g => g.name).join(', ') || 'aucun (invite le bot !)'}`);
  dire(SALON ? `Reste dans le salon ${SALON}` : `Suit « ${SUIVRE} » dans les salons vocaux`);
  suivre();
});
client.on(Events.VoiceStateUpdate, (avant, apres) => {
  if (apres.id === client.user.id) return;
  const touche = [avant.channelId, apres.channelId];
  if (estLui(apres.member) || SALON || touche.includes(ici?.id)) suivre();
});
client.on(Events.Error, e => dire('⚠ Discord :', e.message));
if (!SIMULATION) client.login(JETON).catch(e => { console.error('Connexion à Discord refusée :', e.message, '(le jeton est-il le bon ?)'); process.exit(1); });

for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => { if (ici) getVoiceConnection(ici.guild.id)?.destroy(); client.destroy(); process.exit(0); });
