import * as GUI from "@babylonjs/gui";

//import store, { editorUiMainToolbarSetTab } from "../../ReduxStore";
import ComponentFactory from "../ComponentFactory";
import lang from "../lang";

export default class TabEnvironment {
  constructor(parent) {
    let height = "48px";
    let offsetTop = "32px";

    this.backgroundPanel = ComponentFactory.createPanel({
      parent: parent,
      width: 1,
      height: height,
      isBackground: false,
      isPointerBlocker: true,
      verticalAlignment: GUI.Control.VERTICAL_ALIGNMENT_TOP,
    });
    this.backgroundPanel.top = offsetTop;

    let bt = ComponentFactory.createButton({
      parent: this.backgroundPanel,
      name: "btPlay",
      text: "placeholder toolset env", //lang.get("editor_ui_"),
      width: "120px",
      height: height,
      padding: "4px",
    });

    bt.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  }

  setVisible(boolVal) {
    this.backgroundPanel.isVisible = boolVal;
  }
}
