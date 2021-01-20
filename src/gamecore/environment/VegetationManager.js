import * as BABYLON from "@babylonjs/core";

import { mulberry32 } from "../../helpers/DeterministicRandom";

export default class VegetationManager {
  constructor(scene) {
    this.scene = scene;

    this.containers = {};

    this.scene.assetsManager.addContainerTask(
      "tree1",
      "",
      "assets/nature/",
      "tree1.babylon"
    ).onSuccess = (task) => {
      console.log(task);
      this.containers["tree1"] = task.loadedContainer;
    };

    // this.scene.assetsManager.addMeshTask(
    //   "tree1",
    //   "",
    //   "assets/nature/",
    //   "tree1.babylon"
    // ).onSuccess = (task) => {
    //   this.tree1 = task.loadedMeshes;
    // };
  }

  instantiate(x, z) {
    //generate a random generator based on instance coordinates
    let rand = mulberry32(x + 10 * z);

    let entries = this.containers["tree1"].instantiateModelsToScene();

    let factor = 5;
    let offset = [rand() * factor - factor / 2, rand() * factor - factor / 2];
    let rot = rand() * 360 * (Math.PI / 180);

    console.log(offset);

    for (var node of entries.rootNodes) {
      node.position.x += x + offset[0];
      node.position.z += z + offset[1];

      node.rotation.y = rot;

      this.scene.smgr.lightManager.addShadowsTo(node);
      node.receiveShadows = true;
    }
  }

  onStart() {
    for (let i = -10; i < 10; i += 5) {
      for (let j = -10; j < 10; j += 5) {
        this.instantiate(i, j);
      }
    }
  }
}
