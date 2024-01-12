/*
 * @Description: 沉浸式体验
 * @Author: MADAO
 * @Date: 2024-01-04 10:04:28
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-12 12:43:22
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { gsap, Linear } from 'gsap';

import './index.scss';
import typefaceFont from '~/assets/fonts/zector/Zector_Regular.json?url';

const canvas = document.createElement('canvas');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const material = new THREE.MeshNormalMaterial();


const donutGeometry = new THREE.TorusGeometry(0.4, 0.2);
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const meshGroup = new THREE.Group();

const fontLoader = new FontLoader();

fontLoader.load(typefaceFont, font => {
  const geometry = new TextGeometry('Hello Three.js', {
    font,
    // 字体大小
    size: 0.5,
    // 字体厚度（z轴）
    height: 0.2,
    // 字体曲面的分段数
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  });

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshNormalMaterial({
      wireframe: true,
    })
  );

  scene.add(mesh);

  gsap.to(mesh.rotation, {
    y: Math.PI * 2,
    x: Math.PI * 2,
    duration: 5,
    ease: Linear.easeInOut,
    repeat: -1
  });

  // geometry.computeBoundingBox();
  // geometry.translate(
  //   -(geometry.boundingBox!.max.x - geometry.boundingBox!.min.x) / 2,
  //   -(geometry.boundingBox!.max.y - geometry.boundingBox!.min.y) / 2,
  //   -(geometry.boundingBox!.max.z - geometry.boundingBox!.min.z) / 2,
  // );
  geometry.center();
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
);

camera.position.z = 40;

for (let index = 0; index < 100; index++) {
  const meshes = [
    new THREE.Mesh(donutGeometry, material),
    new THREE.Mesh(cubeGeometry, material),
  ];

  meshes.forEach(mesh => {
    mesh.rotation.x = Math.PI * Math.random();
    mesh.rotation.y = Math.PI * Math.random();

    mesh.position.set(
      ((Math.random() - 0.5) * 2) * 20,
      ((Math.random() - 0.5) * 2) * 20,
      ((Math.random() - 0.5) * 2) * 20,
    );

    meshGroup.add(mesh);
  });
}

scene.add(meshGroup, camera);

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

gsap.to(meshGroup.rotation, {
  y: Math.PI * 2,
  x: Math.PI * 2,
  duration: 25,
  ease: Linear.easeNone,
  repeat: -1
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