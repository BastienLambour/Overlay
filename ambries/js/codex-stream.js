/* =====================================================================
   CODEX-STREAM 2026-10-15-d19d23c — la boîte à outils de stream de CodexVTT, version CLASSIQUE (un <script> ordinaire).
   FICHIER ASSEMBLÉ par codex-stream/construire.mjs (G:\Projets\Overlay\codex-stream) : ne pas le modifier ici.
   Donne les objets globaux CodexStream, Apparence, Filtres, Scenette (et window.PERSOS, le catalogue provisoire).
   Les overlays s'en servent pour DESSINER les personnages : CodexStream.fiche(perso), CodexStream.dessiner(fiche, { filtre… }),
   CodexStream.Scenette.jouer(…). FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
const VERSION = '2026-10-15-d19d23c';
const BASE_SCRIPT = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || (typeof location !== 'undefined' ? location.href : '');
const SQUELETTE_CSS = "/* =====================================================================\n   SQUELETTE — le moteur des gestes (FICHIER EXTRAIT de patagrain/css/bouffon.css par l'outil de migration, puis maintenu ICI).\n   Le squelette (celui du bouffon de Patagrain et de ses héros) : viewBox 0 -110 400 920, articulations\n     .bf-tout (tout le corps, pivot 200 790) · .bf-haut (le buste, 200 380) · .bf-tete · .bf-cheveux\n     .bf-epaule-g/d (116 | 284, 392) › .bf-coude-g/d (… 470) · .bf-hanche-g/d (176 | 224, 594) › .bf-genou-g/d (… 682)\n   Un GESTE = une classe posée sur un parent du dessin (marche, saute, chute, hop, danse, salut, gj-courir, gj-sort, attaque…).\n   ===================================================================== */\n.bouffon-svg.bouffon-pied g { transform-box: view-box; }\n.bouffon-svg .bf-cheveux { transform-box: view-box; transform-origin: 200px 150px; }\n.bouffon-svg .bf-cheveux { transform-box: view-box; transform-origin: 200px 150px; }\n.poirier .bf-tout { transform-origin: 200px 400px !important; animation: pr-corps 4.4s cubic-bezier(.5,0,.3,1) both; }\n.poirier .bf-epaule-g { animation: pr-bras-g 4.4s ease-in-out both; }\n.poirier .bf-epaule-d { animation: pr-bras-d 4.4s ease-in-out both; }\n.poirier .bf-hanche-g { animation: pr-jambe 4.4s ease-in-out both; }\n.poirier .bf-hanche-d { animation: pr-jambe 4.4s ease-in-out both reverse; }\n.salut .bf-tout { animation: sl-corps 2.4s ease-in-out both; }\n.salut .bf-epaule-d { animation: sl-bras-d 2.4s ease-in-out both; }\n.salut .bf-coude-d { animation: sl-coude-d 2.4s ease-in-out both; }\n.salut .bf-epaule-g { animation: sl-bras-g 2.4s ease-in-out both; }\n.lance .bf-epaule-d { animation: ln-bras 1.2s ease-in-out both; }\n.lance .bf-coude-d { animation: ln-coude 1.2s ease-in-out both; }\n.lance .bf-tout { animation: ln-corps 1.2s ease-in-out both; }\n.lance .bf-haut { transform: rotate(6deg); transition: transform .4s; }\n.au-feu .bf-epaule-g { transform: rotate(18deg); }\n.au-feu .bf-coude-g { transform: rotate(-55deg); }\n.au-feu .bf-epaule-d { transform: rotate(-18deg); transition: transform .8s ease-in-out; }\n.au-feu .bf-coude-d { transform: rotate(55deg); transition: transform .8s ease-in-out; }\n.dodo .bf-haut { animation: dd-tete 3.2s ease-in-out infinite; }\n.dodo .bf-tout { animation: dd-souffle 3.2s ease-in-out infinite; }\n.dodo .bf-cheveux { animation: bf-cheveux 3.2s ease-in-out -.5s infinite; }\n.reveil .bf-tout { animation: rv-saut .9s cubic-bezier(.34, 1.56, .64, 1) both; }\n.reveil .bf-cheveux { animation: bf-cheveux-hop .9s ease-out .05s both; }\n.au-feu .bf-haut { transition: transform .6s; }\n.croque .bf-epaule-d { transform: rotate(68deg); }\n.croque .bf-coude-d { transform: rotate(104.5deg); }\n.guette .bf-tout { animation: gt-corps 6s ease-in-out infinite; }\n.guette.ding .bf-tout { animation: gt-hop .6s var(--rebond, ease) both; }\n.guette.ding .bf-cheveux { animation: bf-cheveux-hop .7s ease-out .05s both; }\n.rappel .bf-epaule-d { transform: rotate(-165deg); }\n.rappel .bf-coude-d { transform: rotate(-4deg); }\n.rappel .bf-epaule-g { animation: rp-salue 1.2s ease-in-out infinite alternate; }\n.rappel .bf-coude-g { transform: rotate(-30deg); }\n.rappel .bf-tout { transform: rotate(-7deg); transform-origin: 328px 228px !important; }\n.rappel .bf-hanche-g { animation: rp-jambe 1.4s ease-in-out infinite alternate; }\n.rappel .bf-hanche-d { animation: rp-jambe 1.4s ease-in-out -.7s infinite alternate; }\n.au-revoir .bf-epaule-d { transform: rotate(-148deg); }\n.au-revoir .bf-coude-d { animation: ar-main .4s ease-in-out infinite alternate; }\n.au-revoir .bf-tout { animation: ar-corps .8s ease-in-out infinite alternate; }\n.hop .bf-tout { animation: hp-saut 1.3s cubic-bezier(.34, 1.4, .64, 1) both; }\n.hop .bf-epaule-g { animation: hp-bras-g 1.3s ease-in-out both; }\n.hop .bf-epaule-d { animation: hp-bras-d 1.3s ease-in-out both; }\n.hop .bf-hanche-g { animation: hp-jambe-g 1.3s ease-in-out both; }\n.hop .bf-hanche-d { animation: hp-jambe-d 1.3s ease-in-out both; }\n.hop .bf-cheveux { animation: bf-cheveux-hop 1.1s ease-out .2s both; }\n.marche .bf-hanche-g { animation: gr-jambe .5s ease-in-out infinite alternate; }\n.marche .bf-hanche-d { animation: gr-jambe .5s ease-in-out -.5s infinite alternate; }\n.marche .bf-epaule-g { animation: gr-bras .5s ease-in-out -.5s infinite alternate; }\n.marche .bf-epaule-d { animation: gr-bras .5s ease-in-out infinite alternate; }\n.marche .bf-tout { animation: gr-pas .25s ease-in-out infinite alternate; }\n.chute .bf-tout { animation: gr-chute 2.6s both; }\n.chute .bf-epaule-g { animation: gr-mouline-g 2.6s ease-in-out both; }\n.chute .bf-epaule-d { animation: gr-mouline-d 2.6s ease-in-out both; }\n.chute .bf-hanche-g { animation: gr-jambe-air 2.6s ease-in-out both; }\n.attaque .bf-epaule-d { animation: gr-attaque .9s cubic-bezier(.5, 0, .3, 1) both; }\n.attaque .bf-tout { animation: gr-fente .9s ease-in-out both; }\n.en-garde .bf-epaule-d { transform: rotate(-40deg); }\n.en-garde .bf-coude-d { transform: rotate(-30deg); }\n.en-garde .bf-epaule-g { transform: rotate(30deg); }\n.en-garde .bf-tout { animation: gr-garde .7s ease-in-out infinite alternate; }\n.saute .bf-tout { animation: gr-saute 1.1s cubic-bezier(.3, .7, .4, 1) both; }\n.saute .bf-hanche-g { animation: gr-replie-g 1.1s ease-in-out both; }\n.saute .bf-hanche-d { animation: gr-replie-d 1.1s ease-in-out both; }\n.saute .bf-epaule-g { animation: hp-bras-g 1.1s ease-in-out both; }\n.bondit .bf-epaule-d { animation: gr-coup-final 1.2s cubic-bezier(.5, 0, .3, 1) both; }\n.bondit .bf-epaule-g { animation: hp-bras-g 1.2s ease-in-out both; }\n.recule .bf-tout { animation: gr-recule .8s cubic-bezier(.3, 1.4, .6, 1) both; }\n.essuie .bf-epaule-d { animation: gr-essuie .45s ease-in-out infinite alternate; }\n.essuie .bf-coude-d { transform: rotate(-4deg); }\n.goute .bf-epaule-d { transform: rotate(180deg); transition: transform .35s ease-out; }\n.goute .bf-coude-d { transform: rotate(-78deg); transition: transform .35s ease-out; }\n.tient-banjo .bf-epaule-g { animation: none; transform: rotate(-3deg); }\n.tient-banjo .bf-coude-g { transform: rotate(104deg); }\n.tient-banjo .bf-epaule-d { animation: none; transform: rotate(-16deg); }\n.tient-banjo .bf-coude-d { transform: rotate(82deg); }\n.gratte .bf-coude-d { animation: gr-gratte .2s ease-in-out infinite alternate; }\n.chante .bf-tout { animation: gr-balance .9s ease-in-out infinite alternate; }\n.chante .bf-haut { animation: gr-tete-chant .9s ease-in-out infinite alternate; }\n.lance .bf-epaule-d { animation: gr-lance .8s cubic-bezier(.5, 0, .3, 1) both; }\n.haussement .bf-epaule-g { transform: rotate(15deg); }\n.haussement .bf-coude-g { transform: rotate(105deg); }\n.haussement .bf-epaule-d { transform: rotate(-15deg); }\n.haussement .bf-coude-d { transform: rotate(-105deg); }\n.haussement .bf-epaule-g, .haussement .bf-epaule-d, .haussement .bf-coude-g, .haussement .bf-coude-d { transition: transform .3s ease-out; }\n.haussement .bf-haut { transform: rotate(-8deg); transition: transform .3s; }\n.haussement .bf-tout { animation: gr-hausse .45s ease-in-out 4 alternate; }\n.pouce .bf-epaule-d { transform: rotate(-150deg); transition: transform .3s cubic-bezier(.3, 1.5, .6, 1); }\n.pouce .bf-coude-d { transform: rotate(-30deg); transition: transform .3s; }\n.pouce .bf-tout { animation: gr-garde .5s ease-in-out infinite alternate; }\n.aie .bf-tout { animation: gr-cloche .3s ease-in-out infinite alternate; }\n.aie .bf-hanche-d { transform: rotate(-70deg); }\n.aie .bf-genou-d { transform: rotate(66deg); }\n.aie .bf-epaule-g { animation: gr-agite-g .3s ease-in-out infinite alternate; }\n.aie .bf-epaule-d { animation: gr-agite-d .3s ease-in-out infinite alternate; }\n.danse .bf-tout { animation: gr-danse .5s ease-in-out infinite alternate; }\n.danse .bf-epaule-g { animation: gr-agite-g .25s ease-in-out infinite alternate; }\n.danse .bf-epaule-d { animation: gr-agite-d .25s ease-in-out -.12s infinite alternate; }\n.danse .bf-hanche-g { animation: gr-jambe .25s ease-in-out infinite alternate; }\n.danse .bf-hanche-d { animation: gr-jambe .25s ease-in-out -.25s infinite alternate; }\n.tient-fiole .bf-epaule-d { animation: none; transform: rotate(30deg); transition: transform .4s ease-in-out; }\n.tient-fiole .bf-coude-d { transform: rotate(110deg); transition: transform .4s ease-in-out; }\n.boit .bf-epaule-d { animation: none; transform: rotate(199deg); transition: transform .45s ease-in-out; }\n.boit .bf-coude-d { transform: rotate(-100deg); transition: transform .45s ease-in-out; }\n.boit .bf-haut { transform: rotate(-10deg); transition: transform .45s; }\n.ballon .bf-tout { animation: gr-ballon 1.1s ease-in-out infinite alternate; }\n.ballon .bf-epaule-g { animation: gr-agite-g .28s ease-in-out infinite alternate; }\n.ballon .bf-epaule-d { animation: gr-agite-d .28s ease-in-out infinite alternate; }\n.ballon .bf-hanche-g { animation: gr-jambe .35s ease-in-out infinite alternate; }\n.ballon .bf-hanche-d { animation: gr-jambe .35s ease-in-out -.35s infinite alternate; }\n.menace .bf-epaule-d { animation: gr-menace .28s ease-in-out infinite alternate; }\n.menace .bf-coude-d { transform: rotate(-50deg); }\n.trepigne .bf-tout { animation: gr-trepigne .2s ease-in-out infinite alternate; }\n.trepigne .bf-hanche-g { animation: gr-jambe .2s ease-in-out infinite alternate; }\n.trepigne .bf-hanche-d { animation: gr-jambe .2s ease-in-out -.2s infinite alternate; }\n.trepigne .bf-epaule-g { transform: rotate(28deg); }\n.trepigne .bf-epaule-d { transform: rotate(-28deg); }\n.boude .bf-epaule-g { transform: rotate(-13deg); }\n.boude .bf-coude-g { transform: rotate(-68deg); }\n.boude .bf-epaule-d { transform: rotate(13deg); }\n.boude .bf-coude-d { transform: rotate(76deg); }\n.boude .bf-haut { transform: rotate(6deg) translateY(6px); transition: transform .3s; }\n.frotte .bf-epaule-g { transform: rotate(-1deg); }\n.frotte .bf-epaule-d { transform: rotate(1deg); }\n.frotte .bf-coude-g { animation: gr-frotte-g .16s ease-in-out infinite alternate; }\n.frotte .bf-coude-d { animation: gr-frotte-d .16s ease-in-out infinite alternate; }\n.chifoumi .bf-epaule-d { animation: gr-chifoumi .45s ease-in-out 3; }\n.chifoumi .bf-coude-d { transform: rotate(-30deg); }\n.montre-main .bf-epaule-d { transform: rotate(-75deg); }\n.montre-main .bf-coude-d { transform: rotate(-20deg); }\n.cavalier .bf-hanche-g { transform: rotate(40deg); }\n.cavalier .bf-genou-g { transform: rotate(-55deg); }\n.cavalier .bf-hanche-d { transform: rotate(-40deg); }\n.cavalier .bf-genou-d { transform: rotate(55deg); }\n.cavalier .bf-tout { animation: gr-garde .55s ease-in-out infinite alternate; }\n.vole .bf-epaule-g { animation: gr-agite-g .2s ease-in-out infinite alternate; }\n.vole .bf-epaule-d { animation: gr-agite-d .2s ease-in-out infinite alternate; }\n.vole .bf-hanche-g { animation: gr-jambe .2s ease-in-out infinite alternate; }\n.vole .bf-hanche-d { animation: gr-jambe .2s ease-in-out -.2s infinite alternate; }\n.vitre .bf-epaule-g { transform: rotate(125deg); }\n.vitre .bf-epaule-d { transform: rotate(-125deg); }\n.vitre .bf-hanche-g { transform: rotate(22deg); }\n.vitre .bf-hanche-d { transform: rotate(-22deg); }\n.pompette .bf-tout { animation: gr-balance .7s ease-in-out infinite alternate; }\n.gj-courir .bf-hanche-g { animation: gr-jambe .22s ease-in-out infinite alternate; }\n.gj-courir .bf-hanche-d { animation: gr-jambe .22s ease-in-out -.22s infinite alternate; }\n.gj-courir .bf-epaule-g { animation: gj-bras-course .22s ease-in-out -.22s infinite alternate; }\n.gj-courir .bf-epaule-d { animation: gj-bras-course .22s ease-in-out infinite alternate; }\n.gj-courir .bf-tout { animation: gj-foulee .11s ease-in-out infinite alternate; }\n.gj-grimper .bf-epaule-g { animation: gj-grimpe-g .45s ease-in-out infinite alternate; }\n.gj-grimper .bf-epaule-d { animation: gj-grimpe-d .45s ease-in-out -.45s infinite alternate; }\n.gj-grimper .bf-hanche-g { animation: gr-jambe .45s ease-in-out infinite alternate; }\n.gj-grimper .bf-hanche-d { animation: gr-jambe .45s ease-in-out -.45s infinite alternate; }\n.gj-cacher .bf-tout, .gj-crocheter .bf-tout { transform: translateY(70px); transition: transform .3s ease-out; }\n.gj-cacher .bf-hanche-g, .gj-crocheter .bf-hanche-g { transform: rotate(30deg); }\n.gj-cacher .bf-genou-g, .gj-crocheter .bf-genou-g { transform: rotate(-64deg); }\n.gj-cacher .bf-hanche-d, .gj-crocheter .bf-hanche-d { transform: rotate(-30deg); }\n.gj-cacher .bf-genou-d, .gj-crocheter .bf-genou-d { transform: rotate(64deg); }\n.gj-cacher .bf-epaule-g { transform: rotate(40deg); }\n.gj-cacher .bf-coude-g { transform: rotate(-112deg); }\n.gj-cacher .bf-epaule-d { transform: rotate(-40deg); }\n.gj-cacher .bf-coude-d { transform: rotate(112deg); }\n.gj-cacher .bf-haut { transform: rotate(5deg) translateY(10px); }\n.gj-crocheter .bf-epaule-g { transform: rotate(3deg); }\n.gj-crocheter .bf-coude-g { transform: rotate(-62deg); }\n.gj-crocheter .bf-epaule-d { transform: rotate(-3deg); }\n.gj-crocheter .bf-coude-d { animation: gj-crochete .16s ease-in-out infinite alternate; }\n.gj-crocheter .bf-haut { transform: rotate(-4deg) translateY(8px); }\n.gj-lire .bf-epaule-g { transform: rotate(16deg); }\n.gj-lire .bf-coude-g { transform: rotate(-100deg); }\n.gj-lire .bf-epaule-d { transform: rotate(-16deg); }\n.gj-lire .bf-coude-d { transform: rotate(100deg); }\n.gj-lire .bf-haut { animation: gj-lit 1.6s ease-in-out infinite alternate; }\n.gj-observer .bf-epaule-d { transform: rotate(150deg); }\n.gj-observer .bf-coude-d { transform: rotate(25deg); }\n.gj-observer .bf-haut { animation: gj-scrute 1.4s ease-in-out infinite alternate; }\n.gj-parler .bf-epaule-d { animation: gj-explique-d .5s ease-in-out infinite alternate; }\n.gj-parler .bf-coude-d { transform: rotate(-70deg); }\n.gj-parler .bf-epaule-g { animation: gj-explique-g .5s ease-in-out -.25s infinite alternate; }\n.gj-parler .bf-coude-g { transform: rotate(60deg); }\n.gj-parler .bf-tout { animation: gr-balance .9s ease-in-out infinite alternate; }\n.gj-sort .bf-epaule-g { transform: rotate(148deg); }\n.gj-sort .bf-coude-g { transform: rotate(-18deg); }\n.gj-sort .bf-epaule-d { transform: rotate(-148deg); }\n.gj-sort .bf-coude-d { transform: rotate(18deg); }\n.gj-sort .bf-tout { animation: gj-eleve .8s ease-in-out infinite alternate; }\n.gj-parer .bf-epaule-g { transform: rotate(-13deg); }\n.gj-parer .bf-coude-g { transform: rotate(-68deg); }\n.gj-parer .bf-epaule-d { transform: rotate(13deg); }\n.gj-parer .bf-coude-d { transform: rotate(76deg); }\n.gj-parer .bf-tout { transform: translateY(24px); transition: transform .2s; }\n.gj-parer .bf-hanche-g { transform: rotate(14deg); }\n.gj-parer .bf-hanche-d { transform: rotate(-14deg); }\n.gj-encaisse .bf-tout { animation: gj-encaisse .6s cubic-bezier(.3, 1.4, .6, 1) both; }\n.gj-soigne .bf-epaule-g { transform: rotate(60deg); transition: transform .4s; }\n.gj-soigne .bf-epaule-d { transform: rotate(-60deg); transition: transform .4s; }\n.gj-soigne .bf-tout { animation: gj-eleve 1s ease-in-out 2 alternate; }\n@keyframes bf-cheveux { 0%, 100% { transform: skewX(3deg); } 50% { transform: skewX(-3deg); } }\n@keyframes bf-cheveux-hop { 0%, 100% { transform: none; } 20% { transform: scaleY(1.05); } 45% { transform: scaleY(.9) skewX(-4deg); } 70% { transform: scaleY(1.04) skewX(3deg); } }\n@keyframes pr-corps { 0% { transform: none; } 18%, 82% { transform: translateY(190px) rotate(180deg); } 100% { transform: none; } }\n@keyframes pr-bras-g { 0% { transform: rotate(0); } 12%, 88% { transform: rotate(168deg); } 100% { transform: rotate(0); } }\n@keyframes pr-bras-d { 0% { transform: rotate(0); } 12%, 88% { transform: rotate(-168deg); } 100% { transform: rotate(0); } }\n@keyframes pr-jambe { 0%, 20%, 80%, 100% { transform: rotate(0); } 35%, 65% { transform: rotate(14deg); } 50% { transform: rotate(-10deg); } }\n@keyframes sl-corps { 0%, 100% { transform: none; } 35%, 70% { transform: scale(1.02, .9); } }\n@keyframes sl-bras-d { 0%, 100% { transform: rotate(0); } 35%, 70% { transform: rotate(40deg); } }\n@keyframes sl-coude-d { 0%, 100% { transform: rotate(0); } 35%, 70% { transform: rotate(75deg); } }\n@keyframes sl-bras-g { 0%, 100% { transform: rotate(0); } 35%, 70% { transform: rotate(65deg); } }\n@keyframes ln-bras { 0% { transform: rotate(0); } 35% { transform: rotate(50deg); } 50% { transform: rotate(-160deg); } 100% { transform: rotate(-150deg); } }\n@keyframes ln-coude { 0% { transform: rotate(0); } 35% { transform: rotate(-60deg); } 50%, 100% { transform: rotate(-5deg); } }\n@keyframes ln-corps { 35% { transform: rotate(3deg); } 55% { transform: rotate(-4deg) translateY(-10px); } 100% { transform: none; } }\n@keyframes dd-tete { 0%, 100% { transform: rotate(4deg) translateY(6px); } 50% { transform: rotate(10deg) translateY(14px); } }\n@keyframes dd-souffle { 50% { transform: scale(1.015, 1.01); } }\n@keyframes rv-saut { 0% { transform: none; } 30% { transform: translateY(-46px) scale(.97, 1.05); } 60% { transform: translateY(0) scale(1.03, .96); } 100% { transform: none; } }\n@keyframes gt-corps { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }\n@keyframes gt-hop { 40% { transform: translateY(-14px); } }\n@keyframes rp-salue { from { transform: rotate(48deg); } to { transform: rotate(78deg); } }\n@keyframes rp-jambe { from { transform: rotate(-9deg); } to { transform: rotate(12deg); } }\n@keyframes ar-main { from { transform: rotate(-32deg); } to { transform: rotate(26deg); } }\n@keyframes ar-corps { from { transform: rotate(-3deg) translateY(0); } to { transform: rotate(3deg) translateY(-6px); } }\n@keyframes hp-saut { 0%, 100% { transform: none; } 15% { transform: translateY(14px) scale(1.04, .94); } 45% { transform: translateY(-90px); } 75% { transform: translateY(0) scale(1.03, .96); } }\n@keyframes hp-bras-g { 0%, 100% { transform: rotate(0); } 30%, 70% { transform: rotate(150deg); } }\n@keyframes hp-bras-d { 0%, 100% { transform: rotate(0); } 30%, 70% { transform: rotate(-150deg); } }\n@keyframes hp-jambe-g { 0%, 100% { transform: rotate(0); } 35%, 60% { transform: rotate(18deg); } }\n@keyframes hp-jambe-d { 0%, 100% { transform: rotate(0); } 35%, 60% { transform: rotate(-18deg); } }\n@keyframes gr-jambe { from { transform: rotate(-14deg); } to { transform: rotate(14deg); } }\n@keyframes gr-bras { from { transform: rotate(-16deg); } to { transform: rotate(16deg); } }\n@keyframes gr-pas { to { transform: translateY(-10px); } }\n@keyframes gr-chute { 0% { transform: none; } 12% { transform: rotate(10deg) translateY(-30px); } 24% { transform: rotate(-14deg) translateY(-50px); }\n  38% { transform: rotate(-90deg) translate(-40px, -20px); animation-timing-function: cubic-bezier(.3, 1.6, .6, 1); } 44% { transform: rotate(-86deg) translate(-40px, -34px); }\n  50%, 78% { transform: rotate(-90deg) translate(-40px, -20px); } 88% { transform: translateY(-80px); } 100% { transform: none; } }\n@keyframes gr-mouline-g { 0% { transform: none; } 8% { transform: rotate(160deg); } 16% { transform: rotate(60deg); } 24% { transform: rotate(170deg); } 38%, 78% { transform: rotate(40deg); } 100% { transform: none; } }\n@keyframes gr-mouline-d { 0% { transform: none; } 8% { transform: rotate(-60deg); } 16% { transform: rotate(-165deg); } 24% { transform: rotate(-70deg); } 38%, 78% { transform: rotate(-30deg); } 100% { transform: none; } }\n@keyframes gr-jambe-air { 0%, 8% { transform: none; } 20% { transform: rotate(40deg); } 38%, 100% { transform: none; } }\n@keyframes gr-attaque { 0% { transform: rotate(-20deg); } 40% { transform: rotate(-165deg); } 62% { transform: rotate(40deg); } 100% { transform: rotate(-20deg); } }\n@keyframes gr-fente { 40% { transform: rotate(-4deg); } 62% { transform: rotate(8deg) translateY(10px); } 100% { transform: none; } }\n@keyframes gr-garde { to { transform: translateY(8px) rotate(-2deg); } }\n@keyframes gr-saute { 0%, 100% { transform: none; } 15% { transform: translateY(16px) scale(1.03, .95); } 50% { transform: translateY(-260px); } 85% { transform: translateY(0) scale(1.03, .96); } }\n@keyframes gr-replie-g { 0%, 15%, 100% { transform: none; } 40%, 65% { transform: rotate(48deg); } }\n@keyframes gr-replie-d { 0%, 15%, 100% { transform: none; } 40%, 65% { transform: rotate(-48deg); } }\n@keyframes gr-coup-final { 0% { transform: rotate(-20deg); } 45% { transform: rotate(-175deg); } 70%, 100% { transform: rotate(50deg); } }\n@keyframes gr-recule { 25% { transform: rotate(-9deg) translateX(-26px); } 100% { transform: none; } }\n@keyframes gr-essuie { from { transform: rotate(142deg); } to { transform: rotate(163deg); } }\n@keyframes gr-gratte { from { transform: rotate(70deg); } to { transform: rotate(92deg); } }\n@keyframes gr-balance { from { transform: rotate(-3deg); } to { transform: rotate(3deg); } }\n@keyframes gr-tete-chant { from { transform: rotate(7deg); } to { transform: rotate(-7deg); } }\n@keyframes gr-lance { 0% { transform: rotate(0); } 40% { transform: rotate(40deg); } 70% { transform: rotate(-160deg); } 100% { transform: rotate(-20deg); } }\n@keyframes gr-hausse { to { transform: translateY(-12px); } }\n@keyframes gr-cloche { from { transform: translateY(0) rotate(-3deg); } to { transform: translateY(-46px) rotate(4deg); } }\n@keyframes gr-agite-g { from { transform: rotate(60deg); } to { transform: rotate(130deg); } }\n@keyframes gr-agite-d { from { transform: rotate(-60deg); } to { transform: rotate(-130deg); } }\n@keyframes gr-danse { from { transform: translateY(0) rotate(-6deg); } to { transform: translateY(-40px) rotate(6deg); } }\n@keyframes gr-ballon { from { transform: rotate(-10deg); } to { transform: rotate(10deg); } }\n@keyframes gr-menace { from { transform: rotate(-138deg); } to { transform: rotate(-165deg); } }\n@keyframes gr-trepigne { to { transform: translateY(-12px); } }\n@keyframes gr-frotte-g { from { transform: rotate(-56deg); } to { transform: rotate(-70deg); } }\n@keyframes gr-frotte-d { from { transform: rotate(56deg); } to { transform: rotate(70deg); } }\n@keyframes gr-chifoumi { 0%, 100% { transform: rotate(-60deg); } 50% { transform: rotate(-125deg); } }\n@keyframes gj-bras-course { from { transform: rotate(-34deg); } to { transform: rotate(34deg); } }\n@keyframes gj-foulee { from { transform: rotate(-5deg) translateY(0); } to { transform: rotate(-5deg) translateY(-14px); } }\n@keyframes gj-grimpe-g { from { transform: rotate(110deg); } to { transform: rotate(168deg); } }\n@keyframes gj-grimpe-d { from { transform: rotate(-110deg); } to { transform: rotate(-168deg); } }\n@keyframes gj-crochete { from { transform: rotate(56deg); } to { transform: rotate(70deg); } }\n@keyframes gj-lit { from { transform: rotate(4deg) translateY(8px); } to { transform: rotate(-4deg) translateY(8px); } }\n@keyframes gj-scrute { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }\n@keyframes gj-explique-d { from { transform: rotate(-30deg); } to { transform: rotate(-80deg); } }\n@keyframes gj-explique-g { from { transform: rotate(20deg); } to { transform: rotate(60deg); } }\n@keyframes gj-eleve { from { transform: translateY(0); } to { transform: translateY(-18px); } }\n@keyframes gj-encaisse { 20% { transform: rotate(-10deg) translateX(-24px); } 45% { transform: rotate(6deg) translateX(10px); } 100% { transform: none; } }\n";

