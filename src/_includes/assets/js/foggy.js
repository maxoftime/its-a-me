import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

// Setup
const scrollDistance = { x: 0, y: 0 }
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.05, 100 );
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
});


// Init
camera.position.z = 5;
camera.position.y = 2;
camera.lookAt = (0,1,0);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.classList.add('canvas-background');
document.body.appendChild( renderer.domElement );



// Content
/* const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 2   );
//hemiLight.color.setHSL( 0.6, 1, 0.6 );
//hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 100, 0 );
hemiLight.castShadow = true;
scene.add( hemiLight ); */


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { 
    transparent: true,
    color: 0x00ff00,
    opacity: 0.5
} );
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.receiveShadow = true;
//scene.add( cube );

const textureLoader = new THREE.TextureLoader()
//const groundTextureColor = textureLoader.load('/assets/img/textures/ground/baseColor.jpg')
const groundTextureHeight = textureLoader.load('/assets/img/textures/ground/height.png')
//const groundTextureRough = textureLoader.load('/assets/img/textures/ground/rough.jpg')

const groundGeo = new THREE.PlaneGeometry( 40, 10, 300, 160 );
const groundMat = new THREE.MeshStandardMaterial( {
    //map: groundTextureColor,
    displacementMap: groundTextureHeight,
    //roughness: groundTextureRough,
    wireframe: true,
    color: 0x4444444,
    transparent: true,
    opacity: 0.5
} );
const ground = new THREE.Mesh( groundGeo, groundMat );
ground.rotation.x = -1.3962634;
ground.position.y = -1;
cube.castShadow = true;
cube.receiveShadow = true;
scene.add( ground );


// Render
function render() {
    requestAnimationFrame(render);

    if (scrollDistance.y !== window.scrollY) {
        scrollDistance.y = window.scrollY;
        cube.rotation.y = scrollDistance.y * 0.005;
       camera.position.y = 2 - scrollDistance.y * 0.005;
    }
    renderer.render( scene, camera );
}

render();
