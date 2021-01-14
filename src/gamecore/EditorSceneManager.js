import { FreeCamera, Vector3, HemisphericLight } from "@babylonjs/core";

import * as BABYLON from "@babylonjs/core";

import UniversalInputManager, { LogicalInputs } from "./UniversalInputManager";

import Terrain from "./environment/Terrain";
import LightManager from "./environment/LightManager";

export default class EditorSceneManager {
  constructor(scene) {
    this.scene = scene;

    this.imgr = new UniversalInputManager(scene);

    //----- create children -----
    this.terrain = new Terrain(this.scene); //TODO: rename to TerrainManager (manages segments!!)
    this.lightManager = new LightManager(this.scene);
  }

  onStart() {
    //----- start children -----
    this.terrain.onStart();
    this.lightManager.onStart();

    //----- start self -----
    this.createEditorCamera();

    //----------------------------- temp stuff -----------------------
    this.box = BABYLON.MeshBuilder.CreateBox(
      "playerRef",
      { height: 2, width: 1, depth: 1 },
      this.scene
    );
    this.box.position = new BABYLON.Vector3(0, 1, 0);
    this.box.receiveShadows = true;
    this.lightManager.addShadowsTo(this.box);
    // Torus
    var torus = BABYLON.Mesh.CreateTorus("torus", 4, 2, 30, this.scene, false);
    torus.position = new BABYLON.Vector3(4, 3, 0);
    this.lightManager.addShadowsTo(torus);
  }

  onUpdate() {
    if (this.imgr.getInput(LogicalInputs.Action1)) {
      this.terrain.transform({
        x: this.imgr.getInput(LogicalInputs.PointerX),
        y: this.imgr.getInput(LogicalInputs.PointerY),
        factor: 1,
      });
    } else if (this.imgr.getInput(LogicalInputs.Action2)) {
      this.terrain.transform({
        x: this.imgr.getInput(LogicalInputs.PointerX),
        y: this.imgr.getInput(LogicalInputs.PointerY),
        factor: -1,
      });
    } else if (this.imgr.getInput(LogicalInputs.Action3)) {
      this.terrain.transform({
        x: this.imgr.getInput(LogicalInputs.PointerX),
        y: this.imgr.getInput(LogicalInputs.PointerY),
        factor: 0,
      });
    }

    //TODO: update all entities (onUpdate -- or "Step" from original IRB)
    // if (box !== undefined) {
    //   var deltaTimeInMillis = scene.getEngine().getDeltaTime();
    //   const rpm = 10;
    //   box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    // }
  }

  createEditorCamera(type) {
    this.camera = new FreeCamera(
      "EDITOR_CAMERA",
      new Vector3(0, 32, -32),
      this.scene
    );

    this.camera.setTarget(Vector3.Zero());

    const canvas = this.scene.getEngine().getRenderingCanvas();

    this.camera.attachControl(canvas, true);

    this.camera.inputs.clear();

    this.camera.maxZ = 500;

    //TODO: get inputs from "UniversalInputManager" (subclasses for PC/Mobile/etc..)
  }
}
