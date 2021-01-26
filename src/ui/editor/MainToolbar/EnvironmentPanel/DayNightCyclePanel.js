import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Range } from "react-range";

import lang from "../../../lang";
import colors from "../../../colors";
import {
  smgrLightManagerSetTimeOfDay,
  smgrLightManagerSetDynamic,
  smgrLightManagerSetCycleDurationSec,
} from "../../../../gamecore/ReduxStore";

export default function () {
  // const [dynamic, setDynamic] = React.useState(false);
  // const [cycleDurationSec, setCycleDurationSec] = React.useState(1.0);

  const timeOfDay = useSelector((state) => state.smgr.lightManager.timeOfDay);
  const dynamic = useSelector((state) => state.smgr.lightManager.dynamic);
  const cycleDurationSec = useSelector(
    (state) => state.smgr.lightManager.cycleDurationSec
  );

  const dispatch = useDispatch();

  return (
    <div style={styles.contentBlock}>
      <div style={styles.brushConfigBlock}>
        {lang.get("editor_ui_day_night_cycle_config")}

        <div style={styles.contentRow}>
          <Range
            step={0.1}
            min={0}
            max={24}
            values={[timeOfDay]}
            onChange={(values) =>
              dispatch(smgrLightManagerSetTimeOfDay(values[0]))
            }
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
            onChange={(event) =>
              dispatch(smgrLightManagerSetDynamic(event.target.checked))
            }
            //onChange={(event) => setDynamic(event.target.checked)}
          />
        </div>

        {dynamic && (
          <div style={styles.contentRow}>
            {lang.get("editor_ui_day_night_cycle_duration")}

            {/* float input from: https://stackoverflow.com/questions/43687964/only-numbers-input-number-in-react */}
            <input
              style={styles.input}
              type="tel"
              value={cycleDurationSec}
              onChange={(e) => {
                const val = e.target.value;
                if (e.target.validity.valid)
                  dispatch(smgrLightManagerSetCycleDurationSec(e.target.value));
                else if (val === "" || val === "-")
                  dispatch(smgrLightManagerSetCycleDurationSec(val));
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
