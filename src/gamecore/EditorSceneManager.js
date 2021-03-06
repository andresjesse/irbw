import store, { editorUiSetFPS, userScriptsSetAll } from "./ReduxStore";
import eventBus from "./EventBus";

import { FreeCamera, Vector3 } from "@babylonjs/core";

import * as BABYLON from "@babylonjs/core";

import UniversalInputManager from "./UniversalInputManager";
import AssetPreloader from "./AssetPreloader";

import Terrain from "./environment/Terrain";
import LightManager from "./environment/LightManager";
import DynObjManager from "./gamelogic/DynObjManager";
import EditorApp from "../ui/editor/EditorApp";

import Toolset from "./toolset/Toolset";

import { saveProject } from "~/src/services/api";

export default class EditorSceneManager {
  constructor(scene) {
    this.scene = scene;

    this.imgr = new UniversalInputManager(scene);
    this.scene.assetPreloader = new AssetPreloader(scene);

    //----- create children -----
    this.lightManager = new LightManager(this.scene);
    this.terrain = new Terrain(this.scene);
    this.dynObjManager = new DynObjManager(this.scene);

    // Editor Toolset: applies UI tools/actions to Webgl context
    this.toolset = new Toolset(this);

    eventBus.on("saveUserData", () => this.saveUserData());
  }

  onStart() {
    //----- start children -----
    this.lightManager?.onStart();
    this.terrain?.onStart();
    this.dynObjManager?.onStart();

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

  loadUserData(project, sceneId) {
    // store this.userData
    this.userData = {
      project,
      sceneId,
    };

    //skip loading if userData is not present (loading a new/empty project)
    if (!this.userData.project.scenes[this.userData.sceneId].lightManager)
      return;
    if (!this.userData.project.scenes[this.userData.sceneId].terrain) return;

    console.log("Loading project userData...");

    // restore lightManager
    this.lightManager.restoreFromUserData(
      this.userData.project.scenes[this.userData.sceneId].lightManager
    );

    // restore terrainSegments, waterSegments, vegetationSegments from api data
    this.terrain.restoreFromUserData(
      this.userData.project.scenes[this.userData.sceneId].terrain
    );

    // restore user scripts (gameLogic)
    store.dispatch(userScriptsSetAll(this.userData.project.userScripts));

    // dynamic objects
    this.dynObjManager.restoreFromUserData(
      this.userData.project.scenes[this.userData.sceneId].dynamicObjects
    );
  }

  saveUserData() {
    // 1) collect info for this.userData

    // lightManager
    this.userData.project.scenes[this.userData.sceneId].lightManager =
      this.lightManager.collectUserData();

    // terrain
    this.userData.project.scenes[this.userData.sceneId].terrain =
      this.terrain.collectUserData();

    // user scripts (gameLogic)
    this.userData.project.userScripts = store.getState().userScripts;

    // dynamic objects
    this.userData.project.scenes[this.userData.sceneId].dynamicObjects =
      this.dynObjManager.collectUserData();

    // 2) send updated project to api
    saveProject(this.userData.project);
  }
}
