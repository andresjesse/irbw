import * as BABYLON from "@babylonjs/core";

export default class WaterSegment {
  constructor(scene) {
    this.scene = scene;

    //----- create children -----

    //----- preload self assets -----

    this.scene.assetsManager.addTextureTask(
      "textureWaternm",
      "textures/waternm.jpg"
    ).onSuccess = (task) => {
      this.textureWaternm = task.texture;
    };

    this.scene.assetsManager.addTextureTask(
      "textureClouds",
      "textures/clouds.jpg"
    ).onSuccess = (task) => {
      this.textureClouds = task.texture;
    };
  }

  onStart() {
    //----- start children -----

    //----- start self -----

    var ground = BABYLON.Mesh.CreateGround("ground2", 100, 100, 32, this.scene);

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
      this.scene,
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
      this.textureWaternm //new BABYLON.Texture("textures/waternm.jpeg", this.scene)
    );

    shaderMaterial.setTexture(
      "reflectionMap",
      this.textureClouds //new BABYLON.Texture("textures/clouds.jpg", this.scene)
    );

    let time = 0;
    this.scene.registerBeforeRender(function () {
      shaderMaterial.setFloat("time", time);
      time += 0.1;
    });

    ground.material = shaderMaterial;
  }
}
