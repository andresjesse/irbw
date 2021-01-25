const colors = {
  dark: {
    background: "#28272a",
    panelBackground: "#474747",
    foreground: "#f8f8f8",
    highlight: "#59e888",
    highlightAlternate: "#46d7fa",
    danger: "#ff5a5a",
  },

  light: {
    background: "#c9c9c9",
    panelBackground: "#f8f7f2",
    foreground: "#282826",
    highlight: "#1e9e61",
    highlightAlternate: "#3878b9",
    danger: "#ff3939",
  },
};

//theme management (requires page reload)
let theme = localStorage.getItem("theme") || "light";

const setTheme = function (newTheme) {
  localStorage.setItem("theme", newTheme);
};

const getTheme = function () {
  return theme;
};

//external getter for themes list
const getAvailableThemes = function () {
  return Object.keys(colors);
};

// external color getter
const get = function (colorKey) {
  return colors[theme][colorKey];
};

export { setTheme, getTheme, getAvailableThemes };
export default get;
