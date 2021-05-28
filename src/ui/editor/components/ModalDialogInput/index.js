import React from "react";

import lang from "~/src/ui/lang";

import "./styles.css";

export default function (props) {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <div className="modaldialog-container">
      <div className="modaldialog-innerbox">
        <div className="modaldialog-title">{props.title}</div>

        <div>{props.text}</div>

        <input
          className="modaldialog-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="modaldialog-bottom-actions">
          <button className="modaldialog-button" onClick={props.onCancel}>
            {lang.get("editor_ui_modaldialog_cancel")}
          </button>
          <button
            className="modaldialog-button"
            onClick={() => {
              props.onSubmit(inputValue);
              props.onCancel();
            }}
          >
            {lang.get("editor_ui_modaldialog_ok")}
          </button>
        </div>
      </div>
    </div>
  );
}
