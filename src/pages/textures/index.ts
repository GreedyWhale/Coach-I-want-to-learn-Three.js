/*
 * @Description: 沉浸式体验
 * @Author: MADAO
 * @Date: 2024-01-04 10:04:28
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-09 17:06:52
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './index.scss';
import colorTexturePath from '~/assets/textures/bathroom-floor.png';
// import ambientOcclusionTexturePath from '~/assets/textures/woodCeilingCoffers/ambientOcclusion.jpg';
// import heightTexturePath from '~/assets/textures/woodCeilingCoffers/height.png';
// import metallicTexturePath from '~/assets/textures/woodCeilingCoffers/metallic.jpg';
// import normalTexturePath from '~/assets/textures/woodCeilingCoffers/normal.jpg';
// import roughnessTexturePath from '~/assets/textures/woodCeilingCoffers/roughness.jpg';

const canvas = document.createElement('canvas');

// Load Texture with Image
// const image = new Image();
// const texture = new THREE.Texture(image);
// image.onload = () => {
//   texture.needsUpdate = true;
// };
// image.src = textureImage;

// Load Texture with TextureLoader
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(
//   textureImage,
//   texture => console.log('loaded', texture),
//   // onProgress 已经不支持
//   undefined,
//   error => console.log('error', error),
// );

// Load Texture with LoadingManager
const manager = new THREE.LoadingManager();
// manager.onStart = (...args) => {
//   console.log('onStart', args);
// };

// manager.onProgress = (...args) => {
//   console.log('onProgress', args);
// };

// manager.onLoad = (...args) => {
//   console.log('onLoad', args);
// };

// manager.onError = (...args) => {
//   console.log('onError', args);
// };

const textureLoader = new THREE.TextureLoader(manager);
const colorTexture = textureLoader.load(colorTexturePath);

// Texture repeat
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 2;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// Texture offset
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// Texture rotation
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;
// colorTexture.rotation = Math.PI / 4;

colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

colorTexture.generateMipmaps = false;

// const ambientOcclusionTexture = textureLoader.load(ambientOcclusionTexturePath);
// const heightTexture = textureLoader.load(heightTexturePath);
// const metallicTexture = textureLoader.load(metallicTexturePath);
// const normalTexture = textureLoader.load(normalTexturePath);
// const roughnessTexture = textureLoader.load(roughnessTexturePath);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ map: colorTexture })
);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
);
camera.position.y = 1.5;
camera.position.z = 1;

scene.add(mesh, camera);

const render = new THREE.WebGLRenderer({
  canvas,
});
render.setSize(sizes.width, sizes.height);
render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
render.render(scene, camera);

const control = new OrbitControls(camera, render.domElement);
control.enableDamping = true;
control.update();

document.querySelector('#app')!.appendChild(canvas);


const tick = () => {
  control.update();
  render.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();


window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  render.setSize(sizes.width, sizes.height);
  render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  render.render(scene, camera);
});

window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});