/* =====================================================================
   Outils communs : couleur d'accent, halo, mise à l'échelle 1920×1080.
   ===================================================================== */
const Commun = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);

  const couleurs = {
    vert:   '#1EE88A',
    rouge:  '#FF3B4E',
    bleu:   '#3AA0FF',
    violet: '#A45BFF',
    orange: '#FF8A2A',
    cyan:   '#22E5E5',
    jaune:  '#FFD400',
    rose:   '#FF4FB8',
  };

  function rgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = [...hex].map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // Accepte un nom ("rouge"), "#FF3B4E" ou "FF3B4E"
  function resoudre(c) {
    if (!c) return couleurs.vert;
    if (couleurs[c]) return couleurs[c];
    if (/^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(c)) return c.startsWith('#') ? c : '#' + c;
    return couleurs.vert;
  }

  // Pose --accent et ses dérivées (sans color-mix, pour les anciennes versions d'OBS)
  function appliquerCouleur(c) {
    const hex = resoudre(c);
    const [r, g, b] = rgb(hex);
    const s = document.documentElement.style;
    s.setProperty('--accent', hex);
    s.setProperty('--accent-fonce', `rgb(${r * .36 | 0}, ${g * .36 | 0}, ${b * .36 | 0})`);
    s.setProperty('--accent-halo', `rgba(${r}, ${g}, ${b}, .55)`);
    s.setProperty('--accent-doux', `rgba(${r}, ${g}, ${b}, .18)`);
    return hex;
  }

  function ajuster() {
    const ecran = document.getElementById('ecran');
    if (!ecran) return;
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    ecran.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px, ${(innerHeight - 1080 * s) / 2}px) scale(${s})`;
  }

  // Lit une valeur de config par chemin, ex. "pause.titre"
  const lire = chemin => chemin.split('.').reduce((o, k) => (o == null ? o : o[k]), C);

  // Remplit les éléments data-texte="chemin.dans.config" (accepte <br>)
  function remplirTextes() {
    document.querySelectorAll('[data-texte]').forEach(el => {
      const v = lire(el.dataset.texte);
      if (v != null) el.innerHTML = v;
    });
  }

  const mmss = s => {
    s = Math.max(0, Math.round(s));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };

  function demarrer() {
    appliquerCouleur(params.get('couleur') || C.couleur);
    document.documentElement.dataset.halo = params.get('halo') || C.halo || 'leger';
    if (params.has('fixe') || (C.fond || {}).animation === false) document.documentElement.classList.add('fond-fixe');
    remplirTextes();
    ajuster();
    addEventListener('resize', ajuster);
  }

  return { C, params, couleurs, rgb, resoudre, appliquerCouleur, lire, mmss, demarrer };
})();
