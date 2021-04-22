import localDb from "~/src/services/localDb";

const themesData = {
  dark: {
    "--background": "#28272a",
    "--panelBackground": "#5c5c5c",
    "--panelBackgroundLight": "#797979",

    "--foreground": "#f8f8f8",
    "--foregroundShaded": "#acacac",

    "--highlight": "#59e888",
    "--highlightShaded": "#4ccc77",
    "--highlightAlternate": "#46d7fa",

    "--danger": "#ff5a5a",
  },
  light: {
    "--background": "#8c8c8c",
    "--panelBackground": "#C2C2C2",
    "--panelBackgroundLight": "#F5F5F5",

    "--foreground": "#3D3D3D",
    "--foregroundShaded": "#1F1F1F",

    "--highlight": "#3d77c3",
    "--highlightShaded": "#2C578F",
    "--highlightAlternate": "#3DCEC3",

    "--danger": "#EB7024",
  },
};

const applyTheme = function (theme) {
  Object.keys(themesData[theme]).forEach((k) =>
    document.documentElement.style.setProperty(k, themesData[theme][k])
  );
};

const setTheme = function (newTheme) {
  localDb.set("theme", newTheme);
  //applyTheme(newTheme);
};

const getTheme = function () {
  return currentTheme;
};

//external getter for themes list
const getAvailableThemes = function () {
  return Object.keys(themesData);
};

let currentTheme = localDb.get("theme") || "dark";
applyTheme(currentTheme);

export { applyTheme, setTheme, getTheme, getAvailableThemes };