// ----- src/apparence.js -----
/* =====================================================================
   APPARENCE — un personnage décrit par une FICHE (ses traits), pas par un dessin.
   Chaque overlay le dessine ensuite à SON style, à partir des mêmes formes : le même perso est reconnaissable
   partout (Xaieysi créé chez Patagrain = le même chez Mordeth, en néon).

   La fiche (apparence liée dans CodexVTT, ou catalogue provisoire : exemples.js). Tout est FACULTATIF : un overlay qui ne dessine pas un trait l'ignore.
     { id, nom, titre, couleur,                       // couleur = sa couleur de carte
       tete (la FORME du visage) : 'ovale'|'ronde'|'allongee'|'carree'|'coeur'|'large'|'anguleuse'
         (anciens noms toujours compris : humaine = ovale, longue = allongee, orc = large, draconide = anguleuse + museau dragon),
       museau: ''|'dragon'   (museau, crête et collerette de dragon ; ni cheveux ni oreilles), carrure: 'normale'|'large'|'petite',
       peau, yeux: { couleur, forme: 'rond'|'amande'|'fendu'|'grand'|'petit'|'mi-clos', lueur },
       cheveux: { coupe: 'court'|'long'|'queue'|'chignon'|'frange'|'herisse'|'boucle'|'carre'|'tresses'|'couettes'|'iroquoise'|'rase'|'chauve',
                  couleur, meche }   (meche = la couleur de la 2e couche : elle dépasse sous la 1re, et colore les cheveux de derrière),
       oreilles: 'petites'|'pointues'|'longues'|'rondes'|'decollees'|'tombantes'|'nageoires'   (ancien nom compris : humaines = petites),
       cornes: ''|'petites'|'belier'|'arriere'|'longues'|'courbes'|'licorne'|'bois',
       dents: ''|'crocs'|'defenses'|'canines'|'lapin'   (elles suivent la bouche : ouverte, rire, surprise),
       pilosite: ''|'barbe'|'barbe-longue'|'moustache'|'guidon'|'menton'|'bouc'|'anneau'|'favoris'  ou  { type, couleur }  (couleur : celle des cheveux par défaut),
       tenue: { type: 'tunique'|'robe'|'armure'|'cuir'|'mage'|'cape', couleur, couleur2 },   (cuir : épaulières et rivets ; mage : robe à galons et étoiles)
       taille: 'normale'|'petite'|'grande'   (en pied : petite = nain, halfelin)
       accessoire: un nom ou une LISTE : 'capuche'|'chapeau'|'toque'|'turban'|'couronne'|'bandeau'|'lunettes'|'lunettes-carrees'|'casque'|'boucles'|'boucle-gauche'|'boucle-droite' (une seule, côté de l'image)
                   |'tablier'|'griffes' (collier de griffes)|'ours' (cape en peau d'ours) ; couleurCoiffe : la couleur de la toque, du turban,
                   du chapeau, de la capuche (sinon celle de la tenue ; la toque est blanche)
       signe: ''|'cicatrice'|'tatouage'|'taches'|'grain' (grain de beauté),
       objet, objet2: ''|'epee'|'epee-magique'|'hache'|'masse'|'hachoir'|'baton'|'arbalete'|'arc'|'bouclier'|'livre'|'kazoo'|'carquois'
                      (main droite / main gauche de l'image, ou dos ; dessinés en pied) ; couleurObjet : la lueur de l'épée magique, l'orbe du bâton,
       formes: { "Dragon": { …les traits qui changent } } }    // la forme active (CodexVTT : nom du portrait actif)

     Apparence.calques(fiche, { expression, forme }) → [{ id, d, fond, trait, epaisseur, partie }] dans l'ordre (dos → devant),
       viewBox 0 0 200 240 (un buste) ; partie : 'peau' | 'cheveux' | 'tenue' | 'yeux' | 'detail' | 'accessoire'
       expression : '' | 'parle' (bouche ouverte) | 'rire' | 'choc' | 'ko'
       options aussi : sans: [ids], seulement: [ids] (ne garder qu'une partie des calques, ex. la tête sans le corps)
     EN PIED : le squelette du bouffon de Patagrain (src/squelette.js) : Apparence.calques(fiche, { cadrage: 'squelette', partie })
       → les calques d'un morceau (torse, bras-g, avant-bras-g, main-g, objet-g, cuisse-g, tibia-g…, dos) ; la tête = le buste sans le corps.
     Apparence.svg(fiche, options) → un dessin simple et neutre (pour l'aperçu) ; chaque overlay a son propre rendu
     Apparence.fusion(fiche, forme) → la fiche avec les traits de la forme
     Apparence.code(fiche) → « PERSO1-… » (toute l'apparence en une ligne, à copier d'une table à l'autre) ; Apparence.depuisCode(texte) → la fiche
     Apparence.nettoyer(fiche) → la fiche sans rien d'inconnu (fait aussi à chaque dessin : un code ou une fiche ne peut rien injecter)
     Apparence.trouver(nom, …)  → la fiche du catalogue de ce personnage (par son nom ou son id ; « Kenai le gardien » → Kenai), sinon null
   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
const Apparence = (() => {
  // --- couleurs : éclaircir / assombrir un « #rrggbb » ---
  const teinte = (hex, k) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '')); if (!m) return hex || '#888888';
    const n = parseInt(m[1], 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  };
  const fusion = (fiche, forme) => {
    const f = forme && fiche.formes && Object.entries(fiche.formes).find(([n]) => n.toLowerCase() === String(forme).toLowerCase());
    if (!f) return fiche;
    const r = { ...fiche };
    Object.entries(f[1]).forEach(([k, v]) => { r[k] = v && typeof v === 'object' && !Array.isArray(v) ? { ...(fiche[k] || {}), ...v } : v; });
    return r;
  };
  const miroir = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${+(200 - parseFloat(x)).toFixed(1)} ${y}`);
  const rond = (x, y, rx, ry = rx) => `M${x - rx} ${y} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0`;
  const paire = d => d + ' ' + miroir(d);

  // --- les formes (un buste, 200 × 240) ---
  const VISAGE = {
    ovale: 'M100 42 C128 42 142 66 142 98 C142 134 125 160 100 162 C75 160 58 134 58 98 C58 66 72 42 100 42 Z',
    large: 'M100 44 C134 44 150 68 150 100 C150 140 134 164 100 168 C66 164 50 140 50 100 C50 68 66 44 100 44 Z',
    anguleuse: 'M100 46 C134 46 154 66 156 94 C158 116 150 132 140 146 C130 162 116 172 100 172 C84 172 70 162 60 146 C50 132 42 116 44 94 C46 66 66 46 100 46 Z',
    ronde: 'M100 44 C134 44 148 70 148 104 C148 138 128 158 100 158 C72 158 52 138 52 104 C52 70 66 44 100 44 Z',
    allongee: 'M100 36 C128 36 140 62 140 96 C140 136 124 168 100 170 C76 168 60 136 60 96 C60 62 72 36 100 36 Z',
    carree: 'M100 42 C132 42 146 62 146 96 C146 126 142 146 128 156 C118 162 110 164 100 164 C90 164 82 162 72 156 C58 146 54 126 54 96 C54 62 68 42 100 42 Z',
    coeur: 'M100 42 C132 42 146 64 146 94 C146 124 124 150 100 166 C76 150 54 124 54 94 C54 64 68 42 100 42 Z',
  };
  const JOUE = 'M124 70 C138 84 142 104 140 124 C136 144 124 156 112 160 C126 146 132 128 132 108 C132 92 128 80 124 70 Z';
  const MUSEAU = 'M100 112 C118 112 130 122 132 138 C134 154 120 166 100 166 C80 166 66 154 68 138 C70 122 82 112 100 112 Z';
  const CRETE = 'M100 50 L106 62 L100 70 L94 62 Z M100 72 L105 82 L100 88 L95 82 Z';
  const COLLERETTE = paire('M50 96 L18 80 L30 96 L14 108 L34 112 L22 126 L50 120 Z');
  const COU = { normale: 'M89 150 L111 150 L113 186 L87 186 Z', large: 'M84 150 L116 150 L119 186 L81 186 Z', petite: 'M90 152 L110 152 L111 186 L89 186 Z' };
  const EPAULES = {
    tunique: 'M18 240 C22 198 54 182 100 180 C146 182 178 198 182 240 Z',
    robe: 'M14 240 C20 196 52 178 100 176 C148 178 180 196 186 240 Z',
    armure: 'M10 240 C10 200 36 182 64 178 C76 176 88 180 100 180 C112 180 124 176 136 178 C164 182 190 200 190 240 Z',
    cape: 'M6 240 C14 192 50 174 100 172 C150 174 186 192 194 240 Z',
    cuir: 'M10 240 C10 200 36 182 64 178 C76 176 88 180 100 180 C112 180 124 176 136 178 C164 182 190 200 190 240 Z',
    mage: 'M14 240 C20 196 52 178 100 176 C148 178 180 196 186 240 Z',
  };
  const COL = { tunique: 'M80 182 L100 210 L120 182 Z', robe: 'M72 180 L100 226 L128 180 Z', armure: 'M64 178 C76 196 88 204 100 204 C112 204 124 196 136 178 L136 190 C124 210 112 216 100 216 C88 216 76 210 64 190 Z', cape: 'M70 176 C80 190 90 196 100 196 C110 196 120 190 130 176 L134 186 C122 202 110 208 100 208 C90 208 78 202 66 186 Z',
    cuir: 'M80 182 L100 210 L120 182 Z', mage: 'M72 180 L100 226 L128 180 Z' };
  const DOS = {
    long: 'M100 34 C58 34 44 70 46 112 C48 150 46 186 40 214 L160 214 C154 186 152 150 154 112 C156 70 142 34 100 34 Z',
    queue: 'M114 40 C150 34 164 70 158 110 C154 140 158 170 168 196 C146 186 138 160 140 128 C142 96 138 66 118 56 Z',
    boucle: rond(64, 70, 18) + rond(136, 70, 18) + rond(54, 104, 16) + rond(146, 104, 16) + rond(100, 46, 26),
    frange: 'M100 36 C62 36 50 66 52 100 C54 124 54 136 52 148 L148 148 C146 136 146 124 148 100 C150 66 138 36 100 36 Z',
    chignon: rond(100, 26, 18, 15),
    carre: 'M100 34 C60 34 44 66 46 104 C48 128 50 144 54 156 L146 156 C150 144 152 128 154 104 C156 66 140 34 100 34 Z',
    tresses: 'M100 36 C62 36 50 66 52 100 C54 124 54 136 52 148 L148 148 C146 136 146 124 148 100 C150 66 138 36 100 36 Z',
  };
  const CALOTTE = 'M56 94 C52 58 74 36 100 36 C126 36 148 58 144 94 C134 70 118 60 100 60 C82 60 66 70 56 94 Z';
  const DEVANT = {
    court: CALOTTE, chignon: CALOTTE,
    long: CALOTTE + ' ' + paire('M58 84 C50 110 52 140 48 168 L60 168 C60 140 62 112 66 92 Z'),
    queue: 'M56 94 C52 58 74 36 100 36 C126 36 148 58 144 94 C136 74 124 64 108 62 C94 72 74 82 56 94 Z',
    frange: 'M54 100 C50 60 74 38 100 38 C126 38 150 60 146 100 C140 84 132 76 124 74 C118 84 110 80 104 72 C96 82 86 80 80 72 C72 80 64 84 54 100 Z',
    herisse: 'M56 94 L48 62 L66 68 L64 40 L82 56 L92 28 L102 52 L116 30 L120 56 L140 42 L136 68 L154 64 L144 94 C134 72 118 62 100 62 C82 62 66 72 56 94 Z',
    boucle: rond(70, 58, 14) + rond(90, 46, 15) + rond(112, 46, 15) + rond(132, 58, 14) + rond(60, 76, 11) + rond(142, 76, 11),
    chauve: '',
    carre: CALOTTE + ' ' + paire('M56 90 C50 110 52 132 56 152 L68 152 C64 132 62 112 64 96 Z'),
    tresses: CALOTTE + ' ' + paire('M60 118 C56 140 58 162 54 192 C60 196 66 196 70 192 C70 162 70 140 68 120 Z'),
    couettes: CALOTTE + ' ' + paire('M54 72 C32 70 20 94 28 118 C34 134 46 130 50 118 C46 108 46 90 58 82 Z'),
    iroquoise: 'M88 66 C86 40 90 16 100 4 C110 16 114 40 112 66 C106 62 94 62 88 66 Z',
    rase: 'M58 92 C56 60 76 40 100 40 C124 40 144 60 142 92 C132 72 118 64 100 64 C82 64 68 72 58 92 Z',
  };
  const OREILLE = { petites: rond(57, 106, 7.5, 11.5), pointues: 'M60 100 L26 76 L40 98 L58 120 Z', longues: 'M60 98 L16 88 L34 106 L58 122 Z',
    rondes: rond(52, 104, 12, 15), decollees: 'M60 94 C38 80 26 98 32 116 C36 128 50 126 60 118 Z',
    tombantes: 'M60 98 C40 104 26 118 18 138 C34 130 48 122 60 116 Z', nageoires: 'M60 90 L30 76 L38 90 L26 100 L40 106 L28 120 L58 118 Z' };
  // (un rond ne se retourne pas avec miroir : ses arcs ; l'oreille de droite des oreilles rondes est écrite à part)
  const OREILLE_D = { petites: rond(143, 106, 7.5, 11.5), rondes: rond(148, 104, 12, 15) };
  const CORNES = {
    petites: paire('M74 50 L64 22 L84 44 Z'),
    belier: paire('M74 58 C44 38 18 60 28 90 C34 108 58 112 66 94 C72 82 62 70 50 74 C42 78 44 90 54 90 C46 96 36 88 38 76 C42 58 62 58 74 68 Z'),
    longues: paire('M76 52 L66 4 L86 46 Z'),
    courbes: paire('M74 54 C54 44 48 22 60 2 C62 22 72 36 86 46 Z'),
    licorne: 'M95 46 L100 2 L105 46 Z',
    bois: paire('M80 50 C74 38 70 26 72 8 L77 8 C77 18 78 26 80 32 C84 26 86 18 86 10 L91 12 C90 22 86 32 82 38 C88 34 94 30 98 24 L101 28 C96 36 90 42 86 48 Z'),
    arriere: paire('M72 58 C60 40 46 30 24 26 C40 34 52 46 58 64 Z M84 50 C76 32 66 20 48 12 C60 24 68 38 72 54 Z'),   // rabattues vers l'arrière (draconide)
  };
  // Les dents, posées sur la bouche de l'expression (bas = la lèvre du bas, haut = celle du haut, ecart = la bouche plus large ou plus étroite)
  const deplacer = (d, dx, dy) => d.replace(/([MLC])([^A-Za-z]*)/g, (_, c, n) => c + n.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (__, x, y) => `${+(+x + dx).toFixed(1)} ${+(+y + dy).toFixed(1)}`));
  const BOUCHE = { '': { bas: 141, haut: 136, ecart: 0 }, parle: { bas: 145, haut: 135, ecart: 0 }, rire: { bas: 150, haut: 133, ecart: 3 }, choc: { bas: 147, haut: 133, ecart: -4 }, ko: { bas: 141, haut: 136, ecart: 0 } };
  function dents(type, expression, yb) {
    const b = BOUCHE[expression] || BOUCHE[''], e = b.ecart, bas = b.bas + yb, haut = b.haut + yb;
    const DENTS = {
      crocs: `M${88 - e} ${bas} L${91 - e} ${bas - 8} L${94 - e} ${bas} Z`,
      defenses: deplacer('M80 146 C78 136 80 126 86 120 C86 130 88 138 90 146 Z', -e, bas - 141),
      canines: `M${91 - e} ${haut} L${93.5 - e} ${haut + 8} L${96 - e} ${haut} Z`,
      lapin: `M95.5 ${haut} L99.5 ${haut} L99.5 ${haut + 7} L95.5 ${haut + 7} Z`,
    };
    return DENTS[type] ? paire(DENTS[type]) : '';
  }
  const PILOSITE = {
    barbe: 'M58 116 C60 150 78 172 100 174 C122 172 140 150 142 116 C136 140 122 150 110 150 C106 146 94 146 90 150 C78 150 64 140 58 116 Z',
    'barbe-longue': 'M58 116 C58 160 74 206 100 230 C126 206 142 160 142 116 C136 140 122 150 110 150 C106 146 94 146 90 150 C78 150 64 140 58 116 Z',
    moustache: 'M100 128 C92 124 82 126 78 134 C86 132 94 134 100 132 C106 134 114 132 122 134 C118 126 108 124 100 128 Z',
    guidon: 'M100 127 C90 121 78 123 70 131 C68 123 62 123 59 127 C65 138 82 136 100 132 C118 136 135 138 141 127 C138 123 132 123 130 131 C122 123 110 121 100 127 Z',
    menton: 'M80 146 C84 162 92 172 100 174 C108 172 116 162 120 146 C112 152 106 154 100 154 C94 154 88 152 80 146 Z',
    bouc: 'M100 126 C90 122 80 126 78 134 C78 148 86 162 100 166 C114 162 122 148 122 134 C120 126 110 122 100 126 Z',
    favoris: paire('M56 94 C54 116 58 134 68 144 L74 136 C66 126 64 110 64 94 Z'),
    anneau: 'M100 125 C88 121 78 127 77 137 C76 151 86 165 100 167 C114 165 124 151 123 137 C122 127 112 121 100 125 Z M100 133 C110 133 115 137 115 143 C114 151 108 157 100 158 C92 157 86 151 85 143 C85 137 90 133 100 133 Z',
  };
  const ACCESSOIRE = {
    capuche: { dos: 'M100 22 C46 22 30 80 34 132 C36 162 44 186 54 200 L146 200 C156 186 164 162 166 132 C170 80 154 22 100 22 Z', devant: 'M100 30 C60 30 44 70 46 104 C50 80 70 58 100 58 C130 58 150 80 154 104 C156 70 140 30 100 30 Z' },
    chapeau: { devant: 'M22 72 C40 60 70 56 100 56 C130 56 160 60 178 72 C160 78 130 80 100 80 C70 80 40 78 22 72 Z M64 64 C66 30 82 14 100 14 C118 14 134 30 136 64 C124 58 112 56 100 56 C88 56 76 58 64 64 Z' },
    toque: { devant: 'M64 66 L68 40 C56 36 54 18 70 16 C74 4 92 2 100 10 C108 2 126 4 130 16 C146 18 144 36 132 40 L136 66 C124 60 112 58 100 58 C88 58 76 60 64 66 Z', blanc: true },
    couronne: { devant: 'M64 52 L70 26 L84 44 L100 18 L116 44 L130 26 L136 52 C124 48 112 46 100 46 C88 46 76 48 64 52 Z', or: true },
    bandeau: { devant: 'M56 74 C70 66 86 62 100 62 C114 62 130 66 144 74 L144 84 C130 76 114 72 100 72 C86 72 70 76 56 84 Z' },
    lunettes: { trait: rond(82, 100, 14, 12) + rond(118, 100, 14, 12) + ' M96 100 L104 100 M68 98 L56 94 M132 98 L144 94' },
    'lunettes-carrees': { trait: 'M68 90 L96 90 L96 109 L68 109 Z M104 90 L132 90 L132 109 L104 109 Z M96 98 L104 98 M68 96 L56 92 M132 96 L144 92', verre: 'M68 90 L96 90 L96 109 L68 109 Z M104 90 L132 90 L132 109 L104 109 Z' },
    casque: { dos: 'M100 18 C52 18 34 60 36 104 C38 132 46 150 56 160 L144 160 C154 150 162 132 164 104 C166 60 148 18 100 18 Z', devant: 'M62 84 C70 70 84 64 100 64 C116 64 130 70 138 84 L138 92 C126 82 114 78 100 78 C86 78 74 82 62 92 Z' },
    boucles: { bijou: rond(56, 124, 4) + rond(144, 124, 4) },
    'boucle-gauche': { bijou: rond(56, 124, 4) }, 'boucle-droite': { bijou: rond(144, 124, 4) },   // (côté de l'image)
    turban: { devant: 'M52 84 C40 60 52 30 80 26 C88 12 112 12 120 26 C148 30 160 60 148 84 C132 70 116 66 100 66 C84 66 68 70 52 84 Z M64 62 C80 50 120 50 136 62 M60 74 C80 60 120 60 140 74', coiffe: true, bijou: rond(100, 46, 5) },
    tablier: { epaules: 'M76 196 L124 196 L130 240 L70 240 Z', couleur: '#F2EEE4' },
    griffes: { epaules: 'M78 186 L82 200 L86 186 Z M90 191 L94 206 L98 191 Z M102 191 L106 206 L110 191 Z M114 186 L118 200 L122 186 Z', couleur: '#EFE6CE' },
    ours: { epaules: 'M6 240 C8 204 28 182 56 174 L66 192 L80 178 L100 194 L120 178 L134 192 L144 174 C172 182 192 204 194 240 Z', couleur: '#5A4030' },
  };
  const SIGNE = { cicatrice: 'M118 112 L132 132 M121 118 L126 115 M125 124 L130 121', tatouage: 'M124 112 C132 116 134 124 130 132 M70 112 C64 118 64 126 68 132', taches: rond(80, 118, 1.6) + rond(86, 122, 1.6) + rond(76, 124, 1.6) + rond(120, 118, 1.6) + rond(114, 122, 1.6) + rond(124, 124, 1.6),
    grain: rond(126, 126, 2) };
  // Carrure : les épaules plus larges ou plus étroites (transformation des formes autour du milieu)
  const etirer = (d, k) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${+(100 + (parseFloat(x) - 100) * k).toFixed(1)} ${y}`);

  // ---------- Nettoyer une fiche : seulement des traits connus, des couleurs valides, des noms courts ----------
  // (une fiche peut venir d'un CODE collé depuis une autre table, ou de CodexVTT : rien ne doit pouvoir s'injecter dans le dessin)
  const COULEUR = /^#[0-9a-fA-F]{3,8}$/, MOT = /^[a-z0-9-]{0,32}$/;
  const C_COULEURS = ['couleur', 'peau', 'couleurCornes', 'couleurCoiffe', 'couleurObjet', 'bouche'];
  const C_MOTS = ['tete', 'museau', 'carrure', 'taille', 'oreilles', 'cornes', 'dents', 'signe', 'objet', 'objet2'];
  const SOUS = { yeux: { couleur: 'c', forme: 'm', lueur: 'b' }, cheveux: { coupe: 'm', couleur: 'c', meche: 'c' },
    pilosite: { type: 'm', couleur: 'c' }, tenue: { type: 'm', couleur: 'c', couleur2: 'c' } };
  const texte = (v, n) => String(v ?? '').replace(/[\u0000-\u001f<>]/g, '').slice(0, n);
  function nettoyer(f, avecFormes = true) {
    if (!f || typeof f !== 'object') return {};
    const r = {};
    if (f.id != null && /^[A-Za-z0-9_-]{1,40}$/.test(String(f.id))) r.id = String(f.id);
    if (f.nom != null) r.nom = texte(f.nom, 60);
    if (f.titre != null) r.titre = texte(f.titre, 80);
    C_COULEURS.forEach(k => { if (typeof f[k] === 'string' && (COULEUR.test(f[k]) || f[k] === '')) r[k] = f[k]; });
    C_MOTS.forEach(k => { if (typeof f[k] === 'string' && MOT.test(f[k])) r[k] = f[k]; });
    Object.entries(SOUS).forEach(([k, champs]) => {
      const v = f[k];
      if (k === 'pilosite' && typeof v === 'string') { if (MOT.test(v)) r.pilosite = v; return; }
      if (!v || typeof v !== 'object') return;
      const o = {};
      Object.entries(champs).forEach(([c, t]) => {
        const x = v[c];
        if (t === 'c' && typeof x === 'string' && (COULEUR.test(x) || x === '')) o[c] = x;
        if (t === 'm' && typeof x === 'string' && MOT.test(x)) o[c] = x;
        if (t === 'b' && typeof x === 'boolean') o[c] = x;
      });
      r[k] = o;
    });
    const accs = (Array.isArray(f.accessoire) ? f.accessoire : f.accessoire != null ? [f.accessoire] : []).filter(a => typeof a === 'string' && MOT.test(a)).slice(0, 12);
    if (f.accessoire != null) r.accessoire = Array.isArray(f.accessoire) ? accs : (accs[0] ?? '');
    if (avecFormes && f.formes && typeof f.formes === 'object') {
      r.formes = {};
      Object.entries(f.formes).slice(0, 8).forEach(([n, sous]) => { r.formes[texte(n, 40)] = nettoyer(sous, false); });
    }
    return r;
  }

  // ---------- Le CODE d'un personnage : toute son apparence en une ligne, à copier d'une table à l'autre ----------
  //   Apparence.code(fiche) → « PERSO1-… » ; Apparence.depuisCode(texte) → la fiche (nettoyée), ou null si le code est illisible.
  //   (le texte peut aussi être la fiche en JSON)
  const PREFIXE = 'PERSO1-';
  const versBase64 = t => { const o = new TextEncoder().encode(t); let b = ''; o.forEach(x => { b += String.fromCharCode(x); }); return btoa(b).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const depuisBase64 = t => { const b = atob(t.replace(/-/g, '+').replace(/_/g, '/')); return new TextDecoder().decode(Uint8Array.from(b, c => c.charCodeAt(0))); };
  const code = fiche => PREFIXE + versBase64(JSON.stringify(nettoyer(fiche)));
  function depuisCode(t) {
    const brut = String(t || '').replace(/\s+/g, '');
    try {
      const json = brut.startsWith('{') ? brut : depuisBase64(brut.startsWith(PREFIXE) ? brut.slice(PREFIXE.length) : brut);
      const f = JSON.parse(json);
      return f && typeof f === 'object' && !Array.isArray(f) ? nettoyer(f) : null;
    } catch { return null; }
  }

  function calques(fiche0, { expression = '', forme = '', cadrage = '', partie = '', sans = null, seulement = null } = {}) {
    fiche0 = nettoyer(fiche0);
    if (cadrage === 'squelette' && partie) return Squelette.pieces(fusion(fiche0 || {}, forme), partie);   // en pied : src/squelette.js
    const L = calquesBuste(fiche0, { expression, forme });
    return seulement ? L.filter(c => seulement.includes(c.id)) : sans ? L.filter(c => !sans.includes(c.id)) : L;
  }

  function calquesBuste(fiche0, { expression = '', forme = '' } = {}) {
    const f = fusion(fiche0 || {}, forme);
    const ALIAS = { humaine: 'ovale', longue: 'allongee', orc: 'large', draconide: 'anguleuse' };   // les anciens noms (apparences déjà enregistrées)
    const nomTete = ALIAS[f.tete] || f.tete, tete = VISAGE[nomTete] ? nomTete : 'ovale';
    const dragon = f.museau === 'dragon' || (f.tete === 'draconide' && f.museau !== '');
    const carrure = COU[f.carrure] ? f.carrure : 'normale', kCarrure = { large: 1.14, petite: .9, normale: 1 }[carrure] * .88;   // (des épaules fines : le buste ne doit pas écraser la tête)
    const peau = f.peau || '#E8B894', ombre = teinte(peau, -.12);
    const ch = f.cheveux || {}, cc = ch.couleur || '#2A2018';
    const coupe = dragon ? 'chauve' : DEVANT[ch.coupe] !== undefined ? ch.coupe : 'court';
    const y = f.yeux || {}, iris = y.couleur || '#4A3A2A';
    const t = f.tenue || {}, tt = EPAULES[t.type] ? t.type : 'tunique', tc = t.couleur || f.couleur || '#4F7CAC';
    const accs = (Array.isArray(f.accessoire) ? f.accessoire : [f.accessoire]).filter(a => ACCESSOIRE[a]).map(a => [a, ACCESSOIRE[a]]);
    const accDos = accs.find(([, a]) => a.dos);
    const pil = typeof f.pilosite === 'object' && f.pilosite ? f.pilosite : { type: f.pilosite };
    const L = [];
    const pousser = (id, d, partie, fond, trait = null, epaisseur = 0) => { if (d) L.push({ id, d, partie, fond, trait, epaisseur }); };
    // dos
    if (accDos) pousser('accessoire-dos', accDos[1].dos, 'accessoire', f.couleurCoiffe && accDos[0] === 'capuche' ? teinte(f.couleurCoiffe, -.15) : teinte(tc, -.25));
    if (DOS[coupe] && !accDos) pousser('cheveux-dos', DOS[coupe], 'cheveux', ch.meche ? teinte(ch.meche, -.08) : teinte(cc, -.12));
    pousser('epaules', etirer(EPAULES[tt], kCarrure), 'tenue', tc);
    pousser('col', etirer(COL[tt], kCarrure), 'tenue', t.couleur2 || teinte(tc, .35));
    accs.forEach(([, a]) => { if (a.epaules) pousser('accessoire-corps', etirer(a.epaules, kCarrure), 'accessoire', a.couleur, teinte(a.couleur, -.45), 1.5); });
    pousser('cou', COU[carrure], 'peau', ombre);
    if (f.cornes && CORNES[f.cornes]) { const cc2 = f.couleurCornes || (dragon ? teinte(peau, -.35) : '#E8DCC2'); pousser('cornes', CORNES[f.cornes], 'detail', cc2, teinte(cc2, -.5), 2.2); }   // (un contour : elles se voient sur toutes les peaux)
    if (dragon) pousser('collerette', COLLERETTE, 'peau', teinte(peau, -.25));
    else if (!accDos || accDos[0] === 'casque') { const nomOr = f.oreilles === 'humaines' || !OREILLE[f.oreilles] ? 'petites' : f.oreilles, or = OREILLE[nomOr]; pousser('oreille-g', or, 'peau', peau); pousser('oreille-d', OREILLE_D[nomOr] || miroir(or), 'peau', peau); }
    pousser('visage', VISAGE[tete], 'peau', peau);
    pousser('joue', dragon ? etirer(JOUE, 1.15) : JOUE, 'peau', ombre);
    if (dragon) { pousser('museau', MUSEAU, 'peau', teinte(peau, .18)); pousser('crete', CRETE, 'detail', teinte(peau, -.3)); }
    if (f.signe && SIGNE[f.signe]) { const point = f.signe === 'taches' || f.signe === 'grain'; pousser('signe', SIGNE[f.signe], 'detail', point ? teinte(peau, f.signe === 'grain' ? -.55 : -.3) : null, point ? null : teinte(peau, -.45), 2.5); }
    // yeux
    if (expression === 'ko') {
      pousser('yeux', 'M74 94 L90 106 M90 94 L74 106 M110 94 L126 106 M126 94 L110 106', 'yeux', null, '#1A1418', 4);
    } else if (expression === 'rire') {
      pousser('yeux', 'M72 102 C78 94 88 94 92 102 M108 102 C112 94 122 94 128 102', 'yeux', null, '#1A1418', 4);
    } else {
      const forme = y.forme || 'rond', grand = forme === 'grand', petit = forme === 'petit';
      const ry = forme === 'amande' ? 4.4 : grand ? (expression === 'choc' ? 10.5 : 9) : expression === 'choc' ? 8 : 5.8, rx = grand ? 11 : 8.6;
      if (petit) {                                   // de petits yeux ronds, sans blanc (dessin animé)
        pousser('iris', rond(83, 98, expression === 'choc' ? 4.2 : 3.4) + rond(117, 98, expression === 'choc' ? 4.2 : 3.4), 'yeux', y.lueur ? iris : '#1A1418');
        if (y.lueur) pousser('lueur', rond(83, 98, 7) + rond(117, 98, 7), 'yeux', null, iris, 2);
      }
      if (!petit) pousser('blanc', rond(82, 98, rx, ry) + rond(118, 98, rx, ry), 'yeux', y.lueur ? teinte(iris, .7) : '#FFFFFF');
      if (!petit) pousser('iris', y.forme === 'fendu' ? 'M80 91 C84 95 84 101 80 105 C78 101 78 95 80 91 Z M116 91 C120 95 120 101 116 105 C114 101 114 95 116 91 Z' : rond(83, 98, grand ? 6.2 : 4.3) + rond(119, 98, grand ? 6.2 : 4.3), 'yeux', y.forme === 'fendu' ? '#1A1418' : iris);
      if (!petit && y.forme !== 'fendu') pousser('pupille', rond(83.5, 98, grand ? 2.8 : 1.9) + rond(119.5, 98, grand ? 2.8 : 1.9), 'yeux', '#1A1418');
      if (grand) pousser('reflet', rond(86, 94, 2.2) + rond(122, 94, 2.2), 'yeux', '#FFFFFF');
      if (forme === 'mi-clos') pousser('paupieres', paire('M70 99 C74 87 90 87 94 99 C88 95 76 95 70 99 Z'), 'peau', peau, teinte(peau, -.4), 2);
      if (y.lueur && !petit) pousser('lueur', rond(82, 98, rx + 3, ry + 3) + rond(118, 98, rx + 3, ry + 3), 'yeux', null, iris, 2);
    }
    pousser('sourcils', dragon ? 'M68 84 L92 88 M108 88 L132 84' : expression === 'choc' ? 'M70 80 C76 74 86 74 92 78 M108 78 C114 74 124 74 130 80' : 'M70 85 C76 80 86 80 92 83 M108 83 C114 80 124 80 130 85', 'cheveux', null, dragon ? teinte(peau, -.4) : teinte(cc, -.2), 2.8);
    pousser('nez', dragon ? 'M92 126 C94 122 96 122 96 126 M104 126 C104 122 106 122 108 126' : 'M100 104 C98 116 96 120 93 123 C98 127 104 127 108 123', 'detail', null, dragon ? teinte(peau, -.45) : teinte(peau, -.22), 2.2);
    const yb = dragon ? 12 : 0;
    const bouches = { parle: `M90 ${134 + yb} C94 ${146 + yb} 106 ${146 + yb} 110 ${134 + yb} C104 ${137 + yb} 96 ${137 + yb} 90 ${134 + yb} Z`, rire: `M86 ${132 + yb} C90 ${152 + yb} 110 ${152 + yb} 114 ${132 + yb} C104 ${136 + yb} 96 ${136 + yb} 86 ${132 + yb} Z`, choc: rond(100, 140 + yb, 6, 8) };
    if (pil.type && PILOSITE[pil.type] && !dragon) pousser('pilosite', PILOSITE[pil.type], 'cheveux', pil.couleur || cc);   // sous la bouche
    if (bouches[expression]) pousser('bouche', bouches[expression], 'detail', f.bouche || '#5A2A2A');
    else pousser('bouche', dragon ? 'M80 150 C92 156 108 156 120 150' : 'M90 136 C95 140.5 105 140.5 110 136', 'detail', null, f.bouche || '#7A3A3A', 2.4);
    if (f.dents) pousser('dents', dents(f.dents, expression, yb), 'detail', '#F4EEDC', '#3A2A1A', 1.2);
    // devant
    if (!accDos || accDos[0] === 'casque') {
      if (ch.meche && DEVANT[coupe]) pousser('meche', deplacer(DEVANT[coupe], 0, 7), 'cheveux', ch.meche);   // la 2e couche, juste dessous
      pousser('cheveux', DEVANT[coupe], 'cheveux', cc);
    }
    accs.forEach(([nom, a]) => {
      const coiffe = f.couleurCoiffe && ['toque', 'turban', 'chapeau', 'capuche', 'bandeau'].includes(nom) ? f.couleurCoiffe : null;
      if (a.devant) pousser('accessoire', a.devant, 'accessoire', coiffe || (a.or ? '#F5C542' : a.blanc ? '#F7F4EC' : nom === 'bandeau' ? (t.couleur2 || teinte(tc, .3)) : teinte(tc, -.1)));
      if (a.verre) pousser('verres', a.verre, 'accessoire', 'rgba(255,255,255,.14)');
      if (a.trait) pousser('accessoire', a.trait, 'accessoire', null, '#16181C', 3.5);
      if (a.bijou) pousser('bijoux', a.bijou, 'accessoire', '#F5C542', '#8A6A1A', 1);
    });
    return L;
  }

  // Un dessin neutre (aperçu) : des aplats, un contour doux
  function svg(fiche, opts = {}) {
    const L = calques(fiche, opts);
    return `<svg viewBox="0 0 200 240" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">${L.map(c =>
      `<path d="${c.d}" fill="${c.fond || 'none'}" ${c.trait ? `stroke="${c.trait}" stroke-width="${c.epaisseur}" stroke-linecap="round" stroke-linejoin="round"` : ''}/>`).join('')}</svg>`;
  }

  // La fiche du catalogue provisoire (window.PERSOS, exemples.js) d'un personnage, d'après son nom (« Kenai le gardien » → Kenai) ou son id ; sinon null
  const normaliser = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  function trouver(...noms) {
    const liste = window.PERSOS || [];
    for (const nom of noms) {
      const n = normaliser(nom);
      if (!n) continue;
      const f = liste.find(p => normaliser(p.id) === n || normaliser(p.nom) === n)
        || liste.find(p => { const m = normaliser(p.nom); return n.startsWith(m + ' ') || m.startsWith(n + ' ') || n.split(' ')[0] === m.split(' ')[0]; });
      if (f) return f;
    }
    return null;
  }

  return { calques, svg, fusion, teinte, trouver, nettoyer, code, depuisCode };
})();


// ----- src/exemples.js -----
/* =====================================================================
   EXEMPLES — le catalogue PROVISOIRE des fiches d'apparence (d'après la table de Patagrain) : la démo des widgets, et le
   dessin des personnages dans les overlays de la famille tant que leur apparence n'est pas enregistrée dans CodexVTT.
   Le créateur est dans CodexVTT (labo › Personnages) : une apparence enregistrée là passe avant ce catalogue. Pour un exemple ici :
   on colle la fiche, node construire.mjs, puis on recopie _modele/js/codex-stream.js dans les overlays. Le nom doit être celui de CodexVTT.
   ===================================================================== */
