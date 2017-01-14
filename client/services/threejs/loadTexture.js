const THREE = require('three');
let canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
let ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.rect(0, 0, 16, 16);
ctx.fillStyle = 'black';
ctx.fill();
const textureLoader = new THREE.TextureLoader();
THREE.loadTexture = function loadTexture(path) {
    let texture;
    if(typeof path === 'string'){
        texture = textureLoader.load(path);
        texture.image = canvas;
    }else{
        texture = new THREE.Texture(path);//is canvas
    }
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //texture.anisotropy = 1;
    texture.flipY = false;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.needsUpdate = true;
    return texture;
};
