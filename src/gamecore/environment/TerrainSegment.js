import * as BABYLON from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core";

import { TriPlanarMaterial } from "../../materials/customTriPlanar";

import WaterSegment from "./WaterSegment";

const MAX_HEIGHT = 20;
const MIN_HEIGHT = -1;

export default class TerrainSegment {
  constructor(scene, id) {
    this.scene = scene;
    this.id = id;

    //----- create children -----

    this.waterSegment = new WaterSegment(this.scene, this.id);

    //----- preload self assets -----

    this.scene.assetsManager.addTextureTask(
      "textureAtlas1",
      "textures/terrain/atlas1.jpg"
    ).onSuccess = (task) => {
      this.textureAtlas1 = task.texture;
    };

    this.scene.assetsManager.addTextureTask(
      "textureAtlas2",
      "textures/terrain/atlas2.jpg"
    ).onSuccess = (task) => {
      this.textureAtlas2 = task.texture;
    };

    this.scene.assetsManager.addTextureTask(
      "textureNoise",
      "textures/terrain/noise.jpg"
    ).onSuccess = (task) => {
      this.textureNoise = task.texture;
    };
  }

  onStart() {
    //----- start children -----

    this.waterSegment.onStart();

    //----- start self -----

    //mesh OK!!!
    // this.ground = BABYLON.MeshBuilder.CreateGround(
    //   "ground_" + this.id,
    //   { width: 100, height: 100, updatable: true, subdivisions: 128 },
    //   this.scene
    // );

    //TEMP GROUND!!!
    this.ground = BABYLON.Mesh.CreateGroundFromHeightMap(
      "ground",
      "textures/TEMPHeightmap.png",
      100,
      100,
      250,
      -4,
      10,
      this.scene,
      false
    );

    var triPlanarMaterial = new TriPlanarMaterial("triplanar", this.scene);
    triPlanarMaterial.diffuseTextureX = this.textureAtlas1;
    triPlanarMaterial.diffuseTextureY = this.textureAtlas2;
    triPlanarMaterial.diffuseTextureZ = this.textureNoise;

    triPlanarMaterial.specularPower = 32;
    triPlanarMaterial.tileSize = 7;

    this.ground.material = triPlanarMaterial;

    this.ground.receiveShadows = true;
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

          if (positions[i * 3 + 1] > MAX_HEIGHT)
            positions[i * 3 + 1] = MAX_HEIGHT;
          if (positions[i * 3 + 1] < MIN_HEIGHT)
            positions[i * 3 + 1] = MIN_HEIGHT;
        }
      }
    }

    this.ground.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      positions
    );

    BABYLON.VertexData.ComputeNormals(
      positions,
      this.ground.getIndices(),
      normals
    );
    this.ground.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
  }
}
