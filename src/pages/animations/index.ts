/*
 * @Description: 动画
 * @Author: MADAO
 * @Date: 2024-01-02 15:13:49
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-02 17:12:45
 */
import * as THREE from 'three';


const canvas = document.createElement('canvas');
const sizes = {
  width: 800,
  height: 600,
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

const axesHelper = new THREE.AxesHelper(10);

const scene = new THREE.Scene();
scene.add(cube, camera, axesHelper);



const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
document.querySelector('#app')?.appendChild(canvas);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  camera.position.x = Math.cos(elapsedTime);
  camera.position.y = Math.sin(elapsedTime);
  camera.lookAt(cube.position);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
