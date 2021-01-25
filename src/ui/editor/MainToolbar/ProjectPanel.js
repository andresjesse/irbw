import React from "react";

import colors from "../../colors";

import { useSelector, useDispatch } from "react-redux";

export default function (props) {
  const dispatch = useDispatch();

  return (
    <div style={styles.container}>
      <h1>Project Panel Placeholder</h1>
    </div>
  );
}

const styles = {
  container: {
    height: "64pt",
    display: "flex",
    flexDirection: "row",
    backgroundColor: colors("panelBackground"),
    padding: 4,
  },
};
