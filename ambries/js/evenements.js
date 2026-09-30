/* =====================================================================
   ÉVÉNEMENTS — follows, abonnements, bits, raids, dons.
   Reçus depuis Streamer.bot (WebSocket local), ou simulés avec ?test=1.

   Chaque événement est normalisé en :
   { type, nom, montant, mois, nombre, destinataire }
   type ∈ follow | sub | resub | giftsub | giftbomb | bits | raid | don | objectif

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   Ne pas le personnaliser ici : ce qui change d'un overlay à l'autre se règle
   dans config.js (id, alertes.anonyme, test.noms).
   ===================================================================== */
const Evenements = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);
  const abonnes = [];
  const CLE = `overlay-${C.id || 'defaut'}-etat`;   // un compteur séparé par overlay

  // ---------- État persistant (derniers événements + objectif) ----------
  const obj = C.objectif || { type: 'follow', cible: 50, depart: 0 };
  // En mode test, rien n'est enregistré : les faux événements ne touchent pas au vrai compteur.
  const test = params.has('test');
  let etat = {};
  try { if (!test) etat = JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { etat = {}; }
  // Si la valeur de départ a été changée dans config.js, on repart d'elle.
  if (etat.depart !== obj.depart || params.has('reinitialiser')) {
    etat = { depart: obj.depart, compte: obj.depart };
  }
  function sauver() { if (test) return; try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {} }
  sauver();

  function majEtat(e) {
    if (e.type === 'follow') etat.follow = e.nom;
    if (['sub', 'resub', 'giftsub', 'giftbomb'].includes(e.type)) etat.abonne = e.type === 'giftsub' ? e.destinataire || e.nom : e.nom;
    if (e.type === 'don') etat.soutien = `${e.nom} · ${e.montant}`;
    if (e.type === 'bits') etat.soutien = `${e.nom} · ${e.montant} bits`;

    // Combien ça ajoute à l'objectif : 1 par follow (ou par abonnement) ; une pluie d'abonnements offerts
    // compte pour tous ses cadeaux (les cadeaux de la pluie, eux, ne sont pas émis un par un : voir GiftSub)
    const ajout = obj.type === 'follow' ? (e.type === 'follow' ? 1 : 0)
      : obj.type === 'sub' ? (['sub', 'resub', 'giftsub'].includes(e.type) ? 1 : e.type === 'giftbomb' ? (parseInt(e.nombre, 10) || 1) : 0) : 0;
    let atteint = false;
    if (ajout) {
      const avant = etat.compte;
      etat.compte = (etat.compte || 0) + ajout;
      atteint = avant < obj.cible && etat.compte >= obj.cible;
    }
    sauver();
    return atteint;
  }

  // ---------- Diffusion ----------
  function emettre(e) {
    const atteint = e.type === 'objectif' ? false : majEtat(e);
    abonnes.forEach(fn => { try { fn(e, etat); } catch (err) { console.error(err); } });
    if (atteint) emettre({ type: 'objectif', nom: `${etat.compte} / ${obj.cible}` });
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

  // ---------- Connexion ----------
  let connecte = false;
  function connecter() {
    const sb = C.streamerbot || {};
    if (sb.actif === false) return;
    if (!window.StreamerbotClient) {
      console.warn('[Overlay] Client Streamer.bot non chargé (connexion internet ?)');
      return;
    }
    const client = new window.StreamerbotClient({
      host: sb.hote || '127.0.0.1', port: sb.port || 8080, endpoint: '/',
      password: sb.motDePasse || undefined,
      onConnect: () => { connecte = true; console.info('[Overlay] Connecté à Streamer.bot'); },
      onDisconnect: () => { connecte = false; console.info('[Overlay] Déconnecté de Streamer.bot'); },
    });
    ECOUTES.forEach(cle => {
      try {
        client.on(cle, msg => {
          console.debug('[Overlay] ' + cle, msg);   // utile pour vérifier le format reçu
          const e = depuisStreamerbot(cle, msg);
          if (e) emettre(e);
        });
      } catch (err) { console.warn('[Overlay] Événement non géré par Streamer.bot : ' + cle); }
    });
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
      objectif: { type, nom: `${obj.cible} / ${obj.cible}` },
    }[type];
  }
  function simuler() {
    const types = ['follow', 'follow', 'sub', 'resub', 'giftsub', 'giftbomb', 'bits', 'raid', 'don'];
    let i = 0;
    setTimeout(function suivant() {
      emettre(exemple(types[i++ % types.length]));
      setTimeout(suivant, 9000);
    }, 1500);
  }

  function demarrer() {
    if (test) simuler(); else connecter();
  }

  return {
    ecouter(fn) { abonnes.push(fn); fn(null, etat); },   // appel immédiat avec l'état actuel
    etat: () => etat,
    objectif: obj,
    exemple, emettre,
    demarrer,
    estConnecte: () => connecte,
  };
})();
