import * as BABYLON from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core";

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

    //this.waterSegment = new WaterSegment(this.scene, this.id);
    //this.vegetationSegment = new VegetationSegment(this.scene, this.id, this);

    //----- preload self assets ----- TODO: implement singleton preload (check vegetationSegment) -- different textures in different segments? or just in different scenes?

    this.textures = {};

    const preloadTexture = (txFile) => {
      this.scene.assetsManager.addTextureTask(
        txFile,
        "assets/terrain/" + txFile
      ).onSuccess = (task) => {
        this.textures[txFile] = task.texture;
      };
    };

    preloadTexture("layer1_grass.jpg");
    preloadTexture("layer1_sand.jpg");
    preloadTexture("layer1_rock.jpg");
    preloadTexture("layer1_cliff.jpg");

    preloadTexture("layer2_grass.jpg");
    preloadTexture("layer2_sand.jpg");
    preloadTexture("layer2_rock.jpg");
    preloadTexture("layer2_cliff.jpg");

    preloadTexture("noise.jpg");
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

    this.ground.position = new Vector3(
      parseInt(this.id.split("_")[0]) * TerrainSegmentConfig.MESH_SIZE,
      0,
      parseInt(this.id.split("_")[1]) * TerrainSegmentConfig.MESH_SIZE
    );

    var triPlanarMaterial = new TriPlanarMaterial("triplanar", this.scene);

    triPlanarMaterial.diffuseTextureX = Texture2DArrayHelper.createFromTextures(
      this.scene,
      [
        this.textures["layer1_grass.jpg"],
        this.textures["layer1_sand.jpg"],
        this.textures["layer1_rock.jpg"],
        this.textures["layer1_cliff.jpg"],
      ]
    );

    triPlanarMaterial.diffuseTextureY = Texture2DArrayHelper.createFromTextures(
      this.scene,
      [
        this.textures["layer2_grass.jpg"],
        this.textures["layer2_sand.jpg"],
        this.textures["layer2_rock.jpg"],
        this.textures["layer2_cliff.jpg"],
      ]
    );

    triPlanarMaterial.diffuseTextureZ = this.textures["noise.jpg"];

    triPlanarMaterial.specularPower = 32;
    triPlanarMaterial.tileSize = 7;

    this.ground.material = triPlanarMaterial;

    this.ground.receiveShadows = true;
  }

  paintVegetation(options) {
    this.vegetationSegment.paintVegetation(options);
  }

  transform(options) {
    var positions = this.ground.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    var normals = this.ground.getVerticesData(BABYLON.VertexBuffer.NormalKind);

    var numberOfVertices = positions.length / 3;
    for (let i = 0; i < numberOfVertices; i++) {
      let o = new Vector3(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );

      let dist = BABYLON.Vector3.Distance(o, options.pickedPoint);

      if (dist <= options.brushRadius) {
        let ratio =
          Math.sin(1 - dist / options.brushRadius) * options.brushRadius;

        if (options.factor == 0) {
          //transform to zero

          if (positions[i * 3 + 1] > 0) {
            positions[i * 3 + 1] -= options.brushStrength * ratio;
            //guarantee zero if too near
            if (positions[i * 3 + 1] <= options.brushStrength)
              positions[i * 3 + 1] = 0;
          } else if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] += options.brushStrength * ratio;
            //guarantee zero if too near
            if (positions[i * 3 + 1] >= options.brushStrength)
              positions[i * 3 + 1] = 0;
          }
        } else {
          //transform up and down
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
      let o = new Vector3(
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
}
