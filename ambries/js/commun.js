/* =====================================================================
   COMMUN — outils partagés par tous les écrans de l'overlay d'Ambries_.
   ===================================================================== */
const Commun = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);

  // Chemin de la racine de l'overlay (les pages sont dans scenes/, sources/…)
  const RACINE = document.currentScript ? document.currentScript.src.replace(/js\/commun\.js.*$/, '') : '../';
  const AVATAR = RACINE + 'assets/avatar.png';

  // --- Mise à l'échelle : l'écran fait 1920×1080 et s'adapte à la fenêtre ---
  function ajuster() {
    const ecran = document.getElementById('ecran');
    if (!ecran) return;
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    ecran.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px, ${(innerHeight - 1080 * s) / 2}px) scale(${s})`;
  }

  // --- Lit une valeur de config par chemin, ex. "fin.titre" ---
  function lire(chemin) {
    return chemin.split('.').reduce((o, k) => (o == null ? o : o[k]), C);
  }

  // --- Remplit tous les éléments data-texte="chemin.dans.config" ---
  function remplirTextes() {
    document.querySelectorAll('[data-texte]').forEach(el => {
      const v = lire(el.dataset.texte);
      if (v != null) el.textContent = v;
    });
  }

  // --- Horloge (éléments data-horloge) ---
  function horloge() {
    const maj = () => {
      const t = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      document.querySelectorAll('[data-horloge]').forEach(el => (el.textContent = t));
    };
    maj(); setInterval(maj, 1000);
  }

  // --- Formate des secondes en mm:ss ---
  function mmss(s) {
    s = Math.max(0, Math.round(s));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  // --- L'avatar dans son anneau néon (élément signature, toujours identique) ---
  function avatar(taille = 200, classe = '') {
    return `<div class="avatar-neon ${classe}" style="--taille:${taille}px"><img src="${AVATAR}" alt="${C.nomChaine || ''}"></div>`;
  }

  // --- Éclat BD (bulle d'explosion) : points d'un polygone en étoile ---
  function eclat(branches = 14, rExt = 100, rInt = 64) {
    const pts = [];
    for (let i = 0; i < branches * 2; i++) {
      const a = i / (branches * 2) * Math.PI * 2, r = i % 2 ? rInt : rExt * (i % 4 === 0 ? 1 : .88);
      pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  // --- Gribouillis de la photo de profil (trait blanc qui brille) ---
  const gribouillis = {
    exclamation: '<svg viewBox="0 0 60 60" class="gribouillis"><path d="M18 8 L22 36 M22 48 L22 50 M38 6 L40 34 M40 46 L40 48"/></svg>',
    eclair: '<svg viewBox="0 0 70 50" class="gribouillis"><path d="M6 30 L20 12 L18 32 L34 14 L30 36 L48 16 L44 38 L62 20"/></svg>',
    spirale: '<svg viewBox="0 0 60 60" class="gribouillis"><path d="M30 44 C14 44 12 22 28 18 C42 15 46 34 34 38 C26 40 24 30 30 28"/></svg>',
  };

  // --- Icônes en trait (stroke = couleur du texte) ---
  const trait = d => `<svg viewBox="0 0 32 32" class="icone">${d}</svg>`;
  const icones = {
    oeil: trait('<path d="M3 16 C8 8 24 8 29 16 C24 24 8 24 3 16 Z"/><circle cx="16" cy="16" r="4.5"/>'),
    coeur: trait('<path d="M16 27 C6 20 3 14 6 9 C9 5 14 6 16 10 C18 6 23 5 26 9 C29 14 26 20 16 27 Z"/>'),
    etoile: trait('<path d="M16 3 L19.5 12 L29 12.5 L21.5 18.5 L24 28 L16 22.5 L8 28 L10.5 18.5 L3 12.5 L12.5 12 Z"/>'),
    eclair: trait('<path d="M18 3 L7 18 H15 L13 29 L25 13 H17 Z"/>'),
    cadeau: trait('<rect x="5" y="12" width="22" height="16" rx="2"/><path d="M3 12 H29 M16 12 V28 M16 12 C12 4 6 8 10 12 M16 12 C20 4 26 8 22 12"/>'),
    fusee: trait('<path d="M16 3 C22 8 23 15 21 22 H11 C9 15 10 8 16 3 Z M11 16 L6 23 H11 M21 16 L26 23 H21 M14 22 L16 29 L18 22"/>'),
    piece: trait('<circle cx="16" cy="16" r="12"/><path d="M16 9 V23 M20 11.5 C18 10 12 10 12 13.5 C12 17 20 15 20 19 C20 22.5 14 22.5 12 21"/>'),
    trophee: trait('<path d="M10 4 H22 V13 C22 17 19 20 16 20 C13 20 10 17 10 13 Z M10 7 H5 C5 12 7 14 10 14 M22 7 H27 C27 12 25 14 22 14 M16 20 V25 M10 28 H22 L20 25 H12 Z"/>'),
    bulle: trait('<path d="M5 7 H27 V21 H14 L8 27 V21 H5 Z"/><path d="M10 13 H22 M10 17 H18"/>'),
    manette: trait('<path d="M9 10 H23 C27 10 29 14 29 19 C29 24 26 25 24 23 L21 20 H11 L8 23 C6 25 3 24 3 19 C3 14 5 10 9 10 Z"/><path d="M9 14 V18 M7 16 H11"/><circle cx="21" cy="15" r="1.3"/><circle cx="24" cy="17.5" r="1.3"/>'),
    calendrier: trait('<rect x="4" y="7" width="24" height="21" rx="3"/><path d="M4 13 H28 M10 4 V9 M22 4 V9"/><path d="M10 19 H12 M15 19 H17 M20 19 H22 M10 23 H12 M15 23 H17"/>'),
    regles: trait('<path d="M7 4 H22 L26 8 V28 H7 Z"/><path d="M11 12 H22 M11 17 H22 M11 22 H18"/>'),
    camera: trait('<rect x="3" y="9" width="19" height="14" rx="3"/><path d="M22 14 L29 10 V22 L22 18"/>'),
    groupe: trait('<circle cx="12" cy="11" r="4"/><circle cx="22" cy="12" r="3.2"/><path d="M4 26 C4 20 8 17 12 17 C16 17 20 20 20 26 M19 18 C23 17 28 19 28 25"/>'),
  };

  // --- Remplit les éléments data-icone="nom" et data-gribouillis="nom" ---
  function remplirIcones() {
    document.querySelectorAll('[data-icone]').forEach(el => (el.innerHTML = icones[el.dataset.icone] || ''));
    document.querySelectorAll('[data-gribouillis]').forEach(el => (el.innerHTML = gribouillis[el.dataset.gribouillis] || ''));
    document.querySelectorAll('[data-avatar]').forEach(el => (el.outerHTML = avatar(Number(el.dataset.avatar) || 200, el.className)));
  }

  function demarrer() {
    remplirTextes();
    remplirIcones();
    horloge();
    ajuster();
    addEventListener('resize', ajuster);
  }

  return { C, params, RACINE, AVATAR, lire, mmss, avatar, eclat, gribouillis, icones, demarrer };
})();
