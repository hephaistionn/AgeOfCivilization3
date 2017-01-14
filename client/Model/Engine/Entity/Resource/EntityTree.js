const Entity = require('../Entity.js');

class EntityTree extends Entity {

    constructor(params) {
        super(params);
        this.wood = 100;
        this.exp = false;
    }

}
EntityTree.selectable = false;
EntityTree.tile_x = 1;
EntityTree.tile_z = 1;
EntityTree.walkable = false;
EntityTree.code = 255; //value in alpha blue
EntityTree.resource = true;
module.exports = EntityTree;
