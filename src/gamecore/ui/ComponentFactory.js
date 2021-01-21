import * as GUI from "@babylonjs/gui";

import { colors } from "./styles";

//TODO: load from user preferences!
const theme = "dark";
const defaultFontFamily = "sans serif";
const defaultFontSize = 14;

const createButton = function (options) {
  let button = GUI.Button.CreateSimpleButton(options.name, options.text);

  button.width = options.width;
  button.height = options.height;
  button.color = colors[theme].foreground;
  button.background = colors[theme].panelBackground;
  button.thickness = 0;
  button.fontFamily = defaultFontFamily;
  button.fontSize = options.fontSize || defaultFontSize;

  if (options.padding != undefined) {
    button.paddingLeft = options.padding;
    button.paddingRight = options.padding;
    button.paddingTop = options.padding;
    button.paddingBottom = options.padding;
  }

  options.parent.addControl(button);

  return button;
};

const createImageButton = function (options) {
  // let button = BABYLON.GUI.Button.CreateImageButton(
  //   "but",
  //   "Click Me",
  //   "textures/grass.png"
  // );
  // button.width = options.width;
  // button.height = options.height;
  // button.color = colors[theme].foreground;
  // button.background = colors[theme].panelBackground;
  // return button;
};

const createPanel = function (options) {
  let rect = new GUI.Rectangle();
  rect.width = options.width;
  rect.height = options.height;
  rect.thickness = 0;

  rect.background =
    options.isBackground == true
      ? colors[theme].background
      : colors[theme].panelBackground;

  rect.isPointerBlocker = options.isPointerBlocker || false;

  if (options.verticalAlignment != undefined)
    rect.verticalAlignment = options.verticalAlignment;

  options.parent.addControl(rect);

  return rect;
};

const createStackPanel = function (options) {
  let stackPanel = new GUI.StackPanel();

  if (options.isVertical != undefined)
    stackPanel.isVertical = options.isVertical;

  //stackPanel.adaptWidthToChildren = true; (does not work with two children?)

  if (options.horizontalAlignment != undefined)
    stackPanel.horizontalAlignment = options.horizontalAlignment;

  options.parent.addControl(stackPanel);

  return stackPanel;
};

export default {
  createButton,
  createImageButton,
  createPanel,
  createStackPanel,
};
