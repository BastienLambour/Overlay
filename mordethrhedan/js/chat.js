/* =====================================================================
   CHAT — lecture du chat Twitch en direct, sans compte ni mot de passe
   (connexion anonyme en lecture seule au serveur de chat de Twitch).
   Avec ?test=1, de faux messages défilent.
   ===================================================================== */
const Chat = (() => {
  const C = window.CONFIG || {};
  const CC = C.chat || {};
  const params = new URLSearchParams(location.search);
  const PALETTE = ['#C8964A', '#6FA8FF', '#FF7A7A', '#B794F6', '#7BE08A', '#F6E05E', '#F687B3', '#63B3ED'];

  // Petites icônes de badges (pas besoin de l'API Twitch)
  const svg = (fond, d) => `<i class="badge" style="background:${fond}"><svg viewBox="0 0 16 16"><path d="${d}" fill="#fff"/></svg></i>`;
  const BADGES = {
    broadcaster: svg('#E91916', 'M2 5h8v6H2z M10 7l4-2v6l-4-2z'),
    moderator:   svg('#00AD03', 'M11 2l3 0 0 3-6 6 1 1-1 1-1-1-2 2-1-1 2-2-1-1 1-1 1 1z'),
    vip:         svg('#E005B9', 'M4 3h8l3 4-7 7-7-7z'),
    subscriber:  svg('var(--accent-fonce)', 'M8 1.5l2 4.2 4.5.6-3.3 3.1.8 4.5L8 11.7 4 13.9l.8-4.5L1.5 6.3 6 5.7z'),
    founder:     svg('#9146FF', 'M8 1.5l2 4.2 4.5.6-3.3 3.1.8 4.5L8 11.7 4 13.9l.8-4.5L1.5 6.3 6 5.7z'),
    partner:     svg('#9146FF', 'M6.5 11.5L3 8l1.2-1.2 2.3 2.3 5.3-5.3L13 5z'),
    premium:     svg('#0A7CFF', 'M2 12l1.5-7 3 3L8 3l1.5 5 3-3L14 12z'),
    turbo:       svg('#0A7CFF', 'M2 12l1.5-7 3 3L8 3l1.5 5 3-3L14 12z'),
  };

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
  const badgesDe = brut => (brut || '').split(',').map(b => b.split('/')[0]).filter(b => BADGES[b]).map(b => BADGES[b]).join('');

  // ---------- Affichage ----------
  function monter(conteneur, { disparition = 0 } = {}) {
    const max = CC.maxMessages || 12;
    const ignorer = (CC.ignorer || []).map(n => n.toLowerCase());

    function ajouter({ id = '', login = '', nom, couleur, badges = '', html }) {
      if (ignorer.includes(login.toLowerCase())) return;
      const carte = document.createElement('div');
      carte.className = 'msg';
      carte.dataset.id = id; carte.dataset.login = login.toLowerCase();
      carte.style.setProperty('--c', couleur || couleurPour(nom));
      carte.innerHTML = `<div class="msg-tete"><span class="msg-nom">${echapper(nom)}</span><span class="badges">${badges}</span></div><p>${html}</p>`;
      conteneur.appendChild(carte);
      while (conteneur.children.length > max) conteneur.firstElementChild.remove();
      if (disparition > 0) setTimeout(() => { carte.classList.add('part'); setTimeout(() => carte.remove(), 600); }, disparition * 1000);
    }
    const retirer = filtre => conteneur.querySelectorAll('.msg').forEach(l => { if (filtre(l)) l.remove(); });

    if (params.has('test')) return simuler(ajouter);
    if (!C.chaineTwitch) {
      ajouter({ nom: 'Système', html: 'Renseigne <b>chaineTwitch</b> dans config.js pour afficher le chat.' });
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
      ajouter({ id: tags.id, login: prefixe, nom: tags['display-name'] || prefixe, couleur: tags.color, badges: badgesDe(tags.badges), html: avecEmotes(message, tags.emotes) });
    });
    ws.onclose = () => setTimeout(() => connecter(ajouter, retirer), 3000);
  }

  // ---------- Mode test ----------
  function simuler(ajouter) {
    const faux = [
      ['Mordethrhedan', 'broadcaster/1,subscriber/0', 'Salut la compagnie !'],
      ['Kaelis', 'moderator/1,subscriber/12', 'On repart sur la Crypte ?'],
      ['Pey_J', 'vip/1', 'gg pour le dernier boss'],
      ['Shauni', 'subscriber/3', 'le nouveau cadre est trop propre'],
      ['Double_H', '', 'pause pipi validée'],
      ['Jade_BGE', 'subscriber/24,premium/1', 'le PB tombe ce soir, je le sens'],
      ['Secundo', '', 'première fois ici, salut !'],
    ];
    let i = 0;
    const suivant = () => { const [nom, b, t] = faux[i++ % faux.length]; ajouter({ login: nom, nom, badges: badgesDe(b), html: echapper(t) }); };
    for (let k = 0; k < 5; k++) suivant();
    setInterval(suivant, 3000);
  }

  return { monter };
})();
