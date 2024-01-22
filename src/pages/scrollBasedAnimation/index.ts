/*
 * @Description: 生成星系
 * @Author: MADAO
 * @Date: 2024-01-19 11:29:52
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-22 17:32:46
 */
import * as THREE from 'three';
import gsap from 'gsap';

import './index.scss';
import texturePath from '~/assets/textures/gradient.png';

const canvas = document.createElement('canvas');
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const cursor = {
  x: 0,
  y: 0
};
const clock = new THREE.Clock();
const meshDistance = 22;
const cameraGroup = new THREE.Group();
let previousTime = 0;
let previousIndex = -1;

let renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  torusKnot: THREE.Mesh<THREE.TorusKnotGeometry, THREE.MeshToonMaterial, THREE.Object3DEventMap>,
  cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshToonMaterial, THREE.Object3DEventMap>,
  torus: THREE.Mesh<THREE.TorusGeometry, THREE.MeshToonMaterial, THREE.Object3DEventMap>;

const initCamera = () => {
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
  );

  camera.position.z = 10;
  cameraGroup.add(camera);
};

const initScene = () => {
  scene = new THREE.Scene();
  scene.add(cameraGroup);
};

const initMeshes = () => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(texturePath);
  texture.magFilter = THREE.NearestFilter;

  const material = new THREE.MeshToonMaterial({
    gradientMap: texture,
    color: '#fff'
  });

  torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(2, 0.5, 100, 16),
    material,
  );

  cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    material,
  );

  torus = new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.5, 16, 100),
    material,
  );

  torusKnot.position.set(2.5, 0, 0);
  cube.position.set(-2.5, -meshDistance, 0);
  torus.position.set(2.5, -meshDistance * 2, 0);

  scene.add(torusKnot, cube, torus);
};

const initParticles = () => {
  const particleCounts = 10000;
  const positions = new Float32Array(particleCounts * 3);
  for (let index = 0; index < particleCounts; index++) {
    const index3 = index * 3;
    positions[index3] = (Math.random() - 0.5) * 15;
    positions[index3 + 1] = meshDistance * 0.5 - Math.random() * meshDistance * 3;
    positions[index3 + 2] = (Math.random() - 0.5) * 15;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.01,
      sizeAttenuation: true
    })
  );

  scene.add(particles);
};

const initLight = () => {
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(1, 1, 0);
  scene.add(light);
};

const initRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
};

const initListeners = () => {
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);
  });

  window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      canvas.requestFullscreen();
    }
  });

  window.addEventListener('mousemove', event => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
  });

  window.addEventListener('scroll', () => {
    const meshes = [torusKnot, cube, torus];

    const currentIndex = Math.round(window.scrollY / sizes.height);

    if (currentIndex !== previousIndex) {
      previousIndex = currentIndex;
      gsap.to(meshes[currentIndex].rotation, {
        duration: 1.5,
        delay: 0.5,
        x: '+=5',
        y: '+=5',
        z: '+=5',
      });
    }
  });
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  const meshes = [torusKnot, cube, torus];
  meshes.forEach(mesh => {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.1;
  });

  camera.position.y = -window.scrollY / sizes.height * meshDistance;
  cameraGroup.position.x += (cursor.x - cameraGroup.position.x) * deltaTime * 10;
  cameraGroup.position.y += (-cursor.y - cameraGroup.position.y) * deltaTime * 10;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

document.querySelector('#app')!.appendChild(canvas);
initCamera();
initScene();
initLight();
initMeshes();
initParticles();
initRenderer();
initListeners();
tick();