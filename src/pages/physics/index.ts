/*
 * @Description: 物理
 * @Author: MADAO
 * @Date: 2024-01-23 10:52:50
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-29 11:27:14
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CANNOT from 'cannon';
import GUI from 'lil-gui';

import './index.scss';
import metalColorTexturePath from '~/assets/textures/metal/Metal_scratched_008_basecolor.jpg';
import metalAmbientOcclusionTexturePath from '~/assets/textures/metal/Metal_scratched_008_ambientOcclusion.jpg';
import metalRoughnessTexturePath from '~/assets/textures/metal/Metal_scratched_008_roughness.jpg';
import metalMetallicTexturePath from '~/assets/textures/metal/Metal_scratched_008_metallic.jpg';
import metalNormalTexturePath from '~/assets/textures/metal/Metal_scratched_008_normal.jpg';
import metalHeightTexturePath from '~/assets/textures/metal/Metal_scratched_008_height.png';

import agateColorTexturePath from '~/assets/textures/agate/Agate_001_COLOR.jpg';
import agateAmbientOcclusionTexturePath from '~/assets/textures/agate/Agate_001_OCC.jpg';
import agateRoughnessTexturePath from '~/assets/textures/agate/Agate_001_ROUGH.jpg';
import agateNormalTexturePath from '~/assets/textures/agate/Agate_001_NORM.jpg';
import agateHeightTexturePath from '~/assets/textures/agate/Agate_001_DISP.png';

import hitSound from '~/assets/sound/hit.wav';

const hitSoundAudio = new Audio(hitSound);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const objectsToUpdate: Array<{
  mesh: THREE.Mesh<THREE.SphereGeometry | THREE.BoxGeometry, THREE.MeshStandardMaterial>,
  body: CANNOT.Body,
}> = [];

const debugObject = {
  createSphere: () => {
    createSphere(
      Math.random() * 0.5,
      {
        x: (Math.random() - 0.5) * 40,
        y: 8,
        z: (Math.random() - 0.5) * 40
      }
    );
  },
  createCube: () => {
    createCube(
      {
        width: Math.random(),
        height: Math.random(),
        depth: Math.random(),
      },
      {
        x: (Math.random() - 0.5) * 40,
        y: 8,
        z: (Math.random() - 0.5) * 40
      }
    );
  },
  reset: () => {
    objectsToUpdate.forEach(({body, mesh}) => {
      mesh.remove();
      body.removeEventListener('collide', playSound);

      scene.remove(mesh);
      physicsWorld.remove(body);
    });

    objectsToUpdate.splice(0);
  },
};

const canvas = document.createElement('canvas');
const textureLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();
const gui = new GUI();

const metalColorTexture = textureLoader.load(metalColorTexturePath);
const metalAmbientOcclusionTexture = textureLoader.load(metalAmbientOcclusionTexturePath);
const metalRoughnessTexture = textureLoader.load(metalRoughnessTexturePath);
const metalMetallicTexture = textureLoader.load(metalMetallicTexturePath);
const metalNormalTexture = textureLoader.load(metalNormalTexturePath);
const metalHeightTexture = textureLoader.load(metalHeightTexturePath);

const agateColorTexture = textureLoader.load(agateColorTexturePath);
const agateAmbientOcclusionTexture = textureLoader.load(agateAmbientOcclusionTexturePath);
const agateRoughnessTexture = textureLoader.load(agateRoughnessTexturePath);
const agateNormalTexture = textureLoader.load(agateNormalTexturePath);
const agateHeightTexture = textureLoader.load(agateHeightTexturePath);

const sphereGeometry = new THREE.SphereGeometry(1, 128, 128);
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 128, 128);
const meshMaterial = new THREE.MeshStandardMaterial({
  map: agateColorTexture,
  aoMap: agateAmbientOcclusionTexture,
  roughnessMap: agateRoughnessTexture,
  normalMap: agateNormalTexture,
  displacementMap: agateHeightTexture,
  roughness: 0.3,
  metalness: 0.4,
  displacementScale: 0,
});

sphereGeometry.setAttribute('uv2', new THREE.BufferAttribute(sphereGeometry.attributes.uv.array, 2));
cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2));
let previousTime = 0;

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  ambientLight: THREE.AmbientLight,
  directionalLight: THREE.DirectionalLight,
  control: OrbitControls,
  physicsWorld: CANNOT.World;

const initScene = () => {
  scene = new THREE.Scene();
};

const initCamera = () => {
  camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);

  camera.position.z = 10;
  camera.position.y = 20;
  camera.lookAt(new THREE.Vector3(0,0,0));
  scene.add(camera);
};

const initLights = () => {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(1, 3, -5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 40;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.left = 10;
  directionalLight.shadow.camera.right = -10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.radius = 2;

  scene.add(ambientLight, directionalLight);
};

const initFloor = () => {
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40, 256, 256),
    new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      map: metalColorTexture,
      aoMap: metalAmbientOcclusionTexture,
      roughnessMap: metalRoughnessTexture,
      metalnessMap: metalMetallicTexture,
      normalMap: metalNormalTexture,
      displacementMap: metalHeightTexture,
      roughness: 0.8,
      metalness: 0.2,
      displacementScale: 0,
    }),
  );

  planeMesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(planeMesh.geometry.attributes.uv.array, 2));

  console.log(planeMesh.geometry.attributes);
  planeMesh.rotation.set(-Math.PI / 2, 0, 0);
  planeMesh.position.y = 0;
  planeMesh.receiveShadow = true;

  // 设置平面
  const physicsWorldPlane = new CANNOT.Body({
    // 物体质量
    mass: 0,
    shape: new CANNOT.Plane(),
  });
  physicsWorldPlane.quaternion.setFromAxisAngle(new CANNOT.Vec3(-1, 0, 0), Math.PI * 0.5);

  scene.add(planeMesh);
  physicsWorld.addBody(physicsWorldPlane);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const playSound = (event: any) => {
  if (event.contact.getImpactVelocityAlongNormal() > 2) {
    hitSoundAudio.currentTime = 0;
    hitSoundAudio.volume = Math.random();
    hitSoundAudio.play();
  }
};

const createSphere = (radius: number, position: Record<'x' | 'y' | 'z', number>) => {
  const mesh = new THREE.Mesh(sphereGeometry, meshMaterial);
  mesh.scale.set(radius, radius, radius);

  mesh.castShadow = true;
  mesh.position.copy(new THREE.Vector3(position.x, position.y, position.z));

  // 设置球体
  const body = new CANNOT.Body({
    // 物体质量
    mass: 1,
    position: new CANNOT.Vec3(position.x, position.y, position.z),
    shape: new CANNOT.Sphere(radius),
  });

  body.addEventListener('collide', playSound);
  physicsWorld.addBody(body);
  scene.add(mesh);

  objectsToUpdate.push({mesh, body});
};

const createCube = (sizes: Record<'width' | 'height' | 'depth', number>, position: Record<'x' | 'y' | 'z', number>) => {
  const mesh = new THREE.Mesh(cubeGeometry, meshMaterial);
  mesh.scale.set(sizes.width, sizes.height, sizes.depth);

  mesh.castShadow = true;
  mesh.position.copy(new THREE.Vector3(position.x, position.y, position.z));

  const body = new CANNOT.Body({
    // 物体质量
    mass: 1,
    position: new CANNOT.Vec3(position.x, position.y, position.z),
    shape: new CANNOT.Box(new CANNOT.Vec3(sizes.width / 2, sizes.height / 2, sizes.depth / 2)),
  });

  body.addEventListener('collide', playSound);
  physicsWorld.addBody(body);
  scene.add(mesh);

  objectsToUpdate.push({mesh, body});
};


const initRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    canvas
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.render(scene, camera);
};

const initControl = () => {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.update();
};

const initPhysicsWorld = () => {
  physicsWorld = new CANNOT.World();
  // 设置重力
  physicsWorld.gravity.set(0, -9.82, 0);

  // 设置材质
  const defaultMaterial = new CANNOT.Material('default');
  const defaultContactMaterial = new CANNOT.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1, // 摩擦力
      restitution: 0.7, // 反弹度
    }
  );

  physicsWorld.addContactMaterial(defaultContactMaterial);
  physicsWorld.defaultContactMaterial = defaultContactMaterial;
  physicsWorld.broadphase = new CANNOT.SAPBroadphase(physicsWorld);
  physicsWorld.allowSleep = true;
};

const initListeners = () => {
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);
  });
};

const initGUI = () => {
  gui.add(debugObject, 'createSphere').name('添加随机球体');
  gui.add(debugObject, 'createCube').name('添加随机立方体');
  gui.add(debugObject, 'reset').name('清除');
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  control.update();
  physicsWorld.step(1 / 60, deltaTime, 3);
  objectsToUpdate.forEach(({mesh, body}) => {
    mesh.position.copy(body.position as unknown as THREE.Vector3);
    mesh.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

const init = () => {
  document.querySelector('#app')?.appendChild(canvas);
  initPhysicsWorld();
  initScene();
  initCamera();
  initLights();
  initFloor();
  createSphere(0.5, {x: 0, y: 3, z: 0});
  createCube(
    {width: 1, height: 1, depth: 1},
    {x: 5, y: 3, z: 5}
  );
  initRenderer();
  initListeners();
  initControl();
  initGUI();
  tick();
};

init();