import React from "react";

import BrushOptionsPanel from "./EnvironmentPanel/BrushOptionsPanel";
import DayNightCyclePanel from "./EnvironmentPanel/DayNightCyclePanel";
import VegetationPaintPanel from "./EnvironmentPanel/VegetationPaintPanel";

import eventBus from "~/src/gamecore/EventBus";

import { useSelector, useDispatch } from "react-redux";
import { editorUiMainToolbarSetTool } from "~/src/gamecore/ReduxStore";

import Separator from "~/src/ui/editor/components/Separator";
import SvgButton from "~/src/ui/editor/components/SvgButton";

import "./styles.css";

export default function (props) {
  const activeTool = useSelector(
    (state) => state.editor.ui.mainToolbar.activeTool
  );

  const renderToolPanel = () => {
    switch (activeTool) {
      case "terrain_edit_level":
        return <BrushOptionsPanel />;
      case "terrain_normalize_level":
        return <BrushOptionsPanel />;
      case "terrain_soften_level":
        return <BrushOptionsPanel />;
      case "vegetation_paint":
        return <VegetationPaintPanel />;
      case "day_night_cycle":
        return <DayNightCyclePanel />;
      default:
        return <div />;
    }
  };

  const dispatch = useDispatch();

  return (
    <div className="toolbar-container">
      <div className="toolbar-horizontalBlock">
        {/* --------------------------
        
        Terrain Related Tools 
        
        -------------------------- */}

        <div className="toolbar-contentGrid">
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

          <SvgButton
            name="terrain_segments_edit"
            tileX={3}
            tileY={1}
            active={activeTool == "terrain_segments_edit"}
            onClick={() => {
              dispatch(editorUiMainToolbarSetTool("terrain_segments_edit"));
            }}
          />
        </div>

        <Separator />

        {/* --------------------------
        
        Vegetation Paint Related Tools 
        
        -------------------------- */}

        <div className="toolbar-contentGrid">
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

        <Separator />

        {/* --------------------------
        
        Climate & Time Related Tools 
        
        -------------------------- */}

        <div className="toolbar-contentGrid">
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

        <Separator />

        {/* --------------------------
        
        TEMP!!! NavMesh Updater
        
        -------------------------- */}

        <button
          onClick={() => {
            console.log("NavMesh Update - Test");
            eventBus.dispatch("updateNavMesh");
          }}
        >
          [[Temp]] Update NavMesh
        </button>
      </div>

      {renderToolPanel()}
    </div>
  );
}
