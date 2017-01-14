const ee = require('./eventEmitter');
const Screen = require('./../View/Screen/Screen');
const PixelMap = require('./PixelMap');

class App {

    constructor() {

        this.models = {};
        this.model = null;
        this.modelInstances = {};
        this.viewInstances = {};
        this.params = {};
        this.currentScreenId = null;
        this.requestAnimation = null;
        this.pixelMap = new PixelMap();

        for(let i = 0; i < arguments.length; i++) {
            this.models[arguments[i].name] = arguments[i];
        }

        ee.on('mouseDown', this.mouseDown.bind(this));
        ee.on('mouseDownRight', this.mouseDownRight.bind(this));
        ee.on('mouseMovePress', this.mouseMovePress.bind(this));
        ee.on('mouseMove', this.mouseMove.bind(this));
        ee.on('mouseBorder', this.mouseBorder.bind(this));
        ee.on('mouseClick', this.mouseClick.bind(this));
        ee.on('mouseUp', this.mouseUp.bind(this));
        ee.on('keypress', this.keypress.bind(this));
        ee.on('mouseLeave', this.mouseLeave.bind(this));
        ee.on('mouseEnter', this.mouseEnter.bind(this));
        ee.on('mouseWheel', this.mouseWheel.bind(this));
        ee.on('mouseMoveOnMap', this.mouseMoveOnMap.bind(this));
        ee.on('mouseMoveOnMapPress', this.mouseMoveOnMapPress.bind(this));
        ee.on('mouseDownOnMap', this.mouseDownOnMap.bind(this));
        ee.on('mouseRotate', this.mouseRotate.bind(this));

        ee.on('newEntity', this.newEntity.bind(this));
        ee.on('removeEntity', this.removeEntity.bind(this));

        ee.on('touchStart', this.touchStart.bind(this));
        ee.on('touchEnd', this.touchEnd.bind(this));
        ee.on('touchCancel', this.touchCancel.bind(this));
        ee.on('touchleave', this.touchleave.bind(this));
        ee.on('touchMove', this.touchMove.bind(this));
        ee.on('touchMoveOnMap', this.touchMoveOnMap.bind(this));
        ee.on('touchStartOnMap', this.touchStartOnMap.bind(this));
        ee.on('touchDragg', this.touchDragg.bind(this));
        ee.on('zoom', this.zoom.bind(this));

        window.addEventListener('beforeunload', this.exit.bind(this));
    }

    closeScreen(id) {
        this._stop();
        this.viewInstances[id].dismount(this.modelInstances[id]);
        this.modelInstances[id].dismount();
        delete this.modelInstances[id];
        delete this.viewInstances[id];
        delete this.params[id];
        this.model = null;
        this.view = null;
        this.currentScreenId = null;
    }

    openScreen(id, params) {
        this._stop();
        if(this.model) {
            this.hideScreen();
        }

        if(this.modelInstances[id]) {
            if(!params || this.params[id] === params) {
                this.displayScreen(id);
                this._start();
            } else {
                this.closeScreen(id);
                this.createScreen(id, params, this._start.bind(this));
            }
        } else {
            this.createScreen(id, params, this._start.bind(this));
        }
        this.currentScreenId = id;
    }

    displayScreen(id) {
        this.model = this.modelInstances[id];
        this.view = this.viewInstances[id];
        this.view.show(this.model);
    }

    hideScreen() {

        this.view.hide(this.model);
    }

    getCurrentScreen(){
        return this.model;
    }

    getCurrentScreenId(){
        return this.currentScreenId;
    }

    exit() {
        ee.emit('exit');
    }

    createScreen(id, params, cb) {
        params.mapId = 'test';
        const mapPath = 'map/'+params.mapId+'.png';
        this.pixelMap.compute(mapPath, (dataMap)=> {
            this.modelInstances[id] = new this.models[id](params, dataMap);
            this.params[id] = params;
            this.viewInstances[id] = new Screen();
            this.model = this.modelInstances[id];
            this.view = this.viewInstances[id];
            this.view.mount(this.model);
            cb();
        });
    }

