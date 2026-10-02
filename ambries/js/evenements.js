/* =====================================================================
   ÉVÉNEMENTS — follows, abonnements, bits, raids, dons.
   Reçus depuis StreamElements (par internet, avec le jeton du compte), ou simulés avec ?test=1.

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
   abonnement reçu, et prennent les VRAIS nombres de la chaîne donnés par StreamElements (au branchement, puis à
   chaque changement : follower-total, subscriber-total).
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

  // ---------- Les vrais nombres de la chaîne, donnés par StreamElements ----------
  // { followers: 1234, abonnes: 12 } (l'un ou l'autre peut manquer) → le compteur de chaque objectif prend le vrai nombre.
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

  // ---------- Lecture tolérante des données reçues ----------
  // Cherche la première clé présente, jusqu'à 3 niveaux de profondeur.
  function cherche(o, cles, prof = 0) {
    if (!o || typeof o !== 'object' || prof > 3) return undefined;
    for (const k of cles) if (o[k] !== undefined && o[k] !== null && o[k] !== '' && typeof o[k] !== 'object') return o[k];
    for (const v of Object.values(o)) {
      if (v && typeof v === 'object') { const r = cherche(v, cles, prof + 1); if (r !== undefined) return r; }
    }
    return undefined;
  }

  // ---------- Lecture des activités StreamElements ----------
  // Une activité : { type: "follow" | "subscriber" | "communityGiftPurchase" | "cheer" | "raid" | "tip" …,
  //                  data: { username, displayName, amount, tier, gifted, sender, bulkGifted, isCommunityGift, currency, message } }
  // amount = mois d'abonnement, bits, spectateurs du raid, montant du don, ou nombre de cadeaux selon le type.
  const NOMS = ['displayName', 'display_name', 'username', 'name', 'login'];
  const nomDe = d => cherche(d, NOMS) || 'Quelqu’un';
  const ANONYME = (C.alertes && C.alertes.anonyme) || 'quelqu’un';

  // Une « pluie » d'abonnements offerts arrive en deux temps : l'achat (communityGiftPurchase, ou subscriber
  // bulkGifted), puis chacun des cadeaux (isCommunityGift) : on n'affiche que la pluie, une seule fois.
  let dernierGiftBomb = { nom: '', t: 0 };
  const pluieRecente = nom => dernierGiftBomb.nom === nom && Date.now() - dernierGiftBomb.t < 15000;

  function depuisStreamElements(a) {
    const d = (a && a.data) || {};
    const nom = nomDe(d);
    const montant = d.amount;
    switch (a && a.type) {
      case 'follow': case 'follower': return { type: 'follow', nom };
      case 'communityGiftPurchase': {
        if (pluieRecente(nom)) return null;
        dernierGiftBomb = { nom, t: Date.now() };
        return { type: 'giftbomb', nom, nombre: montant || '?' };
      }
      case 'subscriber': {
        const offreur = d.sender ? String(d.sender) : '';
        if (d.isCommunityGift) return null;                       // un des cadeaux d'une pluie, déjà annoncée
        if (d.bulkGifted) {
          const de = offreur || nom;
          if (pluieRecente(de)) return null;
          dernierGiftBomb = { nom: de, t: Date.now() };
          return { type: 'giftbomb', nom: de, nombre: montant || '?' };
        }
        if (d.gifted || offreur) return { type: 'giftsub', nom: offreur || ANONYME, destinataire: nom };
        const mois = parseInt(montant, 10);
        return mois > 1 ? { type: 'resub', nom, mois } : { type: 'sub', nom };
      }
      case 'cheer': return { type: 'bits', nom, montant: montant || '?' };
      case 'raid': return { type: 'raid', nom, montant: montant || '?' };
      case 'tip': {
        const devise = { EUR: '€', USD: '$', GBP: '£', CAD: '$ CA', CHF: 'CHF' }[d.currency] || d.currency || '€';
        const valeur = Number(montant);
        const texte = Number.isFinite(valeur)
          ? valeur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + devise : String(montant || '?');
        return { type: 'don', nom, montant: texte };
      }
      default: return null;   // hôte, points de chaîne, autres plateformes… : pas d'alerte
    }
  }

  // ---------- Journal à l'écran : ?journal=1 ----------
  // Un panneau, visible dans OBS, qui montre l'état de la connexion à StreamElements et les derniers
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

  // ---------- Connexion à StreamElements ----------
  // Par internet, avec le « JWT Token » du compte StreamElements (réglages › StreamElements, gardé dans mes-reglages.js).
  //   wss://astro.streamelements.com : on s'abonne à channel.activities (follows, abonnements, bits, raids, dons)
  //   et à channel.session.update (follower-total, subscriber-total : les vrais nombres, pour l'objectif) ;
  //   au branchement, les nombres actuels : https://api.streamelements.com/kappa/v2/sessions/<chaîne>.
  // Reconnexion toute seule (5 s, puis de plus en plus espacé jusqu'à 1 minute) si internet coupe.
  const SE = C.streamelements || {};
  const JETON = String(SE.jeton || '').trim();
  let connecte = false, attente = 5000, ws = null;

  // Le jeton contient l'identifiant de la chaîne StreamElements (champ « channel »)
  function chaineDuJeton() {
    try {
      const b = JETON.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(b + '==='.slice((b.length + 3) % 4))).channel || '';
    } catch (e) { return ''; }
  }

  function nombresDeSession(s) {
    const n = cle => { const v = s && s[cle]; return v && typeof v === 'object' ? v.count : v; };
    return { followers: n('follower-total'), abonnes: n('subscriber-total') };
  }

  function lireCompteurs() {
    if (CO.automatique === false) return;
    const appel = chemin => fetch('https://api.streamelements.com/kappa/v2/' + chemin, { headers: { Authorization: 'Bearer ' + JETON, Accept: 'application/json' } })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    const chaine = chaineDuJeton();
    (chaine ? Promise.resolve(chaine) : appel('channels/me').then(c => c._id))
      .then(id => appel('sessions/' + id))
      .then(r => {
        const d = nombresDeSession((r && r.data) || r);
        journal(`📊 Compteurs de la chaîne : ${d.followers ?? '?'} followers · ${d.abonnes ?? '?'} abonnés`, '', '#8BD17C');
        compteurs(d);
      })
      .catch(err => journal('ℹ️ Nombres de la chaîne non lus (' + (err && err.message || err) + ') : l\'objectif avancera à chaque follow / abonnement', '', '#F5B82E'));
  }

  function connecter() {
    if (SE.actif === false) return etatJournal('⚠️ StreamElements désactivé dans les réglages (streamelements.actif)');
    if (!JETON) return etatJournal('⚠️ Pas de jeton StreamElements : reglages.html › StreamElements (voir le tuto, section 6)');
    etatJournal('… connexion à StreamElements');
    try { ws = new WebSocket('wss://astro.streamelements.com'); } catch (e) { return plusTard(); }
    ws.onopen = () => {
      ['channel.activities', 'channel.session.update'].forEach((topic, i) => ws.send(JSON.stringify({
        type: 'subscribe', nonce: `${topic}-${Date.now()}-${i}`, data: { topic, token: JETON, token_type: 'jwt' } })));
    };
    ws.onmessage = ev => {
      let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
      if (m.type === 'response') {
        if (m.error) {
          etatJournal(`❌ StreamElements refuse le jeton (${m.error}${m.data && m.data.message ? ' : ' + m.data.message : ''}) : recopie-le dans reglages.html`);
          return;
        }
        {
          attente = 5000;
          if (!connecte) { connecte = true; console.info('[Overlay] Connecté à StreamElements'); etatJournal('✅ Connecté à StreamElements'); lireCompteurs(); }
        }
        return;
      }
      if (m.type !== 'message') return;
      if (m.topic === 'channel.activities') {
        const a = m.data || {};
        console.debug('[Overlay] activité', a);   // utile pour vérifier le format reçu
        const e = depuisStreamElements(a);
        journal(`${a.type || '?'} → ${e ? `${e.type} · ${e.nom}${e.montant ? ' · ' + e.montant : ''}${e.mois ? ' · ' + e.mois + ' mois' : ''}${e.nombre ? ' · ' + e.nombre : ''}${e.destinataire ? ' → ' + e.destinataire : ''}` : 'ignoré'}`,
          'données reçues : ' + JSON.stringify(a.data || a));
        if (e) emettre(e);
      } else if (m.topic === 'channel.session.update') {
        const d = m.data || {}, cle = d.key || d.name;
        if (cle !== 'follower-total' && cle !== 'subscriber-total') return;
        const n = d.data && typeof d.data === 'object' ? d.data.count : d.data;
        journal(`📊 ${cle === 'follower-total' ? 'Followers' : 'Abonnés'} de la chaîne : ${n}`, '', '#8BD17C');
        compteurs(cle === 'follower-total' ? { followers: n } : { abonnes: n });
      }
    };
    ws.onclose = () => {
      if (connecte) etatJournal('⚠️ Déconnecté de StreamElements (internet ?) : nouvelle tentative…');
      connecte = false; plusTard();
    };
    ws.onerror = () => {};   // suivi de onclose
  }
  function plusTard() { setTimeout(connecter, attente); attente = Math.min(60000, attente * 2); }

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
    setTimeout(() => { etat.synchro = 1; compteurs({ followers: Math.max(0, objectifs.follow.cible - 2), abonnes: Math.max(0, objectifs.sub.cible - 3) }); }, 800);
    let i = 0;
    setTimeout(function suivant() {
      emettre(exemple(types[i++ % types.length]));
      setTimeout(suivant, 9000);
    }, 1500);
  }

  let lance = false;
  function demarrer() {
    if (lance) return; lance = true;   // une seule fois par page (plusieurs éléments peuvent le demander)
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
