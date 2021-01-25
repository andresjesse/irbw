//TODO: migrate to separated files
const langData = {
  "en-US": {
    editor_ui_project: "Project",
    editor_ui_environment: "Environment",
    editor_ui_settings: "Settings",
  },
  "pt-BR": {
    editor_ui_project: "Projeto",
    editor_ui_environment: "Ambiente",
    editor_ui_settings: "Configurações",
  },
};

//lang management (requires page reload)
let currentLang = localStorage.getItem("lang") || "en-US";

const setLangCode = function (newLang) {
  localStorage.setItem("lang", newLang);
};

const getLangCode = function () {
  return currentLang;
};

//external getter for langs list
const getAvailableLangs = function () {
  return Object.keys(langData);
};

//external getter
const get = function (id) {
  return langData[currentLang][id] || "undefined string [" + id + "]";
};

export { setLangCode, getLangCode, getAvailableLangs };
export default { get };
