import React from "react";

import colors from "../../colors";
import lang from "../../lang";

import ProjectPanel from "./ProjectPanel";
import EnvironmentPanel from "./EnvironmentPanel";
import SettingsPanel from "./SettingsPanel";

import { useSelector, useDispatch } from "react-redux";
import { editorUiMainToolbarSetTab } from "../../../gamecore/ReduxStore";

export default function (props) {
  const activeTab = useSelector(
    (state) => state.editor.ui.mainToolbar.activeTab
  );

  const dispatch = useDispatch();

  const RenderPanel = () => {
    switch (activeTab) {
      case "project":
        return <ProjectPanel />;
      case "environment":
        return <EnvironmentPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <div />;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.horizontalBar}>
        <button
          style={activeTab == "project" ? styles.activeTab : styles.tab}
          onClick={() => dispatch(editorUiMainToolbarSetTab("project"))}
        >
          {lang.get("editor_ui_project")}
        </button>

        <button
          style={activeTab == "environment" ? styles.activeTab : styles.tab}
          onClick={() => dispatch(editorUiMainToolbarSetTab("environment"))}
        >
          {lang.get("editor_ui_environment")}
        </button>

        <button
          style={activeTab == "settings" ? styles.activeTab : styles.tab}
          onClick={() => dispatch(editorUiMainToolbarSetTab("settings"))}
        >
          {lang.get("editor_ui_settings")}
        </button>
      </div>

      <RenderPanel />
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
