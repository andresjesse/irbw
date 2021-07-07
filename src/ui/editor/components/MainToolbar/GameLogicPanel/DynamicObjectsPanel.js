import React from "react";
import eventBus from "~/src/gamecore/EventBus";

import { useSelector, useDispatch } from "react-redux";
import {
  editorUiMainToolbarSetGameLogicSelectedDynObj,
  editorUiMainToolbarSetGameLogicSelectedGizmo,
} from "~/src/gamecore/ReduxStore";

import LabeledSelect from "~/src/ui/editor/components/LabeledSelect";
import SvgButton from "~/src/ui/editor/components/SvgButton";

import dynObjTemplates from "~/src/services/dynObjTemplates";

import lang from "~/src/ui/lang";

import "./styles.css";

export default function () {
  const [dynObjTemplate, setDynObjTemplate] = React.useState(
    dynObjTemplates[0].name
  );

  const selectedDynObj = useSelector(
    (state) => state.editor.ui.mainToolbar.gameLogic.selectedDynObj
  );

  const selectedGizmo = useSelector(
    (state) => state.editor.ui.mainToolbar.gameLogic.selectedGizmo
  );

  const dispatch = useDispatch();

  return (
    <div>
      <div className="toolbar-verticalBlock">
        {lang.get("editor_ui_dynamic_objects")}

        <div className="toolbar-contentRow">
          <LabeledSelect
            label={lang.get("editor_ui_dynamic_objects_template")}
            options={dynObjTemplates.map((dyo) => dyo.name)}
            value={dynObjTemplate}
            onChange={(val) => {
              setDynObjTemplate(val);

              // dispatch(
              //   editorUiMainToolbarSetVegetationPaintOptions({
              //     brushSize: brushSize[0],
              //     density: density[0],
              //     bioma: val,
              //   })
              // );
            }}
          />
        </div>
      </div>

      {selectedDynObj && (
        <div className="gamelogic-dynobj-submenu-container">
          {lang.get("editor_ui_dynamic_object")}

          <div className="toolbar-contentRow">
            <b>id:</b> {selectedDynObj}
          </div>

          <div className="toolbar-contentRow">
            <SvgButton
              name="gizmo_move_tool"
              tileX={0}
              tileY={5}
              active={selectedGizmo == "move"}
              onClick={() => {
                eventBus.dispatch("setGizmo", "move");
                dispatch(editorUiMainToolbarSetGameLogicSelectedGizmo("move"));
              }}
            />

            <SvgButton
              name="gizmo_scale_tool"
              tileX={1}
              tileY={5}
              active={selectedGizmo == "scale"}
              onClick={() => {
                eventBus.dispatch("setGizmo", "scale");
                dispatch(editorUiMainToolbarSetGameLogicSelectedGizmo("scale"));
              }}
            />

            <SvgButton
              name="gizmo_rotate_tool"
              tileX={2}
              tileY={5}
              active={false}
              active={selectedGizmo == "rotate"}
              onClick={() => {
                eventBus.dispatch("setGizmo", "rotate");
                dispatch(
                  editorUiMainToolbarSetGameLogicSelectedGizmo("rotate")
                );
              }}
            />

            <SvgButton
              name="gizmo_delete_tool"
              tileX={3}
              tileY={5}
              active={false}
              // active={activeTool == "gizmo_move_tool"}
              onClick={() => {
                //dispatch(editorUiMainToolbarSetTool("gizmo_move_tool"));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
