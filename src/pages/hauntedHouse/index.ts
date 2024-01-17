/*
 * @Description: 光线
 * @Author: MADAO
 * @Date: 2024-01-12 17:05:11
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-17 17:36:22
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './index.scss';
import doorColorTexturePath from '~/assets/textures/door/Door_Wood_001_basecolor.jpg';
import doorAmbientOcclusionTexturePath from '~/assets/textures/door/Door_Wood_001_ambientOcclusion.jpg';
import doorMetallicTexturePath from '~/assets/textures/door/Door_Wood_001_metallic.jpg';
import doorRoughnessTexturePath from '~/assets/textures/door/Door_Wood_001_roughness.jpg';
import doorNormalTexturePath from '~/assets/textures/door/Door_Wood_001_normal.jpg';
import doorOpacityTexturePath from '~/assets/textures/door/Door_Wood_001_opacity.jpg';
import doorHeightTexturePath from '~/assets/textures/door/Door_Wood_001_height.png';

import wallColorTexturePath from '~/assets/textures/walls/Brick_Wall_019_basecolor.jpg';
import wallAmbientOcclusionTexturePath from '~/assets/textures/walls/Brick_Wall_019_ambientOcclusion.jpg';
import wallRoughnessTexturePath from '~/assets/textures/walls/Brick_Wall_019_roughness.jpg';
import wallNormalTexturePath from '~/assets/textures/walls/Brick_Wall_019_normal.jpg';
import wallHeightTexturePath from '~/assets/textures/walls/Brick_Wall_019_height.png';

import doorsillColorTexturePath from '~/assets/textures/doorsill/Granite_002_COLOR_COLOR.jpg';
import doorsillAmbientOcclusionTexturePath from '~/assets/textures/doorsill/Granite_002_COLOR_OCC.jpg';
import doorsillRoughnessTexturePath from '~/assets/textures/doorsill/Granite_002_COLOR_ROUGH.jpg';
import doorsillNormalTexturePath from '~/assets/textures/doorsill/Granite_002_COLOR_NORM.jpg';
import doorsillHeightTexturePath from '~/assets/textures/doorsill/Granite_002_COLOR_DISP.png';

import roofColorTexturePath from '~/assets/textures/roof/Concrete_018_BaseColor.jpg';
import roofAmbientOcclusionTexturePath from '~/assets/textures/roof/Concrete_018_AmbientOcclusion.jpg';
import roofRoughnessTexturePath from '~/assets/textures/roof/Concrete_018_Roughness.jpg';
import roofNormalTexturePath from '~/assets/textures/roof/Concrete_018_Normal.jpg';
import roofHeightTexturePath from '~/assets/textures/roof/Concrete_018_Height.png';

import floorColorTexturePath from '~/assets/textures/floor/Grass_005_BaseColor.jpg';
import floorAmbientOcclusionTexturePath from '~/assets/textures/floor/Grass_005_AmbientOcclusion.jpg';
import floorRoughnessTexturePath from '~/assets/textures/floor/Grass_005_Roughness.jpg';
import floorNormalTexturePath from '~/assets/textures/floor/Grass_005_Normal.jpg';
import floorHeightTexturePath from '~/assets/textures/floor/Grass_005_Height.png';

import bushesColorTexturePath from '~/assets/textures/bush/Hedge_001_BaseColor.jpg';
import bushesAmbientOcclusionTexturePath from '~/assets/textures/bush/Hedge_001_AmbientOcclusion.jpg';
import bushesRoughnessTexturePath from '~/assets/textures/bush/Hedge_001_Roughness.jpg';
import bushesNormalTexturePath from '~/assets/textures/bush/Hedge_001_Normal.jpg';
import bushesHeightTexturePath from '~/assets/textures/bush/Hedge_001_Height.png';

import gravesColorTexturePath from '~/assets/textures/graves/Concrete_Wall_002_basecolor.jpg';
import gravesAmbientOcclusionTexturePath from '~/assets/textures/graves/Concrete_Wall_002_ambient_occlusion.jpg';
import gravesRoughnessTexturePath from '~/assets/textures/graves/Concrete_Wall_002_roughness.jpg';
import gravesNormalTexturePath from '~/assets/textures/graves/Concrete_Wall_002_normal.jpg';
import gravesHeightTexturePath from '~/assets/textures/graves/Concrete_Wall_002_height.png';

import { generatePoints } from '~/utils/random';
// unit = meter

interface App {
  canvas: HTMLCanvasElement;
  constants: {
    threshold: number;
    light: string;
    fog: string;
    rendererSizes: {
      width: number;
      height: number;
    },
    floor: {
      width: number;
      height: number;
    },
    house: {
      width: number;
      height: number;
      depth: number;
      roofHeight: number,
      door: {
        width: number;
        height: number;
      },
      doorsillHeight: number;
    },
    bushes: {
      cubeHeight: number;
      cubeDepth: number;
    }
  };
  houseGroup: THREE.Group<THREE.Object3DEventMap>;
  bushGroup: THREE.Group<THREE.Object3DEventMap>;
  graveGroup: THREE.Group<THREE.Object3DEventMap>;
  scene: THREE.Scene;
  clock: THREE.Clock;
  textureLoader: THREE.TextureLoader;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  control?: OrbitControls;
  ghost: THREE.PointLight;
  init: () => void;
  initScene: () => void;
  initCamera: () => void;
  initControl: () => void;
  initRenderer: () => void;
  initListeners: () => void;
  initAmbientLight: () => void;
  initMoonLight: () => void;
  initFloor: () => void;
  initWalls: () => void;
  initRoof: () => void;
  initDoor: () => void;
  initDoorsill: () => void;
  initBushes: () => void;
  initDoorLight: () => void;
  initGraves: () => void;
  ghostAnimation: () => void;
  tick: () => void;
}


const app: App = {
  canvas: document.createElement('canvas'),
  scene: new THREE.Scene(),
  clock: new THREE.Clock(),
  ghost: new THREE.PointLight('#00ffff', 10),
  houseGroup: new THREE.Group(),
  bushGroup: new THREE.Group(),
  graveGroup: new THREE.Group(),
  textureLoader: new THREE.TextureLoader(),
  renderer: undefined,
  camera: undefined,
  constants: {
    threshold: 0.01,
    light: '#b9d5ff',
    fog: '#262837',
    rendererSizes: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    floor: {
      width: 40,
      height: 40,
    },
    house: {
      width: 4,
      height: 3,
      depth: 4,
      roofHeight: 2,
      door: {
        width: 2,
        height: 2,
      },
      doorsillHeight: 0.2,
    },
    bushes: {
      cubeHeight: 1,
      cubeDepth: 0.3,
    }
  },
  tick: () => {
    app.ghostAnimation();
    app.control!.update();
    app.renderer!.render(app.scene, app.camera!);
    requestAnimationFrame(app.tick);
  },
  initScene: () => {
    app.ghost.castShadow = true;
    const fog = new THREE.Fog(app.constants.fog, 1, 30);
    app.scene.fog = fog;

    app.scene.add(
      app.ghost,
      app.houseGroup,
      app.bushGroup,
      app.graveGroup
    );
  },
  initCamera: () => {
    app.camera = new THREE.PerspectiveCamera(
      75,
      app.constants.rendererSizes.width / app.constants.rendererSizes.height,
    );

    app.camera.position.z = 25;
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
    app.renderer.setSize(app.constants.rendererSizes.width, app.constants.rendererSizes.height);
    app.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    app.renderer.setClearColor(app.constants.fog);
    app.renderer.shadowMap.enabled = true;
    app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    app.renderer.render(app.scene, app.camera!);
  },
  initListeners: () => {
    window.addEventListener('resize', () => {
      app.constants.rendererSizes.width = window.innerWidth;
      app.constants.rendererSizes.height = window.innerHeight;

      app.camera!.aspect = app.constants.rendererSizes.width / app.constants.rendererSizes.height;
      app.camera!.updateProjectionMatrix();

      app.renderer!.setSize(app.constants.rendererSizes.width, app.constants.rendererSizes.height);
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
  initAmbientLight: () => {
    const light = new THREE.AmbientLight(app.constants.light, 0.05);
    app.scene.add(light);
  },
  initMoonLight: () => {
    const light = new THREE.DirectionalLight(app.constants.light, 0.05);
    light.position.set(4, 8, -4);

    app.scene.add(light);
  },
  initFloor: () => {
    const colorTexture = app.textureLoader.load(floorColorTexturePath);
    const ambientOcclusionTexture = app.textureLoader.load(floorAmbientOcclusionTexturePath);
    const roughnessTexture = app.textureLoader.load(floorRoughnessTexturePath);
    const normalTexture = app.textureLoader.load(floorNormalTexturePath);
    const heightTexture = app.textureLoader.load(floorHeightTexturePath);

    colorTexture.repeat.set(2, 2);
    ambientOcclusionTexture.repeat.set(2, 2);
    roughnessTexture.repeat.set(2, 2);
    normalTexture.repeat.set(2, 2);
    heightTexture.repeat.set(2, 2);

    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;

    ambientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    ambientOcclusionTexture.wrapT = THREE.RepeatWrapping;

    roughnessTexture.wrapS = THREE.RepeatWrapping;
    roughnessTexture.wrapT = THREE.RepeatWrapping;

    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;

    heightTexture.wrapS = THREE.RepeatWrapping;
    heightTexture.wrapT = THREE.RepeatWrapping;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(
        app.constants.floor.width,
        app.constants.floor.height,
        100,
        100
      ),
      new THREE.MeshStandardMaterial({
        map: colorTexture,
        aoMap: ambientOcclusionTexture,
        roughnessMap: roughnessTexture,
        normalMap: normalTexture,
        displacementMap: heightTexture,
        transparent: true,
        roughness: 0.5,
        aoMapIntensity: 0.1,
        displacementScale: 0.1,
      }),
    );

    floor.geometry.setAttribute('uv2', new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    app.scene.add(floor);
  },
  initWalls: () => {
    const colorTexture = app.textureLoader.load(wallColorTexturePath);
    const ambientOcclusionTexture = app.textureLoader.load(wallAmbientOcclusionTexturePath);
    const roughnessTexture = app.textureLoader.load(wallRoughnessTexturePath);
    const normalTexture = app.textureLoader.load(wallNormalTexturePath);
    const heightTexture = app.textureLoader.load(wallHeightTexturePath);

    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(
        app.constants.house.width,
        app.constants.house.height,
        app.constants.house.depth,
        100,
        100
      ),
      new THREE.MeshStandardMaterial({
        map: colorTexture,
        aoMap: ambientOcclusionTexture,
        roughnessMap: roughnessTexture,
        normalMap: normalTexture,
        displacementMap: heightTexture,
        transparent: true,
        roughness: 1,
        aoMapIntensity: 0.5,
        displacementScale: 0,
      }),
    );

    walls.geometry.setAttribute('uv2', new THREE.BufferAttribute(walls.geometry.attributes.uv.array, 2));
    walls.position.y = (app.constants.house.height / 2) - app.constants.threshold;
    walls.receiveShadow = true;
    app.houseGroup.add(walls);
  },
  initRoof: () => {
    const colorTexture = app.textureLoader.load(roofColorTexturePath);
    const ambientOcclusionTexture = app.textureLoader.load(roofAmbientOcclusionTexturePath);
    const roughnessTexture = app.textureLoader.load(roofRoughnessTexturePath);
    const normalTexture = app.textureLoader.load(roofNormalTexturePath);
    const heightTexture = app.textureLoader.load(roofHeightTexturePath);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(
        app.constants.house.width,
        app.constants.house.roofHeight,
        4,
      ),
      new THREE.MeshStandardMaterial({
        map: colorTexture,
        aoMap: ambientOcclusionTexture,
        roughnessMap: roughnessTexture,
        normalMap: normalTexture,
        displacementMap: heightTexture,
        transparent: true,
        roughness: 1,
        aoMapIntensity: 0.1,
        displacementScale: 0,
      })
    );


    roof.geometry.setAttribute('uv2', new THREE.BufferAttribute(roof.geometry.attributes.uv.array, 2));
    roof.position.y = app.constants.house.roofHeight / 2 + app.constants.house.height;
    roof.rotation.y = Math.PI * 0.25;
    app.houseGroup.add(roof);
  },
  initDoor: () => {
    const colorTexture = app.textureLoader.load(doorColorTexturePath);
    const ambientOcclusionTexture = app.textureLoader.load(doorAmbientOcclusionTexturePath);
    const metallicTexture = app.textureLoader.load(doorMetallicTexturePath);
    const roughnessTexture = app.textureLoader.load(doorRoughnessTexturePath);
    const normalTexture = app.textureLoader.load(doorNormalTexturePath);
    const opacityTexture = app.textureLoader.load(doorOpacityTexturePath);
    const heightTexture = app.textureLoader.load(doorHeightTexturePath);

    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(
        app.constants.house.door.width,
        app.constants.house.door.height,
        100,
        100
      ),
      new THREE.MeshStandardMaterial({
        map: colorTexture,
        aoMap: ambientOcclusionTexture,
        metalnessMap: metallicTexture,
        roughnessMap: roughnessTexture,
        normalMap: normalTexture,
        alphaMap: opacityTexture,
        displacementMap: heightTexture,
        transparent: true,
        roughness: 0.5,
        aoMapIntensity: 0.5,
        displacementScale: 0.1,
      })
    );

    door.geometry.setAttribute('uv2', new THREE.BufferAttribute(door.geometry.attributes.uv.array, 2));

    door.position.y = app.constants.house.door.height / 2 + app.constants.house.doorsillHeight / 2;
    door.position.z = app.constants.house.depth / 2 + app.constants.threshold;
    app.houseGroup.add(door);
  },
  initDoorsill: () => {
    const colorTexture = app.textureLoader.load(doorsillColorTexturePath);
    const ambientOcclusionTexture = app.textureLoader.load(doorsillAmbientOcclusionTexturePath);
    const roughnessTexture = app.textureLoader.load(doorsillRoughnessTexturePath);
    const normalTexture = app.textureLoader.load(doorsillNormalTexturePath);
    const heightTexture = app.textureLoader.load(doorsillHeightTexturePath);

    colorTexture.repeat.set(2, 0.2);
    ambientOcclusionTexture.repeat.set(2, 0.2);
    roughnessTexture.repeat.set(2, 0.2);
    normalTexture.repeat.set(2, 0.2);
    heightTexture.repeat.set(2, 0.2);

    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;

    ambientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    ambientOcclusionTexture.wrapT = THREE.RepeatWrapping;

    roughnessTexture.wrapS = THREE.RepeatWrapping;
    roughnessTexture.wrapT = THREE.RepeatWrapping;

    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;

    heightTexture.wrapS = THREE.RepeatWrapping;
    heightTexture.wrapT = THREE.RepeatWrapping;
    const doorsill = new THREE.Mesh(
      new THREE.BoxGeometry(
        app.constants.house.door.width,
        app.constants.house.doorsillHeight,
        0.1,
        100,
        100,
      ),
      new THREE.MeshStandardMaterial({
        map: colorTexture,
        aoMap: ambientOcclusionTexture,
        roughnessMap: roughnessTexture,
        normalMap: normalTexture,
        displacementMap: heightTexture,
        transparent: true,
        roughness: 0.5,
        aoMapIntensity: 0.5,
        displacementScale: 0,
      })
    );

    doorsill.geometry.setAttribute('uv2', new THREE.BufferAttribute(doorsill.geometry.attributes.uv.array, 2));
    doorsill.position.y = app.constants.house.doorsillHeight / 2;
    doorsill.position.z = app.constants.house.depth / 2 + (app.constants.threshold * 2);
    app.houseGroup.add(doorsill);
  },
  initBushes: () => {
    const colorTexture = app.textureLoader.load(bushesColorTexturePath);
    const ambientOcclusionTexture = app.textureLoader.load(bushesAmbientOcclusionTexturePath);
    const roughnessTexture = app.textureLoader.load(bushesRoughnessTexturePath);
    const normalTexture = app.textureLoader.load(bushesNormalTexturePath);
    const heightTexture = app.textureLoader.load(bushesHeightTexturePath);

    const bushMaterial = new THREE.MeshStandardMaterial({
      map: colorTexture,
      aoMap: ambientOcclusionTexture,
      roughnessMap: roughnessTexture,
      normalMap: normalTexture,
      displacementMap: heightTexture,
      transparent: true,
      roughness: 0.5,
      aoMapIntensity: 0.1,
      displacementScale: 0,
    });

    const horizontalCubeBushGeometry = new THREE.BoxGeometry(
      app.constants.house.width,
      app.constants.bushes.cubeHeight,
      app.constants.bushes.cubeDepth,
    );
    const verticalCubeBushGeometry = new THREE.BoxGeometry(
      app.constants.house.depth + (app.constants.bushes.cubeDepth * 2),
      app.constants.bushes.cubeHeight,
      app.constants.bushes.cubeDepth,
    );
    const shortCubeBushGeometry = new THREE.BoxGeometry(
      (app.constants.house.width / 2) - (app.constants.house.door.width / 2),
      app.constants.bushes.cubeHeight,
      app.constants.bushes.cubeDepth,
    );

    // set short cube bushes
    for (let index = 0; index < 2; index++) {
      const shortCube = new THREE.Mesh(shortCubeBushGeometry, bushMaterial);
      shortCube.position.y = app.constants.bushes.cubeHeight / 2;
      shortCube.position.z = (app.constants.house.depth / 2) + (app.constants.bushes.cubeDepth / 2);
      shortCube.position.x = index
        ? app.constants.house.door.width / 2 + shortCubeBushGeometry.parameters.width / 2
        : -(app.constants.house.door.width / 2 + shortCubeBushGeometry.parameters.width / 2);

      shortCube.geometry.setAttribute('uv2', new THREE.BufferAttribute(shortCube.geometry.attributes.uv.array, 2));
      shortCube.castShadow = true;
      shortCube.receiveShadow = true;
      app.bushGroup.add(shortCube);
    }

    // set horizontal Cube Bush
    const horizontalCubeBush = new THREE.Mesh(horizontalCubeBushGeometry, bushMaterial);
    horizontalCubeBush.position.y = app.constants.bushes.cubeHeight / 2;
    horizontalCubeBush.position.z = -((app.constants.house.depth / 2) + (app.constants.bushes.cubeDepth / 2));
    horizontalCubeBush.geometry.setAttribute('uv2', new THREE.BufferAttribute(horizontalCubeBush.geometry.attributes.uv.array, 2));
    horizontalCubeBush.castShadow = true;
    horizontalCubeBush.receiveShadow = true;
    app.bushGroup.add(horizontalCubeBush);

    // set vertical Cube Bushes
    for (let index = 0; index < 2; index++) {
      const verticalCubeBush = new THREE.Mesh(verticalCubeBushGeometry, bushMaterial);
      verticalCubeBush.position.y = app.constants.bushes.cubeHeight / 2;
      verticalCubeBush.position.x = index
        ? app.constants.house.width / 2 + verticalCubeBushGeometry.parameters.depth / 2
        : -(app.constants.house.width / 2 + verticalCubeBushGeometry.parameters.depth / 2);

      verticalCubeBush.rotation.y = Math.PI / 2;
      verticalCubeBush.geometry.setAttribute('uv2', new THREE.BufferAttribute(verticalCubeBush.geometry.attributes.uv.array, 2));
      verticalCubeBush.castShadow = true;
      verticalCubeBush.receiveShadow = true;
      app.bushGroup.add(verticalCubeBush);
    }
  },
  initDoorLight: () => {
    const light = new THREE.PointLight('#ff7d46', 3, 3.5, 0.2);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    light.shadow.camera.near = 1;
    light.shadow.camera.far = 50;

    // light.shadow.camera.fov = 30;

    const doorLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 64, 64),
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        opacity: 0.8,
        transparent: true,
        emissive: 0xffffee,
      })
    );

    light.position.set(
      0,
      app.constants.house.height,
      app.constants.house.depth / 2 + 0.1
    );

    doorLight.material.emissiveIntensity = 0.5;
    light.add(doorLight);
    app.houseGroup.add(light);
  },
  initGraves: () => {
    const colorTexture = app.textureLoader.load(gravesColorTexturePath);
    const ambientOcclusionTexture = app.textureLoader.load(gravesAmbientOcclusionTexturePath);
    const roughnessTexture = app.textureLoader.load(gravesRoughnessTexturePath);
    const normalTexture = app.textureLoader.load(gravesNormalTexturePath);
    const heightTexture = app.textureLoader.load(gravesHeightTexturePath);

    const geometry = new THREE.BoxGeometry(0.5, 1, 0.2);
    const material = new THREE.MeshStandardMaterial({
      map: colorTexture,
      aoMap: ambientOcclusionTexture,
      roughnessMap: roughnessTexture,
      normalMap: normalTexture,
      displacementMap: heightTexture,
      transparent: true,
      roughness: 0.5,
      aoMapIntensity: 0.1,
      displacementScale: 0,
    });

    const points = generatePoints(30, 0.8);
    points.forEach(point => {
      const grave = new THREE.Mesh(geometry, material);
      grave.position.set(point.x, 0.3,  point.y);
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.castShadow = true;
      grave.receiveShadow = true;
      app.graveGroup.add(grave);
    });
  },
  ghostAnimation: () => {
    app.ghost.position.x = Math.cos(app.clock.getElapsedTime()) * 6;
    app.ghost.position.z = Math.sin(app.clock.getElapsedTime()) * 6;
    app.ghost.position.y = Math.sin(app.clock.getElapsedTime() * 2);
  },
  init: () => {
    document.querySelector('#app')!.appendChild(app.canvas);
    app.initScene();
    app.initCamera();
    app.initAmbientLight();
    app.initMoonLight();
    app.initFloor();
    app.initWalls();
    app.initRoof();
    app.initDoor();
    app.initDoorsill();
    app.initBushes();
    app.initDoorLight();
    app.initGraves();
    app.initRenderer();
    app.initControl();
    app.initListeners();
    app.tick();
  }
};

app.init();

