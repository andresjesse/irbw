import React from "react";
import { Range } from "react-range";
import { useSelector, useDispatch } from "react-redux";

import { editorUiMainToolbarSetBrushOptions } from "~/src/gamecore/ReduxStore";

import lang from "~/src/ui/lang";

import "./styles.css";

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
    <div className="toolbar-contentBlock">
      <div className="brushConfigBlock">
        {lang.get("editor_ui_brush_config")}

        <div className="brushConfigBlock-contentRow">
          {lang.get("editor_ui_brush_size")}

          <Range
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
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "2pt",
                  width: "100%",
                  backgroundColor: "var(--foregroundShaded)",
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "12pt",
                  width: "12pt",
                  backgroundColor: "var(--foreground)",
                }}
              />
            )}
          />
        </div>
        <div className="brushConfigBlock-contentRow">
          {lang.get("editor_ui_brush_strength")}

          <Range
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
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "2pt",
                  width: "100%",
                  backgroundColor: "var(--foregroundShaded",
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "12pt",
                  width: "12pt",
                  backgroundColor: "var(--foreground)",
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
