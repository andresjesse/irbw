// import _ from "lodash";

import * as BABYLON from "@babylonjs/core";

import SceneManager from "./gamecore/SceneManager";

// Get the canvas DOM element
var canvas = document.getElementById("renderCanvas");
// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});
const scene = new BABYLON.Scene(engine);

const smgr = new SceneManager(scene);
smgr.onStart();

engine.runRenderLoop(function () {
  scene.render();
});
// the canvas/window resize event handler
window.addEventListener("resize", function () {
  engine.resize();
});
