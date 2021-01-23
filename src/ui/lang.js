//TODO: migrate to separated files
const langData = {
  "en-US": {
    editor_ui_project: "Project",
    editor_ui_environment: "Environment",
  },
  "pt-BR": {
    editor_ui_project: "Projeto",
    editor_ui_environment: "Ambiente",
  },
};

//TODO: get from USER PREFERENCES
const currentLang = "en-US";

const get = function (id) {
  return langData[currentLang][id] || "undefined string [" + id + "]";
};

export default { get };
