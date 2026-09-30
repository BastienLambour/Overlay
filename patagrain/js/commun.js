/* =====================================================================
   PATAGRAIN — Outils communs à toutes les pages.
   ===================================================================== */
const Commun = (() => {
  const C = window.CONFIG || {};
  const params = new URLSearchParams(location.search);

  // --- Mise à l'échelle : l'écran fait 1920×1080 et s'adapte à la source (1440p…) ---
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

  // --- Remplace {cle} par la valeur trouvée dans « valeurs » (ou dans la config) ---
  function remplir(texte, valeurs = C) {
    return String(texte ?? '').replace(/\{(\w+)\}/g, (_, k) => valeurs[k] ?? '');
  }

  // --- Remplit les éléments data-texte="chemin.dans.config" (une option d'URL du même nom a priorité) ---
  function remplirTextes() {
    document.querySelectorAll('[data-texte]').forEach(el => {
      const cle = el.dataset.texte;
      const v = params.get(cle.split('.').pop()) ?? lire(cle);
      if (v != null) el.textContent = remplir(v);
    });
  }

  // --- Icônes : dés, grelot, bouclier, parchemin (couleurs = variables du thème) ---
  const SPRITE = `<svg id="sprite-patagrain" xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs> <symbol id="i-grelot" viewBox="0 0 60 70"> <rect x="24" y="2" width="12" height="12" rx="6" fill="none" stroke="var(--accent)" stroke-width="4"/> <circle cx="30" cy="40" r="26" fill="var(--accent)"/> <path d="M8 36 H52" stroke="color-mix(in srgb, var(--accent) 60%, #000)" stroke-width="4"/> <circle cx="30" cy="52" r="5" fill="color-mix(in srgb, var(--accent) 50%, #000)"/> <path d="M30 52 V64" stroke="color-mix(in srgb, var(--accent) 50%, #000)" stroke-width="4" stroke-linecap="round"/> <circle cx="21" cy="26" r="5" fill="#fff" opacity=".5"/> </symbol> <symbol id="i-d20" viewBox="0 0 100 100"> <g stroke-width=".4" stroke-linejoin="round"> <polygon points="50,2 7,25.8 50,19" fill="color-mix(in srgb, var(--primaire) 65%, #fff)" stroke="color-mix(in srgb, var(--primaire) 65%, #fff)"/> <polygon points="50,2 50,19 93,25.8" fill="color-mix(in srgb, var(--primaire) 65%, #fff)" stroke="color-mix(in srgb, var(--primaire) 65%, #fff)"/> <polygon points="7,25.8 16.5,77 50,19" fill="var(--primaire)" stroke="var(--primaire)"/> <polygon points="93,25.8 50,19 83.5,77" fill="var(--primaire)" stroke="var(--primaire)"/> <polygon points="7,25.8 7,74.2 16.5,77" fill="color-mix(in srgb, var(--primaire) 60%, var(--primaire-fonce))" stroke="color-mix(in srgb, var(--primaire) 60%, var(--primaire-fonce))"/> <polygon points="93,25.8 83.5,77 93,74.2" fill="color-mix(in srgb, var(--primaire) 60%, var(--primaire-fonce))" stroke="color-mix(in srgb, var(--primaire) 60%, var(--primaire-fonce))"/> <polygon points="7,74.2 50,98 16.5,77" fill="var(--primaire-fonce)" stroke="var(--primaire-fonce)"/> <polygon points="93,74.2 83.5,77 50,98" fill="var(--primaire-fonce)" stroke="var(--primaire-fonce)"/> <polygon points="16.5,77 50,98 83.5,77" fill="var(--primaire-fonce)" stroke="var(--primaire-fonce)"/> <polygon points="50,19 16.5,77 83.5,77" fill="var(--accent)" stroke="var(--accent)"/> </g> <text x="50" y="65" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="21" fill="#1B3A66">20</text> </symbol> <symbol id="i-d6" viewBox="0 0 100 100"> <polygon points="50,6 92,28 50,50 8,28" fill="var(--texte)"/> <polygon points="8,28 50,50 50,96 8,72" fill="var(--accent)"/> <polygon points="92,28 50,50 50,96 92,72" fill="color-mix(in srgb, var(--accent) 70%, #000)"/> <ellipse cx="50" cy="28" rx="7" ry="4.5" fill="var(--accent-2)"/> <circle cx="20" cy="46" r="4.5" fill="var(--fond)"/><circle cx="38" cy="78" r="4.5" fill="var(--fond)"/> <circle cx="62" cy="52" r="4.5" fill="var(--fond)"/><circle cx="71" cy="67" r="4.5" fill="var(--fond)"/><circle cx="80" cy="82" r="4.5" fill="var(--fond)"/> </symbol> <symbol id="i-d8" viewBox="0 0 100 100"> <polygon points="50,4 90,50 50,96 10,50" fill="var(--accent-2)"/> <polygon points="50,4 90,50 50,62" fill="color-mix(in srgb, var(--accent-2) 70%, #000)"/> <polygon points="50,4 50,62 10,50" fill="color-mix(in srgb, var(--accent-2) 80%, #fff)"/> <path d="M10 50 L50 62 L90 50 M50 62 L50 96" stroke="var(--fond)" stroke-width="2.5" fill="none"/> <text x="50" y="46" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="18" fill="#fff">8</text> </symbol> <symbol id="i-d4" viewBox="0 0 100 100"> <polygon points="50,6 94,90 6,90" fill="var(--primaire-fonce)"/> <polygon points="50,6 94,90 58,90" fill="var(--primaire)"/> <text x="44" y="74" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="22" fill="var(--accent)">4</text> </symbol> <symbol id="i-bouclier" viewBox="0 0 90 100"> <path d="M45 4 L84 16 C84 58 70 82 45 96 C20 82 6 58 6 16 Z" fill="var(--primaire)"/> <path d="M45 4 L84 16 C84 58 70 82 45 96 Z" fill="var(--primaire-fonce)"/> <path d="M45 30 L52 44 L67 45 L55 55 L59 70 L45 61 L31 70 L35 55 L23 45 L38 44 Z" fill="var(--accent)"/> </symbol> <symbol id="i-parchemin" viewBox="0 0 100 80"> <rect x="14" y="12" width="72" height="56" fill="var(--texte)" opacity=".92"/> <rect x="6" y="6" width="88" height="12" rx="6" fill="var(--accent)"/> <rect x="6" y="62" width="88" height="12" rx="6" fill="var(--accent)"/> <path d="M26 30 H74 M26 40 H66 M26 50 H70" stroke="var(--primaire)" stroke-width="4" stroke-linecap="round"/> </symbol> </defs></svg>`;
  function injecterIcones() {
    if (!document.getElementById('sprite-patagrain')) document.body.insertAdjacentHTML('afterbegin', SPRITE);
  }
  const icone = (nom, vb = '0 0 100 100') => `<svg viewBox="${vb}"><use href="#i-${nom}"/></svg>`;
  const VB = { grelot: '0 0 60 70', bouclier: '0 0 90 100', parchemin: '0 0 100 80' };
  const ico = nom => ({ chapeau: '<img src="../assets/chapeau.svg" alt="">', epee: '<img src="../assets/epee.svg" alt="">',
    embleme: '<img src="../assets/embleme-bleu.svg" alt="">' }[nom] || icone(nom, VB[nom]));

  // --- Fanions ---
  function fanions(el, n = 17) {
    el.innerHTML = Array.from({ length: n }, (_, i) => `<div class="fanion" style="--i:${i}"></div>`).join('');
  }

  // --- Dés et symboles qui flottent discrètement en fond ---
  function decor(el, n = 14) {
    const noms = ['d20', 'd6', 'd8', 'd4', 'grelot', 'd20', 'bouclier'];
    const alea = (i, k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1; // pseudo-aléatoire stable
    el.innerHTML = Array.from({ length: n }, (_, i) => {
      const x = (i % 7) * 14 + alea(i, 1) * 8, y = Math.floor(i / 7) * 50 + 8 + alea(i, 2) * 30;
      const style = `left:${x}%;top:${y}%;--taille:${70 + alea(i, 3) * 70}px;--duree:${14 + alea(i, 4) * 10}s;` +
        `--retard:${-alea(i, 5) * 20}s;--dx:${(alea(i, 6) - .5) * 80}px;--dy:${(alea(i, 7) - .5) * 80}px;--rot:${(alea(i, 8) - .5) * 90}deg`;
      const nom = noms[i % noms.length];
      return `<svg style="${style}" viewBox="${VB[nom] || '0 0 100 100'}"><use href="#i-${nom}"/></svg>`;
    }).join('');
  }

  // --- Messages qui se succèdent dans un élément ---
  function messages(el, liste = C.messages || [], duree = C.dureeMessage || 7) {
    const textes = liste.map(t => remplir(t));
    let i = 0;
    el.textContent = textes[0] || '';
    if (textes.length < 2) return;
    setInterval(() => {
      el.classList.add('sortie');
      setTimeout(() => { i = (i + 1) % textes.length; el.textContent = textes[i]; el.classList.remove('sortie'); }, 600);
    }, duree * 1000);
  }

  // --- Compte à rebours : heure fixe "20:30" (prioritaire) ou durée en minutes ---
  function compteARebours(el, { heure, minutes }, fini) {
    let cible;
    if (heure) {
      const [h, m] = String(heure).split(':').map(Number);
      cible = new Date(); cible.setHours(h, m || 0, 0, 0);
    } else {
      cible = new Date(Date.now() + Number(minutes) * 60000);
    }
    const deux = n => String(n).padStart(2, '0');
    (function tic() {
      const reste = Math.max(0, Math.round((cible - Date.now()) / 1000));
      if (reste === 0) return fini && fini();
      const h = Math.floor(reste / 3600), m = Math.floor(reste % 3600 / 60), s = reste % 60;
      el.textContent = (h ? h + ':' + deux(m) : deux(m)) + ':' + deux(s);
      setTimeout(tic, 1000 - Date.now() % 1000);
    })();
  }

  function demarrer() {
    injecterIcones();
    remplirTextes();
    ajuster();
    addEventListener('resize', ajuster);
  }

  // Les icônes doivent exister avant que les composants ne soient construits
  if (document.body) injecterIcones(); else addEventListener('DOMContentLoaded', injecterIcones);

  return { C, params, lire, remplir, ico, fanions, decor, messages, compteARebours, demarrer };
})();
