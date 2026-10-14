/* =====================================================================
   PERSOS-STYLE — les personnages du catalogue commun (js/persos.js), dessinés au style de Mordethrhedan :
   « TRAIT NÉON » (choisi dans design/moodboard-persos.html, 2026-10-14) : le personnage en traits de néon sur le noir,
   chaque partie dans sa couleur, en lumière. Formes communes : js/apparence.js (Apparence.calques).
     PersosStyle.rendu(fiche, { expression, forme, cadrage })  → <svg>
       cadrage : '' (buste, 200 × 240) | 'tete' (recadré sur la tête, pour les cartes de la scène JDR)
   ===================================================================== */
const PersosStyle = (() => {
  const T = Apparence.teinte;
  let n = 0;
  const attr = (c, fond, trait, ep) => `d="${c.d}" fill="${fond || 'none'}" ${trait ? `stroke="${trait}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"` : ''}`;
  const CADRAGES = { '': '0 0 200 240', tete: '18 2 164 172' };
  function rendu(fiche, o = {}) {
    const id = 'neon' + (n++);
    const L = Apparence.calques(fiche, o);
    return `<svg viewBox="${CADRAGES[o.cadrage || ''] || CADRAGES['']}" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="f"/><feMerge><feMergeNode in="f"/><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g filter="url(#${id})">${L.map(c => {
        const lum = T(c.fond || c.trait, .35);
        if (c.partie === 'yeux' && c.fond) return `<path ${attr(c, c.id === 'blanc' ? '#0B0D0E' : lum, null)}/>`;
        return `<path ${attr(c, c.fond ? T(c.fond, -.82) : null, lum, c.trait ? Math.max(2.4, c.epaisseur * .8) : 2.6)}/>`;
      }).join('')}</g></svg>`;
  }
  const nom = 'Trait néon';
  // (le moodboard design/moodboard-persos.html montre la direction gardée)
  return { nom, rendu, directions: { A: { nom, texte: 'Le personnage dessiné en traits de néon sur le noir, comme une enseigne : chaque partie garde sa couleur (peau, cheveux, tenue), en lumière.', rendu } } };
})();
