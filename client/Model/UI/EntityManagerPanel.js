const ee = require('../../services/eventEmitter');
const stateManager = require('../../services/stateManager');
const wording = require('../../Data/wording');

class EntityManagerPanel {

    constructor() {
        this.opened = false;
        this.yourCity = false;
        this.title = '';
        this.description = '';
        this.currentEntity = null;
        this.updated = false;
        this.urlPicture = '';
        this.data = null;
        this._onBuild = null;
        this._onRemove = null; 
        this._id = 0;
    }

    open(entity) {
        if(!entity || !entity.constructor.selectable) return; 
        this.description = wording(entity.desc) || wording(entity.constructor.description);
        if(entity.onAction) {
            this.currentAction = entity.onAction.bind(entity);
        } else {
            this.currentAction = null;
        }
        this.actionLabel = entity.constructor.actionLabel;
        this.opened = true;
        this.yourCity = entity.leader === stateManager.getCurrentLeader().id;
        this.goal = entity.goal;
        this.isRemovable = entity.constructor.entity && !entity.constructor.resource;
        this.title = wording(entity.constructor.name);
        this.urlPicture = 'url("pic/entities/@x@y.jpg")';
        this.urlPicture = this.urlPicture.replace('@x', entity.constructor.name).toLowerCase();
        this.urlPicture = this.urlPicture.replace('@y', entity.level !== undefined ? entity.level : '');
        this.data = entity.getData ? entity.getData() : null;
        this.currentEntity = entity;
        this.updated = true;
    }

    close() {
        this.description = '';
        this.opened = false;
        this.currentEntity = null;
        this.title = '';
        this.isRemovable = false;
        this.updated = true;
    }

    remove() {
        this._onRemove(this.currentEntity._id);
        this.close();
    }

    onRemove(fct) {
        this._onRemove = fct;
    }

    onActionHandler() {
        if(this.currentAction) {
            const entityId = this.currentAction();
            if(entityId) this._onBuild(entityId);
        }
    }

    onBuild(fct) {
        this._onBuild = fct;
    }

    visit() {
        const cityId = this.currentEntity.cityId;
        const model = stateManager.getCity(cityId);
        stateManager.setCurrentCity(model);
        this.close();
        ee.emit('openScreen', 'ScreenCity', model);
    }

}

EntityManagerPanel.ui = true;
module.exports = EntityManagerPanel;