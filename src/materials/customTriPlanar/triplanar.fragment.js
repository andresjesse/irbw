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
  vec2 atlasTileUV(vec2 originalUV, vec2 tile) {
    return fract(originalUV)*0.48 + vec2(tile.x*0.5+0.01, tile.y*0.5+0.01);
  }

  void main(void) {

    #include<clipPlaneFragment>

    vec3 viewDirectionW=normalize(vEyePosition-vPositionW);
    vec4 baseColor=vec4(0.,0.,0.,1.);
    vec3 diffuseColor=vDiffuseColor.rgb;
    float alpha=vDiffuseColor.a;

    // #ifdef NORMAL
    //   vec3 normalW=tangentSpace[2];
    // #else
    //   vec3 normalW=vec3(1.0,1.0,1.0);
    // #endif

    vec4 baseNormal=vec4(0.0,0.0,0.0,1.0);
    normalW*=normalW;

    #ifdef DIFFUSEX
      baseColor+=texture2D(diffuseSamplerX, atlasTileUV(vTextureUVX,TILE4) )*normalW.x;
    
      // #ifdef BUMPX
      //   baseNormal+=texture2D(normalSamplerX,vTextureUVX)*normalW.x;
      // #endif
    #endif

    #ifdef DIFFUSEY
    //baseColor+=texture2D(diffuseSamplerY, atlasUV4 )*normalW.y;
    //vec4 atlasTX1 = texture2D(diffuseSamplerY, atlasUV1 )*normalW.y;
    //vec4 atlasTX2 = texture2D(diffuseSamplerY, atlasUV2 )*normalW.y;
    //vec4 atlasTX3 = texture2D(diffuseSamplerY, atlasUV3 )*normalW.y;
    //vec4 atlasTX4 = texture2D(diffuseSamplerY, atlasUV4 )*normalW.y;

continuar aqui, converter esses MIX para atlasTileUV(...)
documentar o que for necessario
comentar tudo relacionado aos normals, manter no final apenas normalW=tangentSpace[2];

    vec4 grassMix = mix(
      texture2D(diffuseSamplerX, atlasTileUV(vTextureUVY,TILE1) )*normalW.y, //atlas1 grass
      texture2D(diffuseSamplerY, fract(vTextureUVY)*0.48 + vec2(0.01,0.51) )*normalW.y, //atlas2 grass
      (texture2D(diffuseSamplerZ, fract(vTextureUVY * 0.05)*0.48 + vec2(0.51,0.01) )*normalW.y).r); //grass noise

    vec4 sandMix = mix(
      texture2D(diffuseSamplerX, fract(vTextureUVY)*0.48 + vec2(0.51,0.51) )*normalW.y, //atlas1 sand
      texture2D(diffuseSamplerY, fract(vTextureUVY)*0.48 + vec2(0.51,0.51) )*normalW.y, //atlas2 sand
      (texture2D(diffuseSamplerZ, fract(vTextureUVY * 0.05)*0.48 + vec2(0.51,0.51) )*normalW.y).r); //sand noise

    vec4 rockMix = mix(
      texture2D(diffuseSamplerX, fract(vTextureUVY)*0.48 + vec2(0.01,0.01) )*normalW.y, //atlas1 rock
      texture2D(diffuseSamplerY, fract(vTextureUVY)*0.48 + vec2(0.01,0.01) )*normalW.y, //atlas2 rock
      (texture2D(diffuseSamplerZ, fract(vTextureUVY * 0.05)*0.48 + vec2(0.01,0.01) )*normalW.y).r); //rock noise

    if(vPositionW.y >= 0.0)
    {
      //baseColor+= atlasTX1;
      
      //baseColor += mix( atlasTX1, atlasTX3, min(1.0, sin(vPositionW.y*0.1) ) );//OK!
      baseColor += mix( grassMix, rockMix, min(1.0, sin(vPositionW.y*0.1) ) );//OK!
    }
    else
    {
      baseColor+= mix( grassMix, sandMix, min(1.0,-vPositionW.y) );
    }
    #ifdef BUMPY
    baseNormal+=texture2D(normalSamplerY,vTextureUVY)*normalW.y;
    #endif
    #endif
    #ifdef DIFFUSEZ
    
    vec4 cliffMixZ = mix(
      texture2D(diffuseSamplerX, fract(vTextureUVZ)*0.48 + vec2(0.51,0.01) )*normalW.z, //atlas1 cliff
      texture2D(diffuseSamplerY, fract(vTextureUVZ)*0.48 + vec2(0.51,0.01) )*normalW.z, //atlas2 cliff
      (texture2D(diffuseSamplerZ, fract(vTextureUVZ * 0.05)*0.48 + vec2(0.51,0.01) )*normalW.z).r); //cliff noise

    baseColor += cliffMixZ;//TODO: verificar noise seamless!

    #ifdef BUMPZ
    baseNormal+=texture2D(normalSamplerZ,vTextureUVZ)*normalW.z;
    #endif
    #endif
    #ifdef NORMAL
    //normalW=normalize((2.0*baseNormal.xyz-1.0)*tangentSpace);
    normalW=tangentSpace[2]; //IGNORE ALL NORMAL CHANGES
    #endif
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
