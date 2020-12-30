import * as BABYLON from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core";

const MAX_HEIGHT = 2;
const MIN_HEIGHT = -1;

export default class TerrainSegment {
  constructor(scene, id) {
    this.scene = scene;

    //mesh
    this.ground = BABYLON.MeshBuilder.CreateGround(
      "ground_" + id,
      { width: 100, height: 100, updatable: true, subdivisions: 128 },
      this.scene
    );

    //temp material
    var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
    myMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    //myMaterial.wireframe = true;
    myMaterial.diffuseTexture = new BABYLON.Texture(
      "http://i.imgur.com/JbvoYlB.png",
      this.scene
    );
    myMaterial.diffuseTexture.uScale = 32;
    myMaterial.diffuseTexture.vScale = 32;
    this.ground.material = myMaterial;
  }

  transform(options) {
    var positions = this.ground.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );

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
  }
}
