/* =====================================================================
   JDR — le rendu de la scène JDR de Mordethrhedan (scenes/jdr.html), au style néon.
   Les données viennent du moteur commun js/partie.js (CodexVTT, Discord) : ici, on DESSINE seulement.
     JDR.carte(ecran, zone, perso, { portrait, nom })  → une carte : .maj(perso), .coup(delta), .tour(oui), .parler(oui), .oter()
     JDR.jet(ecran, zone, jet, { petit })              → le compteur néon d'un jet (promesse : finie quand il disparaît)
     JDR.file(jouer)                                    → une file : un jet à la fois
   Styles : css/jdr.css.
   ===================================================================== */
const JDR = (() => {
  const J = (window.CONFIG || {}).jdr || {};
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  const DENOUEMENT = 1500;                                    // les dés 3D de CodexVTT se posent ~1,5 s après le lancer
  const DUREE = Math.max(1, Number(J.dureeResultat) || 4) * 1000;

  function carte(ecran, z, p, { portrait = z.h - 40, nom = 30 } = {}) {
    const cadre = Composants.cadre(ecran, z, { verre: true, rayon: 18 });
    const el = Composants.creer(ecran, 'jc', `<div class="jc-portrait" style="width:${portrait}px;height:${portrait}px;font-size:${portrait * .55}px"></div>
      <div class="jc-corps"><div class="jc-nom" style="font-size:${nom}px"></div><div class="jc-sous"></div><div class="jc-barre"><i></i></div><div class="jc-pv"></div></div>
      <span class="jc-tag toi">toi</span><span class="jc-tag tour">son tour</span>`, z);
    // Le personnage dessiné (catalogue commun js/persos.js, au style de la chaîne : js/persos-style.js) s'il y est ;
    // sinon le portrait de CodexVTT. Il bouge la bouche quand il parle, K.O. à 0 PV, sa forme (Trayss) suit CodexVTT.
    let fiche = null, dernier = p, bouge = null, ouverte = false;
    const dessiner = q => {
      const b = el.querySelector('.jc-portrait');
      b.classList.add('dessin');
      b.innerHTML = PersosStyle.rendu(fiche, { forme: q.forme, expression: q.aTerre ? 'ko' : ouverte ? 'parle' : '', cadrage: 'tete' });
    };
    const maj = q => {
      dernier = q;
      // l'apparence liée dans le labo de CodexVTT d'abord, sinon le catalogue commun (js/persos.js)
      fiche = typeof PersosStyle !== 'undefined' && typeof Apparence !== 'undefined' ? (q.apparence || Apparence.trouver(q.nom, q.nomCodex)) : null;
      el.querySelector('.jc-nom').textContent = q.nom;
      el.querySelector('.jc-sous').textContent = q.mj ? 'Maître du jeu' : (q.forme || '');
      el.classList.toggle('moi', !!q.moi); cadre.classList.toggle('jc-cadre-moi', !!q.moi);
      el.classList.toggle('a-terre', !!q.aTerre);
      const boite = el.querySelector('.jc-portrait');
      if (fiche) dessiner(q);
      else {
      boite.classList.remove('dessin');
      if (q.portrait) {
        // le portrait de la fiche CodexVTT ; s'il ne vient pas, on garde l'initiale
        if (boite.dataset.src !== q.portrait) { const img = new Image(); img.alt = ''; img.onload = () => { boite.replaceChildren(img); boite.dataset.src = q.portrait; }; img.src = q.portrait; }
      } else if (!boite.firstChild) boite.innerHTML = `<b>${(q.nom || '?').charAt(0)}</b>`;
      if (!boite.firstChild) boite.innerHTML = `<b>${(q.nom || '?').charAt(0)}</b>`;
      }
      const ok = q.pvMax > 0;
      el.querySelector('.jc-barre').style.visibility = ok ? '' : 'hidden';
      el.querySelector('.jc-pv').textContent = ok ? `${q.pv} / ${q.pvMax} PV` : '';
      if (ok) el.querySelector('.jc-barre i').style.width = Math.max(0, q.pv / q.pvMax * 100) + '%';
      el.classList.toggle('bas', ok && q.pv <= q.pvMax / 3);
    };
    maj(p);
    return {
      el, maj,
      coup: d => { const c = document.createElement('div'); c.className = 'jc-coup ' + (d < 0 ? 'blesse' : 'soin'); c.textContent = (d > 0 ? '+' : '') + d; el.appendChild(c); setTimeout(() => c.remove(), 1700); },
      tour: oui => el.classList.toggle('tour', !!oui),
      parler: oui => {
        if (fiche) {
          if (oui && !bouge) bouge = setInterval(() => { ouverte = !ouverte; dessiner(dernier); }, 170);
          if (!oui && bouge) { clearInterval(bouge); bouge = null; ouverte = false; dessiner(dernier); }
        }
        el.classList.toggle('parle', !!oui);
        if (J.attenue !== false) ecran.classList.toggle('jdr-parole', !!ecran.querySelector('.jc.parle'));
      },
      oter: () => { el.remove(); cadre.remove(); },
    };
  }

  // Le compteur néon : les chiffres défilent pendant que les dés roulent, puis se posent sur le résultat
  async function jet(ecran, z, j, { petit = false } = {}) {
    const cadre = Composants.cadre(ecran, z, { verre: true, rayon: 22 });
    const el = Composants.creer(ecran, 'jet entre' + (petit ? ' petit' : ''), '<small></small><div class="chiffre roule">--</div><div class="formule"></div><div class="mot"></div>', z);
    el.querySelector('small').textContent = `${(j.perso || j.inconnu || {}).nom || j.characterName} · ${j.libelle}`;
    const chiffre = el.querySelector('.chiffre');
    const tic = setInterval(() => { chiffre.textContent = 1 + Math.floor(Math.random() * Math.max(2, j.sides || 20)); }, 55);
    await attendre(DENOUEMENT);
    clearInterval(tic);
    chiffre.classList.remove('roule');
    chiffre.textContent = j.result;
    el.querySelector('.formule').textContent = j.resultat;
    const mot = el.querySelector('.mot');
    if (j.mot) { mot.textContent = j.mot; mot.className = 'mot vu ' + (j.verdict || ''); }
    await attendre(DUREE);
    await el.animate([{ opacity: 1 }, { opacity: 0 }], 400).finished;
    el.remove(); cadre.remove();
  }

  function file(jouer) {
    const attente = [];
    let occupe = false;
    const suivant = async () => {
      if (occupe || !attente.length) return;
      occupe = true;
      try { await jouer(attente.shift(), attente.length); } catch (e) { console.error('[JDR]', e); } finally { occupe = false; suivant(); }
    };
    return j => { attente.push(j); suivant(); };
  }

  return { carte, jet, file, DENOUEMENT };
})();
