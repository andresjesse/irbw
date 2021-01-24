const colors = {
  dark: {
    background: "#28272a",
    panelBackground: "#474747",
    foreground: "#f8f8f8",
    hightlight: "#59e888",
    hightlightAlternate: "#46d7fa",
    danger: "#ff5a5a",
  },

  light: {
    background: "#c9c9c9",
    panelBackground: "#f8f7f2",
    foreground: "#282826",
    hightlight: "#1e9e61",
    hightlightAlternate: "#3878b9",
    danger: "#ff3939",
  },
};

//TODO: load theme from user prefs
const get = function (colorKey) {
  return colors["dark"][colorKey];
};

export default get;
