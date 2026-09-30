/* =====================================================================
   RÉGLAGES — le moteur de la page reglages.html (formulaire qui réécrit config.js).

   Le formulaire vient de js/reglages-champs.js (propre à chaque overlay :
   libellés, aides, rangement par écran). Tout réglage de config.js qui n'y
   figure pas apparaît quand même, dans « Autres réglages ».

   À l'enregistrement, config.js n'est PAS réécrit en entier : seules les
   valeurs modifiées sont remplacées dans le texte du fichier. Les
   commentaires, l'ordre et la mise en forme restent tels quels, et un
   réglage que la page ne connaît pas n'est jamais effacé.
     Reglages.analyser(texte)            positions de chaque valeur dans config.js
     Reglages.appliquer(texte, changements)   texte avec les nouvelles valeurs
     Reglages.demarrer()                 construit la page

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
const Reglages = (() => {
  // =====================================================================
  // 1. Lire config.js : où se trouve chaque valeur dans le texte
  // =====================================================================
  function analyser(texte) {
    let i = 0;
    const erreur = m => { throw new Error(`config.js, caractère ${i} : ${m}`); };
    // Saute les espaces et commentaires ; « notes » (facultatif) reçoit les commentaires rencontrés
    function blancs(notes) {
      let ligne = true;                                // encore sur la même ligne qu'au départ ?
      for (;;) {
        if (/\s/.test(texte[i] || '')) { if (texte[i] === '\n') ligne = false; i++; }
        else if (texte.startsWith('//', i)) { const n = texte.indexOf('\n', i); const f = n < 0 ? texte.length : n;
          if (notes) notes.push({ texte: texte.slice(i, f), memeLigne: ligne }); i = f; }
        else if (texte.startsWith('/*', i)) { const n = texte.indexOf('*/', i + 2); if (n < 0) erreur('commentaire non fermé'); i = n + 2; }
        else return;
      }
    }
    function chaine() {
      const q = texte[i++];
      while (i < texte.length && texte[i] !== q) i += texte[i] === '\\' ? 2 : 1;
      if (texte[i] !== q) erreur('texte non fermé');
      i++;
    }
    function cle() {
      if (texte[i] === '"' || texte[i] === "'") { const d = i; chaine(); return Function(`return ${texte.slice(d, i)}`)(); }
      const m = /^[A-Za-z_$][\w$]*/.exec(texte.slice(i));
      if (!m) erreur('nom de réglage attendu');
      i += m[0].length;
      return m[0];
    }
    function valeur() {
      blancs();
      const debut = i, c = texte[i];
      if (c === '{') {
        i++;
        const cles = {}, ordre = [];
        let finDerniere = null, virgule = true;
        for (;;) {
          blancs();
          if (texte[i] === '}') { i++; break; }
          const k = cle(); blancs();
          if (texte[i++] !== ':') erreur('« : » attendu');
          cles[k] = valeur(); ordre.push(k);
          finDerniere = cles[k].fin; blancs();
          virgule = texte[i] === ',';
          if (virgule) i++;
          else if (texte[i] !== '}') erreur('« , » ou « } » attendu');
        }
        return { type: 'objet', debut, fin: i, cles, ordre, finDerniere, virgule };
      }
      if (c === '[') {
        i++;
        const elements = [], notes = [];
        for (;;) {
          blancs(notes);
          if (texte[i] === ']') { i++; break; }
          elements.push(valeur()); blancs(notes);
          if (texte[i] === ',') i++;
          else if (texte[i] !== ']') erreur('« , » ou « ] » attendu');
        }
        return { type: 'liste', debut, fin: i, elements, notes };
      }
      if (c === '"' || c === "'" || c === '`') { chaine(); return { type: 'simple', debut, fin: i }; }
      const m = /^(-?\d+(\.\d+)?([eE][+-]?\d+)?|true|false|null)/.exec(texte.slice(i));
      if (!m) erreur('valeur attendue');
      i += m[0].length;
      return { type: 'simple', debut, fin: i };
    }
    const d = texte.indexOf('window.CONFIG');
    if (d < 0) throw new Error('config.js : « window.CONFIG = { … } » introuvable');
    i = texte.indexOf('=', d) + 1;
    return valeur();
  }

  // Le nœud d'un chemin « a.b.c » (ou null s'il n'existe pas dans le fichier)
  function trouver(racine, chemin) {
    let n = racine;
    for (const k of chemin.split('.')) { if (!n || n.type !== 'objet' || !(k in n.cles)) return null; n = n.cles[k]; }
    return n;
  }

  // =====================================================================
  // 2. Écrire une valeur, à la façon de config.js
  // =====================================================================
  const nomCle = k => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k));
  // notes : commentaires qui étaient dans la liste d'origine (gardés en tête de la nouvelle liste)
  function formater(v, ind = '', multiligne = null, notes = []) {
    if (Array.isArray(v) && notes.length) {
      const [premiere, ...autres] = notes[0].memeLigne ? notes : [null, ...notes];
      const lignes = [...autres.map(n => `${ind}  ${n.texte}`), ...v.map(x => `${ind}  ${formater(x, ind + '  ')},`)];
      return `[${premiere ? '   ' + premiere.texte : ''}\n${lignes.join('\n')}${lignes.length ? '\n' : ''}${ind}]`;
    }
    if (Array.isArray(v)) {
      if (!v.length) return '[]';
      const court = `[${v.map(x => formater(x, ind)).join(', ')}]`;
      const simple = v.every(x => typeof x !== 'object' || x === null);
      if ((multiligne === false || (multiligne === null && simple)) && court.length + ind.length < 110) return court;
      return `[\n${v.map(x => `${ind}  ${formater(x, ind + '  ')},`).join('\n')}\n${ind}]`;
    }
    if (v && typeof v === 'object') {
      const cles = Object.keys(v);
      if (!cles.length) return '{}';
      return `{\n${cles.map(k => `${ind}  ${nomCle(k)}: ${formater(v[k], ind + '  ')},`).join('\n')}\n${ind}}`;
    }
    if (typeof v === 'number') return Number.isFinite(v) ? String(v) : '0';
    if (typeof v === 'boolean') return String(v);
    return JSON.stringify(v ?? '');
  }
  const indentation = (texte, pos) => { const d = texte.lastIndexOf('\n', pos - 1) + 1; return /^[ \t]*/.exec(texte.slice(d))[0]; };

  // Remplace (ou ajoute) les valeurs modifiées : changements = [{ chemin: "a.b", valeur }]
  function appliquer(texte, changements) {
    const racine = analyser(texte);
    const operations = [];
    for (const { chemin, valeur } of changements) {
      const n = trouver(racine, chemin);
      if (n) {
        const multi = n.type === 'liste' ? texte.slice(n.debut, n.fin).includes('\n') : null;
        operations.push({ pos: n.debut, fin: n.fin, texte: formater(valeur, indentation(texte, n.debut), multi, n.notes || []) });
        continue;
      }
      // Absent du fichier : on l'ajoute à la fin de l'objet parent le plus proche
      const cles = chemin.split('.');
      let parent = racine, k = 0;
      while (k < cles.length - 1 && parent.cles[cles[k]] && parent.cles[cles[k]].type === 'objet') parent = parent.cles[cles[k++]];
      let v = valeur;
      for (let j = cles.length - 1; j > k; j--) v = { [cles[j]]: v };
      const ind = parent.ordre.length ? indentation(texte, parent.cles[parent.ordre[0]].debut) : indentation(texte, parent.debut) + '  ';
      const accolade = parent.fin - 1;
      const debutLigne = texte.lastIndexOf('\n', accolade - 1) + 1;
      const seule = /^[ \t]*$/.test(texte.slice(debutLigne, accolade));
      const ajout = `${ind}${nomCle(cles[k])}: ${formater(v, ind)},\n`;
      if (parent.finDerniere !== null && !parent.virgule) operations.push({ pos: parent.finDerniere, fin: parent.finDerniere, texte: ',' });
      operations.push(seule ? { pos: debutLigne, fin: debutLigne, texte: ajout } : { pos: accolade, fin: accolade, texte: '\n' + ajout + indentation(texte, parent.debut) });
    }
    operations.sort((a, b) => b.pos - a.pos || b.fin - a.fin);
    let t = texte;
    for (const o of operations) t = t.slice(0, o.pos) + o.texte + t.slice(o.fin);
    return t;
  }

  // Sans le fichier d'origine (navigateur sans accès aux fichiers) : tout le fichier, sans les commentaires
  const complet = (config, nom) => `/* =====================================================================
   ${String(nom || '').toUpperCase()} — Configuration de l'overlay (écrite par reglages.html).
   Le plus simple pour la modifier : ouvre reglages.html.
   ===================================================================== */
window.CONFIG = ${formater(config)};
`;

  // Exécute le texte d'un config.js et renvoie son CONFIG (pour vérifier avant d'écrire)
  function executer(texte) { const w = {}; Function('window', texte)(w); return w.CONFIG; }

  // =====================================================================
  // 3. La page
  // =====================================================================
  const lire = (o, chemin) => chemin.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
  const ecrireCle = (o, chemin, v) => { const k = chemin.split('.'); const f = k.pop(); k.reduce((x, c) => (x[c] ??= {}), o)[f] = v; };
  const copie = o => JSON.parse(JSON.stringify(o ?? {}));
  const pareil = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const echapper = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Les alertes standard (config.js › alertes.textes), dans l'ordre du tableau
  const ALERTES = [['follow', 'Follow'], ['sub', 'Abonnement'], ['resub', 'Réabonnement'], ['giftsub', 'Abonnement offert'],
    ['giftbomb', 'Pluie d\'abonnements offerts'], ['bits', 'Bits'], ['raid', 'Raid'], ['don', 'Don'], ['objectif', 'Objectif atteint']];
  const EXEMPLE = { nom: 'Pseudo', montant: 500, mois: 7, nombre: 5, destinataire: 'UnAutre' };
  const remplir = (t, v) => String(t ?? '').replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');

  // Devine le type d'un réglage non décrit dans reglages-champs.js
  function typeDe(v) {
    if (typeof v === 'boolean') return 'case';
    if (typeof v === 'number') return 'nombre';
    if (typeof v === 'string') return 'texte';
    if (Array.isArray(v) && v.every(x => typeof x === 'string')) return 'liste';
    if (Array.isArray(v) && v.every(x => Array.isArray(x) && x.length === 2 && x.every(y => typeof y === 'string'))) return 'paires';
    return null;
  }
  // Tous les chemins « feuilles » d'un objet
  function feuilles(o, base = '') {
    return Object.entries(o || {}).flatMap(([k, v]) => {
      const c = base ? `${base}.${k}` : k;
      return v && typeof v === 'object' && !Array.isArray(v) ? feuilles(v, c) : [c];
    });
  }

  function demarrer() {
    const RC = window.ReglagesChamps || { sections: [] };
    const enregistre = copie(window.CONFIG);          // ce qu'il y a dans config.js
    let valeurs = copie(enregistre);                   // ce qu'il y a dans le formulaire
    const nom = enregistre.nomChaine || enregistre.id || 'Overlay';
    document.title = `${nom} — Réglages`;
    (RC.styles || []).forEach(href => document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${href}">`));

    // Les sections : celles de reglages-champs.js, puis « Autres réglages » pour tout le reste
    const sections = (RC.sections || []).map(s => ({ ...s, champs: (s.champs || []).filter(c => lire(enregistre, c.cle) !== undefined || c.ajouter) }));
    const decrits = new Set(sections.flatMap(s => s.champs.map(c => c.cle)));
    const alertes = Object.keys(lire(enregistre, 'alertes.textes') || {});
    const autres = feuilles(enregistre).filter(c => c !== 'id' && !decrits.has(c) && !c.startsWith('alertes.textes.') && typeDe(lire(enregistre, c)))
      .map(c => ({ cle: c, type: typeDe(lire(enregistre, c)), label: c }));
    if (autres.length) sections.push({ titre: 'Autres réglages', icone: '🧩', aide: 'Réglages propres à cet overlay, sans description (le nom est celui de config.js).', champs: autres });

    const idChamp = cle => 'rg-' + cle.replaceAll('.', '-');
    const versChamp = (type, v) => type === 'liste' ? (v || []).join('\n') : type === 'paires' ? (v || []).map(p => p.join(' | ')).join('\n') : (v ?? '');
    function depuisChamp(c, el) {
      if (c.type === 'case') return el.checked;
      if (c.type === 'nombre') return el.value === '' ? 0 : Number(el.value);
      if (c.type === 'liste') return el.value.split('\n').map(s => s.trim()).filter(Boolean);
      if (c.type === 'paires') return el.value.split('\n').map(s => s.trim()).filter(Boolean).map(s => { const [a, ...b] = s.split('|'); return [a.trim(), b.join('|').trim()]; });
      if (c.type === 'twitch') return el.value.trim().toLowerCase().replace(/^.*twitch\.tv\//, '').replace(/[^a-z0-9_]/g, '');
      return el.value;
    }

    function champHTML(c) {
      const v = lire(valeurs, c.cle), id = idChamp(c.cle);
      const aide = c.aide ? `<small>${echapper(c.aide)}</small>` : '';
      let saisie;
      switch (c.type) {
        case 'case': return `<label class="rg-champ rg-case" data-cle="${c.cle}"><input id="${id}" type="checkbox" ${v ? 'checked' : ''}><span>${echapper(c.label)}</span>${aide}</label>`;
        case 'nombre': saisie = `<input id="${id}" type="number" value="${echapper(v)}" ${c.min != null ? `min="${c.min}"` : ''} ${c.max != null ? `max="${c.max}"` : ''} step="${c.pas || 'any'}">`; break;
        case 'heure': saisie = `<input id="${id}" type="time" value="${echapper(v)}">`; break;
        case 'secret': saisie = `<input id="${id}" type="password" value="${echapper(v)}" autocomplete="off">`; break;
        case 'choix': saisie = `<select id="${id}">${c.options.map(([val, lib]) => `<option value="${echapper(val)}" ${val === v ? 'selected' : ''}>${echapper(lib)}</option>`).join('')}</select>`; break;
        case 'liste': case 'paires': saisie = `<textarea id="${id}" rows="${Math.min(8, Math.max(3, (v || []).length + 1))}">${echapper(versChamp(c.type, v))}</textarea>`; break;
        default: saisie = `<input id="${id}" type="text" value="${echapper(v)}">`;
      }
      const large = ['liste', 'paires'].includes(c.type) || c.large ? ' rg-large' : '';
      return `<label class="rg-champ${large}" data-cle="${c.cle}"><span>${echapper(c.label)}</span>${saisie}${aide}</label>`;
    }

    function alertesHTML() {
      const noms = Object.fromEntries(ALERTES);
      const lignes = alertes.map(cle => {
        const t = lire(valeurs, `alertes.textes.${cle}`) || {};
        return `<div class="rg-ligne-alerte"><b>${echapper(noms[cle] || cle)}</b>
          <label class="rg-champ" data-cle="alertes.textes.${cle}.titre"><input type="text" data-alerte="${cle}.titre" value="${echapper(t.titre)}" aria-label="Titre"></label>
          <label class="rg-champ" data-cle="alertes.textes.${cle}.message"><input type="text" data-alerte="${cle}.message" value="${echapper(t.message)}" aria-label="Message"></label></div>`;
      }).join('');
      return `<h3>Le vocabulaire des alertes</h3>
        <p class="rg-aide">Titre à gauche, message à droite. Remplacés automatiquement : <code>{nom}</code> (le pseudo), <code>{montant}</code> (bits, don,
          spectateurs du raid), <code>{mois}</code>, <code>{nombre}</code> (abonnements offerts), <code>{destinataire}</code>.</p>
        <div class="rg-alertes">${lignes}</div>
        <h3>Aperçu</h3><div class="rg-apercus" id="rg-apercus"></div>`;
    }

    function apercus() {
      const boite = document.getElementById('rg-apercus');
      if (!boite) return;
      const noms = Object.fromEntries(ALERTES);
      boite.innerHTML = alertes.map(cle => {
        const t = lire(valeurs, `alertes.textes.${cle}`) || {};
        const ex = { ...EXEMPLE, montant: { don: '5,00 €', raid: 42 }[cle] ?? 500 };
        if (cle === 'objectif') ex.nom = `${lire(valeurs, 'objectif.cible') ?? 50} / ${lire(valeurs, 'objectif.cible') ?? 50}`;
        if (RC.apercuAlerte) return RC.apercuAlerte(cle, { titre: t.titre, nom: ex.nom, message: remplir(t.message, ex) });
        return `<div class="rg-apercu"><small>${echapper(noms[cle] || cle)}</small><b>${echapper(t.titre)}</b><strong>${echapper(ex.nom)}</strong><span>${echapper(remplir(t.message, ex))}</span></div>`;
      }).join('');
    }

    function construire() {
      document.getElementById('rg-formulaire').innerHTML = sections.map(s => `<section class="rg-section">
        <h2><span class="rg-icone">${s.icone || '⚙️'}</span>${echapper(s.titre)}</h2>
        ${s.aide ? `<p class="rg-aide">${echapper(s.aide)}</p>` : ''}
        <div class="rg-champs">${s.champs.map(champHTML).join('')}</div>
        ${s.alertes && alertes.length ? alertesHTML() : ''}</section>`).join('');
      apercus();
    }

    const statut = (t, classe = '') => { const s = document.getElementById('rg-statut'); s.textContent = t; s.className = classe; };
    const tousLesChamps = () => sections.flatMap(s => s.champs);
    // Les réglages modifiés depuis le dernier enregistrement
    const changements = () => [...new Set([...tousLesChamps().map(c => c.cle), ...alertes.flatMap(a => [`alertes.textes.${a}.titre`, `alertes.textes.${a}.message`])])]
      .filter(c => !pareil(lire(valeurs, c), lire(enregistre, c))).map(chemin => ({ chemin, valeur: lire(valeurs, chemin) }));

    function relire() {
      tousLesChamps().forEach(c => { const el = document.getElementById(idChamp(c.cle)); if (el) ecrireCle(valeurs, c.cle, depuisChamp(c, el)); });
      document.querySelectorAll('[data-alerte]').forEach(el => ecrireCle(valeurs, 'alertes.textes.' + el.dataset.alerte, el.value));
      const liste = changements(), modifies = new Set(liste.map(c => c.chemin));
      document.querySelectorAll('[data-cle]').forEach(l => l.classList.toggle('rg-modifie', modifies.has(l.dataset.cle)));
      const n = liste.length;
      document.getElementById('rg-annuler').disabled = !n;
      statut(n ? `${n} réglage${n > 1 ? 's' : ''} modifié${n > 1 ? 's' : ''}, pas encore enregistré${n > 1 ? 's' : ''}.` : 'Rien n\'a changé.', n ? 'rg-attention' : '');
      apercus();
      return liste;
    }

    // --- Le fichier config.js choisi une fois, gardé (IndexedDB, un par overlay) ---
    const BASE = `overlay-${enregistre.id || 'defaut'}-reglages`;
    const base = () => new Promise((ok, ko) => { const r = indexedDB.open(BASE, 1); r.onupgradeneeded = () => r.result.createObjectStore('fichiers'); r.onsuccess = () => ok(r.result); r.onerror = ko; });
    const garde = async (h) => { try { const db = await base(); const t = db.transaction('fichiers', h === undefined ? 'readonly' : 'readwrite').objectStore('fichiers');
      return await new Promise(ok => { const r = h === undefined ? t.get('config') : h === null ? t.delete('config') : t.put(h, 'config'); r.onsuccess = () => ok(r.result); r.onerror = () => ok(null); }); } catch (e) { return null; } };

    async function enregistrer() {
      const liste = relire();
      if (!liste.length) return statut('Rien à enregistrer.', '');
      if (window.showOpenFilePicker) {
        try {
          let h = await garde();
          if (h && (await h.queryPermission({ mode: 'readwrite' })) !== 'granted' && (await h.requestPermission({ mode: 'readwrite' })) !== 'granted') h = null;
          if (!h) {
            statut('Choisis le fichier config.js de ce dossier (à côté de reglages.html), puis « Ouvrir ».', 'rg-attention');
            [h] = await showOpenFilePicker({ types: [{ description: 'Configuration de l\'overlay', accept: { 'text/javascript': ['.js'] } }] });
            if ((await h.requestPermission({ mode: 'readwrite' })) !== 'granted') return statut('Sans autorisation, la page ne peut pas modifier config.js.', 'rg-attention');
          }
          const actuel = await (await h.getFile()).text();
          let lu;
          try { lu = executer(actuel); } catch (e) { lu = null; }
          if (!lu || (lu.id && enregistre.id && lu.id !== enregistre.id)) {
            await garde(null);
            return statut(`⚠️ Ce fichier n'est pas le config.js de ${nom}${lu && lu.id ? ` (c'est celui de « ${lu.id} »)` : ''}. Réessaie en choisissant le bon.`, 'rg-attention');
          }
          const nouveau = appliquer(actuel, liste);
          const verif = executer(nouveau);                 // on relit le résultat avant d'écrire
          const faux = liste.filter(c => !pareil(lire(verif, c.chemin), c.valeur));
          if (faux.length) throw new Error('vérification ratée pour ' + faux.map(c => c.chemin).join(', '));
          const w = await h.createWritable(); await w.write(nouveau); await w.close();
          await garde(h);
          liste.forEach(c => ecrireCle(enregistre, c.chemin, copie({ v: c.valeur }).v));
          relire();
          return statut('✅ config.js enregistré. Dans OBS : clic droit sur les sources › Actualiser.', 'rg-ok');
        } catch (e) {
          if (e.name === 'AbortError') return statut('Enregistrement annulé.', 'rg-attention');
          console.error('[Réglages]', e);
          if (!/showOpenFilePicker|SecurityError|NotAllowed/.test(e.name + e.message)) return statut('⚠️ Enregistrement impossible : ' + e.message, 'rg-attention');
        }
      }
      // Navigateur sans accès aux fichiers (Firefox…) : on télécharge un config.js complet
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([complet(valeurs, nom)], { type: 'text/javascript' }));
      a.download = 'config.js'; a.click();
      statut('⬇️ Un nouveau config.js a été téléchargé : mets-le à la place de l\'ancien (ses commentaires ne sont pas gardés). Avec Edge ou Chrome, la page modifie directement le fichier.', 'rg-ok');
    }

    // --- En-tête, liens de test ---
    document.getElementById('rg-nom').textContent = nom;
    if (RC.logo) document.getElementById('rg-logo').innerHTML = `<img src="${RC.logo}" alt="${echapper(nom)}">`;
    document.getElementById('rg-tests').innerHTML = (RC.tests || []).map(([lib, url]) => `<a href="${url}" target="_blank">${echapper(lib)}</a>`).join('')
      + '<a href="index.html" target="_blank">🏠 Tout voir</a>';

    document.addEventListener('input', relire);
    document.addEventListener('change', relire);
    addEventListener('beforeunload', e => { if (changements().length) e.preventDefault(); });
    addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); enregistrer(); } });
    document.getElementById('rg-enregistrer').onclick = enregistrer;
    document.getElementById('rg-annuler').onclick = () => { valeurs = copie(enregistre); construire(); relire(); };
    construire();
    relire();
  }

  return { analyser, appliquer, formater, executer, demarrer };
})();
if (typeof module !== 'undefined') module.exports = Reglages;   // pour les vérifications en Node
