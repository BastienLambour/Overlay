/* =====================================================================
   LOGOS DES RÉSEAUX — pour les panneaux de bio du kit (chaine/kit.html).
   Un panneau dont le titre est le nom d'un réseau (Discord, YouTube, TikTok,
   Instagram, X / Twitter, Twitch, Kick, Bluesky…) prend son logo, d'une seule couleur
   (currentColor : la couleur du thème), à la place de l'icône du thème.

     Reseaux.svg('Discord', 64)   → <svg> du logo, ou '' si le titre n'est pas un réseau

   Logos simplifiés, dessinés pour rester lisibles en petit (viewBox 32 × 32).
   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/chaine/).
   ===================================================================== */
window.Reseaux = (() => {
  const LOGOS = {
    discord: '<path fill="currentColor" fill-rule="evenodd" d="M6.5 8.2 C9.2 6.9 11.6 6.2 12.4 6.1 L13.2 7.7 C15.1 7.4 16.9 7.4 18.8 7.7 L19.6 6.1 C20.4 6.2 22.8 6.9 25.5 8.2 C28.2 12.3 29.3 16.7 28.9 21.3 C26.7 23 24.5 24 22.4 24.6 L20.9 22.3 C22 21.9 23.1 21.4 24 20.8 L23.4 20.3 C18.6 22.5 13.4 22.5 8.6 20.3 L8 20.8 C8.9 21.4 10 21.9 11.1 22.3 L9.6 24.6 C7.5 24 5.3 23 3.1 21.3 C2.7 16.7 3.8 12.3 6.5 8.2 Z M12.2 13.6 C10.9 13.6 9.9 14.8 9.9 16.2 C9.9 17.6 10.9 18.8 12.2 18.8 C13.5 18.8 14.5 17.6 14.5 16.2 C14.5 14.8 13.5 13.6 12.2 13.6 Z M19.8 13.6 C18.5 13.6 17.5 14.8 17.5 16.2 C17.5 17.6 18.5 18.8 19.8 18.8 C21.1 18.8 22.1 17.6 22.1 16.2 C22.1 14.8 21.1 13.6 19.8 13.6 Z"/>',
    youtube: '<path fill="currentColor" fill-rule="evenodd" d="M8 7 H24 C27.3 7 30 9.7 30 13 V19 C30 22.3 27.3 25 24 25 H8 C4.7 25 2 22.3 2 19 V13 C2 9.7 4.7 7 8 7 Z M13 11.5 V20.5 L21 16 Z"/>',
    tiktok: '<path fill="currentColor" d="M17 3.5 H21.2 C21.6 6.6 23.6 8.7 26.8 9 V13.2 C24.7 13.2 22.8 12.6 21.2 11.5 V20.2 C21.2 24.4 17.8 27.8 13.6 27.8 C9.4 27.8 6 24.4 6 20.2 C6 16 9.4 12.6 13.6 12.6 C14 12.6 14.4 12.6 14.8 12.7 V17 C14.4 16.9 14 16.8 13.6 16.8 C11.7 16.8 10.2 18.3 10.2 20.2 C10.2 22.1 11.7 23.6 13.6 23.6 C15.5 23.6 17 22.1 17 20.2 Z"/>',
    instagram: '<rect x="4" y="4" width="24" height="24" rx="7" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="16" cy="16" r="5.5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="23" cy="9" r="1.8" fill="currentColor"/>',
    x: '<path fill="currentColor" d="M4 4.5 H11 L28 27.5 H21 Z"/><path d="M26.5 4.5 L5.5 27.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
    twitch: '<path fill="currentColor" fill-rule="evenodd" d="M7 3 L4 8 V26 H10 V30 H14 L18 26 H23 L29 20 V3 Z M8 6 H26 V18.5 L22 22.5 H17 L13 26.5 V22.5 H8 Z M14 10 H17 V17 H14 Z M20.5 10 H23.5 V17 H20.5 Z"/>',
    kick: '<path fill="currentColor" d="M5 4 H12 V11 H15 V7.5 H18.5 V4 H27 V12 H23.5 V15.5 H20 V16.5 H23.5 V20 H27 V28 H18.5 V24.5 H15 V21 H12 V28 H5 Z"/>',
    bluesky: '<path fill="currentColor" d="M8.4 5.6 C11.6 8 15 12.8 16 15.2 C17 12.8 20.4 8 23.6 5.6 C25.9 3.9 29.6 2.6 29.6 6.8 C29.6 7.6 29.1 13.8 28.9 15.9 C28 19.6 24.2 20.5 20.8 20 C26.7 21 28.2 24.3 25 27.6 C18.8 33.9 16.1 26 16 24.6 C15.9 26 13.2 33.9 7 27.6 C3.8 24.3 5.3 21 11.2 20 C7.8 20.5 4 19.6 3.1 15.9 C2.9 13.8 2.4 7.6 2.4 6.8 C2.4 2.6 6.1 3.9 8.4 5.6 Z"/>',
  };
  // Titre de panneau → réseau (minuscules, sans accents ni espaces)
  const NOMS = { discord: 'discord', youtube: 'youtube', tiktok: 'tiktok', instagram: 'instagram', insta: 'instagram',
    x: 'x', twitter: 'x', xtwitter: 'x', twitterx: 'x', twitch: 'twitch', kick: 'kick', bluesky: 'bluesky' };
  const cle = titre => NOMS[String(titre || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')] || '';
  return {
    cle,
    svg(titre, taille = 64, style = '') {
      const c = cle(titre);
      return c ? `<svg viewBox="0 0 32 32" width="${taille}" height="${taille}" style="display:block;overflow:visible;${style}">${LOGOS[c]}</svg>` : '';
    },
  };
})();
