import * as BABYLON from "@babylonjs/core";

import { TerrainSegmentConfig } from "../../gamecore/environment/TerrainSegment";

const WATER_ALPHA = 0.45;
const WAVE_DISTORTION = 0.3;
const WAVE_SCALE = 8.0;

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

    uniform vec2 wind;
    uniform vec3 diffuseLightColor;

    void main(void) {
      
      vec4 txNormal = texture2D(normalMap, vUV*${WAVE_SCALE.toFixed(
        2
      )} + vec2(time*wind.x, time*wind.y) );
      vec4 diffuse = texture2D(reflectionMap, vUV + vec2(txNormal.r, txNormal.g)*${WAVE_DISTORTION.toFixed(
        2
      )} -vec2(time*wind.x, time*wind.y) );

      float normalizedYPos = yPos/${TerrainSegmentConfig.MIN_HEIGHT.toFixed(2)};

      float alpha = clamp( pow(normalizedYPos, 4.0), 0.0, ${WATER_ALPHA});

      diffuse = diffuse * vec4(diffuseLightColor, alpha);

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

  customWaterMaterial.setArray2("wind", [0.002, 0.002]);

  let time = 0;
  scene.registerBeforeRender(() => {
    customWaterMaterial.setFloat("time", time);
    time += 0.1;

    customWaterMaterial.setArray3(
      "diffuseLightColor",
      scene.lights[0].diffuse.asArray()
    );
  });

  return customWaterMaterial;
};

export default createCustomWaterMaterial;
