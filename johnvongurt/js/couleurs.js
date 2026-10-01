/* =====================================================================
   COULEURS (et MES RÉGLAGES) — à charger juste après config.js et mes-reglages.js, sur chaque page.

   1. Mes réglages : mes-reglages.js (écrit par reglages.html) contient SEULEMENT ce que le streamer
      a changé. Il est appliqué ici PAR-DESSUS config.js (les valeurs par défaut) : une mise à jour
      de l'overlay peut remplacer config.js sans effacer ses réglages. Les objets sont fusionnés
      clé par clé ; une liste ou une valeur simple remplace celle de config.js.
      Sans mes-reglages.js (pas encore de réglage perso) : rien ne change.

   2. Les couleurs : remplace les couleurs du thème par celles de config.js › couleurs
      (ex. un thème Halloween : l'orange à la place du bleu), sans toucher à css/theme.css.
      Chaque réglage porte le nom d'une variable de css/theme.css, sans les deux tirets :
          couleurs: { primaire: "#FF7A1A", fond: "" }   →   --primaire devient orange, --fond ne change pas
      Vide = la couleur d'origine du thème. Se règle le plus simplement dans reglages.html › Couleurs.

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
(() => {
  const C = window.CONFIG = window.CONFIG || {};
  const perso = window.MES_REGLAGES;
  if (perso && typeof perso === 'object') {
    if (perso.id && C.id && perso.id !== C.id) {
      console.warn(`[Réglages] mes-reglages.js est celui de « ${perso.id} », pas de « ${C.id} » : ignoré.`);
    } else {
      const fusion = (cible, ajout) => Object.entries(ajout).forEach(([k, v]) => {
        if (v && typeof v === 'object' && !Array.isArray(v) && cible[k] && typeof cible[k] === 'object' && !Array.isArray(cible[k])) fusion(cible[k], v);
        else cible[k] = v;
      });
      fusion(C, perso);
    }
  }

  const couleurs = C.couleurs || {};
  const racine = document.documentElement.style;
  Object.entries(couleurs).forEach(([nom, valeur]) => {
    if (typeof valeur === 'string' && valeur.trim()) racine.setProperty('--' + nom, valeur.trim());
  });
})();
