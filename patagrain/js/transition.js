/* =====================================================================
   TRANSITIONS — choix du mode et pilotage pour l'export vidéo.
   ?mode=entree (défaut) : la page démarre écran couvert, puis se dévoile
                           (à mettre en haut de chaque scène).
   ?mode=complet         : animation entière (couvre puis dévoile) pour
                           fabriquer une vidéo Stinger.
   ?capture=1            : animations figées, pilotées image par image par
                           le script outils/generer-transitions.mjs
   Chaque page déclare son point de coupe : <div id="ecran" data-coupe="700">
   ===================================================================== */
(() => {
  Commun.demarrer();
  const p = Commun.params;
  const ecran = document.getElementById('ecran');
  const coupe = Number(ecran.dataset.coupe || 0);
  // En mode « entrée », on saute directement au moment où l'écran est couvert
  if (p.get('mode') !== 'complet') ecran.style.setProperty('--decalage', -coupe + 'ms');

  if (p.has('capture')) {
    window.dureeTransition = () => Math.max(...document.getAnimations().map(a => {
      const t = a.effect.getComputedTiming();
      return t.iterations === Infinity ? 0 : t.endTime;
    }));
    window.pointTransition = () => coupe;
    window.allerA = ms => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }); };
    window.allerA(0);
  }
})();
