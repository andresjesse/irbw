import * as GUI from "@babylonjs/gui";

import store, { editorUiMainToolbarSetTab } from "../../ReduxStore";
import ComponentFactory from "../ComponentFactory";
import lang from "../lang";
import TabEnvironment from "./_TabEnvironment";
import TabProject from "./_TabProject";

export default class MainToolbar {
  constructor(advancedTexture) {
    this.advancedTexture = advancedTexture;

    this.height = "32px";

    this.toolbarPanel = ComponentFactory.createPanel({
      parent: this.advancedTexture,
      width: 1,
      height: this.height,
      isBackground: true,
      isPointerBlocker: true,
      verticalAlignment: GUI.Control.VERTICAL_ALIGNMENT_TOP,
    });

    this.tabs = {};
    this.subpanels = {};

    //tabs selector (two panels)
    this.setupLeftPanel();
    this.setupRightPanel();

    //tabs subpanels
    this.subpanels["project"] = new TabProject(this.advancedTexture);
    this.subpanels["environment"] = new TabEnvironment(this.advancedTexture);

    //subscribe to redux
    store.subscribe(() => this.onUpdateState(store.getState()));

    //set default active tab
    store.dispatch(editorUiMainToolbarSetTab("environment"));
  }

  onUpdateState(state) {
    Object.keys(this.tabs).forEach((key) => {
      this.tabs[key].setHighlight(state.editor.ui.mainToolbar.activeTab == key);

      this.subpanels[key]?.setVisible(
        state.editor.ui.mainToolbar.activeTab == key
      );
    });
  }

  setupLeftPanel() {
    let leftStackPanel = ComponentFactory.createStackPanel({
      parent: this.toolbarPanel,
      isVertical: false,
      horizontalAlignment: GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
    });

    //add controls
    this.tabs["project"] = ComponentFactory.createImageTab({
      parent: leftStackPanel,
      name: "btProject",
      text: lang.get("editor_ui_project"),
      width: "120px",
      height: this.height,
      padding: "4px",
      onClick: () => store.dispatch(editorUiMainToolbarSetTab("project")),
    });

    this.tabs["environment"] = ComponentFactory.createImageTab({
      parent: leftStackPanel,
      name: "btEnvironment",
      text: lang.get("editor_ui_environment"),
      width: "120px",
      height: this.height,
      padding: "4px",
      onClick: () => store.dispatch(editorUiMainToolbarSetTab("environment")),
    });
  }

  //TEMP PLACEHOLDER!
  setupRightPanel() {
    let rightStackPanel = ComponentFactory.createStackPanel({
      parent: this.toolbarPanel,
      isVertical: false,
      horizontalAlignment: GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
    });

    //add controls
    ComponentFactory.createButton({
      parent: rightStackPanel,
      name: "btPlay",
      text: "Play", //lang.get("editor_ui_"),
      width: "80px",
      height: this.height,
      padding: "4px",
    });
  }
}
