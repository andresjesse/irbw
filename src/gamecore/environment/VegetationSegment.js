import * as BABYLON from "@babylonjs/core";

import { mulberry32 } from "../../helpers/DeterministicRandom";
import { TerrainSegmentConfig } from "./TerrainSegment";

export const VegetationSegmentConfig = {
  biomas: ["Bioma 1", "Bioma 2", "Bioma 3"], //TODO: replace placeholders, set bioma names in LANG!
};

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

    // create a square matrix of dimension TerrainSegmentConfig.MESH_SIZE +1 (to enclose borders)
    this.vegetationLayer = Array.from(
      Array(TerrainSegmentConfig.MESH_SIZE + 1),
      () => new Array(TerrainSegmentConfig.MESH_SIZE + 1)
    );
  }

  onStart() {
    // for (let i = -10; i < 10; i += 5) {
    //   for (let j = -10; j < 10; j += 5) {
    //     this.instantiate(i, j);
    //   }
    // }
  }

  paintVegetation(options) {
    //console.log(options);
    let nearestVertex = this.parent.findNearestVertex(
      // new BABYLON.Vector3(
      //   options.pickedPoint.x - this.parent.position.x,
      //   options.pickedPoint.y - this.parent.position.y,
      //   options.pickedPoint.z - this.parent.position.z
      // )
      options.pickedPoint
    );

    this.instantiate(nearestVertex.x, nearestVertex.z, options);

    //console.log(nearestVertex);
  }

  instantiate(x, z, options) {
    let matrixX = Math.round(x + TerrainSegmentConfig.MESH_SIZE / 2);
    let matrixY = Math.round(z + TerrainSegmentConfig.MESH_SIZE / 2);

    console.log(matrixX, matrixY);

    if (this.vegetationLayer[matrixX][matrixY] != true) {
      let vegetationMesh;

      switch (options.bioma) {
        case "Bioma 1":
          vegetationMesh = BABYLON.MeshBuilder.CreateTorus(
            "torus",
            {},
            this.scene
          );
          break;
        case "Bioma 2":
          vegetationMesh = BABYLON.MeshBuilder.CreateBox("box", {}, this.scene);
          break;
        case "Bioma 3":
          vegetationMesh = BABYLON.MeshBuilder.CreateCylinder(
            "cyl",
            {},
            this.scene
          );
          break;
      }

      vegetationMesh.position.x = x;
      vegetationMesh.position.z = z;
      this.vegetationLayer[matrixX][matrixY] = true;

      console.log("created");
    } else {
      console.log("Inogred: ");
    }

    return;

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
      node.position.x += x; // + offset[0];
      node.position.z += z; // + offset[1];

      node.rotation.y = rot;

      this.scene.smgr.lightManager.addShadowsTo(node);
      node.receiveShadows = true;
    }
  }
}
