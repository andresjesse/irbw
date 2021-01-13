import * as BABYLON from "@babylonjs/core";

import { TerrainSegmentConfig } from "../../gamecore/environment/TerrainSegment";

const WATER_ALPHA = 0.6;

const createCustomWaterMaterial = (scene) => {
  BABYLON.Effect.ShadersStore["customWaterVertexShader"] = `
    precision highp float;

    // Attributes
    attribute vec3 position;
    attribute vec2 uv;

    // Uniforms
    uniform mat4 worldViewProjection;

    // Varying
    varying vec2 vUV;
    varying float yPos;

    void main(void) {

      yPos = position.y;

      gl_Position = worldViewProjection * vec4(position.x, ${
        TerrainSegmentConfig.MIN_HEIGHT * 0.5
      }, position.z, 1.0);

      vUV = uv;
    }
  `;

  BABYLON.Effect.ShadersStore["customWaterFragmentShader"] = `
    precision highp float;

    varying vec2 vUV;
    varying float yPos;

    uniform float time;

    uniform sampler2D normalMap;
    uniform sampler2D reflectionMap;

    void main(void) {
      
      vec4 txNormal = texture2D(normalMap, vUV*10.0 + vec2(time, time/2.0)*0.005 );
      vec4 diffuse = texture2D(reflectionMap, vUV + vec2(txNormal.r, txNormal.g)*0.5 -vec2(time, time)*0.005 );

      float normalizedYPos = yPos/${TerrainSegmentConfig.MIN_HEIGHT.toFixed(2)};

      diffuse.a = clamp( pow(normalizedYPos, 4.0), 0.0, ${WATER_ALPHA});

      gl_FragColor = diffuse;
    }
  `;

  let customWaterMaterial = new BABYLON.ShaderMaterial(
    "customWaterMaterial",
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
      needAlphaBlending: true,
      needAlphaTesting: true,
    }
  );

  let time = 0;
  scene.registerBeforeRender(function () {
    customWaterMaterial.setFloat("time", time);
    time += 0.1;
  });

  return customWaterMaterial;
};

export default createCustomWaterMaterial;
