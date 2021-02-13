import store from "../ReduxStore";
import { LogicalInputs } from "../UniversalInputManager";

export default class VegetationPaint {
  constructor(smgr) {
    this.smgr = smgr;

    this.vegetationPaintOptions = store.getState().editor.ui.mainToolbar.vegetationPaintOptions;

    store.subscribe(() => {
      this.vegetationPaintOptions = store.getState().editor.ui.mainToolbar.vegetationPaintOptions;
    });
  }

  onUpdate() {
    if (this.smgr.imgr.getInput(LogicalInputs.Action1)) {
      this.smgr.terrain.paintVegetation({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
        brushSize: this.vegetationPaintOptions.brushSize * 0.1, // reduce UI Range size (adjusted to 0~10 units)
        density: this.vegetationPaintOptions.density * 0.1, // reduce UI Range size (adjusted to 0~10 units)
        bioma: this.vegetationPaintOptions.bioma,
        clear: false,
      });
    } else if (this.smgr.imgr.getInput(LogicalInputs.Action2)) {
      this.smgr.terrain.paintVegetation({
        x: this.smgr.imgr.getInput(LogicalInputs.PointerX),
        y: this.smgr.imgr.getInput(LogicalInputs.PointerY),
        brushSize: this.vegetationPaintOptions.brushSize * 0.1, // reduce UI Range size (adjusted to 0~10 units)
        clear: true,
      });
    }
  }
}
