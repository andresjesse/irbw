import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { editorUiMainToolbarSetBrushOptions } from "~/src/gamecore/ReduxStore";

import LabeledRange from "~/src/ui/editor/components/LabeledRange";

import lang from "~/src/ui/lang";

export default function () {
  // configure options redux listener
  const options = useSelector(
    (state) => state.editor.ui.mainToolbar.brushOptions
  );

  const dispatch = useDispatch();

  // Range values are stored in component's state
  const [brushSize, setBrushSize] = React.useState([options?.brushSize || 50]);
  const [brushStrength, setBrushStrength] = React.useState([
    options?.brushStrength || 50,
  ]);

  return (
    <div className="toolbar-verticalBlock">
      {lang.get("editor_ui_brush_config")}

      <div className="toolbar-contentRow">
        <LabeledRange
          label={lang.get("editor_ui_brush_size")}
          step={0.1}
          min={0}
          max={100}
          values={brushSize}
          onChange={(values) => {
            setBrushSize(values);
            dispatch(
              editorUiMainToolbarSetBrushOptions({
                brushSize: values[0],
                brushStrength: brushStrength[0],
              })
            );
          }}
        />
      </div>

      <div className="toolbar-contentRow">
        <LabeledRange
          label={lang.get("editor_ui_brush_strength")}
          step={0.1}
          min={0}
          max={100}
          values={brushStrength}
          onChange={(values) => {
            setBrushStrength(values);
            dispatch(
              editorUiMainToolbarSetBrushOptions({
                brushSize: brushSize[0],
                brushStrength: values[0],
              })
            );
          }}
        />
      </div>
    </div>
  );
}
