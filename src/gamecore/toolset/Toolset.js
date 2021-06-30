import store from "../ReduxStore";
import CameraMovement from "./CameraMovement";

import TerrainEditLevel from "./TerrainEditLevel";
import TerrainNormalizeLevel from "./TerrainNormalizeLevel";
import TerrainSoftenLevel from "./TerrainSoftenLevel";
import TerrainSegmentsEdit from "./TerrainSegmentsEdit";
import VegetationPaint from "./VegetationPaint";
import NavMeshTool from "./NavMeshTool";
import DynObjTool from "./DynObjTool";

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
      terrain_normalize_level: new TerrainNormalizeLevel(this.smgr),
      terrain_soften_level: new TerrainSoftenLevel(this.smgr),
      terrain_segments_edit: new TerrainSegmentsEdit(this.smgr),
      vegetation_paint: new VegetationPaint(this.smgr),
      nav_mesh_tool: new NavMeshTool(this.smgr),
      gamelogic_edit_dynamic_objects: new DynObjTool(this.smgr),
    };
  }

  onUpdate() {
    this.tools[this.activeTool]?.onUpdate();

    // persistent tools (always updated)
    this.tools.camera_movement.onUpdate();
  }
}
