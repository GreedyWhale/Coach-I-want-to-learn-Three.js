/*
 * @Description: 转换物体
 * @Author: MADAO
 * @Date: 2023-12-22 10:30:31
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-02 15:08:07
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
  const geometry = new THREE.BoxGeometry(2, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.position.x = 1;
  // mesh.position.y = -1;
  // mesh.position.z = 1;
  // mesh.position.set(1, -2, 0);
  // mesh.scale.x = 2;
  // mesh.scale.y = 2;
  // mesh.scale.z = 2;
  // mesh.scale.x = 0.5;
  // mesh.rotation.x = Math.PI / 3;
  // mesh.rotation.y = Math.PI / 2;
  // mesh.rotation.z = Math.PI / 2 / 2;
  // const quaternion = new THREE.Quaternion();
  // quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 3);
  // mesh.setRotationFromQuaternion(quaternion);
  // scene.add(mesh);

  // 创建摄像机
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );

  camera.position.z = 5;
  // camera.position.set(1, 5, 5);
  // camera.lookAt(mesh.position);
  scene.add(camera);

  const axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper);

  const group = new THREE.Group();
  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xff0000 })
  );

  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x00ff00 })
  );
  cube2.position.x = 2;

  const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x0000ff })
  );
  cube3.position.x = -2;

  group.add(cube1, cube2, cube3);

  group.position.y = 1;

  scene.add(group);

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });


  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  console.log(mesh.position.length());
  console.log(mesh.position.distanceTo(camera.position));
  console.log(mesh.position.distanceTo(new THREE.Vector3(1, 1, 1)));

  mesh.position.normalize();
  console.log(mesh.position.length());

  document.querySelector('#app')?.append(canvas);
};

main();
