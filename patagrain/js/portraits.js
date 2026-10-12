/* =====================================================================
   PORTRAITS JDR — les personnages de la scène JDR (moodboard pour l'instant).
   Un portrait part d'une ILLUSTRATION du streamer (illustrateur ou IA), cadrée sur le visage :
   point focal (fx, fy, en fraction de l'image) et zoom.
   Avec une 2ᵉ image « bouche ouverte » (même cadrage), les deux alternent quand il parle
   (la technique des « PNGtubers »). Les bustes détourés (fond transparent) se font avec
   outils/detourer.mjs.
   Portraits.illustration(boite, src, { f, z, parle }) remplit la boîte du portrait ;
   la classe « parle » sur un parent l'anime (styles dans la page).
   ===================================================================== */
const Portraits = (() => {
  function illustration(boite, src, { f = [.5, .3], z = 3, parle = '' } = {}) {
    // un calque de la taille de l'image, cadré dans la boîte (l'image, et sa version bouche ouverte)
    const calque = document.createElement('div');
    calque.className = 'pt-calque';
    const img = new Image();
    img.src = src; img.alt = '';
    calque.appendChild(img);
    if (parle) {
      const ouverte = new Image();
      ouverte.src = parle; ouverte.alt = ''; ouverte.className = 'pt-parle';
      calque.appendChild(ouverte);
    }
    boite.appendChild(calque);
    const placer = () => {
      if (!img.naturalWidth) return;
      const L = boite.clientWidth, H = boite.clientHeight, lg = L * z, ht = lg * img.naturalHeight / img.naturalWidth;
      Object.assign(calque.style, { width: lg + 'px', height: ht + 'px', left: (L / 2 - f[0] * lg) + 'px', top: (H / 2 - f[1] * ht) + 'px' });
    };
    img.complete ? placer() : img.addEventListener('load', placer);
    new ResizeObserver(placer).observe(boite);
    return calque;
  }

  return { illustration };
})();
