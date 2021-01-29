import store from "../ReduxStore";
import CameraMovement from "./CameraMovement";

import TerrainEditLevel from "./TerrainEditLevel";
import VegetationPaint from "./VegetationPaint";

export default class Toolset {
  constructor(smgr) {
    this.smgr = smgr;

    this.activeTool = store.getState().editor.ui.mainToolbar.activeTool;

    store.subscribe(() => {
      this.activeTool = store.getState().editor.ui.mainToolbar.activeTool;
    });
  }

  onStart() {
    this.tools = {
      camera_movement: new CameraMovement(this.smgr),
      terrain_edit_level: new TerrainEditLevel(this.smgr),
      vegetation_paint: new VegetationPaint(this.smgr),
    };
  }

  onUpdate() {
    this.tools[this.activeTool]?.onUpdate();

    // persistent tools (always updated)
    this.tools.camera_movement.onUpdate();
  }
}
