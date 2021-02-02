import store from "../ReduxStore";
import CameraMovement from "./CameraMovement";

import TerrainEditLevel from "./TerrainEditLevel";
import TerrainNormalizeLevel from "./TerrainNormalizeLevel";
import VegetationPaint from "./VegetationPaint";

export default class Toolset {
  constructor(smgr) {
    this.smgr = smgr;

    this.activeTool = store.getState().editor.ui.mainToolbar.activeTool;
    this.activeToolOptions = store.getState().editor.ui.mainToolbar.activeToolOptions;

    store.subscribe(() => {
      this.activeTool = store.getState().editor.ui.mainToolbar.activeTool;
      this.activeToolOptions = store.getState().editor.ui.mainToolbar.activeToolOptions;
    });
  }

  onStart() {
    this.tools = {
      camera_movement: new CameraMovement(this.smgr),
      terrain_edit_level: new TerrainEditLevel(this.smgr),
      terrain_normalize_level: new TerrainNormalizeLevel(this.smgr),
      vegetation_paint: new VegetationPaint(this.smgr),
    };
  }

  onUpdate() {
    this.tools[this.activeTool]?.onUpdate(this.activeToolOptions);

    // persistent tools (always updated)
    this.tools.camera_movement.onUpdate();
  }
}
