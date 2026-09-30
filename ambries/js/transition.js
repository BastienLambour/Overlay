/* =====================================================================
   TRANSITIONS — choix du mode et pilotage pour l'export vidéo.
   La page contient <div id="ecran" data-type="splash|gouttes|pop"><svg id="fluide">…
   ?mode=entree (défaut) : l'écran démarre couvert, puis se découvre
                           (à poser en haut d'une scène dans OBS)
   ?mode=complet         : recouvre puis découvre (pour la vidéo Stinger)
   ?capture=1            : animation figée, pilotée image par image par
                           outils/generer-transitions.mjs
   ===================================================================== */
(() => {
  Commun.demarrer();
  const p = Commun.params;
  const ecran = document.getElementById('ecran');
  const tr = Fluide.creer(document.getElementById('fluide'), ecran.dataset.type, { avatar: Commun.AVATAR });
  const debut = p.get('mode') === 'complet' ? 0 : tr.milieu;
  tr.rendre(debut);

  if (p.has('capture')) {
    window.dureeTransition = () => Math.round((tr.duree - debut) * 1000);
    window.pointTransition = () => Math.max(0, Math.round((tr.milieu - debut) * 1000));
    window.allerA = ms => tr.rendre(debut + ms / 1000);
    return;
  }
  // Lecture en direct, une fois les polices et l'avatar chargés
  document.fonts.ready.then(() => Fluide.jouer(tr, { debut }));
})();
