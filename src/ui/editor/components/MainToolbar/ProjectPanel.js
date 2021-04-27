import React from "react";

import eventBus from "~/src/gamecore/EventBus";

import { useSelector, useDispatch } from "react-redux";

import "./styles.css";

export default function (props) {
  const dispatch = useDispatch();

  return (
    <div className="toolbar-container">
      <h1>Project Panel Placeholder</h1>

      <button onClick={() => eventBus.dispatch("saveUserData")}>Save</button>
    </div>
  );
}
