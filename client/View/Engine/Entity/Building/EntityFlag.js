const config = require('../../config');
const tileSize = config.tileSize;
const tileHeight = config.tileHeight;
const material = require('../../Material/materialA');
const THREE = require('three');

module.exports = class EntityFlag {

    constructor(model, materialForce) {
        this.model = model;
        this.element = THREE.getMesh('obj/buildingA.obj', materialForce||material);
        this.element.userData.model = model;
        this.element.userData.parent = this;
        this.element.frustumCulled = false;
        this.element.matrixAutoUpdate = false;

        this.updateState();
    }

    updateState() {
        const matrixWorld = this.element.matrixWorld.elements;
        matrixWorld[12] = this.model.x * tileSize;
        matrixWorld[14] = this.model.z * tileSize;
        matrixWorld[13] = this.model.y * tileHeight;
    }
};
