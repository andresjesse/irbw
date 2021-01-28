import * as BABYLON from "@babylonjs/core";

import createCustomWaterMaterial from "../../materials/customWater/customWaterMaterial";

import { TerrainSegmentConfig } from "./TerrainSegment";

export default class WaterSegment {
  constructor(scene, id) {
    this.scene = scene;
    this.id = id;

    //----- create children -----

    //----- preload self assets -----

    this.scene.assetPreloader.preloadTexture("assets/water/waternm.jpg");
    this.scene.assetPreloader.preloadTexture("assets/water/clouds.jpg");
    this.scene.assetPreloader.preloadTexture("assets/water/foam.jpg");
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

    this.ground.position = new BABYLON.Vector3(
      parseInt(this.id.split("_")[0]) * TerrainSegmentConfig.MESH_SIZE,
      0,
      parseInt(this.id.split("_")[1]) * TerrainSegmentConfig.MESH_SIZE
    );

    let customWaterMaterial = createCustomWaterMaterial(this.scene);

    customWaterMaterial.setTexture(
      "normalMap",
      this.scene.assetPreloader.getTexture("assets/water/waternm.jpg")
    );

    customWaterMaterial.setTexture(
      "reflectionMap",
      this.scene.assetPreloader.getTexture("assets/water/clouds.jpg")
    );

    customWaterMaterial.setTexture(
      "foam",
      this.scene.assetPreloader.getTexture("assets/water/foam.jpg")
    );

    //if (this.id == "0_1")
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
