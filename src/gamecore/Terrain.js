import * as BABYLON from "@babylonjs/core";

import TerrainSegment from "./TerrainSegment";

export default class Terrain {
  constructor(scene) {
    this.scene = scene;

    //----- create children -----
    this.segments = {
      "0_0": new TerrainSegment(this.scene, "0_0"),
    };
  }

  onStart() {
    //----- start children -----
    Object.keys(this.segments).forEach((k) => this.segments[k].onStart());

    //----- start self -----
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
      //return pickinfo.pickedPoint;

      //TODO: check distance to Segments (too far does not need to be trasformed, e.g. > 64 <<test>>?? )

      for (const key in this.segments) {
        this.segments[key].transform({
          pickedPoint: pickinfo.pickedPoint,
          brushRadius: 5,
          brushStrength: 0.05,
          factor: options.factor,
        });
      }
    }
  }
}
