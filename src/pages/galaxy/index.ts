/*
 * @Description: 生成星系
 * @Author: MADAO
 * @Date: 2024-01-19 11:29:52
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-19 16:12:17
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'lil-gui';
import gsap, { Linear } from 'gsap';

import './index.scss';

const canvas = document.createElement('canvas');
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const particlesConfig = {
  counts: 50000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 0.2,
  randomness: 1.5,
  randomnessPower: 2,
  outsideColor: '#3652AD',
  insideColor: '#FE7A36',
};


let renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  control: OrbitControls,
  gui: GUI,
  galaxyGeometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>,
  galaxyMaterial: THREE.PointsMaterial,
  galaxy: THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.PointsMaterial>,
  galaxyAnimation: gsap.core.Tween | null;


const animate = () => {
  if (galaxy) {
    galaxyAnimation = gsap.to(galaxy.rotation, {
      y: Math.PI * 2,
      duration: 15,
      ease: Linear.easeNone,
      repeat: -1
    });
  }
};

const generateGalaxy = () => {
  if (galaxy) {
    galaxyAnimation?.kill();
    galaxyAnimation = null;
    galaxyGeometry.dispose();
    galaxyMaterial.dispose();
    scene.remove(galaxy);
  }

  const getRandomCoordinate = () => Math.pow(Math.random() * particlesConfig.randomness, particlesConfig.randomnessPower) * (Math.random() > 0.5 ? 1 : -1);

  // x,y,z
  const vertices = new Float32Array(particlesConfig.counts * 3);
  // r,g,b
  const colors = new Float32Array(particlesConfig.counts * 3);

  for (let index = 0; index < particlesConfig.counts; index++) {
    // 每三个分一组
    const index3 = index * 3;
    const radius = Math.random() * particlesConfig.radius;
    /**
     * 3个一组
     * 一组中再进行平分 360 度
     */
    const branchesAngle = ((index % particlesConfig.branches) / particlesConfig.branches) * (2 * Math.PI);
    // 离圆点越远旋转角度越大
    const spinAngle = radius * particlesConfig.spin;

    // 随机坐标
    const randomX = getRandomCoordinate();
    const randomY = getRandomCoordinate();
    const randomZ = getRandomCoordinate();
    vertices[index3] = Math.cos(branchesAngle + spinAngle) * radius + randomX;
    vertices[index3 + 1] = randomY;
    vertices[index3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ;

    const colorInside = new THREE.Color(particlesConfig.insideColor);
    const colorOutside = new THREE.Color(particlesConfig.outsideColor);
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / particlesConfig.radius);

    colors[index3] = mixedColor.r;
    colors[index3 + 1] = mixedColor.g;
    colors[index3 + 2] = mixedColor.b;
  }

  galaxyGeometry = new THREE.BufferGeometry();
  galaxyMaterial = new THREE.PointsMaterial({
    size: particlesConfig.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxy);
  animate();
};

const initCamera = () => {
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
  );

  camera.position.z = 0;
  camera.position.y = 6;
};

const initScene = () => {
  scene = new THREE.Scene();
  scene.add(camera);
};

const initRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
};

const initControl = () => {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.update();
};

const initGUI = () => {
  gui = new GUI();
  gui
    .add(particlesConfig, 'counts')
    .name('粒子数量')
    .min(1000)
    .max(100000)
    .step(100)
    .onFinishChange(generateGalaxy);

  gui
    .add(particlesConfig, 'size')
    .name('粒子尺寸')
    .min(0.01)
    .max(1)
    .step(0.001)
    .onFinishChange(generateGalaxy);

  gui
    .add(particlesConfig, 'radius')
    .name('星系半径')
    .min(1)
    .max(15)
    .step(0.01)
    .onFinishChange(generateGalaxy);

  gui
    .add(particlesConfig, 'branches')
    .name('星系分支')
    .min(1)
    .max(10)
    .step(1)
    .onFinishChange(generateGalaxy);

  gui
    .add(particlesConfig, 'spin')
    .name('分支旋转角度')
    .min(-5)
    .max(5)
    .step(0.01)
    .onFinishChange(generateGalaxy);

  gui
    .add(particlesConfig, 'randomness')
    .name('随机度')
    .min(0)
    .max(2)
    .step(0.01)
    .onFinishChange(generateGalaxy);

  gui
    .add(particlesConfig, 'randomnessPower')
    .name('randomnessPower')
    .min(0)
    .max(5)
    .step(0.01)
    .onFinishChange(generateGalaxy);

  gui
    .addColor(particlesConfig, 'insideColor')
    .name('星系内部颜色')
    .onFinishChange(generateGalaxy);

  gui
    .addColor(particlesConfig, 'outsideColor')
    .name('星系外部颜色')
    .onFinishChange(generateGalaxy);
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

  window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      canvas.requestFullscreen();
    }
  });
};

const tick = () => {
  control.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

document.querySelector('#app')!.appendChild(canvas);
initCamera();
initScene();
generateGalaxy();
initRenderer();
initControl();
initGUI();
initListeners();
tick();