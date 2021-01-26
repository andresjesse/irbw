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
    height: "fit-content",
    borderWidth: 0,
    background: colors("panelBackground"),
    color: colors("foreground"),
    marginRight: "2pt",
    cursor: "pointer",
  },
};
export default SvgButton;
