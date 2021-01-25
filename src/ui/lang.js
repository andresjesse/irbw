//TODO: migrate to separated files
const langData = {
  "en-US": {
    editor_ui_project: "Project",
    editor_ui_environment: "Environment",
    editor_ui_settings: "Settings",
    editor_ui_language: "Language",
    editor_ui_theme: "Theme",
    editor_ui_save_and_reload: "Save and Reload",
  },
  "pt-BR": {
    editor_ui_project: "Projeto",
    editor_ui_environment: "Ambiente",
    editor_ui_settings: "Configurações",
    editor_ui_language: "Idioma",
    editor_ui_theme: "Tema",
    editor_ui_save_and_reload: "Salvar e Recarregar",
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
