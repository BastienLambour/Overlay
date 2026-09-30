/* =====================================================================
   SCÈNES — toutes les mises en page, au même endroit.
   Les zones { x, y, l, h } sont les emplacements des sources OBS
   (webcam, jeu, contenu…) : voir le tableau dans TUTO.md.
   ===================================================================== */
const Scenes = (() => {
  const C = window.CONFIG || {};
  const p = Commun.params;

  // Colonne chat + grand cadre de contenu 16:9 (Contenu, Pause, Démarrage, Fin)
  const CHAT = { x: 40, y: 75, l: 430, h: 930 };
  const CONTENU = { x: 505, y: 149, l: 1380, h: 776 };

  function coinCam() {
    const coin = p.get('cam') || 'haut-gauche';
    const L = 320, H = 300, droite = coin.includes('droite'), bas = coin.includes('bas');
    return { cam: { x: droite ? 1920 - 60 - L : 60, y: bas ? 1080 - 55 - H : 55, l: L, h: H }, droite };
  }

  const dispositions = {
    // ----- Jeu en plein écran + cam dans un coin -----
    jeu(ecran) {
      const { cam, droite } = coinCam();
      Composants.zoneApercu(ecran, { x: 0, y: 0, l: 1920, h: 1080 }, 'Jeu (plein écran)', 'jeu');
      if (p.get('cadre') !== '0') Composants.exterieur(ecran);
      Composants.zoneApercu(ecran, cam, 'Webcam');
      Composants.cadre(ecran, cam);
      Composants.zoneWidget(ecran, { x: droite ? 60 : 1440, y: 45, l: 420, h: 250 }, 'Ton widget (succès…)');
    },

    // ----- Speedrun : manette + splits à gauche, jeu à droite -----
    speedrun(ecran) {
      const S = C.speedrun || {};
      const JEU = { x: 450, y: 122, l: 1440, h: 810 };
      Composants.fond(ecran, [JEU]);
      Composants.exterieur(ecran);
      Composants.zoneWidget(ecran, { x: 40, y: 40, l: 380, h: 290 }, 'Ta manette', { avecCadre: S.cadreManette !== false });
      Composants.zoneWidget(ecran, { x: 40, y: 355, l: 380, h: 685 }, 'Tes splits', { avecCadre: S.cadreSplits !== false });
      Composants.cadre(ecran, JEU, { titre: 'Jeu' });
    },

    // ----- Cam seule (discussion) -----
    'cam-seule'(ecran) {
      const CAM = { x: 45, y: 95, l: 1370, h: 770 };
      Composants.fond(ecran, [CAM]);
      Composants.exterieur(ecran);
      Composants.cadre(ecran, CAM, { titre: 'Webcam' });
      Composants.titre(ecran, { x: 45, y: 885, l: 1370, h: 150 }, C.nomChaine || '', 84);
      Composants.chat(ecran, { x: 1455, y: 75, l: 420, h: 930 });
    },

    // ----- Contenu + chat -----
    contenu(ecran) {
      Composants.fond(ecran, [CONTENU]);
      Composants.exterieur(ecran);
      Composants.cadre(ecran, CONTENU, { titre: 'Contenu' });
      Composants.chat(ecran, CHAT);
    },

    // ----- Écrans à titre, posés sur ton image -----
    pause(ecran) { ecranTitre(ecran, (C.pause || {}).titre || 'Petite pause<br>en cours', 190); },
    fin(ecran) { ecranTitre(ecran, (C.fin || {}).titre || 'Merci d\'être<br>passés !', 170); },

    demarrage(ecran) {
      const D = C.demarrage || {};
      ecranTitre(ecran, null);
      Composants.titre(ecran, { x: CONTENU.x, y: CONTENU.y + 40, l: CONTENU.l, h: 260 }, D.titre || 'Ça commence bientôt', 100);
      const compte = Composants.titre(ecran, { x: CONTENU.x, y: CONTENU.y + 300, l: CONTENU.l, h: 400 }, '', 270);
      const duree = Math.max(1, parseFloat(p.get('minutes') ?? D.minutes ?? 10) * 60);
      const debut = Date.now();
      (function tic() {
        const reste = duree - (Date.now() - debut) / 1000;
        if (reste <= 0) { compte.innerHTML = D.finCompte || 'C\'est parti !'; compte.style.fontSize = '170px'; return; }
        compte.textContent = Commun.mmss(Math.ceil(reste));
        setTimeout(tic, 250);
      })();
    },
  };

  function ecranTitre(ecran, texte, taille) {
    Composants.fond(ecran, [CONTENU]);
    Composants.zoneApercu(ecran, CONTENU, p.has('apercu') ? 'Ton image' : '', 'jeu');
    Composants.voile(ecran, CONTENU);
    Composants.exterieur(ecran);
    Composants.cadre(ecran, CONTENU);
    if (texte) Composants.titre(ecran, CONTENU, texte, taille);
    Composants.chat(ecran, CHAT);
  }

  function construire(nom) {
    Commun.demarrer();
    const ecran = document.getElementById('ecran');
    dispositions[nom](ecran);
  }

  return { construire, CHAT, CONTENU };
})();
