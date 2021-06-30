import React from "react";

import LabeledSelect from "~/src/ui/editor/components/LabeledSelect";

import dynObjTemplates from "~/src/services/dynObjTemplates";

import lang from "~/src/ui/lang";

import "./styles.css";

export default function () {

  const [dynObjTemplate, setDynObjTemplate] = React.useState(
    dynObjTemplates[0].name
  );

  return (
    <div className="toolbar-verticalBlock">
      {lang.get("editor_ui_dynamic_objects")}

      <div className="toolbar-contentRow">
        <LabeledSelect
          label={lang.get("editor_ui_dynamic_objects_template")}
          options={dynObjTemplates.map( dyo => dyo.name ) }
          value={dynObjTemplate}
          onChange={(val) => {
            setDynObjTemplate(val);

            // dispatch(
            //   editorUiMainToolbarSetVegetationPaintOptions({
            //     brushSize: brushSize[0],
            //     density: density[0],
            //     bioma: val,
            //   })
            // );
          }}
        />
      </div>
    </div>
  );
}
