import * as BABYLON from "@babylonjs/core";

import { TriPlanarMaterial } from "../../materials/customTriPlanar";
import Texture2DArrayHelper from "../../helpers/Texture2DArrayHelper";

import WaterSegment from "./WaterSegment";
import VegetationSegment from "./VegetationSegment";
import { Vector3 } from "@babylonjs/core";

export const TerrainSegmentConfig = {
  MAX_HEIGHT: 20,
  MIN_HEIGHT: -4,

  MESH_SIZE: 50,
  MESH_RESOLUTION: 32,
};

export default class TerrainSegment {
  constructor(scene, id) {
    this.scene = scene;
    this.id = id;

    this.position = new BABYLON.Vector3(
      parseInt(this.id.split("_")[0]) * TerrainSegmentConfig.MESH_SIZE,
      0,
      parseInt(this.id.split("_")[1]) * TerrainSegmentConfig.MESH_SIZE
    );

    //----- create children -----

    this.waterSegment = new WaterSegment(this.scene, this.id);
    this.vegetationSegment = new VegetationSegment(this.scene, this.id, this);

    //----- preload self assets -----

    this.scene.assetPreloader.preloadTexture("assets/terrain/layer1_grass.jpg");
    this.scene.assetPreloader.preloadTexture("assets/terrain/layer1_sand.jpg");
    this.scene.assetPreloader.preloadTexture("assets/terrain/layer1_rock.jpg");
    this.scene.assetPreloader.preloadTexture("assets/terrain/layer1_cliff.jpg");

    this.scene.assetPreloader.preloadTexture("assets/terrain/layer2_grass.jpg");
    this.scene.assetPreloader.preloadTexture("assets/terrain/layer2_sand.jpg");
    this.scene.assetPreloader.preloadTexture("assets/terrain/layer2_rock.jpg");
    this.scene.assetPreloader.preloadTexture("assets/terrain/layer2_cliff.jpg");

    this.scene.assetPreloader.preloadTexture("assets/terrain/noise.jpg");
  }

  onStart() {
    //----- start children -----

    this.waterSegment?.onStart();
    this.vegetationSegment?.onStart();

    //----- start self -----

    this.ground = BABYLON.MeshBuilder.CreateGround(
      "terrain_segment_" + this.id,
      {
        width: TerrainSegmentConfig.MESH_SIZE,
        height: TerrainSegmentConfig.MESH_SIZE,
        updatable: true,
        subdivisions: TerrainSegmentConfig.MESH_RESOLUTION - 1,
      },
      this.scene
    );

    this.ground.position = this.position;

    let triPlanarMaterial = new TriPlanarMaterial("triplanar", this.scene);

    triPlanarMaterial.diffuseTextureX = Texture2DArrayHelper.createFromTextures(
      this.scene,
      [
        this.scene.assetPreloader.getTexture("assets/terrain/layer1_grass.jpg"),
        this.scene.assetPreloader.getTexture("assets/terrain/layer1_sand.jpg"),
        this.scene.assetPreloader.getTexture("assets/terrain/layer1_rock.jpg"),
        this.scene.assetPreloader.getTexture("assets/terrain/layer1_cliff.jpg"),
      ]
    );

    triPlanarMaterial.diffuseTextureY = Texture2DArrayHelper.createFromTextures(
      this.scene,
      [
        this.scene.assetPreloader.getTexture("assets/terrain/layer2_grass.jpg"),
        this.scene.assetPreloader.getTexture("assets/terrain/layer2_sand.jpg"),
        this.scene.assetPreloader.getTexture("assets/terrain/layer2_rock.jpg"),
        this.scene.assetPreloader.getTexture("assets/terrain/layer2_cliff.jpg"),
      ]
    );

    triPlanarMaterial.diffuseTextureZ = this.scene.assetPreloader.getTexture(
      "assets/terrain/noise.jpg"
    );

    triPlanarMaterial.specularPower = 32;
    triPlanarMaterial.tileSize = 7;

    this.ground.material = triPlanarMaterial;

    this.ground.receiveShadows = true;
  }

  mergeToSegment(otherSeg) {
    if (!otherSeg) return;

    // collect self and otherSeg data
    let positions = this.ground.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    let normals = this.ground.getVerticesData(BABYLON.VertexBuffer.NormalKind);

    let otherPositions = otherSeg.ground.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );

