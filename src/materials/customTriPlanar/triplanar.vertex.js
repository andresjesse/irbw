import { Effect } from "@babylonjs/core/Materials/effect";
import "@babylonjs/core/Shaders/ShadersInclude/bonesDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/instancesDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/clipPlaneVertexDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/fogVertexDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/lightFragmentDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/lightUboDeclaration";
import "@babylonjs/core/Shaders/ShadersInclude/instancesVertex";
import "@babylonjs/core/Shaders/ShadersInclude/bonesVertex";
import "@babylonjs/core/Shaders/ShadersInclude/clipPlaneVertex";
import "@babylonjs/core/Shaders/ShadersInclude/fogVertex";
import "@babylonjs/core/Shaders/ShadersInclude/shadowsVertex";
var name = "triplanarVertexShader";
//var shader = "precision highp float;\n\nattribute vec3 position;\n#ifdef NORMAL\nattribute vec3 normal;\n#endif\n#ifdef VERTEXCOLOR\nattribute vec4 color;\n#endif\n#include<bonesDeclaration>\n\n#include<instancesDeclaration>\nuniform mat4 view;\nuniform mat4 viewProjection;\n#ifdef DIFFUSEX\nvarying vec2 vTextureUVX;\n#endif\n#ifdef DIFFUSEY\nvarying vec2 vTextureUVY;\n#endif\n#ifdef DIFFUSEZ\nvarying vec2 vTextureUVZ;\n#endif\nuniform float tileSize;\n#ifdef POINTSIZE\nuniform float pointSize;\n#endif\n\nvarying vec3 vPositionW;\n#ifdef NORMAL\nvarying mat3 tangentSpace;\n#endif\n#ifdef VERTEXCOLOR\nvarying vec4 vColor;\n#endif\n#include<clipPlaneVertexDeclaration>\n#include<fogVertexDeclaration>\n#include<__decl__lightFragment>[0..maxSimultaneousLights]\nvoid main(void)\n{\n#include<instancesVertex>\n#include<bonesVertex>\nvec4 worldPos=finalWorld*vec4(position,1.0);\ngl_Position=viewProjection*worldPos;\nvPositionW=vec3(worldPos);\n#ifdef DIFFUSEX\nvTextureUVX=worldPos.zy/tileSize;\n#endif\n#ifdef DIFFUSEY\nvTextureUVY=worldPos.xz/tileSize;\n#endif\n#ifdef DIFFUSEZ\nvTextureUVZ=worldPos.xy/tileSize;\n#endif\n#ifdef NORMAL\n\nvec3 xtan=vec3(0,0,1);\nvec3 xbin=vec3(0,1,0);\nvec3 ytan=vec3(1,0,0);\nvec3 ybin=vec3(0,0,1);\nvec3 ztan=vec3(1,0,0);\nvec3 zbin=vec3(0,1,0);\nvec3 normalizedNormal=normalize(normal);\nnormalizedNormal*=normalizedNormal;\nvec3 worldBinormal=normalize(xbin*normalizedNormal.x+ybin*normalizedNormal.y+zbin*normalizedNormal.z);\nvec3 worldTangent=normalize(xtan*normalizedNormal.x+ytan*normalizedNormal.y+ztan*normalizedNormal.z);\nworldTangent=(world*vec4(worldTangent,1.0)).xyz;\nworldBinormal=(world*vec4(worldBinormal,1.0)).xyz;\nvec3 worldNormal=(world*vec4(normalize(normal),1.0)).xyz;\ntangentSpace[0]=worldTangent;\ntangentSpace[1]=worldBinormal;\ntangentSpace[2]=worldNormal;\n#endif\n\n#include<clipPlaneVertex>\n\n#include<fogVertex>\n\n#include<shadowsVertex>[0..maxSimultaneousLights]\n\n#ifdef VERTEXCOLOR\nvColor=color;\n#endif\n\n#ifdef POINTSIZE\ngl_PointSize=pointSize;\n#endif\n}\n";
var shader = `
precision highp float;

attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>

#include<instancesDeclaration>
uniform mat4 view;
uniform mat4 viewProjection;
#ifdef DIFFUSEX
varying vec2 vTextureUVX;
#endif
#ifdef DIFFUSEY
varying vec2 vTextureUVY;
#endif
#ifdef DIFFUSEZ
varying vec2 vTextureUVZ;
#endif
uniform float tileSize;
#ifdef POINTSIZE
uniform float pointSize;
#endif

varying vec3 vPositionW;
#ifdef NORMAL
varying mat3 tangentSpace;
#endif
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
void main(void)
{
#include<instancesVertex>
#include<bonesVertex>
vec4 worldPos=finalWorld*vec4(position,1.0);
gl_Position=viewProjection*worldPos;
vPositionW=vec3(worldPos);
#ifdef DIFFUSEX
vTextureUVX=worldPos.zy/tileSize;
#endif
#ifdef DIFFUSEY
vTextureUVY=worldPos.xz/tileSize;
#endif
#ifdef DIFFUSEZ
vTextureUVZ=worldPos.xy/tileSize;
#endif
#ifdef NORMAL

vec3 xtan=vec3(0,0,1);
vec3 xbin=vec3(0,1,0);
vec3 ytan=vec3(1,0,0);
vec3 ybin=vec3(0,0,1);
vec3 ztan=vec3(1,0,0);
vec3 zbin=vec3(0,1,0);
vec3 normalizedNormal=normalize(normal);
normalizedNormal*=normalizedNormal;
vec3 worldBinormal=normalize(xbin*normalizedNormal.x+ybin*normalizedNormal.y+zbin*normalizedNormal.z);
vec3 worldTangent=normalize(xtan*normalizedNormal.x+ytan*normalizedNormal.y+ztan*normalizedNormal.z);
worldTangent=(world*vec4(worldTangent,1.0)).xyz;
worldBinormal=(world*vec4(worldBinormal,1.0)).xyz;
vec3 worldNormal=(world*vec4(normalize(normal),1.0)).xyz;
tangentSpace[0]=worldTangent;
tangentSpace[1]=worldBinormal;
tangentSpace[2]=worldNormal;
#endif

#include<clipPlaneVertex>

#include<fogVertex>

#include<shadowsVertex>[0..maxSimultaneousLights]

#ifdef VERTEXCOLOR
vColor=color;
#endif

#ifdef POINTSIZE
gl_PointSize=pointSize;
#endif
}
`;
Effect.ShadersStore[name] = shader;
/** @hidden */
export var triplanarVertexShader = { name: name, shader: shader };
//# sourceMappingURL=triplanar.vertex.js.map
