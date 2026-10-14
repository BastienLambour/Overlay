/* =====================================================================
   PERSOS-STYLE — les personnages du catalogue commun (js/persos.js), dessinés au style d'Ambries.
   Formes communes : js/apparence.js (Apparence.calques). Ici, seulement la façon de les dessiner.
     PersosStyle.rendu(fiche, { expression, forme, cadrage })  → <svg> ; cadrage : '' (buste 200 × 240) | 'tete' (cartes JDR)
   Style choisi dans design/moodboard-persos.html (2026-10-14) : « STICKER ».
   ===================================================================== */
const PersosStyle = (() => {
  const ENCRE = '#140A24';
  const CADRAGES = { '': '0 0 200 240', tete: '12 -4 176 186' };
  const plein = (c, ep = 5) => `<path d="${c.d}" fill="${c.fond || 'none'}" stroke="${c.trait || ENCRE}" stroke-width="${c.trait ? c.epaisseur + 1 : ep}" stroke-linecap="round" stroke-linejoin="round" paint-order="stroke fill"/>`;
  function rendu(fiche, o = {}) {
    const L = Apparence.calques(fiche, o).filter(c => c.fond);
    const tout = Apparence.calques(fiche, o);
    const rot = ((String(fiche.id || '').length % 5) - 2) * 2;
    return `<svg viewBox="${CADRAGES[o.cadrage || ''] || CADRAGES['']}" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(${rot} 100 120)">
        <g transform="translate(6 6)">${L.map(c => `<path d="${c.d}" fill="${ENCRE}" stroke="${ENCRE}" stroke-width="18" stroke-linejoin="round"/>`).join('')}</g>
        ${L.map(c => `<path d="${c.d}" fill="#fff" stroke="#fff" stroke-width="18" stroke-linejoin="round"/>`).join('')}
        ${tout.map(c => plein(c, 4)).join('')}</g></svg>`;
  }
  const nom = 'Sticker';
  // (le moodboard design/moodboard-persos.html montre la direction gardée)
  return { nom, rendu, directions: { B: { nom, texte: 'Le personnage en autocollant découpé : contour noir, grosse bordure blanche, ombre portée et légère inclinaison, comme les stickers de l’overlay.', rendu } } };
})();