    // iterate self vertices
    let numberOfVertices = positions.length / 3;
    for (let i = 0; i < numberOfVertices; i++) {
      let selfVertex = new BABYLON.Vector3(
        positions[i * 3] + this.ground.position.x,
        positions[i * 3 + 1] + this.ground.position.y,
        positions[i * 3 + 2] + this.ground.position.z
      );

      // iterate otherSeg vertices
      for (let j = 0; j < numberOfVertices; j++) {
        let otherVertex = new BABYLON.Vector3(
          otherPositions[j * 3] + otherSeg.ground.position.x,
          otherPositions[j * 3 + 1] + otherSeg.ground.position.y,
          otherPositions[j * 3 + 2] + otherSeg.ground.position.z
        );

        if (selfVertex.x == otherVertex.x && selfVertex.z == otherVertex.z) {
          positions[i * 3 + 1] = otherVertex.y;
        }
      }
    }

    // update mesh
    this.ground.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      positions
    );

    // recalculate normals
    BABYLON.VertexData.ComputeNormals(
      positions,
      this.ground.getIndices(),
      normals
    );
  }

  paintVegetation(options) {
    this.vegetationSegment.paintVegetation(options);
  }

  transform(options) {
    /** ----------- Collect Positions and Normals ----------- */
    let positions = this.ground.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    let normals = this.ground.getVerticesData(BABYLON.VertexBuffer.NormalKind);

    /** ----------- Iterate Mesh Verices ----------- */
    let numberOfVertices = positions.length / 3;
    for (let i = 0; i < numberOfVertices; i++) {
      /** ----------- Collect Current Vertex as Vector3 ----------- */
      let o = new BABYLON.Vector3(
        positions[i * 3] + this.ground.position.x,
        positions[i * 3 + 1] + this.ground.position.y,
        positions[i * 3 + 2] + this.ground.position.z
      );

      /** ----------- Calculate distance between Vertex and "Clicked Point" ----------- */
      let dist = BABYLON.Vector3.Distance(o, options.pickedPoint);

      /** ----------- Filter Vertices in Brush Range ----------- */
      if (dist <= options.brushSize) {
        /** ----------- Calculate Ration for Smooth Transformations (Sin based) ----------- */
        let ratio = Math.sin(1 - dist / options.brushSize) * options.brushSize;

        if (options.soften == true) {
          /** ----------- Perform Transformations to Level Soften (Average & Ratio based) ----------- */
          let reducerFactor = 0.3;

          if (positions[i * 3 + 1] > options.heightAvg) {
            positions[i * 3 + 1] -=
              options.brushStrength * ratio * reducerFactor;
          } else if (positions[i * 3 + 1] < options.heightAvg) {
            positions[i * 3 + 1] +=
              options.brushStrength * ratio * reducerFactor;
          }

          // guarantee avg if too near
          if (
            Math.abs(positions[i * 3 + 1] - options.heightAvg) <=
            options.brushStrength
          )
            positions[i * 3 + 1] = options.heightAvg;
        } else if (options.factor == 0) {
          /** ----------- Perform Transformations to Level Zero (Normalize) ----------- */
          if (positions[i * 3 + 1] > 0) {
            positions[i * 3 + 1] -= options.brushStrength * ratio;
          } else if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] += options.brushStrength * ratio;
          }

          // guarantee zero if too near
          if (Math.abs(positions[i * 3 + 1]) <= options.brushStrength)
            positions[i * 3 + 1] = 0;
        } else {
          /** ----------- Perform Transformations Up and Down (Level Edit) ----------- */
          positions[i * 3 + 1] +=
            options.brushStrength * options.factor * ratio;

          if (positions[i * 3 + 1] > TerrainSegmentConfig.MAX_HEIGHT)
            positions[i * 3 + 1] = TerrainSegmentConfig.MAX_HEIGHT;
          if (positions[i * 3 + 1] < TerrainSegmentConfig.MIN_HEIGHT)
            positions[i * 3 + 1] = TerrainSegmentConfig.MIN_HEIGHT;
        }
      }
    }

    // update mesh
    this.ground.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      positions
    );

    // update water mesh
    this.waterSegment.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      positions
    );

    // recalculate normals
    BABYLON.VertexData.ComputeNormals(
      positions,
      this.ground.getIndices(),
      normals
    );

    this.ground.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
  }

  findNearestVertex(refPoint) {
    let positions = this.ground.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );

    let nearest = null;
    let nearestDist = Number.MAX_VALUE;

    var numberOfVertices = positions.length / 3;
    for (let i = 0; i < numberOfVertices; i++) {
      let o = new BABYLON.Vector3(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );

      let dist = BABYLON.Vector3.Distance(o, refPoint);

      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = o;
      }
    }

    return nearest;
  }

  getHeightAtPosition(x, z) {
    const ray = BABYLON.Ray.CreateNewFromTo(
      new Vector3(x, 100, z),
      new Vector3(x, -100, z)
    );

    const pick = this.scene.pickWithRay(
      ray,
      (mesh) => mesh.id.startsWith("terrain_segment_"),
      true
    );

    if (pick) return pick.pickedPoint.y;
  }
}
