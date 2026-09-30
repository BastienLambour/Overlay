/* =====================================================================
   LE BOUFFON — mascotte de Patagrain, dessinée d'après ses photos :
   cheveux longs raides (juste sous les épaules), raie au milieu, lunettes
   noires, yeux vert-gris, collier de barbe, anneau à l'oreille, grain de
   beauté ; chapeau de bouffon du logo.
     Bouffon.svg('buste')          portrait (défaut)
     Bouffon.svg('tete')           portrait recadré sur la tête (emotes)
     Bouffon.svg('pied')           personnage entier articulé
     Bouffon.svg('pied', { epee: true })  … avec l'épée à la main
     Bouffon.svg('tete', { expression: 'clin' | 'rire' | 'choc' | 'dort' })  expressions (emotes)
     classe « sans-chapeau » sur un parent : cache son chapeau (scène Jeu : le chapeau de la cam se soulève)
   Bouffon noir et bleu : bleu du thème, noirs --bouffon-habit / --bouffon-noir, or du thème.
   Articulations animables : .bf-epaule-g/d, .bf-coude-g/d, .bf-hanche-g/d,
   .bf-genou-g/d, .bf-haut (tête), .bf-chapeau, .bf-oeil-d (clin d'œil).
   Fichier généré — ne pas modifier à la main.
   ===================================================================== */
