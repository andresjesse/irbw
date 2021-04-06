import React from "react";

import lang, { getAvailableLangs, getLangCode, setLangCode } from "../../lang";
import colors, { getAvailableThemes, getTheme, setTheme } from "../../colors";

import { useSelector, useDispatch } from "react-redux";
import Separator from "./GenericComponents/Separator";
import LabeledSelect from "./GenericComponents/LabeledSelect";
import localDb from "../../../services/localDb";

export default function (props) {
  const dispatch = useDispatch();

  //---------------------------------- Panel State
  const [langValue, setLangValue] = React.useState(getLangCode());
  const [themeValue, setThemeValue] = React.useState(getTheme());

  const [shadowDynamicKernelBlur, setShadowDynamicKernelBlur] = React.useState(
    localDb.get("shadowDynamicKernelBlur")?.toString() || "false"
  );

  const [shadowMapSize, setShadowMapSize] = React.useState(
    localDb.get("shadowMapSize") || 2048
  );

  //--------------------------------- Save Event
  const saveAndReload = () => {
    setLangCode(langValue);
    setTheme(themeValue);

    localDb.set("shadowDynamicKernelBlur", shadowDynamicKernelBlur == "true");
    localDb.set("shadowMapSize", parseInt(shadowMapSize));

    location.reload();
  };

  //--------------------------------- Panel render
  return (
    <div style={styles.container}>
      <div style={styles.leftContent}>
        {/* --------------------------
        
        Lang & Theme
        
        -------------------------- */}

        <div style={styles.contentBlock}>
          <LabeledSelect
            label={lang.get("editor_ui_language")}
            options={getAvailableLangs()}
            onChange={setLangValue}
            value={langValue}
          />

          <LabeledSelect
            label={lang.get("editor_ui_theme")}
            options={getAvailableThemes()}
            onChange={setThemeValue}
            value={themeValue}
          />
        </div>

        <Separator />

        {/* --------------------------
        
        Graphics Config 
        
        -------------------------- */}

        <div style={styles.contentBlock}>
          <LabeledSelect
            label={"shadowDynamicKernelBlur"}
            options={["true", "false"]}
            onChange={setShadowDynamicKernelBlur}
            value={shadowDynamicKernelBlur}
          />

          <LabeledSelect
            label={"shadowMapSize"}
            options={[512, 1024, 2048, 4096]}
            onChange={setShadowMapSize}
            value={shadowMapSize}
          />
        </div>

        <Separator />
      </div>

      <button style={styles.saveButton} onClick={() => saveAndReload()}>
        {lang.get("editor_ui_save_and_reload")}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: colors("panelBackground"),
    padding: 4,
    justifyContent: "space-between",
  },
  leftContent: {
    display: "flex",
    flexDirection: "row",
  },
  contentBlock: {
    display: "flex",
    flexDirection: "column",
    padding: "4pt",
    color: colors("foreground"),
    fontSize: "10pt",
  },
  saveButton: {
    border: 0,
    color: colors("highlight"),
    background: colors("panelBackground"),
    fontWeight: "bold",
    cursor: "pointer",
  },
};
