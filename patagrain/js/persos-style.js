/* =====================================================================
   PERSOS-STYLE — les personnages du catalogue commun (js/persos.js), dessinés au style de Patagrain.
   Formes communes : js/apparence.js (Apparence.calques). Ici, seulement la façon de les dessiner.
     PersosStyle.rendu(fiche, { expression, forme, cadrage })  → <svg> ; cadrage : '' (buste 200 × 240) | 'tete' (cartes JDR)
   Style « CONTE » PROVISOIRE : aplats de livre d'images, contour bleu nuit épais et liseré doré. Le vrai filtre Conte
   viendra avec la boîte à outils codex-stream. La scène JDR de Patagrain garde ses héros dessinés (js/heros.js) :
   ce fichier sert au créateur de personnage (createur.html).
   ===================================================================== */
const PersosStyle = (() => {
  const ENCRE = '#152238', OR = '#F5B82E';
  const CADRAGES = { '': '0 0 200 240', tete: '12 -4 176 186' };
  function rendu(fiche, o = {}) {
    const tout = Apparence.calques(fiche, o), pleins = tout.filter(c => c.fond);
    return `<svg viewBox="${CADRAGES[o.cadrage || ''] || CADRAGES['']}" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">
      ${pleins.map(c => `<path d="${c.d}" fill="${OR}" stroke="${OR}" stroke-width="16" stroke-linejoin="round"/>`).join('')}
      ${pleins.map(c => `<path d="${c.d}" fill="${ENCRE}" stroke="${ENCRE}" stroke-width="10" stroke-linejoin="round"/>`).join('')}
      ${tout.map(c => `<path d="${c.d}" fill="${c.fond || 'none'}" stroke="${c.trait || ENCRE}" stroke-width="${c.trait ? c.epaisseur : 3}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`;
  }
  const nom = 'Conte (provisoire)';
  return { nom, rendu, directions: { A: { nom, texte: 'Le personnage comme dans un livre de contes : aplats de couleur, contour bleu nuit et liseré doré, aux couleurs de Patagrain.', rendu } } };
})();
