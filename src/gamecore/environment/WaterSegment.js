import * as BABYLON from "@babylonjs/core";

import createCustomWaterMaterial from "../../materials/customWater/customWaterMaterial";

import { TerrainSegmentConfig } from "./TerrainSegment";

export default class WaterSegment {
  constructor(scene, id) {
    this.scene = scene;
    this.id = id;

    //----- create children -----

    //----- preload self assets ----- TODO: check for singleton preloading (see VegetationSegment approach)

    this.scene.assetsManager.addTextureTask(
      "textureWaternm",
      "assets/water/waternm.jpg"
    ).onSuccess = (task) => {
      this.textureWaternm = task.texture;
    };

    this.scene.assetsManager.addTextureTask(
      "textureClouds",
      "assets/water/clouds.jpg"
    ).onSuccess = (task) => {
      this.textureClouds = task.texture;
    };

    this.scene.assetsManager.addTextureTask(
      "textureFoam",
      "assets/water/foam.jpg"
    ).onSuccess = (task) => {
      this.textureFoam = task.texture;
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
    customWaterMaterial.setTexture("foam", this.textureFoam);

    this.ground.material = customWaterMaterial;
  }

  updateVerticesData(kind, data) {
    var normals = this.ground.getVerticesData(BABYLON.VertexBuffer.NormalKind);

    //update mesh

    this.ground.updateVerticesData(kind, data);

    //recalculate normals

    BABYLON.VertexData.ComputeNormals(data, this.ground.getIndices(), normals);

    this.ground.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
  }
}
