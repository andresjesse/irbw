import colors from "../../colors";
import EditorIcons from "../EditorIcons.svg";

const SvgButton = (props) => {
  return (
    <button style={styles.svgButton} onClick={props.onClick}>
      <EditorIcons
        stroke={props.active ? colors("highlight") : colors("foreground")}
        strokeWidth={props.active ? 4 : 3}
        viewBox={`${props.tileX * 64} ${props.tileY * 64}  64 64`}
        width="32"
        height="32"
      />
    </button>
  );
};

const styles = {
  svgButton: {
    width: "48px",
    height: "48px",
    borderWidth: 0,
    background: colors("panelBackground"),
    color: colors("foreground"),
    cursor: "pointer",
    padding: "4px",
  },
};
export default SvgButton;
