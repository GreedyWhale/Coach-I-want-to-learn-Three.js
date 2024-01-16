/*
 * @Description: 光线
 * @Author: MADAO
 * @Date: 2024-01-12 17:05:11
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-15 14:22:18
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './index.scss';

interface App {
  canvas: HTMLCanvasElement;
  sizes: {
    width: number;
    height: number;
  };
  scene: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  control?: OrbitControls;
  plane?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
  cube?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
  donut?: THREE.Mesh<THREE.TorusGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
  sphere?: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
  init: () => void;
  initCamera: () => void;
  initControl: () => void;
  initRenderer: () => void;
  initListeners: () => void;
  initPlane: () => void;
  initCube: () => void;
  initSphere: () => void;
  initDonut: () => void;
  initAmbientLight: () => void;
  initDirectionalLight: () => void;
  initHemisphereLight: () => void;
  initPointLight: () => void;
  initRectAreaLight: () => void;
  initSpotLight: () => void;
  tick: () => void;
}

const app: App = {
  canvas: document.createElement('canvas'),
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: new THREE.Scene(),
  renderer: undefined,
  camera: undefined,
  tick: () => {
    app.control!.update();
    app.renderer!.render(app.scene, app.camera!);
    requestAnimationFrame(app.tick);
  },
  initCamera: () => {
    app.camera = new THREE.PerspectiveCamera(
      75,
      app.sizes.width / app.sizes.height,
    );

    app.camera.position.z = 10;
    app.camera.position.y = 10;
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
    app.scene.add(app.plane);
  },
  initCube: () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial();
    app.cube = new THREE.Mesh(geometry, material);
    app.cube.position.x = -1.5;
    app.cube.position.y = 1;
    app.scene.add(app.cube);
  },
  initDonut: () => {
    const geometry = new THREE.TorusGeometry(0.4, 0.2);
    const material = new THREE.MeshStandardMaterial();
    app.donut = new THREE.Mesh(geometry, material);
    app.donut.position.x = 1.5;
    app.donut.position.y = 1;
    app.scene.add(app.donut);
  },
  initSphere: () => {
    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshStandardMaterial();
    app.sphere = new THREE.Mesh(geometry, material);
    app.sphere.position.y = 1;
    app.scene.add(app.sphere);
  },
  initAmbientLight: () => {
    const light = new THREE.AmbientLight(0xffffff, 0.01);
    app.scene.add(light);
  },
  initDirectionalLight: () => {
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    const helper = new THREE.DirectionalLightHelper(light, 0.5);
    light.position.x = 3;
    light.position.y = 3;
    app.scene.add(light, helper);
  },
  initHemisphereLight: () => {
    const light = new THREE.HemisphereLight(0xff0000, 0x0000ff);
    const helper = new THREE.HemisphereLightHelper(light, 0.3);
    light.position.y = 3;
    app.scene.add(light, helper);
  },
  initPointLight: () => {
    const light = new THREE.PointLight(0x00ff00, 0.4);
    const helper = new THREE.PointLightHelper(light, 0.3);
    light.position.x = -3;
    light.position.y = 3;
    app.scene.add(light, helper);
  },
  initRectAreaLight: () => {
    const light = new THREE.RectAreaLight(0xff00ff, 1, 2, 2);
    light.position.x = 1;
    light.position.z = 1;
    light.lookAt(new THREE.Vector3(0,0,0));
    app.scene.add(light);
  },
  initSpotLight: () => {
    const light = new THREE.SpotLight('#00e9ff', 1, 6, Math.PI * 0.1, 0.2);
    const helper = new THREE.SpotLightHelper(light, '#00e9ff');
    light.position.y = 3;
    light.position.x = -4;
    light.target.position.set(3, 0, 0);
    app.scene.add(light, helper, light.target);
  },
  init: () => {
    document.querySelector('#app')!.appendChild(app.canvas);
    app.initCamera();
    app.initPlane();
    app.initCube();
    app.initSphere();
    app.initDonut();
    app.initAmbientLight();
    app.initDirectionalLight();
    app.initHemisphereLight();
    app.initPointLight();
    app.initRectAreaLight();
    app.initSpotLight();
    app.initRenderer();
    app.initControl();
    app.initListeners();
    app.tick();
  }
};

app.init();