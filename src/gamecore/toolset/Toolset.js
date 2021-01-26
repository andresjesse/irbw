import store from "../ReduxStore";

import TerrainEditLevel from "./TerrainEditLevel";

export default class Toolset {
  constructor(smgr) {
    this.smgr = smgr;

    this.activeTool = null;

    store.subscribe(() => {
      this.activeTool = store.getState().editor.ui.mainToolbar.activeTool;
    });
  }

  onStart() {
    this.tools = {
      terrain_edit_level: new TerrainEditLevel(this.smgr),
    };
  }

  onUpdate() {
    this.tools[this.activeTool]?.onUpdate();

    //TODO: camera movement free (always updated)
  }
}
