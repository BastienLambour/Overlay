/* =====================================================================
   ZONES DE LA WEBCAM (GABARIT : propre à chaque overlay, à adapter à ses scènes) — où va la webcam dans chaque scène (pixels 1920 × 1080).
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
    "cam-seule": { "x": 70, "y": 100, "l": 1240, "h": 698 },
    "contenu":   { "x": 1400, "y": 100, "l": 460, "h": 259 },
    "jeu": {
      "defaut": "bas-droite",
      "prereglages": {
        "bas-droite":  { "x": 1450, "y": 740, "l": 420, "h": 236 },
        "bas-gauche":  { "x": 50,   "y": 740, "l": 420, "h": 236 },
        "haut-droite": { "x": 1450, "y": 130, "l": 420, "h": 236 },
        "haut-gauche": { "x": 50,   "y": 130, "l": 420, "h": 236 }
      }
    }
  }
};
