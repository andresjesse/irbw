import React from "react";
import { Range } from "react-range";

import lang from "../../../lang";
import colors from "../../../colors";

export default function () {
  const [brushSize, setBrushSize] = React.useState([50]);
  const [brushStrength, setBrushStrength] = React.useState([50]);

  return (
    <div style={styles.contentBlock}>
      <div style={styles.brushConfigBlock}>
        Brush Configuration
        <div style={styles.contentRow}>
          Size
          <Range
            step={0.1}
            min={0}
            max={100}
            values={brushSize}
            onChange={(values) => setBrushSize(values)}
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
          Strength
          <Range
            step={0.1}
            min={0}
            max={100}
            values={brushStrength}
            onChange={(values) => setBrushStrength(values)}
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
  brushConfigBlock: {
    width: "200pt",
    paddingTop: "4pt",
    paddingBottom: "4pt",
  },
};
