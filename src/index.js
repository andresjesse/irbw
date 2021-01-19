// import _ from "lodash";

import * as BABYLON from "@babylonjs/core";

import EditorSceneManager from "./gamecore/EditorSceneManager";

// Get the canvas DOM element
var canvas = document.getElementById("renderCanvas");

// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

//create scene and attach an AssetsManager
const scene = new BABYLON.Scene(engine);
scene.assetsManager = new BABYLON.AssetsManager(scene);

//initialize SceneManager
const smgr = new EditorSceneManager(scene);
scene.smgr = smgr;

//trigger Assets preloaded callback
scene.assetsManager.onFinish = function (tasks) {
  //bootstrap SceneManager (and all managed entities)
  smgr.onStart();

  //start engine loop
  engine.runRenderLoop(function () {
    smgr.onUpdate();
    scene.render();
  });
};

//start assets preload
scene.assetsManager.load();

// the canvas/window resize event handler
window.addEventListener("resize", function () {
  engine.resize();
});
