import React from "react";
import { Range } from "react-range";
import { useSelector, useDispatch } from "react-redux";

import { editorUiMainToolbarSetVegetationPaintOptions } from "../../../../gamecore/ReduxStore";

import { VegetationSegmentConfig } from "../../../../gamecore/environment/VegetationSegment";

import lang from "../../../lang";
import colors from "../../../colors";

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
    options?.bioma || VegetationSegmentConfig.biomas[0]
  );

  return (
    <div style={styles.contentBlock}>
      <div style={styles.brushConfigBlock}>
        {lang.get("editor_ui_vegetation_config")}

        <div style={styles.contentRow}>
          {lang.get("editor_ui_vegetation_brush_size")}

          <Range
            step={0.1}
            min={0}
            max={100}
            values={brushSize}
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
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "2pt",
                  width: "100%",
                  backgroundColor: colors("foregroundShaded"),
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
                  backgroundColor: colors("foreground"),
                }}
              />
            )}
          />
        </div>
        <div style={styles.contentRow}>
          {lang.get("editor_ui_vegetation_density")}

          <Range
            step={0.1}
            min={0}
            max={100}
            values={density}
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
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "2pt",
                  width: "100%",
                  backgroundColor: colors("foregroundShaded"),
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
                  backgroundColor: colors("foreground"),
                }}
              />
            )}
          />
        </div>

        <div style={styles.contentRow}>
          {lang.get("editor_ui_vegetation_bioma")}

          <select
            name="bioma"
            value={bioma}
            style={styles.select}
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
            {VegetationSegmentConfig.biomas.map((value, index) => {
              return (
                <option key={index} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}

const styles = {
  contentBlock: {
    display: "flex",
    flexDirection: "column",
    padding: "4pt",
    color: colors("foreground"),
    fontSize: "10pt",
  },
  contentRow: {
    marginTop: "8pt",
  },
  brushConfigBlock: {
    width: "200pt",
    paddingTop: "4pt",
    paddingBottom: "4pt",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
  },
  select: {
    marginRight: "2pt",
    border: 0,
    color: colors("foreground"),
    background: colors("panelBackground"),
    fontSize: "10pt",
    cursor: "pointer",
  },
};