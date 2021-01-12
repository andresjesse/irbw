import { FreeCamera, Vector3, HemisphericLight } from "@babylonjs/core";

import * as BABYLON from "@babylonjs/core";

import UniversalInputManager, { LogicalInputs } from "./UniversalInputManager";

import Terrain from "./environment/Terrain";

/**
 * Scene Enumerable Types
 */
export const SmgrTypes = {
  CAMERA_EDITOR: 100,
};

export default class SceneManager {
  constructor(scene) {
    this.scene = scene;

    this.imgr = new UniversalInputManager(scene);

    //----- create children -----
    this.terrain = new Terrain(this.scene);
  }

  onStart() {
    this.createCamera(SmgrTypes.CAMERA_EDITOR);
    this.createLights();

    //----- start children -----
    this.terrain.onStart();

    //----- start self -----

    //----------------------------- temp stuff -----------------------
    this.box = BABYLON.MeshBuilder.CreateBox(
      "playerRef",
      { height: 2, width: 1, depth: 1 },
      this.scene
    );
    this.box.position = new BABYLON.Vector3(0, 1, 0);
    this.box.receiveShadows = true;
    this.shadowGenerator.getShadowMap().renderList.push(this.box);
    // Torus
    var torus = BABYLON.Mesh.CreateTorus("torus", 4, 2, 30, this.scene, false);
    torus.position = new BABYLON.Vector3(4, 3, 0);
    this.shadowGenerator.getShadowMap().renderList.push(torus);
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

  createCamera(type) {
    if (type === SmgrTypes.CAMERA_EDITOR) {
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

  createLights() {
    //TODO: armazenar varias lampadas em um objeto this.lights (global, points, etc...). configuraveis via editor
    // let light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    // light.intensity = 1;

    var light = new BABYLON.DirectionalLight(
      "dir01",
      new BABYLON.Vector3(-1, -2, -1),
      this.scene
    );
    light.position = new BABYLON.Vector3(20, 40, 20);
    light.intensity = 0.7;

    var light2 = new BABYLON.HemisphericLight(
      "HemiLight",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light2.intensity = 0.7;

    // Shadows (WebGL 2.0)
    // this.shadowGenerator = new BABYLON.CascadedShadowGenerator(1024, light);
    // this.shadowGenerator.splitFrustum(); //usar junto com this.camera.maxZ = 500

    // Shadows (WebGL 1.0+)
    //this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    //this.shadowGenerator.usePoissonSampling = true; //slower (how much?)
    //this.shadowGenerator.useExponentialShadowMap = true; //faster (mais feio, antigo, false desabilita todos os efeitos blur)
    /*
    //METODO NOVO (Self Shadows OK)
    //this.shadowGenerator.useCloseExponentialShadowMap = true; //metodo novo, sem antialias
    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    this.shadowGenerator.useBlurCloseExponentialShadowMap = true; //metodo novo, com antialias
    this.shadowGenerator.blurKernel = 4;
    this.shadowGenerator.useKernelBlur = true;
    light.shadowMinZ = 0;
    light.shadowMaxZ = this.camera.maxZ;
*/
    //WebGL 2.0 (automatic fallback to 1.0 when not compatible) (fast, better!)
    this.shadowGenerator = new BABYLON.ShadowGenerator(512, light);
    this.shadowGenerator.usePercentageCloserFiltering = true;
    this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
  }
}
