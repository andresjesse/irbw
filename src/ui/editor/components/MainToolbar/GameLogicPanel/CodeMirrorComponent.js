import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";

import React from "react";

import lang from "~/src/ui/lang";

import FileTree from "./FileTree";

import "./styles.css";
import { oneDark } from "./one-dark.js";

//Exemplo completo: https://codesandbox.io/s/codemirror-6-demo-pl8dc?file=/src/index.js

const tempDoc = `
class Player {

  constructor(){
    
  }

  onStart() {
    
  }

  onUpdate() {
    
  }
}
`;

export default function () {
  React.useEffect(() => {
    let view = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, javascript(), oneDark],
        doc: tempDoc,
      }),
      parent: document.getElementById("codemirror-container"),
    });
  }, []);

  return <div id="codemirror-container"></div>;
}
