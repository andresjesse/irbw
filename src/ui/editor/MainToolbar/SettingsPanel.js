import React from "react";

import { getAvailableLangs, getLangCode, setLangCode } from "../../lang";
import colors, { getAvailableThemes, getTheme, setTheme } from "../../colors";

import { useSelector, useDispatch } from "react-redux";

export default function (props) {
  const dispatch = useDispatch();

  const [langValue, setLangValue] = React.useState(getLangCode());
  const [themeValue, setThemeValue] = React.useState(getTheme());

  return (
    <div style={styles.container}>
      <select
        name="lang"
        value={langValue}
        onChange={(e) => {
          setLangValue(e.currentTarget.value);
          setLangCode(e.currentTarget.value);
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

      <select
        name="theme"
        value={themeValue}
        onChange={(e) => {
          setThemeValue(e.currentTarget.value);
          setTheme(e.currentTarget.value);
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

      <p>TODO: reload required!</p>
    </div>
  );
}

const styles = {
  container: {
    height: "64pt",
    display: "flex",
    flexDirection: "row",
    backgroundColor: colors("panelBackground"),
    padding: 4,
  },
};
