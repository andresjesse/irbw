import React from "react";

import colors from "../../colors";
import store, { editorUiMainToolbarSetTab } from "../../../gamecore/ReduxStore";

import { useSelector, useDispatch } from "react-redux";

export default function (props) {
  const activeTab = useSelector(
    (state) => state.editor.ui.mainToolbar.activeTab
  );

  const dispatch = useDispatch();

  return (
    <div style={styles.container}>
      <div style={styles.horizontalBar}>
        <button
          style={activeTab == "project" ? styles.activeTab : styles.tab}
          onClick={() => dispatch(editorUiMainToolbarSetTab("project"))}
        >
          Project
        </button>
        <button
          style={activeTab == "environment" ? styles.activeTab : styles.tab}
          onClick={() => dispatch(editorUiMainToolbarSetTab("environment"))}
        >
          Environment
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors("background"),
    padding: 4,
  },
  horizontalBar: {
    display: "flex",
    flexDirection: "row",
  },
  tab: {
    borderWidth: 0,
    background: colors("background"),
    color: colors("foreground"),
    height: "24pt",
    marginRight: "2pt",
    cursor: "pointer",
  },
  activeTab: {
    borderWidth: 0,
    background: colors("panelBackground"),
    color: colors("foreground"),
    height: "24pt",
    fontWeight: "bold",
    marginRight: "2pt",
    cursor: "pointer",
  },
};
