import React from "react";
import ReactDOM from "react-dom";

const WebsiteApp = function () {
  return (
    <>
      <h1>IrrRPG Builder 2.0w</h1>

      <a href="editor.html">Editor Login</a>
    </>
  );
};

export default {
  initializeReactApp: () =>
    ReactDOM.render(<WebsiteApp />, document.getElementById("reactRoot")),
};
