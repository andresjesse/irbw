import * as BABYLON from "@babylonjs/core";

import TerrainSegment, { TerrainSegmentConfig } from "./TerrainSegment";

export default class Terrain {
  constructor(scene) {
    this.scene = scene;

    //----- create children -----
    this.segments = {
      "0_0": new TerrainSegment(this.scene, "0_0"),
      "1_0": new TerrainSegment(this.scene, "1_0"),
    };
  }

  onStart() {
    //----- start children -----
    Object.keys(this.segments).forEach((k) => this.segments[k].onStart());

    //----- start self -----
  }

  paintVegetation(options) {
    var pickinfo = this.scene.pick(
      options.x, //this.scene.pointerX
      options.y
      // function (mesh) { //TODO: predicate can be TERRAIN tag?
      //   return mesh == ground;
      // }
    );

    if (pickinfo.hit) {
      //return pickinfo.pickedPoint;

      //TODO: check distance to Segments (too far does not need to be trasformed, e.g. > 64 <<test>>?? )

      for (const key in this.segments) {
        this.segments[key].paintVegetation({
          pickedPoint: pickinfo.pickedPoint,
          brushRadius: 5, //TODO: get from UI
        });
      }
    }
  }

  transform(options) {
    var pickinfo = this.scene.pick(
      options.x, //this.scene.pointerX
      options.y
      // function (mesh) { //TODO: predicate can be TERRAIN tag?
      //   return mesh == ground;
      // }
    );

    if (pickinfo.hit) {
      let transformOptions = {
        pickedPoint: pickinfo.pickedPoint,
        brushSize: options.brushSize,
        brushStrength: options.brushStrength,
        factor: options.factor,
        soften: options.soften,
      };

      if (options.soften) {
        transformOptions["heightAvg"] = this.calculateAverageHeightInBrushRange(
          transformOptions
        );
      }

      for (const key in this.segments) {
        let seg = this.segments[key];

        //skip segments too far
        if (
          BABYLON.Vector3.Distance(
            seg.ground.position,
            transformOptions.pickedPoint
          ) >
          TerrainSegmentConfig.MESH_SIZE * 2
        )
          continue;

        seg.transform(transformOptions);
      }
    }
  }

  calculateAverageHeightInBrushRange(options) {
    let avg = 0;
    let vCount = 0;

    for (const key in this.segments) {
      let seg = this.segments[key];

      //skip segments too far
      if (
        BABYLON.Vector3.Distance(seg.ground.position, options.pickedPoint) >
        TerrainSegmentConfig.MESH_SIZE * 2
      )
        continue;

      let positions = seg.ground.getVerticesData(
        BABYLON.VertexBuffer.PositionKind
      );

      var numberOfVertices = positions.length / 3;

      for (let j = 0; j < numberOfVertices; j++) {
        let vDist = BABYLON.Vector3.Distance(
          new BABYLON.Vector3(
            positions[j * 3] + seg.ground.position.x,
            positions[j * 3 + 1] + seg.ground.position.y,
            positions[j * 3 + 2] + seg.ground.position.z
          ),
          options.pickedPoint
        );

        if (vDist <= options.brushSize) {
          avg += positions[j * 3 + 1] + seg.ground.position.y;
          vCount += 1;
        }
      }
    }

    return avg / vCount;
  }
}
