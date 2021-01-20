import * as BABYLON from "@babylonjs/core";

import { mulberry32 } from "../../helpers/DeterministicRandom";

/**
 * Initial ideas:
 *  - Brush size set by UI
 *  - Left click add, right click remove
 *  - Vegetation specific params:
 *    - bioma selection (prebuilt combinations from available nature packs)
 *    - density
 *    - forest age
 *  - deterministic placement:
 *    - store as an object matrix (one point per terrain vertex):
 *      {
 *        bioma,
 *        density,
 *        //age, -> can be handled in biomas config!
 *        randomSeed: automatically calculated from bioma + density + vertexXZPosition (change one of these and placement will be changed, but still deterministic)
 *      }
 *    - option 2: save as an vec2 matrix: [[bioma, density], [,], ...]
 */
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
      this.containers["tree1"] = task.loadedContainer;
    };
  }

  instantiate(x, z) {
    //generate a random generator based on instance coordinates
    let rand = mulberry32(x + 10 * z);

    let entries = this.containers["tree1"].instantiateModelsToScene();

    let factor = 5;
    let offset = [rand() * factor - factor / 2, rand() * factor - factor / 2];
    let rot = rand() * 360 * (Math.PI / 180);

    //console.log(offset);

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
