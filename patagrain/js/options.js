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
   Les options ajoutées ici sont notées dans l'adresse (« depuisReglages=chat,cam ») : quand OBS
   actualise la page, il la recharge avec cette adresse complétée ; on les retire alors d'abord,
   pour relire config.js (sinon un chat remis dans les réglages resterait caché).
   À charger juste après config.js, sur chaque page (avant tous les autres scripts).

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
(() => {
  const MARQUE = 'depuisReglages';
  const options = (window.CONFIG || {}).options || {};
  const page = decodeURIComponent(location.pathname.split('/').pop() || '').replace(/\.html$/, '');
  const reglage = options[page];
  const p = new URLSearchParams(location.search);
  let change = false;
  // 1. Ce qu'un chargement précédent avait ajouté : on l'enlève (config.js a pu changer depuis)
  if (p.has(MARQUE)) {
    p.get(MARQUE).split(',').filter(Boolean).forEach(cle => p.delete(cle));
    p.delete(MARQUE);
    change = true;
  }
  // 2. Les options de config.js, sauf celles déjà écrites dans l'adresse de la source
  const ajoutees = [];
  if (reglage && typeof reglage === 'object') Object.entries(reglage).forEach(([cle, v]) => {
    if (p.has(cle) || v === true || v === '' || v == null) return;
    p.set(cle, v === false || v === 'aucune' ? '0' : String(v));
    ajoutees.push(cle);
  });
  if (ajoutees.length) { p.set(MARQUE, ajoutees.join(',')); change = true; }
  // L'adresse de la page est complétée sans la recharger : les scripts suivants lisent ces options
  const recherche = p.toString();
  if (change) try { history.replaceState(history.state, '', location.pathname + (recherche ? '?' + recherche : '') + location.hash); } catch (e) {}
})();
