//float input from: https://stackoverflow.com/questions/43687964/only-numbers-input-number-in-react
import React from "react";

import "./styles.css";

const LabeledFloatInput = (props) => (
  <div className="labeledFloatInput-container">
    {props.label}
    <input
      className="labeledFloatInput-input"
      type="tel"
      value={props.value}
      disabled={props.disabled}
      onChange={(e) => {
        const val = e.target.value;
        if (e.target.validity.valid) props.onChange(e.target.value);
        else if (val === "" || val === "-") props.onChange(val);
      }}
      pattern="^-?[0-9]\d*\.?\d*$"
    />
  </div>
);

export default LabeledFloatInput;
