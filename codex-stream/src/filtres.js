/* =====================================================================
   FILTRES — les façons de dessiner un personnage (sa fiche d'apparence, voir apparence.js).
   Les mêmes traits partout : « cheveux longs blonds » est UN trait, que chaque filtre dessine à sa façon.
     Filtres.liste                       → [{ id, nom, texte }]
     Filtres.rendu(id, fiche, options)   → <svg>
       options : { expression: '' | 'parle' | 'rire' | 'choc' | 'ko', forme, cadrage: 'buste' | 'tete', accent: '#…' }
   Venus des overlays de la famille : Néon (Mordethrhedan), Sticker (Ambries), Écusson (John Von Gurt),
   Vitrail (les facettes de cristal), Aplat (le dessin de base). Conte (Patagrain) viendra plus tard.
   ===================================================================== */
const Filtres = (() => {
  const T = Apparence.teinte;
  let n = 0;
  const ENCRE = '#140A24';
  const CADRAGES = { buste: '0 0 200 240', tete: '18 2 164 172' };
  const vb = o => CADRAGES[o.cadrage] || CADRAGES.buste;
  const esc = t => String(t || '').replace(/[&<>"]/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]));
  const attr = (c, fond, trait, ep) => `d="${c.d}" fill="${fond || 'none'}" ${trait ? `stroke="${trait}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"` : ''}`;
  const svg = (o, contenu) => `<svg viewBox="${vb(o)}" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">${contenu}</svg>`;

  const FILTRES = {
    aplat: {
      nom: 'Aplat', texte: 'Des aplats de couleur simples, avec un contour doux.',
      rendu: (f, o) => svg(o, Apparence.calques(f, o).map(c => `<path ${attr(c, c.fond, c.trait, c.epaisseur)}/>`).join('')),
    },
    neon: {
      nom: 'Néon', texte: 'Le personnage en traits de néon sur le noir, comme une enseigne : chaque partie garde sa couleur, en lumière.',
      rendu(f, o) {
        const id = 'cs-neon' + (n++);
        return svg(o, `<defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="f"/><feMerge><feMergeNode in="f"/><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          <g filter="url(#${id})">${Apparence.calques(f, o).map(c => {
            const lum = T(c.fond || c.trait, .35);
            if (c.partie === 'yeux' && c.fond) return `<path ${attr(c, c.id === 'blanc' ? '#0B0D0E' : lum, null)}/>`;
            return `<path ${attr(c, c.fond ? T(c.fond, -.82) : null, lum, c.trait ? Math.max(2.4, c.epaisseur * .8) : 2.6)}/>`;
          }).join('')}</g>`);
      },
    },
    sticker: {
      nom: 'Sticker', texte: 'En autocollant découpé : contour noir, grosse bordure blanche, ombre portée, légère inclinaison.',
      rendu(f, o) {
        const tout = Apparence.calques(f, o), pleins = tout.filter(c => c.fond);
        const rot = ((String(f.id || f.nom || '').length % 5) - 2) * 2;
        const plein = c => `<path d="${c.d}" fill="${c.fond || 'none'}" stroke="${c.trait || ENCRE}" stroke-width="${c.trait ? c.epaisseur + 1 : 4}" stroke-linecap="round" stroke-linejoin="round" paint-order="stroke fill"/>`;
        return svg(o, `<g transform="rotate(${rot} 100 120)">
          <g transform="translate(6 6)">${pleins.map(c => `<path d="${c.d}" fill="${ENCRE}" stroke="${ENCRE}" stroke-width="18" stroke-linejoin="round"/>`).join('')}</g>
          ${pleins.map(c => `<path d="${c.d}" fill="#fff" stroke="#fff" stroke-width="18" stroke-linejoin="round"/>`).join('')}
          ${tout.map(plein).join('')}</g>`);
      },
    },
    ecusson: {
      nom: 'Écusson', texte: 'Un écusson brodé, comme ceux des combinaisons d’astronaute : le buste dans un rond, le nom autour.',
      rendu(f, o) {
        const id = 'cs-ecusson' + (n++), accent = o.accent || '#FF9F1C';
        const L = Apparence.calques(f, o);
        return `<svg viewBox="0 0 200 240" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">
          <defs><clipPath id="${id}"><circle cx="100" cy="118" r="80"/></clipPath><path id="${id}a" d="M28 118 A72 72 0 0 0 172 118"/></defs>
          <circle cx="100" cy="118" r="98" fill="#141920" stroke="#E6EAEE" stroke-width="5"/>
          <circle cx="100" cy="118" r="80" fill="#0B0E13" stroke="${accent}" stroke-width="4"/>
          <g clip-path="url(#${id})"><g transform="translate(100 118) scale(.82) translate(-100 -112)">${L.map(c => `<path ${attr(c, c.fond, c.trait || (c.fond ? 'rgba(0,0,0,.35)' : null), c.trait ? c.epaisseur : 1.5)}/>`).join('')}</g></g>
          <text font-family="monospace" font-weight="700" font-size="13" letter-spacing="3" fill="#E6EAEE" text-anchor="middle"><textPath href="#${id}a" startOffset="50%">${esc((f.nom || '').toUpperCase())}</textPath></text>
          <path d="M26 104 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z M174 104 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="${accent}" transform="translate(-3 0)"/></svg>`;
      },
    },
    vitrail: {
      nom: 'Vitrail', texte: 'Des aplats taillés en facettes, comme du verre ou du cristal, avec un liseré de lumière sur les épaules.',
      rendu(f, o) {
        const id = 'cs-vitrail' + (n++), accent = o.accent || '#1EE88A';
        const tri = [];
        for (let y = 0; y < 240; y += 26) for (let x = -13 * ((y / 26) % 2); x < 200; x += 26) {
          const k = Math.abs(Math.sin(x * 12.9 + y * 78.2)) % 1;
          tri.push(`<path d="M${x} ${y}L${x + 26} ${y}L${x + 13} ${y + 26}Z" fill="#fff" fill-opacity="${(k * .22).toFixed(2)}"/><path d="M${x + 13} ${y + 26}L${x + 26} ${y}L${x + 39} ${y + 26}Z" fill="#000" fill-opacity="${((1 - k) * .18).toFixed(2)}"/>`);
        }
        const grandes = new Set(['visage', 'cheveux', 'cheveux-dos', 'epaules', 'accessoire-dos', 'accessoire']);
        const L = Apparence.calques(f, o);
        return svg(o, `<defs><pattern id="${id}" width="200" height="240" patternUnits="userSpaceOnUse">${tri.join('')}</pattern>
            <filter id="${id}h"><feGaussianBlur stdDeviation="1.6" result="f"/><feMerge><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          ${L.map(c => `<path ${attr(c, c.fond, c.trait, c.epaisseur)}/>` + (grandes.has(c.id) && c.fond ? `<path d="${c.d}" fill="url(#${id})"/>` : '')).join('')}
          <g filter="url(#${id}h)">${L.filter(c => c.id === 'epaules').map(c => `<path d="${c.d}" fill="none" stroke="${accent}" stroke-width="2.4"/>`).join('')}</g>`);
      },
    },
  };

  return {
    liste: Object.entries(FILTRES).map(([id, f]) => ({ id, nom: f.nom, texte: f.texte })),
    existe: id => !!FILTRES[id],
    rendu: (id, fiche, o = {}) => (FILTRES[id] || FILTRES.aplat).rendu(fiche, o),
  };
})();
