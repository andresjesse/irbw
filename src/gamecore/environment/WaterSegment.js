import * as BABYLON from "@babylonjs/core";

import createCustomWaterMaterial from "../../materials/customWater/customWaterMaterial";

import { TerrainSegmentConfig } from "./TerrainSegment";

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

    this.ground = BABYLON.MeshBuilder.CreateGround(
      "water_" + this.id,
      {
        width: TerrainSegmentConfig.MESH_SIZE,
        height: TerrainSegmentConfig.MESH_SIZE,
        updatable: true,
        subdivisions: TerrainSegmentConfig.MESH_RESOLUTION - 1,
      },
      this.scene
    );

    let customWaterMaterial = createCustomWaterMaterial(this.scene);

    customWaterMaterial.setTexture("normalMap", this.textureWaternm);
    customWaterMaterial.setTexture("reflectionMap", this.textureClouds);

    this.ground.material = customWaterMaterial;
  }

  updateVerticesData(kind, data) {
    this.ground.updateVerticesData(kind, data);
  }
}