window.PERSOS = [
  // Exemple de démonstration (son apparence est à refaire avec le créateur)
  { id: 'xaieysi', nom: 'Xaieysi', titre: 'Exemple', couleur: '#5B6CFF',
    peau: '#EBD3C3', yeux: { couleur: '#9B5DE5', forme: 'amande', lueur: true },
    cheveux: { coupe: 'long', couleur: '#D9DCE6', meche: '#9B5DE5' }, oreilles: 'pointues',
    tenue: { type: 'cape', couleur: '#26305E', couleur2: '#C9B26A' }, accessoire: ['bandeau', 'boucles'], signe: 'tatouage', objet: 'baton' },
  // Les héros de Patagrain, REFAITS AVEC LES TRAITS (plus aucun dessin à la main) : mêmes couleurs que ses anciens héros dessinés
  { id: 'patagrain', nom: 'Patagrain', titre: 'Maître du jeu', couleur: '#F5B82E',
    peau: '#F0C8A4', yeux: { couleur: '#86A08F', forme: 'rond' }, cheveux: { coupe: 'long', couleur: '#B98B58', meche: '#9C7043' }, oreilles: 'petites',
    pilosite: { type: 'anneau', couleur: '#8F6540' }, signe: 'grain', tenue: { type: 'mage', couleur: '#1F2F5A', couleur2: '#D9A72E' }, accessoire: ['lunettes-carrees', 'boucle-droite'], objet: 'livre' },
  { id: 'kenai', nom: 'Kenai', titre: 'Le gardien aux ombres', couleur: '#C0743C', tete: 'large',
    peau: '#7C8D3C', yeux: { couleur: '#2A1A06', forme: 'rond' }, cheveux: { coupe: 'chignon', couleur: '#1A1714' }, oreilles: 'pointues', dents: 'crocs',
    tenue: { type: 'cuir', couleur: '#6A3D22', couleur2: '#C27B45' }, objet: 'epee-magique', couleurObjet: '#7FE0FF', objet2: 'bouclier' },
  { id: 'namerya', nom: 'Namerya', titre: 'L’ondine aux yeux d’océan', couleur: '#3FA7D6',
    peau: '#F1D6C8', yeux: { couleur: '#3AA2DD', forme: 'grand' }, cheveux: { coupe: 'long', couleur: '#1A1C26' }, oreilles: 'petites',
    tenue: { type: 'robe', couleur: '#1B4F7C', couleur2: '#AEB9C7' }, signe: 'taches', objet: 'baton', couleurObjet: '#9FD8F0' },
  { id: 'zokhran', nom: 'Zokhran', titre: 'Poète de la marmite', couleur: '#D64545', tete: 'large', carrure: 'large',
    peau: '#7FA34A', yeux: { couleur: '#6B4A22', forme: 'rond' }, cheveux: { coupe: 'long', couleur: '#1F1A17' }, oreilles: 'pointues',
    dents: 'defenses', pilosite: 'guidon', accessoire: ['toque', 'tablier'], couleurCoiffe: '#A3303A',
    tenue: { type: 'tunique', couleur: '#8E2430', couleur2: '#D9A72E' }, signe: 'cicatrice', objet: 'hachoir', objet2: 'kazoo' },
  { id: 'baheng', nom: 'Ba Heng Ze', titre: 'Le savoir du monde', couleur: '#B08D57',
    peau: '#D7AD86', yeux: { couleur: '#4A5A3A', forme: 'mi-clos' }, cheveux: { coupe: 'long', couleur: '#ECE6DA' }, oreilles: 'longues', cornes: 'belier',
    pilosite: { type: 'barbe-longue', couleur: '#F2EEE6' }, tenue: { type: 'tunique', couleur: '#6B4A2E', couleur2: '#B08D57' }, objet: 'masse' },
  { id: 'dvergrost', nom: 'Dvergrost', titre: 'Enfant des rocs', couleur: '#7E8C99', taille: 'petite', carrure: 'large',
    peau: '#D49A74', yeux: { couleur: '#2A1D14', forme: 'petit' }, cheveux: { coupe: 'court', couleur: '#A04A24' }, oreilles: 'rondes',
    pilosite: { type: 'barbe-longue', couleur: '#A04A24' }, tenue: { type: 'tunique', couleur: '#5A3D27', couleur2: '#9AA2AA' }, accessoire: ['ours', 'griffes'], objet: 'hache' },
  { id: 'trayss', nom: 'Trayss', titre: 'Héritage des brumes', couleur: '#9B5DE5', tete: 'anguleuse', museau: 'dragon',
    peau: '#6A3FA0', yeux: { couleur: '#C88BFF', forme: 'fendu', lueur: true }, cornes: 'arriere', dents: 'crocs', oreilles: 'petites',
    cheveux: { coupe: 'chauve', couleur: '#14151C' },
    tenue: { type: 'cuir', couleur: '#5E3A22', couleur2: '#B8783F' }, objet: 'arbalete', objet2: 'carquois',
    formes: {
      'Dragon': {},                                  // (le nom de son portrait de dragon dans CodexVTT : la forme de base)
      'Humaine': { tete: 'ovale', museau: '', peau: '#D6A684', yeux: { couleur: '#9B5DE5', forme: 'amande', lueur: false }, cornes: '', dents: '', cheveux: { coupe: 'queue', couleur: '#14151C', meche: '#9B5DE5' }, accessoire: 'boucles' },
      'Entre deux': { tete: 'ovale', museau: '', peau: '#8E70BC', cornes: 'petites', yeux: { couleur: '#E6D8FF', forme: 'amande', lueur: true }, cheveux: { coupe: 'queue', couleur: '#14151C', meche: '#9B5DE5' } },
    } },
];


