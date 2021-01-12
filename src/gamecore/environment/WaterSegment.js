import * as BABYLON from "@babylonjs/core";

import createCustomWaterMaterial from "../../materials/customWater/customWaterMaterial";

export default class WaterSegment {
  constructor(scene) {
    this.scene = scene;

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

    var ground = BABYLON.Mesh.CreateGround("ground2", 100, 100, 32, this.scene);

    let customWaterMaterial = createCustomWaterMaterial(this.scene);

    customWaterMaterial.setTexture("normalMap", this.textureWaternm);
    customWaterMaterial.setTexture("reflectionMap", this.textureClouds);

    ground.material = customWaterMaterial;
  }
}
