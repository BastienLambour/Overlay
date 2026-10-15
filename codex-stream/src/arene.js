/* =====================================================================
   ARÈNE — les jets de dés JOUÉS par le personnage en pied (la mise en scène de l'arène de Patagrain, rendue commune).
   Le personnage entre, fait le GESTE de la compétence (court, se cache, crochète, lit, observe, parle, menace, danse,
   lance un sort, tire, frappe, pare, soigne…) pendant que les dés roulent, puis réagit au VERDICT (saute de joie, tombe,
   danse au critique, K.O. à l'échec critique). Une carte affiche le jet (facultative).
     Arene.jouer(zone, jet, { dessin(expression) → <svg> en pied, carte, denouement, duree, reste }) → promesse (finie quand c'est fini)
     const a = Arene.monter(zone, options) ; a.jouer(jet)     (une file : un jet à la fois)
   jet : { geste, verdict, mot, nom (ou characterName), libelle (ou labelFr), resultat (texte) ou formula/result/nd, result, portrait }
   zone : un élément (il prend la classe .cs-arene : container-type size, les unités cqw/cqh de la mise en scène).
   Les gestes : le moteur du squelette (src/squelette.css : gj-courir, saute, chute, hop, danse, gj-sort, attaque…).
   Classes, pour l'habillage d'un overlay : .arene-perso, .arene-carte (small, b, i.ok|rate|crit|fumble), .arene-etoile, .arene-trait, .arene-photo
   ===================================================================== */
