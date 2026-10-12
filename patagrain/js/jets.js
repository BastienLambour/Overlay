/* =====================================================================
   JETS — les jets de dés de la table, joués par les héros (scène JDR).
   Un jet arrive (de CodexVTT, plus tard ; de la démo, aujourd'hui) au format :
     { sheetId, characterName, kind, labelFr, formula, result, nd,
       isSuccess, isCritSuccess, isCritFail, dhOutcome }
       kind : 'skill' | 'save' | 'attack' | 'damage' | 'heal' | 'initiative' | 'stat' | 'free'
       isSuccess : true / false si un DD a été saisi, sinon absent (pas de verdict)
       dhOutcome (Daggerheart) : 'hope' | 'fear' | 'critical'
   Le héros vient le jouer dans la « zone » (un coin de l'écran) : un GESTE choisi d'après la compétence
   (Athlétisme → courir, Discrétion → se cacher…), puis la suite selon le VERDICT
   (réussi, raté, critique, échec critique, ou rien s'il n'y a pas de DD). Une carte affiche le jet.
     const jets = Jets.monter(zone, { heros: jet => 'kenai' })   // quel dessin (js/heros.js) pour ce jet
     jets.jouer(jet)                                              // file d'attente : un jet à la fois
   En même temps que les dés 3D de CodexVTT : le jet arrive à l'instant du lancer (résultat déjà connu), les dés se
   posent 1 à 2 s plus tard. Le héros fait donc son ÉLAN tout de suite, et le DÉNOUEMENT (résultat sur la carte,
   saut, chute, critique) attend DENOUEMENT ms après l'arrivée du jet.  Jets.monter(zone, { denouement: 1500, duree: 4000 })
   duree : combien de temps le résultat reste affiché une fois les dés posés (moitié moins si d'autres jets attendent).
   Gestes : css/bouffon.css, sections 7 (grelots) et 8 (gestes des jets).
   ===================================================================== */
