import store, { editorUiSetFPS } from "./ReduxStore";

import { FreeCamera, Vector3, HemisphericLight } from "@babylonjs/core";

import * as BABYLON from "@babylonjs/core";

import UniversalInputManager, { LogicalInputs } from "./UniversalInputManager";
import AssetPreloader from "./AssetPreloader";

import Terrain from "./environment/Terrain";
import LightManager from "./environment/LightManager";
import EditorApp from "../ui/editor/EditorApp";

import Toolset from "./toolset/Toolset";

export default class EditorSceneManager {
  constructor(scene) {
    this.scene = scene;

    this.imgr = new UniversalInputManager(scene);
    this.scene.assetPreloader = new AssetPreloader(scene);

    //----- create children -----
    this.lightManager = new LightManager(this.scene);
    this.terrain = new Terrain(this.scene); //TODO: rename to TerrainManager (manages segments!!)

    // Editor Toolset: applies UI tools/actions to Webgl context
    this.toolset = new Toolset(this);
  }

  onStart() {
    //----- start children -----
    this.lightManager?.onStart();
    this.terrain?.onStart();

    // UI
    EditorApp.initializeReactApp();

    // Toolset
    this.toolset?.onStart();

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

    store.dispatch(editorUiSetFPS(this.scene.getEngine().getFps()));
  }

  createEditorCamera(type) {
    this.CAMERA_DEFAULT_POSITION = new Vector3(0, 32, -32);
    this.CAMERA_MIN_ZOOM = 10;
    this.CAMERA_MAX_ZOOM = 60;

    this.cameraTransform = new BABYLON.TransformNode("cameraTransform");

    this.camera = new FreeCamera(
      "EDITOR_CAMERA",
      this.CAMERA_DEFAULT_POSITION.clone(),
      this.scene
    );

    this.camera.parent = this.cameraTransform;

    this.camera.setTarget(this.cameraTransform.position);

    const canvas = this.scene.getEngine().getRenderingCanvas();

    this.camera.attachControl(canvas, true);

    this.camera.inputs.clear();

    this.camera.maxZ = 500;
  }
}
