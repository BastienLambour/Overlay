/* =====================================================================
   TRANSITIONS — choix du mode et pilotage pour l'export vidéo.
   ?mode=entree (défaut) ou ?mode=complet
   ?capture=1 : animations figées, pilotées image par image par le script
                outils/generer-transitions.mjs
   En mode « entrée », la transition se rejoue toute seule à chaque fois que
   la scène passe à l'antenne (plus besoin de « Actualiser le navigateur… »).
   ===================================================================== */
(() => {
  Commun.demarrer();
  const p = Commun.params;
  const ecran = document.getElementById('ecran');
  const mode = p.get('mode') === 'complet' ? 'complet' : 'entree';

  if (p.has('capture')) {
    ecran.classList.add(mode);
    const anims = () => document.getAnimations();
    // Durée totale = la plus longue animation non infinie
    window.dureeTransition = () => Math.max(...document.getAnimations().map(a => {
      const t = a.effect.getComputedTiming();
      return t.iterations === Infinity ? 0 : t.endTime;
    }));
    window.allerA = ms => { anims().forEach(a => { a.pause(); a.currentTime = ms; }); };
    window.allerA(0);
    return;
  }

  Commun.cycle({
    lancer() {
      ecran.classList.remove('entree', 'complet', 'arret');
      void ecran.offsetWidth;                 // relance l'animation depuis le début
      ecran.classList.add(mode);
    },
    arreter() {
      ecran.classList.remove('entree', 'complet');
      ecran.classList.add('arret');           // écran « fermé » en attendant le prochain passage
    },
  });
})();
