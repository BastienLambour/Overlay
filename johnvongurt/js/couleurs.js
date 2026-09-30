/* =====================================================================
   COULEURS — remplace les couleurs du thème par celles de config.js › couleurs
   (ex. un thème Halloween : l'orange à la place du bleu), sans toucher à css/theme.css.

   Chaque réglage porte le nom d'une variable de css/theme.css, sans les deux tirets :
       couleurs: { primaire: "#FF7A1A", fond: "" }   →   --primaire devient orange, --fond ne change pas
   Vide = la couleur d'origine du thème. Se règle le plus simplement dans reglages.html › Couleurs.
   À charger juste après config.js, sur chaque page.

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
(() => {
  const couleurs = (window.CONFIG || {}).couleurs || {};
  const racine = document.documentElement.style;
  Object.entries(couleurs).forEach(([nom, valeur]) => {
    if (typeof valeur === 'string' && valeur.trim()) racine.setProperty('--' + nom, valeur.trim());
  });
})();
