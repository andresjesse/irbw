import * as GUI from "@babylonjs/gui";

import ComponentFactory from "./ComponentFactory";

import lang from "./lang";

const defaultLang = "en-US";

export default class EditorUI {
  constructor(scene) {
    this.scene = scene;
  }

  onStart() {
    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "EditorUI"
    );

    //TODO: provide an user configurable UI Scaling option (this.advancedTexture.idealWidth (or height) = USER_FACTOR;)

    this.createMainToolbar();
    this.createToolsetToolbar();
  }

  createMainToolbar() {
    let height = "48px";

    let toolbarPanel = ComponentFactory.createPanel({
      parent: this.advancedTexture,
      width: 1,
      height: height,
      isBackground: true,
      isPointerBlocker: true,
      verticalAlignment: GUI.Control.VERTICAL_ALIGNMENT_TOP,
    });

    //configure left panel
    let leftStackPanel = ComponentFactory.createStackPanel({
      parent: toolbarPanel,
      isVertical: false,
      horizontalAlignment: GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
    });

    //add controls to left panel
    let btProject = ComponentFactory.createButton({
      parent: leftStackPanel,
      name: "btProject",
      text: lang.get("editor_ui_project"),
      width: "80px",
      height: height,
      padding: "4px",
    });

    let btEnvironment = ComponentFactory.createButton({
      parent: leftStackPanel,
      name: "btEnvironment",
      text: lang.get("editor_ui_environment"),
      width: "120px",
      height: height,
      padding: "4px",
    });

    //configure right panel
    let rightStackPanel = ComponentFactory.createStackPanel({
      parent: toolbarPanel,
      isVertical: false,
      horizontalAlignment: GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
    });

    ComponentFactory.createButton({
      parent: rightStackPanel,
      name: "btPlay",
      text: "Play", //lang.get("editor_ui_"),
      width: "80px",
      height: height,
      padding: "4px",
    });
  }

  createToolsetToolbar() {
    let height = "48px";
    let offset = "48px";

    let backgroundPanel = ComponentFactory.createPanel({
      parent: this.advancedTexture,
      width: 1,
      height: height,
      isBackground: true,
      isPointerBlocker: true,
      verticalAlignment: GUI.Control.VERTICAL_ALIGNMENT_TOP,
    });
    backgroundPanel.top = offset;
  }
}
