/* =====================================================================
   OPTIONS — les options des scènes réglées dans config.js › options
   (ou dans reglages.html › Options des scènes), comme si on les avait
   écrites dans l'adresse de la source OBS.

       options: { jeu: { cam: "bas-gauche", chat: false } }
       → scenes/jeu.html se comporte comme scenes/jeu.html?cam=bas-gauche&chat=0

   Une page est désignée par son nom de fichier, sans « .html » (jeu, contenu, cam-seule…).
   Valeurs : true = comme d'habitude (rien n'est ajouté) · false ou "aucune" = « 0 » ·
   une position { x, y, l, h } = « x,y,l,h » · sinon la valeur.
   Une option déjà écrite dans l'adresse de la source passe AVANT le réglage : on peut donc
   toujours faire une source particulière.
   Les options ajoutées ici sont notées dans l'adresse (« depuisReglages=chat,cam ») : quand OBS
   actualise la page, il la recharge avec cette adresse complétée ; on les retire alors d'abord,
   pour relire config.js (sinon un chat remis dans les réglages resterait caché).
   À charger juste après config.js, sur chaque page (avant tous les autres scripts).

   Options.cam(scène) : la zone de la webcam de la scène, d'après js/zones.js et l'option « cam »
   (préréglage « bas-droite »…, « 0 »/« aucune » = pas de webcam → null, ou « x,y,l,h »).

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
const Options = (() => {
  const MARQUE = 'depuisReglages';
  const enAdresse = v => v === false || v === 'aucune' ? '0'
    : v && typeof v === 'object' ? [v.x, v.y, v.l, v.h].filter(n => n != null && n !== '').join(',') : String(v);

  (() => {
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
      p.set(cle, enAdresse(v));
      ajoutees.push(cle);
    });
    if (ajoutees.length) { p.set(MARQUE, ajoutees.join(',')); change = true; }
    // L'adresse de la page est complétée sans la recharger : les scripts suivants lisent ces options
    const recherche = p.toString();
    if (change) try { history.replaceState(history.state, '', location.pathname + (recherche ? '?' + recherche : '') + location.hash); } catch (e) {}
  })();

  // ---------- La webcam d'une scène (js/zones.js) ----------
  const zonesCam = () => ((window.ZONES || {}).cam) || {};
  const sansCam = v => v === false || v === '0' || v === 'aucune' || v === 0;

  // valeur : celle à utiliser (sinon : l'adresse de la page, puis config.js › options.<scène>.cam)
  // → { x, y, l, h, coin, droite, bas } (coin = le préréglage, ou « perso ») ; null = pas de webcam
  function cam(scene, valeur) {
    const z = zonesCam()[scene];
    if (!z) return null;
    let v = valeur;
    if (v === undefined) v = new URLSearchParams(location.search).get('cam');
    if (v === null || v === undefined) v = (((window.CONFIG || {}).options || {})[scene] || {}).cam;
    if (sansCam(v)) return null;
    let r;
    if (!z.prereglages) r = { x: z.x, y: z.y, l: z.l, h: z.h, coin: 'fixe' };
    else {
      const defaut = z.prereglages[z.defaut] || Object.values(z.prereglages)[0];
      if (typeof v === 'string' && /^\s*-?\d/.test(v)) { const [x, y, l, h] = v.split(',').map(Number); v = { x, y, l, h }; }
      if (v && typeof v === 'object') {
        const n = (k, d) => (Number.isFinite(Number(v[k])) && v[k] !== '' && v[k] != null ? Number(v[k]) : d);
        r = { x: n('x', defaut.x), y: n('y', defaut.y), l: n('l', defaut.l) || defaut.l, h: n('h', defaut.h) || defaut.h, coin: 'perso' };
      } else {
        const coin = z.prereglages[v] ? v : z.defaut;
        r = { ...z.prereglages[coin], coin };
      }
    }
    r.droite = r.x + r.l / 2 > 960;       // la cam est-elle plutôt à droite ? (le chat se met en face)
    r.bas = r.y + r.h / 2 > 540;
    return r;
  }

  return { cam, zonesCam, enAdresse };
})();
