/* =====================================================================
   SCÈNES — toutes les mises en page, au même endroit.
   Les zones { x, y, l, h } sont les emplacements des sources OBS
   (webcam, jeu, contenu, manette, LiveSplit…) : voir le tableau dans TUTO.md.

   Trois dispositions :
   • GRANDE  (demarrage, pause, fin, cam-seule) : pseudo en haut, grand cadre,
     ligne des derniers événements en bas, chat à droite.
   • PETITE  (contenu, speedrun) : colonne à gauche (manette/cam en haut,
     LiveSplit ou chat en bas), pseudo + grand cadre + derniers à droite.
   • JEU     : jeu plein écran, cadre au ras des bords. Le cadre de la webcam
     ET le pseudo (petit encadré sur le grand cadre) sont une source à part,
     sources/cam.html, pour disparaître avec le groupe de la cam dans OBS.
   Dans les trous sans source, on voit sources/fond.html (le même fond, synchronisé).
   ===================================================================== */
const Scenes = (() => {
  const C = window.CONFIG || {};
  const p = Commun.params;

  // ---------- Disposition GRANDE ----------
  const GRANDE = {
    titre:    { x: 45, y: 26, l: 1380, h: 96 },
    cadre:    { x: 45, y: 130, l: 1380, h: 776 },    // 16:9
    derniers: { x: 45, y: 940, l: 1380, h: 90 },
    chat:     { x: 1460, y: 45, l: 415, h: 990 },
  };
  // ---------- Disposition PETITE ----------
  const PETITE = {
    haut:     { x: 45, y: 45, l: 380, h: 285 },      // manette ou webcam
    bas:      { x: 45, y: 360, l: 380, h: 675 },     // LiveSplit ou chat
    titre:    { x: 460, y: 26, l: 1415, h: 96 },
    cadre:    { x: 460, y: 128, l: 1415, h: 796 },   // 16:9
    derniers: { x: 460, y: 948, l: 1415, h: 87 },
  };
  // ---------- Webcam de la scène Jeu (même calcul que sources/cam.html) ----------
  const CAM_L = 320, CAM_H = 300, CAM_ECART = 56;
  function zoneCam(coin) {
    const droite = coin.includes('droite'), bas = coin.includes('bas');
    return { x: droite ? 1920 - CAM_ECART - CAM_L : CAM_ECART, y: bas ? 1080 - CAM_ECART - CAM_H : CAM_ECART, l: CAM_L, h: CAM_H, droite, bas };
  }

  const pseudo = (ecran, z) => Composants.titre(ecran, z, C.nomChaine || '', 80);
  const avecChat = () => p.get('chat') !== '0';

  // Grande scène, avec ou sans message au centre
  function grande(ecran, { message = '', taille = 170, voile = false } = {}) {
    const G = GRANDE;
    Composants.fond(ecran, [G.cadre]);
    Composants.zoneApercu(ecran, G.cadre, p.has('apercu') || Composants.zones ? 'Ta source (cam, image, contenu…)' : '', 'jeu');
    if (voile) Composants.voile(ecran, G.cadre);
    Composants.exterieur(ecran);
    pseudo(ecran, G.titre);
    Composants.cadre(ecran, G.cadre);
    Composants.derniers(ecran, G.derniers);
    if (avecChat()) Composants.chat(ecran, G.chat);
    else Composants.cadre(ecran, G.chat, { verre: true });
    if (message) return Composants.titre(ecran, G.cadre, message, taille);
  }

  const dispositions = {
    // ----- Grande scène -----
    'cam-seule'(ecran) { grande(ecran); },
    pause(ecran) { grande(ecran, { message: p.get('message') || (C.pause || {}).titre || 'Petite pause<br>en cours', taille: 190, voile: true }); },
    fin(ecran) { grande(ecran, { message: p.get('message') || (C.fin || {}).titre || 'Merci d\'être<br>passés !', taille: 170, voile: true }); },
    demarrage(ecran) {
      const D = C.demarrage || {}, G = GRANDE.cadre;
      grande(ecran, { voile: true });
      Composants.titre(ecran, { x: G.x, y: G.y + 40, l: G.l, h: 260 }, p.get('message') || D.titre || 'Ça commence bientôt', 100);
      const compte = Composants.titre(ecran, { x: G.x, y: G.y + 300, l: G.l, h: 400 }, '', 270);
      // ?minutes= dans l'adresse  >  heure fixe (?heure=20:30, puis config.js › demarrage.heure)  >  demarrage.minutes
      const heure = !p.has('minutes') && (p.get('heure') || D.heure);
      const minutesJusqua = h => { const [H, M] = String(h).split(':').map(Number); const c = new Date(); c.setHours(H, M || 0, 0, 0); return Math.max(0, (c - Date.now()) / 60000); };
      const duree = Math.max(1, (heure ? minutesJusqua(heure) : parseFloat(p.get('minutes') ?? D.minutes ?? 10)) * 60);
      const debut = Date.now();
      (function tic() {
        const reste = duree - (Date.now() - debut) / 1000;
        if (reste <= 0) { compte.innerHTML = D.finCompte || 'C\'est parti !'; compte.style.fontSize = '170px'; return; }
        compte.textContent = Commun.mmss(Math.ceil(reste));
        setTimeout(tic, 250);
      })();
    },

    // ----- Petite scène -----
    contenu(ecran) { petite(ecran, 'Contenu'); },
    speedrun(ecran) { petite(ecran, 'Jeu'); },

    // ----- Jeu plein écran -----
    jeu(ecran) {
      const coin = p.get('cam') || 'haut-gauche';
      const sansCam = coin === '0' || coin === 'aucune';
      const trou = Composants.exterieurProche(ecran);
      Composants.fond(ecran, [trou]);                                // le fond bouche les coins arrondis
      const jeu = Composants.zoneApercu(ecran, { x: 0, y: 0, l: 1920, h: 1080 }, 'Jeu (plein écran)', 'jeu');
      if (jeu) ecran.prepend(jeu);                                   // l'aperçu du jeu reste SOUS le fond
      if (!sansCam && (Composants.apercu || Composants.zones)) Composants.zoneApercu(ecran, zoneCam(coin), 'Webcam + sources/cam.html');
      // Le pseudo est dans sources/cam.html (il disparaît avec le groupe de la cam).
      // Sans webcam, il n'y a pas de groupe : le pseudo reste ici, en haut à gauche.
      if (sansCam) { const cam = zoneCam('haut-gauche'); Composants.etiquettePseudo(ecran, { centreX: cam.x + cam.l / 2, enHaut: true }); }
    },
  };

  function petite(ecran, nomCadre) {
    const P = PETITE;
    const chat = avecChat();
    Composants.fond(ecran, chat ? [P.cadre, P.haut] : [P.cadre, P.haut, P.bas]);
    Composants.zoneApercu(ecran, P.cadre, nomCadre + ' / fenêtre', 'jeu');
    Composants.zoneApercu(ecran, P.haut, 'Manette ou webcam');
    if (!chat) Composants.zoneApercu(ecran, P.bas, 'LiveSplit');
    Composants.exterieur(ecran);
    pseudo(ecran, P.titre);
    Composants.cadre(ecran, P.cadre);
    Composants.cadre(ecran, P.haut);
    if (chat) Composants.chat(ecran, P.bas);
    else Composants.cadre(ecran, P.bas);
    Composants.derniers(ecran, P.derniers);
  }

  function construire(nom) {
    Commun.demarrer();
    const ecran = document.getElementById('ecran');
    dispositions[nom](ecran);
  }

  return { construire, GRANDE, PETITE, zoneCam };
})();
