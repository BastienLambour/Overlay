/* =====================================================================
   JDR — le rendu de la scène JDR de John Von Gurt (scenes/jdr.html), style « mission control ».
   Les données viennent du moteur commun js/partie.js (CodexVTT, Discord) : ici, on DESSINE seulement.
     JDR.carte(ecran, zone, perso, { portrait, nom, numero })  → une fiche : .maj(perso), .coup(delta), .tour(oui), .parler(oui), .oter()
     JDR.jet(ecran, zone, jet, { petit })                       → la télémétrie d'un jet (promesse : finie quand elle disparaît)
     JDR.file(jouer)                                             → une file : un jet à la fois
   Styles : css/jdr.css. (Même interface que les autres overlays : seul le dessin change.)
   ===================================================================== */
const JDR = (() => {
  const J = (window.CONFIG || {}).jdr || {};
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  const DENOUEMENT = 1500;                                    // les dés 3D de CodexVTT se posent ~1,5 s après le lancer
  const DUREE = Math.max(1, Number(J.dureeResultat) || 4) * 1000;
  const SEGMENTS = 10;
  // Le vocabulaire de la mission
  const MOTS = { crit: 'Critique', fumble: 'Échec critique', ok: 'Succès', rate: 'Échec' };
  const MOTS_ATTAQUE = { ok: 'Touché', rate: 'Manqué' };

  function carte(ecran, z, p, { portrait = z.h - 40, nom = 30, numero = 0 } = {}) {
    const el = Composants.creer(ecran, 'jc', `<div class="jc-portrait" style="width:${portrait}px;height:${portrait}px;font-size:${portrait * .5}px"></div>
      <div class="jc-corps"><div class="jc-num"></div><div class="jc-nom" style="font-size:${nom}px"></div><div class="jc-sous"></div>
        <div class="jc-barre">${'<i></i>'.repeat(SEGMENTS)}</div><div class="jc-pv"></div></div>
      <span class="jc-tag toi">Toi</span><span class="jc-tag tour">Son tour</span><span class="jc-tag radio">● Transmission</span>`, z);
    el.querySelector('.jc-num').textContent = String(numero).padStart(2, '0');
    const maj = q => {
      el.querySelector('.jc-nom').textContent = q.nom;
      el.querySelector('.jc-sous').textContent = q.mj ? 'Maître du jeu' : (q.forme || 'Équipage');
      el.classList.toggle('moi', !!q.moi);
      el.classList.toggle('a-terre', !!q.aTerre);
      const boite = el.querySelector('.jc-portrait');
      if (q.portrait && boite.dataset.src !== q.portrait) { const img = new Image(); img.alt = ''; img.onload = () => { boite.replaceChildren(img); boite.dataset.src = q.portrait; }; img.src = q.portrait; }
      if (!boite.firstChild) boite.innerHTML = `<b>${(q.nom || '?').charAt(0)}</b>`;
      const ok = q.pvMax > 0;
      el.querySelector('.jc-barre').style.visibility = ok ? '' : 'hidden';
      el.querySelector('.jc-pv').textContent = ok ? `PV ${String(q.pv).padStart(2, '0')} / ${q.pvMax}` : '';
      const pleins = ok ? Math.ceil(Math.max(0, q.pv) / q.pvMax * SEGMENTS) : 0;
      el.querySelectorAll('.jc-barre i').forEach((i, k) => i.classList.toggle('vide', k >= pleins));
      el.classList.toggle('bas', ok && q.pv <= q.pvMax / 3);
    };
    maj(p);
    return {
      el, maj,
      coup: d => { const c = document.createElement('div'); c.className = 'jc-coup ' + (d < 0 ? 'blesse' : 'soin'); c.textContent = (d > 0 ? '+' : '') + d; el.appendChild(c); setTimeout(() => c.remove(), 1700); },
      tour: oui => el.classList.toggle('tour', !!oui),
      parler: oui => {
        el.classList.toggle('parle', !!oui);
        if (J.attenue !== false) ecran.classList.toggle('jdr-parole', !!ecran.querySelector('.jc.parle'));
      },
      oter: () => el.remove(),
    };
  }

  async function jet(ecran, z, j, { petit = false } = {}) {
    const el = Composants.creer(ecran, 'jet entre' + (petit ? ' petit' : ''), `<div class="jet-tete"><span class="label attention"></span><span class="hachures" style="flex:1"></span></div>
      <div class="chiffre roule">--</div><div class="formule"></div><div class="mot"></div>`, z);
    el.querySelector('.label').textContent = `Jet · ${j.perso ? j.perso.nom : j.characterName} · ${j.libelle}`;
    const chiffre = el.querySelector('.chiffre');
    const tic = setInterval(() => { chiffre.textContent = String(1 + Math.floor(Math.random() * Math.max(2, j.sides || 20))).padStart(2, '0'); }, 55);
    await attendre(DENOUEMENT);
    clearInterval(tic);
    chiffre.classList.remove('roule');
    chiffre.textContent = String(j.result).padStart(2, '0');
    el.querySelector('.formule').textContent = j.resultat;
    const attaque = j.kind === 'attack' || j.kind === 'damage';
    const mot = (attaque && MOTS_ATTAQUE[j.verdict]) || MOTS[j.verdict] || j.mot;
    const m = el.querySelector('.mot');
    if (mot) { m.textContent = mot; m.className = 'mot vu ' + (j.verdict || ''); }
    await attendre(DUREE);
    await el.animate([{ opacity: 1 }, { opacity: 0 }], 350).finished;
    el.remove();
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
