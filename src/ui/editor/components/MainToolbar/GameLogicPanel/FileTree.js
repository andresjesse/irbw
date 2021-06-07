import React from "react";

import lang from "~/src/ui/lang";
import ModalDialogInput from "~/src/ui/editor/components/ModalDialogInput";

import store, {
  editorUiMainToolbarSetGameLogicActiveScript,
  userScriptsSet,
} from "~/src/gamecore/ReduxStore";

import { useSelector, useDispatch } from "react-redux";

import "./styles.css";

const FileEntry = function (props) {
  return (
    <div
      className={
        "gamelogic-codeeditor-fileentry " + (props.active ? "active" : "")
      }
      onClick={props?.onClick}
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

  const userScripts = useSelector((state) => state.userScripts);
  const activeUserScript = useSelector(
    (state) => state.editor.ui.mainToolbar.gameLogic.activeScript
  );
  const dispatch = useDispatch();

  const files = [];
  Object.keys(userScripts).forEach((usk, i) => {
    files.push(
      <FileEntry
        filename={usk}
        key={i}
        active={activeUserScript == usk}
        onClick={() => setActiveScript(usk)}
      />
    );
  });

  const createScript = (_filename) => {
    let filename = _filename.endsWith(".js") ? _filename : _filename + ".js";
    dispatch(
      userScriptsSet({
        filename,
        content: "",
      })
    );
  };

  const setActiveScript = (filename) => {
    dispatch(editorUiMainToolbarSetGameLogicActiveScript(filename));
  };

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
