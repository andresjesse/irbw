import React from "react";

import lang from "~/src/ui/lang";

import ProjectPanel from "./ProjectPanel";
import EnvironmentPanel from "./EnvironmentPanel";
import SettingsPanel from "./SettingsPanel";

import { useSelector, useDispatch } from "react-redux";
import { editorUiMainToolbarSetTab } from "~/src/gamecore/ReduxStore";

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

  const getTabClass = (tabName) => {
    return `toolbar-tab ${activeTab == tabName ? "toolbar-tab-active" : ""}`;
  };

  return (
    <div className="toolbar-rootContainer">
      <div className="toolbar-tabsContainer">
        <button
          className={getTabClass("project")}
          onClick={() => dispatch(editorUiMainToolbarSetTab("project"))}
        >
          {lang.get("editor_ui_project")}
        </button>

        <button
          className={getTabClass("environment")}
          onClick={() => dispatch(editorUiMainToolbarSetTab("environment"))}
        >
          {lang.get("editor_ui_environment")}
        </button>

        <button
          className={getTabClass("settings")}
          onClick={() => dispatch(editorUiMainToolbarSetTab("settings"))}
        >
          {lang.get("editor_ui_settings")}
        </button>
      </div>

      <RenderPanel />
    </div>
  );
}
