/* =====================================================================
   ÉVÉNEMENTS — follows, abonnements, bits, raids, dons.
   Reçus depuis Streamer.bot (WebSocket local), ou simulés avec ?test=1.

   Chaque événement est normalisé en :
   { type, nom, montant, mois, nombre, destinataire }
   type ∈ follow | sub | resub | giftsub | giftbomb | bits | raid | don | objectif

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   Ne pas le personnaliser ici : ce qui change d'un overlay à l'autre se règle
   dans config.js (id, alertes.anonyme, test.noms, objectif).

   L'OBJECTIF : une barre, qui affiche au choix les followers ou les abonnés :
       objectif: { affiche: "follow",                         // ou "sub"
                   follow: { titre, cible, depart },          // chacun son titre, sa cible, son compteur
                   sub:    { titre, cible, depart },
                   automatique: true }                        // false = compté à la main seulement
   Les DEUX compteurs (etat.compteFollow, etat.compteSub) tournent toujours : ils avancent à chaque follow /
   abonnement reçu, et prennent les VRAIS nombres de la chaîne quand Streamer.bot les envoie (action
   « Overlay – Compteurs », outils/streamerbot-compteurs.cs : { overlay: "compteurs", followers, abonnes }).
   Evenements.objectif = celui affiché (une source peut forcer l'autre : ?objectif=sub ou ?objectif=follow) ;
   son compteur : etat[Evenements.objectif.cle]. Ancien format (objectif: { type, titre, cible, depart }) accepté.
   ===================================================================== */
