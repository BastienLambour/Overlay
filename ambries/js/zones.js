/* =====================================================================
   ZONES DE LA WEBCAM — où va la webcam dans chaque scène (pixels 1920 × 1080).
   Lu par les scènes, par reglages.html (Options des scènes) ET par le script OBS
   outils/actualiser-obs.lua, qui y place la webcam tout seul : c'est la seule
   source de vérité, ne recopie ces chiffres nulle part ailleurs.

   - une zone fixe : { x, y, l, h } (coin haut-gauche, largeur, hauteur) ;
   - une zone à préréglages (scène Jeu) : la webcam se choisit dans reglages.html
     (un préréglage, « aucune », ou une position perso { x, y, l, h }) ; « defaut »
     est le préréglage quand rien n'est choisi.
   Écris-le comme du JSON (clés entre guillemets) : le script OBS le lit aussi.
   ===================================================================== */
window.ZONES = {
  "cam": {
    "cam-seule": { "x": 80, "y": 200, "l": 1260, "h": 709 },
    "contenu":   { "x": 60, "y": 220, "l": 480, "h": 270 },
    "jeu": {
      "defaut": "bas-droite",
      "prereglages": {
        "bas-droite":  { "x": 1456, "y": 735, "l": 400, "h": 225 },
        "bas-gauche":  { "x": 64,   "y": 735, "l": 400, "h": 225 },
        "haut-droite": { "x": 1456, "y": 190, "l": 400, "h": 225 },
        "haut-gauche": { "x": 64,   "y": 190, "l": 400, "h": 225 }
      }
    }
  }
};
