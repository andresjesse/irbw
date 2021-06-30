import localDb from "../services/localDb";

//TODO: migrate to separated files
const langData = {
  "en-US": {
    editor_ui_project: "Project",
    editor_ui_environment: "Environment",
    editor_ui_gamelogic: "Game Logic",
    editor_ui_settings: "Settings",
    editor_ui_language: "Language",
    editor_ui_theme: "Theme",
    editor_ui_save_and_reload: "Save and Reload",
    editor_ui_brush_config: "Brush Configuration",
    editor_ui_brush_size: "Size",
    editor_ui_brush_strength: "Strength",
    editor_ui_vegetation_config: "Forest Configuration",
    editor_ui_vegetation_brush_size: "Brush Size",
    editor_ui_vegetation_density: "Density",
    editor_ui_vegetation_bioma: "Bioma",
    editor_ui_day_night_cycle_config: "Time of Day Configuration",
    editor_ui_day_night_cycle: "Time of Day",
    editor_ui_day_night_cycle_dynamic: "Dynamic Mode",
    editor_ui_day_night_cycle_duration: "Cycle Duration (seconds)",
    editor_ui_modaldialog_cancel: "Cancel",
    editor_ui_modaldialog_ok: "OK",
    editor_ui_gamelogic_createscript: "Create Script",
    editor_ui_gamelogic_createscript_text: "Insert new Script filename:",
    editor_ui_dynamic_objects: "Dynamic Objects",
    editor_ui_dynamic_objects_template: "Template",
  },
  "pt-BR": {
    editor_ui_project: "Projeto",
    editor_ui_environment: "Ambiente",
    editor_ui_gamelogic: "Lógica do Jogo",
    editor_ui_settings: "Configurações",
    editor_ui_language: "Idioma",
    editor_ui_theme: "Tema",
    editor_ui_save_and_reload: "Salvar e Recarregar",
    editor_ui_brush_config: "Configuração do Pincel",
    editor_ui_brush_size: "Tamanho",
    editor_ui_brush_strength: "Força",
    editor_ui_vegetation_config: "Configurações da Floresta",
    editor_ui_vegetation_brush_size: "Tamanho do Pincel",
    editor_ui_vegetation_density: "Densidade",
    editor_ui_vegetation_bioma: "Bioma",
    editor_ui_day_night_cycle_config: "Configuração da Hora do Dia",
    editor_ui_day_night_cycle: "Hora do Dia",
    editor_ui_day_night_cycle_dynamic: "Modo Dinâmico",
    editor_ui_day_night_cycle_duration: "Duração do Ciclo (segundos)",
    editor_ui_modaldialog_cancel: "Cancelar",
    editor_ui_modaldialog_ok: "OK",
    editor_ui_gamelogic_createscript: "Criar Script",
    editor_ui_gamelogic_createscript_text: "Insira um nome para o novo Script:",
    editor_ui_dynamic_objects: "Objetos Dinâmicos",
    editor_ui_dynamic_objects_template: "Modelo",
  },
};

//lang management (requires page reload)
let currentLang = localDb.get("lang") || "en-US";

const setLangCode = function (newLang) {
  localDb.set("lang", newLang);
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
