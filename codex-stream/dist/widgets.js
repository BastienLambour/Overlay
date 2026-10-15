/* =====================================================================
   WIDGETS — le petit commun des pages de widgets : lire l'adresse, appliquer les couleurs, se brancher.
   Paramètres d'adresse communs :
     cle=…          la clé spectateur de la table (OBLIGATOIRE, sauf demo=1)
     theme=neon     neon | conte | mission | comics : couleurs, police et filtre d'un coup (les paramètres ci-dessous passent avant)
     filtre=neon    sticker | ecusson | vitrail | aplat | neon | conte (le dessin des personnages)
     moi=Kenai      « mon » personnage (sa carte marquée « toi », ses jets mis en avant)
     accent=1EE88A  fond=0E1014  texte=F2F5F3  police=Bungee   (couleurs sans #)
     demo=1         une partie inventée, pour essayer sans CodexVTT
     adresse=…      l'adresse de CodexVTT si la page n'est pas servie par lui
   ===================================================================== */
import { CodexStream } from './codex-stream.js';

export const params = new URLSearchParams(location.search);
export function demarrer() {
  const r = document.documentElement.style;
  const theme = CodexStream.theme(params.get('theme')) || {};
  const couleur = k => { const v = params.get(k); return v && /^[0-9a-f]{3,8}$/i.test(v) ? '#' + v : (v || theme[k] || ''); };
  if (couleur('accent')) r.setProperty('--cs-accent', couleur('accent'));
  if (couleur('fond')) r.setProperty('--cs-fond', couleur('fond'));
  if (couleur('texte')) r.setProperty('--cs-texte', couleur('texte'));
  if (params.get('police') || theme.police) {
    const p = params.get('police') || theme.police;
    const l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(p)}:wght@400;700;900&display=swap`;
    document.head.appendChild(l);
    r.setProperty('--cs-police', `'${p}', system-ui, sans-serif`);
  }
  const demo = params.get('demo') === '1';
  if (!demo && !params.get('cle')) {
    const m = document.createElement('div'); m.className = 'cs-message';
    m.textContent = 'Il manque la clé de la table (cle=… dans l’adresse) : copie l’adresse depuis CodexVTT › labo › Sources pour OBS.';
    document.body.appendChild(m);
  }
  return CodexStream.brancher({
    adresse: params.get('adresse') || location.origin, cle: params.get('cle') || '', demo,
    filtre: params.get('filtre') || theme.filtre || 'aplat', monPerso: params.get('moi') || '', accent: couleur('accent') || '',
  });
}
export const echapper = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
