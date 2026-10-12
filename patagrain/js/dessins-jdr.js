/* =====================================================================
   DESSINS JDR — les personnages dessinés (vectoriel), en bustes, dans un des styles :
     encre  : encre et aplats (contours à l'encre, couleurs franches, ombres et lumières nettes)
     vitrail: vitrail (verre coloré serti de plomb, traits du visage peints, lumière qui traverse)
     sceau  : sceau d'or (silhouette sombre gravée de traits dorés) — gardé pour mémoire
   Un personnage = une liste de formes [rôle de couleur, chemin, type] ; le style décide comment
   peindre chaque rôle. Types : (vide) aplat · ombre (sans contour) · detail (fin trait peint) ·
   trait (trait épais) · trait-fin · bande (galon épais) · tube (corne, gros trait) · plomb (vitrail seul) ·
   oeil · iris · lueur (halo) · sourcil · nez · tete.
   États animés par la page : bouche fermée / ouverte (.dj-ferme / .dj-ouvert), paupières (.dj-paupieres,
   clignement), et « à terre » (.dj-ko : yeux fermés, bandage, bouche molle — à 0 PV).
   DessinsJDR.svg(id, style) → le dessin, viewBox 300 × 300.
   ===================================================================== */
const DessinsJDR = (() => {
  // ---------- petits calculs de couleur ----------
  const rvb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const hex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const melange = (a, b, t) => { const x = rvb(a), y = rvb(b); return hex(x.map((v, i) => v + (y[i] - v) * t)); };
  const rond = (x, y, r) => `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

  // =====================================================================
  //  LES PERSONNAGES
  //  yeux : [[x, y, largeur]…] · bouche : [x, y, largeur] · front : [x, y] (pour les paupières et « à terre »)
  // =====================================================================
  const PERSOS = {};

  // ---------- Zokhran : orc barde cuisinier ----------
  PERSOS.zokhran = {
    couleurs: { peau: '#7FA34A', ombre: '#5A7C33', lumiere: '#A6C76A', cheveux: '#1F1A17', meche: '#3A322D', toque: '#A3303A', toque2: '#7C2029',
      toqueL: '#C95A63', tunique: '#8E2430', tablier: '#7A1D28', cape: '#25345A', cape2: '#1A2644', or: '#D9A72E', ivoire: '#EFE6CE',
      bouche: '#3A1010', langue: '#B4444E', oeil: '#F1E6C6', iris: '#6B4A22', fond: '#5A1E24' },
    yeux: [[129, 151, 26], [171, 151, 26]], bouche: [150, 199, 30], front: [150, 120],
    formes: [
      ['cheveux', 'M100 120 C84 170 88 236 104 280 L196 280 C212 236 216 170 200 120 Z'],
      ['meche', 'M104 170 C100 210 104 240 112 272 M196 170 C200 210 196 240 188 272', 'trait-fin'],
      ['cape', 'M14 300 C20 246 62 220 106 210 L194 210 C238 220 280 246 286 300 Z'],
      ['cape2', 'M14 300 C22 262 48 238 82 226 C70 250 64 276 66 300 Z', 'ombre'],
      ['cape2', 'M286 300 C278 262 252 238 218 226 C230 250 236 276 234 300 Z', 'ombre'],
      ['or', 'M26 296 C34 256 66 232 104 220 M274 296 C266 256 234 232 196 220', 'trait-fin'],
      ['or', 'M40 270 l6 -4 l2 7 Z M58 248 l6 -4 l2 7 Z M260 270 l-6 -4 l-2 7 Z M242 248 l-6 -4 l-2 7 Z'],
      ['tunique', 'M66 300 C72 258 98 236 122 228 L178 228 C202 236 228 258 234 300 Z'],
      ['tablier', 'M96 300 L100 254 C116 246 184 246 200 254 L204 300 Z'],
      ['or', 'M108 252 L108 300 M192 252 L192 300', 'trait-fin'],
      ['tunique', 'M112 270 Q130 276 150 272 Q170 276 188 270', 'detail'],
      ['peau', 'M122 186 L178 186 L182 226 L118 226 Z'],
      ['ombre', 'M122 186 L178 186 L180 204 C162 214 138 214 120 204 Z', 'ombre'],
      ['peau', 'M126 216 L150 246 L174 216 Z'],
      ['peau', 'M97 144 L64 124 L71 132 L93 170 Z'],
      ['peau', 'M203 144 L236 124 L229 132 L207 170 Z'],
      ['ombre', 'M93 150 L72 133 L91 162 Z', 'ombre'],
      ['ombre', 'M207 150 L228 133 L209 162 Z', 'ombre'],
      ['peau', 'M150 96 C182 96 204 114 206 146 C208 170 204 190 192 206 C180 220 166 228 150 228 C134 228 120 220 108 206 C96 190 92 170 94 146 C96 114 118 96 150 96 Z', 'tete'],
      ['ombre', 'M174 100 C198 112 208 132 206 156 C204 184 192 208 168 224 C184 200 190 174 186 146 C184 126 180 110 174 100 Z', 'ombre'],
      ['lumiere', 'M116 120 C124 108 140 102 152 104 C138 110 126 118 120 130 Z', 'ombre'],
      ['lumiere', 'M108 168 C112 184 120 194 130 200 C120 198 110 188 106 176 Z', 'ombre'],
      ['ombre', 'M108 142 C122 134 138 136 148 148 L152 148 C162 136 178 134 192 142 L190 148 C176 142 164 146 156 156 L144 156 C136 146 124 142 110 148 Z', 'ombre'],
      ['ombre', 'M140 130 Q150 126 160 130 M118 178 C122 188 128 194 134 198 M182 178 C178 188 172 194 166 198 M90 152 L76 134 M210 152 L224 134', 'detail'],
      ['oeil', 'M117 151 Q129 144 141 151 Q129 155 117 151 Z', 'oeil'],
      ['oeil', 'M159 151 Q171 144 183 151 Q171 155 159 151 Z', 'oeil'],
      ['iris', rond(130.6, 150.5, 3.6), 'iris'], ['iris', rond(169.6, 150.5, 3.6), 'iris'],
      ['peau', 'M115 150 Q129 141 143 150 L143 147 Q129 139 115 147 Z', 'paupiere'],
      ['peau', 'M157 150 Q171 141 185 150 L185 147 Q171 139 157 147 Z', 'paupiere'],
      ['cheveux', 'M108 140 C118 128 134 128 146 142 L143 146 C132 136 120 136 110 144 Z', 'sourcil'],
      ['cheveux', 'M192 136 C182 126 166 128 154 142 L157 146 C168 136 180 134 191 141 Z', 'sourcil'],
      ['ombre', 'M145 156 C141 168 134 174 138 181 C144 186 156 186 162 181 C166 174 159 168 155 156 Z', 'nez'],
      ['lumiere', 'M148 160 C147 168 146 174 148 178 L152 178 C152 172 151 166 150 160 Z', 'ombre'],
      ['cheveux', 'M104 198 C112 214 128 228 150 230 C172 228 188 214 196 198 C190 208 178 218 166 220 C160 214 140 214 134 220 C122 218 110 208 104 198 Z'],
      ['cheveux', 'M134 206 C138 226 144 248 150 258 C156 248 162 226 166 206 C158 214 142 214 134 206 Z'],
      ['meche', 'M144 222 L147 248 M156 222 L153 248 M150 220 L150 252', 'trait-fin'],
      ['cheveux', 'M126 189 C136 183 145 183 150 187 C155 183 164 183 174 189 C166 194 157 193 150 191 C143 193 134 194 126 189 Z'],
      ['toque', 'M90 102 C68 86 72 48 102 46 C108 22 140 16 156 32 C170 14 206 22 206 48 C234 52 234 88 210 102 C180 94 120 94 90 102 Z', 'toque'],
      ['toque2', 'M118 98 C112 76 116 54 126 42 M150 96 C148 74 152 50 160 34 M182 98 C188 76 186 56 180 44', 'trait-fin'],
      ['toqueL', 'M100 60 C104 50 116 46 124 48 C114 54 108 62 106 72 Z', 'ombre'],
      ['toque2', 'M92 98 C118 89 182 89 208 98 L210 118 C184 109 116 109 90 118 Z'],
      ['or', 'M118 106 l4 -6 l4 6 M146 104 l4 -6 l4 6 M174 106 l4 -6 l4 6', 'trait-fin'],
      ['or', 'M116 226 C124 262 176 262 184 226', 'chaine'],
      ['or', 'M132 268 L160 264 C164 256 176 252 182 258 C186 266 184 276 176 280 C170 282 164 278 160 274 L132 274 Z'],
      ['tablier', 'M172 260 C178 262 180 270 176 276 C172 274 170 266 172 260 Z', 'ombre'],
      ['plomb', 'M40 300 L70 240 M260 300 L230 240 M150 262 L150 300 M96 160 L118 176 M204 160 L182 176 M120 60 L150 96 L180 60 M66 300 L96 300', 'plomb'],
    ],
    textes: [['♪', 116, 284, 16], ['♫', 140, 292, 14], ['♪', 168, 290, 15], ['♫', 182, 280, 13]],
    ferme: [['bouche', 'M136 199 Q149 203 165 195', 'trait'], ['ivoire', 'M139 201 L136 189 L144 200 Z'], ['ivoire', 'M162 200 L165 188 L157 199 Z']],
    ouvert: [['bouche', 'M134 195 Q150 191 166 195 Q162 215 150 217 Q138 215 134 195 Z'], ['langue', 'M141 209 Q150 203 159 209 Q156 216 150 216 Q144 216 141 209 Z'],
      ['ivoire', 'M138 198 L135 184 L144 197 Z'], ['ivoire', 'M162 198 L165 184 L156 197 Z']],
  };

  // ---------- Namerya : l'ondine aux yeux d'océan ----------
  PERSOS.namerya = {
    couleurs: { peau: '#F1D6C8', ombre: '#D8B2A4', lumiere: '#FFF2EA', joue: '#EAA9A6', cheveux: '#15171F', meche: '#3A4766', cape: '#1F3D72', cape2: '#162B52',
      doublure: '#1E6E5C', robe: '#1B4F7C', robe2: '#13385A', argent: '#AEB9C7', argent2: '#6F7B8A', cristal: '#53C8EE', levres: '#C77382',
      bouche: '#5A1E28', dents: '#F8F2EE', oeil: '#FFFFFF', iris: '#3AA2DD', lueur: '#7FDBFF', fond: '#163C5E' },
    yeux: [[132, 153, 26], [168, 153, 26]], bouche: [150, 191, 22], front: [150, 124],
    formes: [
      ['cape', 'M70 300 C60 214 76 120 150 76 C224 120 240 214 230 300 Z'],
      ['cape2', 'M70 300 C62 240 66 180 90 132 C82 190 86 250 96 300 Z', 'ombre'],
      ['doublure', 'M92 300 C86 228 96 140 150 98 C204 140 214 228 208 300 Z'],
      ['cheveux', 'M104 112 C80 150 80 222 94 292 L206 292 C220 222 220 150 196 112 C184 86 116 86 104 112 Z'],
      ['meche', 'M102 160 C96 200 100 240 96 280 M198 160 C204 200 200 240 204 280 M114 200 C110 230 114 260 110 288 M186 200 C190 230 186 260 190 288', 'trait-fin'],
      ['peau', 'M137 194 L163 194 L166 230 L134 230 Z'],
      ['ombre', 'M137 194 L163 194 L164 206 C156 212 144 212 136 206 Z', 'ombre'],
      ['robe', 'M72 300 C78 262 106 240 132 233 L168 233 C194 240 222 262 228 300 Z'],
      ['robe2', 'M150 262 L118 300 L182 300 Z', 'ombre'],
      ['argent', 'M118 300 L150 262 L182 300', 'trait-fin'],
      ['peau', 'M134 232 L150 264 L166 232 Z'],
      ['argent', 'M62 286 C60 252 82 232 112 232 C120 248 116 268 102 284 Z'],
      ['argent', 'M238 286 C240 252 218 232 188 232 C180 248 184 268 198 284 Z'],
      ['argent2', 'M72 270 C80 252 94 242 108 242 M228 270 C220 252 206 242 192 242 M80 280 C86 268 94 262 102 260 M220 280 C214 268 206 262 198 260', 'detail'],
      ['argent2', 'M90 254 q6 -8 12 0 q-6 8 -12 0 Z M198 254 q6 -8 12 0 q-6 8 -12 0 Z'],
      ['argent2', 'M150 236 L150 252', 'trait-fin'],
      ['lueur', rond(150, 263, 13), 'lueur'],
      ['cristal', 'M150 250 L158 261 L150 278 L142 261 Z'],
      ['lumiere', 'M150 254 L153 261 L150 268 Z', 'ombre'],
      ['peau', 'M150 104 C176 104 192 124 192 154 C192 184 174 210 150 214 C126 210 108 184 108 154 C108 124 124 104 150 104 Z', 'tete'],
      ['ombre', 'M170 108 C186 120 192 140 190 160 C188 186 176 204 160 212 C172 194 178 172 176 148 C174 130 172 118 170 108 Z', 'ombre'],
      ['lumiere', 'M120 130 C126 118 138 112 148 112 C136 118 128 126 124 138 Z', 'ombre'],
      ['joue', 'M116 172 a8 4.5 0 1 0 16 0 a8 4.5 0 1 0 -16 0 M168 172 a8 4.5 0 1 0 16 0 a8 4.5 0 1 0 -16 0', 'ombre'],
      ['oeil', 'M120 153 Q132 145 144 153 Q132 158 120 153 Z', 'oeil'],
      ['oeil', 'M156 153 Q168 145 180 153 Q168 158 156 153 Z', 'oeil'],
      ['iris', rond(132, 152.5, 4.6), 'iris'], ['iris', rond(168, 152.5, 4.6), 'iris'],
      ['oeil', rond(133.5, 151, 1.3) + ' ' + rond(169.5, 151, 1.3), 'ombre'],
      ['cheveux', 'M119 152 Q132 143 145 151 M155 151 Q168 143 181 152', 'trait'],
      ['cheveux', 'M118 140 Q131 133 144 139 L143 142 Q131 136 119 143 Z', 'sourcil'],
      ['cheveux', 'M182 140 Q169 133 156 139 L157 142 Q169 136 181 143 Z', 'sourcil'],
      ['ombre', 'M150 158 C148 168 145 174 147 178 C149 180 151 180 153 178', 'detail'],
      ['cheveux', 'M110 122 C100 152 104 194 94 236 C110 204 114 162 126 118 Z'],
      ['cheveux', 'M190 122 C200 152 196 194 206 236 C190 204 186 162 174 118 Z'],
      ['cheveux', 'M110 128 C116 102 138 92 150 96 C162 92 184 102 190 128 C178 112 162 106 150 110 C138 106 122 112 110 128 Z'],
      ['meche', 'M120 116 C132 104 144 102 150 104 M104 150 C100 180 102 206 98 226', 'trait-fin'],
      ['cape2', 'M92 300 C86 228 96 140 150 98 C204 140 214 228 208 300', 'trait-fin'],
      ['plomb', 'M150 76 L150 98 M80 200 L104 210 M220 200 L196 210 M110 300 L130 250 M190 300 L170 250 M72 250 L92 250 M228 250 L208 250', 'plomb'],
    ],
    ferme: [['levres', 'M140 190 Q150 186 160 190 Q150 198 140 190 Z']],
    ouvert: [['bouche', 'M140 188 Q150 185 160 188 Q157 200 150 201 Q143 200 140 188 Z'], ['dents', 'M142 189 Q150 187 158 189 L157 192 Q150 190 143 192 Z'],
      ['levres', 'M139 188 Q150 184 161 188', 'trait-fin']],
  };

  // ---------- Kenai : le gardien aux ombres intérieures (orc, chignon, cuir et cuivre) ----------
  PERSOS.kenai = {
    couleurs: { peau: '#7C8D3C', ombre: '#5C6B2A', lumiere: '#9CAF55', cheveux: '#1A1714', meche: '#3A332D', fourrure: '#8B7559', fourrure2: '#5E4C36',
      cuir: '#6A3D22', cuir2: '#4E2C17', cuivre: '#C27B45', metal: '#9AA1A8', oeil: '#F2C23E', iris: '#2A1A06', ivoire: '#EDE3CB', bouche: '#2E1010', fond: '#4A2E1C' },
    yeux: [[129, 142, 24], [171, 142, 24]], bouche: [150, 189, 32], front: [150, 112],
    formes: [
      ['cuir', 'M10 300 C16 244 58 218 108 208 L192 208 C242 218 284 244 290 300 Z'],
      ['cuir2', 'M100 300 L118 236 L132 236 L116 300 Z'], ['cuir2', 'M200 300 L182 236 L168 236 L184 300 Z'],
      ['metal', 'M138 262 h24 v14 h-24 Z M140 284 h20 v12 h-20 Z'],
      ['cuir2', 'M144 266 h12 v6 h-12 Z M146 288 h8 v5 h-8 Z'],
      ['cuir2', 'M18 278 C16 244 44 224 82 226 C92 246 88 270 72 290 Z'], ['cuir2', 'M282 278 C284 244 256 224 218 226 C208 246 212 270 228 290 Z'],
      ['cuivre', 'M26 262 C36 244 56 234 80 234 M274 262 C264 244 244 234 220 234', 'bande'],
      ['metal', rond(43, 254, 3) + ' ' + rond(63, 244, 3) + ' ' + rond(257, 254, 3) + ' ' + rond(237, 244, 3)],
      ['cuir', 'M40 300 C44 284 52 272 64 266 M260 300 C256 284 248 272 236 266', 'detail'],
      ['peau', 'M124 178 L176 178 L180 214 L120 214 Z'],
      ['fourrure', 'M80 230 C76 210 92 196 108 200 C112 188 126 184 136 192 C142 184 158 184 164 192 C174 184 188 188 192 200 C208 196 224 210 220 230 C196 236 104 236 80 230 Z'],
      ['fourrure2', 'M92 222 l6 -10 l4 10 M120 216 l5 -10 l5 10 M146 214 l4 -10 l4 10 M176 216 l5 -10 l5 10 M204 222 l4 -10 l6 10', 'trait-fin'],
      ['peau', 'M99 140 L70 120 L94 166 Z'], ['peau', 'M201 140 L230 120 L206 166 Z'],
      ['ombre', 'M95 146 L76 128 L93 158 Z M205 146 L224 128 L207 158 Z', 'ombre'],
      ['peau', 'M150 86 C182 86 202 104 204 138 C206 164 202 186 190 200 C178 212 164 218 150 218 C136 218 122 212 110 200 C98 186 94 164 96 138 C98 104 118 86 150 86 Z', 'tete'],
      ['ombre', 'M172 90 C196 102 206 124 204 148 C202 176 190 198 166 214 C182 190 188 164 184 136 C182 116 178 100 172 90 Z', 'ombre'],
      ['lumiere', 'M112 116 C120 102 136 96 148 96 C134 104 122 112 116 126 Z', 'ombre'],
      ['ombre', 'M106 132 C122 128 138 132 148 142 L152 142 C162 132 178 128 194 132 L192 140 C176 136 164 140 156 150 L144 150 C136 140 124 136 108 140 Z', 'ombre'],
      ['ombre', 'M118 172 C122 182 128 188 134 192 M182 172 C178 182 172 188 166 192 M140 124 L146 132 M160 124 L154 132', 'detail'],
      ['ombre', 'M178 118 L168 148 M174 122 l6 3 M171 131 l6 3 M168 140 l6 3', 'detail'],
      ['oeil', 'M118 143 Q129 137 140 143 Q129 148 118 143 Z', 'oeil'],
      ['oeil', 'M160 143 Q171 137 182 143 Q171 148 160 143 Z', 'oeil'],
      ['iris', rond(130, 142.5, 2.8), 'iris'], ['iris', rond(170, 142.5, 2.8), 'iris'],
      ['cheveux', 'M108 128 L144 138 L142 144 L108 134 Z', 'sourcil'], ['cheveux', 'M192 128 L156 138 L158 144 L192 134 Z', 'sourcil'],
      ['ombre', 'M143 148 C138 162 132 168 136 176 C142 182 158 182 164 176 C168 168 162 162 157 148 Z', 'nez'],
      ['ombre', rond(142, 174, 2.5) + ' ' + rond(158, 174, 2.5), 'ombre'],
      ['cheveux', 'M100 124 C100 94 122 78 150 78 C178 78 200 94 200 124 C190 106 172 98 150 98 C128 98 110 106 100 124 Z'],
      ['meche', 'M116 100 C128 88 142 84 150 84 M184 100 C172 88 158 84 150 84', 'trait-fin'],
      ['cheveux', 'M138 72 C134 54 146 44 156 48 C168 52 168 68 160 76 C154 80 144 80 138 72 Z'],
      ['cuivre', 'M138 72 Q150 78 162 72', 'bande'],
      ['plomb', 'M10 300 L60 240 M290 300 L240 240 M150 236 L150 262 M100 150 L118 160 M200 150 L182 160 M150 48 L150 78', 'plomb'],
    ],
    ferme: [['bouche', 'M134 191 Q150 185 166 191', 'trait'], ['ivoire', 'M136 193 L134 180 L141 191 Z'], ['ivoire', 'M164 193 L166 180 L159 191 Z']],
    ouvert: [['bouche', 'M133 186 Q150 182 167 186 Q163 204 150 205 Q137 204 133 186 Z'], ['ivoire', 'M140 186 h20 v3 h-20 Z'],
      ['ivoire', 'M136 190 L133 176 L142 188 Z'], ['ivoire', 'M164 190 L167 176 L158 188 Z']],
  };

  // ---------- Trayss : l'héritage des brumes (draconide violette, de trois quarts) ----------
  PERSOS.trayss = {
    couleurs: { peau: '#6A3FA0', ombre: '#4B2A78', lumiere: '#9670C8', corne: '#3E2460', corne2: '#5B3A85', cuir: '#5E3A22', cuir2: '#43291A',
      cuivre: '#B8783F', oeil: '#E9D2FF', iris: '#2A0A4A', lueur: '#C88BFF', bouche: '#2A0E22', dents: '#F2ECE0', fleche: '#7A5A3A',
      plume: '#C9C2B6', carquois: '#4A2E1C', fond: '#2E1A4A' },
    yeux: [[180, 118, 24]], bouche: [196, 158, 40], front: [160, 104],
    formes: [
      ['carquois', 'M50 262 L84 150 L104 156 L76 272 Z'],
      ['cuivre', 'M56 246 L92 256 M66 212 L98 220', 'bande'],
      ['fleche', 'M86 150 L98 92 M92 152 L110 96 M98 154 L120 104', 'bande'],
      ['plume', 'M94 98 l4 -16 l8 14 Z M106 102 l8 -16 l6 15 Z M116 110 l10 -14 l4 15 Z'],
      ['cuir', 'M24 300 C30 246 70 220 116 212 L196 212 C238 222 274 248 280 300 Z'],
      ['cuir2', 'M28 282 C26 248 54 226 92 228 C102 248 98 272 82 290 Z'], ['cuir2', 'M272 282 C276 250 252 228 214 228 C204 248 208 272 224 290 Z'],
      ['cuivre', 'M36 262 C46 244 66 234 90 236 M266 262 C256 244 236 234 212 236', 'bande'],
      ['cuir2', 'M130 300 L146 228 L160 228 L144 300 Z'], ['cuivre', 'M140 258 h18 v12 h-18 Z'],
      ['cuir', 'M200 300 C202 280 208 266 218 256 M60 300 C62 284 68 272 78 264', 'detail'],
      ['peau', 'M120 232 C116 200 128 170 150 160 L184 168 C176 190 174 212 180 234 Z'],
      ['lumiere', 'M160 172 C156 196 158 216 166 234 L180 234 C174 212 176 190 184 168 Z', 'ombre'],
      ['ombre', 'M132 210 q6 -4 12 0 M140 196 q6 -4 12 0 M128 222 q6 -4 12 0 M150 220 q6 -4 12 0 M168 190 h10 M166 204 h10 M168 218 h10', 'detail'],
      ['corne2', 'M108 128 L86 122 L106 112 L88 98 L112 98 L102 80 L124 92 Z'],
      ['corne', 'M128 104 C108 78 96 54 86 36 C106 52 126 74 142 98 Z'],
      ['corne', 'M146 96 C144 66 152 44 164 28 C166 54 164 78 158 98 Z'],
      ['corne2', 'M116 80 l6 -4 M108 66 l6 -4 M152 58 l6 2 M150 76 l6 2', 'trait-fin'],
      ['peau', 'M116 126 C122 100 148 88 174 94 C196 100 216 112 230 128 C236 134 234 144 226 148 L196 156 C182 162 164 168 146 168 C126 166 112 150 116 126 Z', 'tete'],
      ['ombre', 'M126 150 C146 160 176 158 200 152 L226 148 C214 156 196 162 176 166 C156 170 136 166 126 150 Z', 'ombre'],
      ['lumiere', 'M150 98 C166 94 186 98 202 108 C186 104 170 104 156 108 Z', 'ombre'],
      ['ombre', 'M160 106 C172 98 188 102 196 114 C184 108 170 108 160 114 Z', 'ombre'],
      ['ombre', 'M134 120 q5 -4 10 0 M146 132 q5 -4 10 0 M132 140 q5 -4 10 0 M200 128 q4 -3 8 0 M210 136 q4 -3 8 0 M220 128 q4 -3 6 1', 'detail'],
      ['corne2', 'M120 150 L102 156 L118 160 L106 170 L124 168 Z'],
      ['lueur', 'M164 118 a16 11 0 1 0 32 0 a16 11 0 1 0 -32 0', 'lueur'],
      ['oeil', 'M168 118 Q180 110 192 118 Q180 124 168 118 Z', 'oeil'],
      ['iris', 'M178.6 112.5 L181.4 112.5 L181 123.5 L179 123.5 Z', 'iris'],
      ['corne', 'M166 112 Q180 104 194 114', 'trait'],
      ['plomb', 'M24 300 L70 250 M280 300 L234 250 M150 168 L146 228 M200 112 L214 122 M92 200 L110 210', 'plomb'],
    ],
    ferme: [['peau', 'M146 166 C168 168 196 162 222 150 C218 160 198 174 170 178 C158 178 148 174 146 166 Z'],
      ['ombre', 'M190 158 L222 150', 'detail'], ['dents', 'M202 156 l3 5 l3 -6 Z M212 153 l3 5 l3 -6 Z']],
    ouvert: [['bouche', 'M150 164 C176 166 204 158 226 148 C226 162 210 178 182 186 C166 188 152 182 150 164 Z'],
      ['peau', 'M146 174 C168 178 196 174 218 164 C214 174 196 188 170 192 C158 192 148 186 146 174 Z'],
      ['dents', 'M204 156 l3 7 l3 -8 Z M192 160 l3 7 l3 -8 Z M198 172 l3 -6 l3 6 Z M186 176 l3 -6 l3 6 Z']],
  };

  // ---------- Ba Heng Ze : la quête du savoir mondial (cornes de bélier, longue barbe blanche) ----------
  PERSOS.baheng = {
    couleurs: { peau: '#D7AD86', ombre: '#B88A64', lumiere: '#EBCBA8', barbe: '#ECE8E0', barbe2: '#BDB6AA', corne: '#A07C56', corne2: '#6E5235',
      cuir: '#6B4A2E', cuir2: '#4E341F', bronze: '#B08D57', bronze2: '#7E6238', oeil: '#F4EEDC', iris: '#4A5A3A', bouche: '#3A1A12', metal: '#8E8676', fond: '#3E3424' },
    yeux: [[130, 150, 22], [170, 150, 22]], bouche: [150, 199, 22], front: [150, 116],
    formes: [
      ['barbe2', 'M98 120 C86 168 90 230 104 272 L196 272 C210 230 214 168 202 120 Z'],
      ['cuir', 'M14 300 C20 246 62 220 106 210 L194 210 C238 220 280 246 286 300 Z'],
      ['bronze', 'M20 280 C18 246 46 226 84 228 C94 248 90 272 74 290 Z'], ['bronze', 'M280 280 C282 246 254 226 216 228 C206 248 210 272 226 290 Z'],
      ['bronze2', 'M28 262 C38 246 56 236 80 236 M272 262 C262 246 244 236 220 236', 'bande'],
      ['metal', rond(44, 254, 3) + ' ' + rond(64, 244, 3) + ' ' + rond(256, 254, 3) + ' ' + rond(236, 244, 3)],
      ['cuir2', 'M60 300 C64 280 74 266 88 258 M240 300 C236 280 226 266 212 258', 'detail'],
      ['peau', 'M128 186 L172 186 L176 220 L124 220 Z'],
      ['peau', 'M98 146 L74 122 L94 168 Z'], ['peau', 'M202 146 L226 122 L206 168 Z'],
      ['corne', 'M116 112 C92 92 62 100 58 128 C54 156 80 172 98 160 C110 152 108 132 94 130 C86 130 82 138 88 144', 'tube'],
      ['corne', 'M184 112 C208 92 238 100 242 128 C246 156 220 172 202 160 C190 152 192 132 206 130 C214 130 218 138 212 144', 'tube'],
      ['corne2', 'M68 108 l8 7 M58 128 l10 1 M66 150 l8 -6 M90 160 l2 -9 M232 108 l-8 7 M242 128 l-10 1 M234 150 l-8 -6 M210 160 l-2 -9', 'trait-fin'],
      ['peau', 'M150 98 C180 98 200 116 202 148 C204 176 194 198 178 210 C168 218 160 222 150 222 C140 222 132 218 122 210 C106 198 96 176 98 148 C100 116 120 98 150 98 Z', 'tete'],
      ['ombre', 'M172 102 C194 114 204 136 202 158 C200 182 190 202 168 216 C182 194 188 170 184 144 C182 126 178 112 172 102 Z', 'ombre'],
      ['lumiere', 'M114 128 C120 114 134 106 146 106 C134 112 124 120 118 132 Z', 'ombre'],
      ['ombre', 'M126 122 Q150 116 174 122 M130 130 Q150 125 170 130 M110 150 l-6 -3 M110 155 l-6 2 M190 150 l6 -3 M190 155 l6 2 M120 176 C124 186 130 192 136 196 M180 176 C176 186 170 192 164 196', 'detail'],
      ['barbe', 'M106 128 C108 102 128 92 150 92 C172 92 192 102 194 128 C182 112 168 106 150 106 C132 106 118 112 106 128 Z'],
      ['oeil', 'M120 151 Q130 146 140 151 Q130 155 120 151 Z', 'oeil'],
      ['oeil', 'M160 151 Q170 146 180 151 Q170 155 160 151 Z', 'oeil'],
      ['iris', rond(130.5, 150.8, 2.8), 'iris'], ['iris', rond(169.5, 150.8, 2.8), 'iris'],
      ['barbe', 'M108 140 C118 128 136 130 146 142 L144 147 C134 138 120 138 110 147 Z', 'sourcil'],
      ['barbe', 'M192 140 C182 128 164 130 154 142 L156 147 C166 138 180 138 190 147 Z', 'sourcil'],
      ['ombre', 'M146 152 C142 168 138 178 142 184 C146 188 154 188 158 184 C162 178 158 168 154 152 Z', 'nez'],
      ['barbe', 'M110 186 C108 214 118 250 134 280 C140 292 160 292 166 280 C182 250 192 214 190 186 C178 200 166 206 150 206 C134 206 122 200 110 186 Z'],
      ['barbe2', 'M130 220 C134 246 140 266 146 284 M150 214 L150 290 M170 220 C166 246 160 266 154 284 M120 204 C122 224 126 240 132 254 M180 204 C178 224 174 240 168 254', 'trait-fin'],
      ['barbe', 'M122 190 C134 182 144 182 150 188 C156 182 166 182 178 190 C170 200 158 198 150 194 C142 198 130 200 122 190 Z'],
      ['plomb', 'M14 300 L64 244 M286 300 L236 244 M150 290 L150 300 M100 150 L116 160 M200 150 L184 160 M150 92 L150 106', 'plomb'],
    ],
    ferme: [['bouche', 'M140 199 Q150 201 160 199', 'trait']],
    ouvert: [['bouche', 'M140 196 Q150 194 160 196 Q157 207 150 208 Q143 207 140 196 Z']],
  };

  // ---------- Dvergrost : l'enfant des rocs et des griffes (nain, cape d'ours, collier de griffes, hache) ----------
  PERSOS.dvergrost = {
    couleurs: { peau: '#D49A74', ombre: '#B07A58', lumiere: '#E8B892', cheveux: '#1C1714', meche: '#3B332C', fourrure: '#5E4A38', fourrure2: '#3C2E22',
      griffe: '#EDE3CF', metal: '#9AA2AA', metal2: '#5F666D', manche: '#6B4A2E', cuir: '#5A3D27', perle: '#C9A23A', oeil: '#F2EAD8', iris: '#2A1D14',
      bouche: '#3A1414', fond: '#3A3026' },
    yeux: [[130, 151, 20], [170, 151, 20]], bouche: [150, 203, 24], front: [150, 122],
    formes: [
      ['manche', 'M206 300 L246 70 L256 72 L218 300 Z'],
      ['metal', 'M232 60 C250 40 284 44 292 70 C276 70 262 80 256 96 L246 92 C246 80 240 68 232 60 Z'],
      ['metal2', 'M238 62 C254 50 276 52 286 68', 'trait-fin'],
      ['cuir', 'M4 300 C8 240 54 212 104 204 L196 204 C246 212 292 240 296 300 Z'],
      ['fourrure', 'M2 300 C6 236 52 204 100 198 C110 210 112 226 104 240 C70 246 44 268 36 300 Z'],
      ['fourrure', 'M298 300 C294 236 248 204 200 198 C190 210 188 226 196 240 C230 246 256 268 264 300 Z'],
      ['fourrure2', 'M24 270 l8 -10 l4 10 M50 240 l8 -10 l4 10 M76 220 l8 -10 l4 10 M250 240 l-8 -10 l-4 10 M276 270 l-8 -10 l-4 10 M224 220 l-8 -10 l-4 10', 'trait-fin'],
      ['griffe', 'M96 202 l-6 -14 l12 8 Z M204 202 l6 -14 l-12 8 Z'],
      ['cuir', 'M108 236 C124 252 176 252 192 236', 'trait-fin'],
      ['griffe', 'M120 244 l-3 14 l8 -12 Z M136 250 l-2 15 l8 -13 Z M164 250 l2 15 l-8 -13 Z M180 244 l3 14 l-8 -12 Z'],
      ['peau', 'M120 186 L180 186 L184 210 L116 210 Z'],
      ['peau', 'M94 148 C80 144 78 166 92 172 Z'], ['peau', 'M206 148 C220 144 222 166 208 172 Z'],
      ['peau', 'M150 100 C184 100 206 118 208 150 C210 176 202 196 188 208 C176 218 162 222 150 222 C138 222 124 218 112 208 C98 196 90 176 92 150 C94 118 116 100 150 100 Z', 'tete'],
      ['ombre', 'M174 104 C196 116 208 138 206 160 C204 184 192 204 168 218 C182 196 188 170 184 144 C182 126 180 114 174 104 Z', 'ombre'],
      ['lumiere', 'M114 128 C120 116 134 108 146 108 C134 114 124 122 118 134 Z', 'ombre'],
      ['ombre', 'M108 144 C122 138 138 140 148 152 L152 152 C162 140 178 138 192 144 L190 152 C176 148 164 150 156 160 L144 160 C136 150 124 148 110 152 Z', 'ombre'],
      ['oeil', 'M121 152 Q130 148 139 152 Q130 155 121 152 Z', 'oeil'],
      ['oeil', 'M161 152 Q170 148 179 152 Q170 155 161 152 Z', 'oeil'],
      ['iris', rond(130, 151.8, 2.6), 'iris'], ['iris', rond(170, 151.8, 2.6), 'iris'],
      ['cheveux', 'M104 138 C116 126 136 128 148 142 L145 148 C132 138 120 138 106 146 Z', 'sourcil'],
      ['cheveux', 'M196 138 C184 126 164 128 152 142 L155 148 C168 138 180 138 194 146 Z', 'sourcil'],
      ['ombre', 'M142 152 C136 166 132 180 140 188 C146 192 154 192 160 188 C168 180 164 166 158 152 Z', 'nez'],
      ['lumiere', 'M148 158 C146 168 146 176 148 182 L153 182 C153 174 152 166 151 158 Z', 'ombre'],
      ['cheveux', 'M92 150 C88 112 112 88 150 88 C188 88 212 112 208 150 C200 124 182 112 150 112 C118 112 100 124 92 150 Z'],
      ['meche', 'M112 104 C128 94 142 92 150 92 M188 104 C172 94 158 92 150 92', 'trait-fin'],
      ['cheveux', 'M100 176 C98 214 110 252 128 290 L172 290 C190 252 202 214 200 176 C188 194 172 202 150 202 C128 202 112 194 100 176 Z'],
      ['cheveux', 'M128 270 C126 284 128 296 132 300 L142 300 C140 290 138 280 140 268 Z'],
      ['cheveux', 'M172 270 C174 284 172 296 168 300 L158 300 C160 290 162 280 160 268 Z'],
      ['perle', 'M128 282 h14 v8 h-14 Z M158 282 h14 v8 h-14 Z'],
      ['meche', 'M118 210 C120 240 126 262 132 280 M150 206 L150 286 M182 210 C180 240 174 262 168 280', 'trait-fin'],
      ['cheveux', 'M120 192 C132 182 144 184 150 190 C156 184 168 182 180 192 C170 204 158 200 150 196 C142 200 130 204 120 192 Z'],
      ['plomb', 'M4 300 L50 246 M296 300 L250 246 M150 286 L150 300 M100 152 L114 160 M200 152 L186 160 M246 70 L292 70', 'plomb'],
    ],
    ferme: [['bouche', 'M140 203 Q150 206 160 203', 'trait']],
    ouvert: [['bouche', 'M138 199 Q150 196 162 199 Q158 213 150 214 Q142 213 138 199 Z']],
  };

  // =====================================================================
  //  LES STYLES : comment peindre chaque rôle selon son type
  // =====================================================================
  const ENCRE = '#17110C', PLOMB = '#1B1410';
  const PEINTS = {
    encre(role, c, type) {
      const coul = c[role] || '#888888';
      switch (type) {
        case 'ombre': case 'nez': case 'paupiere': return { fill: coul, stroke: 'none' };
        case 'detail': return { fill: 'none', stroke: ENCRE, 'stroke-width': 1.6, opacity: .65 };
        case 'trait': return { fill: 'none', stroke: ENCRE, 'stroke-width': 4 };
        case 'trait-fin': return { fill: 'none', stroke: coul, 'stroke-width': 2.5 };
        case 'chaine': return { fill: 'none', stroke: coul, 'stroke-width': 4, 'stroke-dasharray': '7 4' };
        case 'bande': return { fill: 'none', stroke: coul, 'stroke-width': 7 };
        case 'lueur': return { fill: coul, stroke: 'none', opacity: .35 };
        case 'iris': return { fill: coul, stroke: 'none' };
        default: return { fill: coul, stroke: ENCRE, 'stroke-width': 3 };
      }
    },
    vitrail(role, c, type) {
      const coul = c[role] || '#888888', verre = melange(coul, '#FFFFFF', /peau|ombre|lumiere|joue/.test(role) ? .14 : .08);
      switch (type) {
        case 'ombre': case 'nez': return { fill: coul, stroke: PLOMB, 'stroke-width': 2.5, opacity: .85 };
        case 'paupiere': return { fill: verre, stroke: 'none' };
        case 'detail': return { fill: 'none', stroke: '#2A1A12', 'stroke-width': 2.2, opacity: .75 };
        case 'trait': return { fill: 'none', stroke: '#2A1A12', 'stroke-width': 4.5 };
        case 'trait-fin': return { fill: 'none', stroke: PLOMB, 'stroke-width': 3 };
        case 'chaine': return { fill: 'none', stroke: PLOMB, 'stroke-width': 7 };
        case 'bande': return { fill: 'none', stroke: PLOMB, 'stroke-width': 9 };
        case 'lueur': return { fill: coul, stroke: 'none', opacity: .45 };
        case 'iris': return { fill: coul, stroke: PLOMB, 'stroke-width': 1.5 };
        default: return { fill: verre, stroke: PLOMB, 'stroke-width': 5, 'fill-opacity': .95 };
      }
    },
    sceau(role, c, type) {
      const or = '#E2B33C', fonce = melange(c[role] || '#333333', '#0B0907', .78);
      if (role === 'oeil') return { fill: '#FFE7A0', stroke: or, 'stroke-width': 1.5 };
      if (type === 'iris') return { fill: '#3A2606', stroke: 'none' };
      if (type === 'lueur') return { fill: or, stroke: 'none', opacity: .2 };
      if (type === 'paupiere') return { fill: fonce, stroke: 'none' };
      if (['ombre', 'nez', 'detail', 'trait-fin'].includes(type)) return { fill: 'none', stroke: or, 'stroke-width': 1.2, opacity: role === 'lumiere' ? .8 : .55 };
      if (type === 'bande' || type === 'chaine') return { fill: 'none', stroke: or, 'stroke-width': 2.4, 'stroke-dasharray': type === 'chaine' ? '6 4' : '' };
      if (type === 'trait') return { fill: 'none', stroke: or, 'stroke-width': 3 };
      return { fill: fonce, stroke: or, 'stroke-width': 2.2 };
    },
  };

  const attributs = o => Object.entries(o).filter(([, v]) => v !== '' && v !== undefined).map(([k, v]) => `${k}="${v}"`).join(' ');
  let numero = 0;
  function svg(id, style = 'encre') {
    const p = PERSOS[id];
    if (!p) return '';
    const peindre = PEINTS[style] || PEINTS.encre, c = p.couleurs, n = ++numero;
    const chemin = (d, o) => `<path d="${d}" ${attributs({ 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...o })}/>`;
    const forme = ([role, d, type = '']) => {
      if (type === 'plomb') return style === 'vitrail' ? chemin(d, { fill: 'none', stroke: PLOMB, 'stroke-width': 5 }) : '';
      if (type === 'tube') {                                  // une corne : gros trait cerné, avec ses stries
        const bord = style === 'sceau' ? '#E2B33C' : style === 'vitrail' ? PLOMB : ENCRE;
        const coeur = style === 'sceau' ? melange(c[role], '#0B0907', .78) : style === 'vitrail' ? melange(c[role], '#FFFFFF', .08) : c[role];
        return chemin(d, { fill: 'none', stroke: bord, 'stroke-width': style === 'vitrail' ? 26 : 23 }) + chemin(d, { fill: 'none', stroke: coeur, 'stroke-width': 17 });
      }
      return chemin(d, peindre(role, c, type));
    };
    // paupières (clignement, et yeux fermés « à terre ») : l'amande de l'œil, couleur peau
    const peauPaupiere = peindre('peau', c, 'paupiere');
    const paupieres = p.yeux.map(([x, y, l]) => chemin(`M${x - l / 2 - 1} ${y} Q${x} ${y - l * .5} ${x + l / 2 + 1} ${y} Q${x} ${y + l * .22} ${x - l / 2 - 1} ${y} Z`, peauPaupiere)).join('');
    const encreKo = style === 'sceau' ? '#E2B33C' : '#2A1A12';
    const [bx, by, bl] = p.bouche, [fx, fy] = p.front;
    const ko = p.yeux.map(([x, y, l]) => chemin(`M${x - l / 2} ${y} Q${x} ${y + l * .32} ${x + l / 2} ${y}`, { fill: 'none', stroke: encreKo, 'stroke-width': 3 })).join('')
      + chemin(`M${bx - bl / 3} ${by + 1} Q${bx} ${by + 6} ${bx + bl / 3} ${by + 1}`, { fill: 'none', stroke: encreKo, 'stroke-width': 3 })
      + `<g transform="rotate(-18 ${fx} ${fy})">${chemin(`M${fx - 20} ${fy - 6} h40 a6 6 0 0 1 0 12 h-40 a6 6 0 0 1 0 -12 Z`, { fill: '#EFE4CF', stroke: encreKo, 'stroke-width': 2 })}`
      + chemin(`M${fx - 6} ${fy - 6} v12 M${fx + 6} ${fy - 6} v12`, { fill: 'none', stroke: '#C9B89A', 'stroke-width': 2 })
      + `<circle cx="${fx + 12}" cy="${fy}" r="2.5" fill="#B33A3A"/></g>`;
    const fond = style === 'vitrail'
      ? `<g stroke="${PLOMB}" stroke-width="5" fill-opacity=".92">
          <path d="M0 0 H300 V300 H0 Z" fill="${melange(c.fond, '#3A5E96', .5)}"/>
          <path d="M0 0 L150 0 L96 116 L0 70 Z" fill="${melange(c.fond, '#FFFFFF', .22)}"/><path d="M300 0 L150 0 L204 116 L300 70 Z" fill="${melange(c.fond, '#FFFFFF', .22)}"/>
          <path d="M0 70 L96 116 L46 300 L0 300 Z" fill="${melange(c.fond, '#000000', .1)}"/><path d="M300 70 L204 116 L254 300 L300 300 Z" fill="${melange(c.fond, '#000000', .1)}"/>
          <path d="M0 70 L40 30 M300 70 L260 30 M96 116 L60 180 M204 116 L240 180" fill="none"/></g>`
      : '';
    const lumiere = style === 'vitrail'
      ? `<defs><radialGradient id="dj-l${n}" cx="38%" cy="28%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient></defs>
         <rect width="300" height="300" fill="url(#dj-l${n})" style="mix-blend-mode:soft-light"/>`
      : '';
    const textes = (p.textes || []).map(([t, x, y, taille]) => `<text x="${x}" y="${y}" font-size="${taille}" fill="${style === 'sceau' ? '#E2B33C' : c.or}" font-weight="700">${t}</text>`).join('');
    return `<svg class="dj dj-${style}" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">${fond}
      <g class="dj-corps">${p.formes.map(forme).join('')}${textes}
        <g class="dj-ferme">${p.ferme.map(forme).join('')}</g>
        <g class="dj-ouvert">${p.ouvert.map(forme).join('')}</g>
        <g class="dj-paupieres">${paupieres}</g>
        <g class="dj-ko">${paupieres}${ko}</g></g>${lumiere}</svg>`;
  }

  return { svg, styles: Object.keys(PEINTS), persos: Object.keys(PERSOS) };
})();
