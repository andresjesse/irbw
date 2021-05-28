import React from "react";

import lang from "~/src/ui/lang";
import ModalDialogInput from "~/src/ui/editor/components/ModalDialogInput";

import "./styles.css";

const FileEntry = function (props) {
  return (
    <div
      className={
        "gamelogic-codeeditor-fileentry " + (props.active ? "active" : "")
      }
    >
      {props.filename}
    </div>
  );
};

/**
 * FileTree React component;
 */
export default function () {
  const [modalCreateScript, setModalCreateScript] = React.useState(false);

  const createScript = (filename) => {
    console.log(filename);
  };

  const files = [];

  for (let i = 0; i < 40; i++)
    files.push(
      <FileEntry
        filename={"Script" + i + "Testtestesteste.js"}
        key={i}
        active={i == 0}
      />
    );

  return (
    <div className="gamelogic-codeeditor-filetree">
      {modalCreateScript && (
        <ModalDialogInput
          title={lang.get("editor_ui_gamelogic_createscript")}
          text={lang.get("editor_ui_gamelogic_createscript_text")}
          onCancel={() => setModalCreateScript(false)}
          onSubmit={createScript}
        />
      )}

      <button
        className="button-createscript"
        onClick={() => {
          setModalCreateScript(true);
        }}
      >
        {lang.get("editor_ui_gamelogic_createscript")}
      </button>

      {files}
    </div>
  );
}
