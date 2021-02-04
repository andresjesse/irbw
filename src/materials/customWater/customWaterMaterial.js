import * as BABYLON from "@babylonjs/core";

import { TerrainSegmentConfig } from "../../gamecore/environment/TerrainSegment";

const createCustomWaterMaterial = (scene) => {
  BABYLON.Effect.ShadersStore["customWaterVertexShader"] = `
    precision highp float;

    // Attributes
    attribute vec3 position;
    attribute vec2 uv;
    attribute vec3 normal;

    // Uniforms
    uniform mat4 worldViewProjection;

    // Varying
    varying vec2 vUV;
    varying float yPos;
    varying vec3 vnormal;

    void main(void) {
      // collect actual y position and normal
      yPos = position.y;
      vnormal = normal;

      // calculate vertex position by overriding Y with water level (from terrain height)
      gl_Position = worldViewProjection * vec4(position.x, ${
        TerrainSegmentConfig.MIN_HEIGHT * 0.5
      }, position.z, 1.0);

      // collect uv
      vUV = uv; 
    }
  `;

  BABYLON.Effect.ShadersStore["customWaterFragmentShader"] = `
    precision highp float;

    varying vec3 vnormal;

    varying vec2 vUV;
    varying float yPos;

    uniform float time;

    uniform sampler2D normalMap;
    uniform sampler2D reflectionMap;
    uniform sampler2D foam;

    uniform vec2 uWind;
    uniform float uWaterAlpha;
    uniform float uWaveDistortion;
    uniform float uWaveScale;
    uniform vec3 uDiffuseLightColor;

    void main(void) {
      // sample water normalmap and diffuse (sky reflection)
      vec4 txNormal = texture2D(normalMap, vUV*uWaveScale + vec2(time*uWind.x, time*uWind.y) );
      vec4 diffuse = texture2D(reflectionMap, vUV + vec2(txNormal.r, txNormal.g)*uWaveDistortion -vec2(time*uWind.x*2.0, time*uWind.y) );

      // normalize yPos (from vertex) by Terrain Height
      float normalizedYPos = yPos/${TerrainSegmentConfig.MIN_HEIGHT.toFixed(2)};

      // angle between face and up vector gives water border
      float foamAlpha = acos(dot(normalize(vnormal), vec3(0,1.0,0)));

      // calculate foam distortion and wave
      vec2 foamDistortion = vec2(txNormal.r, txNormal.g)*0.03;
      vec2 foamNormalWave = vec2(vnormal.x*sin(time*0.1), vnormal.z*cos(time*0.1))*0.05; 

      // clamp border for smoothness: pow( y_normal, factor)
      //    the bigger is y_normal the near from terrain border foam will be
      //    the bigger is factor the thinner is the "smoothed" border
      //    result is clamped by uWaterAlpha uniform
      float normalBorderAlpha = clamp( pow(normalizedYPos*1.4, 8.0), 0.0, uWaterAlpha);

      // generate foam texture from combined UV (8.0 is foam image scale)
      vec4 txFoam = texture2D(foam, vUV*8.0 + foamNormalWave + foamDistortion); 

      // combine diffuse and foam
      vec4 diffuseWithFoam = mix(vec4(txFoam.rgb , foamAlpha), diffuse, 1.0-foamAlpha );

      // apply clamped border as alpha
      diffuseWithFoam.a = normalBorderAlpha;

      // apply diffuse lighting
      diffuseWithFoam = diffuseWithFoam * vec4(uDiffuseLightColor, 1.0);

      gl_FragColor = diffuseWithFoam;
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

  customWaterMaterial.setArray2("uWind", [-0.0015, -0.002]);
  customWaterMaterial.setFloat("uWaterAlpha", 0.45);
  customWaterMaterial.setFloat("uWaveDistortion", 0.3);
  customWaterMaterial.setFloat("uWaveScale", 6.0);

  //register timer if not exists
  if (scene.waterTimer == undefined) {
    scene.customWaterMaterialTimer = 0;
    scene.registerBeforeRender(() => (scene.customWaterMaterialTimer += 0.1));
  }

  scene.registerBeforeRender(() => {
    customWaterMaterial.setFloat("time", scene.customWaterMaterialTimer);

    customWaterMaterial.setArray3(
      "uDiffuseLightColor",
      scene.lights[0].diffuse.asArray()
    );
  });

  return customWaterMaterial;
};

export default createCustomWaterMaterial;