const Jets = (() => {
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  const bouger = (el, images, ms, easing = 'ease-in-out') => el.animate(images, { duration: ms, easing, fill: 'forwards' }).finished;
  const sansAccent = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  // ---------- quelle compétence → quel geste : on cherche des mots dans le libellé du jet ----------
  // Libellés de CodexVTT (codex-web/public/assets/i18n/fr.json) :
  //   D&D 5e (ROOM.SHEET.SKILLS) : Acrobaties, Dressage, Arcanes, Athlétisme, Tromperie, Histoire, Perspicacité, Intimidation,
  //     Investigation, Médecine, Nature, Perception, Représentation, Persuasion, Religion, Escamotage, Discrétion, Survie
  //   Daggerheart (traits) : Agilité, Force, Finesse, Instinct, Présence, Connaissance
  //   COF2 (caractéristiques) : Agilité, Constitution, Force, Perception, Charisme, Intelligence, Volonté
  // L'ordre compte : la première ligne qui correspond l'emporte (« arc » de Arcanes est pris avant « arc » de l'arme).
  const COMPETENCES = [
    [/athlet|acrobat|course|agilit|bondir|sauter|esquive/, 'courir'],
    [/escalad|grimp/, 'grimper'],
    [/discret|furtiv|cacher|dissimul/, 'cacher'],
    [/escamot|crochet|serrur|desamorc|piege|vol a la tire|outils|finesse/, 'crocheter'],
    [/investig|fouill|cherch/, 'crocheter'],
    [/arcane|histoire|religion|connaiss|savoir|erudi|lire|dechiffr|nature|medecin|intellig/, 'lire'],
    [/percept|perspica|survie|instinct|observ|pister|vigilan/, 'observer'],
    [/intimid/, 'menacer'],
    [/persua|tromper|bluff|diplom|negoci|charme|charisme|presence|dressage|commander/, 'parler'],
    [/represent|musique|chant|danse|spectacle/, 'danser'],
    [/constitution|volonte|endur|resist/, 'parer'],
    [/sort|magie|incant|focus|rituel|pouvoir/, 'sort'],
    [/arc|arbalet|fronde|lancer|jet|tir|distance/, 'tirer'],
    [/force|puissance/, 'frapper'],
  ];
  function choisirGeste(jet) {
    const libelle = sansAccent(jet.labelFr);
    if (jet.kind === 'heal') return 'soigner';
    if (jet.kind === 'save') return 'parer';
    if (jet.kind === 'initiative') return 'garde';
    for (const [motif, geste] of COMPETENCES) if (motif.test(libelle)) return geste;
    if (jet.kind === 'attack' || jet.kind === 'damage') return 'frapper';
    return 'neutre';
  }
  function choisirVerdict(jet) {
    if (jet.isCritSuccess || jet.dhOutcome === 'critical') return 'crit';
    if (jet.isCritFail) return 'fumble';
    if (jet.isSuccess === true) return 'ok';
    if (jet.isSuccess === false) return 'rate';
    return '';                                              // pas de DD : pas de verdict, le geste seul
  }
  const MOTS = { crit: 'Critique !', fumble: 'Échec critique…', ok: 'Réussite !', rate: 'Échec…' };
  const MOTS_ATTAQUE = { ok: 'Touché !', rate: 'Raté…' };

  function monter(zone, { heros = jet => sansAccent(jet.characterName).split(' ')[0], denouement: DENOUEMENT = 1500, duree: DUREE = 4000 } = {}) {
    const file = [];
    let occupe = false;
    async function suivant() {
      if (occupe || !file.length) return;
      occupe = true;
      try { await jouerUn(file.shift()); } finally { occupe = false; suivant(); }
    }

    async function jouerUn(jet) {
      zone.innerHTML = '';
      const t0 = performance.now();
      const geste = choisirGeste(jet), verdict = choisirVerdict(jet);
      const attaque = jet.kind === 'attack' || jet.kind === 'damage';
      // la carte du jet
      const carte = document.createElement('div');
      carte.className = 'arene-carte';
      carte.innerHTML = '<small></small><b class="arene-attente">🎲</b>';
      carte.querySelector('small').textContent = `${jet.characterName} · ${jet.labelFr || 'Jet'}`;
      const resultat = `${jet.formula ? jet.formula + ' = ' : ''}${jet.result}${jet.nd ? ` (DD ${jet.nd})` : ''}`;
      const mot = (attaque && MOTS_ATTAQUE[verdict]) || MOTS[verdict] || { hope: 'Espoir', fear: 'Peur' }[jet.dhOutcome];
      // le dénouement : quand les dés se posent, le résultat apparaît sur la carte (une seule fois)
      let devoile = null;
      const denoue = () => devoile || (devoile = attendre(Math.max(0, DENOUEMENT - (performance.now() - t0))).then(() => {
        const b = carte.querySelector('b'); b.className = ''; b.textContent = resultat;
        if (mot) { const i = document.createElement('i'); i.className = verdict || jet.dhOutcome; i.textContent = mot; carte.appendChild(i); }
        bouger(carte, [{ transform: 'scale(1.06)' }, { transform: 'none' }], 300);
      }));
      // le héros, en pied
      const perso = document.createElement('div'); perso.className = 'arene-perso';
      const corps = document.createElement('div'); corps.style.cssText = 'width:100%;height:100%';
      corps.innerHTML = Heros.svg(heros(jet), 'pied');
      perso.appendChild(corps);
      if (jet.couleur) corps.style.setProperty('--c-heros', jet.couleur);       // la cape de l'aventurier (perso « autre »)
      if (jet.portrait) { const img = new Image(); img.className = 'arene-photo'; img.src = jet.portrait; carte.prepend(img); }
      zone.append(perso, carte);
      const svg = corps.querySelector('svg');
      const poser = c => corps.classList.add(...c.split(' '));
      const oter = c => corps.classList.remove(...c.split(' '));
      const pendant = async (c, ms) => { poser(c); await attendre(ms); oter(c); };
      const visage = e => { svg.classList.remove('expr-rire', 'expr-choc', 'expr-dort', 'expr-ko'); if (e) svg.classList.add('expr-' + e); };
      const effet = (texte, style, images, ms = 1200) => {
        const e = document.createElement('div'); e.className = 'arene-etoile'; e.textContent = texte; e.style.cssText = style; zone.appendChild(e);
        return bouger(e, images, ms).then(() => e.remove());
      };
      const monte = (texte, x = 40) => effet(texte, `left:${x}cqw;bottom:52cqh`, [{ opacity: 0, transform: 'translateY(0) scale(.6)' }, { opacity: 1, transform: 'translateY(-6cqh) scale(1.1)', offset: .3 }, { opacity: 0, transform: 'translateY(-22cqh)' }], 1300);
      const placer = x => bouger(perso, [{ transform: `translateX(${x}cqw)` }, { transform: `translateX(${x}cqw)` }], 1);
      bouger(carte, [{ opacity: 0, transform: 'translateY(-4cqh) scale(.85)' }, { opacity: 1, transform: 'none' }], 400, 'cubic-bezier(.34,1.56,.64,1)');

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
          oter('attaque');
        } else if (geste === 'frapper') {
          poser('en-garde'); await attendre(Math.max(400, DENOUEMENT - 500)); oter('en-garde'); poser('attaque'); await denoue(); await attendre(500); oter('attaque');
          if (verdict === 'ok' || verdict === 'crit') monte('💥', 60);
        } else if (geste === 'parer') {
          poser('gj-parer'); await denoue();
          if (verdict === 'rate' || verdict === 'fumble') { oter('gj-parer'); visage('choc'); await pendant('gj-encaisse', 700); }
          else { monte('🛡️', 44); await attendre(900); oter('gj-parer'); }
        } else if (geste === 'soigner') {
          poser('gj-soigne'); monte('💚', 30); await denoue(); monte(`+${jet.result}`, 44); await attendre(900); oter('gj-soigne');
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
      const reste = (file.length ? Math.min(DUREE, 2000) : DUREE) - (performance.now() - t0 - DENOUEMENT);
      await attendre(Math.max(500, reste));
      await bouger(carte, [{ opacity: 1 }, { opacity: 0 }], 400);
      await bouger(perso, [{ opacity: getComputedStyle(perso).opacity }, { opacity: 0 }], 300);
      zone.innerHTML = '';
    }

    return { jouer: jet => { file.push(jet); suivant(); } };
  }

  return { monter, choisirGeste, choisirVerdict };
})();
