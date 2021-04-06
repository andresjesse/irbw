import React from "react";

import colors from "../../../colors";

/**
 * @param props {label, options, onChange, value}
 */
const LabeledSelect = (props) => {
  return (
    <div style={styles.container}>
      {props.label}

      <select
        name={props.label}
        value={props.value}
        style={styles.select}
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

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    marginTop: "4pt",
    marginBottom: "4pt",
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

export default LabeledSelect;
