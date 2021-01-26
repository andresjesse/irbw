import { FreeCamera, Vector3, HemisphericLight } from "@babylonjs/core";

import * as BABYLON from "@babylonjs/core";

import UniversalInputManager, { LogicalInputs } from "./UniversalInputManager";

import Terrain from "./environment/Terrain";
import LightManager from "./environment/LightManager";
import VegetationManager from "./environment/VegetationManager";
import EditorApp from "../ui/editor/EditorApp";

import Toolset from "./toolset/Toolset";

export default class EditorSceneManager {
  constructor(scene) {
    this.scene = scene;

    this.imgr = new UniversalInputManager(scene);

    //----- create children -----
    this.terrain = new Terrain(this.scene); //TODO: rename to TerrainManager (manages segments!!)
    this.lightManager = new LightManager(this.scene);
    // this.vegetationManager = new VegetationManager(this.scene);

    // Editor Toolset: applies UI tools/actions to Webgl context
    this.toolset = new Toolset(this);
  }

  onStart() {
    //----- start children -----
    this.terrain?.onStart();
    this.lightManager?.onStart();
    this.vegetationManager?.onStart();

    // UI
    EditorApp.initializeReactApp();

    // Toolset
    this.toolset?.onStart();

    //----- start self -----
    this.createEditorCamera();

    //----------------------------- temp stuff -----------------------
    // this.box = BABYLON.MeshBuilder.CreateBox(
    //   "playerRef",
    //   { height: 2, width: 1, depth: 1 },
    //   this.scene
    // );
    // this.box.position = new BABYLON.Vector3(0, 1, 0);
    // this.box.receiveShadows = true;
    // this.lightManager.addShadowsTo(this.box);
    // // Torus
    // var torus = BABYLON.Mesh.CreateTorus("torus", 4, 2, 30, this.scene, false);
    // torus.position = new BABYLON.Vector3(4, 3, 0);
    // this.lightManager.addShadowsTo(torus);
  }

  onUpdate() {
    /**
     * Toolset Update: apply terrain transformations, climate changes, etc.
     * according to React UI actions & Redux State.
     */
    this.toolset?.onUpdate();
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
