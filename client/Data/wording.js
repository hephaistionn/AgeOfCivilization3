const codeCountry = 'fr';

locales = {
    fr: {
        wood: 'wood',
        stone: 'stone',
        meat: 'meat',
        population: 'population',
        'House': 'Hutte',
        'Market': 'March�',
        'WoodCutterHut': 'Cabane de bucheron',
        'Attic': 'Grenier',
        'Barrack': 'Caserne',
        'HunterHut': 'Cabane de chasseur',
        'LeaderHut': 'Hutte du chef',
        'Repository': 'Entrep�t',
        'StoneMine': 'Mine',
        'dirtRoad': 'Chemin de terre',
        'stoneRoad': 'Chemin de pierre',
        'Destroy': 'D�truire'
    }
};

module.exports = function wording(code) {
    return locales[codeCountry][code]
};