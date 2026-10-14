/* =====================================================================
   CODEX — la table CodexVTT, suivie en LECTURE SEULE (mode « spectateur »).
   Protocole : G:\Projets\Codex\codex-web\docs\SPECTATEUR.md (namespace /spectator, Socket.io).
   Réglages : config.js › jdr.codex { actif, adresse } ; la CLÉ est un secret : jamais dans config.js,
   seulement dans mes-reglages.js (reglages.html › Scène JDR). Le client Socket.io est copié dans
   js/socket.io.min.js (aucun téléchargement au chargement).
     Codex.brancher({ etat, perso, jet, pv, combat, revoque })   → les rappels reçoivent les données telles quelles
     Codex.url("/uploads/…")             → l'adresse complète d'une image de CodexVTT (portrait d'une fiche)
     ?journal=1 : un petit panneau à l'écran (connexion + derniers événements) — OBS n'a pas de F12.
   L'overlay n'envoie rien à la table.
   ===================================================================== */
const Codex = (() => {
  const C = ((window.CONFIG || {}).jdr || {}).codex || {};
  const params = new URLSearchParams(location.search);
  let journal = null;
  function noter(texte, detail) {
    console.log('[CodexVTT]', texte, detail ?? '');
    if (!journal) return;
    const ligne = document.createElement('div');
    ligne.textContent = `${new Date().toLocaleTimeString()} · ${texte}${detail ? ' · ' + JSON.stringify(detail).slice(0, 110) : ''}`;
    journal.firstChild.after(ligne);
    while (journal.children.length > 9) journal.lastChild.remove();
  }
  function etatJournal(texte, couleur) {
    if (!journal) return;
    journal.dataset.etat = texte;
    journal.style.borderColor = couleur;
  }

  function brancher(rappels = {}) {
    if (params.has('journal')) {
      journal = document.createElement('div');
      journal.style.cssText = 'position:fixed;right:16px;top:16px;z-index:99999;width:600px;max-height:380px;overflow:hidden;padding:10px 14px;'
        + 'font:13px/1.4 monospace;color:#E8F0FF;background:rgba(8,12,24,.88);border:3px solid #888;border-radius:10px;white-space:pre-wrap;overflow-wrap:anywhere';
      journal.innerHTML = '<div style="font-weight:700;font-size:16px;margin-bottom:4px">🎲 CodexVTT</div>';
      document.body.appendChild(journal);
    }
    const adresse = String(C.adresse || '').trim().replace(/\/+$/, ''), cle = String(C.cle || '').trim();
    if (C.actif === false) return noter('désactivé (reglages.html › Scène JDR)');
    if (!adresse || !cle) { etatJournal('non réglé', '#C9302C'); return noter("pas d'adresse ou pas de clé : reglages.html › Scène JDR"); }
    if (typeof io !== 'function') return noter('js/socket.io.min.js manquant');
    noter('connexion à', adresse);
    const socket = io(adresse + '/spectator', { path: '/socket.io', transports: ['websocket'], auth: { spectatorKey: cle },
      reconnectionDelay: 5000, reconnectionDelayMax: 60000 });
    socket.on('connect', () => { etatJournal('connecté', '#3FA34A'); noter('connecté'); });
    let revoque = false;
    socket.on('disconnect', raison => {
      etatJournal('déconnecté', '#C9302C');
      if (raison !== 'io server disconnect' || revoque) return noter('déconnecté', raison);
      // CodexVTT a fermé la porte (clé inconnue, table supprimée…) : on ne réessaie que de temps en temps
      noter('refusé par CodexVTT : la clé est-elle la bonne ? (nouvel essai dans 1 minute)');
      setTimeout(() => socket.connect(), 60000);
    });
    socket.on('connect_error', e => { etatJournal('erreur', '#C9302C'); noter('connexion impossible', e && e.message); });
    const relayer = (nom, rappel) => socket.on(nom, donnees => { noter(nom, donnees); if (rappel) try { rappel(donnees); } catch (e) { console.error(e); } });
    relayer('state', rappels.etat);
    relayer('character', rappels.perso);
    relayer('character:removed', rappels.retire);
    relayer('roll', rappels.jet);
    relayer('hp', rappels.pv);
    relayer('combat', rappels.combat);
    socket.on('revoked', () => {
      revoque = true;
      etatJournal('clé révoquée', '#C9302C');
      noter('clé révoquée ou remplacée : colle la nouvelle clé dans reglages.html › Scène JDR');
      socket.io.opts.reconnection = false;
      if (rappels.revoque) rappels.revoque();
    });
    return socket;
  }

  // une image de CodexVTT (« /uploads/… ») → son adresse complète
  const url = chemin => !chemin ? '' : /^(https?:|data:)/.test(chemin) ? chemin : String(C.adresse || '').trim().replace(/\/+$/, '') + '/' + String(chemin).replace(/^\/+/, '');

  return { brancher, url };
})();
