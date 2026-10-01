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
    "cam-seule": { "x": 45, "y": 130, "l": 1380, "h": 776 },
    "contenu":   { "x": 45, "y": 45, "l": 380, "h": 285 },
    "speedrun":  { "x": 45, "y": 45, "l": 380, "h": 285 },
    "jeu": {
      "defaut": "haut-gauche",
      "prereglages": {
        "haut-gauche": { "x": 56,   "y": 56,  "l": 320, "h": 300 },
        "haut-droite": { "x": 1544, "y": 56,  "l": 320, "h": 300 },
        "bas-gauche":  { "x": 56,   "y": 724, "l": 320, "h": 300 },
        "bas-droite":  { "x": 1544, "y": 724, "l": 320, "h": 300 }
      }
    }
  }
};
