import * as GUI from "@babylonjs/gui";

import { colors } from "./styles";

//TODO: load from user preferences!
const theme = "light";
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

  if (options.onClick != undefined)
    button.onPointerClickObservable.add(options.onClick);

  //custom method to higlight button
  button.setHighlight = (boolVal) => {
    if (boolVal) {
      button.background = colors[theme].hightlight;
      button.color = colors[theme].panelBackground;
    } else {
      button.background = colors[theme].panelBackground;
      button.color = colors[theme].foreground;
    }
  };

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

  if (options.horizontalAlignment != undefined)
    rect.horizontalAlignment = options.horizontalAlignment;

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

const createImageTab = function (options) {
  //let button = GUI.Button.CreateSimpleButton(options.name, options.text);

  let button = GUI.Button.CreateImageButton(
    options.name,
    options.text,
    "ui/icons_editor_ui_light.svg#tabEnvironment"
  );

  // button.children[1].onSVGAttributesComputedObservable.add(function () {
  //   console.log(button.children[1].sourceWidth);
  //   button.children[1].width =
  //     String(button.children[1].sourceWidth * scale_f) + "px";
  //   button.children[1].height =
  //     String(button.children[1].sourceHeight * scale_f) + "px";
  // });
  // button.children[1].stretch = GUI.Image.STRETCH_UNIFORM;

  button.width = options.width;
  button.height = options.height;
  button.color = colors[theme].foreground;
  button.background = colors[theme].panelBackground;
  button.thickness = 0;
  button.fontFamily = defaultFontFamily;
  button.fontSize = options.fontSize || defaultFontSize;

  options.parent.addControl(button);

  if (options.onClick != undefined)
    button.onPointerClickObservable.add(options.onClick);

  //custom method to higlight button
  button.setHighlight = (boolVal) => {
    if (boolVal) {
      button.background = colors[theme].panelBackground;
      button.fontWeight = 700;
    } else {
      button.background = colors[theme].background;
      button.fontWeight = 400;
    }
  };

  return button;
};

export default {
  createButton,
  createImageButton,
  createPanel,
  createStackPanel,
  createImageTab,
};
