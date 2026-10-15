# codex-stream : la boîte à outils de stream de CodexVTT

Les personnages de la partie, **dessinés**, dans OBS. Le module lit la table CodexVTT en **mode spectateur** (lecture
seule : aucun effet sur l'application ni sur les joueurs) et fournit :

- des **widgets** prêts à coller dans OBS (source Navigateur, fond transparent) : n'importe quel streamer, même avec un
  OBS vierge ;
- un **module JS** (`codex-stream.js`) pour ceux qui fabriquent leur propre overlay (nos overlays de la famille, par exemple).

Le **filtre** (`aplat`, `neon`, `sticker`, `ecusson`, `vitrail`) choisit la façon de dessiner. L'**apparence** d'un
personnage (cheveux, peau, tenue…) est la même partout : elle est enregistrée dans CodexVTT et liée à sa fiche
(labo › Personnages, réservé au MJ).

## Dossier

```
codex-stream/
├── construire.mjs       ← node construire.mjs : src/ → dist/codex-stream.js (+ copie widgets/ dans dist/)
├── src/                 ← les sources (c'est ICI qu'on modifie)
│   apparence.js  (la fiche d'apparence → calques SVG ; copie de _modele/js/apparence.js)
│   exemples.js   (les persos de la démo ; copie de _modele/js/persos.js)
│   filtres.js    (Filtres : une façon de dessiner chaque calque)
│   scenette.js   (le personnage qui joue un jet : geste puis réaction)
│   coeur.js      (CodexStream : connexion spectateur, lecture des jets, portraits, démo)
├── widgets/             ← les pages pour OBS (sources)
└── dist/                ← CE QU'ON LIVRE à CodexVTT (codex-web/public/stream/), ne pas modifier à la main
```

Aperçu : serveur `codex-stream` de `.claude/launch.json` (port 5510) → http://localhost:5510/demo.html

## Livraison à CodexVTT

1. `node construire.mjs` (la version = date + commit, écrite en tête de `dist/codex-stream.js`).
2. Copier **tout** `dist/` dans `codex-web/public/stream/` : les pages sont servies à `https://<codexvtt>/stream/…`.
3. Le serveur spectateur de CodexVTT doit envoyer le champ facultatif `appearance` dans `state.characters` et
   `character` (déjà fait sur la branche `developp`).

Rien d'autre côté CodexVTT : pas d'Angular, pas de build ; les pages sont statiques.
CodexVTT fait un commit par version (le numéro de l'en-tête). Sur le VPS, un fichier absent sous `/stream/` renvoie la page
du site (HTML, code 200) : un script manquant donne une erreur de type MIME, pas un 404 → toujours recopier TOUT `dist/`.
La page du labo « Sources pour OBS » (`/labo/sources`, MJ) fabrique les adresses ; `pnj`, `disposition`, `persos`, les
couleurs et la police n'y sont pas encore (étape des thèmes).

## Les widgets (sources Navigateur dans OBS)

Adresse : `https://<codexvtt>/stream/<page>.html?cle=<clé spectateur>&filtre=sticker&moi=Kenai`

| Page | Ce qu'elle montre | Taille OBS | Paramètres propres |
|---|---|---|---|
| `table.html` | une carte par personnage (dessin, nom, PV, « toi », « son tour ») | 1920 × 200 (colonne : 420 × 900) | `persos=Kenai,Zokhran` (lesquels, dans l'ordre) · `disposition=colonne` |
| `perso.html` | UN personnage en grand, animé (il parle, tombe K.O., change de forme) | 400 × 500 | `perso=Kenai` (nom ou id de fiche) · `nom=0` · `cadrage=tete` |
| `jets.html` | le résultat de chaque jet, un à la fois | 500 × 300 | `seulement=moi` · `pnj=1` · `duree=4` |
| `scenette.html` | le personnage qui joue chaque jet (court, lance un sort…) puis réagit | 500 × 500 | `cadre=1` · `pnj=1` · `seulement=moi` · `duree=4` |
| `combat.html` | l'ordre d'initiative, le tour en cours | 360 × 600 | `pnj=0` |
| `demo.html` | la galerie de tous les widgets, avec le choix du filtre (pas pour OBS) | — | `filtre=…` |

Paramètres communs (toutes les pages) :

- `cle=…` : la clé spectateur de la table. **Obligatoire**, sauf `demo=1`. C'est un SECRET : ne pas montrer l'adresse
  à l'écran.
- `filtre=aplat|neon|sticker|ecusson|vitrail` : le dessin.
- `moi=Kenai` : « mon » personnage (nom ou id de fiche).
- Couleurs sans `#` : `accent=1EE88A`, `fond=0E1014`, `texte=F2F5F3`.
- `police=Bungee` : une police Google Fonts.
- `demo=1` : une partie inventée, pour essayer sans CodexVTT.
- `adresse=https://…` : l'adresse de CodexVTT, si la page n'est pas servie par lui.

Pour aller plus loin sans code : la case « CSS personnalisé » de la source OBS. Toutes les classes commencent par
`.cs-` (`.cs-carte`, `.cs-nom`, `.cs-pv`, `.cs-jet`, `.cs-chiffre`, `.cs-mot`, `.cs-scenette`…), et les couleurs
sont des variables : `--cs-accent`, `--cs-fond`, `--cs-texte`, `--cs-police`, `--cs-rayon`.

## Le module (pour un overlay fait maison)

```html
<script type="module">
  import { CodexStream } from 'https://<codexvtt>/stream/codex-stream.js';
  const cs = CodexStream.brancher({ adresse: 'https://<codexvtt>', cle: '…', filtre: 'neon', monPerso: 'Kenai' });
  cs.on('table', persos => …);          // [{ id, nom, pv, pvMax, aTerre, forme, apparence, joueur, moi }]
  cs.on('jet', jet => …);               // { persoId, nom, libelle, formule, resultat, dd, des, faces, verdict, geste, mot, pnj, moi }
  cs.on('perso', perso => …);           // un perso change (PV, forme, apparence)
  cs.on('coup', (perso, delta) => …);   // delta < 0 : un coup ; > 0 : un soin
  cs.on('combat', c => …);              // { tour, actif, ordre: [{ id, nom, init, pnj, persoId }] } ou null
  cs.on('parle', (perso, oui) => …);    // qui parle (relayé par cs.parle, par ex. depuis un bot Discord)
  cs.on('etat', e => …);                // 'connexion' | 'en-ligne' | 'refusee' | 'revoquee' | 'hors-ligne' | 'demo'

  const p = cs.portrait(element, persoId, { cadrage: 'buste' });   // dessiné et animé tout seul ; p.detruire()
  const s = cs.scenette(element, { duree: 4000, pnj: false });     // joue chaque jet dans element ; s.detruire()
  cs.dessin(persoId, { expression: 'rire' });                      // → <svg> (texte)
  cs.fermer();
</script>
```

Aussi exportés : `Apparence` (la fiche → calques), `Filtres` (`Filtres.liste`, `Filtres.rendu(id, fiche, options)`),
`VERSION`. Le client Socket.IO est chargé à côté du module (`socket.io.min.js`), sauf si la page a déjà `window.io`.

**Vocabulaire des jets** :
- `verdict` : `crit` | `fumble` | `ok` | `rate` | `''`.
- `geste` (d'après la compétence) : `courir`, `grimper`, `cacher`, `crocheter`, `lire`, `observer`, `parler`,
  `menacer`, `danser`, `parer`, `sort`, `tirer`, `frapper`, `soigner`, `garde`, `neutre`.
- `mot` : « Réussite ! », « Touché ! », « Critique ! »…

Un personnage sans apparence est dessiné en aventurier encapuchonné, à une couleur tirée de son nom.

## Testé / pas testé

- Testé : la démo (`demo=1`) de chaque widget dans les 5 filtres, sans erreur ; les 150 rendus (5 filtres
  × 6 persos × 5 expressions) sous Node.
- Testé par CodexVTT sur une vraie table (serveur de dev, branche `developp`) : connexion spectateur, `state`, un jet du MJ
  affiché par `jets.html?pnj=1`, sans erreur.
- PAS testé : de vraies cartes de persos (la table d'essai n'avait aucun perso de joueur), le combat, OBS.
