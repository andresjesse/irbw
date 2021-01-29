/**
 * Transparent Input: Keyboard, Mouse, Touch, Gamepad
 * Logical Inputs:
 *  - MainAxis: x,y
 *  - SecondaryAxis: x,y
 *  - Action1: Mouse LB Click,
 *  - Action2: Mouse RB Click,
 *  - etc...
 * UI Graphics:
 *  - TODO: change input responses according to the last physical input method (seamless transition between mouse/keyboard/gamepad)
 *  - TODO: input methods cab be create from gui images for virtual gamepad buttons (mobile gameplay), mouse buttons, keys.. etc
 */

import * as BABYLON from "@babylonjs/core";

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

class ImgrKeyboard {
  constructor(scene) {
    this.scene = scene;

    this.state = {};

    this.scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:
          //console.log("KEY DOWN: ", kbInfo.event.key);
          //console.log("KEY UP: ", kbInfo.event.keyCode);
          this.state[kbInfo.event.key] = 1;
          break;
        case BABYLON.KeyboardEventTypes.KEYUP:
          this.state[kbInfo.event.key] = 0;
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
  MainAxisX: "MainAxisX",
  MainAxisY: "MainAxisY",
};

/**
 * Default Implementation:
 *  - Action1 = Left Mouse
 *  - Action2 = Right Mouse
 *  - Action3 = Middle Mouse
 *  - PointerX = Mouse Position X
 *  - PointerY = Mouse Position Y
 *  - MainAxisX = Keyboard a|A <- -> d|D
 *  - MainAxisY = Keyboard s|S \/ /\ w|W
 *
 *  Note: alternate InputManagers can be created rewritting this class :)
 */
export default class UniversalInputManager {
  constructor(scene) {
    this.scene = scene;

    this.imgrMouse = new ImgrMouse(scene);
    this.imgrKeyboard = new ImgrKeyboard(scene);
  }

  getInput(logical) {
    switch (logical) {
      case LogicalInputs.Action1: // mouse l
        return this.imgrMouse.state.buttons[0];
      case LogicalInputs.Action2: // mouse r
        return this.imgrMouse.state.buttons[2];
      case LogicalInputs.Action3: // mouse wheel
        return this.imgrMouse.state.buttons[1];
      case LogicalInputs.PointerX: // mouse x
        return this.imgrMouse.state.x;
      case LogicalInputs.PointerY: // mouse y
        return this.imgrMouse.state.y;
      case LogicalInputs.MainAxisX: // a|A d|D
        let positiveX = Math.max(
          this.imgrKeyboard.state["d"] || 0,
          this.imgrKeyboard.state["D"] || 0
        );
        let negativeX = Math.max(
          this.imgrKeyboard.state["a"] || 0,
          this.imgrKeyboard.state["A"] || 0
        );
        return positiveX - negativeX;
      case LogicalInputs.MainAxisY: // s|S w|W
        let positiveY = Math.max(
          this.imgrKeyboard.state["w"] || 0,
          this.imgrKeyboard.state["W"] || 0
        );
        let negativeY = Math.max(
          this.imgrKeyboard.state["s"] || 0,
          this.imgrKeyboard.state["S"] || 0
        );
        return positiveY - negativeY;
    }
  }

  subscribeForInput(logical) {
    //reserved for observers
  }
}
