/* =====================================================================
   PERSOS-STYLE — les personnages du catalogue commun (js/persos.js), dessinés au style de John Von Gurt.
   Formes communes : js/apparence.js (Apparence.calques). Ici, seulement la façon de les dessiner.
     PersosStyle.rendu(fiche, { expression, forme })  → <svg> (l'écusson rond, 200 × 240 ; le même pour les cartes JDR)
   Style choisi dans design/moodboard-persos.html (2026-10-14) : « ÉCUSSON DE MISSION ».
   ===================================================================== */
const PersosStyle = (() => {
  const T = Apparence.teinte;
  let n = 0;
  const attr = (c, fond, trait, ep) => `d="${c.d}" fill="${fond || 'none'}" ${trait ? `stroke="${trait}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"` : ''}`;
  const esc = t => String(t || '').replace(/[&<>"]/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]));
  function rendu(fiche, o = {}) {
    const id = 'ecusson' + (n++);
    const L = Apparence.calques(fiche, o);
    const nom = esc((fiche.nom || '').toUpperCase());
    return `<svg viewBox="0 0 200 240" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="${id}"><circle cx="100" cy="118" r="80"/></clipPath>
        <path id="${id}a" d="M28 118 A72 72 0 0 0 172 118"/></defs>
      <circle cx="100" cy="118" r="98" fill="#141920" stroke="#E6EAEE" stroke-width="5"/>
      <circle cx="100" cy="118" r="80" fill="#0B0E13" stroke="#FF9F1C" stroke-width="4"/>
      <g clip-path="url(#${id})"><g transform="translate(100 118) scale(.82) translate(-100 -112)">${L.map(c => `<path ${attr(c, c.fond, c.trait || (c.fond ? 'rgba(0,0,0,.35)' : null), c.trait ? c.epaisseur : 1.5)}/>`).join('')}</g></g>
      <text font-family="JetBrains Mono, monospace" font-weight="700" font-size="13" letter-spacing="3" fill="#E6EAEE" text-anchor="middle"><textPath href="#${id}a" startOffset="50%" dy="22">${nom}</textPath></text>
      <path d="M26 104 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z M174 104 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#FF9F1C" transform="translate(-3 0)"/></svg>`;
  }
  const nom = 'Écusson de mission';
  // (le moodboard design/moodboard-persos.html montre la direction gardée)
  return { nom, rendu, directions: { A: { nom, texte: 'Chaque personnage devient un écusson brodé, comme ceux des combinaisons d’astronaute : le buste en aplats dans un rond, son nom autour, l’anneau orange de la mission.', rendu } } };
})();
