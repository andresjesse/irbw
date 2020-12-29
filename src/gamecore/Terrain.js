import * as BABYLON from "@babylonjs/core";

import TerrainSegment from "./TerrainSegment";

//TODO: remove! test only
import store, { gameModeTerrainEdit, gameModeGameplay } from "./ReduxStore";
store.subscribe(() => console.log(store.getState()));

export default class Terrain {
  constructor(scene) {
    this.scene = scene;

    this.segments = {
      "0_0": new TerrainSegment(this.scene, "0_0"),
    };
  }

  transform() {
    var pickinfo = this.scene.pick(
      this.scene.pointerX,
      this.scene.pointerY
      // function (mesh) { //TODO: predicate can be TERRAIN tag?
      //   return mesh == ground;
      // }
    );

    if (pickinfo.hit) {
      //TODO: remove! test only
      store.dispatch(gameModeGameplay());
      store.dispatch(gameModeTerrainEdit());

      //return pickinfo.pickedPoint;

      //TODO: check distance to Segments (too far does not need to be trasformed, e.g. > 64 <<test>>?? )

      for (const key in this.segments) {
        this.segments[key].transform({
          pickedPoint: pickinfo.pickedPoint,
          brushRadius: 10,
        });
      }
    }
  }
}
