import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaadfff);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x88cc88 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Penguin
let penguin;
const loader = new GLTFLoader();
loader.load("assets/penguin.glb", (gltf) => {
  penguin = gltf.scene;
  penguin.scale.set(1.5, 1.5, 1.5);
  scene.add(penguin);
});

// Click-to-Move
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let target = new THREE.Vector3(); // Where the penguin should move

window.addEventListener("click", (e) => {
  // Convert screen coordinates to normalized device coordinates (-1 to 1)
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(ground);

  if (hits.length > 0) {
    target.copy(hits[0].point); // Set target to clicked point on the ground
  }
});


// Game loop Animation
function animate() {
  requestAnimationFrame(animate);

  if (penguin) {
    const direction = target.clone().sub(penguin.position);
    direction.y = 0;

    if (direction.length() > 0.1) {
      direction.normalize(); 

      // Increase animation speed
      penguin.position.add(direction.multiplyScalar(0.15));
      penguin.lookAt(target.x, penguin.position.y, target.z);
    }
  }

  renderer.render(scene, camera);
}

animate();

// Window resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});