const Evenements = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);
  const abonnes = [];
  const CLE = `overlay-${C.id || 'defaut'}-etat`;   // un compteur séparé par overlay

  // ---------- État persistant (derniers événements + objectifs) ----------
  const CO = C.objectif || {};
  const DEFAUTS = { follow: { titre: 'Objectif followers', cible: 50, depart: 0 }, sub: { titre: 'Objectif abonnés', cible: 10, depart: 0 } };
  const objectifs = Object.fromEntries(['follow', 'sub'].map(type => {
    const o = { ...DEFAUTS[type], ...(CO[type] && typeof CO[type] === 'object' ? CO[type] : {}) };
    // ancien format : objectif: { type: "follow", titre, cible, depart } → réglages de ce type-là
    if ((CO.type || 'follow') === type) ['titre', 'cible', 'depart'].forEach(k => { if (CO[k] !== undefined) o[k] = CO[k]; });
    const Nom = type === 'follow' ? 'Follow' : 'Sub';
    return [type, { ...o, type, cle: 'compte' + Nom, cleDepart: 'depart' + Nom, automatique: CO.automatique !== false }];
  }));
  const affiche = ['follow', 'sub'].includes(params.get('objectif')) ? params.get('objectif') : (CO.affiche || CO.type || 'follow');
  const obj = objectifs[affiche] || objectifs.follow;          // celui que la barre affiche
  const liste = Object.values(objectifs);
  // En mode test, rien n'est enregistré : les faux événements ne touchent pas au vrai compteur.
  const test = params.has('test');
  let etat = {};
  try { if (!test) etat = JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { etat = {}; }
  // Si la valeur de départ d'un objectif a été changée dans les réglages, son compteur repart d'elle.
  liste.forEach(o => {
    if (etat[o.cleDepart] !== o.depart || params.has('reinitialiser')) { etat[o.cleDepart] = o.depart; etat[o.cle] = o.depart; }
  });
  function sauver() { if (test) return; try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {} }
  sauver();

  function majEtat(e) {
    if (e.type === 'follow') etat.follow = e.nom;
    if (['sub', 'resub', 'giftsub', 'giftbomb'].includes(e.type)) etat.abonne = e.type === 'giftsub' ? e.destinataire || e.nom : e.nom;
    if (e.type === 'don') etat.soutien = `${e.nom} · ${e.montant}`;
    if (e.type === 'bits') etat.soutien = `${e.nom} · ${e.montant} bits`;

    // Combien ça ajoute à chaque objectif : 1 par follow (ou par abonnement) ; une pluie d'abonnements offerts
    // compte pour tous ses cadeaux (les cadeaux de la pluie, eux, ne sont pas émis un par un : voir GiftSub)
    const atteints = [];
    liste.forEach(o => {
      const ajout = o.type === 'follow' ? (e.type === 'follow' ? 1 : 0)
        : o.type === 'sub' ? (['sub', 'resub', 'giftsub'].includes(e.type) ? 1 : e.type === 'giftbomb' ? (parseInt(e.nombre, 10) || 1) : 0) : 0;
      if (!ajout) return;
      const avant = etat[o.cle] || 0;
      etat[o.cle] = avant + ajout;
      if (o === obj && avant < o.cible && etat[o.cle] >= o.cible) atteints.push(o);   // l'alerte : pour la barre affichée
    });
    sauver();
    return atteints;
  }

  // ---------- Les vrais nombres de la chaîne, envoyés par Streamer.bot ----------
  // { overlay: "compteurs", followers: 1234, abonnes: 12 } → le compteur de chaque objectif prend le vrai nombre.
  // La toute première fois, pas d'alerte « objectif atteint » (le nombre était peut-être déjà au-delà).
  function compteurs(d) {
    const nombres = { follow: Number(d.followers), sub: Number(d.abonnes) };
    const atteints = [], premiere = !etat.synchro;
    liste.forEach(o => {
      if (o.automatique === false) return;
      const n = nombres[o.type];
      if (d[o.type === 'follow' ? 'followers' : 'abonnes'] == null || !Number.isFinite(n) || n < 0) return;
      const avant = etat[o.cle] || 0;
      etat[o.cle] = n;
      if (!premiere && o === obj && avant < o.cible && n >= o.cible) atteints.push(o);
    });
    etat.synchro = Date.now();
    sauver();
    abonnes.forEach(fn => { try { fn(null, etat); } catch (err) { console.error(err); } });   // null : pas un événement, juste l'état
    atteints.forEach(alerteObjectif);
  }
  const alerteObjectif = o => emettre({ type: 'objectif', nom: `${etat[o.cle]} / ${o.cible}`, objectif: o.type, titre: o.titre });

  // ---------- Diffusion ----------
  function emettre(e) {
    const atteints = e.type === 'objectif' ? [] : majEtat(e);
    abonnes.forEach(fn => { try { fn(e, etat); } catch (err) { console.error(err); } });
    atteints.forEach(alerteObjectif);
  }

  // ---------- Lecture tolérante des données Streamer.bot ----------
  // Cherche la première clé présente, jusqu'à 3 niveaux de profondeur.
  function cherche(o, cles, prof = 0) {
    if (!o || typeof o !== 'object' || prof > 3) return undefined;
    for (const k of cles) if (o[k] !== undefined && o[k] !== null && o[k] !== '' && typeof o[k] !== 'object') return o[k];
    for (const v of Object.values(o)) {
      if (v && typeof v === 'object') { const r = cherche(v, cles, prof + 1); if (r !== undefined) return r; }
    }
    return undefined;
  }
  const NOMS = ['displayName', 'display_name', 'user_name', 'userName', 'from_broadcaster_user_name', 'fromBroadcasterUserName', 'username', 'name', 'login', 'user_login'];
  const nomDe = d => cherche(d, NOMS) || 'Quelqu’un';
  const ANONYME = (C.alertes && C.alertes.anonyme) || 'quelqu’un';

  let dernierGiftBomb = { nom: '', t: 0 };

  function depuisStreamerbot(cle, msg) {
    const d = (msg && msg.data) || msg || {};
    const nom = nomDe(d);
    switch (cle) {
      case 'Twitch.Follow': return { type: 'follow', nom };
      case 'Twitch.Sub': return { type: 'sub', nom };
      case 'Twitch.ReSub': return { type: 'resub', nom, mois: cherche(d, ['cumulativeMonths', 'cumulative_months', 'cumulative', 'months', 'monthsSubscribed', 'duration_months']) || '?' };
      case 'Twitch.GiftSub': {
        // Pendant une « pluie » de cadeaux, Twitch envoie aussi chaque cadeau : on les ignore.
        if (dernierGiftBomb.nom === nom && Date.now() - dernierGiftBomb.t < 10000) return null;
        const r = d.recipient || d.recipientUser || {};
        return { type: 'giftsub', nom, destinataire: cherche(r, NOMS) || cherche(d, ['recipientDisplayName', 'recipientUserName', 'recipient_user_name', 'recipientName']) || ANONYME };
      }
      case 'Twitch.GiftBomb':
        dernierGiftBomb = { nom, t: Date.now() };
        return { type: 'giftbomb', nom, nombre: cherche(d, ['gifts', 'total', 'count', 'amount']) || '?' };
      case 'Twitch.Cheer': return { type: 'bits', nom, montant: cherche(d, ['bits', 'amount']) || '?' };
      case 'Twitch.Raid': return { type: 'raid', nom, montant: cherche(d, ['viewers', 'viewerCount', 'viewer_count']) || '?' };
      default: { // dons (StreamElements, Streamlabs, Ko-fi, Tipeee…)
        const montant = cherche(d, ['formattedAmount', 'formatted_amount', 'amount']);
        const devise = { EUR: '€', USD: '$', GBP: '£', CAD: '$ CA', CHF: 'CHF' }[cherche(d, ['currency'])] || cherche(d, ['currency']) || '€';
        const valeur = Number(montant);
        const texte = typeof montant === 'string' && isNaN(valeur) ? montant   // déjà formaté, ex. « 5,00 € »
          : valeur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + devise;
        return { type: 'don', nom, montant: texte };
      }
    }
  }

  const ECOUTES = ['Twitch.Follow', 'Twitch.Sub', 'Twitch.ReSub', 'Twitch.GiftSub', 'Twitch.GiftBomb', 'Twitch.Cheer', 'Twitch.Raid',
    'StreamElements.Tip', 'Streamlabs.Donation', 'Kofi.Donation', 'TipeeeStream.Donation'];

  // ---------- Journal à l'écran : ?journal=1 ----------
  // Un panneau, visible dans OBS, qui montre l'état de la connexion à Streamer.bot et les derniers
  // événements reçus avec leurs données brutes (pour vérifier ou faire corriger une alerte).
  const JOURNAL = params.has('journal');
  let panneau;
  function journal(titre, detail = '', couleur = '#8FD0F5') {
    if (!JOURNAL || !document.body) return;
    if (!panneau) {
      panneau = document.createElement('div');
      panneau.setAttribute('style', 'position:fixed;left:16px;top:16px;z-index:99999;width:900px;max-height:calc(100vh - 32px);overflow:hidden;' +
        'background:rgba(10,14,22,.92);color:#e8ecf2;font:14px/1.45 Consolas,monospace;border:3px solid #8FD0F5;border-radius:12px;padding:12px 16px');
      panneau.innerHTML = '<div style="font-weight:700;font-size:18px;margin-bottom:6px">📋 Journal de l\'overlay (?journal=1)</div><div class="etat"></div><div class="liste"></div>';
      document.body.appendChild(panneau);
    }
    const heure = new Date().toLocaleTimeString('fr-FR');
    const ligne = document.createElement('div');
    ligne.style.cssText = 'border-top:1px solid #2a3344;padding:5px 0;white-space:pre-wrap;overflow-wrap:anywhere';
    const echap = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    ligne.innerHTML = `<b style="color:${couleur}">${heure} · ${echap(titre)}</b>${detail ? '\n' + echap(detail).slice(0, 700) : ''}`;
    panneau.querySelector('.liste').prepend(ligne);
    while (panneau.querySelector('.liste').children.length > 12) panneau.querySelector('.liste').lastElementChild.remove();
  }
  const etatJournal = t => { journal(t, '', t.startsWith('✅') ? '#8BD17C' : '#F5B82E'); };

  // ---------- Connexion ----------
  let connecte = false;
  function connecter() {
    const sb = C.streamerbot || {};
    if (sb.actif === false) return etatJournal('⚠️ Streamer.bot désactivé dans les réglages (streamerbot.actif)');
    if (!window.StreamerbotClient) {
      console.warn('[Overlay] Client Streamer.bot non chargé (connexion internet ?)');
      return etatJournal('⚠️ Client Streamer.bot non chargé : pas de connexion internet au démarrage de la page ?');
    }
    etatJournal(`… connexion à Streamer.bot sur ${sb.hote || '127.0.0.1'}:${sb.port || 8080}`);
    const client = new window.StreamerbotClient({
      host: sb.hote || '127.0.0.1', port: sb.port || 8080, endpoint: '/',
      password: sb.motDePasse || undefined,
      onConnect: () => { connecte = true; console.info('[Overlay] Connecté à Streamer.bot'); etatJournal('✅ Connecté à Streamer.bot'); demanderCompteurs(client); },
      onDisconnect: () => { connecte = false; console.info('[Overlay] Déconnecté de Streamer.bot'); etatJournal('⚠️ Déconnecté de Streamer.bot (lancé ? serveur WebSocket démarré ?)'); },
    });
    try {
      client.on('General.Custom', msg => {
        let d = (msg && msg.data !== undefined) ? msg.data : msg;
        if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { return; } }
        if (d && d.data && d.data.overlay) d = d.data;
        if (!d || d.overlay !== 'compteurs') return;
        journal(`📊 Compteurs de la chaîne : ${d.followers ?? '?'} followers · ${d.abonnes ?? '?'} abonnés`, 'données reçues : ' + JSON.stringify(d), '#8BD17C');
        compteurs(d);
      });
    } catch (err) { console.warn('[Overlay] General.Custom non géré'); }
    ECOUTES.forEach(cle => {
      try {
        client.on(cle, msg => {
          console.debug('[Overlay] ' + cle, msg);   // utile pour vérifier le format reçu
          const e = depuisStreamerbot(cle, msg);
          journal(`${cle} → ${e ? `${e.type} · ${e.nom}${e.montant ? ' · ' + e.montant : ''}${e.mois ? ' · ' + e.mois + ' mois' : ''}${e.nombre ? ' · ' + e.nombre : ''}${e.destinataire ? ' → ' + e.destinataire : ''}` : 'ignoré'}`,
            'données reçues : ' + JSON.stringify((msg && msg.data) || msg));
          if (e) emettre(e);
        });
      } catch (err) { console.warn('[Overlay] Événement non géré par Streamer.bot : ' + cle); }
    });
  }

  // Au branchement : on demande à Streamer.bot les vrais nombres (son action « Overlay – Compteurs »)
  const ACTION_COMPTEURS = (C.streamerbot || {}).actionCompteurs || 'Overlay – Compteurs';
  function demanderCompteurs(client) {
    if (CO.automatique === false) return;
    Promise.resolve().then(() => client.doAction({ name: ACTION_COMPTEURS })).then(r => {
      if (r && r.status && r.status !== 'ok') journal(`ℹ️ Action « ${ACTION_COMPTEURS} » introuvable dans Streamer.bot : les objectifs comptent à la main (voir le tuto)`, JSON.stringify(r), '#F5B82E');
    }).catch(err => journal(`ℹ️ Action « ${ACTION_COMPTEURS} » : pas de réponse`, String(err && err.message || err), '#F5B82E'));
  }

  // ---------- Mode test : ?test=1 ----------
  const NOMS_TEST = (C.test && C.test.noms) || ['Pseudo_1', 'Pseudo_2', 'Pseudo_3', 'Pseudo_4', 'Pseudo_5', 'Pseudo_6'];
  const hasard = t => t[Math.floor(Math.random() * t.length)];
  function exemple(type) {
    const nom = hasard(NOMS_TEST);
    return {
      follow: { type, nom }, sub: { type, nom }, resub: { type, nom, mois: 3 + Math.floor(Math.random() * 20) },
      giftsub: { type, nom, destinataire: hasard(NOMS_TEST) }, giftbomb: { type, nom, nombre: 5 },
      bits: { type, nom, montant: 500 }, raid: { type, nom, montant: 42 }, don: { type, nom, montant: '5,00 €' },
      objectif: { type, nom: `${obj.cible} / ${obj.cible}`, objectif: obj.type, titre: obj.titre },
    }[type];
  }
  function simuler() {
    const types = ['follow', 'follow', 'sub', 'resub', 'giftsub', 'giftbomb', 'bits', 'raid', 'don'];
    setTimeout(() => { etat.synchro = 1; compteurs({ overlay: 'compteurs', followers: Math.max(0, objectifs.follow.cible - 2), abonnes: Math.max(0, objectifs.sub.cible - 3) }); }, 800);
    let i = 0;
    setTimeout(function suivant() {
      emettre(exemple(types[i++ % types.length]));
      setTimeout(suivant, 9000);
    }, 1500);
  }

  function demarrer() {
    if (JOURNAL) addEventListener('DOMContentLoaded', () => journal(test ? 'Mode test : fausses alertes' : 'Page chargée'));
    if (JOURNAL && test) abonnes.push(e => e && journal(`test → ${e.type} · ${e.nom}`));
    if (test) simuler(); else connecter();
  }

  return {
    ecouter(fn) { abonnes.push(fn); fn(null, etat); },   // appel immédiat avec l'état actuel
    etat: () => etat,
    objectif: obj,                       // celui que la barre affiche : { type, titre, cible, depart, cle } → etat[obj.cle]
    objectifs,                           // les deux : { follow: {…}, sub: {…} }
    exemple, emettre, compteurs,
    demarrer,
    estConnecte: () => connecte,
  };
})();
