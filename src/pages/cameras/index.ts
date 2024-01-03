/*
 * @Description: 动画
 * @Author: MADAO
 * @Date: 2024-01-02 15:13:49
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-03 17:40:17
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const canvas = document.createElement('canvas');
const sizes = {
  width: 800,
  height: 600,
};
// const aspectRatio = sizes.width / sizes.height;

const cursor = {
  x: 0,
  y: 0,
};

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
);

const camera = new THREE.PerspectiveCamera(
  90,
  sizes.width / sizes.height,
);

camera.position.z = 5;

// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1
// );

const axesHelper = new THREE.AxesHelper(10);

const scene = new THREE.Scene();
scene.add(cube, camera, axesHelper);



const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
document.querySelector('#app')?.appendChild(canvas);

canvas.addEventListener('mousemove', event => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

const tick = () => {
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;

  // camera.position.y = cursor.y * 3;
  // camera.lookAt(cube.position);
  control.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();

