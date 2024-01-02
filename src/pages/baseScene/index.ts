/*
 * @Description: 基础场景
 * @Author: MADAO
 * @Date: 2023-12-22 10:30:31
 * @LastEditors: MADAO
 * @LastEditTime: 2023-12-22 14:56:21
 */
import * as THREE from 'three';

const main = () => {
  const sizes = {
    width: 800,
    height: 600,
  };
  const canvas = document.createElement('canvas');

  // 创建场景
  const scene = new THREE.Scene();

  // 创建物体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 创建摄像机
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );

  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 5;
  scene.add(camera);

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  document.querySelector('#app')?.append(canvas);
};

main();
