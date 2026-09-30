/* =====================================================================
   Outils communs à tous les écrans.
   ===================================================================== */
const Commun = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);

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

  // --- Ajoute les 4 coins en équerre aux éléments .cadre ---
  function coins() {
    document.querySelectorAll('.cadre').forEach(el => {
      if (el.querySelector('.coin')) return;
      ['hg', 'hd', 'bg', 'bd'].forEach(c => {
        const i = document.createElement('i');
        i.className = 'coin ' + c;
        el.appendChild(i);
      });
    });
  }

  // --- Champ d'étoiles dans un <svg> ---
  function etoiles(svg, n, { l = 1920, h = 1080, x0 = 0, y0 = 0, taille = [0.8, 2.2] } = {}) {
    let html = '';
    for (let i = 0; i < n; i++) {
      const r = taille[0] + Math.random() * (taille[1] - taille[0]);
      html += `<circle class="etoile" cx="${(x0 + Math.random() * l).toFixed(1)}" cy="${(y0 + Math.random() * h).toFixed(1)}" r="${r.toFixed(2)}"
        style="--d:${(2 + Math.random() * 4).toFixed(2)}s;--r:${(-Math.random() * 5).toFixed(2)}s;opacity:${(0.35 + Math.random() * 0.65).toFixed(2)}"/>`;
    }
    svg.insertAdjacentHTML('beforeend', html);
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

  // --- Dessin de LA fusée (toujours la même), centré sur (0,0), du nez (y=-162) à la tuyère (y=138).
  // Ses jambes sont repliées ; ajouter la classe "jambes-sorties" à un parent pour les déployer.
  function fusee({ id = 'fusee', carburant = false, flamme = false } = {}) {
    const corps = 'M-30,-60 C-30,-112 -16,-142 0,-162 C16,-142 30,-112 30,-60 L30,110 L-30,110 Z';
    return `
    <g class="fusee" id="${id}">
      <defs>
        <pattern id="${id}-hach" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-50)">
          <rect width="3.5" height="8" fill="var(--trait)"/>
        </pattern>
        <clipPath id="${id}-clip"><path d="${corps}"/></clipPath>
      </defs>
      ${flamme ? `<g class="allumage" id="${id}-allumage"><g class="flamme" id="${id}-flamme"><path class="fl-ext" d="M-18,136 Q-10,200 0,250 Q10,200 18,136 Z"/><path class="fl-int" d="M-9,136 Q-4,175 0,200 Q4,175 9,136 Z"/></g></g>` : ''}
      <g class="jambes">
        <g transform="translate(-28,62)"><g class="jambe-int gauche"><path d="M0,0 L-42,88 M-56,88 H-28"/></g></g>
        <g transform="translate(28,62)"><g class="jambe-int droite"><path d="M0,0 L42,88 M56,88 H28"/></g></g>
      </g>
      <path class="aileron" d="M-30,28 L-66,94 L-66,128 L-30,108 Z"/>
      <path class="aileron" d="M30,28 L66,94 L66,128 L30,108 Z"/>
      <path class="tuyere" d="M-18,110 L-26,138 L26,138 L18,110 Z"/>
      <path class="coque" d="${corps}"/>
      ${carburant ? `
      <g clip-path="url(#${id}-clip)">
        <rect class="carburant" id="${id}-carb" x="-40" y="110" width="80" height="0"/>
        <line class="niveau" id="${id}-niveau" x1="-40" x2="40" y1="110" y2="110"/>
      </g>` : ''}
      <rect x="-30" y="74" width="60" height="18" fill="url(#${id}-hach)" clip-path="url(#${id}-clip)"/>
      <path class="contour" d="${corps}"/>
      <path class="ligne" d="M-30,-60 H30 M-30,20 H30 M-30,74 H30 M-30,92 H30 M0,-162 V-172"/>
      <circle class="hublot" cx="0" cy="-92" r="14"/>
      <circle class="hublot-int" cx="0" cy="-92" r="7"/>
      <path class="ligne" d="M-14,-30 V8 M14,-30 V8" opacity=".5"/>
    </g>`;
  }

  // --- Icônes en trait ---
  const icones = {
    fusee: `<svg viewBox="0 0 32 32" class="icone"><g transform="rotate(45 16 16)"><path d="M16 3 C21 7 22 13 21 21 H11 C10 13 11 7 16 3 Z"/><path d="M11 15 L7 22 L11 22 M21 15 L25 22 L21 22 M14 21 L16 28 L18 21"/><circle cx="16" cy="11" r="2.2"/></g></svg>`,
    pouls: `<svg viewBox="0 0 32 32" class="icone"><path d="M2 17 H10 L13 8 L18 25 L21 12 L23 17 H30"/></svg>`,
    energie: `<svg viewBox="0 0 32 32" class="icone"><path d="M16 4 V15"/><path d="M9.5 8.5 A10 10 0 1 0 22.5 8.5"/></svg>`,
    planete: `<svg viewBox="0 0 32 32" class="icone"><circle cx="16" cy="16" r="8"/><ellipse cx="16" cy="16" rx="15" ry="4.5" transform="rotate(-20 16 16)"/></svg>`,
    horloge: `<svg viewBox="0 0 32 32" class="icone"><circle cx="16" cy="16" r="12"/><path d="M16 9 V16 L21 19"/></svg>`,
    alerte: `<svg viewBox="0 0 32 32" class="icone"><path d="M16 4 L30 28 H2 Z"/><path d="M16 13 V20 M16 24 V24.5"/></svg>`,
    casque: `<svg viewBox="0 0 32 32" class="icone"><circle cx="16" cy="14" r="11"/><rect x="9" y="9" width="14" height="9" rx="4"/><path d="M8 24 L6 29 H26 L24 24"/></svg>`,
    coeur: `<svg viewBox="0 0 32 32" class="icone"><path d="M16 27 C6 20 3 14 6 9 C9 5 14 6 16 10 C18 6 23 5 26 9 C29 14 26 20 16 27 Z"/></svg>`,
    cible: `<svg viewBox="0 0 32 32" class="icone"><circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="7"/><circle cx="16" cy="16" r="2" fill="currentColor"/></svg>`,
    groupe: `<svg viewBox="0 0 32 32" class="icone"><circle cx="12" cy="11" r="4"/><circle cx="22" cy="12" r="3.2"/><path d="M4 26 C4 20 8 17 12 17 C16 17 20 20 20 26 M19 18 C23 17 28 19 28 25"/></svg>`,
    radar: `<svg viewBox="0 0 32 32" class="icone"><circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="6"/><path d="M16 16 L25 7"/><circle cx="22" cy="11" r="1.6" fill="currentColor"/></svg>`,
    carburant: `<svg viewBox="0 0 32 32" class="icone"><path d="M8 9 H20 L25 14 V28 H8 Z M11 5 H17 V9"/><path d="M12 17 L21 25 M21 17 L12 25"/></svg>`,
    camera: `<svg viewBox="0 0 32 32" class="icone"><rect x="3" y="9" width="19" height="14" rx="2"/><path d="M22 14 L29 10 V22 L22 18"/></svg>`,
    circuit: `<svg viewBox="0 0 120 24" class="icone" style="stroke-width:2"><circle cx="4" cy="20" r="3" fill="currentColor"/><path d="M4 20 H40 L56 4 H112"/><circle cx="114" cy="4" r="3" fill="currentColor"/></svg>`,
  };

  // --- Remplit les éléments data-icone="nom" ---
  function remplirIcones() {
    document.querySelectorAll('[data-icone]').forEach(el => (el.innerHTML = icones[el.dataset.icone] || ''));
  }

  function demarrer() {
    const theme = params.get('theme');
    if (theme) document.documentElement.dataset.theme = theme;
    remplirTextes();
    remplirIcones();
    coins();
    horloge();
    ajuster();
    addEventListener('resize', ajuster);
  }

  return { C, params, lire, etoiles, mmss, fusee, icones, demarrer };
})();
