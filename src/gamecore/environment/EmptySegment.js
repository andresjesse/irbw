import * as BABYLON from "@babylonjs/core";

import { TerrainSegmentConfig } from "./TerrainSegment";

export default class EmptySegment {
  constructor(scene, id) {
    this.scene = scene;
    this.id = id;

    //----- create children -----

    //----- preload self assets -----

    this.scene.assetPreloader.preloadTexture(
      "assets/terrain/empty_segment.png"
    );
  }

  onStart() {
    //----- start children -----

    //----- start self -----

    this.ground = BABYLON.MeshBuilder.CreateGround(
      "empty_segment_" + this.id,
      {
        width: TerrainSegmentConfig.MESH_SIZE,
        height: TerrainSegmentConfig.MESH_SIZE,
        subdivisions: 0,
      },
      this.scene
    );

    this.ground.position = new BABYLON.Vector3(
      parseInt(this.id.split("_")[0]) * TerrainSegmentConfig.MESH_SIZE,
      0,
      parseInt(this.id.split("_")[1]) * TerrainSegmentConfig.MESH_SIZE
    );

    let mat = new BABYLON.StandardMaterial("emptySegment", this.scene);
    mat.diffuseTexture = this.scene.assetPreloader.getTexture(
      "assets/terrain/empty_segment.png"
    );
    mat.alpha = 0.3;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    mat.disableLighting = true;

    this.ground.material = mat;
  }

  dispose() {
    this.ground.dispose();
  }
}
