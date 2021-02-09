import React from "react";

import colors from "../../colors";
import lang from "../../lang";

import { useSelector, useDispatch } from "react-redux";

export default function (props) {
  const fps = useSelector((state) => state.editor.ui.fps);

  return (
    <div style={styles.container}>
      <div style={styles.block}>{/** Reserved for future use */}</div>
      <div style={styles.block}>FPS:{fps.toFixed()}</div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    width: "100%",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors("background"),
    color: colors("foregroundShaded"),
    fontSize: "10pt",
  },
  block: {
    padding: "4pt",
  },
};
