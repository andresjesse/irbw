import React from "react";

import colors from "../../../colors";

export default () => <div style={styles.separator} />;

const styles = {
  separator: {
    width: "2px",
    height: "98%",
    background: colors("background"),
    alignSelf: "center",
  },
};
