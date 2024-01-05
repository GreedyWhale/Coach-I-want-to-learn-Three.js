/*
 * @Description: 沉浸式体验
 * @Author: MADAO
 * @Date: 2024-01-04 10:04:28
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-04 14:52:15
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap, Linear } from 'gsap';

import './index.scss';

const canvas = document.createElement('canvas');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: '#F99417' })
);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
);
camera.position.z = 5;

const axesHelper = new THREE.AxesHelper(10);

scene.add(cube, camera, axesHelper);

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

gsap.to(cube.rotation, {
  y: 2 * Math.PI,
  ease: Linear.easeNone,
  duration: 5,
  repeat: -1,
});

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