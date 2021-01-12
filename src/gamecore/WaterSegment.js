import * as BABYLON from "@babylonjs/core";

export default class WaterSegment {
  constructor(scene) {
    this.scene = scene;

    var ground = BABYLON.Mesh.CreateGround("ground2", 100, 100, 32, scene);

    BABYLON.Effect.ShadersStore["customWaterVertexShader"] = `
        precision highp float;

        // Attributes
        attribute vec3 position;
        attribute vec2 uv;

        // Uniforms
        uniform mat4 worldViewProjection;

        // Varying
        varying vec2 vUV;

        void main(void) {
            gl_Position = worldViewProjection * vec4(position, 1.0);

            vUV = uv;
        }
      `;
    BABYLON.Effect.ShadersStore["customWaterFragmentShader"] = `
        precision highp float;

        varying vec2 vUV;

        uniform float time;

        uniform sampler2D normalMap;
        uniform sampler2D reflectionMap;

        void main(void) {
          vec4 txNormal = texture2D(normalMap, vUV*10.0 + vec2(time, time/2.0)*0.005 );

          gl_FragColor = texture2D(reflectionMap, vUV + vec2(txNormal.r, txNormal.g)*0.5 -vec2(time, time)*0.005 );
        }
      `;

    var shaderMaterial = new BABYLON.ShaderMaterial(
      "shader",
      scene,
      {
        vertex: "customWater",
        fragment: "customWater",
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: [
          "world",
          "worldView",
          "worldViewProjection",
          "view",
          "projection",
          "time",
        ],
      }
    );

    shaderMaterial.setTexture(
      "normalMap",
      new BABYLON.Texture("textures/waternm.jpeg", scene)
    );

    shaderMaterial.setTexture(
      "reflectionMap",
      new BABYLON.Texture("textures/clouds.jpg", scene)
    );

    let time = 0;
    scene.registerBeforeRender(function () {
      shaderMaterial.setFloat("time", time);
      time += 0.1;
    });

    ground.material = shaderMaterial;
  }
}
