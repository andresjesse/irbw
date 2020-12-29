import * as BABYLON from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core";

export default class TerrainSegment {
  constructor(scene, id) {
    this.scene = scene;

    //mesh
    this.ground = BABYLON.MeshBuilder.CreateGround(
      "ground_" + id,
      { width: 64, height: 64, updatable: true, subdivisions: 32 },
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
    console.log(options);

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
        positions[i * 3 + 1] +=
          Math.sin(1 - dist / options.brushRadius) * options.brushRadius;
      }
    }

    this.ground.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      positions
    );
  }
}
