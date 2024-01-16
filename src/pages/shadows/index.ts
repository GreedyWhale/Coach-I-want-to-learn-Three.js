/*
 * @Description: 光线
 * @Author: MADAO
 * @Date: 2024-01-12 17:05:11
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-16 10:32:14
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './index.scss';
import bakeTexturePath from '~/assets/textures/bake.png';

interface App {
  canvas: HTMLCanvasElement;
  sizes: {
    width: number;
    height: number;
  };
  scene: THREE.Scene;
  clock: THREE.Clock;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  control?: OrbitControls;
  plane?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
  sphere?: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
  shadowPlane?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
  init: () => void;
  initCamera: () => void;
  initControl: () => void;
  initRenderer: () => void;
  initListeners: () => void;
  initPlane: () => void;
  initSphere: () => void;
  initAmbientLight: () => void;
  initDirectionalLight: () => void;
  initSpotLight: () => void;
  initPointLight: () => void;
  initShadowPlane: () => void;
  animate: () => void;
  tick: () => void;
}


const app: App = {
  canvas: document.createElement('canvas'),
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: new THREE.Scene(),
  clock: new THREE.Clock(),
  renderer: undefined,
  camera: undefined,
  animate: () => {
    const getElapsedTime = app.clock.getElapsedTime();
    // 在单位圆中，余弦值为点的横坐标
    app.sphere!.position.x = Math.cos(getElapsedTime);
    // 在单位圆中，正弦值为点的纵坐标
    app.sphere!.position.z = Math.sin(getElapsedTime);
    app.sphere!.position.y = Math.abs(Math.sin(getElapsedTime)) + 0.5;
    app.shadowPlane!.position.x = app.sphere!.position.x;
    app.shadowPlane!.position.z = app.sphere!.position.z;
    app.shadowPlane!.material.opacity = 1.5 - app.sphere!.position.y;
  },
  tick: () => {
    app.control!.update();
    app.animate();
    app.renderer!.render(app.scene, app.camera!);
    requestAnimationFrame(app.tick);
  },
  initCamera: () => {
    app.camera = new THREE.PerspectiveCamera(
      75,
      app.sizes.width / app.sizes.height,
    );

    app.camera.position.z = 5;
    app.camera.position.y = 5;
    app.scene.add(app.camera);
  },
  initControl: () => {
    app.control = new OrbitControls(app.camera!, app.renderer!.domElement);
    app.control.enableDamping = true;
    app.control.update();
  },
  initRenderer: () => {
    app.renderer = new THREE.WebGLRenderer({
      canvas: app.canvas,
    });
    app.renderer.setSize(app.sizes.width, app.sizes.height);
    app.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // app.renderer.shadowMap.enabled = true;
    app.renderer.render(app.scene, app.camera!);
  },
  initListeners: () => {
    window.addEventListener('resize', () => {
      app.sizes.width = window.innerWidth;
      app.sizes.height = window.innerHeight;

      app.camera!.aspect = app.sizes.width / app.sizes.height;
      app.camera!.updateProjectionMatrix();

      app.renderer!.setSize(app.sizes.width, app.sizes.height);
      app.renderer!.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      app.renderer!.render(app.scene, app.camera!);
    });

    window.addEventListener('dblclick', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        app.canvas.requestFullscreen();
      }
    });
  },
  initPlane: () => {
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshStandardMaterial({side: THREE.DoubleSide});
    app.plane = new THREE.Mesh(geometry, material);
    app.plane.rotation.x = -(Math.PI / 2);
    // app.plane.receiveShadow = true;
    app.scene.add(app.plane);
  },
  initSphere: () => {
    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshStandardMaterial();
    app.sphere = new THREE.Mesh(geometry, material);
    app.sphere.position.y = 1;
    // app.sphere.castShadow = true;
    app.scene.add(app.sphere);
  },
  initAmbientLight: () => {
    const light = new THREE.AmbientLight(0xffffff, 0.4);
    app.scene.add(light);
  },
  initDirectionalLight: () => {
    const light = new THREE.DirectionalLight(0xffffff, 0.4);
    light.position.set(3, 4, 0);
    // light.castShadow = true;
    // light.shadow.radius = 10;
    // light.shadow.camera.top = 2;
    // light.shadow.camera.left = 2;
    // light.shadow.camera.right = -2;
    // light.shadow.camera.bottom = -2;
    // light.shadow.camera.near = 1;
    // light.shadow.camera.far = 8;
    // light.shadow.mapSize.width = 1024;
    // light.shadow.mapSize.height = 1024;

    const helper = new THREE.DirectionalLightHelper(light, 1);
    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    helper.visible = false;
    cameraHelper.visible = false;
    app.scene.add(light, helper, cameraHelper);
  },
  initSpotLight: () => {
    const light = new THREE.SpotLight(0xffffff, 10, 10, Math.PI / 6);
    light.position.set(0, 4, -2);
    // light.castShadow = true;
    // light.shadow.radius = 2;
    // light.shadow.camera.near = 1;
    // light.shadow.camera.far = 8;
    // light.shadow.camera.fov = 30;
    // light.shadow.mapSize.width = 1024;
    // light.shadow.mapSize.height = 1024;

    const helper = new THREE.SpotLightHelper(light, 1);
    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    helper.visible = false;
    cameraHelper.visible = false;
    app.scene.add(light, helper, cameraHelper);
  },
  initPointLight: () => {
    const light = new THREE.PointLight(0xffffff, 4);
    light.position.set(-1, 3, 0);
    // light.castShadow = true;
    // light.shadow.mapSize.width = 1024;
    // light.shadow.mapSize.height = 1024;
    // light.shadow.radius = 2;
    // light.shadow.camera.near = 1;
    // light.shadow.camera.far = 6;

    const helper = new THREE.PointLightHelper(light, 1);
    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    helper.visible = false;
    cameraHelper.visible = false;
    app.scene.add(light, helper, cameraHelper);
  },
  initShadowPlane: () => {
    const geometry = new THREE.PlaneGeometry(1.5, 1.5);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(bakeTexturePath);
    const material = new THREE.MeshBasicMaterial({
      alphaMap: texture,
      transparent: true,
    });
    app.shadowPlane = new THREE.Mesh(geometry, material);
    app.shadowPlane.position.y = app.plane!.position.y + 0.01;
    app.shadowPlane.rotation.x = -(Math.PI / 2);
    app.scene.add(app.shadowPlane);
  },
  init: () => {
    document.querySelector('#app')!.appendChild(app.canvas);
    app.initCamera();
    app.initPlane();
    app.initSphere();
    app.initAmbientLight();
    app.initDirectionalLight();
    app.initSpotLight();
    app.initPointLight();
    app.initShadowPlane();
    app.initRenderer();
    app.initControl();
    app.initListeners();
    app.tick();
    app.scene.add(new THREE.AxesHelper(5));
  }
};

app.init();

