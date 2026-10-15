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
