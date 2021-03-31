import * as BABYLON from "@babylonjs/core";

import store, { smgrLightManagerSetTimeOfDay } from "../ReduxStore";

export default class LightManager {
  constructor(scene) {
    this.scene = scene;

    this.scene.assetsManager.addTextureTask(
      "lightcycle",
      "assets/generic/lightcycle.png"
    ).onSuccess = (task) => {
      this.lightcycleTexture = task.texture;
    };

    this.timeOfDay = store.getState().smgr.lightManager.timeOfDay;
    this.dynamic = store.getState().smgr.lightManager.dynamic;
    this.cycleDurationSec = store.getState().smgr.lightManager.cycleDurationSec;

    store.subscribe(() => {
      this.timeOfDay = store.getState().smgr.lightManager.timeOfDay;
      this.dynamic = store.getState().smgr.lightManager.dynamic;
      this.cycleDurationSec = store.getState().smgr.lightManager.cycleDurationSec;
    });
  }

  onStart() {
    this.createLights();
    this.setupShadows();

    //initialize light colors
    this.pixels = this.lightcycleTexture.readPixels();

    //default value
    this.setTimeOfDay(this.timeOfDay);

    //trigger updates
    this.scene.onBeforeAnimationsObservable.add(() => {
      this.setTimeOfDay(this.timeOfDay);

      if (this.dynamic) {
        this.timeOfDay += (17 / (this.cycleDurationSec * 1000)) * 24;
        if (this.timeOfDay >= 24) this.timeOfDay = 0;

        //notify changes to redux store.
        store.dispatch(smgrLightManagerSetTimeOfDay(this.timeOfDay));
      }
    });
  }

  // triggerDayNightCycle(durationInSeconds) {
  //   this.h = 0;

  //   this.scene.onBeforeAnimationsObservable.add(() => {
  //     this.setTimeOfDay(this.h);

  //     this.h += (17 / (durationInSeconds * 1000)) * 24;
  //     if (this.h >= 24) this.h = 0;
  //   });
  // }

  addShadowsTo(obj) {
    this.shadowGenerator.getShadowMap().renderList.push(obj);
  }

  createLights() {
    //SUN
    this.directionalLight = new BABYLON.DirectionalLight(
      "directionalLight",
      new BABYLON.Vector3(0, -1, 0),
      this.scene
    );

    this.directionalLight.position = new BABYLON.Vector3(0, 40, 20);
    this.directionalLight.intensity = 0.7;

    //AMBIENT
    this.ambientLight = new BABYLON.HemisphericLight(
      "ambientLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );

    this.ambientLight.intensity = 0.7;
  }

  setupShadows() {
    // Shadows (WebGL 2.0)
    // this.shadowGenerator = new BABYLON.CascadedShadowGenerator(1024, light);
    // this.shadowGenerator.splitFrustum(); //usar junto com this.camera.maxZ = 500

    // Shadows (WebGL 1.0+)
    //this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    //this.shadowGenerator.usePoissonSampling = true; //slower (how much?)
    //this.shadowGenerator.useExponentialShadowMap = true; //faster (mais feio, antigo, false desabilita todos os efeitos blur)

    /*
    //METODO NOVO (Self Shadows OK)
    //this.shadowGenerator.useCloseExponentialShadowMap = true; //metodo novo, sem antialias
    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    this.shadowGenerator.useBlurCloseExponentialShadowMap = true; //metodo novo, com antialias
    this.shadowGenerator.blurKernel = 4;
    this.shadowGenerator.useKernelBlur = true;
    light.shadowMinZ = 0;
    light.shadowMaxZ = this.camera.maxZ;
    */

    //WebGL 2.0 (automatic fallback to 1.0 when not compatible) (fast, better!)
    //TODO: This shadow technique (PCF) is showing glitches on the "first" day/night cycle when running Chrome/Ubuntu. Does not happen on Chrome/Mac.
    //  Option to fix: provide alternative shadow method in IRB Config (user can change)
    this.shadowGenerator = new BABYLON.ShadowGenerator(
      1024,
      this.directionalLight
    );
    this.shadowGenerator.usePercentageCloserFiltering = true;
    this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;

    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.useKernelBlur = true;
    this.shadowGenerator.blurKernel = 8;

    this.directionalLight.shadowFrustumSize = 30;

    //this.shadowGenerator.enableSoftTransparentShadow = true;
    this.shadowGenerator.transparencyShadow = true;

    //this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
  }

  setLightsColors(
    ambient,
    directional,
    ambientSpecular = null,
    directionalSpecular = null
  ) {
    this.ambientLight.diffuse = ambient;
    this.ambientLight.specular = ambientSpecular || ambient;

    this.directionalLight.diffuse = directional;
    this.directionalLight.specular = directionalSpecular || directional;
  }

  readPixel(pix, x, y, w) {
    return {
      r: pix[y * 4 * w + x * 4],
      g: pix[y * 4 * w + x * 4 + 1],
      b: pix[y * 4 * w + x * 4 + 2],
      a: pix[y * 4 * w + x * 4 + 3],
    };
  }

  setTimeOfDay(timeIn24Hours) {
    let pixelOffset = Math.floor(
      (timeIn24Hours / 24) * this.lightcycleTexture.getSize().width
    );

    let ambientRGBA = this.readPixel(
      this.pixels,
      pixelOffset,
      0,
      this.lightcycleTexture.getSize().width
    );

    let directionalRGBA = this.readPixel(
      this.pixels,
      pixelOffset,
      1,
      this.lightcycleTexture.getSize().width
    );

    this.setLightsColors(
      new BABYLON.Color3(
        ambientRGBA.r / 256,
        ambientRGBA.g / 256,
        ambientRGBA.b / 256
      ),
      new BABYLON.Color3(
        directionalRGBA.r / 256,
        directionalRGBA.g / 256,
        directionalRGBA.b / 256
      )
    );

    //normalize 24h time:
    //  result cycles between -1 and 1 with 12pm being equal to 0.
    let normTimeNoon = (12 - timeIn24Hours) / 12;

    //update sun direction
    let camPos =
      this.scene.smgr.cameraTransform?.position || BABYLON.Vector3.Zero();

    this.directionalLight.setDirectionToTarget(camPos);

    this.directionalLight.position.x =
      camPos.x - Math.sin(normTimeNoon * Math.PI) * 100;
    this.directionalLight.position.z =
      camPos.z + Math.cos(normTimeNoon * Math.PI) * 30 + 20;

    //update shadow blur
    //  normalized time is clamped between 2 and 16 (no negative blurKernel)
    this.shadowGenerator.blurKernel = Math.max(16 * Math.abs(normTimeNoon), 2);
  }

  //TODO: create a method "freezeTime(true/false) to pause day/night cycle"
}
