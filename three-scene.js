const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 5;

// Parâmetros do sistema de partículas
const particleCount = 1000;
const particlesGeometry = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);

// Distribuição das partículas para formar montanhas
for (let i = 0; i < particleCount * 3; i += 3) {
  const x = (Math.random() - 0.5) * 15;
  const z = (Math.random() - 0.5) * 15;
  let y = 0;
  const distanceFromCenter = Math.sqrt(x * x + z * z);
  y = Math.max(0, 2 - distanceFromCenter * 0.5 + Math.random() * 0.5);
  if (Math.random() > 0.7) y += Math.random() * 1.5; // picos extras
  if (Math.random() > 0.8) y = Math.random() * 0.5; // vales

  posArray[i] = x;
  posArray[i + 1] = y;
  posArray[i + 2] = z;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Cores baseadas na altura das partículas
const colorsArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i += 3) {
  const y = posArray[i + 1];
  if (y > 1.5) {
    // Pico nevado
    colorsArray[i] = 1;
    colorsArray[i + 1] = 1;
    colorsArray[i + 2] = 1;
  } else if (y > 0.8) {
    // Rochoso
    const gray = 0.6 + Math.random() * 0.2;
    colorsArray[i] = gray;
    colorsArray[i + 1] = gray;
    colorsArray[i + 2] = gray;
  } else if (y > 0.3) {
    // Floresta
    colorsArray[i] = 0.2 + Math.random() * 0.1;
    colorsArray[i + 1] = 0.4 + Math.random() * 0.1;
    colorsArray[i + 2] = 0.2 + Math.random() * 0.1;
  } else {
    // Solo
    colorsArray[i] = 0.4 + Math.random() * 0.1;
    colorsArray[i + 1] = 0.3 + Math.random() * 0.1;
    colorsArray[i + 2] = 0.2 + Math.random() * 0.1;
  }
}
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

// Material das partículas
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true,
  map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/circle.png'),
  alphaTest: 0.5
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Luz ambiente e direcional para realce
scene.add(new THREE.AmbientLight(0x404040));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Loop de animação
function animate() {
  requestAnimationFrame(animate);

  // Rotação suave para efeito de sobrevoo
  particlesMesh.rotation.x -= 0.0005;

  // Movimento sutil das partículas mais altas
  const positions = particlesGeometry.attributes.position.array;
  for (let i = 1; i < positions.length; i += 3) {
    if (positions[i] > 0.3) {
      positions[i] -= (Math.random() - 0.5) * 0.005;
    }
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();

// Responsividade
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
