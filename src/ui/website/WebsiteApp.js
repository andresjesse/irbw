import React from "react";
import ReactDOM from "react-dom";

const WebsiteApp = function () {
  return (
    <>
      <h1>IrrRPG Builder 2.0w</h1>

      <p>
        Soon you'll see a beautiful home page here.. for now, you can directly
        access our Editor tech demo (no sign-up required).
      </p>

      <a href="editor.html">Editor Login</a>
    </>
  );
};

export default {
  initializeReactApp: () =>
    ReactDOM.render(<WebsiteApp />, document.getElementById("reactRoot")),
};