// ----- src/filtres.js -----
/* =====================================================================
   FILTRES — les façons de dessiner un personnage (sa fiche d'apparence, voir apparence.js).
   Les mêmes traits partout : « cheveux longs blonds » est UN trait, que chaque filtre dessine à sa façon.
     Filtres.liste                       → [{ id, nom, texte }]
     Filtres.rendu(id, fiche, options)   → <svg>
       options : { expression: '' | 'parle' | 'rire' | 'choc' | 'ko', forme, cadrage: 'buste' | 'tete' | 'mi-corps' | 'pied', accent: '#…' }
       'pied' : le personnage EN PIED, sur le squelette du bouffon de Patagrain (src/squelette.js : mêmes articulations .bf-…,
       mêmes gestes). Un filtre qui ne se découpe pas en morceaux (écusson) dessine le pied en aplat.
   Venus des overlays de la famille : Néon (Mordethrhedan), Sticker (Ambries), Écusson (John Von Gurt),
   Vitrail (les facettes de cristal), Aplat (le dessin de base), Conte (le bouffon de Patagrain : aplats sans contour).
   ===================================================================== */
const Filtres = (() => {
  const T = Apparence.teinte;
  let n = 0;
  const ENCRE = '#140A24';
  const CADRAGES = { buste: '0 0 200 240', tete: '18 2 164 172', squelette: '0 -110 400 920' };
  const vb = o => CADRAGES[o.cadrage] || CADRAGES.buste;
  const esc = t => String(t || '').replace(/[&<>"]/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]));
  const attr = (c, fond, trait, ep) => `d="${c.d}" fill="${fond || 'none'}" ${trait ? `stroke="${trait}" stroke-width="${ep}" stroke-linecap="round" stroke-linejoin="round"` : ''}`;
  const svg = (o, contenu) => `<svg viewBox="${vb(o)}" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">${contenu}</svg>`;

  const FILTRES = {
    aplat: {
      nom: 'Aplat', texte: 'Des aplats de couleur simples, avec un contour doux.',
      rendu: (f, o) => svg(o, Apparence.calques(f, o).map(c => `<path ${attr(c, c.fond, c.trait, c.epaisseur)}/>`).join('')),
    },
    neon: {
      nom: 'Néon', texte: 'Le personnage en traits de néon sur le noir, comme une enseigne : chaque partie garde sa couleur, en lumière.',
      rendu(f, o) {
        const id = 'cs-neon' + (n++);
        return svg(o, `<defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="f"/><feMerge><feMergeNode in="f"/><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          <g filter="url(#${id})">${Apparence.calques(f, o).map(c => {
            const lum = T(c.fond || c.trait, .35);
            if (c.partie === 'yeux' && c.fond) return `<path ${attr(c, c.id === 'blanc' ? '#0B0D0E' : lum, null)}/>`;
            return `<path ${attr(c, c.fond ? T(c.fond, -.82) : null, lum, c.trait ? Math.max(2.4, c.epaisseur * .8) : 2.6)}/>`;
          }).join('')}</g>`);
      },
    },
    sticker: {
      nom: 'Sticker', texte: 'En autocollant découpé : contour noir, grosse bordure blanche, ombre portée, légère inclinaison.',
      rendu(f, o) {
        const tout = Apparence.calques(f, o), pleins = tout.filter(c => c.fond);
        const rot = o.cadrage === 'squelette' || o.sans || o.seulement ? 0 : ((String(f.id || f.nom || '').length % 5) - 2) * 2;   // (en pied : pas d'inclinaison, les membres ne s'aligneraient plus)
        const plein = c => `<path d="${c.d}" fill="${c.fond || 'none'}" stroke="${c.trait || ENCRE}" stroke-width="${c.trait ? c.epaisseur + 1 : 4}" stroke-linecap="round" stroke-linejoin="round" paint-order="stroke fill"/>`;
        return svg(o, `<g transform="rotate(${rot} 100 120)">
          <g transform="translate(6 6)">${pleins.map(c => `<path d="${c.d}" fill="${ENCRE}" stroke="${ENCRE}" stroke-width="18" stroke-linejoin="round"/>`).join('')}</g>
          ${pleins.map(c => `<path d="${c.d}" fill="#fff" stroke="#fff" stroke-width="18" stroke-linejoin="round"/>`).join('')}
          ${tout.map(plein).join('')}</g>`);
      },
    },
    ecusson: {
      pied: false,                                       // un écusson ne se découpe pas en membres : en pied, c'est l'aplat
      nom: 'Écusson', texte: 'Un écusson brodé, comme ceux des combinaisons d’astronaute : le buste dans un rond, le nom autour.',
      rendu(f, o) {
        const id = 'cs-ecusson' + (n++), accent = o.accent || '#FF9F1C';
        const L = Apparence.calques(f, o);
        return `<svg viewBox="0 0 200 240" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">
          <defs><clipPath id="${id}"><circle cx="100" cy="118" r="80"/></clipPath><path id="${id}a" d="M28 118 A72 72 0 0 0 172 118"/></defs>
          <circle cx="100" cy="118" r="98" fill="#141920" stroke="#E6EAEE" stroke-width="5"/>
          <circle cx="100" cy="118" r="80" fill="#0B0E13" stroke="${accent}" stroke-width="4"/>
          <g clip-path="url(#${id})"><g transform="translate(100 118) scale(.82) translate(-100 -112)">${L.map(c => `<path ${attr(c, c.fond, c.trait || (c.fond ? 'rgba(0,0,0,.35)' : null), c.trait ? c.epaisseur : 1.5)}/>`).join('')}</g></g>
          <text font-family="monospace" font-weight="700" font-size="13" letter-spacing="3" fill="#E6EAEE" text-anchor="middle"><textPath href="#${id}a" startOffset="50%">${esc((f.nom || '').toUpperCase())}</textPath></text>
          <path d="M26 104 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z M174 104 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="${accent}" transform="translate(-3 0)"/></svg>`;
      },
    },
    vitrail: {
      nom: 'Vitrail', texte: 'Des aplats taillés en facettes, comme du verre ou du cristal, avec un liseré de lumière sur les épaules.',
      rendu(f, o) {
        const id = 'cs-vitrail' + (n++), accent = o.accent || '#1EE88A';
        const tri = [];
        for (let y = 0; y < 240; y += 26) for (let x = -13 * ((y / 26) % 2); x < 200; x += 26) {
          const k = Math.abs(Math.sin(x * 12.9 + y * 78.2)) % 1;
          tri.push(`<path d="M${x} ${y}L${x + 26} ${y}L${x + 13} ${y + 26}Z" fill="#fff" fill-opacity="${(k * .22).toFixed(2)}"/><path d="M${x + 13} ${y + 26}L${x + 26} ${y}L${x + 39} ${y + 26}Z" fill="#000" fill-opacity="${((1 - k) * .18).toFixed(2)}"/>`);
        }
        const grandes = new Set(['visage', 'cheveux', 'cheveux-dos', 'epaules', 'accessoire-dos', 'accessoire']);
        const L = Apparence.calques(f, o);
        return svg(o, `<defs><pattern id="${id}" width="200" height="240" patternUnits="userSpaceOnUse">${tri.join('')}</pattern>
            <filter id="${id}h"><feGaussianBlur stdDeviation="1.6" result="f"/><feMerge><feMergeNode in="f"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          ${L.map(c => `<path ${attr(c, c.fond, c.trait, c.epaisseur)}/>` + (grandes.has(c.id) && c.fond ? `<path d="${c.d}" fill="url(#${id})"/>` : '')).join('')}
          <g filter="url(#${id}h)">${L.filter(c => c.id === 'epaules').map(c => `<path d="${c.d}" fill="none" stroke="${accent}" stroke-width="2.4"/>`).join('')}</g>`);
      },
    },
    conte: {
      nom: 'Conte', texte: 'Le style du bouffon de Patagrain : des aplats de couleur francs, SANS contour ; seuls les traits du visage (sourcils, nez, bouche, lunettes) sont dessinés au trait fin.',
      // Les formes pleines : la couleur seule (aucun contour) ; les traits (calques sans fond) : leur couleur, un peu plus fins
      rendu: (f, o) => svg(o, Apparence.calques(f, o).map(c => `<path ${c.fond ? `d="${c.d}" fill="${c.fond}"` : attr(c, null, c.trait, Math.max(2, c.epaisseur * .9))}/>`).join('')),
    },
  };

  // ---------- En pied : le squelette de Patagrain, habillé des traits (src/squelette.js) ; chaque morceau dessiné par le filtre ----------
  // Un filtre qui ne se découpe pas en morceaux (l'écusson) dessine le pied en aplat.
  function pied(id, fiche, o) {
    const F = FILTRES[id] && FILTRES[id].pied !== false ? FILTRES[id] : FILTRES.aplat;
    return Squelette.svg(fiche, o, oo => F.rendu(fiche, { ...o, ...oo }));
  }

  return {
    liste: Object.entries(FILTRES).map(([id, f]) => ({ id, nom: f.nom, texte: f.texte })),
    existe: id => !!FILTRES[id],
    rendu: (id, fiche, o = {}) => o.cadrage === 'pied' && !o.partie ? pied(id, fiche, o)
      // mi-corps : le personnage du squelette, cadré de la tête à la taille (silhouette élancée, comme les anciens héros de Patagrain)
      : o.cadrage === 'mi-corps' ? pied(id, fiche, { ...o, cadrage: 'pied' }).replace('viewBox="0 -110 400 920"', 'viewBox="50 80 300 440"')
      : (FILTRES[id] || FILTRES.aplat).rendu(fiche, o),
  };
})();


// ----- src/squelette.js -----
/* =====================================================================
   SQUELETTE — le personnage EN PIED, sur le squelette du bouffon de Patagrain (le même moteur de gestes partout).
   Une fiche d'apparence (ses traits) est HABILLÉE sur le squelette : aucun dessin à la main. La tête est celle du buste
   (Apparence.calques), le corps est construit d'après la tenue, la carrure, la taille et les objets tenus.
     Squelette.svg(fiche, { filtre, expression, forme, accent }) → <svg class="bouffon-svg bouffon-pied cs-squelette">, viewBox 0 -110 400 920
     Squelette.pieces(fiche, partie) → les calques d'un morceau (Apparence.calques(fiche, { cadrage: 'squelette', partie }) y mène)
     Squelette.poserStyle()          → pose le MOTEUR des gestes (src/squelette.css) dans la page (une fois)
   Articulations (les mêmes que le bouffon) : .bf-tout › .bf-hanche-g/d › .bf-genou-g/d · .bf-haut › .bf-cheveux, .bf-tete ·
   .bf-epaule-g/d › .bf-coude-g/d. Un GESTE = une classe sur un parent (marche, saute, chute, hop, danse, gj-courir, gj-sort, attaque…).
   ===================================================================== */
const Squelette = (() => {
  const T = (h, k) => Apparence.teinte(h, k);
  const n = v => +(+v).toFixed(1);
  const pilule = (x, y, l, h, r) => `M${n(x + r)} ${n(y)} H${n(x + l - r)} Q${n(x + l)} ${n(y)} ${n(x + l)} ${n(y + r)} V${n(y + h - r)} Q${n(x + l)} ${n(y + h)} ${n(x + l - r)} ${n(y + h)} H${n(x + r)} Q${n(x)} ${n(y + h)} ${n(x)} ${n(y + h - r)} V${n(y + r)} Q${n(x)} ${n(y)} ${n(x + r)} ${n(y)} Z`;
  const rond = (x, y, r) => `M${n(x - r)} ${n(y)} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
  // (seulement des M / L / C : on peut les élargir et les descendre)
  const etirer = (d, k) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${n(200 + (x - 200) * k)} ${y}`);
  const descendre = (d, dy) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${x} ${n(+y + dy)}`);

  // La taille : petite (nain, halfelin) = jambes plus courtes, le haut du corps descend ; grande = plus élancé
  const GABARITS = { normale: { dy: 0, hanche: 594, genou: 682 }, petite: { dy: 70, hanche: 664, genou: 716 }, grande: { dy: -34, hanche: 560, genou: 666 } };
  function gabarit(f) {
    const g = GABARITS[f.taille] || GABARITS.normale, k = { large: 1.14, petite: .9 }[f.carrure] || 1;
    return { ...g, k, epaule: [n(200 - 84 * k), n(200 + 84 * k)], hancheX: [n(200 - 24 * k), n(200 + 24 * k)],
      tete: { x: 57, y: 90 + g.dy, l: 286, h: 343 } };   // le buste 200 × 240 posé sur le cou (visage 138 → 262, 150 → 326)
  }

  const TRONC = {
    tunique: 'M112 384 C150 368 250 368 288 384 L272 532 L286 590 L114 590 L128 532 Z',
    cuir: 'M112 384 C150 368 250 368 288 384 L274 540 L282 594 L118 594 L126 540 Z',
    armure: 'M108 384 C150 366 250 366 292 384 L278 540 L288 596 L112 596 L122 540 Z',
    robe: 'M112 384 C150 368 250 368 288 384 L306 744 C250 762 150 762 94 744 Z',
    mage: 'M112 384 C150 368 250 368 288 384 L308 746 C250 764 150 764 92 746 Z',
    cape: 'M112 384 C150 368 250 368 288 384 L272 532 L286 590 L114 590 L128 532 Z',
  };
  const longue = t => t === 'robe' || t === 'mage';

  // Les objets tenus : x, y = la main ; s = +1 côté droit de l'image (vers l'extérieur), -1 côté gauche.
  // Les armes pointent VERS LE BAS au repos (le long de la jambe) : quand le bras se lève pour frapper, elles pointent en l'air.
  function objet(nom, x, y, s, f, t2) {
    const X = dx => n(x + s * dx), Y = dy => n(y + dy);
    const bois = '#7A5230', acier = '#C5CBD3', fer = '#5A6270', lueur = f.couleurObjet || '#7FE0FF';
    const P = (d, fond, trait, ep) => ({ id: 'objet', d, partie: 'detail', fond, trait: trait === undefined ? (fond ? T(fond, -.5) : null) : trait, epaisseur: ep || (fond ? 2 : 3) });
    const lame = `M${X(-5)} ${Y(10)} L${X(5)} ${Y(10)} L${X(6)} ${Y(196)} L${X(0)} ${Y(222)} L${X(-6)} ${Y(196)} Z`;
    const garde = `M${X(-24)} ${Y(2)} L${X(24)} ${Y(2)} L${X(24)} ${Y(12)} L${X(-24)} ${Y(12)} Z`;
    const poignee = `M${X(-5)} ${Y(-26)} L${X(5)} ${Y(-26)} L${X(5)} ${Y(4)} L${X(-5)} ${Y(4)} Z`;
    const manche = (a, b) => `M${X(-5)} ${Y(a)} L${X(5)} ${Y(a)} L${X(5)} ${Y(b)} L${X(-5)} ${Y(b)} Z`;
    switch (nom) {
      case 'epee': return [P(lame, '#DDE2E8', fer), P(garde, '#C9A23A'), P(poignee, '#5A3A22')];
      case 'epee-magique': return [P(lame, null, lueur, 14), P(lame, T(lueur, .55), lueur, 3), P(`M${X(0)} ${Y(40)} L${X(0)} ${Y(180)}`, null, '#FFFFFF', 2), P(garde, '#8E6BD6'), P(poignee, '#3A2A5A')];
      case 'hache': return [P(manche(-30, 176), bois),
        P(`M${X(5)} ${Y(112)} C${X(44)} ${Y(96)} ${X(62)} ${Y(124)} ${X(58)} ${Y(178)} C${X(40)} ${Y(166)} ${X(20)} ${Y(160)} ${X(5)} ${Y(164)} Z`, acier, fer),
        P(`M${X(-5)} ${Y(124)} L${X(-22)} ${Y(138)} L${X(-5)} ${Y(152)} Z`, acier, fer)];
      case 'hachoir': return [P(manche(-24, 34), bois), P(`M${X(-8)} ${Y(30)} L${X(50)} ${Y(30)} L${X(50)} ${Y(96)} L${X(-8)} ${Y(96)} Z`, acier, fer), P(rond(X(36), Y(44), 4), '#3A3A3A', null)];
      case 'masse': return [P(manche(-24, 132), bois), P(`M${X(-18)} ${Y(128)} L${X(18)} ${Y(128)} L${X(22)} ${Y(172)} L${X(-22)} ${Y(172)} Z`, '#8A939E', '#4A5260'),
        P(`M${X(-22)} ${Y(140)} L${X(-34)} ${Y(150)} L${X(-22)} ${Y(160)} Z M${X(22)} ${Y(140)} L${X(34)} ${Y(150)} L${X(22)} ${Y(160)} Z`, '#8A939E', '#4A5260')];
      case 'baton': return [P(manche(-176, 232), bois), P(rond(X(0), Y(-190), 15), lueur === '#7FE0FF' ? '#9B5DE5' : lueur), P(rond(X(-4), Y(-195), 4), '#FFFFFF', null)];
      case 'arc': return [P(`M${X(10)} ${Y(-150)} C${X(62)} ${Y(-60)} ${X(62)} ${Y(60)} ${X(10)} ${Y(150)} L${X(18)} ${Y(150)} C${X(72)} ${Y(60)} ${X(72)} ${Y(-60)} ${X(18)} ${Y(-150)} Z`, bois),
        P(`M${X(12)} ${Y(-150)} L${X(12)} ${Y(150)}`, null, '#EDE6D2', 2)];
      case 'arbalete': return [P(`M${X(-12)} ${Y(-9)} L${X(84)} ${Y(-9)} L${X(84)} ${Y(9)} L${X(-12)} ${Y(9)} Z`, bois),
        P(`M${X(72)} ${Y(-44)} C${X(88)} ${Y(-22)} ${X(88)} ${Y(22)} ${X(72)} ${Y(44)}`, null, '#5A3A22', 6), P(`M${X(72)} ${Y(-44)} L${X(60)} ${Y(0)} L${X(72)} ${Y(44)}`, null, '#EDE6D2', 2)];
      case 'bouclier': return [P(rond(X(8), Y(-34), 48), t2, T(t2, -.5), 4), P(rond(X(8), Y(-34), 30), null, T(t2, .3), 3), P(rond(X(8), Y(-34), 10), '#C9A23A')];
      case 'livre': return [P(`M${X(-22)} ${Y(-12)} L${X(28)} ${Y(-18)} L${X(30)} ${Y(36)} L${X(-20)} ${Y(42)} Z`, '#7A2E2E', '#3A1414'), P(`M${X(4)} ${Y(-14)} L${X(6)} ${Y(38)}`, null, '#EDE2C8', 3)];
      case 'kazoo': return [P(`M${X(-10)} ${Y(-8)} L${X(44)} ${Y(-16)} L${X(48)} ${Y(2)} L${X(-8)} ${Y(8)} Z`, '#E8A33A', '#7A4E12'), P(rond(X(22), Y(-6), 4), '#3A2A1A', null)];
      default: return [];
    }
  }

  // Les calques d'UN morceau, en unités du squelette
  function pieces(fiche, partie) {
    const f = fiche || {}, G = gabarit(f), dy = G.dy, k = G.k;
    const t = f.tenue || {}, tt = TRONC[t.type] ? t.type : 'tunique', tc = t.couleur || f.couleur || '#4F7CAC';
    const t2 = t.couleur2 || T(tc, .35), peau = f.peau || '#E8B894', ombre = T(peau, -.18);
    const accs = [].concat(f.accessoire || []);
    const pantalon = T(tc, -.55), souliers = '#3A2A1C', manche = tc, manche2 = T(tc, -.08);
    const L = [];
    const pousser = (id, d, p, fond, trait = null, epaisseur = 0) => { if (d) L.push({ id, d, partie: p, fond, trait, epaisseur }); };
    const haut = d => descendre(etirer(d, k), dy);                       // une forme du haut du corps : élargie (carrure), descendue (taille)
    const cote = partie.slice(-1), x = { g: G.epaule[0], d: G.epaule[1] }[cote], s = cote === 'g' ? -1 : 1;
    if (partie === 'dos') {
      if (accs.includes('ours')) pousser('ours', haut('M116 378 C86 500 78 640 86 722 L102 708 L116 728 L132 708 L148 730 L166 708 L182 730 L200 708 L218 730 L234 708 L252 730 L268 708 L284 728 L298 708 L314 722 C322 640 314 500 284 378 Z'), 'tenue', '#5A4030', '#3A2A1E', 2);
      else if (tt === 'cape' || accs.includes('capuche')) pousser('cape', haut('M124 384 C96 520 86 680 92 772 C150 792 250 792 308 772 C314 680 304 520 276 384 Z'), 'tenue', T(tc, -.3));
      if (f.objet === 'carquois' || f.objet2 === 'carquois') {
        pousser('carquois', haut('M236 380 L266 372 L300 540 L270 548 Z'), 'detail', '#7A5230', '#3A2414', 2);
        pousser('fleches', haut('M244 380 L234 336 M254 376 L248 330 M264 374 L262 332'), 'detail', null, '#EDE6D2', 3);
      }
    } else if (partie === 'torse') {
      pousser('cou', descendre('M178 300 L222 300 L226 386 L174 386 Z', dy), 'peau', ombre);
      pousser('tronc', haut(TRONC[tt]), 'tenue', tc);
      if (tt === 'armure') pousser('plaques', haut('M200 388 L200 520 M134 430 C170 446 230 446 266 430 M128 480 C170 496 230 496 272 480'), 'detail', null, T(tc, -.4), 4);
      if (tt === 'cuir') { pousser('sangle', haut('M130 396 L270 524'), 'detail', null, T(tc, -.45), 9); pousser('rivets', [rond(n(200 - 50 * k), 404 + dy, 4), rond(n(200 + 50 * k), 404 + dy, 4), rond(n(200 - 54 * k), 470 + dy, 4), rond(n(200 + 54 * k), 470 + dy, 4)].join(' '), 'detail', '#D7DCE2', '#6A7078', 1.5); }
      if (tt === 'mage') { pousser('galons', haut('M200 392 L200 744 M98 728 C150 744 250 744 302 728'), 'detail', null, t.couleur2 || '#D9A72E', 6); pousser('etoiles', [rond(150, 620 + dy, 5), rond(250, 560 + dy, 5), rond(162, 500 + dy, 4), rond(244, 680 + dy, 4)].join(' '), 'detail', t.couleur2 || '#D9A72E', null); }
      if (tt !== 'armure') pousser('col', haut('M176 382 L200 422 L224 382 Z'), 'tenue', t2);
      pousser('ceinture', longue(tt) ? pilule(n(200 - 66 * k), 470 + dy, n(132 * k), 14, 6) : pilule(n(200 - 76 * k), 520 + dy, n(152 * k), 16, 6), 'tenue', longue(tt) ? t2 : '#5A3A22');
      if (accs.includes('tablier')) { pousser('tablier', haut('M146 432 L254 432 L266 652 L134 652 Z'), 'tenue', '#F2EEE4', '#B9B2A2', 2); pousser('bretelles', haut('M150 432 L178 386 M250 432 L222 386'), 'detail', null, '#B9B2A2', 5); }
      if (accs.includes('griffes')) { pousser('cordon', haut('M160 390 C180 406 220 406 240 390'), 'detail', null, '#5A3A22', 3);
        pousser('griffes', haut([164, 180, 196, 212, 228].map((gx, i) => `M${gx} ${398 + (i === 2 ? 6 : i % 4 ? 4 : 0)} L${gx + 4} ${420 + (i === 2 ? 6 : i % 4 ? 4 : 0)} L${gx + 8} ${398 + (i === 2 ? 6 : i % 4 ? 4 : 0)} Z`).join(' ')), 'detail', '#EFE6CE', '#7A6A4A', 1.5); }
      if (accs.includes('ours')) pousser('ours-epaules', haut('M110 392 C120 366 160 360 176 372 L170 388 L186 380 L200 392 L214 380 L230 388 L224 372 C240 360 280 366 290 392 C270 384 250 388 236 396 L200 404 L164 396 C150 388 130 384 110 392 Z'), 'tenue', '#6A4C36', '#3A2A1E', 2);
      if (tt === 'cape' || accs.includes('capuche') || accs.includes('ours')) pousser('fermoir', pilule(192, 384 + dy, 16, 16, 4), 'detail', '#F5C542', '#8A6A1A', 1.5);
    } else if (partie === 'bras-g' || partie === 'bras-d') {
      pousser('manche', pilule(x - 15, 380 + dy, 30, 96, 15), 'tenue', manche);
      if (tt === 'armure' || tt === 'cuir') pousser('epauliere', `M${n(x - 28)} ${400 + dy} C${n(x - 28)} ${372 + dy} ${n(x + 28)} ${372 + dy} ${n(x + 28)} ${400 + dy} Z`, 'tenue', tt === 'armure' ? '#9AA3AE' : T(tc, -.3), tt === 'armure' ? '#4A5260' : T(tc, -.6), 2);
    } else if (partie === 'avant-bras-g' || partie === 'avant-bras-d') {
      pousser('avant-bras', pilule(x - 13, 462 + dy, 26, 86, 13), 'tenue', manche2);
      pousser('poignet', pilule(x - 14, 530 + dy, 28, 9, 4), 'tenue', t2);
    } else if (partie === 'main-g' || partie === 'main-d') {
      pousser('main', rond(x, 552 + dy, 15), 'peau', peau, T(peau, -.3), 2);
    } else if (partie === 'objet-g' || partie === 'objet-d') {
      const nom = cote === 'd' ? f.objet : f.objet2;
      if (nom && nom !== 'carquois') L.push(...objet(nom, x, 552 + dy, s, f, t2));
    } else if (/^(cuisse|tibia)-[gd]$/.test(partie)) {
      const hx = { g: G.hancheX[0], d: G.hancheX[1] }[cote];
      if (partie.startsWith('cuisse')) { if (!longue(tt)) pousser('cuisse', pilule(hx - 17, G.hanche - 8, 34, G.genou - G.hanche + 14, 15), 'tenue', pantalon); }
      else {
        if (!longue(tt)) pousser('tibia', pilule(hx - 15, G.genou - 6, 30, 772 - G.genou, 13), 'tenue', T(pantalon, -.1));
        const F = dx => n(hx + s * dx);
        pousser('soulier', `M${F(-15)} 760 L${F(-15)} 782 C${F(0)} 790 ${F(30)} 790 ${F(40)} 778 C${F(44)} 772 ${F(42)} 762 ${F(36)} 758 C${F(28)} 762 ${F(22)} 764 ${F(15)} 760 Z`, 'tenue', souliers);
      }
    }
    return L;
  }

  // ---------- L'assemblage : chaque morceau dessiné par le filtre, posé dans son articulation ----------
  let style = false;
  function poserStyle() {
    if (style || typeof document === 'undefined') return; style = true;
    const s = document.createElement('style'); s.dataset.codexStream = 'squelette';
    s.textContent = typeof SQUELETTE_CSS !== 'undefined' ? SQUELETTE_CSS : '';
    document.head.appendChild(s);
  }
  // TETE_SANS : la tête sans le corps du buste ; CHEVEUX_DOS : ce qui passe derrière le tronc
  const TETE_SANS = ['epaules', 'col', 'cou', 'cheveux-dos', 'accessoire-dos', 'accessoire-corps'], CHEVEUX_DOS = ['cheveux-dos', 'accessoire-dos'];
  function svg(fiche, o = {}, rendre) {
    poserStyle();
    const G = gabarit(fiche || {}), dy = G.dy, TOUT = { x: 0, y: -110, l: 400, h: 920 };
    const poser = (texte, z) => texte.replace('<svg ', `<svg x="${z.x}" y="${z.y}" width="${z.l}" height="${z.h}" `);
    const morceau = partie => poser(rendre({ cadrage: 'squelette', partie }), TOUT);
    const g = (classe, pivot, contenu) => `<g class="${classe}" style="transform-origin:${pivot[0]}px ${pivot[1]}px">${contenu}</g>`;
    const jambe = c => { const hx = G.hancheX[c === 'g' ? 0 : 1]; return g('bf-hanche-' + c, [hx, G.hanche], morceau('cuisse-' + c) + g('bf-genou-' + c, [hx, G.genou], morceau('tibia-' + c))); };
    const bras = c => { const x = G.epaule[c === 'g' ? 0 : 1]; return g('bf-epaule-' + c, [x, 392 + dy], morceau('bras-' + c) + g('bf-coude-' + c, [x, 470 + dy], morceau('avant-bras-' + c) + morceau('objet-' + c) + morceau('main-' + c))); };
    const tete = poser(rendre({ cadrage: 'buste', sans: TETE_SANS }), G.tete);
    return `<svg class="bouffon-svg bouffon-pied cs-squelette" viewBox="0 -110 400 920" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">${g('bf-tout', [200, 790], `
      ${morceau('dos')}${jambe('g')}${jambe('d')}
      ${g('bf-haut', [200, 380 + dy], `<g class="bf-cheveux">${poser(rendre({ cadrage: 'buste', seulement: CHEVEUX_DOS }), G.tete)}</g>`)}
      ${morceau('torse')}${bras('g')}${bras('d')}
      ${g('bf-haut', [200, 380 + dy], `<g class="bf-tete">${tete}</g>`)}`)}</svg>`;
  }
  return { svg, pieces, gabarit, poserStyle };
})();


