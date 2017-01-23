const Entity = require('../Entity.js');
const ee = require('../../../../services/eventEmitter');
const stateManager = require('../../../../services/stateManager');

class EntityChurch extends Entity {

    constructor(params) {
        super(params);
        this.power = params.power || 0;
        this._cycle = params._cycle || 2000;
        this.timer = params.timer || 0;
        this.workers = params.workers || 0;
        this.workplaces = params.workplaces || 2;
    }

    update() {
        this.power += 1;
        if(this.power === 2) {
            ee.emit('newEntity', {
                entityId: 'EntityPeon',
                power: 5,
                x: this.x,
                y: this.y,
                z: this.z,
                a: 0,
                map: null,
                tragetEntityId: 'EntityHouse',
                source: this
            });
            this.power = 0;
        }
    }

    onConstruct() {

    }
}

EntityChurch.selectable = true;
EntityChurch.description = 'This building increase the prosperity of your city';
EntityChurch.tile_x = 2;
EntityChurch.tile_z = 1;
EntityChurch.cost = {wood: 5, stone: 5};
EntityChurch.require = {population: 4, wood: 5, stone: 5};
EntityChurch.make = {workers:4,population:-4};
EntityChurch.walkable = false;
module.exports = EntityChurch;
