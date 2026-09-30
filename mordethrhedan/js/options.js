/* =====================================================================
   OPTIONS — les options des scènes réglées dans config.js › options
   (ou dans reglages.html › Options des scènes), comme si on les avait
   écrites dans l'adresse de la source OBS.

       options: { jeu: { cam: "bas-gauche", chat: false } }
       → scenes/jeu.html se comporte comme scenes/jeu.html?cam=bas-gauche&chat=0

   Une page est désignée par son nom de fichier, sans « .html » (jeu, contenu, cam-seule…).
   Valeurs : true = comme d'habitude (rien n'est ajouté) · false ou "aucune" = « 0 » · sinon la valeur.
   Une option déjà écrite dans l'adresse de la source passe AVANT le réglage : on peut donc
   toujours faire une source particulière.
   À charger juste après config.js, sur chaque page (avant tous les autres scripts).

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
(() => {
  const options = (window.CONFIG || {}).options || {};
  const page = decodeURIComponent(location.pathname.split('/').pop() || '').replace(/\.html$/, '');
  const reglage = options[page];
  if (!reglage || typeof reglage !== 'object') return;
  const p = new URLSearchParams(location.search);
  let change = false;
  Object.entries(reglage).forEach(([cle, v]) => {
    if (p.has(cle) || v === true || v === '' || v == null) return;
    p.set(cle, v === false || v === 'aucune' ? '0' : String(v));
    change = true;
  });
  // L'adresse de la page est complétée sans la recharger : les scripts suivants lisent ces options
  if (change) try { history.replaceState(history.state, '', location.pathname + '?' + p.toString() + location.hash); } catch (e) {}
})();
