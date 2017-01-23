const stateManager = require('../../../services/stateManager');

module.exports = class MonitoringPanelPC {

    constructor(model) {
        this.model = model;

        this.type = 'UI';

        this.node = document.createElement('div');
        this.node.className = 'monitoringPanel pc';

        this.nodePreviewContainer = document.createElement('div');
        this.nodePreviewContainer.className = 'previewContainer';
        this.node.appendChild(this.nodePreviewContainer);

        this.nodeMonitoringContainer = document.createElement('div');
        this.nodeMonitoringContainer.className = 'monitoringContainer nodeOverlay';
        this.node.appendChild(this.nodeMonitoringContainer);

        this.nodeMonitoringPanel = document.createElement('div');
        this.nodeMonitoringPanel.className = 'panel';
        this.nodeMonitoringContainer.appendChild(this.nodeMonitoringPanel);

        this.nodePreviewItems = [];

        for(let i = 0; i < model.previewes.length; i++) {
            const id = model.previewes[i];
            const node = this.createItem(id);
            this.nodePreviewItems.push(node);
            this.nodePreviewContainer.appendChild(node);
        }

        this.nodeButtonOpen = document.createElement('div');
        this.nodeButtonOpen.className = 'button open';
        this.nodeButtonOpen.textContent = 'monitoring';
        this.nodeButtonOpen.onclick = model.open.bind(model);
        this.node.appendChild(this.nodeButtonOpen);

        this.nodeButtonClose = document.createElement('div');
        this.nodeButtonClose.className = 'button close';
        this.nodeButtonClose.textContent = 'X';
        this.nodeButtonClose.onclick = model.close.bind(model);
        this.nodeMonitoringPanel.appendChild(this.nodeButtonClose);

        this.nodeButtonWorld = document.createElement('div');
        this.nodeButtonWorld.className = 'button world';
        this.nodeButtonWorld.textContent = 'Worldmap';
        this.nodeButtonWorld.onclick = model.goWorldmap.bind(model);
        this.nodeMonitoringPanel.appendChild(this.nodeButtonWorld);

        this.updateState(model);
    }

    createItem(id) {
        const node = document.createElement('div');
        node.className = 'item';
        const nodePic = document.createElement('div');
        nodePic.className = 'picto id';
        const nodeName = document.createElement('div');
        nodeName.className = 'name';
        nodeName.textContent = id;
        const nodeValue = document.createElement('div');
        nodeValue.className = 'value';
        node.appendChild(nodePic);
        node.appendChild(nodeName);
        node.appendChild(nodeValue);
        return node;
    }


    updateState(model) {

        if(model.opened) {
            this.showNode(this.nodeMonitoringContainer);
            this.hideNode(this.nodeButtonOpen);
        } else {
            this.hideNode(this.nodeMonitoringContainer);
            this.showNode(this.nodeButtonOpen);
        }

        const states = stateManager.currentCity.states;
        for(let i = 0; i < model.previewes.length; i++) {
            const node = this.nodePreviewItems[i];
            node.lastChild.textContent = states[model.previewes[i]];
        }

    }

    showNode(node) {
        const index = node.className.indexOf('hide');
        if(index !== -1) {
            node.className = node.className.replace(' hide', '');
        }
    }

    hideNode(node) {
        if(node.className.indexOf('hide') === -1) {
            node.className += ' hide';
        }
    }

    update() {
    }
};