// ----- src/arene.js -----
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


// ----- src/scenette.js -----
/* =====================================================================
   SCÉNETTE — pendant un jet de dés, le personnage entre dans un rectangle de la page et joue son geste
   (court, se cache, lance un sort, frappe, pare…), puis il réagit au résultat : il rit à la réussite,
   il est choqué à l'échec, il tombe K.O. à l'échec critique, il danse au critique.
     Scenette.jouer(conteneur, jet, { dessin(expression) → <svg>, duree, denouement, zone, carte, pied }) → promesse (finie quand il disparaît)
   pied: true → le personnage EN PIED (squelette de Patagrain, Filtres.rendu(…, { cadrage: 'pied' })) joue le jet avec la mise en scène
   de l'ARÈNE (src/arene.js) : il court, se cache, lance un sort, frappe…, puis saute de joie ou tombe.
   conteneur : n'importe quel élément de la page (on y pose un calque qui le remplit) ;
   zone : { x, y, l, h } en pixels (la scénette se pose à cet endroit du conteneur, au-dessus du reste : scènes des overlays) ;
   carte(el) : pour remplir le bandeau du haut (.cs-carte), ex. le compteur du jet.
   Classes (pour le CSS personnalisé d'OBS, ou le css/jdr.css d'un overlay) : .cs-scenette, .cs-fond, .cs-carte, .cs-perso, .cs-effet
   ===================================================================== */
