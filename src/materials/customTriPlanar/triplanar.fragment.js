import { Effect } from "@babylonjs/core/Materials/effect";
import "@babylonjs/core/Shaders/ShadersInclude/helperFunctions";
import "@babylonjs/core/Shaders/ShadersInclude/lightFragmentDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/lightUboDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/lightsFragmentFunctions";
import "@babylonjs/core/Shaders/ShadersInclude/shadowsFragmentFunctions";
import "@babylonjs/core/Shaders/ShadersInclude/clipPlaneFragmentDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/fogFragmentDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/clipPlaneFragment";
import "@babylonjs/core/Shaders/ShadersInclude/depthPrePass";
import "@babylonjs/core/Shaders/ShadersInclude/lightFragment";
import "@babylonjs/core/Shaders/ShadersInclude/fogFragment";
import "@babylonjs/core/Shaders/ShadersInclude/imageProcessingCompatibility";
var name = "triplanarPixelShader";

/**
Custom Triplanar Shader:

  Textures (Sampler2D):
    Diffuse X = AtlasMap1
    Diffuse Y = AtlasMap2
    Diffuse Z = NoiseMap (for mix)

  AtlasMaps Content:
    UV TILE1 (up, left): Grass
    UV TILE2 (up, right): Sand
    UV TILE3 (down, left): Rocky Plateau
    UV TILE4 (down, right): Rocky Cliff

  Original Triplanar Shader NormalMaps Samplers:
    Ignored (for now), using just normalW=tangentSpace[2]
**/

