/* =====================================================================
   LE DRAGON — l'adversaire du bouffon (palier 3 des Grelots).
   Flat, vu de profil, tourné vers la gauche. Dragon.svg() renvoie le dessin.
   Parties animables (css/bouffon.css, section « Dragon ») :
     .dr-aile / .dr-aile-arriere (battent), .dr-tete (dodeline),
     .dr-machoire (s'ouvre), .dr-feu (les flammes), .dr-corps (tout le dragon).
   Couleurs : variables --dragon-* (valeurs par défaut ci-dessous).
   ===================================================================== */
const Dragon = (() => {
  const C = { corps: 'var(--dragon-corps, #2F6B4F)', fonce: 'var(--dragon-fonce, #1F4D39)', clair: 'var(--dragon-clair, #4C9A70)',
    ventre: 'var(--dragon-ventre, #E9C46A)', corne: '#EFE6CE', oeil: '#F5D547' };
  const DESSIN = `<svg class="dragon-svg" viewBox="20 0 650 380" style="overflow:visible" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dragon">
  <g class="dr-corps">
    <!-- aile du fond -->
    <g class="dr-aile-arriere"><path fill="${C.fonce}" d="M352 176 L452 26 L494 78 L548 46 L566 132 L496 160 Z"/>
      <path d="M452 26 L466 150 M548 46 L512 152" stroke="${C.corps}" stroke-width="7" stroke-linecap="round"/></g>
    <!-- queue -->
    <path fill="${C.corps}" d="M450 238 C520 250 560 300 600 270 C620 256 628 232 640 222 L636 252 C626 300 560 328 500 302 C470 290 452 276 440 262 Z"/>
    <path fill="${C.fonce}" d="M628 206 L660 222 L632 250 L640 226 Z"/>
    <!-- pattes arrière et avant -->
    <path fill="${C.fonce}" d="M410 290 L430 360 L470 364 L462 350 L444 346 L440 286 Z"/>
    <path fill="${C.fonce}" d="M262 292 L246 360 L206 364 L214 350 L232 346 L236 286 Z"/>
    <!-- corps -->
    <path fill="${C.corps}" d="M196 214 C230 160 410 148 476 222 C506 262 478 314 404 318 C300 328 220 304 198 262 Z"/>
    <path fill="${C.ventre}" d="M214 252 C262 304 386 314 444 292 C384 304 268 294 226 240 Z"/>
    <path d="M250 268 L262 300 M290 276 L298 306 M330 280 L334 310 M370 280 L372 308" stroke="${C.fonce}" stroke-width="4" stroke-linecap="round" opacity=".35"/>
    <!-- crête du dos -->
    <path fill="${C.fonce}" d="M250 176 L266 150 L278 174 Z M296 166 L314 138 L326 164 Z M346 164 L364 136 L376 164 Z M398 172 L416 146 L426 176 Z"/>
    <!-- cou -->
    <path fill="${C.corps}" d="M232 222 C206 186 176 164 150 152 L134 178 C160 192 190 216 206 248 Z"/>
    <!-- tête (pivot au bout du cou) -->
    <g class="dr-tete">
      <g class="dr-feu"><path fill="#F0782E" d="M52 164 C-60 120 -250 110 -410 150 C-250 190 -60 200 52 176 Z"/>
        <path fill="var(--accent, #F5B82E)" d="M52 166 C-40 140 -190 136 -320 156 C-190 176 -40 184 52 174 Z"/>
        <path fill="#FFF3DC" d="M52 168 C-20 156 -110 154 -200 160 C-110 168 -20 172 52 172 Z"/></g>
      <g class="dr-machoire"><path fill="${C.fonce}" d="M58 166 C82 180 122 182 152 172 L150 184 C120 198 80 194 50 174 Z"/>
        <path fill="#fff" d="M70 172 L74 162 L80 174 Z M94 176 L98 166 L104 178 Z"/></g>
      <path fill="${C.corps}" d="M154 128 C134 106 92 104 60 122 L36 138 C52 150 80 156 102 158 L58 166 C82 176 122 178 154 170 C168 160 166 140 154 128 Z"/>
      <path fill="${C.corne}" d="M136 116 L172 70 L152 122 Z M118 112 L136 76 L130 116 Z"/>
      <path fill="#fff" d="M50 146 L54 136 L60 148 Z M78 150 L82 140 L88 152 Z"/>
      <ellipse cx="114" cy="130" rx="11" ry="9" fill="${C.oeil}"/><ellipse cx="112" cy="130" rx="3" ry="7.5" fill="#111"/>
      <path d="M98 118 L128 122" stroke="${C.fonce}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="48" cy="134" r="3" fill="${C.fonce}"/>
    </g>
    <!-- aile de devant -->
    <g class="dr-aile"><path fill="${C.clair}" d="M300 182 L360 8 L414 64 L462 26 L490 116 L424 166 Z"/>
      <path d="M360 8 L366 170 M462 26 L430 162" stroke="${C.corps}" stroke-width="7" stroke-linecap="round"/></g>
  </g>
</svg>`;
  return { svg: () => DESSIN };
})();