const Arene = (() => {
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  const bouger = (el, images, ms, easing = 'ease-in-out') => el.animate(images, { duration: ms, easing, fill: 'forwards' }).finished;
  let style = false;
  function poserStyle() {
    if (style || typeof document === 'undefined') return; style = true;
    const s = document.createElement('style'); s.dataset.codexStream = 'arene';
    // :where() = aucune priorité : un overlay habille l'arène comme il veut (css/jdr.css de Patagrain)
    s.textContent = `:where(.cs-arene) { container-type: size; overflow: hidden; }
      :where(.cs-arene) > * { position: absolute; }
      :where(.cs-arene .arene-perso) { bottom: 3cqh; left: 0; height: min(66cqh, 105cqw); width: calc(min(66cqh, 105cqw) * .435); }
      :where(.cs-arene .arene-perso svg) { width: 100%; height: 100%; display: block; }
      :where(.cs-arene .arene-carte) { left: 4cqw; right: 4cqw; top: 4cqh; padding: 1.6cqh 3cqw 2cqh; border-radius: 3cqh; text-align: center;
        background: var(--cs-fond, #1E2430); color: var(--cs-texte, #F2F5F3); font-family: var(--cs-police, system-ui, sans-serif); box-shadow: 0 0 0 .5cqh var(--cs-accent, #F5B82E); }
      :where(.cs-arene .arene-carte small) { display: block; font-weight: 900; font-size: 5cqh; letter-spacing: .3cqh; text-transform: uppercase; color: var(--cs-accent, #F5B82E); }
      :where(.cs-arene .arene-carte b) { font-weight: 800; font-size: 8cqh; }
      :where(.cs-arene .arene-carte i) { display: table; margin: .8cqh auto 0; padding: .4cqh 2.5cqw .7cqh; border-radius: 2cqh; font-weight: 800; font-size: 6cqh; font-style: normal; }
      :where(.cs-arene .arene-carte i.ok) { background: #2F7A4F; color: #fff; } :where(.cs-arene .arene-carte i.rate) { background: #8E1F1F; color: #fff; }
      :where(.cs-arene .arene-carte i.crit) { background: var(--cs-accent, #F5B82E); color: #2A1A04; } :where(.cs-arene .arene-carte i.fumble) { background: #3A0A0A; color: #FFB4A8; }
      :where(.cs-arene .arene-carte .arene-photo) { float: left; width: 15cqh; height: 15cqh; border-radius: 50%; object-fit: cover; margin-right: 2cqw; }
      :where(.cs-arene .arene-carte b.arene-attente) { display: inline-block; animation: cs-arene-de .6s linear infinite; }
      @keyframes cs-arene-de { to { transform: rotate(360deg); } }
      :where(.cs-arene .arene-trait) { height: 1.4cqh; width: 18cqw; background: linear-gradient(90deg, transparent, #F2E6C8); border-radius: 1cqh; }
      :where(.cs-arene .arene-etoile) { font-weight: 900; font-size: 13cqh; line-height: 1; color: var(--cs-accent, #F5B82E); }`;
    document.head.appendChild(s);
  }

  const MOTS = { crit: 'Critique !', fumble: 'Échec critique…', ok: 'Réussite !', rate: 'Échec…' };

  async function jouer(zone, jet, { dessin, carte: avecCarte = true, denouement: DENOUEMENT = 1500, duree: DUREE = 4000, reste: autres = () => 0 } = {}) {
    poserStyle(); Squelette.poserStyle();
    zone.classList.add('cs-arene');
    zone.innerHTML = '';
    const t0 = performance.now();
    const geste = jet.geste || 'neutre', verdict = jet.verdict || '';
    const resultat = jet.resultat != null && typeof jet.resultat === 'string' && /=|DD/.test(jet.resultat) ? jet.resultat
      : `${jet.formula ? jet.formula + ' = ' : ''}${jet.result ?? jet.resultat ?? ''}${jet.nd ? ` (DD ${jet.nd})` : ''}`;
    const mot = jet.mot || MOTS[verdict] || '';
    // la carte du jet (facultative : un overlay qui a son propre compteur la retire)
    const carte = document.createElement('div');
    carte.className = 'arene-carte';
    carte.innerHTML = '<small></small><b class="arene-attente">🎲</b>';
    carte.querySelector('small').textContent = `${jet.nom || jet.characterName || ''} · ${jet.libelle || jet.labelFr || 'Jet'}`;
    let devoile = null;
    const denoue = () => devoile || (devoile = attendre(Math.max(0, DENOUEMENT - (performance.now() - t0))).then(() => {
      const b = carte.querySelector('b'); b.className = ''; b.textContent = resultat;
      if (mot) { const i = document.createElement('i'); i.className = verdict || jet.dhOutcome || ''; i.textContent = mot; carte.appendChild(i); }
      if (avecCarte) bouger(carte, [{ transform: 'scale(1.06)' }, { transform: 'none' }], 300);
    }));
    // le personnage, en pied (le dessin est refait pour changer d'expression ; les gestes sont des classes sur « corps »)
    const perso = document.createElement('div'); perso.className = 'arene-perso';
    const corps = document.createElement('div'); corps.style.cssText = 'width:100%;height:100%';
    corps.innerHTML = dessin('');
    perso.appendChild(corps);
    if (jet.portrait && avecCarte) { const img = new Image(); img.className = 'arene-photo'; img.src = jet.portrait; carte.prepend(img); }
    zone.append(perso);
    if (avecCarte) zone.append(carte);
    const poser = c => corps.classList.add(...c.split(' '));
    const oter = c => corps.classList.remove(...c.split(' '));
    const pendant = async (c, ms) => { poser(c); await attendre(ms); oter(c); };
    const visage = e => { corps.innerHTML = dessin(e); };
    const effet = (texte, style, images, ms = 1200) => {
      const e = document.createElement('div'); e.className = 'arene-etoile'; e.textContent = texte; e.style.cssText = style; zone.appendChild(e);
      return bouger(e, images, ms).then(() => e.remove());
    };
    const monte = (texte, x = 40) => effet(texte, `left:${x}cqw;bottom:52cqh`, [{ opacity: 0, transform: 'translateY(0) scale(.6)' }, { opacity: 1, transform: 'translateY(-6cqh) scale(1.1)', offset: .3 }, { opacity: 0, transform: 'translateY(-22cqh)' }], 1300);
    const placer = x => bouger(perso, [{ transform: `translateX(${x}cqw)` }, { transform: `translateX(${x}cqw)` }], 1);
    if (avecCarte) bouger(carte, [{ opacity: 0, transform: 'translateY(-4cqh) scale(.85)' }, { opacity: 1, transform: 'none' }], 400, 'cubic-bezier(.34,1.56,.64,1)');

    // --- le geste ---
    if (geste === 'courir') {
      poser('gj-courir');
      await bouger(perso, [{ transform: 'translateX(110cqw)' }, { transform: 'translateX(32cqw)' }], Math.max(1000, DENOUEMENT - 150), 'linear');
      oter('gj-courir');
      await denoue();
      if (verdict === 'ok' || verdict === 'crit') { await pendant('saute', 1100); }
      else if (verdict === 'rate' || verdict === 'fumble') { visage('choc'); await pendant('chute', 2600); }
      else await attendre(500);
    } else {
      await placer(32);
      bouger(perso, [{ opacity: 0 }, { opacity: 1 }], 300);
      if (geste === 'grimper') {
        await pendant('gj-grimper', 1600);
        await denoue();
        if (verdict === 'rate' || verdict === 'fumble') { visage('choc'); await pendant('chute', 2600); }
      } else if (geste === 'cacher') {
        poser('gj-cacher');
        await denoue();
        if (verdict === 'ok' || verdict === 'crit') { await bouger(perso, [{ opacity: 1 }, { opacity: .25 }], 900); await attendre(900); await bouger(perso, [{ opacity: .25 }, { opacity: 1 }], 400); }
        else if (verdict === 'rate' || verdict === 'fumble') { monte('❗', 44); visage('choc'); oter('gj-cacher'); await pendant('hop', 1300); }
        else await attendre(600);
        oter('gj-cacher');
      } else if (geste === 'crocheter') {
        poser('gj-crocheter'); monte('🔒', 46); await denoue(); oter('gj-crocheter');
        if (verdict === 'ok' || verdict === 'crit') monte('🔓', 46);
        else if (verdict === 'rate' || verdict === 'fumble') { monte('💢', 46); visage('choc'); }
      } else if (geste === 'lire') {
        poser('gj-lire'); await denoue(); await attendre(200); oter('gj-lire');
        if (verdict === 'ok' || verdict === 'crit') monte('💡', 44);
        else if (verdict === 'rate' || verdict === 'fumble') { monte('❓', 44); poser('haussement'); await attendre(900); oter('haussement'); }
      } else if (geste === 'observer') {
        poser('gj-observer'); await denoue(); await attendre(200); oter('gj-observer');
        if (verdict === 'ok' || verdict === 'crit') monte('👁️', 44);
        else if (verdict === 'rate' || verdict === 'fumble') { poser('haussement'); await attendre(900); oter('haussement'); }
      } else if (geste === 'parler' || geste === 'menacer') {
        poser(geste === 'parler' ? 'gj-parler' : 'menace'); monte('💬', 52); await denoue(); oter('gj-parler menace');
        if (verdict === 'ok' || verdict === 'crit') monte(geste === 'parler' ? '🤝' : '😨', 44);
        else if (verdict === 'rate' || verdict === 'fumble') { monte('💧', 40); visage('choc'); }
      } else if (geste === 'danser') {
        poser('danse'); visage('rire');
        for (let k = 0; k < 3; k++) { monte(k % 2 ? '♫' : '♪', 22 + k * 22); await attendre(500); }
        oter('danse');
      } else if (geste === 'sort') {
        poser('gj-sort'); monte('✨', 40); await denoue(); oter('gj-sort');
        if (verdict === 'rate' || verdict === 'fumble') { monte('💨', 40); visage('choc'); }
        else effet('💫', 'left:66cqw;bottom:40cqh', [{ opacity: 1, transform: 'translateX(-20cqw) scale(.5)' }, { opacity: 0, transform: 'translateX(20cqw) scale(1.6)' }], 700);
      } else if (geste === 'tirer') {
        poser('en-garde'); await attendre(Math.max(500, DENOUEMENT - 450)); oter('en-garde'); poser('attaque'); await denoue();
        const trait = document.createElement('div'); trait.className = 'arene-trait'; trait.style.cssText = 'left:42cqw;bottom:42cqh'; zone.appendChild(trait);
        await bouger(trait, [{ transform: 'translateX(0)', opacity: 1 }, { transform: verdict === 'rate' || verdict === 'fumble' ? 'translate(60cqw, -30cqh) rotate(-30deg)' : 'translateX(70cqw)', opacity: 0 }], 500, 'ease-in');
        trait.remove(); oter('attaque');
      } else if (geste === 'frapper') {
        poser('en-garde'); await attendre(Math.max(400, DENOUEMENT - 500)); oter('en-garde'); poser('attaque'); await denoue(); await attendre(500); oter('attaque');
        if (verdict === 'ok' || verdict === 'crit') monte('💥', 60);
      } else if (geste === 'parer') {
        poser('gj-parer'); await denoue();
        if (verdict === 'rate' || verdict === 'fumble') { oter('gj-parer'); visage('choc'); await pendant('gj-encaisse', 700); }
        else { monte('🛡️', 44); await attendre(900); oter('gj-parer'); }
      } else if (geste === 'soigner') {
        poser('gj-soigne'); monte('💚', 30); await denoue(); monte(`+${jet.result ?? ''}`, 44); await attendre(900); oter('gj-soigne');
      } else if (geste === 'garde') {
        await pendant('en-garde', 1200);
      } else {
        await attendre(600);
      }
      // --- la suite selon le verdict (commune) ---
      await denoue();
      if (verdict === 'crit') {
        visage('rire'); poser('danse');
        for (let k = 0; k < 4; k++) { monte(k % 2 ? '★' : '✦', 16 + k * 22); await attendre(350); }
        oter('danse');
      } else if (verdict === 'fumble') {
        monte('💥', 44); visage('ko'); await pendant('chute', 2600);
      } else if (verdict === 'ok') {
        visage('rire'); await pendant('hop', 1300);
      } else if (verdict === 'rate' && geste !== 'grimper' && geste !== 'parer') {
        await attendre(700);
      }
    }
    // le résultat reste lisible DUREE ms après le dénouement (moins longtemps si d'autres jets attendent)
    await denoue();
    const reste = (autres() ? Math.min(DUREE, 2000) : DUREE) - (performance.now() - t0 - DENOUEMENT);
    await attendre(Math.max(500, reste));
    if (avecCarte) await bouger(carte, [{ opacity: 1 }, { opacity: 0 }], 400);
    await bouger(perso, [{ opacity: getComputedStyle(perso).opacity }, { opacity: 0 }], 300);
    zone.innerHTML = '';
  }

  function monter(zone, options = {}) {
    const file = [];
    let occupe = false;
    async function suivant() {
      if (occupe || !file.length) return;
      occupe = true;
      const jet = file.shift();
      try { await jouer(zone, jet, { ...options, dessin: e => options.dessin(jet, e), reste: () => file.length }); }
      catch (e) { console.error('[Arène]', e); }
      finally { occupe = false; suivant(); }
    }
    return { jouer: jet => { file.push(jet); suivant(); } };
  }

  return { jouer, monter, poserStyle };
})();
