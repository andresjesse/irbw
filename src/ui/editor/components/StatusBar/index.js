import React from "react";

import { useSelector, useDispatch } from "react-redux";

import "./styles.css";

export default function (props) {
  const fps = useSelector((state) => state.editor.ui.fps);

  return (
    <div className="statusBar-container">
      <div className="statusBar-block">{/** Reserved for future use */}</div>
      <div className="statusBar-block">FPS:{fps.toFixed()}</div>
    </div>
  );
}
