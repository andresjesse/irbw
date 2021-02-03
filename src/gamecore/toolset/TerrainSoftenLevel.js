import store from "../ReduxStore";
import { LogicalInputs } from "../UniversalInputManager";

export default class TerrainSoftenLevel {
  constructor(smgr) {
    this.smgr = smgr;

    this.brushOptions = store.getState().editor.ui.mainToolbar.brushOptions;

    store.subscribe(() => {
      this.brushOptions = store.getState().editor.ui.mainToolbar.brushOptions;
    });
  }

  onUpdate() {
    if (this.smgr.imgr.getInput(LogicalInputs.Action1)) {
      this.smgr.terrain.transform({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
        brushStrength: this.brushOptions.brushStrength * 0.0008, // reduce UI Range strength (adjusted for 60fps editing)
        brushSize: this.brushOptions.brushSize * 0.1, // reduce UI Range size (adjusted to 0~10 units)
        soften: true,
      });
    }
  }
}