var shader = `
  precision highp float;

  // -- HARDCODED ADJUSTABLE PARAMS --
  const float NOISE_SCALE = 0.05;
  const float TILE_PADDING = 0.02;
  // --

  uniform vec3 vEyePosition;
  uniform vec4 vDiffuseColor;

  #ifdef SPECULARTERM
    uniform vec4 vSpecularColor;
  #endif

  varying vec3 vPositionW;
  
  #ifdef VERTEXCOLOR
    varying vec4 vColor;
  #endif

  #include<helperFunctions>
  #include<__decl__lightFragment>[0..maxSimultaneousLights]

  #ifdef DIFFUSEX
    varying vec2 vTextureUVX;
    uniform sampler2D diffuseSamplerX;
    
    #ifdef BUMPX
      uniform sampler2D normalSamplerX;
    #endif
  #endif

  #ifdef DIFFUSEY
    varying vec2 vTextureUVY;
    uniform sampler2D diffuseSamplerY;
    
    #ifdef BUMPY
      uniform sampler2D normalSamplerY;
    #endif
  #endif

  #ifdef DIFFUSEZ
    varying vec2 vTextureUVZ;
    uniform sampler2D diffuseSamplerZ;
    #ifdef BUMPZ
      uniform sampler2D normalSamplerZ;
    #endif
  #endif

  #ifdef NORMAL
    varying mat3 tangentSpace;
  #endif

  #include<lightsFragmentFunctions>
  #include<shadowsFragmentFunctions>
  #include<clipPlaneFragmentDeclaration>
  #include<fogFragmentDeclaration>

  // Atlas UV Tiles
  const vec2 TILE1 = vec2(0.0, 1.0);
  const vec2 TILE2 = vec2(1.0, 1.0);
  const vec2 TILE3 = vec2(0.0, 0.0);
  const vec2 TILE4 = vec2(1.0, 0.0);

  // Atlas UV calculator
  vec2 atlasTileUV(vec2 originalUV, vec2 tile, float noiseScale) {
    return fract(originalUV * noiseScale)*(0.5-TILE_PADDING) + vec2(tile.x*0.5+TILE_PADDING*0.5, tile.y*0.5+TILE_PADDING*0.5);
  }

  vec2 atlasTileUV(vec2 originalUV, vec2 tile) {
    return atlasTileUV(originalUV, tile, 1.0);
  }

  // Tile Mixer: atlas1 + atlas2 according to noise
  vec4 tileMix(vec2 originalUV, vec2 tileUV, float axisNormal) {
    return mix(
      texture2D(diffuseSamplerX, atlasTileUV(originalUV,tileUV))*axisNormal, //tile from atlas1
      texture2D(diffuseSamplerY, atlasTileUV(originalUV,tileUV))*axisNormal, //tile from atlas2
      (texture2D(diffuseSamplerZ, atlasTileUV(originalUV,tileUV, NOISE_SCALE))*axisNormal).r); //tile mix noise
  }

  void main(void) {

    #include<clipPlaneFragment>

    vec3 viewDirectionW=normalize(vEyePosition-vPositionW);
    vec4 baseColor=vec4(0.,0.,0.,1.);
    vec3 diffuseColor=vDiffuseColor.rgb;
    float alpha=vDiffuseColor.a;

    //Unlike the original triplanar shader, here we need Mesh Normals
    vec3 normalW=tangentSpace[2];
    normalW*=normalW;

    // NOTE: TEXTURE BASED BUMP/NORMAL MAPS WHERE DISABLED (FOR NOW)
    // It is possible to create another atlas for normalmaps if you want,
    // Load it as a sampler2D, then replace "baseNormal" texture2D's with tileMix.
    // vec4 baseNormal=vec4(0.0,0.0,0.0,1.0); 

    #ifdef DIFFUSEX
      baseColor += tileMix( vTextureUVX, TILE4, normalW.x );
    
      // #ifdef BUMPX
      //   baseNormal+=texture2D(normalSamplerX,vTextureUVX)*normalW.x;
      // #endif
    #endif

    #ifdef DIFFUSEY

      vec4 grassMix = tileMix( vTextureUVY, TILE1, normalW.y );
      vec4 sandMix = tileMix( vTextureUVY, TILE2, normalW.y );
      vec4 plateauMix = tileMix( vTextureUVY, TILE3, normalW.y );

      if(vPositionW.y >= 0.0)
      {
        baseColor += mix( grassMix, plateauMix, min(1.0, sin(vPositionW.y*0.1) ) );
      }
      else
      {
        baseColor += mix( grassMix, sandMix, min(1.0,-vPositionW.y) );
      }

      // #ifdef BUMPY
      //   baseNormal+=texture2D(normalSamplerY,vTextureUVY)*normalW.y;
      // #endif
    #endif

    #ifdef DIFFUSEZ
      baseColor += tileMix( vTextureUVZ, TILE4, normalW.z );

      // #ifdef BUMPZ
      // baseNormal+=texture2D(normalSamplerZ,vTextureUVZ)*normalW.z;
      // #endif
    #endif

    // NOTE: RESTORE THIS IF YOU GENERATE "baseNormal"
    // #ifdef NORMAL
    //   normalW=normalize((2.0*baseNormal.xyz-1.0)*tangentSpace);
    // #endif

    #ifdef ALPHATEST
      if (baseColor.a<0.4)
        discard;
    #endif

    #include<depthPrePass>

    #ifdef VERTEXCOLOR
      baseColor.rgb*=vColor.rgb;
    #endif

    vec3 diffuseBase=vec3(0.,0.,0.);
    lightingInfo info;
    float shadow=1.;

    #ifdef SPECULARTERM
      float glossiness=vSpecularColor.a;
      vec3 specularBase=vec3(0.,0.,0.);
      vec3 specularColor=vSpecularColor.rgb;
    #else
      float glossiness=0.;
    #endif

    #include<lightFragment>[0..maxSimultaneousLights]

    #ifdef VERTEXALPHA
      alpha*=vColor.a;
    #endif

    #ifdef SPECULARTERM
      vec3 finalSpecular=specularBase*specularColor;
    #else
      vec3 finalSpecular=vec3(0.0);
    #endif

    vec3 finalDiffuse=clamp(diffuseBase*diffuseColor,0.0,1.0)*baseColor.rgb;

    vec4 color=vec4(finalDiffuse+finalSpecular,alpha);

    #include<fogFragment>

    gl_FragColor=color;

    #include<imageProcessingCompatibility>
  }
`;
Effect.ShadersStore[name] = shader;
/** @hidden */
export var triplanarPixelShader = { name: name, shader: shader };
//# sourceMappingURL=triplanar.fragment.js.map
