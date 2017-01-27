const EntityCity = require('../Entity/Building/EntityCity');

module.exports = Worldmap=> {

    Worldmap.prototype.updateStateCities = function updateStateCities(model) {
        const citiesView = this.cities;
        const citiesModel = model.cities;

        let lengthModel = citiesModel.length;
        for(let i = 0; i < lengthModel; i++) {

            let cityView = citiesView[i];
            let cityModel = citiesModel[i];
            if(!cityView) {
                let newCityView = new EntityCity(cityModel);
                citiesView[i] = newCityView;
                this.element.add(newCityView.element);

            } else if(cityView.model !== cityModel) {
                citiesView.splice(i, 1);
                cityView.waterMesh.parent.remove(cityView.element);
                i--;
            }
        }

        let lengthView = citiesView.length;
        if(lengthView > lengthModel) {
            for(let i = lengthModel; i < lengthView; i++) {
                cityView = citiesView[i];
                cityView.waterMesh.parent.remove(cityView.element);
            }
            citiesView.splice(lengthModel, lengthView);
        }
    };

    Worldmap.prototype.updateStateOfOneCities = function updateStateOfOneCities(model) {
        const view = this.cities.find(view => view.model === model);
        view.updateState();
    };
};
