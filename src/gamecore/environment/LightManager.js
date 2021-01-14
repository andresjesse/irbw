import * as BABYLON from "@babylonjs/core";

export default class LightManager {
  constructor(scene) {
    this.scene = scene;

    this.scene.assetsManager.addTextureTask(
      "lightcycle",
      "textures/lightcycle.png"
    ).onSuccess = (task) => {
      this.lightcycleTexture = task.texture;
    };
  }

  onStart() {
    this.createLights();
    this.setupShadows();

    let h = 0;
    setInterval(() => {
      this.setTimeOfDay(h);

      h += 0.01;
      if (h >= 24) h = 0;
    }, 50);
  }

  addShadowsTo(obj) {
    this.shadowGenerator.getShadowMap().renderList.push(obj);
  }

  createLights() {
    //SUN
    this.directionalLight = new BABYLON.DirectionalLight(
      "directionalLight",
      new BABYLON.Vector3(-1, -2, 1),
      this.scene
    );

    this.directionalLight.position = new BABYLON.Vector3(20, 40, 20);
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
    console.log(timeIn24Hours);

    let pixels = this.lightcycleTexture.readPixels();

    // let ambientR =
    //   pixels[(timeIn24Hours / 24) * this.lightcycleTexture.getSize().width];
    // let ambientG =
    //   pixels[(timeIn24Hours / 24) * this.lightcycleTexture.getSize().width + 1];
    // let ambientB =
    //   pixels[(timeIn24Hours / 24) * this.lightcycleTexture.getSize().width + 2];

    // let directionalR =
    //   pixels[(timeIn24Hours / 24) * this.lightcycleTexture.getSize().width * 2];
    // let directionalG =
    //   pixels[
    //     (timeIn24Hours / 24) * this.lightcycleTexture.getSize().width * 2 + 1
    //   ];
    // let directionalB =
    //   pixels[
    //     (timeIn24Hours / 24) * this.lightcycleTexture.getSize().width * 2 + 2
    //   ];

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
  }

  //TODO: create a method "freezeTime(true/false) to pause day/night cycle"
}
