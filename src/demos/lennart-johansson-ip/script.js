import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    2000 // Far clipping plane
);
camera.position.set(-1, 2, 9)
const renderer = new THREE.WebGLRenderer({antialiasing:true});

renderer.setPixelRatio( window.devicePixelRatio * 1.5 )
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true; // Enable shadow maps on the renderer
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: for soft shadows
// Create a large sphere to simulate the sky
const skyGeometry = new THREE.SphereGeometry(1500, 32, 32);
const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
        topColor: { value: new THREE.Color(0x87CEEB) }, // Sky blue
        bottomColor: { value: new THREE.Color(0xFFFFFF) }, // White at the horizon
        offset: { value: 33 },
        exponent: { value: 0.6 }
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(h, exponent), 0.0)), 1.0);
        }
    `,
    side: THREE.BackSide // Render the inside of the sphere
});

// Add the sphere to the scene
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

const color = 0xFFFFFF;
const intensity = 2;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

const intensity2 = 1;
const light2 = new THREE.DirectionalLight(color, intensity2);
light2.position.set(0, 10, 0);
light2.target.position.set(-5, 0, 0);
scene.add(light2);
scene.add(light2.target);


const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const loader = new GLTFLoader();
// Load a glTF resource
loader.load('./ulriks-ip.glb', function ( gltf ) {
        scene.add( gltf.scene );
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
    },
    // called while loading is progressing
    function ( xhr ) {},
    // called when loading has errors
    function ( error ) { console.log( 'An error happened' ); }
);

// Optional: Animate camera movement to simulate walking through
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Start the animation
animate();



