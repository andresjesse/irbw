import React from "react";

import colors from "../../colors";

export default function (props) {
  return (
    <div style={styles.container}>
      <div style={styles.horizontalBar}>
        <button style={styles.tab}>Project</button>

        <button style={styles.tab}>Environment</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors("background"),
    padding: 4,
  },
  horizontalBar: {
    display: "flex",
    flexDirection: "row",
  },
  tab: {
    borderRadius: "8pt 8pt 0 0",
    borderWidth: 0,
    background: colors("panelBackground"),
    color: colors("foreground"),
    height: "24pt",
  },
};
