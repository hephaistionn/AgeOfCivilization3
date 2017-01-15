const THREE = require('../../../services/threejs');
const materialGround = require('./../Material/materialGround');
const materialWater = require('./../Material/materialWater');
const materialBorder = require('./../Material/materialBorder');
const ee = require('../../../services/eventEmitter');

module.exports = Map=> {

    Map.prototype.createGround = function createGround(model) {
        this.materialGround = materialGround;
        this.materialBorder = materialBorder;
        this.materialWater = materialWater;
        this.materialGround.uniforms.texture.value = THREE.loadTexture(model.canvasColor);
        this.materialGround.uniforms.textureSize.value = model.nbPointX * this.tileSize;
        this.materialBorder.uniforms.texture.value = THREE.loadTexture(model.canvasColor);
        this.materialBorder.uniforms.textureSize.value = model.nbPointX * this.tileSize;
        //this.materialGround = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe : true});

        this.chunkMesh = this.drawChunkMesh(model.nbTileX, model.nbTileZ, model);
        this.waterMesh = this.drawWaterMesh(model);
        this.borderMesh = this.drawBorderMesh(model);

        this.element.add(this.chunkMesh);
        this.element.add(this.waterMesh);
        this.element.add(this.borderMesh);

        this.clickableArea = [this.chunkMesh];
    };

    Map.prototype.drawWaterMesh = function drawWater(model) {
        const heightWater = 3;
        if(this.chunkMesh.geometry.boundingBox.min.y <= heightWater) {

            const sizeX = this.tileSize * model.nbTileX - 0.3;
            const sizeZ = this.tileSize * model.nbTileZ - 0.3;
            const sizeY = 6;

            const waterGeometry = new THREE.BufferGeometry();
            const vertices = new Float32Array([
                0, 0, 0, 0, 0, sizeZ, sizeX, 0, sizeZ,
                sizeX, 0, sizeZ, sizeX, 0, 0, 0, 0, 0,
                0, 0, sizeZ, 0, -sizeY, sizeZ, sizeX, -sizeY, sizeZ,
                sizeX, -sizeY, sizeZ, sizeX, 0, sizeZ, 0, 0, sizeZ,
                sizeX, 0, 0, sizeX, 0, sizeZ, sizeX, -sizeY, sizeZ,
                sizeX, -sizeY, sizeZ, sizeX, -sizeY, 0, sizeX, 0, 0
            ]);
            const lighting = new Float32Array([
                1, 1, 1, 1, 1, 1, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6
            ]);
            waterGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            waterGeometry.addAttribute('lighting', new THREE.BufferAttribute(lighting, 1));

            const waterMesh = new THREE.Mesh(waterGeometry, this.materialWater);
            waterMesh.position.set(0, heightWater, 0);
            waterMesh.updateMatrix();
            waterMesh.updateMatrixWorld();
            waterMesh.matrixAutoUpdate = false;
            waterMesh.matrixWorldNeedsUpdate = false;
            waterMesh.name = 'water';
            return waterMesh;
        } else {
            const waterMesh = new THREE.Object3D();
            waterMesh.matrixAutoUpdate = false;
            waterMesh.name = 'water.';
            return waterMesh;
        }
    };

    Map.prototype.drawChunkMesh = function drawChunkMesh(nbXTiles, nbZTiles, model) {
        const chunkGeo = this.createChunkGeo(nbXTiles, nbZTiles, model);
        chunkGeo.computeBoundingBox();
        const chunkMesh = new THREE.Mesh(chunkGeo, this.materialGround);
        chunkMesh.name = 'chunck';
        chunkMesh.matrixAutoUpdate = false;
        chunkMesh.matrixWorldNeedsUpdate = false;
        chunkMesh.receiveShadow = true;
        return chunkMesh;
    };

    Map.prototype.createChunkGeo = function createChunkGeo(nbXTiles, nbZTiles, model) {
        const xSize = nbXTiles * this.tileSize;
        const zSize = nbZTiles * this.tileSize;

        let chunkGeometry = new THREE.PlaneGeometry(xSize, zSize, nbXTiles, nbZTiles);

        const vertices = chunkGeometry.vertices;
        const length = vertices.length;
        for(let i = 0; i < length; i++) {
            let pointsHeights = model.pointsHeights[i];
            vertices[i].y = pointsHeights / 255 * this.tileHeight;
        }

         const modiferSimplify = new THREE.SimplifyModifier();
        chunkGeometry = modiferSimplify.modify( chunkGeometry,Math.round(chunkGeometry.vertices.length*0.33) );

        chunkGeometry.computeVertexNormals();
        return chunkGeometry;
    };

    Map.prototype.drawBorderMesh = function drawBorderMesh(model) {
        if(!this.borderMesh) { //can be redrawn
            this.borderMesh = this.createBorderMesh(model);
        }

        const borderMesh = this.borderMesh;
        const nbX = model.nbPointX;
        const nbZ = model.nbPointZ;
        const nbXm = nbX-1;
        const nbZm = nbZ-1;
        const topLeft = new Float32Array(nbX * 3);
        const topRight = new Float32Array(nbZ * 3);
        const heightFactor = this.tileHeight/255;
        let i;

        //compute border left
        let offset = nbX * (nbZ - 1 );
        for(i = 0; i < nbX; i++) {
            topLeft[i * 3] = i*this.tileSize;      //x
            topLeft[i * 3 + 1] = model.pointsHeights[offset+i] * heightFactor;  //y
            topLeft[i * 3 + 2] = nbZm*this.tileSize;  //z
        }
        //compute border right
        for(i = 0; i < nbZ; i++) {
            topRight[i * 3] = nbXm*this.tileSize;     //x
            topRight[i * 3 + 1] = model.pointsHeights[((nbZ-i) * nbX - 1)]* heightFactor;  //y
            topRight[i * 3 + 2] = (nbZm - i)*this.tileSize;  //z
        }

        let x, y, z;
        let pos = borderMesh.geometry.attributes.position.array;
        let col = borderMesh.geometry.attributes.color.array;
        let indice = borderMesh.geometry.index.array;

        //compute vertices
        for(i = 0; i < nbX; i++) {
            x = topLeft[i * 3];
            y = topLeft[i * 3 + 1];
            z = topLeft[i * 3 + 2];

            //compute column
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
            col[i ] = 0;

            pos[i * 3 + nbX * 3] = x;
            pos[i * 3 + nbX * 3 + 1] = y - 2;
            pos[i * 3 + nbX * 3 + 2] = z;
            col[i + nbX ] = 1;


            pos[i * 3 + nbX * 6] = x;
            pos[i * 3 + nbX * 6 + 1] = -10;
            pos[i * 3 + nbX * 6 + 2] = z;
            col[i  + nbX * 2] = 1;

        }

        const offsetX = 3 * (nbX) * 3;
        const offsetX1 = 3 * (nbX);

        for(i = 0; i < nbZ; i++) {
            x = topRight[i * 3];
            y = topRight[i * 3 + 1];
            z = topRight[i * 3 + 2];

            //compute column
            pos[offsetX + i * 3] = x;
            pos[offsetX + i * 3 + 1] = y;
            pos[offsetX + i * 3 + 2] = z;
            col[offsetX1 + i ] = 0;


            pos[offsetX + i * 3 + nbX * 3] = x;
            pos[offsetX + i * 3 + nbX * 3 + 1] = y - 2;
            pos[offsetX + i * 3 + nbX * 3 + 2] = z;
            col[offsetX1 + i + nbX] = -1;


            pos[offsetX + i * 3 + nbX * 6] = x;
            pos[offsetX + i * 3 + nbX * 6 + 1] = -10;
            pos[offsetX + i * 3 + nbX * 6 + 2] = z;
            col[offsetX1 + i + nbX * 2] = -1;

        }

        //compute indice
        let ctn = 0;
        for(i = 0; i < nbX - 1; i++) {
            for(let j = 0; j < 2; j++) {
                indice[ctn++] = i + nbX * j;
                indice[ctn++] = i + nbX + nbX * j;
                indice[ctn++] = i + 1 + nbX * j;
                indice[ctn++] = i + nbX + nbX * j;
                indice[ctn++] = i + 1 + nbX + nbX * j;
                indice[ctn++] = i + 1 + nbX * j;
            }
        }

        const offsetIndex = (nbX) * 3;
        for(i = 0; i < nbZ - 1; i++) {
            for(let j = 0; j < 2; j++) {
                indice[ctn++] = offsetIndex + i + nbX * j;
                indice[ctn++] = offsetIndex + i + nbX + nbX * j;
                indice[ctn++] = offsetIndex + i + 1 + nbX * j;
                indice[ctn++] = offsetIndex + i + nbX + nbX * j;
                indice[ctn++] = offsetIndex + i + 1 + nbX + nbX * j;
                indice[ctn++] = offsetIndex + i + 1 + nbX * j;
            }
        }

        borderMesh.geometry.setDrawRange(0, ctn);
        borderMesh.geometry.attributes.position.needsUpdate = true;
        borderMesh.geometry.attributes.color.needsUpdate = true;
        borderMesh.geometry.index.needsUpdate = true;
        return borderMesh;
    };

    Map.prototype.createBorderMesh = function createBorderMesh(model) {
        const nbX = model.nbPointX;
        const nbZ = model.nbPointZ;
        const size = (nbX + nbZ) * 3; //3 level of vertices;

        const geometry = new THREE.BufferGeometry();

        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(size * 3), 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(size), 1));
        geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(size * 4), 1));

        const mesh = new THREE.Mesh(geometry, this.materialBorder);

        mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false;
        mesh.matrixWorldNeedsUpdate = false;
        this.element.add(mesh);

        return mesh;
    };

    Map.prototype.refreshTexture = function refreshTexture(model) {
        this.materialGround.uniforms.texture.value = THREE.loadTexture(model.canvasColor);
        this.materialGround.uniforms.textureSize.value = model.nbPointX * this.tileSize;
        this.materialBorder.uniforms.texture.value = THREE.loadTexture(model.canvasColor);
        this.materialBorder.uniforms.textureSize.value = model.nbPointX * this.tileSize;
    };

};
