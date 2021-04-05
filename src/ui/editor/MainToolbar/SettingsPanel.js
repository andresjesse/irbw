import React from "react";

import lang, { getAvailableLangs, getLangCode, setLangCode } from "../../lang";
import colors, { getAvailableThemes, getTheme, setTheme } from "../../colors";

import { useSelector, useDispatch } from "react-redux";
import Separator from "./GenericComponents/Separator";

export default function (props) {
  const dispatch = useDispatch();

  const [langValue, setLangValue] = React.useState(getLangCode());
  const [themeValue, setThemeValue] = React.useState(getTheme());

  const saveAndReload = () => {
    setLangCode(langValue);
    setTheme(themeValue);

    location.reload();
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftContent}>
        {/* --------------------------
        
        Lang & Theme
        
        -------------------------- */}

        <div style={styles.contentBlock}>
          <div style={styles.contentRow}>
            {lang.get("editor_ui_language")}

            <select
              name="lang"
              value={langValue}
              style={styles.select}
              onChange={(e) => {
                setLangValue(e.currentTarget.value);
              }}
            >
              {getAvailableLangs().map((lang, index) => {
                return (
                  <option key={index} value={lang}>
                    {lang}
                  </option>
                );
              })}
            </select>
          </div>

          <div style={styles.contentRow}>
            {lang.get("editor_ui_theme")}

            <select
              name="theme"
              value={themeValue}
              style={styles.select}
              onChange={(e) => {
                setThemeValue(e.currentTarget.value);
              }}
            >
              {getAvailableThemes().map((theme, index) => {
                return (
                  <option key={index} value={theme}>
                    {theme}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <Separator />

        {/* --------------------------
        
        Graphics Config 
        
        -------------------------- */}

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
  contentRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: "4pt",
    marginBottom: "4pt",
  },
  select: {
    marginRight: "2pt",
    border: 0,
    color: colors("foreground"),
    background: colors("panelBackground"),
    fontSize: "10pt",
    cursor: "pointer",
  },
  saveButton: {
    border: 0,
    color: colors("highlight"),
    background: colors("panelBackground"),
    fontWeight: "bold",
    cursor: "pointer",
  },
};
