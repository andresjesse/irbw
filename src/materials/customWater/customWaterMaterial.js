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

      yPos = position.y;
      vnormal = normal;

      gl_Position = worldViewProjection * vec4(position.x, ${
        TerrainSegmentConfig.MIN_HEIGHT * 0.5
      }, position.z, 1.0);

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
    uniform vec3 uDiffuseLightColor;

    void main(void) {
      
      vec4 txNormal = texture2D(normalMap, vUV*uWaveDistortion + vec2(time*uWind.x, time*uWind.y) );
      vec4 diffuse = texture2D(reflectionMap, vUV + vec2(txNormal.r, txNormal.g)*uWaveDistortion -vec2(time*uWind.x, time*uWind.y) );

      float normalizedYPos = yPos/${TerrainSegmentConfig.MIN_HEIGHT.toFixed(2)};

      diffuse = diffuse * vec4(uDiffuseLightColor, 1.0);

      //angle between face and up vector gives water border
      float foamAlpha = acos(dot(normalize(vnormal), vec3(0,1.0,0)));

      //foam effect: step 1 distortion + alpha
      // vec2 foamDistortion = vec2(txNormal.r, txNormal.g)*0.03;
      // vec4 txFoam = texture2D(foam, vUV*8.0 + foamDistortion ); 
      // gl_FragColor = mix(vec4(txFoam.rgb , foamAlpha), vec4(1,0,0,1), 1.0-foamAlpha*foamAlpha);

      //step 2: motion vector with sin/cos loop
      // vec2 foamNormalWave = vec2(vnormal.x*sin(time*0.1), vnormal.z*sin(time*0.1))*0.05; //sin sin pulse, sin cos wave
      // vec4 txFoam = texture2D(foam, vUV*8.0 + foamNormalWave ); 
      // gl_FragColor = mix(vec4(txFoam.rgb , foamAlpha), vec4(1,0,0,1), 1.0-foamAlpha*foamAlpha);

      //step 3: foam distortion + wave (red debug)
      diffuse = vec4(1,0,0,1);

      vec2 foamDistortion = vec2(txNormal.r, txNormal.g)*0.03;
      vec2 foamNormalWave = vec2(vnormal.x*sin(time*0.1), vnormal.z*cos(time*0.1))*0.05; 
      float normalBorderAlpha = clamp( pow(normalizedYPos*1.4, 8.0), 0.0, uWaterAlpha);

      vec4 txFoam = texture2D(foam, vUV*8.0 + foamNormalWave + foamDistortion); 

      vec4 diffuseWithFoam = mix(vec4(txFoam.rgb , foamAlpha), diffuse, 1.0-foamAlpha );
      diffuseWithFoam.a = normalBorderAlpha;

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

  let time = 0;
  scene.registerBeforeRender(() => {
    customWaterMaterial.setFloat("time", time);
    time += 0.1;

    customWaterMaterial.setArray3(
      "uDiffuseLightColor",
      scene.lights[0].diffuse.asArray()
    );
  });

  return customWaterMaterial;
};

export default createCustomWaterMaterial;
