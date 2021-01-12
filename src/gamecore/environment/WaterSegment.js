import * as BABYLON from "@babylonjs/core";

import createCustomWaterMaterial from "../../materials/customWater/customWaterMaterial";

import Texture2DArrayHelper from "../../materials/helpers/Texture2DArrayHelper";

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

    //TODO: remove this after reverting water shader to sampler2D
    let t2D = Texture2DArrayHelper.createFromTextures(this.scene, [
      this.textureWaternm,
      this.textureClouds,
    ]);
    customWaterMaterial.setTexture("arrayTex", t2D);
  }
}