const Scenette = (() => {
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  const bouger = (el, images, ms, easing = 'ease-in-out') => el.animate(images, { duration: ms, easing, fill: 'forwards' }).finished;
  let style = false;
  function poserStyle() {
    if (style || typeof document === 'undefined') return; style = true;
    const s = document.createElement('style');
    s.textContent = `.cs-scenette { position: absolute; inset: 0; overflow: hidden; }
      .cs-scenette.cs-zone { inset: auto; z-index: 20; }
      .cs-scenette .cs-fond { position: absolute; inset: 0; }
      .cs-scenette .cs-carte { position: absolute; left: 0; right: 0; top: 0; }
      .cs-scenette .cs-perso { position: absolute; left: 50%; bottom: 0; height: 92%; aspect-ratio: 200 / 240; transform-origin: 50% 100%; }
      .cs-scenette .cs-perso svg { width: 100%; height: 100%; display: block; overflow: visible; }
      .cs-scenette .cs-effet { position: absolute; font-size: 44px; line-height: 1; pointer-events: none; }`;
    document.head.appendChild(s);
  }

  async function jouer(conteneur, jet, { dessin, duree = 4000, denouement = 1500, zone = null, carte = null, pied = false } = {}) {
    poserStyle();
    if (pied) {                                    // en pied : la mise en scène de l'arène, dans le même rectangle
      if (getComputedStyle(conteneur).position === 'static') conteneur.style.position = 'relative';
      const el = document.createElement('div');
      el.className = 'cs-scenette cs-pied' + (zone ? ' cs-zone' : '');
      if (zone) Object.assign(el.style, { left: zone.x + 'px', top: zone.y + 'px', width: zone.l + 'px', height: zone.h + 'px' });
      el.innerHTML = '<div class="cs-fond"></div>';
      conteneur.appendChild(el);
      const scene = document.createElement('div'); scene.style.cssText = 'position:absolute;inset:0';
      el.appendChild(scene);
      try { await Arene.jouer(scene, jet, { dessin, carte: false, duree, denouement }); } finally { el.remove(); }
      return;
    }
    if (getComputedStyle(conteneur).position === 'static') conteneur.style.position = 'relative';
    const t0 = performance.now();
    const el = document.createElement('div');
    el.className = 'cs-scenette' + (zone ? ' cs-zone' : '');
    if (zone) Object.assign(el.style, { left: zone.x + 'px', top: zone.y + 'px', width: zone.l + 'px', height: zone.h + 'px' });
    el.innerHTML = '<div class="cs-fond"></div><div class="cs-carte"></div><div class="cs-perso"></div>';
    conteneur.appendChild(el);
    el.querySelector('.cs-fond').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
    if (carte) carte(el.querySelector('.cs-carte'));
    const perso = el.querySelector('.cs-perso');
    const dessiner = (e = '') => { perso.innerHTML = dessin(e); };
    dessiner();
    const effet = (texte, x, y = 30, images = null, ms = 1200) => {
      const e = document.createElement('div'); e.className = 'cs-effet'; e.textContent = texte;
      Object.assign(e.style, { left: x + '%', bottom: y + '%' }); el.appendChild(e);
      return bouger(e, images || [{ opacity: 0, transform: 'translateY(0) scale(.6)' }, { opacity: 1, transform: 'translateY(-30px) scale(1.1)', offset: .3 }, { opacity: 0, transform: 'translateY(-70px) scale(1)' }], ms).then(() => e.remove());
    };
    const X = 'translateX(-50%)';
    await (jet.geste === 'courir'
      ? bouger(perso, [{ transform: 'translateX(160%)' }, { transform: X }], Math.max(900, denouement - 300), 'cubic-bezier(.2,.8,.3,1)')
      : bouger(perso, [{ transform: `${X} translateY(105%)` }, { transform: X }], 450, 'cubic-bezier(.34,1.56,.64,1)'));

    // --- le geste, pendant que les dés roulent dans CodexVTT ---
    const g = jet.geste;
    const gestes = {
      cacher: () => bouger(perso, [{ opacity: 1, transform: X }, { opacity: .25, transform: `${X} translateY(8%) scale(.92)` }], 700),
      crocheter: () => { effet('🔒', 62, 40); return bouger(perso, [{ transform: X }, { transform: `${X} rotate(-4deg)` }, { transform: X }], 600); },
      lire: () => { effet('📖', 64, 45); return bouger(perso, [{ transform: X }, { transform: `${X} translateY(-4%)` }, { transform: X }], 700); },
      observer: () => { effet('👁️', 64, 50); return bouger(perso, [{ transform: X }, { transform: `${X} rotate(6deg)` }, { transform: `${X} rotate(-6deg)` }, { transform: X }], 900); },
      parler: () => { effet('💬', 66, 55); return bouger(perso, [{ transform: X }, { transform: `${X} translateY(-6%)` }, { transform: X }, { transform: `${X} translateY(-6%)` }, { transform: X }], 800); },
      menacer: () => { effet('💢', 66, 55); return bouger(perso, [{ transform: X }, { transform: `${X} scale(1.12)` }, { transform: X }], 600); },
      danser: () => { effet('♪', 30, 50); effet('♫', 70, 55); return bouger(perso, [{ transform: X }, { transform: `${X} rotate(-8deg)` }, { transform: `${X} rotate(8deg)` }, { transform: X }], 900); },
      parer: () => { effet('🛡️', 64, 35); return bouger(perso, [{ transform: X }, { transform: `${X} translateX(-6%)` }, { transform: X }], 500); },
      sort: () => { effet('✨', 30, 60); effet('✨', 70, 40); return bouger(perso, [{ transform: X, filter: 'none' }, { transform: `${X} translateY(-6%)`, filter: 'brightness(1.6)' }, { transform: X, filter: 'none' }], 900); },
      tirer: () => { effet('➶', 70, 45, [{ opacity: 1, transform: 'translateX(-60px)' }, { opacity: 0, transform: 'translateX(140px)' }], 600); return bouger(perso, [{ transform: X }, { transform: `${X} translateX(-8%)` }, { transform: X }], 500); },
      frapper: () => bouger(perso, [{ transform: X }, { transform: `${X} translateX(-10%) rotate(-6deg)` }, { transform: `${X} translateX(14%) rotate(8deg)` }, { transform: X }], 650),
      soigner: () => { effet('💚', 50, 70); return bouger(perso, [{ transform: X, filter: 'none' }, { transform: X, filter: 'brightness(1.4)' }, { transform: X, filter: 'none' }], 800); },
      garde: () => bouger(perso, [{ transform: X }, { transform: `${X} scale(1.06)` }, { transform: X }], 500),
    };
    if (gestes[g]) await gestes[g]();
    await attendre(Math.max(0, denouement - (performance.now() - t0)));
    if (g === 'cacher') bouger(perso, [{ opacity: .25 }, { opacity: 1 }], 300);

    // --- le dénouement : la réaction au résultat ---
    const v = jet.verdict;
    if (v === 'crit') {
      dessiner('rire'); ['★', '✦', '★', '✦'].forEach((s, i) => setTimeout(() => effet(s, 15 + i * 22, 55 + (i % 2) * 15), i * 200));
      await bouger(perso, [{ transform: X }, { transform: `${X} translateY(-12%) rotate(-6deg)` }, { transform: X }, { transform: `${X} translateY(-12%) rotate(6deg)` }, { transform: X }], 1100);
    } else if (v === 'ok') {
      dessiner('rire');
      if (g === 'frapper' || g === 'tirer') effet('💥', 72, 45);
      await bouger(perso, [{ transform: X }, { transform: `${X} translateY(-14%)` }, { transform: X }], 600, 'cubic-bezier(.34,1.56,.64,1)');
    } else if (v === 'rate') {
      dessiner('choc'); effet('💧', 30, 60);
      await bouger(perso, [{ transform: X }, { transform: `${X} translateX(-4%)` }, { transform: `${X} translateX(4%)` }, { transform: X }], 400);
    } else if (v === 'fumble') {
      dessiner('ko'); effet('💥', 50, 60);
      await bouger(perso, [{ transform: X }, { transform: `${X} rotate(-14deg) translateY(4%)` }, { transform: `${X} rotate(80deg) translateY(30%)` }], 900, 'cubic-bezier(.5,0,.8,.4)');
    } else if (g === 'soigner') effet(`+${jet.resultat}`, 60, 60);

    await attendre(Math.max(500, duree - (performance.now() - t0 - denouement)));
    await bouger(el, [{ opacity: 1 }, { opacity: 0 }], 400);
    el.remove();
  }
  return { jouer };
})();


