import React from "react";

import { useSelector, useDispatch } from "react-redux";
//import { editorUiMainToolbarSetGameLogicSelectedDynObj } from "~/src/gamecore/ReduxStore";

import LabeledSelect from "~/src/ui/editor/components/LabeledSelect";

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
        </div>
      )}
    </div>
  );
}
