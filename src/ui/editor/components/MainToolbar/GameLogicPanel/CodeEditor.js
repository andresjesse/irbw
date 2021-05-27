import React from "react";

import lang from "~/src/ui/lang";

import FileTree from "./FileTree";

import "./styles.css";

export default function () {
  return (
    <div className="gamelogic-codeeditor-container">
      <FileTree />
    </div>
  );
}
