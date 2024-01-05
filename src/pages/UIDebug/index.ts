/*
 * @Description: 沉浸式体验
 * @Author: MADAO
 * @Date: 2024-01-04 10:04:28
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-05 16:35:03
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap, Linear } from 'gsap';
import GUI from 'lil-gui';

import './index.scss';

const gui = new GUI();

const canvas = document.createElement('canvas');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const attributes = {
  spin: () => {
    gsap.to(triangles.rotation, {
      y: Math.PI * 2 + triangles.rotation.y,
      duration: 5,
      ease: Linear.easeNone,
    });
  },

  color: '#F99417'
};

const scene = new THREE.Scene();

const geometry = new THREE.BufferGeometry();
const triangleCounts = 300;
// 每个三角形有3个顶点，每个顶点有三个坐标，所以是乘以9
const positionsArray = new Float32Array(triangleCounts * 9);
for (let index = 0; index < triangleCounts * 9; index++) {
  positionsArray[index] = Math.random() - 0.5;
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const triangles = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({
    color: attributes.color,
    wireframe: true,
  })
);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
);
camera.position.z = 5;

scene.add(triangles, camera);

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

gui.add(triangles.position, 'y')
  .max(5)
  .min(-5)
  .step(0.01)
  .name('物体的 Y 轴位移');

gui.add(triangles, 'visible')
  .name('是否显示物体');

gui.add(triangles.material, 'wireframe')
  .name('是否显示线框');


gui.addColor(attributes, 'color')
  .name('修改物体颜色')
  .onChange(() => {
    triangles.material.color.set(attributes.color);
  });

gui.add(attributes, 'spin')
  .name('让物体围绕 Y 轴旋转一周');

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