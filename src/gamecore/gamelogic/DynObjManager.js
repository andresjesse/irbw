import * as BABYLON from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core";

import store, {
  editorUiMainToolbarSetGameLogicSelectedDynObj,
} from "~/src/gamecore/ReduxStore";

export default class DynObjManager {
  constructor(scene) {
    this.scene = scene;

    //----- create children -----
    this.seqId = 1;
    this.instantiated = [];
  }

  onStart() {
    //----- start children -----
    //----- start self -----
  }

  onClick(options) {
    // check for existing dynamic_object in position
    var pickinfo = this.scene.pick(options.x, options.y, (mesh) =>
      mesh.id.startsWith("dynamic_object_")
    );

    // show options menu if an object already exists
    if (pickinfo.hit) {
      this.showOptionsMenu(pickinfo.pickedMesh.id);
      return;
    }

    // no object in position, pick a point in terrain to create a new one
    var pickinfo = this.scene.pick(options.x, options.y, (mesh) =>
      mesh.id.startsWith("terrain_segment_")
    );

    if (pickinfo.hit) {
      this.instantiateNew(options, pickinfo.pickedPoint);
    }
  }

  instantiateNew(options, pos) {
    let templateId = "box";
    let id = "dynamic_object_" + this.seqId + "_" + templateId;

    const box = BABYLON.MeshBuilder.CreateBox(id, {}, this.scene);
    box.position = pos;

    this.instantiated.push({
      id,
      mesh: box,
    });

    this.seqId++;
  }

  showOptionsMenu(instantiatedId) {
    console.log("Show Options Menu for: " + instantiatedId);
    store.dispatch(
      editorUiMainToolbarSetGameLogicSelectedDynObj(instantiatedId)
    );
  }

  // api project save
  collectUserData() {
    let userData = {
      segments: {},
    };

    //TODO: collect

    return userData;
  }

  // api project load
  restoreFromUserData(userData) {
    this.userData = userData;

    //TODO: initialize!
  }
}
