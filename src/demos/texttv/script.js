let first = true;
let gyroA = 0;
let gyroB = 0;
let gyroG = 0;

// GET ALL PAGES
const url = 'https://www.svt.se/text-tv/'
const pages = Array.from({length: 900}, (_, i) => 100 + i);
const allImages = []
let actualImgCount = 0;

// Camera movement parameters
const movementSpeed = 0.10; // Speed of movement
const rotationSpeed = 0.02; // Speed of rotation
const cameraDirection = { forward: false, backward: false, left: false, right: false };

const textureLoader = new THREE.TextureLoader();

// Load the yellow brick road texture
const floorTexture = textureLoader.load('./ground.jpg');
floorTexture.repeat.set(10, 2000); // Adjust values for the number of repetitions along the X and Y axes

// Set the texture to tile across the floor
floorTexture.wrapS = THREE.RepeatWrapping; // Repeat in the X direction
floorTexture.wrapT = THREE.RepeatWrapping;

// Handle key presses
window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "ArrowUp": // Move forward
        case "KeyW":
            cameraDirection.forward = true;
            break;
        case "ArrowDown": // Move backward
        case "KeyS":
            cameraDirection.backward = true;
            break;
        case "ArrowLeft": // Turn left
        case "KeyA":
            cameraDirection.left = true;
            break;
        case "ArrowRight": // Turn right
        case "KeyD":
            cameraDirection.right = true;
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "ArrowUp":
        case "KeyW":
            cameraDirection.forward = false;
            break;
        case "ArrowDown":
        case "KeyS":
            cameraDirection.backward = false;
            break;
        case "ArrowLeft":
        case "KeyA":
            cameraDirection.left = false;
            break;
        case "ArrowRight":
        case "KeyD":
            cameraDirection.right = false;
            break;
    }
});

// PHONE controls
window.addEventListener("deviceorientation", (e)=> {
    if (first) {
        first = false
        gyroA = e.alpha;
        gyroB = e.beta;
        gyroG = e.gamma;
    } else {
        cameraDirection.forward = false;
        cameraDirection.backward = false;
        cameraDirection.left = false;
        cameraDirection.right = false;

        if (e.beta < gyroB - 20) {
            cameraDirection.forward = true;
            cameraDirection.backward = false;
            cameraDirection.left = false;
            cameraDirection.right = false;
        }

        if (e.beta > gyroB + 20) {
            cameraDirection.forward = false;
            cameraDirection.backward = true;
            cameraDirection.left = false;
            cameraDirection.right = false;
        }

        if (e.alpha > gyroA + 20) {
            cameraDirection.forward = false;
            cameraDirection.backward = false;
            cameraDirection.left = true;
            cameraDirection.right = false;
        }

        if (e.gamma < gyroG - 20) {
            cameraDirection.forward = false;
            cameraDirection.backward = false;
            cameraDirection.left = false;
            cameraDirection.right = true;
        }
    }

}, true);


// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    2000 // Far clipping plane
);
const renderer = new THREE.WebGLRenderer();
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

// Add a floor
const floorGeometry = new THREE.PlaneGeometry(10, 2000);
const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);


floor.rotation.x = -Math.PI / 2;


floor.receiveShadow = true; // Enable receiving shadows
scene.add(floor);

// Camera position
camera.position.set(0, 0.85, 0); // Start at the hallway entrance


// Optional: Animate camera movement to simulate walking through
function animate() {
    requestAnimationFrame(animate);

    if (cameraDirection.forward) {
        // Move camera forward (along the Z-axis of the camera's current orientation)
        camera.position.z -= movementSpeed
    }

    if (cameraDirection.backward) {
        // Move camera backward (opposite direction along the Z-axis)
        camera.position.z += movementSpeed
    }

    if (cameraDirection.left) {
        // Rotate camera to the left around the Y-axis
        camera.rotation.y += rotationSpeed;
    }

    if (cameraDirection.right) {
        // Rotate camera to the right around the Y-axis
        camera.rotation.y -= rotationSpeed;
    }

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

const getImage = async function (page) {
    const res = await fetch(`${url}${page}`);
    const html = await res.text();
    const imgTag = html.match(/<img[^>]*>/);
    if (imgTag && imgTag[0]) {
        const srcValue = imgTag[0].match(/src="([^"]+)"/)[1];
        allImages.push({ page, src: srcValue });
        return { page, src: srcValue };
    } else {
        return null;
    }
};

const addImagePlaneToHallway = (src, index, scene) => {
    const texture = new THREE.TextureLoader().load(src); // Load the image as a texture

    //const geometry = new THREE.PlaneGeometry(1, 1); // Quadratic plane (can adjust dimensions if needed)
    const geometry = new THREE.BoxGeometry(1, 1, 0.075); // Adjust the depth (thickness) as needed
    //const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });


    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);

    // Calculate position and orientation
    const hallwayWidth = 2; // Width of the hallway
    const spacing = 0.6; // Spacing between paintings
    const positionZ = index * -spacing; // Depth in the hallway (negative for moving "down" the hallway)

    if (index % 2 === 0) {
        // Left wall
        plane.position.set(-hallwayWidth / 2, 1, positionZ); // Positioned slightly above the floor
        plane.rotation.y = Math.PI / 2; // Face inward (to the right)
    } else {
        // Right wall
        plane.position.set(hallwayWidth / 2, 1, positionZ); // Positioned slightly above the floor
        plane.rotation.y = -Math.PI / 2; // Face inward (to the left)
    }

    scene.add(plane); // Add the plane to the scene
};



(async () => {
    for (let i = 0; i < pages.length; i++) {
        try {
            const img = await getImage(pages[i]); // Fetch image source
            if (img && img.src) {
                actualImgCount += 1
                addImagePlaneToHallway(img.src, actualImgCount, scene); // Add plane to hallway
            }
        } catch (error) {
            console.error(`Error fetching or adding image for page ${pages[i]}:`, error);
        }
    }
})();

