import store from "../ReduxStore";
import { LogicalInputs } from "../UniversalInputManager";

export default class TerrainEditLevel {
  constructor(smgr) {
    this.smgr = smgr;

    store.subscribe(() => {
      this.brushOptions = store.getState().editor.ui.mainToolbar.brushOptions;
    });
  }

  onUpdate() {
    let factor = null;

    if (this.smgr.imgr.getInput(LogicalInputs.Action1)) {
      if (this.smgr.imgr.getInput(LogicalInputs.EditorModifier1)) {
        factor = -1;
      } else {
        factor = 1;
      }
    } else if (this.smgr.imgr.getInput(LogicalInputs.Action2)) {
      factor = -1;
    } else if (this.smgr.imgr.getInput(LogicalInputs.Action3)) {
      factor = 0;
    }

    if (factor != null) {
      this.smgr.terrain.transform({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
        factor: factor,
        brushStrength: this.brushOptions.brushStrength * 0.0008, // reduce UI Range strength (adjusted for 60fps editing)
        brushSize: this.brushOptions.brushSize * 0.1, // reduce UI Range size (adjusted to 0~10 units)
      });
    }
  }
}
