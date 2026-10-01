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
  // 2 bis. mes-reglages.js : SEULEMENT ce que le streamer a changé
  // config.js = les valeurs par défaut (remplacé à chaque mise à jour de l'overlay) ;
  // mes-reglages.js = ses réglages, appliqués par-dessus (js/couleurs.js) et jamais touchés par une mise à jour.
  // =====================================================================
  // Ce qui, dans « valeurs », diffère des valeurs par défaut (objets comparés clé par clé, listes en entier)
  function difference(valeurs, defaut) {
    const d = {};
    for (const [k, v] of Object.entries(valeurs || {})) {
      const base = (defaut || {})[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && base && typeof base === 'object' && !Array.isArray(base)) {
        const sous = difference(v, base);
        if (Object.keys(sous).length) d[k] = sous;
      } else if (JSON.stringify(v) !== JSON.stringify(base)) d[k] = v;
    }
    return d;
  }
  const fichierPerso = (perso, nom) => `/* =====================================================================
   MES RÉGLAGES — ${String(nom || '').toUpperCase()}
   Ce que tu as changé dans reglages.html, appliqué PAR-DESSUS config.js (les valeurs par défaut).
   Écrit par reglages.html : le plus simple pour le modifier, c'est d'ouvrir reglages.html.
   ⚠️ Lors d'une mise à jour de l'overlay, GARDE CE FICHIER : config.js peut être remplacé, tes réglages restent ici.
   ===================================================================== */
window.MES_REGLAGES = ${formater(perso)};
`;
  function executerPerso(texte) { const w = {}; Function('window', texte)(w); return w.MES_REGLAGES; }

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
    const defaut = copie(window.CONFIG_DEFAUT || window.CONFIG);   // config.js seul (les valeurs par défaut)
    const enregistre = copie(window.CONFIG);          // config.js + mes-reglages.js (déjà fusionnés par js/couleurs.js)
    let valeurs = copie(enregistre);                   // ce qu'il y a dans le formulaire
    const nom = enregistre.nomChaine || enregistre.id || 'Overlay';
    document.title = `${nom} — Réglages`;
    (RC.styles || []).forEach(href => document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${href}">`));

    // Les sections : celles de reglages-champs.js, puis « Autres réglages » pour tout le reste
    // Section « sons: true » : un champ par alerte de config.js › alertes.sons (fichier + ▶ pour écouter)
    const nomsAlertes = Object.fromEntries(ALERTES);
    const champsSons = () => Object.keys(lire(enregistre, 'alertes.sons') || {}).map(k => {
      const titre = lire(enregistre, `alertes.textes.${k}.titre`);
      return { cle: `alertes.sons.${k}`, type: 'son', son: k, label: (nomsAlertes[k] || k) + (titre ? ` — « ${titre} »` : '') };
    });
    // Section « scenes: true » : config.js › options en TABLEAU (une ligne par scène, une colonne par élément) ;
    // une webcam à préréglages (scène Jeu, d'après js/zones.js) a son bloc : préréglages + coordonnées, position perso, plan
    const NOMS_SCENES = { demarrage: 'Démarrage', pause: 'Pause', fin: 'Fin', 'cam-seule': 'Cam seule', contenu: 'Contenu', jeu: 'Jeu',
      speedrun: 'Speedrun', cam: 'Cadre de la cam', ...(RC.scenes || {}) };
    const NOMS_ELEMENTS = { cam: '📷 Webcam', chat: '💬 Chat', bandeau: '📰 Bandeau', bouffon: '🎭 Mascotte', pseudo: '🏷️ Pseudo', ...(RC.elements || {}) };
    const NOMS_COINS = { 'bas-droite': 'En bas à droite', 'bas-gauche': 'En bas à gauche', 'haut-droite': 'En haut à droite', 'haut-gauche': 'En haut à gauche' };
    const zonesCam = () => (typeof Options !== 'undefined' ? Options.zonesCam() : {});
    const ordre = (liste, ref) => [...liste].sort((a, b) => { const i = ref.indexOf(a), j = ref.indexOf(b); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j); });
    const champsScenes = () => {
      const o = lire(enregistre, 'options') || {};
      return ordre(Object.keys(o), Object.keys(NOMS_SCENES)).flatMap(sc => ordre(Object.keys(o[sc] || {}), Object.keys(NOMS_ELEMENTS)).map(el => {
        const v = o[sc][el], prereglages = el === 'cam' && (zonesCam()[sc] || {}).prereglages;
        return { cle: `options.${sc}.${el}`, scene: sc, element: el, type: prereglages ? 'cam' : typeof v === 'boolean' ? 'case' : 'texte',
          label: `${NOMS_SCENES[sc] || sc} : ${(NOMS_ELEMENTS[el] || el).replace(/^[^\p{L}]+/u, '')}` };
      }));
    };
    const sections = (RC.sections || []).map(s => ({ ...s, champs: [...(s.scenes ? champsScenes() : []), ...(s.champs || []), ...(s.sons ? champsSons() : [])]
      .filter((c, i, l) => l.findIndex(x => x.cle === c.cle) === i)
      .filter(c => lire(enregistre, c.cle) !== undefined || c.ajouter) }))
      .filter(s => !s.sons || s.champs.length);
    const decrits = new Set(sections.flatMap(s => s.champs.map(c => c.cle)));
    const alertes = Object.keys(lire(enregistre, 'alertes.textes') || {});
    const autres = feuilles(enregistre).filter(c => c !== 'id' && c !== 'ambiances' && !decrits.has(c) && !c.startsWith('alertes.textes.') && typeDe(lire(enregistre, c)))
      .map(c => ({ cle: c, type: typeDe(lire(enregistre, c)), label: c }));
    if (autres.length) sections.push({ titre: 'Autres réglages', icone: '🧩', aide: 'Réglages propres à cet overlay, sans description (le nom est celui de config.js).', champs: autres });

    const idChamp = cle => 'rg-' + cle.replaceAll('.', '-');
    const versChamp = (type, v) => type === 'liste' ? (v || []).join('\n') : type === 'paires' ? (v || []).map(p => p.join(' | ')).join('\n') : (v ?? '');
    function depuisChamp(c, el) {
      if (c.type === 'case') return el.checked;
      if (c.type === 'cam') {                       // un préréglage, « aucune », ou { x, y, l, h }
        const choix = (el.querySelector('input[type=radio]:checked') || {}).value || '';
        if (choix !== 'perso') return choix;
        const n = k => Math.round(Number(document.getElementById(`${el.id}-${k}`).value) || 0);
        return { x: n('x'), y: n('y'), l: n('l'), h: n('h') };
      }
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
        // Une couleur : le nuancier, le code (ex. #FF7A1A, vide = couleur d'origine du thème) et ↺ pour revenir à l'origine
        case 'couleur': {
          const hex = /^#[0-9a-f]{6}$/i.test(v || '') ? v : (c.defaut || '#888888');
          saisie = `<span class="rg-couleur"><input type="color" data-pour="${id}" value="${hex}" aria-label="Choisir la couleur">
            <input id="${id}" type="text" value="${echapper(v)}" placeholder="d'origine${c.defaut ? ' : ' + echapper(c.defaut) : ''}" spellcheck="false">
            <button type="button" class="rg-origine" data-pour="${id}" data-defaut="${echapper(c.defaut || '')}" title="Revenir à la couleur d'origine">↺</button></span>`; break;
        }
        // Un son : vide = le son de l'overlay, « aucun », ou un fichier (sons/xxx.mp3) ; ▶ pour écouter
        case 'son': saisie = `<span class="rg-son"><input id="${id}" type="text" value="${echapper(v)}" placeholder="le son de l'overlay" spellcheck="false">
            <button type="button" class="rg-ecouter" data-son="${c.son}" data-pour="${id}" title="Écouter">▶</button></span>`; break;
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

    // Les ambiances : celles toutes prêtes (reglages-champs.js › ambiances), puis celles créées ici
    // et gardées dans mes-reglages.js › ambiances : [{ nom: "Batman", valeurs: { "couleurs.accent": "#F5C518", … } }]
    const mesAmbiances = () => (Array.isArray(valeurs.ambiances) ? valeurs.ambiances : []);
    // Les réglages qu'une ambiance retient : tous ceux des sections Couleurs
    const champsAmbiance = () => sections.filter(s => s.ambiances).flatMap(s => s.champs);
    function ambiancesHTML() {
      const pastilles = v => Object.values(v || {}).filter(x => /^#[0-9a-f]{3,8}$/i.test(x)).slice(0, 5)
        .map(x => `<i style="background:${x}"></i>`).join('');
      const pretes = (RC.ambiances || []).map((a, i) =>
        `<button type="button" class="rg-ambiance" data-ambiance="${i}">${echapper(a.nom)}<span>${pastilles(a.valeurs)}</span></button>`).join('');
      const miennes = mesAmbiances().map((a, i) => `<span class="rg-mienne">
          <button type="button" class="rg-ambiance" data-mon-ambiance="${i}">${echapper(a.nom)}<span>${pastilles(a.valeurs)}</span></button>
          <button type="button" class="rg-supprimer" data-supprimer-ambiance="${i}" title="Supprimer cette ambiance" aria-label="Supprimer ${echapper(a.nom)}">×</button></span>`).join('');
      return `${pretes ? `<h3>En un clic</h3><div class="rg-ambiances">${pretes}</div>` : ''}
        <h3>Mes ambiances</h3>
        ${miennes ? `<div class="rg-ambiances">${miennes}</div>` : '<p class="rg-aide">Aucune pour l\'instant : règle les couleurs ci-dessus, donne un nom, puis 💾.</p>'}
        <div class="rg-nouvelle"><input type="text" id="rg-nom-ambiance" placeholder="Nom de l'ambiance (ex. Batman)" maxlength="40">
          <button type="button" id="rg-sauver-ambiance">💾 Sauvegarder ces couleurs</button></div>
        <p class="rg-aide">Une ambiance retient les couleurs affichées ci-dessus et s'enregistre tout de suite dans mes-reglages.js ; un clic dessus
          les remet. Ensuite, <b>Enregistrer</b> pour que l'overlay les prenne. Les vidéos de transition et les images du kit de chaîne,
          elles, sont déjà fabriquées : pour qu'elles suivent, refais-les (voir le tuto, « Personnaliser »).</p>`;
    }

    // ---------- Options des scènes ----------
    const coordonnees = p => `x ${p.x} · y ${p.y} · ${p.l} × ${p.h}`;
    function scenesHTML(s) {
      const champs = s.champs.filter(c => c.scene);
      if (!champs.length) return '';
      const lignes = [...new Set(champs.map(c => c.scene))];
      const colonnes = ordre([...new Set(champs.map(c => c.element))], Object.keys(NOMS_ELEMENTS));
      const cellule = (sc, el) => {
        const c = champs.find(x => x.scene === sc && x.element === el);
        if (!c) return '<td class="rg-vide" title="Pas dans cette scène">—</td>';
        const id = idChamp(c.cle), v = lire(valeurs, c.cle);
        if (c.type === 'case') return `<td><label class="rg-bascule" data-cle="${c.cle}"><input id="${id}" type="checkbox" ${v ? 'checked' : ''} aria-label="${echapper(c.label)}"><i></i></label></td>`;
        if (c.type === 'cam') return `<td><a href="#${id}" class="rg-resume-cam" data-resume="${id}" data-cle="${c.cle}"></a></td>`;
        return `<td><label data-cle="${c.cle}"><input id="${id}" type="text" value="${echapper(v)}" aria-label="${echapper(c.label)}"></label></td>`;
      };
      const tableau = `<div class="rg-defile"><table class="rg-scenes"><thead><tr><th></th>${colonnes.map(el => `<th>${echapper(NOMS_ELEMENTS[el] || el)}</th>`).join('')}</tr></thead>
        <tbody>${lignes.map(sc => `<tr><th>${echapper(NOMS_SCENES[sc] || sc)}</th>${colonnes.map(el => cellule(sc, el)).join('')}</tr>`).join('')}</tbody></table></div>`;
      return tableau + champs.filter(c => c.type === 'cam').map(camHTML).join('') + zonesFixesHTML();
    }

    // Le bloc de la webcam d'une scène à préréglages : choix, coordonnées, position perso, plan
    function camHTML(c) {
      const id = idChamp(c.cle), z = zonesCam()[c.scene], v = lire(valeurs, c.cle);
      const choix = v && typeof v === 'object' ? 'perso' : (v === 'aucune' || v === false || v === '0') ? 'aucune' : (z.prereglages[v] ? v : z.defaut);
      const r = (choix === 'perso' && Options.cam(c.scene, v)) || z.prereglages[choix] || z.prereglages[z.defaut];
      const radio = (val, titre, detail) => `<label class="rg-coin"><input type="radio" name="${id}" value="${val}" ${choix === val ? 'checked' : ''}>
        <span><b>${titre}</b>${detail ? `<small>${detail}</small>` : ''}</span></label>`;
      const n = (k, lib) => `<label class="rg-num"><span>${lib}</span><input type="number" id="${id}-${k}" value="${r[k]}" step="1"></label>`;
      return `<div class="rg-cam" id="${id}" data-cle="${c.cle}" data-scene="${c.scene}">
        <h3>📷 La webcam de la scène ${echapper(NOMS_SCENES[c.scene] || c.scene)}</h3>
        <div class="rg-cam-corps">
          <div><svg class="rg-plan" viewBox="0 0 1920 1080" role="img" aria-label="Plan de l'écran : où est la webcam"></svg>
            <p class="rg-aide">Le plan de l'écran (1920 × 1080). Fais glisser le cadre de la cam, ou clique un emplacement en pointillés.</p></div>
          <div class="rg-coins">${Object.entries(z.prereglages).map(([k, p]) => radio(k, NOMS_COINS[k] || k, coordonnees(p))).join('')}
            ${radio('perso', 'Position perso', 'au pixel près : X et Y = le coin en haut à gauche de la cam')}
            <div class="rg-nums">${n('x', 'X')}${n('y', 'Y')}${n('l', 'Largeur')}${n('h', 'Hauteur')}</div>
            ${radio('aucune', 'Pas de webcam', 'ni cadre, ni webcam dans cette scène')}</div>
        </div>
        <p class="rg-aide rg-obs" id="${id}-obs"></p></div>`;
    }

    // Les scènes où la webcam a une place fixe (pour la poser dans OBS, ou vérifier le script)
    function zonesFixesHTML() {
      const fixes = Object.entries(zonesCam()).filter(([, z]) => !z.prereglages);
      if (!fixes.length) return '';
      return `<h3>📐 La webcam dans les autres scènes (place fixe)</h3>
        <div class="rg-defile"><table class="rg-scenes rg-fixes"><tbody>${fixes.map(([sc, z]) =>
          `<tr><th>${echapper(NOMS_SCENES[sc] || sc)}</th><td>${coordonnees(z)}</td></tr>`).join('')}</tbody></table></div>
        <p class="rg-aide">Pixels en 1920 × 1080 (X, Y = le coin en haut à gauche). Le script OBS <code>outils/actualiser-obs.lua</code>
          place la webcam tout seul dans toutes ces scènes (bouton « Placer les webcams »), et la replace quand tu enregistres ici.</p>`;
    }

    // Met à jour les blocs webcam (coordonnées, plan, résumé dans le tableau) d'après ce qui est coché
    function majScenes() {
      document.querySelectorAll('.rg-cam').forEach(bloc => {
        const id = bloc.id, z = zonesCam()[bloc.dataset.scene];
        if (!z || !z.prereglages) return;
        const choix = (bloc.querySelector('input[type=radio]:checked') || {}).value;
        const cles = ['x', 'y', 'l', 'h'], champ = k => document.getElementById(`${id}-${k}`);
        if (z.prereglages[choix]) cles.forEach(k => { champ(k).value = z.prereglages[choix][k]; });
        cles.forEach(k => { champ(k).disabled = choix !== 'perso'; });
        const r = choix === 'aucune' ? null : Object.fromEntries(cles.map(k => [k, Math.round(Number(champ(k).value) || 0)]));
        const pointilles = Object.entries(z.prereglages).map(([k, p]) =>
          `<rect class="rg-plan-coin" data-coin="${k}" x="${p.x}" y="${p.y}" width="${p.l}" height="${p.h}" rx="12"><title>${echapper(NOMS_COINS[k] || k)}</title></rect>`).join('');
        bloc.querySelector('.rg-plan').innerHTML = `<rect class="rg-plan-jeu" x="0" y="0" width="1920" height="1080"/>
          <text class="rg-plan-texte" x="960" y="560">${r ? 'le jeu' : 'le jeu — pas de webcam'}</text>${pointilles}
          ${r ? `<rect class="rg-plan-cam" x="${r.x}" y="${r.y}" width="${Math.max(10, r.l)}" height="${Math.max(10, r.h)}" rx="12"/>
            <text class="rg-plan-legende" x="${r.x + r.l / 2}" y="${r.y + r.h / 2 + 18}">📷 ${r.x}, ${r.y}</text>` : ''}`;
        const resume = document.querySelector(`[data-resume="${id}"]`);
        if (resume) resume.textContent = !r ? '✖ Pas de webcam' : choix === 'perso' ? `📍 Perso (${r.x}, ${r.y})` : '📍 ' + (NOMS_COINS[choix] || choix);
        document.getElementById(`${id}-obs`).innerHTML = r
          ? `Dans OBS, la webcam va en <b>x ${r.x} · y ${r.y}</b>, taille <b>${r.l} × ${r.h}</b> (pixels en 1920 × 1080). Le script
            <code>outils/actualiser-obs.lua</code> l'y place tout seul quand tu enregistres.`
          : 'Pas de cadre de webcam dans cette scène ; le script OBS y cache la webcam.';
      });
    }

    function construire() {
      document.getElementById('rg-formulaire').innerHTML = sections.map(s => `<section class="rg-section">
        <h2><span class="rg-icone">${s.icone || '⚙️'}</span>${echapper(s.titre)}</h2>
        ${s.aide ? `<p class="rg-aide">${echapper(s.aide)}</p>` : ''}
        ${s.scenes ? scenesHTML(s) : ''}
        <div class="rg-champs">${s.champs.filter(c => !c.scene).map(champHTML).join('')}</div>
        ${s.ambiances ? ambiancesHTML() : ''}
        ${s.alertes && alertes.length ? alertesHTML() : ''}</section>`).join('');
      apercus();
      majScenes();
    }

    const statut = (t, classe = '') => { const s = document.getElementById('rg-statut'); s.textContent = t; s.className = classe; };
    const tousLesChamps = () => sections.flatMap(s => s.champs);
    // Les réglages modifiés depuis le dernier enregistrement
    const changements = () => [...new Set([...tousLesChamps().map(c => c.cle), ...alertes.flatMap(a => [`alertes.textes.${a}.titre`, `alertes.textes.${a}.message`]), 'ambiances'])]
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
      majScenes();
      return liste;
    }

    // --- Le dossier de l'overlay, choisi une fois et gardé (IndexedDB, un par overlay) ---
    const BASE = `overlay-${enregistre.id || 'defaut'}-reglages`;
    const base = () => new Promise((ok, ko) => { const r = indexedDB.open(BASE, 1); r.onupgradeneeded = () => r.result.createObjectStore('fichiers'); r.onsuccess = () => ok(r.result); r.onerror = ko; });
    const garde = async (h) => { try { const db = await base(); const t = db.transaction('fichiers', h === undefined ? 'readonly' : 'readwrite').objectStore('fichiers');
      return await new Promise(ok => { const r = h === undefined ? t.get('dossier') : h === null ? t.delete('dossier') : t.put(h, 'dossier'); r.onsuccess = () => ok(r.result); r.onerror = () => ok(null); }); } catch (e) { return null; } };

    // Le contenu de mes-reglages.js après cet enregistrement : l'enregistré + ces changements, moins ce qui vaut le défaut
    function persoApres(liste) {
      const aEcrire = copie(enregistre);
      liste.forEach(c => ecrireCle(aEcrire, c.chemin, copie({ v: c.valeur }).v));
      const perso = difference(aEcrire, defaut);
      delete perso.id;
      return { id: enregistre.id, ...perso };                          // l'id : refuser le fichier d'un autre overlay
    }

    // seulement : liste de chemins à enregistrer (ex. ['ambiances']) ; sinon tout ce qui a changé
    async function enregistrer(seulement = null, reussite = '✅ Enregistré dans mes-reglages.js. Dans OBS : clic droit sur les sources › Actualiser.') {
      if (!Array.isArray(seulement)) seulement = null;   // appel depuis un bouton : l'argument est l'événement
      const liste = relire().filter(c => !seulement || seulement.includes(c.chemin));
      if (!liste.length) return statut('Rien à enregistrer.', '');
      const perso = persoApres(liste);
      const texte = fichierPerso(perso, nom);
      if (window.showDirectoryPicker) {
        try {
          let dossier = await garde();
          if (dossier && (await dossier.queryPermission({ mode: 'readwrite' })) !== 'granted' && (await dossier.requestPermission({ mode: 'readwrite' })) !== 'granted') dossier = null;
          if (!dossier) {
            statut('Choisis le DOSSIER de l\'overlay (celui qui contient reglages.html et config.js), puis « Sélectionner le dossier ».', 'rg-attention');
            dossier = await showDirectoryPicker({ mode: 'readwrite' });
          }
          // Le bon dossier ? Son config.js doit être celui de cet overlay
          let lu = null;
          try { lu = executer(await (await (await dossier.getFileHandle('config.js')).getFile()).text()); } catch (e) { lu = null; }
          if (!lu || (lu.id && enregistre.id && lu.id !== enregistre.id)) {
            await garde(null);
            return statut(`⚠️ Ce dossier n'est pas celui de ${nom}${lu && lu.id ? ` (c'est celui de « ${lu.id} »)` : ' (pas de config.js dedans)'}. Réessaie en choisissant le dossier qui contient reglages.html.`, 'rg-attention');
          }
          const verif = executerPerso(texte);                         // on relit le résultat avant d'écrire
          if (JSON.stringify(verif) !== JSON.stringify(perso)) throw new Error('vérification ratée');
          const f = await dossier.getFileHandle('mes-reglages.js', { create: true });
          const w = await f.createWritable(); await w.write(texte); await w.close();
          await garde(dossier);
          liste.forEach(c => ecrireCle(enregistre, c.chemin, copie({ v: c.valeur }).v));
          const reste = relire().length;
          afficherPerso(perso);
          return statut(reussite + (reste ? ` (${reste} autre${reste > 1 ? 's' : ''} réglage${reste > 1 ? 's' : ''} pas encore enregistré${reste > 1 ? 's' : ''})` : ''), 'rg-ok');
        } catch (e) {
          if (e.name === 'AbortError') return statut('Enregistrement annulé.', 'rg-attention');
          console.error('[Réglages]', e);
          if (!/showDirectoryPicker|SecurityError|NotAllowed/.test(e.name + e.message)) return statut('⚠️ Enregistrement impossible : ' + e.message, 'rg-attention');
        }
      }
      // Navigateur sans accès aux fichiers (Firefox…) : on télécharge mes-reglages.js
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([texte], { type: 'text/javascript' }));
      a.download = 'mes-reglages.js'; a.click();
      statut('⬇️ mes-reglages.js a été téléchargé : mets-le dans le dossier de l\'overlay, à côté de config.js (remplace l\'ancien). Avec Edge ou Chrome, la page l\'enregistre directement.', 'rg-ok');
    }

    // --- En haut : tes réglages perso (combien, et où) ---
    function afficherPerso(perso) {
      const el = document.getElementById('rg-perso');
      if (!el) return;
      const n = feuilles(perso).filter(c => c !== 'id').length;
      el.innerHTML = n
        ? `🗂️ <b>${n} réglage${n > 1 ? 's' : ''} perso</b> dans <code>mes-reglages.js</code> : ils restent quand l'overlay est mis à jour (garde ce fichier).`
        : `🗂️ Aucun réglage perso pour l'instant : tout vient de <code>config.js</code> (les valeurs par défaut).`;
    }
    afficherPerso(difference(enregistre, defaut));

    // --- Reprendre les réglages d'un ANCIEN config.js (avant mes-reglages.js, les réglages étaient dedans) ---
    // Ce qui y diffère des valeurs par défaut actuelles est mis dans le formulaire : il reste à cliquer « Enregistrer ».
    const choixAncien = document.getElementById('rg-ancien');
    if (choixAncien) choixAncien.onchange = async () => {
      const f = choixAncien.files[0];
      choixAncien.value = '';
      if (!f) return;
      let ancien;
      try { ancien = executer(await f.text()); } catch (e) { ancien = null; }
      if (!ancien) return statut('⚠️ Ce fichier n\'est pas un config.js d\'overlay.', 'rg-attention');
      if (ancien.id && enregistre.id && ancien.id !== enregistre.id) return statut(`⚠️ Ce config.js est celui de « ${ancien.id} », pas de ${nom}.`, 'rg-attention');
      relire();                                                   // garde ce qui a déjà été tapé
      const repris = difference(ancien, defaut);
      delete repris.id;
      const chemins = feuilles(repris);
      chemins.forEach(c => ecrireCle(valeurs, c, copie({ v: lire(repris, c) }).v));
      if (Array.isArray(repris.ambiances)) valeurs.ambiances = copie(repris.ambiances);
      construire();
      const n = relire().length;
      statut(n ? `📥 ${n} réglage${n > 1 ? 's' : ''} repris de l'ancien config.js (marqués •). Vérifie, puis clique « Enregistrer ».`
        : '📥 Rien à reprendre : cet ancien config.js a les mêmes valeurs que maintenant.', n ? 'rg-attention' : '');
    };

    // --- En-tête, liens de test ---
    document.getElementById('rg-nom').textContent = nom;
    if (RC.logo) document.getElementById('rg-logo').innerHTML = `<img src="${RC.logo}" alt="${echapper(nom)}">`;
    document.getElementById('rg-tests').innerHTML = (RC.tests || []).map(([lib, url]) => `<a href="${url}" target="_blank">${echapper(lib)}</a>`).join('')
      + '<a href="index.html" target="_blank">🏠 Tout voir</a>';

    // Couleurs : le nuancier et le code restent d'accord ; ↺ remet la couleur d'origine ; les ambiances remplissent tout
    document.addEventListener('input', e => {
      const t = e.target;
      if (t.type === 'color' && t.dataset.pour) document.getElementById(t.dataset.pour).value = t.value;
      else if (t.closest && t.closest('.rg-couleur') && /^#[0-9a-f]{6}$/i.test(t.value.trim())) t.parentElement.querySelector('input[type=color]').value = t.value.trim();
    }, true);
    // Le plan de la webcam : glisser le cadre (→ position perso), ou cliquer un emplacement en pointillés (→ ce préréglage)
    document.addEventListener('pointerdown', e => {
      const plan = e.target.closest && e.target.closest('.rg-plan');
      if (!plan) return;
      const bloc = plan.closest('.rg-cam'), coin = e.target.dataset && e.target.dataset.coin;
      e.preventDefault();
      if (coin) { bloc.querySelector(`input[type=radio][value="${coin}"]`).checked = true; relire(); return; }
      bloc.querySelector('input[type=radio][value="perso"]').checked = true;
      majScenes();
      const champ = k => document.getElementById(`${bloc.id}-${k}`);
      const l = Number(champ('l').value) || 100, h = Number(champ('h').value) || 100;
      const bouger = ev => {
        const b = plan.getBoundingClientRect();
        const x = (ev.clientX - b.left) * 1920 / b.width - l / 2, y = (ev.clientY - b.top) * 1080 / b.height - h / 2;
        champ('x').value = Math.round(Math.max(0, Math.min(1920 - l, x)));
        champ('y').value = Math.round(Math.max(0, Math.min(1080 - h, y)));
        relire();
      };
      bouger(e);
      const fin = () => { removeEventListener('pointermove', bouger); removeEventListener('pointerup', fin); };
      addEventListener('pointermove', bouger);
      addEventListener('pointerup', fin);
    });
    document.addEventListener('click', e => {
      const origine = e.target.closest && e.target.closest('.rg-origine');
      if (origine) {
        e.preventDefault();
        document.getElementById(origine.dataset.pour).value = '';
        if (origine.dataset.defaut) origine.parentElement.querySelector('input[type=color]').value = origine.dataset.defaut;
        return relire();
      }
      const ecoute = e.target.closest && e.target.closest('.rg-ecouter');
      if (ecoute) {
        e.preventDefault();
        if (typeof Son === 'undefined') return statut('Écoute impossible : js/son.js n\'est pas chargé (reglages-champs.js › scripts).', 'rg-attention');
        return Son.jouer(ecoute.dataset.son, document.getElementById(ecoute.dataset.pour).value, true);
      }
      const bouton = e.target.closest && e.target.closest('[data-ambiance]');
      if (bouton) {
        relire();                                             // garde ce qui a déjà été tapé ailleurs
        Object.entries(RC.ambiances[bouton.dataset.ambiance].valeurs).forEach(([cle, v]) => { if (lire(enregistre, cle) !== undefined) ecrireCle(valeurs, cle, v); });
        construire(); relire();
        return;
      }
      // Une de mes ambiances : remet toutes ses valeurs (une couleur qu'elle ne cite pas revient à celle d'origine)
      const mienne = e.target.closest && e.target.closest('[data-mon-ambiance]');
      if (mienne) {
        relire();
        const a = mesAmbiances()[mienne.dataset.monAmbiance];
        champsAmbiance().forEach(c => {
          const v = (a.valeurs || {})[c.cle];
          if (v !== undefined) ecrireCle(valeurs, c.cle, v);
          else if (c.type === 'couleur') ecrireCle(valeurs, c.cle, '');
        });
        construire(); relire();
        return;
      }
      const supprimer = e.target.closest && e.target.closest('[data-supprimer-ambiance]');
      if (supprimer) {
        relire();
        const i = Number(supprimer.dataset.supprimerAmbiance), a = mesAmbiances()[i];
        if (!confirm(`Supprimer l'ambiance « ${a.nom} » ?`)) return;
        valeurs.ambiances = mesAmbiances().filter((_, j) => j !== i);
        construire(); enregistrer(['ambiances'], `🗑️ Ambiance « ${a.nom} » supprimée de mes-reglages.js.`);
        return;
      }
      if (e.target.id === 'rg-sauver-ambiance') {
        relire();
        const champNom = document.getElementById('rg-nom-ambiance');
        const nomAmbiance = champNom.value.trim();
        if (!nomAmbiance) { champNom.focus(); return statut('Donne d\'abord un nom à ton ambiance.', 'rg-attention'); }
        const nouvelle = { nom: nomAmbiance, valeurs: Object.fromEntries(champsAmbiance().map(c => [c.cle, lire(valeurs, c.cle)])
          .filter(([, v]) => v !== undefined && v !== '')) };
        const liste = mesAmbiances().slice();
        const deja = liste.findIndex(x => x.nom.toLowerCase() === nomAmbiance.toLowerCase());
        if (deja >= 0 && !confirm(`L'ambiance « ${liste[deja].nom} » existe déjà : la remplacer par ces couleurs ?`)) return;
        if (deja >= 0) liste[deja] = nouvelle; else liste.push(nouvelle);
        valeurs.ambiances = liste;
        construire(); enregistrer(['ambiances'], `✅ Ambiance « ${nomAmbiance} » enregistrée dans mes-reglages.js : un clic dessus remet ses couleurs.`);
      }
    });
    document.addEventListener('input', relire);
    document.addEventListener('change', relire);
    addEventListener('beforeunload', e => { if (changements().length) e.preventDefault(); });
    addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); enregistrer(); } });
    document.getElementById('rg-enregistrer').onclick = () => enregistrer();
    document.getElementById('rg-annuler').onclick = () => { valeurs = copie(enregistre); construire(); relire(); };
    construire();
    relire();
  }

  return { analyser, appliquer, formater, executer, difference, fichierPerso, executerPerso, demarrer };
})();
if (typeof module !== 'undefined') module.exports = Reglages;   // pour les vérifications en Node
