import store from "../ReduxStore";
import { LogicalInputs } from "../UniversalInputManager";

export default class DynObjTool {
  constructor(smgr) {
    this.smgr = smgr;

    this.activeTool = store.getState().editor.ui.mainToolbar.activeTool;

    store.subscribe(() => {
      this.activeTool = store.getState().editor.ui.mainToolbar.activeTool;
    });

    this.smgr.imgr.subscribeForInput(LogicalInputs.Action1, () => {
      if (this.activeTool == "gamelogic_edit_dynamic_objects") {
        this.smgr.dynObjManager.onClick({
          x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
          y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
        });
      }
    });
  }

  onUpdate() {
    // clicks are managed by callback in constructor
  }
}
