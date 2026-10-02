/* =====================================================================
   DERNIERS — dernier follow, dernier sub, dernier raid, dernière série
   de visionnage, pour la ligne du bas des scènes. Sans aucun bot :

   • Chat Twitch (connexion anonyme, rien à régler) : abonnements,
     réabonnements, abonnements offerts, raids et séries de visionnage
     (« watch streak ») passent dans le chat sous forme d'annonces.
   • StreamElements (js/evenements.js, le même branchement que les alertes) :
     le follow, lui, ne passe PAS dans le chat. Il vient de StreamElements,
     avec le jeton collé dans reglages.html › StreamElements.

   Les valeurs sont gardées (localStorage « overlay-<id>-derniers ») et
   partagées entre toutes les scènes ouvertes dans OBS.
   Avec ?test=1 : fausses valeurs qui changent toutes les 6 s.
   ===================================================================== */
const Derniers = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);
  const test = params.has('test');
  const CLE = `overlay-${C.id || 'defaut'}-derniers`;
  const abonnes = [];

  let etat = {};
  try { if (!test) etat = JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { etat = {}; }

  function maj(type, valeur) {
    if (!valeur || etat[type] === valeur) return;
    etat[type] = valeur;
    if (!test) try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {}
    abonnes.forEach(fn => fn(etat, type));
  }

  // Une autre scène ouverte dans OBS a reçu un événement : on se met à jour aussi
  addEventListener('storage', ev => {
    if (ev.key !== CLE || test) return;
    let nouv = {};
    try { nouv = JSON.parse(ev.newValue) || {}; } catch (e) { return; }
    Object.keys(nouv).forEach(type => { if (nouv[type] !== etat[type]) { etat[type] = nouv[type]; abonnes.forEach(fn => fn(etat, type)); } });
  });

  // ---------- Chat Twitch : les annonces (USERNOTICE) ----------
  function lireTags(brut) {
    const tags = {};
    brut.split(';').forEach(p => { const i = p.indexOf('='); tags[p.slice(0, i)] = (p.slice(i + 1) || '').replace(/\\s/g, ' '); });
    return tags;
  }
  function depuisChat(t) {
    const nom = t['display-name'] || t.login || '';
    switch (t['msg-id']) {
      case 'sub': case 'resub': return maj('sub', nom);
      case 'subgift': case 'anonsubgift': return maj('sub', t['msg-param-recipient-display-name'] || nom);
      case 'submysterygift': return maj('sub', `${nom} ×${t['msg-param-mass-gift-count'] || '?'}`);
      case 'raid': return maj('raid', `${t['msg-param-displayName'] || nom} · ${t['msg-param-viewerCount'] || '?'}`);
      case 'viewermilestone':
        if (t['msg-param-category'] === 'watch-streak') return maj('serie', `${nom} · ${t['msg-param-value'] || '?'}`);
    }
  }
  function ecouterChat() {
    if (!C.chaineTwitch) return;
    const canal = '#' + C.chaineTwitch.toLowerCase().replace(/^#/, '');
    const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    ws.onopen = () => {
      ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
      ws.send('PASS SCHMOOPIIE');
      ws.send('NICK justinfan' + Math.floor(10000 + Math.random() * 80000));
      ws.send('JOIN ' + canal);
    };
    ws.onmessage = ev => ev.data.split('\r\n').forEach(ligne => {
      if (ligne.startsWith('PING')) return ws.send('PONG :tmi.twitch.tv');
      const m = ligne.match(/^@(\S+) :tmi\.twitch\.tv USERNOTICE #\S+/);
      if (!m) return;
      const tags = lireTags(m[1]);
      console.debug('[Overlay] Annonce du chat', tags['msg-id'], tags);
      depuisChat(tags);
    });
    ws.onclose = () => setTimeout(ecouterChat, 3000);
  }

  // ---------- StreamElements (via js/evenements.js) ----------
  // Le follow ne passe pas dans le chat : il vient de StreamElements, comme les alertes (jeton dans reglages.html ›
  // StreamElements). Sub et raid arrivent aussi par là (en plus des annonces du chat : une même valeur ne compte qu'une fois).
  function ecouterStreamElements() {
    if (typeof Evenements === 'undefined') return;
    Evenements.ecouter(e => {
      if (!e) return;
      if (e.type === 'follow') maj('follow', e.nom);
      if (e.type === 'sub' || e.type === 'resub') maj('sub', e.nom);
      if (e.type === 'giftsub') maj('sub', e.destinataire || e.nom);
      if (e.type === 'giftbomb') maj('sub', `${e.nom} ×${e.nombre || '?'}`);
      if (e.type === 'raid') maj('raid', `${e.nom} · ${e.montant || '?'}`);
    });
    Evenements.demarrer();
  }

  // ---------- Mode test ----------
  function simuler() {
    const noms = (C.test || {}).noms || ['Kaelis', 'Pey_J', 'Shauni', 'Double_H'];
    const hasard = () => noms[Math.floor(Math.random() * noms.length)];
    etat = { follow: hasard(), sub: hasard(), raid: `${hasard()} · 42`, serie: `${hasard()} · 12` };
    abonnes.forEach(fn => fn(etat, null));
    const types = ['follow', 'sub', 'raid', 'serie'];
    let i = 0;
    setInterval(() => {
      const type = types[i++ % types.length];
      maj(type, type === 'raid' ? `${hasard()} · ${10 + Math.floor(Math.random() * 90)}` : type === 'serie' ? `${hasard()} · ${2 + Math.floor(Math.random() * 30)}` : hasard());
    }, 6000);
  }

  let demarre = false;
  function demarrer() {
    if (demarre) return; demarre = true;
    if (test) return simuler();
    ecouterChat();
    ecouterStreamElements();
  }

  return {
    ecouter(fn) { abonnes.push(fn); fn(etat, null); },
    demarrer,
  };
})();
