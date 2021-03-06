const stateManager = require('../../../services/stateManager');
const wording = require('../../../Data/wording');

module.exports = class MonitoringPanelPC {

    constructor(model, parent) {
        this.model = model;

        this.node = document.createElement('div');
        this.node.className = 'monitoringPanel';
        this.node.id = model._id;

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

        for (let i = 0; i < model.previewes.length; i++) {
            const id = model.previewes[i];
            const node = this.createItem(id);
            this.nodePreviewItems.push(node);
            this.nodePreviewContainer.appendChild(node);
        }

        this.nodeButtonOpen = document.createElement('div');
        this.nodeButtonOpen.className = 'button open';
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

        this.nodePreview = document.createElement('div');
        this.nodePreview.className = 'preview';
        this.nodeMonitoringPanel.appendChild(this.nodePreview);


        const nodeHeaderResources = document.createElement('div');
        nodeHeaderResources.className = 'header resources';
        nodeHeaderResources.textContent = wording('Resources');
        this.nodeMonitoringPanel.appendChild(nodeHeaderResources);
        this.nodeListResource = document.createElement('div');
        this.nodeListResource.className = 'list resources';
        this.nodeMonitoringPanel.appendChild(this.nodeListResource);

        const nodeHeaderSociety = document.createElement('div');
        nodeHeaderSociety.className = 'header society';
        nodeHeaderSociety.textContent = wording('Society');
        this.nodeMonitoringPanel.appendChild(nodeHeaderSociety);
        this.nodeListSociety = document.createElement('div');
        this.nodeListSociety.className = 'list society';
        this.nodeMonitoringPanel.appendChild(this.nodeListSociety);

        this.nodeCityName = document.createElement('div');
        this.nodeCityName.className = 'cityName';
        this.nodeMonitoringPanel.appendChild(this.nodeCityName);

        this.nodeCityLevel = document.createElement('div');
        this.nodeCityLevel.className = 'cityLevel';
        this.nodeMonitoringPanel.appendChild(this.nodeCityLevel);

        this.nodeGoalList = document.createElement('div');
        this.nodeGoalList.className = 'goalList';
        this.nodeMonitoringPanel.appendChild(this.nodeGoalList);

        this.updateState(model);
        this.add(parent);
    }

    updateDataCity(model) {
        this.nodeCityName.textContent = wording('cityName').replace('@1', model.cityName);
        this.nodeCityLevel.textContent = wording('cityLevel').replace('@1', model.cityLevel);
    }

    updateMonioringList() {
        const states = stateManager.currentCity.states;
        const trade = stateManager.currentCity.trade;

        this.nodeListResource.style.display = 'none';
        while (this.nodeListResource.firstChild) {
            this.nodeListResource.removeChild(this.nodeListResource.firstChild);
        }

        const headerQuatity = document.createElement('div');
        headerQuatity.className = 'headerQuatity';
        headerQuatity.textContent  = wording('quantity');
        this.nodeListResource.appendChild(headerQuatity);

        const headerImport = document.createElement('div');
        headerImport.className = 'headerImport';
        headerImport.textContent  = wording('barter');
        this.nodeListResource.appendChild(headerImport);

        for (let i = 0; i < this.model.resources.length; i++) {
            const id = this.model.resources[i];
            const node = this.createItemRessource(id, states[id], trade[id]);
            this.nodeListResource.appendChild(node);
        }
        this.nodeListResource.style.display = 'block';


        this.nodeListSociety.style.display = 'none';
        while (this.nodeListSociety.firstChild) {
            this.nodeListSociety.removeChild(this.nodeListSociety.firstChild);
        }
        for (let i = 0; i < this.model.society.length; i++) {
            const id = this.model.society[i];
            const node = this.createItem(id, states[id]);
            this.nodeListSociety.appendChild(node);
        }
        this.nodeListSociety.style.display = 'block';
    }

    updatePreview(model) {
        this.nodePreview.style.backgroundImage = model.urlPicture;
    }

    createItem(id, value) {
        const node = document.createElement('div');
        node.className = 'item';
        const nodePic = document.createElement('div');
        nodePic.className = 'icon ' + id;
        const nodeValue = document.createElement('div');
        nodeValue.className = 'value';
        nodeValue.textContent = value != undefined ? value : '';
        node.appendChild(nodePic);
        node.appendChild(nodeValue);
        return node;
    }

    createItemRessource(id, value, swap ) {
        const node = document.createElement('div');
        node.className = 'item';
        const nodePic = document.createElement('div');
        nodePic.className = 'icon ' + id;
        const nodeValue = document.createElement('div');
        nodeValue.className = 'value';
        nodeValue.textContent = value != undefined ? value : '';
        node.appendChild(nodePic);
        node.appendChild(nodeValue);

        const nodeBarter = document.createElement('div');
        nodeBarter.className = 'barter';
        if(swap.length === 0)
            nodeBarter.textContent = wording('barter');
        for(let i = 0; i < swap.length ; i++){
            const swapId = swap[i];
            const nodePic = document.createElement('div');
            nodePic.className = 'icon ' + swapId;
            nodeBarter.appendChild(nodePic);
        }
        nodeBarter.onclick = () => {
            this.barter(id, swap);
        };
        node.appendChild(nodeBarter);
        
        return node;
    }

    barter(id, swap){
        const trade = stateManager.currentCity.trade;

        const manageTradNode = document.createElement('div');
        manageTradNode.className = 'manageTrad';

        for(let tradeId in  trade) {
            if(id === tradeId) continue;
            const nodePic = document.createElement('div');
            const traded = swap.indexOf(tradeId) !== -1 ? ' traded': '';
            nodePic.className = 'icon ' + tradeId + traded;
            nodePic.onclick = ()=>{
                this.model.swap(id, tradeId);
                this.nodeMonitoringPanel.removeChild(manageTradNode); 
            }
            manageTradNode.appendChild(nodePic);
        }

        const close = document.createElement('div');
        close.className = 'icon close ';
        close.onclick = ()=>{
            this.nodeMonitoringPanel.removeChild(manageTradNode); 
        }
        manageTradNode.appendChild(close);


        this.nodeMonitoringPanel.appendChild(manageTradNode);
    }



    updateGoalList(model) {
        while (this.nodeGoalList.firstChild) {
            this.nodeGoalList.removeChild(this.nodeGoalList.firstChild);
        }
         const states = stateManager.currentCity.states;

        const nodeHeader = document.createElement('div');
        nodeHeader.className = 'goalHeader'; 
        nodeHeader.textContent = wording('goal');
        this.nodeGoalList.appendChild(nodeHeader);

        for(let id in model.goal ){
            const node = document.createElement('div');
            node.className = 'item';
            const nodePic = document.createElement('div');
            nodePic.className = 'icon '+id;
            const nodeValue = document.createElement('div');
            nodeValue.className = 'value';
            nodeValue.textContent = states[id] + '/' + model.goal[id];
            node.appendChild(nodePic);
            node.appendChild(nodeValue);
            this.nodeGoalList.appendChild(node);
        }

    }

    updateState(model) {

        if (model.opened) {
            this.showNode(this.nodeMonitoringContainer);
            this.hideNode(this.nodeButtonOpen);
            this.updateMonioringList(model);
            this.updateDataCity(model);
            this.updatePreview(model);
            this.updateGoalList(model);
        } else {
            this.hideNode(this.nodeMonitoringContainer);
            this.showNode(this.nodeButtonOpen);
        }

        const states = stateManager.currentCity.states;
        for (let i = 0; i < model.previewes.length; i++) {
            const node = this.nodePreviewItems[i];
            node.lastChild.textContent = states[model.previewes[i]];
        }

    }

    showNode(node) {
        const index = node.className.indexOf('hide');
        if (index !== -1) {
            node.className = node.className.replace(' hide', '');
        }
    }

    hideNode(node) {
        if (node.className.indexOf('hide') === -1) {
            node.className += ' hide';
        }
    }

    add(parent) {
        parent.dom.appendChild(this.node);
    }

    remove(parent) {
        parent.dom.removeChild(this.node);
    }
};