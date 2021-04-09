import React from "react";

import "./styles.css";

/**
 * @param props {label, options, onChange, value}
 */
const LabeledSelect = (props) => {
  return (
    <div className="labeledSelect-container">
      {props.label}

      <select
        name={props.label}
        value={props.value}
        className="labeledSelect-select"
        onChange={(e) => {
          props.onChange(e.currentTarget.value);
        }}
      >
        {props.options.map((op, index) => {
          return (
            <option key={index} value={op}>
              {op}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default LabeledSelect;
