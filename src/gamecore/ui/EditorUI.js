import * as BABYLON from "@babylonjs/core";

export default class EditorUI {
  constructor(scene) {
    this.scene = scene;

    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "EditorUI"
    );

    this.createMainToolbar();
  }

  createMainToolbar() {
    this.mainToolbarPanel = new BABYLON.GUI.StackPanel();
    this.advancedTexture.addControl(mainToolbarPanel);
  }
}
