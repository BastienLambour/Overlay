/* =====================================================================
   PERSOS — le CATALOGUE COMMUN des personnages (fiches d'apparence : voir js/apparence.js pour tous les traits).
   Le même fichier dans tous les overlays : un personnage ajouté ici existe chez tout le monde, et chaque overlay
   le dessine à son style. Pour en ajouter un : le créateur de personnage (à venir) fabrique la fiche ; on la colle
   ici (dans _modele/js/persos.js), puis on recopie le fichier partout. Le nom doit être celui de CodexVTT.
   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/js/).
   ===================================================================== */
window.PERSOS = [
  // Exemple de démonstration (son apparence est à refaire avec le créateur)
  { id: 'xaieysi', nom: 'Xaieysi', titre: 'Exemple', couleur: '#5B6CFF',
    peau: '#EBD3C3', yeux: { couleur: '#9B5DE5', forme: 'amande', lueur: true },
    cheveux: { coupe: 'long', couleur: '#D9DCE6', meche: '#9B5DE5' }, oreilles: 'pointues',
    tenue: { type: 'cape', couleur: '#26305E', couleur2: '#C9B26A' }, accessoire: ['bandeau', 'boucles'], signe: 'tatouage', objet: 'baton' },
  // D'après les héros de Patagrain (js/heros.js : mêmes couleurs) — pour comparer les styles
  { id: 'patagrain', nom: 'Patagrain', titre: 'Maître du jeu', couleur: '#F5B82E',
    peau: '#F0C8A4', yeux: { couleur: '#86A08F', forme: 'rond' }, cheveux: { coupe: 'long', couleur: '#B98B58' }, oreilles: 'humaines',
    pilosite: { type: 'barbe', couleur: '#8F6540' }, tenue: { type: 'robe', couleur: '#2B4A7A', couleur2: '#F5B82E' }, accessoire: 'lunettes', objet: 'livre' },
  { id: 'kenai', nom: 'Kenai', titre: 'Le gardien aux ombres', couleur: '#C0743C', tete: 'orc',
    peau: '#7C8D3C', yeux: { couleur: '#2A1A06', forme: 'rond' }, cheveux: { coupe: 'chignon', couleur: '#1A1714' }, oreilles: 'pointues', dents: 'crocs',
    tenue: { type: 'armure', couleur: '#5A4632', couleur2: '#C0743C' }, objet: 'hache', objet2: 'bouclier' },
  { id: 'namerya', nom: 'Namerya', titre: 'L’ondine aux yeux d’océan', couleur: '#3FA7D6',
    peau: '#F1D6C8', yeux: { couleur: '#3AA2DD', forme: 'rond' }, cheveux: { coupe: 'long', couleur: '#1A1C26' }, oreilles: 'humaines',
    tenue: { type: 'robe', couleur: '#2C7DA0', couleur2: '#9FD8F0' }, signe: 'taches', objet: 'baton' },
  { id: 'zokhran', nom: 'Zokhran', titre: 'Poète de la marmite', couleur: '#D64545', tete: 'orc', carrure: 'large',
    peau: '#7FA34A', yeux: { couleur: '#6B4A22', forme: 'rond' }, cheveux: { coupe: 'herisse', couleur: '#1F1A17' }, oreilles: 'pointues',
    dents: 'defenses', pilosite: 'moustache', accessoire: 'toque',
    tenue: { type: 'tunique', couleur: '#8E3A2A', couleur2: '#E0B060' }, signe: 'cicatrice', objet: 'hachoir' },
  { id: 'trayss', nom: 'Trayss', titre: 'Héritage des brumes', couleur: '#9B5DE5',
    peau: '#D6A684', yeux: { couleur: '#9B5DE5', forme: 'amande' }, cheveux: { coupe: 'queue', couleur: '#14151C', meche: '#9B5DE5' }, oreilles: 'humaines',
    tenue: { type: 'armure', couleur: '#3A2E52', couleur2: '#9B5DE5' }, accessoire: 'boucles', objet: 'arbalete',
    formes: {
      'Dragon': { tete: 'draconide', peau: '#7B4BC4', yeux: { couleur: '#C88BFF', forme: 'fendu', lueur: true }, cornes: 'arriere', dents: 'crocs', accessoire: '' },
      'Entre deux': { peau: '#8E70BC', cornes: 'petites', yeux: { couleur: '#E6D8FF', lueur: true } },
    } },
];
