module.exports = class EditorPanel {

    constructor(model, parent) {

        this.canvas = document.getElementById('D3');

        this.node = document.createElement('div');
        this.node.className = 'editorPanel';
        this.node.id = model._id;

        this.nodeEntityEditor = document.createElement('div');
        this.nodeEntityEditor.className = 'editor entity hide';
        this.node.appendChild(this.nodeEntityEditor);

        this.nodeRoadeEditor = document.createElement('div');
        this.nodeRoadeEditor.className = 'editor road hide';
        this.node.appendChild(this.nodeRoadeEditor);

        this.nodeEraseEditor = document.createElement('div');
        this.nodeEraseEditor.className = 'editor hide';
        this.node.appendChild(this.nodeEraseEditor);

        const nodeEntityEditorConfirm = document.createElement('div');
        nodeEntityEditorConfirm.className = 'button confirm';
        nodeEntityEditorConfirm.textContent = 'ok';
        nodeEntityEditorConfirm.onclick = model._onConfirm.bind(model);
        this.nodeEntityEditor.appendChild(nodeEntityEditorConfirm);

        const nodeEntityEditorCancel = document.createElement('div');
        nodeEntityEditorCancel.className = 'button cancel';
        nodeEntityEditorCancel.textContent = 'cancel';
        nodeEntityEditorCancel.onclick = model._onCancel.bind(model);
        this.nodeEntityEditor.appendChild(nodeEntityEditorCancel);

        if(model._onRotate) {
            const nodeEntityEditorRotate = document.createElement('div');
            nodeEntityEditorRotate.className = 'button rotate';
            nodeEntityEditorRotate.textContent = 'rotate';
            nodeEntityEditorRotate.onclick = model._onRotate.bind(model);
            this.nodeEntityEditor.appendChild(nodeEntityEditorRotate);
        }

        const nodeRoadeEditorConfirm = document.createElement('div');
        nodeRoadeEditorConfirm.className = 'button confirm';
        nodeRoadeEditorConfirm.textContent = 'ok';
        nodeRoadeEditorConfirm.onclick = model._onConfirm.bind(model);
        this.nodeRoadeEditor.appendChild(nodeRoadeEditorConfirm);

        const nodeRoadeEditorCancel = document.createElement('div');
        nodeRoadeEditorCancel.className = 'button cancel';
        nodeRoadeEditorCancel.textContent = 'cancel';
        nodeRoadeEditorCancel.onclick = model._onCancel.bind(model);
        this.nodeRoadeEditor.appendChild(nodeRoadeEditorCancel);

        const nodeEraseEditorConfirm = document.createElement('div');
        nodeEraseEditorConfirm.className = 'button confirm';
        nodeEraseEditorConfirm.textContent = 'ok';
        nodeEraseEditorConfirm.onclick = model._onConfirm.bind(model);
        this.nodeEraseEditor.appendChild(nodeEraseEditorConfirm);

        this.updateState(model);
        this.add(parent);

    }

    updateState(model) {
        this.hideNode(this.node);
        this.hideNode(this.nodeEntityEditor);
        this.hideNode(this.nodeRoadeEditor);
        this.hideNode(this.nodeEraseEditor);
        if(model.entityEditor) {
            this.showNode(this.nodeEntityEditor);
            this.nodeEntityEditor.style.transform = 'translate(@xpx, @ypx)'.replace('@x', model.position.x).replace('@y', model.position.y);
        }

        if(model.roadeEditor) {
            this.showNode(this.nodeRoadeEditor);
            this.nodeEntityEditor.style.transform = 'translate(@xpx, @ypx)'.replace('@x', model.position.x).replace('@y', model.position.y);
        }

        if(model.eraseEditor) {
            this.showNode(this.nodeEraseEditor);
        }

        if(model.displayed) {
            this.showNode(this.node);
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


    add(parent) {
        parent.dom.appendChild(this.node);
    }

    remove(parent) {
        parent.dom.removeChild(this.node);
    }
};
