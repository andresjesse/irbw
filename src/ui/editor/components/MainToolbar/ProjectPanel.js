import React from "react";

import { useSelector, useDispatch } from "react-redux";

import "./styles.css";

export default function (props) {
  const dispatch = useDispatch();

  return (
    <div className="toolbar-container">
      <h1>Project Panel Placeholder</h1>
    </div>
  );
}
