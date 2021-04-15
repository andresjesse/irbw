import React from "react";

import lang, {
  getAvailableLangs,
  getLangCode,
  setLangCode,
} from "~src/ui/lang";

import { useSelector, useDispatch } from "react-redux";

import Separator from "~/src/ui/editor/components/Separator";
import LabeledSelect from "~/src/ui/editor/components/LabeledSelect";
import localDb from "~/src/services/localDb";

import "./styles.css";

export default function (props) {
  const dispatch = useDispatch();

  //---------------------------------- Panel State
  const [langValue, setLangValue] = React.useState(getLangCode());

  const [shadowDynamicKernelBlur, setShadowDynamicKernelBlur] = React.useState(
    localDb.get("shadowDynamicKernelBlur")?.toString() || "false"
  );

  const [shadowMapSize, setShadowMapSize] = React.useState(
    localDb.get("shadowMapSize") || 2048
  );

  //--------------------------------- Save Event
  const saveAndReload = () => {
    setLangCode(langValue);

    localDb.set("shadowDynamicKernelBlur", shadowDynamicKernelBlur == "true");
    localDb.set("shadowMapSize", parseInt(shadowMapSize));

    location.reload();
  };

  //--------------------------------- Panel render
  return (
    <div className="toolbar-container">
      <div className="toolbar-horizontalBlock">
        {/* --------------------------
        
        Lang
        
        -------------------------- */}

        <div className="toolbar-contentGrid">
          <LabeledSelect
            label={lang.get("editor_ui_language")}
            options={getAvailableLangs()}
            onChange={setLangValue}
            value={langValue}
          />
        </div>

        <Separator />

        {/* --------------------------
        
        Graphics Config 
        
        -------------------------- */}

        <div className="toolbar-contentGrid">
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

      <div className="toolbar-contentGrid">
        <button className="button" onClick={() => saveAndReload()}>
          {lang.get("editor_ui_save_and_reload")}
        </button>
      </div>
    </div>
  );
}
