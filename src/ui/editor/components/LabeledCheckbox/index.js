import React from "react";

import "./styles.css";

const LabeledCheckbox = (props) => (
  <div className="labeledCheckbox-container">
    {props.label}
    <input
      name={props.name}
      type="checkbox"
      checked={props.checked}
      onChange={(event) => props.onChange(event.target.checked)}
    />
  </div>
);

export default LabeledCheckbox;
