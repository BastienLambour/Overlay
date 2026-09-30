/* =====================================================================
   CHAT — lecture du chat Twitch en direct, sans compte ni mot de passe
   (connexion anonyme en lecture seule au serveur de chat de Twitch).
   Avec ?test=1, de faux messages défilent.
   ===================================================================== */
const Chat = (() => {
  const C = window.CONFIG || {};
  const CC = C.chat || {};
  const params = new URLSearchParams(location.search);
  const PALETTE = ['#FF9F1C', '#38CFF0', '#B794F6', '#7BE08A', '#FF6B6B', '#F6E05E', '#F687B3', '#63B3ED'];

  const echapper = t => t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function couleurPour(nom) {
    let h = 0; for (const c of nom) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }

  // Remplace les emotes Twitch (positions fournies dans les tags) par des images
  function avecEmotes(texte, emotes) {
    const car = [...texte];
    if (!emotes) return echapper(texte);
    const places = [];
    emotes.split('/').forEach(bloc => {
      const [id, pos] = bloc.split(':');
      (pos || '').split(',').forEach(p => { const [a, b] = p.split('-').map(Number); places.push({ id, a, b }); });
    });
    places.sort((x, y) => x.a - y.a);
    let html = '', i = 0;
    for (const { id, a, b } of places) {
      html += echapper(car.slice(i, a).join(''));
      html += `<img class="emote" src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0" alt="${echapper(car.slice(a, b + 1).join(''))}">`;
      i = b + 1;
    }
    return html + echapper(car.slice(i).join(''));
  }

  function lireTags(brut) {
    const tags = {};
    brut.split(';').forEach(p => { const i = p.indexOf('='); tags[p.slice(0, i)] = p.slice(i + 1); });
    return tags;
  }

  // ---------- Affichage ----------
  function monter(conteneur, { disparition = 0 } = {}) {
    const max = CC.maxMessages || 12;
    const ignorer = (CC.ignorer || []).map(n => n.toLowerCase());

    function ajouter({ id = '', login = '', nom, couleur, html }) {
      if (ignorer.includes(login.toLowerCase())) return;
      const ligne = document.createElement('div');
      ligne.className = 'chat-ligne';
      ligne.dataset.id = id; ligne.dataset.login = login.toLowerCase();
      ligne.style.setProperty('--c', couleur || couleurPour(nom));
      ligne.innerHTML = `<b>${echapper(nom)}</b><span>${html}</span>`;
      conteneur.appendChild(ligne);
      while (conteneur.children.length > max) conteneur.firstElementChild.remove();
      if (disparition > 0) setTimeout(() => { ligne.classList.add('part'); setTimeout(() => ligne.remove(), 600); }, disparition * 1000);
    }
    const retirer = filtre => conteneur.querySelectorAll('.chat-ligne').forEach(l => { if (filtre(l)) l.remove(); });

    if (params.has('test')) return simuler(ajouter);
    if (!C.chaineTwitch) {
      ajouter({ nom: 'Système', couleur: '#FF9F1C', html: 'Renseigne <b>chaineTwitch</b> dans config.js pour afficher le chat.' });
      return;
    }
    connecter(ajouter, retirer);
  }

  // ---------- Connexion IRC anonyme ----------
  function connecter(ajouter, retirer) {
    const canal = '#' + C.chaineTwitch.toLowerCase().replace(/^#/, '');
    const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    ws.onopen = () => {
      ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
      ws.send('PASS SCHMOOPIIE');
      ws.send('NICK justinfan' + Math.floor(10000 + Math.random() * 80000));
      ws.send('JOIN ' + canal);
    };
    ws.onmessage = ev => ev.data.split('\r\n').forEach(ligne => {
      if (!ligne) return;
      if (ligne.startsWith('PING')) return ws.send('PONG :tmi.twitch.tv');
      const m = ligne.match(/^(?:@(\S+) )?:(\S+?)(?:!\S+)? (PRIVMSG|CLEARMSG|CLEARCHAT) #\S+(?: :(.*))?$/);
      if (!m) return;
      const [, brutTags, prefixe, commande, texte = ''] = m;
      const tags = brutTags ? lireTags(brutTags) : {};
      if (commande === 'CLEARCHAT') return texte ? retirer(l => l.dataset.login === texte.toLowerCase()) : retirer(() => true);
      if (commande === 'CLEARMSG') return retirer(l => l.dataset.id === tags['target-msg-id']);

      let message = texte;
      const action = message.match(/^\u0001ACTION (.*)\u0001$/);
      if (action) message = action[1];
      if (CC.masquerCommandes && message.startsWith('!')) return;
      ajouter({ id: tags.id, login: prefixe, nom: tags['display-name'] || prefixe, couleur: tags.color, html: avecEmotes(message, tags.emotes) });
    });
    ws.onclose = () => setTimeout(() => connecter(ajouter, retirer), 3000);
  }

  // ---------- Mode test ----------
  function simuler(ajouter) {
    const faux = [['Astro_Lou', 'bonsoir l’équipage o7'], ['Kepler', 'on décolle quand ?'], ['Nova_77', 'la fusée est trop propre'],
      ['StarPilot', 'T-moins combien ?'], ['Capitaine_K', 'GG pour l’alunissage'], ['Orbite', 'check du hublot 🚀'],
      ['Luna_B', 'première fois ici, salut !'], ['Cosmo', 'le son est parfait']];
    let i = 0;
    const suivant = () => { const [nom, t] = faux[i++ % faux.length]; ajouter({ login: nom, nom, html: echapper(t) }); };
    for (let k = 0; k < 4; k++) suivant();
    setInterval(suivant, 2600);
  }

  return { monter };
})();
