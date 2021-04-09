import EditorIcons from "./EditorIcons.svg";

import "./styles.css";

const SvgButton = (props) => {
  return (
    <button className="svgButton" onClick={props.onClick}>
      <EditorIcons
        stroke={props.active ? "var(--highlight)" : "var(--foreground)"}
        strokeWidth={props.active ? 4 : 3}
        viewBox={`${props.tileX * 64} ${props.tileY * 64}  64 64`}
        width="32"
        height="32"
      />
    </button>
  );
};

export default SvgButton;
