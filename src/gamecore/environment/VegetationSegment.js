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
 *        liveInstances: [instantiated meshs] (this param does not need to be saved! can be recreated from deterministic randomSeed!)
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

    if (options.clear)
      this.clearInstances(nearestVertex.x, nearestVertex.z, options);
    else this.instantiate(nearestVertex.x, nearestVertex.z, options);

    //console.log(nearestVertex);
  }

  instantiate(x, z, options) {
    // calculate matrix position based on nearest vertex position
    let matrixX = Math.round(x + TerrainSegmentConfig.MESH_SIZE / 2);
    let matrixY = Math.round(z + TerrainSegmentConfig.MESH_SIZE / 2);

    // generate a (deterministic) random generator based on instance coordinates
    let randomSeed =
      x * z +
      options.density +
      options.brushSize +
      (VegetationSegmentConfig.biomas.indexOf(options.bioma) || 0);

    // ignore placement if randomSeed is the same
    if (this.vegetationLayer[matrixX][matrixY]?.randomSeed == randomSeed) {
      return;
    }

    let rand = mulberry32(randomSeed);

    // randomize vegetation placement params (deterministic position, rotation, scale)
    let maxPositionOffset = 1;
    let positionOffset = [
      rand() * maxPositionOffset - maxPositionOffset / 2,
      rand() * maxPositionOffset - maxPositionOffset / 2,
    ];
    let rotation = rand() * 360 * (Math.PI / 180);
    let scaleVariation = 0.4;
    let scale = 1 + rand() * scaleVariation - scaleVariation / 2;

    // raycast and pick the terrain point at (x,z) considering offset
    let terrainPick = this.parent.pickPointAtPosition(
      x + positionOffset[0],
      z + positionOffset[1]
    );

    // calculate face angle to avoid placing vegetation on cliffs (1 is flat, 0 is 100% vertical)
    let pickedFaceAngle = BABYLON.Vector3.Dot(
      terrainPick.faceNormal,
      BABYLON.Vector3.Up()
    );

    // ignore cliffs (increase value to reduce vegetation on cliffs)
    if (pickedFaceAngle < 0.7) return;

    // clear vegetation if present
    if (this.vegetationLayer[matrixX][matrixY] != undefined) {
      this.clearInstances(x, z);
    }

    // calculate density probabilistically: higher density increases chances of placement
    let placementeProbability = rand() * 10;
    if (placementeProbability >= options.density) return;

    // generate & instantiate new meshes
    let vegetationMesh;

    switch (options.bioma) {
      case VegetationSegmentConfig.biomas[0]: //"Bioma 1"
        vegetationMesh = BABYLON.MeshBuilder.CreateTorus(
          "torus",
          {},
          this.scene
        );
        break;
      case VegetationSegmentConfig.biomas[1]: //"Bioma 2"
        vegetationMesh = BABYLON.MeshBuilder.CreateBox("box", {}, this.scene);
        break;
      case VegetationSegmentConfig.biomas[2]: //"Bioma 3"
        vegetationMesh = BABYLON.MeshBuilder.CreateCylinder(
          "cyl",
          {},
          this.scene
        );
        break;
    }

    // transform mesh according to previously calculated params
    vegetationMesh.position.x = x + positionOffset[0];
    vegetationMesh.position.y = terrainPick.pickedPoint.y;
    vegetationMesh.position.z = z + positionOffset[1];

    vegetationMesh.rotation.y = rotation;

    vegetationMesh.scaling = new BABYLON.Vector3(scale, scale, scale);

    this.vegetationLayer[matrixX][matrixY] = {
      bioma: options.bioma,
      density: options.density,
      randomSeed: randomSeed,
      liveInstances: [vegetationMesh],
    };

    // let entries = this.scene.assetPreloader
    //   .getContainer("assets/nature/tree1.babylon")
    //   .instantiateModelsToScene();

    // let factor = 5;
    // let offset = [rand() * factor - factor / 2, rand() * factor - factor / 2];
    // let rot = rand() * 360 * (Math.PI / 180);

    // //console.log(offset);

    // for (var node of entries.rootNodes) {
    //   node.position.x += x; // + offset[0];
    //   node.position.z += z; // + offset[1];

    //   node.rotation.y = rot;

    //   this.scene.smgr.lightManager.addShadowsTo(node);
    //   node.receiveShadows = true;
    // }
  }

  clearInstances(x, z, options) {
    //calculate matrix position based on nearest vertex position
    let matrixX = Math.round(x + TerrainSegmentConfig.MESH_SIZE / 2);
    let matrixY = Math.round(z + TerrainSegmentConfig.MESH_SIZE / 2);

    if (this.vegetationLayer[matrixX][matrixY] != undefined) {
      this.vegetationLayer[matrixX][matrixY].liveInstances.forEach(
        (instance) => {
          instance.dispose();
        }
      );

      this.vegetationLayer[matrixX][matrixY] = undefined;
    }
  }
}
