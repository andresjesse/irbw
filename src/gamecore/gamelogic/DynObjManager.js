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

    //TODO: replace by a Factory. important: use also in this.restoreFromUserData()
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
    let userData = [];

    this.instantiated.forEach((i) => {
      userData.push({
        id: i.id,
        script: i.script,
        position: {
          x: i.mesh.position.x,
          y: i.mesh.position.y,
          z: i.mesh.position.z,
        },
        rotation: {
          x: i.mesh.rotation.x,
          y: i.mesh.rotation.y,
          z: i.mesh.rotation.z,
        },
        scale: {
          x: i.mesh.scaling.x,
          y: i.mesh.scaling.y,
          z: i.mesh.scaling.z,
        },
      });
    });

    return userData;
  }

  // api project load
  restoreFromUserData(userData) {
    console.log("load");

    let maxSeqId = 1;

    userData.forEach((i) => {
      let tokens = i.id.split("_");

      let templateId = tokens[tokens.length - 1];
      let seqId = parseInt(tokens[tokens.length - 2]);

      // TODO: use templateId to feed Factory

      const box = BABYLON.MeshBuilder.CreateBox(i.id, {}, this.scene);
      box.position = new BABYLON.Vector3(
        i.position.x,
        i.position.y,
        i.position.z
      );
      box.rotation = new BABYLON.Vector3(
        i.rotation.x,
        i.rotation.y,
        i.rotation.z
      );
      box.scaling = new BABYLON.Vector3(i.scale.x, i.scale.y, i.scale.z);

      this.instantiated.push({
        id: i.id,
        script: i.script,
        mesh: box,
      });

      // update seqId to match higher value in scene
      if (seqId > maxSeqId) maxSeqId = seqId;
    });

    this.seqId = maxSeqId + 1;
  }
}
