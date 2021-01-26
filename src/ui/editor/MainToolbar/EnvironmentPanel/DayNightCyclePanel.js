import React from "react";
import { Range } from "react-range";

import lang from "../../../lang";
import colors from "../../../colors";

export default function () {
  //TODO: load default values from Redux (useful when loading saved scene)
  const [timeOfDay, setTimeOfDay] = React.useState([50]);
  const [dynamic, setDynamic] = React.useState(false);
  const [speed, setSpeed] = React.useState(1.0);

  return (
    <div style={styles.contentBlock}>
      <div style={styles.brushConfigBlock}>
        {lang.get("editor_ui_day_night_cycle_config")}

        <div style={styles.contentRow}>
          <Range
            step={0.1}
            min={0}
            max={100}
            values={timeOfDay}
            onChange={(values) => setTimeOfDay(values)}
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
          {lang.get("editor_ui_day_night_cycle_dynamic")}
          <input
            name="dynamic"
            type="checkbox"
            checked={dynamic}
            onChange={(event) => setDynamic(event.target.checked)}
          />
        </div>

        {dynamic && (
          <div style={styles.contentRow}>
            {lang.get("editor_ui_day_night_cycle_speed")}

            {/* float input from: https://stackoverflow.com/questions/43687964/only-numbers-input-number-in-react */}
            <input
              style={styles.input}
              type="tel"
              value={speed}
              onChange={(e) => {
                const val = e.target.value;
                if (e.target.validity.valid) setSpeed(e.target.value);
                else if (val === "" || val === "-") setSpeed(val);
              }}
              pattern="^-?[0-9]\d*\.?\d*$"
              disabled={!dynamic}
            />
          </div>
        )}
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
    display: "flex",
    justifyContent: "space-between",
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
  input: {
    background: colors("background"),
    color: colors("foreground"),
    border: 0,
    marginLeft: "4px",
  },
};
