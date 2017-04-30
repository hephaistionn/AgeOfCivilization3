const wording = require('../../../Data/wording');

module.exports = class BuildingMenu {

    constructor(model, parent) {
        this.model = model;

        this.node = document.createElement('div');
        this.node.className = 'buildingMenu pc';
        this.node.id = model._id;

        this.nodeCategoriesContainer = document.createElement('div');
        this.nodeCategoriesContainer.className = 'categoriesContainer';
        this.node.appendChild(this.nodeCategoriesContainer);

        this.buildingContainer = document.createElement('div');
        this.buildingContainer.className = 'buildingContainer';
        this.node.appendChild(this.buildingContainer);
        this.buildingContent = document.createElement('div');
        this.buildingContent.className = 'buildingContent';
        this.buildingContainer.appendChild(this.buildingContent);

        this.displayed = false;

        for(let categoryId in model.categories) {
            const nodeButtonCategory = document.createElement('div');
            nodeButtonCategory.className = 'item ' + categoryId;
            nodeButtonCategory.style.backgroundImage = ('url("pic/buttons/x.png")'.replace('x', categoryId).toLowerCase());
            nodeButtonCategory.onclick = this.onClickCategory.bind(this, categoryId);
            this.nodeCategoriesContainer.appendChild(nodeButtonCategory);
        }
        this.updateState(model);
        this.add(parent);
    }

    updateState(model) {

        /**if(this.displayed === true && this.displayed === model.displayed) {
            this.update
        }*/

        this.collapse(model.isCollapsed);

        model.displayed ? this.open() : this.close();

        if(model.currentCategory.length && model.displayed) {
            //if(this.displayed === model.displayed) { //avoid to redraw opened menu
            ///    this.updateCurrentCategory(model.currentCategory, model);
            //} else {
            this.computeCurrentCategory(model.currentCategory, model);
            //    this.displayed = true;
            ////}
        } else {
            this.displayed = false;
        }
    }

    computeCurrentCategory(modelBuildings, model) {

        while(this.buildingContent.firstChild) {
            this.buildingContent.removeChild(this.buildingContent.firstChild);
        }

        for(let i = 0; i < modelBuildings.length; i++) {
            const modelBuilding = modelBuildings[i];
            const id = modelBuilding.name;
            const nodeButtonBuilding = document.createElement('div');
            nodeButtonBuilding.className = 'item ' + id;
            if(model.currentFocus === id) {
                nodeButtonBuilding.className += ' focus';
            }
            nodeButtonBuilding.onclick = model._onClickBuilding.bind(model, id);


            const nodeName = document.createElement('div');
            nodeName.className += ' name';
            nodeName.textContent = wording(id);
            nodeButtonBuilding.appendChild(nodeName);

            const nodePreview = document.createElement('div');
            nodePreview.className += ' preview';
            nodePreview.style.backgroundImage = ('url("pic/entities/x.jpg")'.replace('x', id).toLowerCase());
            nodeButtonBuilding.appendChild(nodePreview);

            const nodeHelper = document.createElement('div');
            nodeHelper.className += ' helper';
            nodeHelper.textContent += '?';
            nodeHelper.onclick = event=> {
                event.stopPropagation();
                model._onClickHelp(id);
            }
            nodeButtonBuilding.appendChild(nodeHelper);

            const nodeResources = document.createElement('div');
            nodeResources.className += ' resources';
            for(let resourceId in modelBuilding.cost) {
                const nodeResource = document.createElement('div');
                nodeResource.className = 'resource';
                const nodeResourcePic = document.createElement('div');
                nodeResourcePic.className = 'icon ' + resourceId;
                const nodeResourceValue = document.createElement('div');
                nodeResourceValue.className = 'value';
                nodeResourceValue.textContent = modelBuilding.cost[resourceId];
                nodeResource.appendChild(nodeResourcePic);
                nodeResource.appendChild(nodeResourceValue);
                nodeResources.appendChild(nodeResource);
            }
            nodeButtonBuilding.appendChild(nodeResources);
            this.buildingContent.appendChild(nodeButtonBuilding);
        }
    }

    updateCurrentCategory(modelBuildings, model) {
        for(let i = 0; i < modelBuildings.length; i++) {
            const id = modelBuildings[i];
            if(this.buildingContainer.childNodes[i].className.indexOf(id) === -1) {
                const nodeButtonBuilding = document.createElement('div');
                nodeButtonBuilding.className = 'item ' + id;
                if(model.currentFocus === id) {
                    nodeButtonBuilding.className += ' focus';
                }
                nodeButtonBuilding.textContent = id;
                nodeButtonBuilding.onclick = model._onClickBuilding.bind(model, id);
                this.buildingContainer.insertBefore(nodeButtonBuilding, this.buildingContainer.childNodes[i]);
            }
        }
    }

    onClickCategory(categoryId) {
        this.model._onClickCategory(categoryId);
        this.selectCategory(categoryId);
    }

    selectCategory(categoryId) {
        const focus = ' focus';
        const empty = '';
        this.nodeCategoriesContainer.childNodes.forEach((node)=> {
            node.className = node.className.replace(focus, empty);
            if(node.className.indexOf(categoryId) !== -1) {
                node.className += ' focus';
            }
        });
    }

    blurCategory(categoryId) {
        const focus = ' focus';
        const empty = '';
        this.nodeCategoriesContainer.childNodes.forEach((node)=> {
            node.className = node.className.replace(focus, empty);
        });
    }

    collapse(collapsed) {
        if(collapsed) {
            this.node.className = 'buildingMenu pc collapse';
        } else {
            this.node.className = 'buildingMenu pc';
        }
    }

    open() {
        const index = this.node.className.indexOf('hide');
        if(index !== -1) {
            this.node.className = this.node.className.replace(' hide', '');
        }
    }

    close() {
        if(this.node.className.indexOf('hide') === -1) {
            this.node.className += ' hide';
        }
        this.blurCategory();
    }

    add(parent) {
        parent.dom.appendChild(this.node);
    }

    remove(parent) {
        parent.dom.removeChild(this.node);
    }
};
