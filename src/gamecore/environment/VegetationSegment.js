import * as BABYLON from "@babylonjs/core";

import { mulberry32 } from "../../helpers/DeterministicRandom";
import { TerrainSegmentConfig } from "./TerrainSegment";

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
export default class VegetationSegment {
  constructor(scene, id, parent) {
    this.scene = scene;
    this.id = id;
    this.parent = parent;

    this.scene.assetPreloader.preloadContainer("assets/nature/tree1.babylon");

    // create a square matrix of dimension TerrainSegmentConfig.MESH_RESOLUTION
    this.vegetationLayer = Array(TerrainSegmentConfig.MESH_RESOLUTION).fill(
      Array(TerrainSegmentConfig.MESH_RESOLUTION)
    );
  }

  onStart() {
    for (let i = -10; i < 10; i += 5) {
      for (let j = -10; j < 10; j += 5) {
        this.instantiate(i, j);
      }
    }
  }

  paintVegetation(options) {
    console.log(options);
    let nearestVertex = this.parent.findNearestVertex(options.pickedPoint); // TODO: check if its transformed to LOCAL POSITION! (otherwise multiple segments can break!)

    console.log(nearestVertex);
  }

  instantiate(x, z) {
    //generate a random generator based on instance coordinates
    let rand = mulberry32(x + 10 * z);

    let entries = this.scene.assetPreloader
      .getContainer("assets/nature/tree1.babylon")
      .instantiateModelsToScene();

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
}
