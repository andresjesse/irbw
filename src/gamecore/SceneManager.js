import { FreeCamera, Vector3, HemisphericLight } from "@babylonjs/core";

import * as BABYLON from "@babylonjs/core";
import Terrain from "./Terrain";

/**
 * Scene Enumerable Types
 */
export const SmgrTypes = {
  CAMERA_EDITOR: 100,
};

export default class SceneManager {
  constructor(scene) {
    this.scene = scene;
  }

  onStart() {
    this.createCamera(SmgrTypes.CAMERA_EDITOR);
    this.createLights();
    this.createTerrain();

    //----------------------------- temp stuff -----------------------

    //pick
    //ground.actionManager = new BABYLON.ActionManager(this.scene);
    // ground.actionManager.registerAction(
    //   new BABYLON.ExecuteCodeAction(
    //     BABYLON.ActionManager.OnPickTrigger,
    //     function () {
    //       console.log("r button was pressed");
    //     }
    //   )
    // );
    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
        console.log(pointerInfo);

        this.terrain.transform();
      }
      // switch (pointerInfo.type) {
      //   case BABYLON.PointerEventTypes.POINTERDOWN:
      //     console.log("POINTER DOWN");
      //     break;
      //   case BABYLON.PointerEventTypes.POINTERUP:
      //     console.log("POINTER UP");
      //     break;
      //   case BABYLON.PointerEventTypes.POINTERMOVE:
      //     console.log("POINTER MOVE");
      //     break;
      //   case BABYLON.PointerEventTypes.POINTERWHEEL:
      //     console.log("POINTER WHEEL");
      //     break;
      //   case BABYLON.PointerEventTypes.POINTERPICK:
      //     console.log("POINTER PICK");
      //     break;
      //   case BABYLON.PointerEventTypes.POINTERTAP:
      //     console.log("POINTER TAP");
      //     break;
      //   case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
      //     console.log("POINTER DOUBLE-TAP");
      //     break;
      // }
    });
  }

  onUpdate() {
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

      //TODO: get inputs from "UniversalInputManager" (subclasses for PC/Mobile/etc..)
    }
  }

  createLights() {
    //TODO: armazenar varias lampadas em um objeto this.lights (global, points, etc...). configuraveis via editor
    let light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    light.intensity = 0.7;
  }

  createTerrain() {
    this.terrain = new Terrain(this.scene);
  }
}
