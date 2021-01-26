import React from "react";

import TerrainEditOptionsPanel from "./EnvironmentPanel/TerrainEditOptionsPanel";

import lang from "../../lang";
import colors from "../../colors";

import { useSelector, useDispatch } from "react-redux";
import { editorUiMainToolbarSetTool } from "../../../gamecore/ReduxStore";

import SvgButton from "./SvgButton";

export default function (props) {
  const activeTool = useSelector(
    (state) => state.editor.ui.mainToolbar.activeTool
  );

  const dispatch = useDispatch();

  return (
    <div style={styles.container}>
      <div style={styles.buttonsDiv}>
        {/* --------------------------
        
        Terrain Related Tools 
        
        -------------------------- */}

        <div style={styles.contentGrid}>
          <SvgButton
            name="terrain_edit_level"
            tileX={0}
            tileY={1}
            active={activeTool == "terrain_edit_level"}
            onClick={() => {
              dispatch(editorUiMainToolbarSetTool("terrain_edit_level"));
            }}
          />

          <SvgButton
            name="terrain_normalize_level"
            tileX={1}
            tileY={1}
            active={activeTool == "terrain_normalize_level"}
            onClick={() => {
              dispatch(editorUiMainToolbarSetTool("terrain_normalize_level"));
            }}
          />
        </div>

        {/* --------------------------
        
        Vegetation Paint Related Tools 
        
        -------------------------- */}

        <div style={styles.separator} />

        <div style={styles.contentGrid}>
          <SvgButton
            name="vegetation_paint"
            tileX={0}
            tileY={2}
            active={activeTool == "vegetation_paint"}
            onClick={() => {
              dispatch(editorUiMainToolbarSetTool("vegetation_paint"));
            }}
          />
        </div>

        <div style={styles.separator} />
      </div>

      <TerrainEditOptionsPanel />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: colors("panelBackground"),
    padding: 4,
    justifyContent: "space-between",
  },
  buttonsDiv: {
    display: "flex",
    flexDirection: "row",
  },
  contentGrid: {
    display: "inline-grid",
    gridTemplateRows: "repeat(2, auto)",
    gridAutoFlow: "column",
    padding: "4pt",
    color: colors("foreground"),
    fontSize: "10pt",
  },
  separator: {
    width: "2pt",
    height: "64pt",
    background: colors("background"),
    alignSelf: "center",
  },
};
