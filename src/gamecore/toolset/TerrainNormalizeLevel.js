import { LogicalInputs } from "../UniversalInputManager";

export default class TerrainNormalizeLevel {
  constructor(smgr) {
    this.smgr = smgr;
  }

  onUpdate(options) {
    if (this.smgr.imgr.getInput(LogicalInputs.Action1)) {
      this.smgr.terrain.transform({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
        factor: 0,
      });
    }
  }
}
