/* =====================================================================
   TRANSITIONS — choix du mode et pilotage pour l'export vidéo.
   ?mode=entree (défaut) : la page démarre couverte puis se dévoile
                           (à mettre en haut de chaque scène)
   ?mode=complet         : couvre puis dévoile (pour la vidéo Stinger)
   ?capture=1            : animations figées, pilotées image par image par
                           outils/generer-transitions.mjs
   ===================================================================== */
(() => {
  Commun.demarrer();
  const p = Commun.params;
  const ecran = document.getElementById('ecran');
  ecran.querySelectorAll('.panneau-fond').forEach(el => { el.innerHTML = fondNeon({ graine: parseInt(p.get('graine') ?? (Commun.C.fond || {}).graine ?? 7, 10) }); });
  ecran.classList.add(p.get('mode') === 'complet' ? 'complet' : 'entree');

  if (p.has('capture')) {
    window.dureeTransition = () => Math.max(...document.getAnimations().map(a => {
      const t = a.effect.getComputedTiming();
      return t.iterations === Infinity ? 0 : t.endTime;
    }));
    window.allerA = ms => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; });
    window.allerA(0);
  }
})();
