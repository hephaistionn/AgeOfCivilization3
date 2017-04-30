const ee = require('../../services/eventEmitter');
const THREE = require('../../services/threejs');

module.exports = Screen => {

    Screen.prototype.initObservers = function initObservers() {
        this.events.__touchStart = this._touchStart.bind(this);
        this.canvas.addEventListener('touchstart', this.events.__touchStart);
        this.events.__touchEnd = this._touchEnd.bind(this);
        this.canvas.addEventListener('touchend', this.events.__touchEnd);
        this.events.__touchCancel = this._touchCancel.bind(this);
        this.canvas.addEventListener('touchcancel', this.events.__touchCancel);
        this.events.__touchleave = this._touchleave.bind(this);
        this.canvas.addEventListener('touchleave', this.events.__touchleave);
        this.events.__touchMove = this._touchMove.bind(this);
        this.canvas.addEventListener('touchmove', this.events.__touchMove);
        this.events.__resize = this._resize.bind(this);
        window.addEventListener('resize', this.__resize, false);
        this.events.__selectingEntity = this._selectingEntity.bind(this);
        ee.on('selectingEntity', this.events.__selectingEntity);
        this.selected = false;
        this.startSpace = 0;
        this.timer = null;
    };

    Screen.prototype.removeObservers = function removeObservers() {
        this.canvas.removeEventListener('touchstart', this.events.__touchStart);
        this.canvas.removeEventListener('touchend', this.events.__touchEnd);
        this.canvas.removeEventListener('touchcancel', this.events.__touchCancel);
        this.canvas.removeEventListener('touchleave', this.events.__touchleave);
        this.canvas.removeEventListener('touchmove', this.events.__touchMove);
        ee.off('selectingEntity', this.events.__selectingEntity);
        window.removeEventListener('resize', this.events.__resize);
    };

    Screen.prototype._touchStart = function _touchStart(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        let point = this.getPointOnMapCameraRelative(touch.clientX, touch.clientY, false);
        if(!point) return;
        ee.emit('touchStart', point.x, point.z);
        this.selected = this.touchSelected(touch.clientX, touch.clientY);
        point = this.getPointOnMap(touch.clientX, touch.clientY, true);
        ee.emit('touchStartOnMap', point.x, point.z, point.id);
    };
    Screen.prototype._touchEnd = function _touchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        ee.emit('touchEnd', touch.clientX, touch.clientY);
        clearTimeout(this.timer);
        this.timer = setTimeout(()=> {
            this.startSpace = 0;
        }, 200);
        this.selected = false;
    };
    Screen.prototype._touchCancel = function _touchCancel(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        ee.emit('touchCancel', touch.clientX, touch.clientY);
    };
    Screen.prototype._touchleave = function _touchleave(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        ee.emit('touchleave', touch.clientX, touch.clientY);
    };
    Screen.prototype._touchMove = function _touchMove(e) {
        e.preventDefault();
        const touch1 = e.changedTouches[0];
        const touch2 = e.changedTouches[1];
        if(touch2) {
            const spaceX = touch1.clientX - touch2.clientX;
            const spaceY = touch1.clientY - touch1.clientY;
            const space = Math.sqrt(spaceX * spaceX + spaceY * spaceY);
            if(this.startSpace === 0) {
                this.startSpace = space;
            } else {
                ee.emit('zoom', (space - this.startSpace) / 200);
                this.projectSelected();
                return;
            }
        }

        if(this.startSpace !== 0) return;

        let point = this.getPointOnMap(touch1.clientX, touch1.clientY, false);
        if(!point) return;
        if(this.selected) {
            ee.emit('touchDragg', point.x, point.z, touch1.clientX, touch1.clientY);
            this.projectSelected();
        } else {
            ee.emit('touchMoveOnMap', point.x, point.z, false);
            point = this.getPointOnMapCameraRelative(touch1.clientX, touch1.clientY, false);
            ee.emit('touchMove', point.x, point.z);
            this.projectSelected();
        }
    };

    Screen.prototype._selectingEntity = function _selectingEntity() {
        this.projectSelected();
    };



};