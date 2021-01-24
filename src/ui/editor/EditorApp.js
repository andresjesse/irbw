import React from "react";
import ReactDOM from "react-dom";

import MainToolbar from "./MainToolbar";

const EditorUI = function () {
  return (
    <>
      <MainToolbar />
    </>
  );
};

export default {
  initializeReactApp: () =>
    ReactDOM.render(<EditorUI />, document.getElementById("reactRoot")),
};
