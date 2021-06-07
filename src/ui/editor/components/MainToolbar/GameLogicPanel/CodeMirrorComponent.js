import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { defaultTabBinding } from "@codemirror/commands";
import { keymap } from "@codemirror/view";

import { javascript } from "@codemirror/lang-javascript";

import React from "react";

import lang from "~/src/ui/lang";

import { useSelector, useDispatch } from "react-redux";
import store, { userScriptsSet } from "~/src/gamecore/ReduxStore";

import "./styles.css";
import { oneDark } from "./one-dark.js";

//Exemplo completo: https://codesandbox.io/s/codemirror-6-demo-pl8dc?file=/src/index.js
//React: https://discuss.codemirror.net/t/suggestions-for-using-with-react-workflow/2746/3

export default function () {
  const activeUserScript = useSelector(
    (state) => state.editor.ui.mainToolbar.gameLogic.activeScript
  );

  const dispatch = useDispatch();

  const view = React.useRef(null);

  React.useEffect(() => {
    if (!view.current) {
      view.current = new EditorView({
        state: EditorState.create({
          extensions: [
            basicSetup,
            keymap.of([defaultTabBinding]),
            javascript(),
            oneDark,
          ],
          doc: store.getState().userScripts[activeUserScript],
        }),
        parent: document.getElementById("codemirror-container"),
      });
    } else {
      view.current.setState(
        EditorState.create({
          extensions: [
            basicSetup,
            keymap.of([defaultTabBinding]),
            javascript(),
            oneDark,
          ],
          doc: store.getState().userScripts[activeUserScript],
        })
      );
    }
  }, [activeUserScript]);

  const updateRedux = () => {
    let scriptStr = view.current.state.doc.toString();

    if (scriptStr == "" || activeUserScript == "") return;

    dispatch(
      userScriptsSet({
        filename: activeUserScript,
        content: scriptStr,
      })
    );
  };

  return <div id="codemirror-container" onBlur={updateRedux}></div>;
}
