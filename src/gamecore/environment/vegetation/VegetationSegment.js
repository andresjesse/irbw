import * as BABYLON from "@babylonjs/core";

import { mulberry32 } from "../../../helpers/DeterministicRandom";
import { TerrainSegmentConfig } from "./../TerrainSegment";
import BiomaFactory from "./BiomaFactory";

// Tip: increase CLIFF_THRESHOLD to reduce vegetation on cliffs
const CLIFF_THRESHOLD = 0.7;

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

    //this.scene.assetPreloader.preloadContainer("assets/nature/tree1.babylon");
    //this.scene.assetPreloader.preloadMeshes("assets/nature/tree1.babylon");

    this.biomaFactory = new BiomaFactory(this.scene);

    // create a square matrix of dimension TerrainSegmentConfig.MESH_SIZE +1 (to enclose borders)
    this.vegetationLayer = Array.from(
      Array(TerrainSegmentConfig.MESH_SIZE + 1),
      () => new Array(TerrainSegmentConfig.MESH_SIZE + 1)
    );
  }

  onStart() {}

  paintVegetation(options) {
    // iterate through brushSize (pickedPoint + offset)
    for (let i = -options.brushSize; i < options.brushSize; i++) {
      for (let j = -options.brushSize; j < options.brushSize; j++) {
        // locate height at offset position (can be different from pickedPoint height)
        let heightAtOffset = this.parent.pickPointAtPosition(
          options.pickedPoint.x + i,
          options.pickedPoint.z + j
        )?.pickedPoint.y;

        // generate a Vector3 with pickedPoint + offset considering correct height
        let pointToCheck = new BABYLON.Vector3(
          options.pickedPoint.x + i,
          heightAtOffset,
          options.pickedPoint.z + j
        );

        // locate nearest vertex (picked point is unpredictable, neareset vertex is deterministic)
        let nearestVertex = this.parent.findNearestVertex(pointToCheck);

        // check distance from nearestVertex to picked point to ensure painting on brushSize
        if (
          BABYLON.Vector3.Distance(nearestVertex, options.pickedPoint) <=
          options.brushSize
        ) {
          // is this a call to clear vegetation?
          if (options.clear)
            this.clearInstances(nearestVertex.x, nearestVertex.z, options);
          // or to paint instances?
          else this.instantiate(nearestVertex.x, nearestVertex.z, options);
        }
      }
    }
  }

  instantiate(x, z, options) {
    // calculate matrix position based on nearest position
    let matrixCoordinates = this.pointToMatrixCoordinates(x, z);

    // generate a (deterministic) random generator based on instance coordinates
    let randomSeed =
      x * z +
      options.density +
      options.brushSize +
      (BiomaFactory.asList().indexOf(options.bioma) || 0);

    // ignore placement if randomSeed is the same
    if (
      this.vegetationLayer[matrixCoordinates.i][matrixCoordinates.j]
        ?.randomSeed == randomSeed
    ) {
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

    // ignore placemente when pick is not returned (e.g. position+offset is outside terrain mesh)
    if (!terrainPick) return;

    // calculate face angle to avoid placing vegetation on cliffs (1 is flat, 0 is 100% vertical)
    let pickedFaceAngle = BABYLON.Vector3.Dot(
      terrainPick.faceNormal,
      BABYLON.Vector3.Up()
    );

    // ignore cliffs
    if (pickedFaceAngle < CLIFF_THRESHOLD) return;

    // clear vegetation if present
    if (
      this.vegetationLayer[matrixCoordinates.i][matrixCoordinates.j] !=
      undefined
    ) {
      this.clearInstances(x, z);
    }

    // calculate density probabilistically: higher density increases chances of placement
    let placementeProbability = rand() * 10;
    if (placementeProbability >= options.density) return;

    // generate & instantiate new meshes
    let liveInstances = this.biomaFactory.instantiate({
      bioma: options.bioma,
      //position Vector
      position: new BABYLON.Vector3(
        x + positionOffset[0],
        terrainPick.pickedPoint.y,
        z + positionOffset[1]
      ),
      //rotation in Y axis
      rotation: rotation,
      //scale (same for all axis)
      scale: scale,
    });

    this.vegetationLayer[matrixCoordinates.i][matrixCoordinates.j] = {
      bioma: options.bioma,
      density: options.density,
      randomSeed: randomSeed,
      liveInstances: liveInstances,
    };
  }

  clearInstances(x, z, options) {
    //calculate matrix position based on nearest position
    let matrixCoordinates = this.pointToMatrixCoordinates(x, z);

    if (
      this.vegetationLayer[matrixCoordinates.i][matrixCoordinates.j] !=
      undefined
    ) {
      console.log(
        this.vegetationLayer[matrixCoordinates.i][matrixCoordinates.j]
      );

      throw new Error(
        "REFACTOR TO THIN INSTANCES! REQUIRES MANUAL BUFFER EDIT!"
      );

      this.vegetationLayer[matrixCoordinates.i][
        matrixCoordinates.j
      ].liveInstances.forEach((instance) => {
        instance.dispose();
      });

      this.vegetationLayer[matrixCoordinates.i][
        matrixCoordinates.j
      ] = undefined;
    }
  }

  recalculateInstancesHeight(x, z, brushSize) {
    //calculate matrix position based on nearest position
    let matrixCoordinates = this.pointToMatrixCoordinates(x, z);

    //iterate over brush size, [x][z] is considered origin (this avoids to iterate entire matrix)
    for (let i = -brushSize; i < brushSize; i++) {
      for (let j = -brushSize; j < brushSize; j++) {
        //check if exist any vegetation info on current coordinate
        let cCoord = this.vegetationLayer[matrixCoordinates.i + i]?.[
          matrixCoordinates.j + j
        ];

        if (cCoord) {
          // initialize a control variable to check if vegetation became positioned on cliff
          let disposeThisCoordinate = false;

          // iterate liveInstances in current coordinate
          cCoord.liveInstances.forEach((liveInstance) => {
            // raycast and pick the terrain point at (x,z) considering current liveInstance
            let terrainPick = this.parent.pickPointAtPosition(
              liveInstance.position.x,
              liveInstance.position.z
            );

            // calculate face angle to avoid placing vegetation on cliffs (1 is flat, 0 is 100% vertical)
            let pickedFaceAngle = BABYLON.Vector3.Dot(
              terrainPick.faceNormal,
              BABYLON.Vector3.Up()
            );

            // remove vegetation if it is on cliffs
            if (pickedFaceAngle < CLIFF_THRESHOLD) {
              disposeThisCoordinate = true;
            } else {
              // update liveInstance position Y
              liveInstance.position.y =
                liveInstance.sourceMesh.position.y + terrainPick.pickedPoint.y;
            }
          });

          // dispose coordinat if needed...
          if (disposeThisCoordinate) {
            cCoord.liveInstances.forEach((instance) => {
              instance.dispose();
            });

            this.vegetationLayer[matrixCoordinates.i + i][
              matrixCoordinates.j + j
            ] = undefined;
          }
        }
      }
    }
  }

  pointToMatrixCoordinates(x, z) {
    // calculate local positions
    let localX = x - this.parent.position.x;
    let localZ = z - this.parent.position.z;

    // calculate matrix position based on nearest position
    let i = Math.round(localX + TerrainSegmentConfig.MESH_SIZE / 2);
    let j = Math.round(localZ + TerrainSegmentConfig.MESH_SIZE / 2);

    return {
      i,
      j,
    };
  }
}
