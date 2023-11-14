import * as THREE from 'three';

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

//scene.fog = new THREE.Fog( 0xcccccc, 0, 15 );


/* const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

 */

const textureLoader = new THREE.TextureLoader()
const groundTextureHeight = textureLoader.load('/assets/img/textures/ground/height.png')
groundTextureHeight.wrapS = THREE.RepeatWrapping;
groundTextureHeight.wrapT = THREE.RepeatWrapping;


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

/* const leftRockGeo = new THREE.BoxGeometry( 0.7, 8, 0.2 );
const leftRockMat = new THREE.MeshBasicMaterial( { 
    transparent: true,
    color: 0xaa0000,
    //opacity: 0.5
} );
const leftRock = new THREE.Mesh( leftRockGeo, leftRockMat );
leftRock.position.set(-7, 3.1, -4)
scene.add( leftRock );

const rightRockGeo = new THREE.BoxGeometry( 0.7, 8, 0.2 );
const rightRockMat = new THREE.MeshBasicMaterial( { 
    transparent: true,
    color: 0xaa0000,
    //opacity: 0.5
} );
const rightRock = new THREE.Mesh( rightRockGeo, rightRockMat );
rightRock.position.set(-7, 0, -1)
scene.add( rightRock ); */



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
