import React from "react";

import TerrainEditOptionsPanel from "./EnvironmentPanel/TerrainEditOptionsPanel";
import DayNightCyclePanel from "./EnvironmentPanel/DayNightCyclePanel";

import lang from "../../lang";
import colors from "../../colors";

import { useSelector, useDispatch } from "react-redux";
import { editorUiMainToolbarSetTool } from "../../../gamecore/ReduxStore";

import SvgButton from "./SvgButton";

export default function (props) {
  const activeTool = useSelector(
    (state) => state.editor.ui.mainToolbar.activeTool
  );

  const renderToolPanel = () => {
    switch (activeTool) {
      case "terrain_edit_level":
        return <TerrainEditOptionsPanel />;
      case "day_night_cycle":
        return <DayNightCyclePanel />;
      default:
        return <div />;
    }
  };

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

          <SvgButton
            name="terrain_soften_level"
            tileX={2}
            tileY={1}
            active={activeTool == "terrain_soften_level"}
            onClick={() => {
              dispatch(editorUiMainToolbarSetTool("terrain_soften_level"));
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

        {/* --------------------------
        
        Climate & Time Related Tools 
        
        -------------------------- */}

        <div style={styles.contentGrid}>
          <SvgButton
            name="day_night_cycle"
            tileX={0}
            tileY={3}
            active={activeTool == "day_night_cycle"}
            onClick={() => {
              dispatch(editorUiMainToolbarSetTool("day_night_cycle"));
            }}
          />

          <SvgButton
            name="climate_tool"
            tileX={1}
            tileY={3}
            active={activeTool == "climate_tool"}
            onClick={() => {
              dispatch(editorUiMainToolbarSetTool("climate_tool"));
            }}
          />
        </div>

        <div style={styles.separator} />
      </div>

      {renderToolPanel()}
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
    height: "fit-content",
    display: "inline-grid",
    gridTemplateRows: "repeat(2, auto)",
    gridAutoFlow: "column",
    padding: "4pt",
    color: colors("foreground"),
    fontSize: "10pt",
  },
  separator: {
    width: "2px",
    height: "98%",
    background: colors("background"),
    alignSelf: "center",
  },
};
