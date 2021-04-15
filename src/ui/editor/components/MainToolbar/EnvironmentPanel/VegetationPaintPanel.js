import React from "react";
import { useSelector, useDispatch } from "react-redux";

import LabeledRange from "~/src/ui/editor/components/LabeledRange";

import { editorUiMainToolbarSetVegetationPaintOptions } from "~/src/gamecore/ReduxStore";

import BiomaFactory from "~/src/gamecore/environment/vegetation/BiomaFactory";

import lang from "~/src/ui/lang";

export default function () {
  // configure options redux listener
  const options = useSelector(
    (state) => state.editor.ui.mainToolbar.vegetationPaintOptions
  );

  const dispatch = useDispatch();

  // Range values are stored in component's state
  const [brushSize, setBrushSize] = React.useState([options?.brushSize || 50]);
  const [density, setDensity] = React.useState([options?.density || 50]);

  const [bioma, setBioma] = React.useState(
    options?.bioma || BiomaFactory.asList()[0]
  );

  return (
    <div className="toolbar-verticalBlock">
      {lang.get("editor_ui_vegetation_config")}

      <div className="toolbar-contentRow">
        <LabeledRange
          label={lang.get("editor_ui_vegetation_brush_size")}
          step={0.01}
          min={0}
          max={100}
          values={[brushSize]}
          onChange={(values) => {
            setBrushSize(values);
            dispatch(
              editorUiMainToolbarSetVegetationPaintOptions({
                brushSize: values[0],
                density: density[0],
                bioma: bioma,
              })
            );
          }}
        />
      </div>

      <div className="toolbar-contentRow">
        <LabeledRange
          label={lang.get("editor_ui_vegetation_density")}
          step={0.01}
          min={0}
          max={100}
          values={[density]}
          onChange={(values) => {
            setDensity(values);
            dispatch(
              editorUiMainToolbarSetVegetationPaintOptions({
                brushSize: brushSize[0],
                density: values[0],
                bioma: bioma,
              })
            );
          }}
        />
      </div>

      <div className="toolbar-contentRow">
        {lang.get("editor_ui_vegetation_bioma")}
        <select
          name="bioma"
          value={bioma}
          className="brushConfigBlock-select"
          onChange={(e) => {
            setBioma(e.currentTarget.value);

            dispatch(
              editorUiMainToolbarSetVegetationPaintOptions({
                brushSize: brushSize[0],
                density: density[0],
                bioma: e.currentTarget.value,
              })
            );
          }}
        >
          {BiomaFactory.asList().map((value, index) => {
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
