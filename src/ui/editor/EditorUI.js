const TestButton = function (props) {
  const [v, setV] = React.useState(false);

  return (
    <button onClick={() => setV(true)}>
      Clicked {v ? "true! IRB is now using React!" : "false"}
    </button>
  );
};

export default class EditorUI {
  constructor() {
    ReactDOM.render(<TestButton />, document.getElementById("reactRoot"));
  }
}
