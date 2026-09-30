/* =====================================================================
   Transforme les documents Markdown de l'overlay en PDF mis en page.

   Utilisation (dans le dossier de l'overlay) :
       node outils/generer-pdf.mjs                → TUTO.pdf et CONCEPT.pdf
       node outils/generer-pdf.mjs TUTO.md        → seulement celui-ci
       APERCU=<dossier> node outils/generer-pdf.mjs  → capture PNG de chaque page, pour vérifier

   Les .md restent les fichiers sources (c'est eux qu'on modifie) ; les PDF
   sont faits pour être lus et envoyés. Couleur d'accent et police des titres
   reprises de css/theme.css. Nécessite : Microsoft Edge (installé avec Windows).

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
   ===================================================================== */
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 9336;
const fichiers = process.argv.slice(2).length ? process.argv.slice(2) : ['TUTO.md', 'CONCEPT.md'];

// ---------- Couleurs et police du thème ----------
const theme = existsSync(join(RACINE, 'css', 'theme.css')) ? readFileSync(join(RACINE, 'css', 'theme.css'), 'utf8') : '';
const variable = nom => (theme.match(new RegExp(`--${nom}:\\s*([^;]+);`)) || [])[1]?.trim();
const accent = (variable('accent') || '#3A9AD9').split(/\s/)[0];
const policeTitre = variable('f-titre') || 'sans-serif';
// Texte en Nunito (chargée depuis internet) ; hors ligne, la police de texte du thème prend le relais (elle est locale)
const policeTexte = `'Nunito', ${variable('f-texte') || 'sans-serif'}`;
const importPolices = (theme.match(/@import url\([^)]+\);/) || [''])[0];
// Polices locales déclarées dans theme.css (@font-face, fichiers dans assets/polices/) : chemins rendus
// absolus, car la page du PDF est fabriquée dans un dossier temporaire (sinon titres en police de secours)
const policesLocales = (theme.match(/@font-face\s*\{[^}]*\}/g) || []).map(bloc =>
  bloc.replace(/url\((['"]?)([^'")]+)\1\)/g, (tout, q, u) => /^(https?:|data:|file:)/.test(u) ? tout : `url('${pathToFileURL(join(RACINE, 'css', u)).href}')`)).join('\n');
let config = {};
try { const s = readFileSync(join(RACINE, 'config.js'), 'utf8'); const w = {}; new Function('window', s)(w); config = w.CONFIG || {}; } catch {}
const nomChaine = config.nomChaine || basename(RACINE);

// ---------- Markdown → HTML (juste ce qu'utilisent nos documents) ----------
const echap = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ancre = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
function enLigne(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(echap(c)) - 1}\u0000`);
  s = echap(s)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}
function markdown(md) {
  const lignes = md.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  const liste = (debut) => {           // listes, avec un niveau d'imbrication par tranche de 2-3 espaces
    const pile = [];
    while (i < lignes.length) {
      const m = lignes[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (!m) {
        if (lignes[i].trim() === '' || !/^\s{2,}\S/.test(lignes[i])) break;
        out.push(' ' + enLigne(lignes[i].trim())); i++; continue;   // suite de l'élément précédent
      }
      const niveau = Math.floor(m[1].length / 2), type = /\d/.test(m[2]) ? 'ol' : 'ul';
      while (pile.length > niveau + 1) out.push(`</li></${pile.pop()}>`);
      if (pile.length < niveau + 1) { out.push(type === 'ol' && parseInt(m[2]) > 1 ? `<ol start="${parseInt(m[2])}">` : `<${type}>`); pile.push(type); } else out.push('</li>');
      out.push(`<li>${enLigne(m[3]).replace(/^\[ \]\s*/, '☐ ').replace(/^\[x\]\s*/i, '☑ ')}`);
      i++;
    }
    while (pile.length) out.push(`</li></${pile.pop()}>`);
  };
  while (i < lignes.length) {
    const l = lignes[i];
    if (/^```/.test(l)) {
      const bloc = []; i++;
      while (i < lignes.length && !/^```/.test(lignes[i])) bloc.push(lignes[i++]);
      i++; out.push(`<pre>${echap(bloc.join('\n'))}</pre>`); continue;
    }
    let m;
    if ((m = l.match(/^(#{1,4})\s+(.*)$/))) {
      const n = m[1].length; out.push(`<h${n} id="${ancre(m[2])}">${enLigne(m[2])}</h${n}>`); i++; continue;
    }
    if (/^\s*(---|\*\*\*)\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (/^\s*\|/.test(l) && /^\s*\|?\s*:?-+/.test(lignes[i + 1] || '')) {
      const cellules = s => s.trim().replace(/^\||\|$/g, '').split('|').map(c => enLigne(c.trim()));
      const entete = cellules(l);
      out.push('<table>' + (entete.some(c => c) ? '<thead><tr>' + entete.map(c => `<th>${c}</th>`).join('') + '</tr></thead>' : '') + '<tbody>');
      i += 2;
      while (i < lignes.length && /^\s*\|/.test(lignes[i])) out.push('<tr>' + cellules(lignes[i++]).map(c => `<td>${c}</td>`).join('') + '</tr>');
      out.push('</tbody></table>'); continue;
    }
    if (/^>\s?/.test(l)) {
      const bloc = [];
      while (i < lignes.length && /^>\s?/.test(lignes[i])) bloc.push(lignes[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${markdown(bloc.join('\n'))}</blockquote>`); continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(l)) { liste(); continue; }
    if (l.trim() === '') { i++; continue; }
    const para = [];
    while (i < lignes.length && lignes[i].trim() !== '' && !/^(#{1,4}\s|```|>|\s*([-*]|\d+\.)\s|\s*\|)/.test(lignes[i])) para.push(lignes[i++].trim());
    out.push(`<p>${para.map(enLigne).join('<br>')}</p>`);   // un retour à la ligne = une nouvelle ligne
  }
  return out.join('\n');
}

const page = (titre, corps) => `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${echap(titre)}</title>
<style>
  ${importPolices}
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&family=JetBrains+Mono:wght@500&display=swap');
  ${policesLocales}
  @page { size: A4; margin: 18mm 16mm 20mm; }
  :root { --accent: ${accent}; }
  * { box-sizing: border-box; }
  body { font: 500 10.5pt/1.55 ${policeTexte}, 'Segoe UI', sans-serif; color: #1d232b; margin: 0; }
  .couverture { border-left: 8px solid var(--accent); padding: 4px 0 4px 18px; margin-bottom: 26px; }
  .couverture span { font: 800 9pt ${policeTexte}; letter-spacing: .18em; text-transform: uppercase; color: #6b7480; }
  h1 { font: 800 26pt/1.1 ${policeTitre}; margin: 4px 0 0; color: #10151c; }
  h2 { font: 800 16pt/1.2 ${policeTitre}; margin: 26px 0 10px; padding-bottom: 5px; border-bottom: 3px solid var(--accent); break-after: avoid; }
  h3 { font: 800 12.5pt ${policeTexte}; margin: 18px 0 6px; color: #10151c; break-after: avoid; }
  h4 { font: 800 11pt ${policeTexte}; margin: 14px 0 4px; break-after: avoid; }
  h2 + *, h3 + *, h4 + * { break-before: avoid; }
  p, li { margin: 5px 0; }
  ul, ol { padding-left: 20px; margin: 6px 0; }
  a { color: inherit; text-decoration-color: var(--accent); }
  b { color: #10151c; }
  code { font: 500 9pt 'JetBrains Mono', Consolas, monospace; background: #eef0f3; padding: 1px 5px; border-radius: 4px; overflow-wrap: anywhere; }
  pre { font: 500 9pt/1.5 'JetBrains Mono', Consolas, monospace; background: #f3f4f6; border-left: 4px solid var(--accent);
    padding: 10px 14px; border-radius: 4px; white-space: pre-wrap; break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 12px; font-size: 9.5pt; break-inside: avoid; }
  th { text-align: left; background: #f3f4f6; font-weight: 800; }
  th, td { border: 1px solid #dde1e6; padding: 6px 9px; vertical-align: top; }
  blockquote { margin: 10px 0; padding: 8px 14px; background: color-mix(in srgb, var(--accent) 10%, #fff); border-left: 4px solid var(--accent); border-radius: 4px; break-inside: avoid; }
  blockquote p { margin: 3px 0; }
  hr { border: 0; height: 0; margin: 14px 0; }
</style></head><body>
<div class="couverture"><span>${echap(nomChaine)} · overlay Twitch</span></div>
${corps}
</body></html>`;

// ---------- Edge sans fenêtre ----------
// Edge (installé avec Windows), ou un autre navigateur Chromium indiqué par la variable NAVIGATEUR (Chrome, Chromium…)
const EDGE = [process.env.NAVIGATEUR, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe']
  .find(p => p && existsSync(p));
if (!EDGE) { console.error('Microsoft Edge introuvable.'); process.exit(1); }
const attendre = ms => new Promise(r => setTimeout(r, ms));
const temp = mkdtempSync(join(tmpdir(), 'overlay-pdf-'));
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(temp, 'profil')}`,
  '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let cible;
for (let i = 0; i < 50 && !cible; i++) {
  await attendre(200);
  try { cible = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(t => t.type === 'page'); } catch {}
}
if (!cible) { console.error('Impossible de piloter Edge.'); edge.kill(); process.exit(1); }
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0;
const attentes = new Map(), ecouteurs = [];
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && attentes.has(m.id)) { attentes.get(m.id)(m); attentes.delete(m.id); }
  else ecouteurs.forEach(f => f(m));
});
const cdp = (method, params = {}) => new Promise((ok, ko) => {
  const n = ++id;
  attentes.set(n, m => m.error ? ko(new Error(m.error.message)) : ok(m.result));
  ws.send(JSON.stringify({ id: n, method, params }));
});
await cdp('Page.enable');

for (const f of fichiers) {
  const source = join(RACINE, f);
  if (!existsSync(source)) { console.log(`  ${f} : introuvable, ignoré`); continue; }
  const html = join(temp, basename(f, '.md') + '.html');
  writeFileSync(html, page(`${nomChaine} — ${basename(f, '.md')}`, markdown(readFileSync(source, 'utf8'))));
  const charge = new Promise(r => ecouteurs.push(m => m.method === 'Page.loadEventFired' && r()));
  await cdp('Page.navigate', { url: pathToFileURL(html).href });
  await charge;
  await cdp('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
  await attendre(300);
  const { data } = await cdp('Page.printToPDF', { printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: `<div style="font:8px sans-serif;color:#8a929c;width:100%;text-align:center">${echap(nomChaine)} — ${basename(f, '.md')} · page <span class="pageNumber"></span> / <span class="totalPages"></span></div>` });
  // Vérification visuelle : APERCU=<dossier> y enregistre une capture de la page mise en forme
  if (process.env.APERCU) {
    await cdp('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
    const { data: png } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: 794, height: await cdp('Runtime.evaluate', { expression: 'document.body.scrollHeight', returnByValue: true }).then(r => r.result.value), scale: 1 } });
    writeFileSync(join(process.env.APERCU, basename(f, '.md') + '.png'), Buffer.from(png, 'base64'));
    await cdp('Emulation.clearDeviceMetricsOverride');
  }
  const sortie = join(RACINE, basename(f, '.md') + '.pdf');
  writeFileSync(sortie, Buffer.from(data, 'base64'));
  console.log(`  → ${sortie}`);
}

ws.close();
edge.kill();
await attendre(500);
try { rmSync(temp, { recursive: true, force: true }); } catch {}
