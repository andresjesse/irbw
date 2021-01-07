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
//var shader = "precision highp float;\n\nuniform vec3 vEyePosition;\nuniform vec4 vDiffuseColor;\n#ifdef SPECULARTERM\nuniform vec4 vSpecularColor;\n#endif\n\nvarying vec3 vPositionW;\n#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#endif\n\n#include<helperFunctions>\n\n#include<__decl__lightFragment>[0..maxSimultaneousLights]\n\n#ifdef DIFFUSEX\nvarying vec2 vTextureUVX;\nuniform sampler2D diffuseSamplerX;\n#ifdef BUMPX\nuniform sampler2D normalSamplerX;\n#endif\n#endif\n#ifdef DIFFUSEY\nvarying vec2 vTextureUVY;\nuniform sampler2D diffuseSamplerY;\n#ifdef BUMPY\nuniform sampler2D normalSamplerY;\n#endif\n#endif\n#ifdef DIFFUSEZ\nvarying vec2 vTextureUVZ;\nuniform sampler2D diffuseSamplerZ;\n#ifdef BUMPZ\nuniform sampler2D normalSamplerZ;\n#endif\n#endif\n#ifdef NORMAL\nvarying mat3 tangentSpace;\n#endif\n#include<lightsFragmentFunctions>\n#include<shadowsFragmentFunctions>\n#include<clipPlaneFragmentDeclaration>\n#include<fogFragmentDeclaration>\nvoid main(void) {\n\n#include<clipPlaneFragment>\nvec3 viewDirectionW=normalize(vEyePosition-vPositionW);\n\nvec4 baseColor=vec4(0.,0.,0.,1.);\nvec3 diffuseColor=vDiffuseColor.rgb;\n\nfloat alpha=vDiffuseColor.a;\n\n#ifdef NORMAL\nvec3 normalW=tangentSpace[2];\n#else\nvec3 normalW=vec3(1.0,1.0,1.0);\n#endif\nvec4 baseNormal=vec4(0.0,0.0,0.0,1.0);\nnormalW*=normalW;\n#ifdef DIFFUSEX\nbaseColor+=texture2D(diffuseSamplerX,vTextureUVX)*normalW.x;\n#ifdef BUMPX\nbaseNormal+=texture2D(normalSamplerX,vTextureUVX)*normalW.x;\n#endif\n#endif\n#ifdef DIFFUSEY\nbaseColor+=texture2D(diffuseSamplerY,vTextureUVY)*normalW.y;\n#ifdef BUMPY\nbaseNormal+=texture2D(normalSamplerY,vTextureUVY)*normalW.y;\n#endif\n#endif\n#ifdef DIFFUSEZ\nbaseColor+=texture2D(diffuseSamplerZ,vTextureUVZ)*normalW.z;\n#ifdef BUMPZ\nbaseNormal+=texture2D(normalSamplerZ,vTextureUVZ)*normalW.z;\n#endif\n#endif\n#ifdef NORMAL\nnormalW=normalize((2.0*baseNormal.xyz-1.0)*tangentSpace);\n#endif\n#ifdef ALPHATEST\nif (baseColor.a<0.4)\ndiscard;\n#endif\n#include<depthPrePass>\n#ifdef VERTEXCOLOR\nbaseColor.rgb*=vColor.rgb;\n#endif\n\nvec3 diffuseBase=vec3(0.,0.,0.);\nlightingInfo info;\nfloat shadow=1.;\n#ifdef SPECULARTERM\nfloat glossiness=vSpecularColor.a;\nvec3 specularBase=vec3(0.,0.,0.);\nvec3 specularColor=vSpecularColor.rgb;\n#else\nfloat glossiness=0.;\n#endif\n#include<lightFragment>[0..maxSimultaneousLights]\n#ifdef VERTEXALPHA\nalpha*=vColor.a;\n#endif\n#ifdef SPECULARTERM\nvec3 finalSpecular=specularBase*specularColor;\n#else\nvec3 finalSpecular=vec3(0.0);\n#endif\nvec3 finalDiffuse=clamp(diffuseBase*diffuseColor,0.0,1.0)*baseColor.rgb;\n\nvec4 color=vec4(finalDiffuse+finalSpecular,alpha);\n#include<fogFragment>\ngl_FragColor=color;\n#include<imageProcessingCompatibility>\n}\n";
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

//X = Atlas1
//Y = Atlas2
//Z = Noise

void main(void) {

  vec2 atlasUV1 = fract(vTextureUVY)*0.48 + vec2(0.01,0.51);
  vec2 atlasUV2 = fract(vTextureUVY)*0.48 + vec2(0.51,0.51);
  vec2 atlasUV3 = fract(vTextureUVY)*0.48 + vec2(0.01,0.01);
  vec2 atlasUV4 = fract(vTextureUVY)*0.48 + vec2(0.51,0.01);

  #include<clipPlaneFragment>
  vec3 viewDirectionW=normalize(vEyePosition-vPositionW);

  vec4 baseColor=vec4(0.,0.,0.,1.);
  vec3 diffuseColor=vDiffuseColor.rgb;

  float alpha=vDiffuseColor.a;

  #ifdef NORMAL
  vec3 normalW=tangentSpace[2];
  #else
  vec3 normalW=vec3(1.0,1.0,1.0);
  #endif
  vec4 baseNormal=vec4(0.0,0.0,0.0,1.0);
  normalW*=normalW;
  #ifdef DIFFUSEX
  //baseColor+=texture2D(diffuseSamplerX,vTextureUVX)*normalW.x;
  baseColor+=texture2D(diffuseSamplerX,atlasUV4)*normalW.x;
  #ifdef BUMPX
  baseNormal+=texture2D(normalSamplerX,vTextureUVX)*normalW.x;
  #endif
  #endif
  #ifdef DIFFUSEY
  //baseColor+=texture2D(diffuseSamplerY, atlasUV4 )*normalW.y;
  //vec4 atlasTX1 = texture2D(diffuseSamplerY, atlasUV1 )*normalW.y;
  //vec4 atlasTX2 = texture2D(diffuseSamplerY, atlasUV2 )*normalW.y;
  //vec4 atlasTX3 = texture2D(diffuseSamplerY, atlasUV3 )*normalW.y;
  //vec4 atlasTX4 = texture2D(diffuseSamplerY, atlasUV4 )*normalW.y;

  vec4 grassMix = mix(
    texture2D(diffuseSamplerX, fract(vTextureUVY)*0.48 + vec2(0.01,0.51) )*normalW.y, //atlas1 grass
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
  normalW=normalize((2.0*baseNormal.xyz-1.0)*tangentSpace);
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
