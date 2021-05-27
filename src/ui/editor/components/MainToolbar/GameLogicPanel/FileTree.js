import React from "react";

import lang from "~/src/ui/lang";

import "./styles.css";

const FileEntry = function (props) {
  return <div className="gamelogic-codeeditor-fileentry">{props.filename}</div>;
};

export default function () {
  const files = [];

  for (let i = 0; i < 20; i++)
    files.push(<FileEntry filename={"Script" + i + ".js"} key={i} />);

  return <div className="gamelogic-codeeditor-filetree">{files}</div>;
}
