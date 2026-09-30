/* =====================================================================
   TRANSITIONS — choix du mode et pilotage pour l'export vidéo.
   ?mode=entree (défaut) ou ?mode=complet
   ?capture=1 : animations figées, pilotées image par image par le script
                outils/generer-transitions.mjs
   ===================================================================== */
(() => {
  Commun.demarrer();
  const p = Commun.params;
  const ecran = document.getElementById('ecran');
  ecran.classList.add(p.get('mode') === 'complet' ? 'complet' : 'entree');

  if (p.has('capture')) {
    const anims = () => document.getAnimations();
    // Durée totale = la plus longue animation non infinie
    window.dureeTransition = () => Math.max(...document.getAnimations().map(a => {
      const t = a.effect.getComputedTiming();
      return t.iterations === Infinity ? 0 : t.endTime;
    }));
    window.allerA = ms => { anims().forEach(a => { a.pause(); a.currentTime = ms; }); };
    window.allerA(0);
  }
})();
