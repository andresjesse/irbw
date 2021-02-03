import store from "../ReduxStore";
import { LogicalInputs } from "../UniversalInputManager";

export default class TerrainSegmentsEdit {
  constructor(smgr) {
    this.smgr = smgr;
  }

  onUpdate() {
    if (this.smgr.imgr.getInput(LogicalInputs.Action1)) {
      this.smgr.terrain.checkForSegmentChange({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
      });
    }
  }
}
