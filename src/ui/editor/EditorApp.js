import React from "react";
import ReactDOM from "react-dom";

import MainToolbar from "./MainToolbar";

import { Provider } from "react-redux";
import store from "../../gamecore/ReduxStore";

const EditorUI = function () {
  return (
    <>
      <Provider store={store}>
        <MainToolbar />
      </Provider>
    </>
  );
};

export default {
  initializeReactApp: () =>
    ReactDOM.render(<EditorUI />, document.getElementById("reactRoot")),
};
