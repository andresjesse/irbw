import { LogicalInputs } from "../UniversalInputManager";

export default class VegetationPaint {
  constructor(smgr) {
    this.smgr = smgr;
  }

  onUpdate() {
    if (this.smgr.imgr.getInput(LogicalInputs.Action1)) {
      this.smgr.terrain.paintVegetation({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
      });
    } else if (this.smgr.imgr.getInput(LogicalInputs.Action2)) {
    }
  }
}
