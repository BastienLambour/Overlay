/* =====================================================================
   KIT DE CHAÎNE TWITCH — moteur de la page chaine/kit.html.
   Les visuels sont décrits dans chaine/elements.js (propre à chaque overlay) :

     window.KIT = {
       avant() {},                 // optionnel : préparation (couleurs, polices…)
       elements: [
         { id: 'banniere', groupe: 'banniere', nom: 'Bannière de profil',
           l: 1200, h: 480, rendu: el => { el.innerHTML = '…'; } },
         { id: 'gg', groupe: 'emote', nom: 'GG', l: 112, h: 112, rendu: el => … },
       ],
     };

   Groupes et tailles d'export (formats Twitch) :
     profil 800×800 · banniere 1200×480 · hors-ligne 1920×1080 · panneau 320×160
     emote 112 / 56 / 28 · badge 72 / 36 / 18

   Sans paramètre : galerie de tout le kit, présentée comme sur Twitch.
   ?seul=<id>&taille=<px> : un seul élément à la taille voulue (utilisé par
   outils/exporter-chaine.mjs pour fabriquer les PNG).

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/chaine/).
   ===================================================================== */
(() => {
  const K = window.KIT || { elements: [] };
  const C = window.CONFIG || {};
  const p = new URLSearchParams(location.search);
  const TAILLES = { emote: [112, 56, 28], badge: [72, 36, 18] };
  const TB = 'Tableau de bord des créateurs › Paramètres › Chaîne › Marque';
  const GROUPES = [
    ['profil', 'Photo de profil', `${TB} › Photo de profil (au moins 256 × 256).`],
    ['banniere', 'Bannière de profil', `${TB} › Bannière de profil (1200 × 480).`],
    ['hors-ligne', 'Écran hors-ligne', `${TB} › Bannière du lecteur vidéo (1920 × 1080), affichée quand tu n’es pas en live.`],
    ['panneau', 'Panneaux de bio', 'Sur ta chaîne › onglet À propos › Modifier les panneaux › + › envoie l’image (320 × 160), puis écris le texte en dessous.'],
    ['emote', 'Emotes', 'Tableau de bord › Récompenses des spectateurs › Emotes (affilié ou partenaire) : envoie les 3 tailles (112, 56, 28).'],
    ['badge', 'Badges d’abonné', 'Tableau de bord › Récompenses des spectateurs › Badges › Badges d’abonné : 3 tailles (72, 36, 18).'],
  ];

  // Nom de fichier PNG de chaque export
  const fichier = (e, t) => (TAILLES[e.groupe] ? `${e.groupe}-${e.id}-${t}` : e.groupe === 'panneau' ? `panneau-${e.id}` : e.id) + '.png';
  const exports = K.elements.flatMap(e => (TAILLES[e.groupe] || [e.l]).map(t => ({
    id: e.id, taille: t, l: t, h: Math.round(e.h * t / e.l), fichier: fichier(e, t),
  })));
  window.listeExport = exports;

  // Dessine un élément à sa taille d'origine, puis le met à l'échelle voulue
  function boite(e, taille) {
    const cadre = document.createElement('div');
    cadre.className = 'kit-boite';
    const k = taille / e.l;
    cadre.style.width = taille + 'px';
    cadre.style.height = Math.round(e.h * k) + 'px';
    const el = document.createElement('div');
    el.className = `kit-el kit-${e.groupe}`;
    el.style.width = e.l + 'px';
    el.style.height = e.h + 'px';
    el.style.transform = `scale(${k})`;
    e.rendu(el, taille);
    cadre.appendChild(el);
    return cadre;
  }

  if (K.avant) K.avant();
  const racine = document.getElementById('kit');

  // ---------- Un seul élément (export) ----------
  if (p.has('seul')) {
    document.documentElement.classList.add('kit-seul');
    const e = K.elements.find(x => x.id === p.get('seul'));
    if (e) racine.appendChild(boite(e, Number(p.get('taille')) || e.l));
    document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))))
      .then(() => { window.pret = true; });
    return;
  }

  // ---------- Galerie ----------
  racine.innerHTML = `<header class="kit-entete"><span>Kit de chaîne Twitch</span><h1>${C.nomChaine || ''}</h1>
    <p>Tous les visuels de la chaîne, à leur taille Twitch. Pour obtenir les fichiers PNG :
    <code>node outils/exporter-chaine.mjs</code> → dossier <code>chaine/export/</code>.</p></header>`;
  for (const [groupe, titre, aide] of GROUPES) {
    const liste = K.elements.filter(e => e.groupe === groupe);
    if (!liste.length) continue;
    const s = document.createElement('section');
    s.innerHTML = `<h2>${titre}</h2><p class="kit-aide">${aide}</p>`;
    const grille = document.createElement('div');
    grille.className = `kit-grille kit-grille-${groupe}`;
    for (const e of liste) {
      const carte = document.createElement('figure');
      const tailles = TAILLES[groupe];
      if (tailles) {
        // Emotes et badges : les 3 tailles, sur fond sombre et clair (thèmes du chat Twitch)
        for (const fond of ['sombre', 'clair']) {
          const ligne = document.createElement('div');
          ligne.className = `kit-ligne kit-fond-${fond}`;
          tailles.forEach(t => ligne.appendChild(boite(e, t)));
          carte.appendChild(ligne);
        }
      } else {
        const zone = document.createElement('div');
        zone.className = 'kit-zone';
        const aff = Math.min(e.l, groupe === 'panneau' ? 320 : groupe === 'profil' ? 260 : 900);
        zone.appendChild(boite(e, aff));
        carte.appendChild(zone);
      }
      carte.insertAdjacentHTML('beforeend', `<figcaption><b>${e.nom}</b> · ${e.l} × ${e.h}</figcaption>`);
      grille.appendChild(carte);
    }
    s.appendChild(grille);
    racine.appendChild(s);
  }
})();
