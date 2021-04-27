import * as BABYLON from "@babylonjs/core";
import EditorSceneManager from "./gamecore/EditorSceneManager";
import { isAuthenticated, getProject } from "~/src/services/api";

const EDITOR_VERSION = 1;

const loadEditor = (project, sceneId) => {
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

  //set project
  smgr.setProject(project, sceneId);
};

const urlParams = new URLSearchParams(window.location.search);
let projectId = urlParams.get("project");
let sceneId = urlParams.get("scene");

if (!(urlParams.has("project") && urlParams.has("scene"))) {
  projectId = 1;
  sceneId = 1;

  console.log("unspecified project, loading public playground...");
}

//load project from api
getProject(projectId)
  .then((project) => {
    //check editor version
    if (project.editorVersion == EDITOR_VERSION) {
      //check scene id
      let sceneExists = false;

      project.scenes.forEach((scn) => {
        if (scn.id == sceneId) sceneExists = true;
      });

      if (sceneExists) {
        loadEditor(project, sceneId);
      } else {
        throw new Error(
          "sceneId=" + sceneId + " does not exist in projectId=" + projectId
        );
      }
    } else {
      throw new Error(
        "editor version mismatch: project version=" +
          project.editorVersion +
          " current editor version=" +
          EDITOR_VERSION
      );
    }
  })
  .catch((err) => {
    console.error(err);
  });
