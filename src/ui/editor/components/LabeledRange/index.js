import React from "react";
import { Range } from "react-range";

/**
 * This is a stylized Range
 *
 * @param props {step, min, max, values, onChange}
 * @returns
 */
const CustomRange = (props) => {
  return (
    <div>
      {props.label}
      <Range
        step={props.step}
        min={props.min}
        max={props.max}
        values={props.values}
        onChange={props.onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "2pt",
              width: "100%",
              borderRadius: "4pt",
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
              borderRadius: "4pt",
              backgroundColor: "var(--foreground)",
            }}
          />
        )}
      />
    </div>
  );
};
export default CustomRange;
