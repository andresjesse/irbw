import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import store from "../../gamecore/ReduxStore";

import MainToolbar from "./MainToolbar";
import StatusBar from "./StatusBar";

import "./editor-global.css";

const EditorUI = function () {
  return (
    <>
      <Provider store={store}>
        <MainToolbar />
        <StatusBar />
      </Provider>
    </>
  );
};

export default {
  initializeReactApp: () =>
    ReactDOM.render(<EditorUI />, document.getElementById("reactRoot")),
};
