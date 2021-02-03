import * as BABYLON from "@babylonjs/core";

import { TriPlanarMaterial } from "../../materials/customTriPlanar";
import Texture2DArrayHelper from "../../helpers/Texture2DArrayHelper";

import WaterSegment from "./WaterSegment";
import VegetationSegment from "./VegetationSegment";

export const TerrainSegmentConfig = {
  MAX_HEIGHT: 20,
  MIN_HEIGHT: -4,

  MESH_SIZE: 50,
  MESH_RESOLUTION: 64,
};

export default class TerrainSegment {
  constructor(scene, id) {
    this.scene = scene;
    this.id = id;

    //----- create children -----

    this.waterSegment = new WaterSegment(this.scene, this.id);
    //this.vegetationSegment = new VegetationSegment(this.scene, this.id, this);

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
      "ground_" + this.id,
      {
        width: TerrainSegmentConfig.MESH_SIZE,
        height: TerrainSegmentConfig.MESH_SIZE,
        updatable: true,
        subdivisions: TerrainSegmentConfig.MESH_RESOLUTION - 1,
      },
      this.scene
    );

    this.ground.position = new BABYLON.Vector3(
      parseInt(this.id.split("_")[0]) * TerrainSegmentConfig.MESH_SIZE,
      0,
      parseInt(this.id.split("_")[1]) * TerrainSegmentConfig.MESH_SIZE
    );

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

  paintVegetation(options) {
    this.vegetationSegment.paintVegetation(options);
  }

  transform(options) {
    /** ----------- Collect Positions and Normals ----------- */
    var positions = this.ground.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    var normals = this.ground.getVerticesData(BABYLON.VertexBuffer.NormalKind);

    let avgHeight = this.calculateAverageHeightInBrushRange(positions, options);

    /** ----------- Iterate Mesh Verices ----------- */
    var numberOfVertices = positions.length / 3;
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
          let reducerFactor = 0.2;

          if (positions[i * 3 + 1] > avgHeight) {
            positions[i * 3 + 1] -=
              options.brushStrength * ratio * reducerFactor;
          } else if (positions[i * 3 + 1] < avgHeight) {
            positions[i * 3 + 1] +=
              options.brushStrength * ratio * reducerFactor;
          }

          // guarantee avg if too near
          if (
            Math.abs(positions[i * 3 + 1] - avgHeight) <= options.brushStrength
          )
            positions[i * 3 + 1] = avgHeight;
        } else if (options.factor == 0) {
          /** ----------- Perform Transformations to Level Zero (Normalize) ----------- */
          if (positions[i * 3 + 1] > 0) {
            positions[i * 3 + 1] -= options.brushStrength * ratio;
          } else if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] += options.brushStrength * ratio;
          }

          //guarantee zero if too near
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

    //update mesh

    this.ground.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      positions
    );

    //update water mesh
    this.waterSegment.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      positions
    );

    //recalculate normals

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

  //TODO: must consider neighborhood! calculate average on parent?
  calculateAverageHeightInBrushRange(positions, options) {
    // calculate Vertex average position in Y axis (consider only vertices in brush range)
    let avg = 0;
    let vCount = 0;

    var numberOfVertices = positions.length / 3;

    for (let j = 0; j < numberOfVertices; j++) {
      let vDist = BABYLON.Vector3.Distance(
        new BABYLON.Vector3(
          positions[j * 3] + this.ground.position.x,
          positions[j * 3 + 1] + this.ground.position.y,
          positions[j * 3 + 2] + this.ground.position.z
        ),
        options.pickedPoint
      );

      if (vDist <= options.brushSize) {
        avg += positions[j * 3 + 1] + this.ground.position.y;
        vCount += 1;
      }
    }

    return avg / vCount;
  }
}
