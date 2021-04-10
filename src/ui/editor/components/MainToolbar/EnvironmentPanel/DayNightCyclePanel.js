import React from "react";
import { useSelector, useDispatch } from "react-redux";

import LabeledRange from "~/src/ui/editor/components/LabeledRange";
import LabeledFloatInput from "~/src/ui/editor/components/LabeledFloatInput";
import LabeledCheckbox from "~/src/ui/editor/components/LabeledCheckbox";

import lang from "~/src/ui/lang";

import "./styles.css";

import {
  smgrLightManagerSetTimeOfDay,
  smgrLightManagerSetDynamic,
  smgrLightManagerSetCycleDurationSec,
} from "~/src/gamecore/ReduxStore";

export default function () {
  const timeOfDay = useSelector((state) => state.smgr.lightManager.timeOfDay);
  const dynamic = useSelector((state) => state.smgr.lightManager.dynamic);
  const cycleDurationSec = useSelector(
    (state) => state.smgr.lightManager.cycleDurationSec
  );

  const dispatch = useDispatch();

  return (
    <div className="toolbar-contentBlock">
      <div className="brushConfigBlock">
        <div className="brushConfigBlock-contentRow">
          <LabeledRange
            label={
              lang.get("editor_ui_day_night_cycle_config") +
              ": " +
              timeOfDay.toFixed(0)
            }
            step={0.01}
            min={0}
            max={23.99}
            values={[timeOfDay]}
            onChange={(values) =>
              dispatch(smgrLightManagerSetTimeOfDay(values[0]))
            }
          />
        </div>

        <LabeledCheckbox
          label={lang.get("editor_ui_day_night_cycle_dynamic")}
          name="dynamic"
          checked={dynamic}
          onChange={(val) => dispatch(smgrLightManagerSetDynamic(val))}
        />

        {/* <div className="brushConfigBlock-contentRow">
          {lang.get("editor_ui_day_night_cycle_dynamic")}
          <input
            name="dynamic"
            type="checkbox"
            checked={dynamic}
            onChange={(event) =>
              dispatch(smgrLightManagerSetDynamic(event.target.checked))
            }
          />
        </div> */}

        {dynamic && (
          <div className="brushConfigBlock-contentRow">
            <LabeledFloatInput
              label={lang.get("editor_ui_day_night_cycle_duration")}
              value={cycleDurationSec}
              disabled={!dynamic}
              onChange={(val) =>
                dispatch(smgrLightManagerSetCycleDurationSec(val))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
