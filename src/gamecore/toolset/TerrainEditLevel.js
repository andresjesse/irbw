import { LogicalInputs } from "../UniversalInputManager";

export default class TerrainEditLevel {
  constructor(smgr) {
    this.smgr = smgr;
  }

  onUpdate() {
    if (this.smgr.imgr.getInput(LogicalInputs.Action1)) {
      this.smgr.terrain.transform({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
        factor: 1, //TODO: get factor from UI (brush configs)
      });
    } else if (this.smgr.imgr.getInput(LogicalInputs.Action2)) {
      this.smgr.terrain.transform({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
        factor: -1,
      });
    } else if (this.smgr.imgr.getInput(LogicalInputs.Action3)) {
      this.smgr.terrain.transform({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
        factor: 0,
      });
    }
  }
}
