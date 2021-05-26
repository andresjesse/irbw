import React from "react";

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
      case "gamelogic_edit_global":
        return <div>Global Script Tool Placeholder</div>;
      case "gamelogic_edit_global":
        return <div>Player Script Tool Placeholder</div>;
      case "gamelogic_edit_dynamic_objects":
        return <div>Dynamic Objects Tool Placeholder</div>;
      default:
        return <div />;
    }
  };

  const dispatch = useDispatch();

  return (
    <div className="toolbar-container">
      <div className="toolbar-horizontalBlock">
        {/* --------------------------
        
        Scriptable Object related Tools 
        
        -------------------------- */}

        <div className="toolbar-contentGrid">
          <SvgButton
            name="gamelogic_edit_global"
            tileX={0}
            tileY={4}
            active={activeTool == "gamelogic_edit_global"}
            onClick={() => {
              dispatch(editorUiMainToolbarSetTool("gamelogic_edit_global"));
            }}
          />

          <SvgButton
            name="gamelogic_edit_player"
            tileX={1}
            tileY={4}
            active={activeTool == "gamelogic_edit_player"}
            onClick={() => {
              dispatch(editorUiMainToolbarSetTool("gamelogic_edit_player"));
            }}
          />

          <SvgButton
            name="gamelogic_edit_dynamic_objects"
            tileX={2}
            tileY={4}
            active={activeTool == "gamelogic_edit_dynamic_objects"}
            onClick={() => {
              dispatch(
                editorUiMainToolbarSetTool("gamelogic_edit_dynamic_objects")
              );
            }}
          />
        </div>

        <Separator />
      </div>

      {renderToolPanel()}
    </div>
  );
}
