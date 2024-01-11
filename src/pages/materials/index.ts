/*
 * @Description: 沉浸式体验
 * @Author: MADAO
 * @Date: 2024-01-04 10:04:28
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-11 15:10:11
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

import './index.scss';
import doorColorTexturePath from '../../assets/textures/door/Door_Wood_001_basecolor.jpg';
import doorAmbientOcclusionTexturePath from '../../assets/textures/door/Door_Wood_001_ambientOcclusion.jpg';
import doorMetallicTexturePath from '../../assets/textures/door/Door_Wood_001_metallic.jpg';
import doorRoughnessTexturePath from '../../assets/textures/door/Door_Wood_001_roughness.jpg';
import doorNormalTexturePath from '../../assets/textures/door/Door_Wood_001_normal.jpg';
import doorOpacityTexturePath from '../../assets/textures/door/Door_Wood_001_opacity.jpg';
import doorHeightTexturePath from '../../assets/textures/door/Door_Wood_001_height.png';

import pxPath from '../../assets/textures/environmentMap/px.png';
import nxPath from '../../assets/textures/environmentMap/nx.png';
import pyPath from '../../assets/textures/environmentMap/py.png';
import nyPath from '../../assets/textures/environmentMap/ny.png';
import pzPath from '../../assets/textures/environmentMap/pz.png';
import nzPath from '../../assets/textures/environmentMap/nz.png';

// import matCapTexturePath from '../../assets/textures/matCap/586A51_CCD5AA_8C9675_8DBBB7-64px.png';

const canvas = document.createElement('canvas');

const texturesLoader = new THREE.TextureLoader();
const doorColorTexture = texturesLoader.load(doorColorTexturePath);
const doorAmbientOcclusionTexture = texturesLoader.load(doorAmbientOcclusionTexturePath);
const doorMetallicTexture = texturesLoader.load(doorMetallicTexturePath);
const doorRoughnessTexture = texturesLoader.load(doorRoughnessTexturePath);
const doorNormalTexture = texturesLoader.load(doorNormalTexturePath);
const doorOpacityTexture = texturesLoader.load(doorOpacityTexturePath);
const doorHeightTexture = texturesLoader.load(doorHeightTexturePath);
// const matCapTexture = texturesLoader.load(matCapTexturePath);



const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const material = new THREE.MeshStandardMaterial();

/**
 * Set color
 */
// material.color = new THREE.Color(0x00ff00);
// material.color.set(0x00ff00);

/**
 * Set Textures
 */
// material.map = doorColorTexture;

/**
 * Set Wireframe
 */
// material.wireframe = true;

/**
 * Set Opacity
 */
// material.transparent = true;
// material.opacity = 0.5;

/**
 * Set side
 */
// material.side = THREE.FrontSide; // 前面
// material.side = THREE.BackSide; // 后面
// material.side = THREE.DoubleSide; // 前后两面都可以显示

/**
 * Set shading
 */

// material.flatShading = true;

/**
 * Set normalMap
 */
// material.normalMap = doorNormalTexture;

/**
 * Set matcap
 */
// material.matcap = matCapTexture;

/**
 * Set Texture
 */
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.metalnessMap = doorMetallicTexture;
material.roughnessMap = doorRoughnessTexture;
material.aoMapIntensity = 0.5;
material.roughness = 0.5;
material.normalMap = doorNormalTexture;
material.transparent = true;
material.alphaMap = doorOpacityTexture;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.05;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  material
);

const cubeTextureLoader = new THREE.CubeTextureLoader();

// 立方体的六个面
const environmentMapTexture = cubeTextureLoader.load([
  pxPath,
  nxPath,
  pyPath,
  nyPath,
  pzPath,
  nzPath,
]);

const envMaterial = new THREE.MeshStandardMaterial();

envMaterial.roughness = 0;
envMaterial.metalness = 1;
envMaterial.envMap = environmentMapTexture;


const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 16),
  envMaterial,
);

sphere.position.x = -2;

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.5, 12, 48),
  material
);

torus.position.x = 2.5;

plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
);

camera.position.z = 10;

const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(2, 3, 10);
const light = new THREE.AmbientLight(0xffffff);

scene.add(plane, sphere, camera, light, pointLight);
scene.background = environmentMapTexture;
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

const gui = new GUI();

const materialGroup = gui.addFolder('material');

materialGroup
  .add(material, 'roughness')
  .name('roughness')
  .min(0)
  .max(1)
  .step(0.001);

materialGroup
  .add(material, 'metalness')
  .name('metalness')
  .min(0)
  .max(1)
  .step(0.0001);

materialGroup
  .add(material, 'aoMapIntensity')
  .name('aoMapIntensity')
  .min(0)
  .max(10)
  .step(0.001);

materialGroup
  .add(material, 'displacementScale')
  .name('displacementScale')
  .min(0)
  .max(1)
  .step(0.001);


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