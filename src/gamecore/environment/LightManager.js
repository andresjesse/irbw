import * as BABYLON from "@babylonjs/core";

export default class LightManager {
  constructor(scene) {
    this.scene = scene;

    this.scene.assetsManager.addTextureTask(
      "lightcycle",
      "assets/generic/lightcycle.png"
    ).onSuccess = (task) => {
      this.lightcycleTexture = task.texture;
    };
  }

  onStart() {
    this.createLights();
    this.setupShadows();

    //TEMP: loop day/night cycle for testing
    // let h = 0;
    // setInterval(() => {
    //   this.setTimeOfDay(h);

    //   h += 0.1;
    //   if (h >= 24) h = 0;
    // }, 50);

    this.setTimeOfDay(13);
  }

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
    this.shadowGenerator = new BABYLON.ShadowGenerator(
      512,
      this.directionalLight
    );
    this.shadowGenerator.usePercentageCloserFiltering = true;
    this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;

    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.useKernelBlur = true;
    this.shadowGenerator.blurKernel = 64;
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
    let pixels = this.lightcycleTexture.readPixels();

    let pixelOffset = Math.floor(
      (timeIn24Hours / 24) * this.lightcycleTexture.getSize().width
    );

    let ambientRGBA = this.readPixel(
      pixels,
      pixelOffset,
      0,
      this.lightcycleTexture.getSize().width
    );

    let directionalRGBA = this.readPixel(
      pixels,
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
    this.directionalLight.setDirectionToTarget(
      new BABYLON.Vector3(
        Math.sin(normTimeNoon * Math.PI) * 100,
        -1,
        -Math.cos(normTimeNoon * Math.PI) * 30 + 20
      )
    );

    //update shadow blur
    //  normalized time is clamped between 2 and 64 (no negative blurKernel)
    this.shadowGenerator.blurKernel = Math.max(64 * Math.abs(normTimeNoon), 2);

    // //update sun direction
    // this.directionalLight.setDirectionToTarget(
    //   new BABYLON.Vector3((12 - timeIn24Hours) * 10, -1, 0)
    // );

    // //update shadow blur
    // this.shadowGenerator.blurKernel = Math.max(
    //   64 * Math.abs((12 - timeIn24Hours) / 12),
    //   2
    // );

    //Fade between 18pm and 4am
    // if (timeIn24Hours < 4) {
    //   this.shadowGenerator.setDarkness((4 - timeIn24Hours) / 4);
    // } else if (timeIn24Hours > 18) {
    //   let n = 24 - timeIn24Hours;
    //   this.shadowGenerator.setDarkness((4 - n) / 4);
    // } else {
    //   this.shadowGenerator.setDarkness(0);
    // }
  }

  //TODO: create a method "freezeTime(true/false) to pause day/night cycle"
}
