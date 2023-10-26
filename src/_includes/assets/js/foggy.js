import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

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
//camera.lookAt = (0,1.5,0);

renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

renderer.domElement.classList.add('canvas-background');
document.body.appendChild( renderer.domElement );



// Content
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const sky = new Sky();
sky.scale.setScalar( 10 );

const skyUniforms = sky.material.uniforms;

skyUniforms[ 'turbidity' ].value = 0;
skyUniforms[ 'rayleigh' ].value = 0.01;
skyUniforms[ 'mieCoefficient' ].value = 0.005;
skyUniforms[ 'mieDirectionalG' ].value = 0.7;

const parameters = {
    rayleigh: 0,
    elevation: 2.25,
    azimuth: 198.77,
    turbidity: 2.3,
    exposure: 0.3,
    mieCoefficient: 0.005,
	mieDirectionalG: 0.5,
};

/* let sun = new THREE.Vector3(); const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
const theta = THREE.MathUtils.degToRad( parameters.azimuth );
sun.setFromSphericalCoords( 0.01, phi, theta );
sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
scene.add( sky );  */


const textureLoader = new THREE.TextureLoader()
const groundTextureColor = textureLoader.load('/assets/img/textures/ground/baseColor.jpg')
const groundTextureHeight = textureLoader.load('/assets/img/textures/ground/height.png')
groundTextureHeight.wrapS = THREE.RepeatWrapping;
groundTextureHeight.wrapT = THREE.RepeatWrapping;
//groundTextureHeight.repeat.set( 4, 4 );


const groundGeo = new THREE.PlaneGeometry( 40, 10, 100, 360 );
const groundMat = new THREE.MeshStandardMaterial( {
    displacementMap: groundTextureHeight,
    displacementScale: 2,
    //roughness: groundTextureHeight,
    wireframe: true,
    emissive: 0x333333,
    //emissiveMap: groundTextureColor,
    transparent: true,
    opacity: 0.5
} );
const ground = new THREE.Mesh( groundGeo, groundMat );
ground.rotation.x = -1.3962634;
ground.position.y = -2.5;
scene.add( ground );

const leftRockGeo = new THREE.BoxGeometry( 0.7, 8, 0.2 );
const leftRockMat = new THREE.MeshBasicMaterial( { 
    transparent: true,
    color: 0xaa0000,
    //opacity: 0.5
} );
const leftRock = new THREE.Mesh( leftRockGeo, leftRockMat );
leftRock.position.set(-7, 3.1, -4)
//scene.add( leftRock );



function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}


// Render
function render() {
    
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    
    if (scrollDistance.y !== window.scrollY) {
        //if (window.scrollY < 460) {
            scrollDistance.y = window.scrollY;
            //leftRock.rotation.y = scrollDistance.y * 0.005;
            camera.position.y = 2 - scrollDistance.y * 0.005;
            //groundTextureHeight.offset = new THREE.Vector2(0, scrollDistance.y / window.innerHeight * 0.1)

       // }
    }
    renderer.render( scene, camera );

    requestAnimationFrame(render);
}

render();