    _start() {
        const that = this;
        let time;
        var update = function update() {
            that.requestAnimation = requestAnimationFrame(update);
            const now = new Date().getTime();
            const dt = now - (time || now);
            time = now;
            Math.min(dt, 500);
            that._update(dt);
        };

        update();
    }

    _stop() {
        cancelAnimationFrame(this.requestAnimation);
    }

    _update(dt) {
        this.model.update(dt);
        this.view.update(dt, this.model);
    }

    mouseDown(x, z) {
        if(this.model.mouseDown)
            this.model.mouseDown(x, z);
    }


    mouseDownRight(x, z) {
        if(this.model.mouseDownRight)
            this.model.mouseDownRight(x, z);
    }

    mouseClick(x, z, model) {
        if(this.model.mouseClick)
            this.model.mouseClick(x, z, model);
    }

    mouseUp(x, z) {
        if(this.model.mouseUp)
            this.model.mouseUp(x, z);
    }

    keypress(code) {
        if(this.model.keypress)
            this.model.keypress(code);
    }

    mouseLeave(dx, dy) {
        if(this.model.mouseLeave)
            this.model.mouseLeave(dx, dy);
    }

    mouseEnter(dx, dy) {
        if(this.model.mouseEnter)
            this.model.mouseEnter(dx, dy);
    }

    mouseRotate() {
        if(this.model.mouseRotate)
            this.model.mouseRotate();
    }

    mouseMovePress(x, z) {
        if(this.model.mouseMovePress)
            this.model.mouseMovePress(x, z);
    }

    mouseMove(x, z) {
        if(this.model.mouseMove)
            this.model.mouseMove(x, z);
    }

    mouseBorder(x, z) {
        if(this.model.mouseBorder)
            this.model.mouseBorder(x, z);
    }

    mouseWheel(delta) {
        if(this.model.mouseWheel)
            this.model.mouseWheel(delta);
    }

    mouseMoveOnMap(x, z) {
        if(this.model.mouseMoveOnMap)
            this.model.mouseMoveOnMap(x, z);
    }

    mouseMoveOnMapPress(x, z) {
        if(this.model.mouseMoveOnMapPress)
            this.model.mouseMoveOnMapPress(x, z);
    }

    mouseDownOnMap(x, z) {
        if(this.model.mouseDownOnMap)
            this.model.mouseDownOnMap(x, z);
    }

    newEntity(config) {
        if(this.model.newEntity)
            this.model.newEntity(config);
    }

    removeEntity(entity) {
        if(this.model.removeEntity)
            this.model.removeEntity(entity);
    }

    touchStart(x, y) {
        if(this.model.touchStart)
            this.model.touchStart(x, y);
    }

    touchEnd(x, y) {
        if(this.model.touchEnd)
            this.model.touchEnd(x, y);
    }

    touchCancel(x, y) {
        if(this.model.touchCancel)
            this.model.touchCancel(x, y);
    }

    touchleave(x, y) {
        if(this.model.touchleave)
            this.model.touchleave(x, y);
    }

    touchMove(x, y) {
        if(this.model.touchMove)
            this.model.touchMove(x, y);
    }

    touchMoveOnMap(x, y) {
        if(this.model.touchMoveOnMap)
            this.model.touchMoveOnMap(x, y);
    }

    touchDragg(x, y, screenX, screenY) {
        if(this.model.touchDragg)
            this.model.touchDragg(x, y, screenX, screenY);
    }

    touchStartOnMap(x, y, model) {
        if(this.model.touchStartOnMap)
            this.model.touchStartOnMap(x, y, model);
    }

    zoom(delta) {
        if(this.model.zoom)
            this.model.zoom(delta);
    }

}

module.exports = App;
