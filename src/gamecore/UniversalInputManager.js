/**
 * Transparent Input: Keyboard, Mouse, Touch, Gamepad
 * Logical Inputs:
 *  - MainAxis: x,y
 *  - SecondaryAxis: x,y
 *  - Action1: Mouse LB Click,
 *  - Action2: Mouse RB Click,
 *  - etc...
 * UI Graphics:
 *  - returned according to last physical input method
 *  - gui images for gamepad buttons, mouse buttons, keys.. etc
 */

import * as BABYLON from "@babylonjs/core";

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
class ImgrMouse {
  constructor(scene) {
    this.scene = scene;

    this.state = {
      x: 0,
      y: 0,
      buttons: [false, false, false],
    };

    //create a list of observers

    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          if (pointerInfo.event.button <= 2) {
            this.state.buttons[pointerInfo.event.button] = true;
          }
          break;
        case BABYLON.PointerEventTypes.POINTERUP:
          if (pointerInfo.event.button <= 2) {
            this.state.buttons[pointerInfo.event.button] = false;
          }
          //notify observers for bts
          break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
          this.state.x = pointerInfo.event.x;
          this.state.y = pointerInfo.event.y;
          break;
      }
    });
  }
}

export const LogicalInputs = {
  Action1: "Action1",
  Action2: "Action2",
  PointerX: "PointerX",
  PointerY: "PointerY",
};

export default class UniversalInputManager {
  constructor(scene) {
    this.scene = scene;

    this.imgrMouse = new ImgrMouse(scene);
  }

  getInput(logical) {
    switch (logical) {
      case LogicalInputs.Action1: // LEFT MOUSE
        //TODO: map Keyboard, Touch and Gamepad...
        return this.imgrMouse.state.buttons[0];
      case LogicalInputs.Action2: // RIGHT MOUSE
        //TODO: map Keyboard, Touch and Gamepad...
        return this.imgrMouse.state.buttons[2];
      case LogicalInputs.Action3: // MIDDLE MOUSE
        //TODO: map Keyboard, Touch and Gamepad...
        return this.imgrMouse.state.buttons[1];
      case LogicalInputs.PointerX:
        //TODO: map arrows and gamepad to update logical pointer position
        return this.imgrMouse.state.x;
      case LogicalInputs.PointerY:
        //TODO: map arrows and gamepad to update logical pointer position
        return this.imgrMouse.state.y;
    }
  }

  subscribeForInput(logical) {
    // switch (logical) {
    //   case LogicalInputs.Action1:
    //     this.imgrMouse.state.buttons[0]; //add observer for mb0
    // }
  }
}
