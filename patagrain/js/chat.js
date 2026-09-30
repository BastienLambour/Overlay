/* =====================================================================
   CHAT — lecture du chat Twitch en direct, sans compte ni mot de passe
   (connexion anonyme en lecture seule au serveur de chat de Twitch).
   Avec ?test=1, de faux messages défilent.
   Mémoire : les derniers messages sont gardés (localStorage « overlay-<id>-chat »),
   pour que le chat d'une scène ne reparte pas à vide quand on change de scène
   ou qu'une page est actualisée (config.js › chat.memoireMinutes).
   ===================================================================== */
const Chat = (() => {
  const C = window.CONFIG || {};
  const CC = C.chat || {};
  const params = new URLSearchParams(location.search);
  const test = params.has('test') || params.has('demo');
  const PALETTE = ['#3A9AD9', '#F5B82E', '#E5484D', '#8BD17C', '#C792EA', '#FF9F68'];
  // Badges façon JDR : chapeau (toi), épée (modos), bouclier (abonnés), d20 (VIP)
  const BADGES = {
    broadcaster: '<img src="../assets/chapeau.svg" alt="">',
    moderator:   '<img src="../assets/epee.svg" alt="" class="badge-epee">',
    subscriber:  '<svg viewBox="0 0 90 100"><use href="#i-bouclier"/></svg>',
    vip:         '<svg viewBox="0 0 100 100"><use href="#i-d20"/></svg>',
  };

  // --- Mémoire partagée par toutes les pages de l'overlay (dédoublonnée par identifiant de message) ---
  const CLE = `overlay-${C.id || 'defaut'}-chat`;
  const GARDE = (CC.memoireMinutes ?? 10) * 60000;
  const memoire = {
    lire() { try { return (JSON.parse(localStorage.getItem(CLE)) || []).filter(m => Date.now() - m.t < GARDE); } catch (e) { return []; } },
    ecrire(liste) { try { localStorage.setItem(CLE, JSON.stringify(liste.slice(-40))); } catch (e) {} },
    ajouter(m) { if (!m.id || !GARDE) return; const l = memoire.lire(); if (!l.some(x => x.id === m.id)) { l.push(m); memoire.ecrire(l); } },
    retirer(test) { memoire.ecrire(memoire.lire().filter(m => !test(m))); },
  };

  const echapper = t => t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Couleur du pseudo : celle de Twitch, éclaircie si elle est trop sombre pour le fond
  function couleur(hex, pseudo) {
    if (!/^#[0-9a-f]{6}$/i.test(hex || '')) {
      let h = 0; for (const c of pseudo) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      return PALETTE[h % PALETTE.length];
    }
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (l >= .6) return hex;
    const d = max - min, s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return `hsl(${Math.round(h * 60 + 360) % 360} ${Math.round(Math.max(s, .5) * 100)}% 65%)`;
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
      html += `<img class="emote" src="https://static-cdn.jtvnw.net/emoticons/v2/${encodeURIComponent(id)}/default/dark/2.0" alt="${echapper(car.slice(a, b + 1).join(''))}">`;
      i = b + 1;
    }
    return html + echapper(car.slice(i).join(''));
  }

  function lireTags(brut) {
    const tags = {};
    brut.slice(1).split(';').forEach(kv => { const i = kv.indexOf('='); tags[kv.slice(0, i)] = kv.slice(i + 1).replace(/\\s/g, ' '); });
    return tags;
  }

  // Monte un chat dans un conteneur. options : { max, disparition (s) }
  function monter(conteneur, { max = CC.maxMessages || 14, disparition = 0 } = {}) {
    conteneur.classList.add('chat');
    const ignores = (CC.ignorer || []).map(n => n.toLowerCase());

    function ajouter({ id = '', userId = '', login = '', pseudo, coul, badges = '', html }, depuis = 0) {
      if (ignores.includes((login || pseudo).toLowerCase())) return;
      if (conteneur.querySelector(`[data-id="${CSS.escape(id)}"]`) && id) return;
      const reste = disparition * 1000 - depuis;          // un message remis depuis la mémoire a déjà vécu « depuis » ms
      if (disparition && reste <= 0) return;
      const el = document.createElement('div');
      el.className = 'chat-msg';
      el.dataset.id = id; el.dataset.user = userId;
      el.style.setProperty('--c', couleur(coul, pseudo));
      const icones = badges.split(',').map(b => BADGES[b.split('/')[0]]).filter(Boolean).join('');
      el.innerHTML = `<span class="chat-pseudo">${icones ? `<span class="chat-badges">${icones}</span>` : ''}${echapper(pseudo)}</span><span class="chat-texte">${html}</span>`;
      conteneur.append(el);
      while (conteneur.children.length > max) conteneur.firstElementChild.remove();
      if (disparition) setTimeout(() => { el.classList.add('sortie'); setTimeout(() => el.remove(), 600); }, reste);
    }

    if (test) {
      const faux = [
        ['Gwendal', '#F5B82E', 'Salut Patagrain ! 🎲', 'subscriber/1'],
        ['LaDameDuLac', '#E5484D', 'On lance les dés ce soir ?', ''],
        ['Bob_le_Nain', '#1B2A6B', 'Je veux un coup critique !', 'vip/1'],
        ['Ysolde', '#8BD17C', 'Le chapeau est trop stylé', 'moderator/1'],
        ['Patagrain', '#3A9AD9', 'Bienvenue à la taverne tout le monde !', 'broadcaster/1'],
        ['Merlin_Pinpin', '', 'Qui a pris le dernier hydromel ?', ''],
      ];
      let n = 0;
      const suivant = () => { const [p, c, t, b] = faux[n++ % faux.length]; ajouter({ pseudo: p, coul: c, badges: b, html: echapper(t) }); };
      for (let k = 0; k < 4; k++) suivant();
      setInterval(suivant, 2600);
      return;
    }

    // Les derniers messages déjà reçus (par cette page ou une autre scène)
    memoire.lire().forEach(m => ajouter(m, Date.now() - m.t));

    const chaine = String(params.get('chaine') || C.chaineTwitch || '').toLowerCase().replace(/^#/, '');
    if (!chaine) return console.warn('[Overlay] chaineTwitch manquant dans config.js');
    let delai = 1000;
    (function connecter() {
      const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
      ws.onopen = () => {
        delai = 1000;
        ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        ws.send('PASS SCHMOOPIIE');
        ws.send('NICK justinfan' + Math.floor(10000 + Math.random() * 80000));
        ws.send('JOIN #' + chaine);
      };
      ws.onmessage = e => e.data.split('\r\n').filter(Boolean).forEach(ligne => {
        if (ligne.startsWith('PING')) return ws.send('PONG :tmi.twitch.tv');
        const m = ligne.match(/^(@\S+) :(\w+)!\S+ PRIVMSG #\S+ :(.*)$/);
        if (m) {
          const tags = lireTags(m[1]);
          let texte = m[3];
          const action = texte.match(/^\x01ACTION (.*)\x01$/);
          if (action) texte = action[1];
          if (CC.masquerCommandes !== false && texte.trim().startsWith('!')) return;
          const msg = { id: tags.id, userId: tags['user-id'], login: m[2], pseudo: tags['display-name'] || m[2],
            coul: tags.color, badges: tags.badges || '', html: avecEmotes(texte, tags.emotes) };
          if (ignores.includes(m[2].toLowerCase())) return;
          memoire.ajouter({ ...msg, t: Date.now() });
          return ajouter(msg);
        }
        // Messages supprimés et bannissements décidés par la modération
        const efface = ligne.match(/^(@\S+) :tmi\.twitch\.tv CLEARMSG/);
        if (efface) {
          const cible = lireTags(efface[1])['target-msg-id'] || '';
          memoire.retirer(m => m.id === cible);
          return conteneur.querySelector(`[data-id="${CSS.escape(cible)}"]`)?.remove();
        }
        const ban = ligne.match(/^(@\S+) :tmi\.twitch\.tv CLEARCHAT/);
        if (ban) {
          const cible = lireTags(ban[1])['target-user-id'];
          memoire.retirer(m => !cible || m.userId === cible);
          conteneur.querySelectorAll(cible ? `[data-user="${CSS.escape(cible)}"]` : '.chat-msg').forEach(x => x.remove());
        }
      });
      ws.onclose = () => { setTimeout(connecter, delai); delai = Math.min(delai * 2, 30000); };
    })();
  }

  return { monter };
})();
