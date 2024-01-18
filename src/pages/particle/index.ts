/*
 * @Description: 光线
 * @Author: MADAO
 * @Date: 2024-01-12 17:05:11
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-18 16:15:58
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './index.scss';
import particlesTexturePath from '~/assets/textures/particles/star_07.png';

const canvas = document.createElement('canvas');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
);

camera.position.z = 25;
camera.position.y = 5;

/**
 * particles
 */
// 一个顶点3个坐标（x，y，z）
const vertices = new Float32Array(20000 * 3).map(() => (Math.random() - 0.5) * 10);
const colors = new Float32Array(20000 * 3).map(() => Math.random());

const particlesGeometry = new THREE.BufferGeometry();

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load(particlesTexturePath);

const particles = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    // color: '#FAEF5D',
    alphaMap: particlesTexture,
    transparent: true,
    vertexColors: true,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }),
);

/**
 * scene
 */
const scene = new THREE.Scene();
scene.add(camera, particles);

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

/**
 * controls
 */
const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;
control.update();

const clock = new THREE.Clock();
/**
 * animate
 */
const tick = () => {
  vertices.forEach((_value, index, array) => {
    const x = index * 3;
    // 更新y轴的值
    array[x + 1] = Math.sin(clock.getElapsedTime() +  array[x]);
  });

  particles.geometry.attributes.position.needsUpdate = true;

  control.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

document.querySelector('#app')!.appendChild(canvas);


/**
 * resize listener
 */
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

/**
 * dblclick listener
 */
window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});

