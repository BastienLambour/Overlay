/* =====================================================================
   VOIX — qui parle sur Discord, d'après le bot « voix » du VPS (serveur/voix/voix.mjs).
   Réglages : config.js › jdr.discord { actif, adresse, cle } ; adresse vide = celle des mises à jour
   (config.js › miseAJour.adresse) en wss://…/voix. La CLÉ est un secret : seulement dans mes-reglages.js.
     Voix.brancher({ salon(etat), parle(id, oui) })
       salon : { salon: { id, nom } | null, membres: [{ id, nom, pseudo }], parlent: [id…] }
     Voix.trouver(membres, texte)   → le membre Discord dont l'identifiant, le pseudo ou le nom affiché est « texte »
     ?journal=1 : un petit cadre « 🎙 Discord » à l'écran (connexion + derniers événements) — OBS n'a pas de F12.
   L'overlay n'envoie que sa clé.
   ===================================================================== */
const Voix = (() => {
  const CONFIG_ = window.CONFIG || {};
  const C = (CONFIG_.jdr || {}).discord || {};
  const params = new URLSearchParams(location.search);
  const normal = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/^@/, '').trim();

  // l'adresse du bot : celle réglée, sinon celle du serveur des mises à jour (https://… → wss://…/voix)
  function adresse() {
    let a = String(C.adresse || '').trim();
    if (!a && CONFIG_.miseAJour && CONFIG_.miseAJour.adresse) a = String(CONFIG_.miseAJour.adresse).replace(/\/+$/, '') + '/voix';
    return a.replace(/^http/, 'ws');
  }

  let journal = null;
  function noter(texte) {
    console.log('[Discord]', texte);
    if (!journal) return;
    const ligne = document.createElement('div');
    ligne.textContent = `${new Date().toLocaleTimeString()} · ${texte}`;
    journal.firstChild.after(ligne);
    while (journal.children.length > 9) journal.lastChild.remove();
  }
  const bord = couleur => { if (journal) journal.style.borderColor = couleur; };

  function brancher(rappels = {}) {
    if (params.has('journal')) {
      journal = document.createElement('div');
      journal.style.cssText = 'position:fixed;right:16px;top:420px;z-index:99999;width:600px;max-height:300px;overflow:hidden;padding:10px 14px;'
        + 'font:13px/1.4 monospace;color:#E8F0FF;background:rgba(8,12,24,.88);border:3px solid #888;border-radius:10px;white-space:pre-wrap;overflow-wrap:anywhere';
      journal.innerHTML = '<div style="font-weight:700;font-size:16px;margin-bottom:4px">🎙 Discord</div>';
      document.body.appendChild(journal);
    }
    const ou = adresse(), cle = String(C.cle || '').trim();
    if (C.actif === false) return noter('désactivé (reglages.html › Scène JDR)');
    if (!ou || !cle) { bord('#C9302C'); return noter("pas d'adresse ou pas de clé : reglages.html › Scène JDR"); }
    let attente = 5000, refuse = false, membres = [];
    const ouvrir = () => {
      noter('connexion à ' + ou);
      let ws;
      try { ws = new WebSocket(ou); } catch (e) { bord('#C9302C'); return noter('adresse invalide : ' + ou); }
      ws.onopen = () => ws.send(JSON.stringify({ type: 'bonjour', cle }));
      ws.onmessage = ev => {
        let m; try { m = JSON.parse(ev.data); } catch { return; }
        attente = 5000;
        if (m.type === 'salon') {
          bord('#3FA34A');
          membres = m.membres || [];
          noter(m.salon ? `salon « ${m.salon.nom} » : ${m.membres.map(x => x.nom).join(', ') || 'personne'}` : 'le bot attend dans aucun salon (le MJ n’est pas en vocal)');
          if (rappels.salon) try { rappels.salon(m); } catch (e) { console.error(e); }
        } else if (m.type === 'parle') {
          if (journal && m.oui) noter('parle : ' + ((membres.find(x => x.id === m.id) || {}).nom || m.id));
          if (rappels.parle) try { rappels.parle(m.id, m.oui); } catch (e) { console.error(e); }
        }
      };
      ws.onclose = ev => {
        bord('#C9302C');
        if (ev.code === 4003) { refuse = true; return noter('clé refusée par le bot : recolle la clé dans reglages.html › Scène JDR'); }
        noter(`coupé (${ev.code}) : nouvel essai dans ${attente / 1000} s`);
        if (rappels.salon) rappels.salon({ salon: null, membres: [], parlent: [] });   // plus personne ne parle
        if (!refuse) setTimeout(ouvrir, attente);
        attente = Math.min(attente * 2, 60000);
      };
    };
    ouvrir();
  }

  function trouver(membres, texte) {
    const t = normal(texte);
    if (!t) return null;
    return (membres || []).find(m => m.id === t || normal(m.pseudo) === t || normal(m.nom) === t) || null;
  }

  return { brancher, trouver, adresse };
})();
