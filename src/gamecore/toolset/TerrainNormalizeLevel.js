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
        brushStrength: options.brushStrength * 0.0008, //reduce strength (adjusted for 60fps editing)
      });
    }
  }
}