// ----- src/coeur.js -----
/* =====================================================================
   CODEX-STREAM — le cœur : la partie CodexVTT (mode spectateur, lecture seule) pour une page de stream.
     const cs = CodexStream.brancher({ adresse, cle, filtre, monPerso, demo, accent })
       adresse  : celle de CodexVTT (défaut : l'origine de la page, quand elle est servie par CodexVTT)
       cle      : la clé spectateur de la table
       filtre   : 'neon' | 'sticker' | 'ecusson' | 'vitrail' | 'aplat' (Filtres.liste)
       monPerso : id de fiche ou nom : « mon » personnage (moi: true) ; demo : true = une partie inventée, sans CodexVTT
     cs.on('etat', e => …)      'connexion' | 'en-ligne' | 'refusee' | 'revoquee' | 'hors-ligne' | 'demo'
     cs.on('table', persos => …)    [{ id, nom, pv, pvMax, aTerre, forme, apparence, joueur, moi }]
     cs.on('perso', perso => …)     un perso qui change (PV, forme, apparence…)
     cs.on('coup', (perso, delta) => …)
     cs.on('jet', jet => …)         { persoId, nom, libelle, formule, resultat, dd, des, verdict, geste, mot, pnj, moi }
     cs.on('combat', c => …)        { tour, actif, ordre: [{ id, nom, init, pnj, persoId }] } ou null
     cs.on('parle', (perso, oui) => …)
     const p = cs.portrait(el, persoId, { cadrage })  le personnage dessiné dans el, animé tout seul (parle, K.O., forme) ; p.detruire()
     const s = cs.scenette(el, { duree, pnj, seulement, pied }) joue chaque jet dans le rectangle el (un à la fois) ; s.detruire()
       (pied: true → le personnage en pied, sur le squelette de Patagrain : la mise en scène de l'arène)
     cs.parle(persoId, oui)                           relai d'un bot Discord ; cs.dessin(persoId, options) → <svg> ; cs.fermer()
   Sans se brancher : CodexStream.fiche(perso) · CodexStream.dessiner(fiche, { filtre, expression, forme, cadrage })
     CodexStream.code(fiche) → « PERSO1-… » (l'apparence en une ligne) · CodexStream.depuisCode(texte) → la fiche (ou null)
     CodexStream.Scenette.jouer(el, jet, { dessin, zone, carte }) · CodexStream.themes() / .theme(id) · .Filtres · .Apparence
   ===================================================================== */
