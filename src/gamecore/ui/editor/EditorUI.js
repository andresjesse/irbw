import * as GUI from "@babylonjs/gui";

import store, { editorUiMainToolbarSetTab } from "../../ReduxStore";
import ComponentFactory from "../ComponentFactory";
import lang from "../lang";

//partials
import MainToolbar from "./_MainToolbar";

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

    this.mainToolbar = new MainToolbar(this.advancedTexture);
  }
}
