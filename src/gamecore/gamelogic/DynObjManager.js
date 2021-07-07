import * as BABYLON from "@babylonjs/core";

import eventBus from "~/src/gamecore/EventBus";

import store, {
  editorUiMainToolbarSetGameLogicSelectedDynObj,
  editorUiMainToolbarSetGameLogicActiveScript,
} from "~/src/gamecore/ReduxStore";

export default class DynObjManager {
  constructor(scene) {
    this.scene = scene;

    //----- create children -----
    this.seqId = 1;
    this.instantiated = [];

    this.gizmoManager = new BABYLON.GizmoManager(scene);
    this.gizmoManager.usePointerToAttachGizmos = false;

    eventBus.on("setGizmo", (gizmo) => {
      this.gizmoManager.positionGizmoEnabled = gizmo == "move";
      this.gizmoManager.scaleGizmoEnabled = gizmo == "scale";
      this.gizmoManager.rotationGizmoEnabled = gizmo == "rotate";
    });

    //disable gizmos when activeTool is not gameLogic
    store.subscribe(() => {
      const activeTool = store.getState().editor.ui.mainToolbar.activeTool;

      if (activeTool != "gamelogic_edit_dynamic_objects") {
        this.attachGizmoToMesh(null);
      }
    });

    eventBus.on("setSelectedDynObjScript", (data) => {
      this.instantiated.forEach((dynObj) => {
        if (dynObj.id == data.selectedDynObj) {
          dynObj.script = data.selectedScript;
        }
      });
    });
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
      this.attachGizmoToMesh(pickinfo.pickedMesh);
      return;
    }

    this.attachGizmoToMesh(null);

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
    store.dispatch(
      editorUiMainToolbarSetGameLogicSelectedDynObj(instantiatedId)
    );

    let script = "";
    this.instantiated.forEach((dynObj) => {
      if (dynObj.id == instantiatedId) {
        script = dynObj.script;
      }
    });

    store.dispatch(editorUiMainToolbarSetGameLogicActiveScript(script));
  }

  attachGizmoToMesh(mesh) {
    this.gizmoManager.attachToMesh(mesh);
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