const CodexStream = (() => {
  const normaliser = t => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const memeNom = (a, b) => { const x = normaliser(a), y = normaliser(b); return !!x && !!y && (x === y || x.startsWith(y + ' ') || y.startsWith(x + ' ') || x.split(' ')[0] === y.split(' ')[0]); };
  const DENOUEMENT = 1500;     // les dés 3D de CodexVTT se posent ~1,5 s après le lancer

  // ---------- Lire un jet : quel geste (d'après la compétence), quel verdict, quel mot ----------
  // Libellés de CodexVTT : compétences D&D 5e, traits Daggerheart, caractéristiques COF2. La première ligne qui correspond l'emporte.
  const COMPETENCES = [
    [/athlet|acrobat|course|agilit|bondir|sauter|esquive/, 'courir'], [/escalad|grimp/, 'grimper'], [/discret|furtiv|cacher|dissimul/, 'cacher'],
    [/escamot|crochet|serrur|desamorc|piege|vol a la tire|outils|finesse/, 'crocheter'], [/investig|fouill|cherch/, 'crocheter'],
    [/arcane|histoire|religion|connaiss|savoir|erudi|lire|dechiffr|nature|medecin|intellig/, 'lire'],
    [/percept|perspica|survie|instinct|observ|pister|vigilan/, 'observer'], [/intimid/, 'menacer'],
    [/persua|tromper|bluff|diplom|negoci|charme|charisme|presence|dressage|commander/, 'parler'], [/represent|musique|chant|danse|spectacle/, 'danser'],
    [/constitution|volonte|endur|resist/, 'parer'], [/sort|magie|incant|focus|rituel|pouvoir/, 'sort'],
    [/arc|arbalet|fronde|lancer|jet|tir|distance/, 'tirer'], [/force|puissance/, 'frapper'],
  ];
  function geste(j) {
    if (j.kind === 'heal') return 'soigner';
    if (j.kind === 'save') return 'parer';
    if (j.kind === 'initiative') return 'garde';
    const l = normaliser(j.label);
    for (const [m, g] of COMPETENCES) if (m.test(l)) return g;
    return j.kind === 'attack' || j.kind === 'damage' ? 'frapper' : 'neutre';
  }
  function verdict(j) {
    if (j.isCritSuccess || j.dhOutcome === 'critical') return 'crit';
    if (j.isCritFail) return 'fumble';
    if (j.isSuccess === true) return 'ok';
    if (j.isSuccess === false) return 'rate';
    return '';
  }
  const MOTS = { crit: 'Critique !', fumble: 'Échec critique…', ok: 'Réussite !', rate: 'Échec…' };
  const MOTS_ATTAQUE = { ok: 'Touché !', rate: 'Raté…' };

  // Un aventurier encapuchonné, à une couleur tirée de son nom, pour un perso sans apparence
  const TEINTES = ['#4F7CAC', '#2F7A4F', '#8E3A3A', '#7A5A9C', '#B07A2E', '#2E8A8A', '#9C4F7A', '#5E6E8C'];
  const aventurier = (nom, couleur) => ({ id: 'aventurier', nom, tenue: { type: 'cape', couleur: couleur || TEINTES[[...String(nom)].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 9973, 7) % TEINTES.length] },
    accessoire: 'capuche', yeux: { couleur: '#3A2A1A' } });

  // Le client Socket.IO : déjà là (window.io), sinon le fichier livré à côté de ce module
  function chargerIo(base) {
    if (typeof io === 'function') return Promise.resolve(io);
    return new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = new URL('socket.io.min.js', base).href;
      s.onload = () => ok(window.io); s.onerror = () => ko(new Error('socket.io.min.js introuvable'));
      document.head.appendChild(s);
    });
  }

  function brancher(o = {}) {
    const options = { adresse: '', cle: '', filtre: 'aplat', monPerso: '', demo: false, accent: '', ...o };
    const ecouteurs = {};
    const emettre = (nom, ...a) => (ecouteurs[nom] || []).forEach(f => { try { f(...a); } catch (e) { console.error('[CodexStream]', nom, e); } });
    let persos = [], combat = null, socket = null, minuteurDemo = null;
    const parlent = new Set(), portraits = new Set();
    const adresse = String(options.adresse || (typeof location !== 'undefined' ? location.origin : '')).replace(/\/+$/, '');
    const url = chemin => !chemin ? '' : /^(https?:|data:)/.test(chemin) ? chemin : adresse + '/' + String(chemin).replace(/^\/+/, '');
    const voulu = String(options.monPerso ?? '').trim();
    const estMoi = c => !!voulu && (/^\d+$/.test(voulu) ? String(c.id) === voulu : memeNom(c.name, voulu));
    const persoDe = c => ({
      id: c.id, nom: c.name || 'Aventurier', pv: c.hp ?? null, pvMax: c.hpMax ?? null, stress: c.stress ?? null, stressMax: c.stressMax ?? null,
      aTerre: !!c.down || (c.hpMax > 0 && c.hp <= 0), forme: c.form || '', portrait: url(c.portrait),
      apparence: c.appearance && typeof c.appearance === 'object' ? c.appearance : null, joueur: c.player ? (c.player.name || '') : '', moi: estMoi(c),
    });
    const trouver = id => persos.find(p => String(p.id) === String(id));
    const trouverJet = j => (j.sheetId != null && trouver(j.sheetId)) || persos.find(p => memeNom(j.characterName, p.nom)) || null;
    const majPortraits = id => portraits.forEach(p => { if (id == null || String(p.id) === String(id)) p.maj(); });

    // ---------- Les événements de CodexVTT ----------
    const R = {
      state(e) {
        persos = (e.characters || []).map(persoDe).sort((a, b) => b.moi - a.moi);
        emettre('table', persos); majPortraits(); R.combat(e.combat);
      },
      character(c) {
        const i = persos.findIndex(p => String(p.id) === String(c.id)), p = persoDe(c);
        if (i < 0) { persos.push(p); persos.sort((a, b) => b.moi - a.moi); emettre('table', persos); }
        else { if (!p.apparence && persos[i].apparence && c.appearance === undefined) p.apparence = persos[i].apparence; persos[i] = p; emettre('perso', p); }
        majPortraits(p.id);
      },
      removed({ id }) { persos = persos.filter(p => String(p.id) !== String(id)); emettre('table', persos); },
      hp(h) {
        const p = trouver(h.sheetId); if (!p) return;
        Object.assign(p, { pv: h.hp, pvMax: h.hpMax, aTerre: h.hpMax > 0 && h.hp <= 0 });
        emettre('perso', p); if (h.delta) emettre('coup', p, h.delta); majPortraits(p.id);
      },
      combat(cb) {
        combat = cb && cb.isActive ? {
          tour: cb.round, actif: cb.currentId,
          ordre: (cb.order || []).map(x => ({ id: x.id, nom: x.name, init: x.initiative, pnj: !!x.isNpc, persoId: x.sheetId ?? null })),
        } : null;
        emettre('combat', combat);
      },
      roll(j) {
        const p = trouverJet(j), v = verdict(j), attaque = j.kind === 'attack' || j.kind === 'damage';
        emettre('jet', {
          persoId: p ? p.id : null, nom: p ? p.nom : j.characterName, libelle: j.label || 'Jet', formule: j.formula || '', resultat: j.result,
          dd: j.nd ?? null, des: j.rolls || [], faces: j.sides || 20, verdict: v, geste: geste(j),
          mot: (attaque && MOTS_ATTAQUE[v]) || MOTS[v] || { hope: 'Espoir', fear: 'Peur' }[j.dhOutcome] || '',
          pnj: j.isNpc === true || (!p && j.isNpc !== false && j.sheetId != null), moi: !!(p && p.moi),
        });
      },
    };

    // ---------- La connexion (ou la démo) ----------
    if (options.demo) { emettre('etat', 'demo'); setTimeout(() => demo(R), 0); }
    else if (!adresse || !options.cle) setTimeout(() => emettre('etat', 'refusee'), 0);
    else {
      emettre('etat', 'connexion');
      chargerIo(BASE_SCRIPT).then(io => {
        socket = io(adresse + '/spectator', { path: '/socket.io', transports: ['websocket'], auth: { spectatorKey: options.cle }, reconnectionDelay: 5000, reconnectionDelayMax: 60000 });
        socket.on('connect', () => emettre('etat', 'en-ligne'));
        socket.on('disconnect', raison => { emettre('etat', raison === 'io server disconnect' ? 'refusee' : 'hors-ligne'); if (raison === 'io server disconnect') setTimeout(() => socket.connect(), 60000); });
        socket.on('connect_error', () => emettre('etat', 'hors-ligne'));
        socket.on('revoked', () => { emettre('etat', 'revoquee'); socket.io.opts.reconnection = false; });
        socket.on('state', R.state); socket.on('character', R.character); socket.on('character:removed', R.removed);
        socket.on('hp', R.hp); socket.on('combat', R.combat); socket.on('roll', R.roll);
      }).catch(e => { console.error('[CodexStream]', e); emettre('etat', 'hors-ligne'); });
    }

    // Une partie inventée : une table, des jets, des coups, des voix au hasard
    function demo(R) {
      const ex = typeof PERSOS !== 'undefined' ? PERSOS : [];
      const noms = ['Kenai', 'Namerya', 'Zokhran', 'Trayss'];
      const fiches = noms.map((nom, i) => ({ id: 100 + i, name: nom, hp: 20 + i * 4, hpMax: 20 + i * 4, form: null, down: false, appearance: ex.find(p => memeNom(p.nom, nom)) || undefined }));
      R.state({ characters: fiches, combat: { isActive: true, round: 1, currentId: 'c0', order: fiches.map((f, i) => ({ id: 'c' + i, name: f.name, initiative: 20 - i, isNpc: false, sheetId: f.id })) } });
      const tirages = [['skill', 'Athlétisme', '1d20+5', 15], ['skill', 'Discrétion', '1d20+3'], ['attack', 'Épée longue', '1d20+6', 13], ['skill', 'Persuasion', '1d20+2', 12], ['heal', 'Soins', '2d8+3'], ['skill', 'Arcanes', '1d20+4', 14]];
      let n = 0;
      const lancer = () => {
        const f = fiches[n % fiches.length], [kind, label, formula, nd] = tirages[n % tirages.length], d = 1 + Math.floor(Math.random() * 20), bonus = Number((formula.match(/\+(\d+)/) || [])[1] || 0);
        R.roll({ sheetId: f.id, isNpc: false, characterName: f.name, kind, label, formula, result: d + bonus, rolls: [d], sides: 20, nd, isCritSuccess: d === 20, isCritFail: d === 1, ...(nd ? { isSuccess: d + bonus >= nd } : {}) });
        if (n % 3 === 2) { const c = fiches[(n + 1) % fiches.length], delta = -(1 + Math.floor(Math.random() * 6)); c.hp = Math.max(0, c.hp + delta); R.hp({ sheetId: c.id, delta, hp: c.hp, hpMax: c.hpMax }); }
        n++;
      };
      const voix = () => { persos.forEach(p => api.parle(p.id, false)); if (Math.random() > .2 && persos.length) api.parle(persos[Math.floor(Math.random() * persos.length)].id, true); };
      setTimeout(lancer, 1500);
      minuteurDemo = [setInterval(lancer, 6000), setInterval(voix, 1400)];
    }

    // ---------- Le dessin d'un perso, au filtre choisi ----------
    // l'apparence liée dans le labo de CodexVTT ; en démo seulement, les exemples ; sinon un aventurier encapuchonné
    const ficheDe = p => p.apparence || (options.demo && Apparence.trouver(p.nom)) || aventurier(p.nom);
    const dessin = (id, d = {}) => {
      const p = typeof id === 'object' ? id : trouver(id); if (!p) return '';
      const expression = d.expression ?? (p.aTerre ? 'ko' : '');
      return Filtres.rendu(d.filtre || options.filtre, ficheDe(p), { forme: p.forme, expression, cadrage: d.cadrage, accent: options.accent });
    };

    const api = {
      on(nom, f) { (ecouteurs[nom] = ecouteurs[nom] || []).push(f); if (nom === 'table' && persos.length) f(persos); return api; },
      persos: () => persos.slice(),
      combat: () => combat,
      dessin,
      // Le perso dessiné dans el, animé tout seul : la bouche quand il parle, K.O. à 0 PV, sa forme
      portrait(el, id, { cadrage = 'buste' } = {}) {
        let bouche = null, ouverte = false;
        const p = {
          id, maj() {
            const q = trouver(id);
            if (!q) { el.innerHTML = ''; return; }
            el.innerHTML = dessin(q, { cadrage, expression: q.aTerre ? 'ko' : ouverte ? 'parle' : '' });
            const svg = el.firstElementChild; if (svg) Object.assign(svg.style, { width: '100%', height: '100%', display: 'block' });
            el.classList.toggle('cs-parle', parlent.has(String(id)));
          },
          parler(oui) {
            if (oui && !bouche) bouche = setInterval(() => { ouverte = !ouverte; p.maj(); }, 170);
            if (!oui && bouche) { clearInterval(bouche); bouche = null; ouverte = false; }
            p.maj();
          },
          detruire() { clearInterval(bouche); portraits.delete(p); el.innerHTML = ''; },
        };
        portraits.add(p); p.maj();
        return p;
      },
      // Joue chaque jet dans el, un à la fois
      scenette(el, { duree = 4000, pnj = false, seulement = null, pied = false } = {}) {   // seulement : j => true pour garder ce jet (ex. un seul perso)
        const file = []; let occupe = false, vivant = true;
        const suivant = async () => {
          if (occupe || !file.length || !vivant) return;
          occupe = true;
          const j = file.shift(), p = trouver(j.persoId) || { nom: j.nom, forme: '' };
          try { await Scenette.jouer(el, j, { duree: file.length ? Math.min(duree, 2500) : duree, denouement: DENOUEMENT, pied, dessin: e => dessin(p, { expression: e, cadrage: pied ? 'pied' : undefined }) }); }
          catch (e) { console.error('[CodexStream] scénette', e); }
          finally { occupe = false; suivant(); }
        };
        const surJet = j => { if (j.pnj && !pnj) return; if (seulement && !seulement(j)) return; file.push(j); suivant(); };
        api.on('jet', surJet);
        return { detruire() { vivant = false; ecouteurs.jet = (ecouteurs.jet || []).filter(f => f !== surJet); } };
      },
      parle(id, oui) {
        const k = String(id), avant = parlent.has(k);
        if (oui) parlent.add(k); else parlent.delete(k);
        if (avant === !!oui) return;
        portraits.forEach(p => { if (String(p.id) === k) p.parler(!!oui); });
        const q = trouver(id); if (q) emettre('parle', q, !!oui);
      },
      fermer() { if (socket) socket.close(); (minuteurDemo || []).forEach(clearInterval); portraits.forEach(p => p.detruire()); },
    };
    return api;
  }

  // ---------- Dessiner SANS se brancher (les overlays de la famille ont leur propre moteur, js/partie.js) ----------
  // fiche(perso, { catalogue, nom }) → l'apparence à dessiner : celle de CodexVTT (perso.apparence), sinon le catalogue
  //   (par le nom : Apparence.trouver, catalogue PROVISOIRE en attendant le créateur de CodexVTT), sinon un aventurier encapuchonné
  //   (à la couleur perso.couleur, ou tirée de son nom)
  // dessiner(fiche, { filtre, expression, forme, cadrage, accent }) → <svg>
  //   (aventurier: false → null à la place : l'appelant garde alors le portrait de la fiche CodexVTT)
  function fiche(p = {}, { catalogue = true, nom = '', aventurier: secours = true } = {}) {
    return p.apparence || (catalogue && Apparence.trouver(p.nom, p.nomCodex, nom)) || (secours ? aventurier(p.nom || nom || '?', p.couleur) : null);
  }
  const dessiner = (f, { filtre = 'aplat', ...o } = {}) => Filtres.rendu(filtre, f, o);

  // ---------- Thèmes : couleurs, police et filtre d'un coup (widgets : ?theme=…) ; noms génériques ----------
  const THEMES = {
    neon: { nom: 'Néon', filtre: 'neon', accent: '#1EE88A', fond: '#050607', texte: '#F2F5F3', police: 'Righteous' },
    conte: { nom: 'Conte', filtre: 'conte', accent: '#F5B82E', fond: '#152238', texte: '#FFF3DC', police: 'Grenze Gotisch' },
    mission: { nom: 'Mission', filtre: 'ecusson', accent: '#FF9F1C', fond: '#0B0E13', texte: '#E6EAEE', police: 'Barlow Condensed' },
    comics: { nom: 'Comics', filtre: 'sticker', accent: '#FF4FD8', fond: '#12081F', texte: '#F6EEFF', police: 'Bungee' },
  };

  return { brancher, filtres: () => Filtres.liste, themes: () => Object.entries(THEMES).map(([id, t]) => ({ id, ...t })), theme: id => THEMES[id] || null,
    fiche, dessiner, code: f => Apparence.code(f), depuisCode: t => Apparence.depuisCode(t), Scenette, Filtres, Apparence, Squelette, Arene,
    version: typeof VERSION !== 'undefined' ? VERSION : 'dev', DENOUEMENT };
})();