const Bouffon = (() => {
  const BUSTE = `<svg class="bouffon-svg" style="overflow:visible" viewBox="0 -100 400 620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le bouffon Patagrain">
  <style>.bf-bleu { fill: var(--primaire, #3A9AD9); }
.bf-bleu-fonce { fill: var(--primaire-fonce, #1F6FA8); }
.bf-rouge { fill: var(--bouffon-noir, #232834); }
.bf-or { fill: var(--accent, #F5B82E); }
.bf-d20-clair { fill: color-mix(in srgb, var(--primaire, #3A9AD9) 60%, #fff); }
.bf-or-fonce { fill: color-mix(in srgb, var(--accent, #F5B82E) 70%, #000); }
.bf-habit { fill: var(--bouffon-habit, #16181E); }
.bf-soulier { fill: var(--bouffon-soulier, #2A303C); }
.bf-expr { display: none; }
.expr-rire .bf-oeil-g, .expr-rire .bf-oeil-d, .expr-rire .bf-bouche, .expr-choc .bf-bouche, .expr-clin .bf-oeil-d, .expr-dort .bf-oeil-g, .expr-dort .bf-oeil-d { display: none; }
.expr-dort .bf-yeux-dort { display: inline; }
.sans-chapeau .bf-chapeau { display: none; }
.expr-rire .bf-yeux-rire, .expr-rire .bf-bouche-rire, .expr-choc .bf-bouche-o { display: inline; }
.expr-clin .bf-clin { opacity: 1; }
.expr-clin .bf-bouche { transform: scale(1.25, 1.4); transform-box: fill-box; transform-origin: 50% 0; }
.expr-choc .bf-oeil-g, .expr-choc .bf-oeil-d { transform: scale(1.45); transform-box: fill-box; transform-origin: 50% 50%; }
.expr-choc .bf-sourcils { transform: translateY(-8px); }</style><defs><clipPath id="__P__-centre" clipPathUnits="userSpaceOnUse"><polygon points="1090,90 1245,90 1218,173 1190,232 1165,180 1095,150"/></clipPath>
    <clipPath id="__P__-gauche"><rect x="0" y="300" width="200" height="300"/></clipPath>
    <clipPath id="__P__-droite"><rect x="200" y="300" width="200" height="300"/></clipPath></defs>
  <g class="bf-tout">
    <path fill="#9C7043" d="M200 118 C128 118 104 176 106 250 C108 320 106 380 102 432 L298 432 C294 380 292 320 294 250 C296 176 272 118 200 118 Z"/>
    <path class="bf-bleu" clip-path="url(#__P__-gauche)" d="M58 520 C60 440 100 392 150 378 L200 373 L250 378 C300 392 340 440 342 520 Z"/>
    <path class="bf-habit" clip-path="url(#__P__-droite)" d="M58 520 C60 440 100 392 150 378 L200 373 L250 378 C300 392 340 440 342 520 Z"/>
    <path fill="#DDA982" d="M178 300 L222 300 L226 386 L174 386 Z"/>
    <g class="bf-collerette"><polygon class="bf-bleu" points="104.0,398.0 128.0,387.5 116.0,444.4"/><circle class="bf-or" cx="116.0" cy="447.4" r="6.5"/><polygon class="bf-rouge" points="128.0,387.5 152.0,380.0 140.0,435.4"/><circle class="bf-or" cx="140.0" cy="438.4" r="6.5"/><polygon class="bf-bleu" points="152.0,380.0 176.0,375.5 164.0,429.4"/><circle class="bf-or" cx="164.0" cy="432.4" r="6.5"/><polygon class="bf-rouge" points="176.0,375.5 200.0,374.0 188.0,426.4"/><circle class="bf-or" cx="188.0" cy="429.4" r="6.5"/><polygon class="bf-bleu" points="200.0,374.0 224.0,375.5 212.0,426.4"/><circle class="bf-or" cx="212.0" cy="429.4" r="6.5"/><polygon class="bf-rouge" points="224.0,375.5 248.0,380.0 236.0,429.4"/><circle class="bf-or" cx="236.0" cy="432.4" r="6.5"/><polygon class="bf-bleu" points="248.0,380.0 272.0,387.5 260.0,435.4"/><circle class="bf-or" cx="260.0" cy="438.4" r="6.5"/><polygon class="bf-rouge" points="272.0,387.5 296.0,398.0 284.0,444.4"/><circle class="bf-or" cx="284.0" cy="447.4" r="6.5"/></g>
    <g class="bf-tete">
      <path fill="#F0C8A4" d="M200 150 C244 150 262 182 262 228 C262 282 236 322 200 326 C164 322 138 282 138 228 C138 182 156 150 200 150 Z"/>
      <path fill="#DDA982" opacity=".75" d="M132 190 C166 202 234 202 268 190 L268 198 C234 210 166 210 132 198 Z"/>
      <g class="bf-sourcils"><path d="M160 205 Q176 198 192 204" stroke="#8F6540" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M208 204 Q224 198 240 205" stroke="#8F6540" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g class="bf-oeil-g"><ellipse cx="173" cy="227" rx="9" ry="6.2" fill="#fff"/><circle cx="174" cy="227" r="4.8" fill="#86A08F"/><circle cx="174" cy="227" r="2" fill="#1b1b1b"/></g>
      <g class="bf-oeil-d"><ellipse cx="227" cy="227" rx="9" ry="6.2" fill="#fff"/><circle cx="226" cy="227" r="4.8" fill="#86A08F"/><circle cx="226" cy="227" r="2" fill="#1b1b1b"/></g>
      <path class="bf-clin" d="M218 229 Q227 222 236 229" stroke="#8F6540" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0"/>
      <path class="bf-expr bf-yeux-dort" d="M164 228 Q173 234 182 228 M218 228 Q227 234 236 228" stroke="#1b1b1b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path class="bf-expr bf-yeux-rire" d="M164 231 Q173 219 182 231 M218 231 Q227 219 236 231" stroke="#1b1b1b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g fill="rgba(255,255,255,.1)" stroke="#121418" stroke-width="6" stroke-linejoin="round">
        <rect x="151" y="212" width="44" height="29" rx="5"/><rect x="205" y="212" width="44" height="29" rx="5"/>
      </g>
      <path d="M195 222 L205 222 M151 220 L139 216 M249 220 L261 216" stroke="#121418" stroke-width="5" stroke-linecap="round"/>
      <path d="M199 234 C197 252 193 261 190 267 C196 271 205 271 210 267" stroke="#DDA982" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path fill="#8F6540" fill-rule="evenodd" d="M181 287 C188 282 195 283 200 285 C205 283 212 282 219 287 C223 297 223 312 216 322 C211 329 206 332 200 332 C194 332 189 329 184 322 C177 312 177 297 181 287 Z
        M185 294 C193 297 207 297 215 294 C217 305 213 318 200 323 C187 318 183 305 185 294 Z"/>
      <path class="bf-bouche" d="M189 302 Q200 310 211 302" stroke="#B4655C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g class="bf-expr bf-bouche-rire"><path d="M186 298 Q200 326 214 298 Z" fill="#7A2E2E" stroke="#7A2E2E" stroke-width="2" stroke-linejoin="round"/>
        <path d="M189 299 H211 L209 304 H191 Z" fill="#fff"/></g>
      <ellipse class="bf-expr bf-bouche-o" cx="200" cy="308" rx="7" ry="9" fill="#7A2E2E"/>
      <circle cx="237" cy="268" r="2.6" fill="#7A4E36"/>
    </g>
    <path fill="#B98B58" d="M200 132 C160 134 132 160 128 210 C124 260 126 320 121 372 C118 398 119 416 123 432 L160 432 C156 404 152 370 150 330 C148 280 146 230 152 200 C160 172 178 152 200 148 Z"/>
    <path fill="#B98B58" d="M200 132 C240 134 268 160 272 210 C276 260 274 320 279 372 C282 398 281 416 277 432 L240 432 C244 404 248 370 250 330 C252 280 254 230 248 200 C240 172 222 152 200 148 Z"/>
    <ellipse cx="143" cy="246" rx="7" ry="14" fill="#F0C8A4"/>
    <ellipse cx="257" cy="246" rx="7" ry="14" fill="#F0C8A4"/>
    <circle cx="259" cy="263" r="5.5" fill="none" stroke="#1b1b1b" stroke-width="3"/>
    <g class="bf-chapeau">
      <!-- Chapeau PORTÉ : pointes larges et anguleuses attachées à la calotte, couronne courbe sur le front -->
      <g transform="translate(-4 0)"><path class="bf-bleu-fonce" d="M160 124 L118 104 C84 92 46 104 26 138 C18 152 16 170 22 186 C34 168 52 158 74 156 C98 154 116 162 126 178 Z"/>
      <path class="bf-bleu" d="M162 122 L120 106 C88 96 54 108 36 138 C29 150 27 164 30 176 C42 160 60 150 80 149 C102 148 118 156 128 170 Z"/></g>
      <g transform="translate(4 0)"><path class="bf-bleu-fonce" d="M240 124 L282 104 C316 92 354 104 374 138 C382 152 384 170 378 186 C366 168 348 158 326 156 C302 154 284 162 274 178 Z"/>
      <path class="bf-bleu" d="M238 122 L280 106 C312 96 346 108 364 138 C371 150 373 164 370 176 C358 160 340 150 320 149 C298 148 282 156 272 170 Z"/></g>
      <path class="bf-rouge" stroke="#C5CCD6" stroke-opacity=".7" stroke-width="2.5" stroke-linejoin="round" d="M236 118 C244 86 240 52 222 28 C208 10 186 2 164 6 C176 14 184 26 186 40 C190 66 182 94 170 118 Z"/>
      <path class="bf-bleu" d="M112 178 C114 138 150 112 200 108 C250 112 286 138 288 178 C258 190 230 194 200 194 C170 194 142 190 112 178 Z"/>
      <path class="bf-or" d="M110.0 158.0 L120.0 144.7 L130.0 163.1 L140.0 149.2 L150.0 167.0 L160.0 152.4 L170.0 169.6 L180.0 154.4 L190.0 170.8 L200.0 155.0 L210.0 170.8 L220.0 154.4 L230.0 169.6 L240.0 152.4 L250.0 167.0 L260.0 149.2 L270.0 163.1 L280.0 144.7 L290.0 158.0 L290.0 182.0 281.0 184.5 272.0 186.7 263.0 188.6 254.0 190.3 245.0 191.8 236.0 192.9 227.0 193.8 218.0 194.5 209.0 194.9 200.0 195.0 191.0 194.9 182.0 194.5 173.0 193.8 164.0 192.9 155.0 191.8 146.0 190.3 137.0 188.6 128.0 186.7 119.0 184.5 110.0 182.0 Z"/>
      <path class="bf-or-fonce" d="M110 176 C142 190 170 194 200 194 C230 194 258 190 290 176 L290 186 C258 200 230 204 200 204 C170 204 142 200 110 186 Z"/>
      <g class="bf-grelots">
        <circle class="bf-or" cx="20" cy="194" r="13"/><circle class="bf-or" cx="380" cy="194" r="13"/>
        <path d="M14 196 H26 M374 196 H386" stroke="rgba(0,0,0,.28)" stroke-width="3" stroke-linecap="round"/>
        <line x1="166" y1="8" x2="160" y2="20" stroke="#1b1b1b" stroke-width="2.5"/><polygon class="bf-d20-clair" points="158.0,15.1 139.3,25.5 158.0,22.5"/><polygon class="bf-d20-clair" points="158.0,15.1 158.0,22.5 176.7,25.5"/><polygon class="bf-bleu" points="139.3,25.5 143.4,47.7 158.0,22.5"/><polygon class="bf-bleu" points="176.7,25.5 158.0,22.5 172.6,47.7"/><polygon class="bf-bleu-fonce" points="139.3,25.5 139.3,46.5 143.4,47.7"/><polygon class="bf-bleu-fonce" points="176.7,25.5 172.6,47.7 176.7,46.5"/><polygon class="bf-bleu-fonce" points="139.3,46.5 158.0,56.9 143.4,47.7"/><polygon class="bf-bleu-fonce" points="176.7,46.5 172.6,47.7 158.0,56.9"/><polygon class="bf-bleu-fonce" points="143.4,47.7 158.0,56.9 172.6,47.7"/><polygon class="bf-or" points="158.0,22.5 143.4,47.7 172.6,47.7"/>
      </g>
    </g>
  </g>
</svg>`;
  const PIED = `<svg class="bouffon-svg bouffon-pied" style="overflow:visible" viewBox="0 -110 400 920" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le bouffon Patagrain">
  <style>.bf-bleu { fill: var(--primaire, #3A9AD9); }
.bf-bleu-fonce { fill: var(--primaire-fonce, #1F6FA8); }
.bf-rouge { fill: var(--bouffon-noir, #232834); }
.bf-or { fill: var(--accent, #F5B82E); }
.bf-d20-clair { fill: color-mix(in srgb, var(--primaire, #3A9AD9) 60%, #fff); }
.bf-or-fonce { fill: color-mix(in srgb, var(--accent, #F5B82E) 70%, #000); }
.bf-habit { fill: var(--bouffon-habit, #16181E); }
.bf-soulier { fill: var(--bouffon-soulier, #2A303C); }
.bf-expr { display: none; }
.expr-rire .bf-oeil-g, .expr-rire .bf-oeil-d, .expr-rire .bf-bouche, .expr-choc .bf-bouche, .expr-clin .bf-oeil-d, .expr-dort .bf-oeil-g, .expr-dort .bf-oeil-d { display: none; }
.expr-dort .bf-yeux-dort { display: inline; }
.sans-chapeau .bf-chapeau { display: none; }
.expr-rire .bf-yeux-rire, .expr-rire .bf-bouche-rire, .expr-choc .bf-bouche-o { display: inline; }
.expr-clin .bf-clin { opacity: 1; }
.expr-clin .bf-bouche { transform: scale(1.25, 1.4); transform-box: fill-box; transform-origin: 50% 0; }
.expr-choc .bf-oeil-g, .expr-choc .bf-oeil-d { transform: scale(1.45); transform-box: fill-box; transform-origin: 50% 50%; }
.expr-choc .bf-sourcils { transform: translateY(-8px); }</style><defs><clipPath id="__P__-centre" clipPathUnits="userSpaceOnUse"><polygon points="1090,90 1245,90 1218,173 1190,232 1165,180 1095,150"/></clipPath>
    <clipPath id="__P__-gauche"><rect x="0" y="300" width="200" height="400"/></clipPath>
    <clipPath id="__P__-droite"><rect x="200" y="300" width="200" height="400"/></clipPath></defs>
  <g class="bf-tout" style="transform-origin:200px 790px">
    <g class="bf-hanche-g" style="transform-origin:176px 594px">
      <rect class="bf-habit" x="159" y="586" width="34" height="100" rx="15"/>
      <g class="bf-genou-g" style="transform-origin:176px 682px">
        <rect class="bf-habit" x="161" y="676" width="30" height="90" rx="13"/>
        <path class="bf-soulier" d="M191 760 L191 782 C176 790 146 790 132 776 C126 770 124 760 130 756 C136 765 150 768 161 760 Z"/>
        <circle class="bf-or" cx="129" cy="752" r="7"/>
      </g>
    </g>
    <g class="bf-hanche-d" style="transform-origin:224px 594px">
      <rect class="bf-bleu" x="207" y="586" width="34" height="100" rx="15"/>
      <g class="bf-genou-d" style="transform-origin:224px 682px">
        <rect class="bf-bleu" x="209" y="676" width="30" height="90" rx="13"/>
        <path class="bf-soulier" d="M209 760 L209 782 C224 790 254 790 268 776 C274 770 276 760 270 756 C264 765 250 768 239 760 Z"/>
        <circle class="bf-or" cx="271" cy="752" r="7"/>
      </g>
    </g>
    <g class="bf-haut" style="transform-origin:200px 380px"><path fill="#9C7043" d="M200 118 C128 118 104 176 106 250 C108 320 106 380 102 432 L298 432 C294 380 292 320 294 250 C296 176 272 118 200 118 Z"/></g>   <!-- cheveux de dos : bougent avec la tête (même classe bf-haut) -->
    <path fill="#DDA982" d="M178 300 L222 300 L226 386 L174 386 Z"/>
    <path class="bf-bleu" clip-path="url(#__P__-gauche)" d="M112 384 C150 368 250 368 288 384 L268 532 L292 590 L108 590 L132 532 Z"/>
    <path class="bf-habit" clip-path="url(#__P__-droite)" d="M112 384 C150 368 250 368 288 384 L268 532 L292 590 L108 590 L132 532 Z"/>
    <polygon class="bf-bleu" points="108.0,588 134.3,588 121.1,618"/><circle class="bf-or" cx="121.1" cy="621" r="5.5"/><polygon class="bf-habit" points="134.3,588 160.6,588 147.4,618"/><circle class="bf-or" cx="147.4" cy="621" r="5.5"/><polygon class="bf-bleu" points="160.6,588 186.9,588 173.7,618"/><circle class="bf-or" cx="173.7" cy="621" r="5.5"/><polygon class="bf-habit" points="186.9,588 213.1,588 200.0,618"/><circle class="bf-or" cx="200.0" cy="621" r="5.5"/><polygon class="bf-bleu" points="213.1,588 239.4,588 226.3,618"/><circle class="bf-or" cx="226.3" cy="621" r="5.5"/><polygon class="bf-habit" points="239.4,588 265.7,588 252.6,618"/><circle class="bf-or" cx="252.6" cy="621" r="5.5"/><polygon class="bf-bleu" points="265.7,588 292.0,588 278.9,618"/><circle class="bf-or" cx="278.9" cy="621" r="5.5"/>
    <rect class="bf-or" x="130" y="520" width="140" height="16" rx="7"/>
    <rect class="bf-bleu-fonce" x="190" y="517" width="20" height="22" rx="4"/>
    <g class="bf-collerette"><polygon class="bf-bleu" points="104.0,396.0 128.0,385.5 116.0,442.4"/><circle class="bf-or" cx="116.0" cy="445.4" r="6.5"/><polygon class="bf-rouge" points="128.0,385.5 152.0,378.0 140.0,433.4"/><circle class="bf-or" cx="140.0" cy="436.4" r="6.5"/><polygon class="bf-bleu" points="152.0,378.0 176.0,373.5 164.0,427.4"/><circle class="bf-or" cx="164.0" cy="430.4" r="6.5"/><polygon class="bf-rouge" points="176.0,373.5 200.0,372.0 188.0,424.4"/><circle class="bf-or" cx="188.0" cy="427.4" r="6.5"/><polygon class="bf-bleu" points="200.0,372.0 224.0,373.5 212.0,424.4"/><circle class="bf-or" cx="212.0" cy="427.4" r="6.5"/><polygon class="bf-rouge" points="224.0,373.5 248.0,378.0 236.0,427.4"/><circle class="bf-or" cx="236.0" cy="430.4" r="6.5"/><polygon class="bf-bleu" points="248.0,378.0 272.0,385.5 260.0,433.4"/><circle class="bf-or" cx="260.0" cy="436.4" r="6.5"/><polygon class="bf-rouge" points="272.0,385.5 296.0,396.0 284.0,442.4"/><circle class="bf-or" cx="284.0" cy="445.4" r="6.5"/></g>
    <g class="bf-epaule-g" style="transform-origin:116px 392px">
      <rect class="bf-habit" x="101" y="380" width="30" height="96" rx="15"/>
      <g class="bf-coude-g" style="transform-origin:116px 470px">
        <rect class="bf-habit" x="103" y="462" width="26" height="86" rx="13"/>
        <rect class="bf-or" x="102" y="530" width="28" height="9" rx="4"/>
        
        <circle cx="116" cy="552" r="15" fill="#F0C8A4"/>
      </g>
    </g>
    <g class="bf-epaule-d" style="transform-origin:284px 392px">
      <rect class="bf-bleu" x="269" y="380" width="30" height="96" rx="15"/>
      <g class="bf-coude-d" style="transform-origin:284px 470px">
        <rect class="bf-bleu" x="271" y="462" width="26" height="86" rx="13"/>
        <rect class="bf-or" x="270" y="530" width="28" height="9" rx="4"/>
        
        <circle cx="284" cy="552" r="15" fill="#F0C8A4"/>
      </g>
    </g>
    <g class="bf-haut" style="transform-origin:200px 380px"><g class="bf-tete">
      <path fill="#F0C8A4" d="M200 150 C244 150 262 182 262 228 C262 282 236 322 200 326 C164 322 138 282 138 228 C138 182 156 150 200 150 Z"/>
      <path fill="#DDA982" opacity=".75" d="M132 190 C166 202 234 202 268 190 L268 198 C234 210 166 210 132 198 Z"/>
      <g class="bf-sourcils"><path d="M160 205 Q176 198 192 204" stroke="#8F6540" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M208 204 Q224 198 240 205" stroke="#8F6540" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g class="bf-oeil-g"><ellipse cx="173" cy="227" rx="9" ry="6.2" fill="#fff"/><circle cx="174" cy="227" r="4.8" fill="#86A08F"/><circle cx="174" cy="227" r="2" fill="#1b1b1b"/></g>
      <g class="bf-oeil-d"><ellipse cx="227" cy="227" rx="9" ry="6.2" fill="#fff"/><circle cx="226" cy="227" r="4.8" fill="#86A08F"/><circle cx="226" cy="227" r="2" fill="#1b1b1b"/></g>
      <path class="bf-clin" d="M218 229 Q227 222 236 229" stroke="#8F6540" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0"/>
      <path class="bf-expr bf-yeux-dort" d="M164 228 Q173 234 182 228 M218 228 Q227 234 236 228" stroke="#1b1b1b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path class="bf-expr bf-yeux-rire" d="M164 231 Q173 219 182 231 M218 231 Q227 219 236 231" stroke="#1b1b1b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g fill="rgba(255,255,255,.1)" stroke="#121418" stroke-width="6" stroke-linejoin="round">
        <rect x="151" y="212" width="44" height="29" rx="5"/><rect x="205" y="212" width="44" height="29" rx="5"/>
      </g>
      <path d="M195 222 L205 222 M151 220 L139 216 M249 220 L261 216" stroke="#121418" stroke-width="5" stroke-linecap="round"/>
      <path d="M199 234 C197 252 193 261 190 267 C196 271 205 271 210 267" stroke="#DDA982" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path fill="#8F6540" fill-rule="evenodd" d="M181 287 C188 282 195 283 200 285 C205 283 212 282 219 287 C223 297 223 312 216 322 C211 329 206 332 200 332 C194 332 189 329 184 322 C177 312 177 297 181 287 Z
        M185 294 C193 297 207 297 215 294 C217 305 213 318 200 323 C187 318 183 305 185 294 Z"/>
      <path class="bf-bouche" d="M189 302 Q200 310 211 302" stroke="#B4655C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g class="bf-expr bf-bouche-rire"><path d="M186 298 Q200 326 214 298 Z" fill="#7A2E2E" stroke="#7A2E2E" stroke-width="2" stroke-linejoin="round"/>
        <path d="M189 299 H211 L209 304 H191 Z" fill="#fff"/></g>
      <ellipse class="bf-expr bf-bouche-o" cx="200" cy="308" rx="7" ry="9" fill="#7A2E2E"/>
      <circle cx="237" cy="268" r="2.6" fill="#7A4E36"/>
    </g>
    <path fill="#B98B58" d="M200 132 C160 134 132 160 128 210 C124 260 126 320 121 372 C118 398 119 416 123 432 L160 432 C156 404 152 370 150 330 C148 280 146 230 152 200 C160 172 178 152 200 148 Z"/>
    <path fill="#B98B58" d="M200 132 C240 134 268 160 272 210 C276 260 274 320 279 372 C282 398 281 416 277 432 L240 432 C244 404 248 370 250 330 C252 280 254 230 248 200 C240 172 222 152 200 148 Z"/>
    <ellipse cx="143" cy="246" rx="7" ry="14" fill="#F0C8A4"/>
    <ellipse cx="257" cy="246" rx="7" ry="14" fill="#F0C8A4"/>
    <circle cx="259" cy="263" r="5.5" fill="none" stroke="#1b1b1b" stroke-width="3"/>
    <g class="bf-chapeau">
      <!-- Chapeau PORTÉ : pointes larges et anguleuses attachées à la calotte, couronne courbe sur le front -->
      <g transform="translate(-4 0)"><path class="bf-bleu-fonce" d="M160 124 L118 104 C84 92 46 104 26 138 C18 152 16 170 22 186 C34 168 52 158 74 156 C98 154 116 162 126 178 Z"/>
      <path class="bf-bleu" d="M162 122 L120 106 C88 96 54 108 36 138 C29 150 27 164 30 176 C42 160 60 150 80 149 C102 148 118 156 128 170 Z"/></g>
      <g transform="translate(4 0)"><path class="bf-bleu-fonce" d="M240 124 L282 104 C316 92 354 104 374 138 C382 152 384 170 378 186 C366 168 348 158 326 156 C302 154 284 162 274 178 Z"/>
      <path class="bf-bleu" d="M238 122 L280 106 C312 96 346 108 364 138 C371 150 373 164 370 176 C358 160 340 150 320 149 C298 148 282 156 272 170 Z"/></g>
      <path class="bf-rouge" stroke="#C5CCD6" stroke-opacity=".7" stroke-width="2.5" stroke-linejoin="round" d="M236 118 C244 86 240 52 222 28 C208 10 186 2 164 6 C176 14 184 26 186 40 C190 66 182 94 170 118 Z"/>
      <path class="bf-bleu" d="M112 178 C114 138 150 112 200 108 C250 112 286 138 288 178 C258 190 230 194 200 194 C170 194 142 190 112 178 Z"/>
      <path class="bf-or" d="M110.0 158.0 L120.0 144.7 L130.0 163.1 L140.0 149.2 L150.0 167.0 L160.0 152.4 L170.0 169.6 L180.0 154.4 L190.0 170.8 L200.0 155.0 L210.0 170.8 L220.0 154.4 L230.0 169.6 L240.0 152.4 L250.0 167.0 L260.0 149.2 L270.0 163.1 L280.0 144.7 L290.0 158.0 L290.0 182.0 281.0 184.5 272.0 186.7 263.0 188.6 254.0 190.3 245.0 191.8 236.0 192.9 227.0 193.8 218.0 194.5 209.0 194.9 200.0 195.0 191.0 194.9 182.0 194.5 173.0 193.8 164.0 192.9 155.0 191.8 146.0 190.3 137.0 188.6 128.0 186.7 119.0 184.5 110.0 182.0 Z"/>
      <path class="bf-or-fonce" d="M110 176 C142 190 170 194 200 194 C230 194 258 190 290 176 L290 186 C258 200 230 204 200 204 C170 204 142 200 110 186 Z"/>
      <g class="bf-grelots">
        <circle class="bf-or" cx="20" cy="194" r="13"/><circle class="bf-or" cx="380" cy="194" r="13"/>
        <path d="M14 196 H26 M374 196 H386" stroke="rgba(0,0,0,.28)" stroke-width="3" stroke-linecap="round"/>
        <line x1="166" y1="8" x2="160" y2="20" stroke="#1b1b1b" stroke-width="2.5"/><polygon class="bf-d20-clair" points="158.0,15.1 139.3,25.5 158.0,22.5"/><polygon class="bf-d20-clair" points="158.0,15.1 158.0,22.5 176.7,25.5"/><polygon class="bf-bleu" points="139.3,25.5 143.4,47.7 158.0,22.5"/><polygon class="bf-bleu" points="176.7,25.5 158.0,22.5 172.6,47.7"/><polygon class="bf-bleu-fonce" points="139.3,25.5 139.3,46.5 143.4,47.7"/><polygon class="bf-bleu-fonce" points="176.7,25.5 172.6,47.7 176.7,46.5"/><polygon class="bf-bleu-fonce" points="139.3,46.5 158.0,56.9 143.4,47.7"/><polygon class="bf-bleu-fonce" points="176.7,46.5 172.6,47.7 158.0,56.9"/><polygon class="bf-bleu-fonce" points="143.4,47.7 158.0,56.9 172.6,47.7"/><polygon class="bf-or" points="158.0,22.5 143.4,47.7 172.6,47.7"/>
      </g>
    </g></g>
    
  </g>
</svg>`;
  const PIED_EPEE = `<svg class="bouffon-svg bouffon-pied" style="overflow:visible" viewBox="0 -110 400 920" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le bouffon Patagrain">
  <style>.bf-bleu { fill: var(--primaire, #3A9AD9); }
.bf-bleu-fonce { fill: var(--primaire-fonce, #1F6FA8); }
.bf-rouge { fill: var(--bouffon-noir, #232834); }
.bf-or { fill: var(--accent, #F5B82E); }
.bf-d20-clair { fill: color-mix(in srgb, var(--primaire, #3A9AD9) 60%, #fff); }
.bf-or-fonce { fill: color-mix(in srgb, var(--accent, #F5B82E) 70%, #000); }
.bf-habit { fill: var(--bouffon-habit, #16181E); }
.bf-soulier { fill: var(--bouffon-soulier, #2A303C); }
.bf-expr { display: none; }
.expr-rire .bf-oeil-g, .expr-rire .bf-oeil-d, .expr-rire .bf-bouche, .expr-choc .bf-bouche, .expr-clin .bf-oeil-d, .expr-dort .bf-oeil-g, .expr-dort .bf-oeil-d { display: none; }
.expr-dort .bf-yeux-dort { display: inline; }
.sans-chapeau .bf-chapeau { display: none; }
.expr-rire .bf-yeux-rire, .expr-rire .bf-bouche-rire, .expr-choc .bf-bouche-o { display: inline; }
.expr-clin .bf-clin { opacity: 1; }
.expr-clin .bf-bouche { transform: scale(1.25, 1.4); transform-box: fill-box; transform-origin: 50% 0; }
.expr-choc .bf-oeil-g, .expr-choc .bf-oeil-d { transform: scale(1.45); transform-box: fill-box; transform-origin: 50% 50%; }
.expr-choc .bf-sourcils { transform: translateY(-8px); }</style><defs><clipPath id="__P__-centre" clipPathUnits="userSpaceOnUse"><polygon points="1090,90 1245,90 1218,173 1190,232 1165,180 1095,150"/></clipPath>
    <clipPath id="__P__-gauche"><rect x="0" y="300" width="200" height="400"/></clipPath>
    <clipPath id="__P__-droite"><rect x="200" y="300" width="200" height="400"/></clipPath></defs>
  <g class="bf-tout" style="transform-origin:200px 790px">
    <g class="bf-hanche-g" style="transform-origin:176px 594px">
      <rect class="bf-habit" x="159" y="586" width="34" height="100" rx="15"/>
      <g class="bf-genou-g" style="transform-origin:176px 682px">
        <rect class="bf-habit" x="161" y="676" width="30" height="90" rx="13"/>
        <path class="bf-soulier" d="M191 760 L191 782 C176 790 146 790 132 776 C126 770 124 760 130 756 C136 765 150 768 161 760 Z"/>
        <circle class="bf-or" cx="129" cy="752" r="7"/>
      </g>
    </g>
    <g class="bf-hanche-d" style="transform-origin:224px 594px">
      <rect class="bf-bleu" x="207" y="586" width="34" height="100" rx="15"/>
      <g class="bf-genou-d" style="transform-origin:224px 682px">
        <rect class="bf-bleu" x="209" y="676" width="30" height="90" rx="13"/>
        <path class="bf-soulier" d="M209 760 L209 782 C224 790 254 790 268 776 C274 770 276 760 270 756 C264 765 250 768 239 760 Z"/>
        <circle class="bf-or" cx="271" cy="752" r="7"/>
      </g>
    </g>
    <g class="bf-haut" style="transform-origin:200px 380px"><path fill="#9C7043" d="M200 118 C128 118 104 176 106 250 C108 320 106 380 102 432 L298 432 C294 380 292 320 294 250 C296 176 272 118 200 118 Z"/></g>   <!-- cheveux de dos : bougent avec la tête (même classe bf-haut) -->
    <path fill="#DDA982" d="M178 300 L222 300 L226 386 L174 386 Z"/>
    <path class="bf-bleu" clip-path="url(#__P__-gauche)" d="M112 384 C150 368 250 368 288 384 L268 532 L292 590 L108 590 L132 532 Z"/>
    <path class="bf-habit" clip-path="url(#__P__-droite)" d="M112 384 C150 368 250 368 288 384 L268 532 L292 590 L108 590 L132 532 Z"/>
    <polygon class="bf-bleu" points="108.0,588 134.3,588 121.1,618"/><circle class="bf-or" cx="121.1" cy="621" r="5.5"/><polygon class="bf-habit" points="134.3,588 160.6,588 147.4,618"/><circle class="bf-or" cx="147.4" cy="621" r="5.5"/><polygon class="bf-bleu" points="160.6,588 186.9,588 173.7,618"/><circle class="bf-or" cx="173.7" cy="621" r="5.5"/><polygon class="bf-habit" points="186.9,588 213.1,588 200.0,618"/><circle class="bf-or" cx="200.0" cy="621" r="5.5"/><polygon class="bf-bleu" points="213.1,588 239.4,588 226.3,618"/><circle class="bf-or" cx="226.3" cy="621" r="5.5"/><polygon class="bf-habit" points="239.4,588 265.7,588 252.6,618"/><circle class="bf-or" cx="252.6" cy="621" r="5.5"/><polygon class="bf-bleu" points="265.7,588 292.0,588 278.9,618"/><circle class="bf-or" cx="278.9" cy="621" r="5.5"/>
    <rect class="bf-or" x="130" y="520" width="140" height="16" rx="7"/>
    <rect class="bf-bleu-fonce" x="190" y="517" width="20" height="22" rx="4"/>
    <g class="bf-collerette"><polygon class="bf-bleu" points="104.0,396.0 128.0,385.5 116.0,442.4"/><circle class="bf-or" cx="116.0" cy="445.4" r="6.5"/><polygon class="bf-rouge" points="128.0,385.5 152.0,378.0 140.0,433.4"/><circle class="bf-or" cx="140.0" cy="436.4" r="6.5"/><polygon class="bf-bleu" points="152.0,378.0 176.0,373.5 164.0,427.4"/><circle class="bf-or" cx="164.0" cy="430.4" r="6.5"/><polygon class="bf-rouge" points="176.0,373.5 200.0,372.0 188.0,424.4"/><circle class="bf-or" cx="188.0" cy="427.4" r="6.5"/><polygon class="bf-bleu" points="200.0,372.0 224.0,373.5 212.0,424.4"/><circle class="bf-or" cx="212.0" cy="427.4" r="6.5"/><polygon class="bf-rouge" points="224.0,373.5 248.0,378.0 236.0,427.4"/><circle class="bf-or" cx="236.0" cy="430.4" r="6.5"/><polygon class="bf-bleu" points="248.0,378.0 272.0,385.5 260.0,433.4"/><circle class="bf-or" cx="260.0" cy="436.4" r="6.5"/><polygon class="bf-rouge" points="272.0,385.5 296.0,396.0 284.0,442.4"/><circle class="bf-or" cx="284.0" cy="445.4" r="6.5"/></g>
    <g class="bf-epaule-g" style="transform-origin:116px 392px">
      <rect class="bf-habit" x="101" y="380" width="30" height="96" rx="15"/>
      <g class="bf-coude-g" style="transform-origin:116px 470px">
        <rect class="bf-habit" x="103" y="462" width="26" height="86" rx="13"/>
        <rect class="bf-or" x="102" y="530" width="28" height="9" rx="4"/>
        
        <circle cx="116" cy="552" r="15" fill="#F0C8A4"/>
      </g>
    </g>
    
    <g class="bf-haut" style="transform-origin:200px 380px"><g class="bf-tete">
      <path fill="#F0C8A4" d="M200 150 C244 150 262 182 262 228 C262 282 236 322 200 326 C164 322 138 282 138 228 C138 182 156 150 200 150 Z"/>
      <path fill="#DDA982" opacity=".75" d="M132 190 C166 202 234 202 268 190 L268 198 C234 210 166 210 132 198 Z"/>
      <g class="bf-sourcils"><path d="M160 205 Q176 198 192 204" stroke="#8F6540" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M208 204 Q224 198 240 205" stroke="#8F6540" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g class="bf-oeil-g"><ellipse cx="173" cy="227" rx="9" ry="6.2" fill="#fff"/><circle cx="174" cy="227" r="4.8" fill="#86A08F"/><circle cx="174" cy="227" r="2" fill="#1b1b1b"/></g>
      <g class="bf-oeil-d"><ellipse cx="227" cy="227" rx="9" ry="6.2" fill="#fff"/><circle cx="226" cy="227" r="4.8" fill="#86A08F"/><circle cx="226" cy="227" r="2" fill="#1b1b1b"/></g>
      <path class="bf-clin" d="M218 229 Q227 222 236 229" stroke="#8F6540" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0"/>
      <path class="bf-expr bf-yeux-dort" d="M164 228 Q173 234 182 228 M218 228 Q227 234 236 228" stroke="#1b1b1b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path class="bf-expr bf-yeux-rire" d="M164 231 Q173 219 182 231 M218 231 Q227 219 236 231" stroke="#1b1b1b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g fill="rgba(255,255,255,.1)" stroke="#121418" stroke-width="6" stroke-linejoin="round">
        <rect x="151" y="212" width="44" height="29" rx="5"/><rect x="205" y="212" width="44" height="29" rx="5"/>
      </g>
      <path d="M195 222 L205 222 M151 220 L139 216 M249 220 L261 216" stroke="#121418" stroke-width="5" stroke-linecap="round"/>
      <path d="M199 234 C197 252 193 261 190 267 C196 271 205 271 210 267" stroke="#DDA982" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path fill="#8F6540" fill-rule="evenodd" d="M181 287 C188 282 195 283 200 285 C205 283 212 282 219 287 C223 297 223 312 216 322 C211 329 206 332 200 332 C194 332 189 329 184 322 C177 312 177 297 181 287 Z
        M185 294 C193 297 207 297 215 294 C217 305 213 318 200 323 C187 318 183 305 185 294 Z"/>
      <path class="bf-bouche" d="M189 302 Q200 310 211 302" stroke="#B4655C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g class="bf-expr bf-bouche-rire"><path d="M186 298 Q200 326 214 298 Z" fill="#7A2E2E" stroke="#7A2E2E" stroke-width="2" stroke-linejoin="round"/>
        <path d="M189 299 H211 L209 304 H191 Z" fill="#fff"/></g>
      <ellipse class="bf-expr bf-bouche-o" cx="200" cy="308" rx="7" ry="9" fill="#7A2E2E"/>
      <circle cx="237" cy="268" r="2.6" fill="#7A4E36"/>
    </g>
    <path fill="#B98B58" d="M200 132 C160 134 132 160 128 210 C124 260 126 320 121 372 C118 398 119 416 123 432 L160 432 C156 404 152 370 150 330 C148 280 146 230 152 200 C160 172 178 152 200 148 Z"/>
    <path fill="#B98B58" d="M200 132 C240 134 268 160 272 210 C276 260 274 320 279 372 C282 398 281 416 277 432 L240 432 C244 404 248 370 250 330 C252 280 254 230 248 200 C240 172 222 152 200 148 Z"/>
    <ellipse cx="143" cy="246" rx="7" ry="14" fill="#F0C8A4"/>
    <ellipse cx="257" cy="246" rx="7" ry="14" fill="#F0C8A4"/>
    <circle cx="259" cy="263" r="5.5" fill="none" stroke="#1b1b1b" stroke-width="3"/>
    <g class="bf-chapeau">
      <!-- Chapeau PORTÉ : pointes larges et anguleuses attachées à la calotte, couronne courbe sur le front -->
      <g transform="translate(-4 0)"><path class="bf-bleu-fonce" d="M160 124 L118 104 C84 92 46 104 26 138 C18 152 16 170 22 186 C34 168 52 158 74 156 C98 154 116 162 126 178 Z"/>
      <path class="bf-bleu" d="M162 122 L120 106 C88 96 54 108 36 138 C29 150 27 164 30 176 C42 160 60 150 80 149 C102 148 118 156 128 170 Z"/></g>
      <g transform="translate(4 0)"><path class="bf-bleu-fonce" d="M240 124 L282 104 C316 92 354 104 374 138 C382 152 384 170 378 186 C366 168 348 158 326 156 C302 154 284 162 274 178 Z"/>
      <path class="bf-bleu" d="M238 122 L280 106 C312 96 346 108 364 138 C371 150 373 164 370 176 C358 160 340 150 320 149 C298 148 282 156 272 170 Z"/></g>
      <path class="bf-rouge" stroke="#C5CCD6" stroke-opacity=".7" stroke-width="2.5" stroke-linejoin="round" d="M236 118 C244 86 240 52 222 28 C208 10 186 2 164 6 C176 14 184 26 186 40 C190 66 182 94 170 118 Z"/>
      <path class="bf-bleu" d="M112 178 C114 138 150 112 200 108 C250 112 286 138 288 178 C258 190 230 194 200 194 C170 194 142 190 112 178 Z"/>
      <path class="bf-or" d="M110.0 158.0 L120.0 144.7 L130.0 163.1 L140.0 149.2 L150.0 167.0 L160.0 152.4 L170.0 169.6 L180.0 154.4 L190.0 170.8 L200.0 155.0 L210.0 170.8 L220.0 154.4 L230.0 169.6 L240.0 152.4 L250.0 167.0 L260.0 149.2 L270.0 163.1 L280.0 144.7 L290.0 158.0 L290.0 182.0 281.0 184.5 272.0 186.7 263.0 188.6 254.0 190.3 245.0 191.8 236.0 192.9 227.0 193.8 218.0 194.5 209.0 194.9 200.0 195.0 191.0 194.9 182.0 194.5 173.0 193.8 164.0 192.9 155.0 191.8 146.0 190.3 137.0 188.6 128.0 186.7 119.0 184.5 110.0 182.0 Z"/>
      <path class="bf-or-fonce" d="M110 176 C142 190 170 194 200 194 C230 194 258 190 290 176 L290 186 C258 200 230 204 200 204 C170 204 142 200 110 186 Z"/>
      <g class="bf-grelots">
        <circle class="bf-or" cx="20" cy="194" r="13"/><circle class="bf-or" cx="380" cy="194" r="13"/>
        <path d="M14 196 H26 M374 196 H386" stroke="rgba(0,0,0,.28)" stroke-width="3" stroke-linecap="round"/>
        <line x1="166" y1="8" x2="160" y2="20" stroke="#1b1b1b" stroke-width="2.5"/><polygon class="bf-d20-clair" points="158.0,15.1 139.3,25.5 158.0,22.5"/><polygon class="bf-d20-clair" points="158.0,15.1 158.0,22.5 176.7,25.5"/><polygon class="bf-bleu" points="139.3,25.5 143.4,47.7 158.0,22.5"/><polygon class="bf-bleu" points="176.7,25.5 158.0,22.5 172.6,47.7"/><polygon class="bf-bleu-fonce" points="139.3,25.5 139.3,46.5 143.4,47.7"/><polygon class="bf-bleu-fonce" points="176.7,25.5 172.6,47.7 176.7,46.5"/><polygon class="bf-bleu-fonce" points="139.3,46.5 158.0,56.9 143.4,47.7"/><polygon class="bf-bleu-fonce" points="176.7,46.5 172.6,47.7 158.0,56.9"/><polygon class="bf-bleu-fonce" points="143.4,47.7 158.0,56.9 172.6,47.7"/><polygon class="bf-or" points="158.0,22.5 143.4,47.7 172.6,47.7"/>
      </g>
    </g></g>
    <g class="bf-epaule-d" style="transform-origin:284px 392px">
      <rect class="bf-bleu" x="269" y="380" width="30" height="96" rx="15"/>
      <g class="bf-coude-d" style="transform-origin:284px 470px">
        <rect class="bf-bleu" x="271" y="462" width="26" height="86" rx="13"/>
        <rect class="bf-or" x="270" y="530" width="28" height="9" rx="4"/>
        <image class="bf-sabre" href="../assets/epee.svg" x="252" y="512" width="64" height="208"/>
        <circle cx="284" cy="552" r="15" fill="#F0C8A4"/>
      </g>
    </g>
  </g>
</svg>`;
  let n = 0;
  // expression : 'clin' (clin d'œil), 'rire' (mort de rire), 'choc' (choqué), 'dort' (endormi) — rien = sourire
  function svg(forme = 'buste', { epee = false, expression = '' } = {}) {
    const id = 'bf' + (++n);
    let s = forme === 'pied' ? (epee ? PIED_EPEE : PIED).replaceAll('__P__', id) : BUSTE.replaceAll('__P__', id);
    if (forme === 'tete') s = s.replace('viewBox="0 -100 400 620"', 'viewBox="10 -100 380 450"');
    return expression ? s.replace('class="bouffon-svg', 'class="bouffon-svg expr-' + expression) : s;
  }
  return { svg };
})();
