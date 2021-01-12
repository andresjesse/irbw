import * as BABYLON from "@babylonjs/core";

import createCustomWaterMaterial from "../../materials/customWater/customWaterMaterial";

export default class WaterSegment {
  constructor(scene, id) {
    this.scene = scene;
    this.id = id;

    //----- create children -----

    //----- preload self assets -----

    this.scene.assetsManager.addTextureTask(
      "textureWaternm",
      "textures/waternm.jpg"
    ).onSuccess = (task) => {
      this.textureWaternm = task.texture;
    };

    this.scene.assetsManager.addTextureTask(
      "textureClouds",
      "textures/clouds.jpg"
    ).onSuccess = (task) => {
      this.textureClouds = task.texture;
    };
  }

  onStart() {
    //----- start children -----

    //----- start self -----

    var ground = BABYLON.Mesh.CreateGround(
      "water_" + this.id,
      100,
      100,
      32,
      this.scene
    );

    let customWaterMaterial = createCustomWaterMaterial(this.scene);

    customWaterMaterial.setTexture("normalMap", this.textureWaternm);
    customWaterMaterial.setTexture("reflectionMap", this.textureClouds);

    ground.material = customWaterMaterial;

    //temp

    let data1 = this.textureWaternm.readPixels();
    let data2 = this.textureClouds.readPixels();

    let data = new Uint8Array([...data1, ...data2]);

    let t2D = new BABYLON.RawTexture2DArray(
      data,
      1024, //width
      1024, //height
      2, //layers
      BABYLON.Engine.TEXTUREFORMAT_RGBA,
      this.scene,
      true, //mipmaps
      false, //inverty
      BABYLON.Texture.NEAREST_SAMPLINGMODE
    );

    customWaterMaterial.setTexture("arrayTex", t2D);

    // console.log(generateArray(this.textureWaternm, this.textureClouds));
  }
}
