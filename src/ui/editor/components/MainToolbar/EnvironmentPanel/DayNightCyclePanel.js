import React from "react";
import { useSelector, useDispatch } from "react-redux";

import LabeledRange from "~/src/ui/editor/components/LabeledRange";
import LabeledFloatInput from "~/src/ui/editor/components/LabeledFloatInput";
import LabeledCheckbox from "~/src/ui/editor/components/LabeledCheckbox";

import lang from "~/src/ui/lang";

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
    <div className="toolbar-verticalBlock">
      {lang.get("editor_ui_day_night_cycle_config")}

      <div className="toolbar-contentRow">
        <LabeledRange
          label={
            lang.get("editor_ui_day_night_cycle") + ": " + timeOfDay.toFixed(0)
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

      <div className="toolbar-contentRow">
        <LabeledCheckbox
          label={lang.get("editor_ui_day_night_cycle_dynamic")}
          name="dynamic"
          checked={dynamic}
          onChange={(val) => dispatch(smgrLightManagerSetDynamic(val))}
        />
      </div>

      {dynamic && (
        <div className="toolbar-contentRow">
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
  );
}
