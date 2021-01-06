import { __decorate, __extends } from "tslib";
import { serializeAsTexture, serialize, expandToProperty, serializeAsColor3, SerializationHelper } from "@babylonjs/core/Misc/decorators";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MaterialDefines } from "@babylonjs/core/Materials/materialDefines";
import { MaterialHelper } from "@babylonjs/core/Materials/materialHelper";
import { PushMaterial } from "@babylonjs/core/Materials/pushMaterial";
import { MaterialFlags } from "@babylonjs/core/Materials/materialFlags";
import { VertexBuffer } from "@babylonjs/core/Meshes/buffer";
import { Scene } from "@babylonjs/core/scene";
import { _TypeStore } from '@babylonjs/core/Misc/typeStore';
import "./triplanar.fragment";
import "./triplanar.vertex";
import { EffectFallbacks } from '@babylonjs/core/Materials/effectFallbacks';
var TriPlanarMaterialDefines = /** @class */ (function (_super) {
    __extends(TriPlanarMaterialDefines, _super);
    function TriPlanarMaterialDefines() {
        var _this = _super.call(this) || this;
        _this.DIFFUSEX = false;
        _this.DIFFUSEY = false;
        _this.DIFFUSEZ = false;
        _this.BUMPX = false;
        _this.BUMPY = false;
        _this.BUMPZ = false;
        _this.CLIPPLANE = false;
        _this.CLIPPLANE2 = false;
        _this.CLIPPLANE3 = false;
        _this.CLIPPLANE4 = false;
        _this.CLIPPLANE5 = false;
        _this.CLIPPLANE6 = false;
        _this.ALPHATEST = false;
        _this.DEPTHPREPASS = false;
        _this.POINTSIZE = false;
        _this.FOG = false;
        _this.SPECULARTERM = false;
        _this.NORMAL = false;
        _this.VERTEXCOLOR = false;
        _this.VERTEXALPHA = false;
        _this.NUM_BONE_INFLUENCERS = 0;
        _this.BonesPerMesh = 0;
        _this.INSTANCES = false;
        _this.IMAGEPROCESSINGPOSTPROCESS = false;
        _this.rebuild();
        return _this;
    }
    return TriPlanarMaterialDefines;
}(MaterialDefines));
var TriPlanarMaterial = /** @class */ (function (_super) {
    __extends(TriPlanarMaterial, _super);
    function TriPlanarMaterial(name, scene) {
        var _this = _super.call(this, name, scene) || this;
        _this.tileSize = 1;
        _this.diffuseColor = new Color3(1, 1, 1);
        _this.specularColor = new Color3(0.2, 0.2, 0.2);
        _this.specularPower = 64;
        _this._disableLighting = false;
        _this._maxSimultaneousLights = 4;
        return _this;
    }
    TriPlanarMaterial.prototype.needAlphaBlending = function () {
        return (this.alpha < 1.0);
    };
    TriPlanarMaterial.prototype.needAlphaTesting = function () {
        return false;
    };
    TriPlanarMaterial.prototype.getAlphaTestTexture = function () {
        return null;
    };
    // Methods
    TriPlanarMaterial.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
        if (this.isFrozen) {
            if (subMesh.effect && subMesh.effect._wasPreviouslyReady) {
                return true;
            }
        }
        if (!subMesh._materialDefines) {
            subMesh._materialDefines = new TriPlanarMaterialDefines();
        }
        var defines = subMesh._materialDefines;
        var scene = this.getScene();
        if (this._isReadyForSubMesh(subMesh)) {
            return true;
        }
        var engine = scene.getEngine();
        // Textures
        if (defines._areTexturesDirty) {
            if (scene.texturesEnabled) {
                if (MaterialFlags.DiffuseTextureEnabled) {
                    var textures = [this.diffuseTextureX, this.diffuseTextureY, this.diffuseTextureZ];
                    var textureDefines = ["DIFFUSEX", "DIFFUSEY", "DIFFUSEZ"];
                    for (var i = 0; i < textures.length; i++) {
                        if (textures[i]) {
                            if (!textures[i].isReady()) {
                                return false;
                            }
                            else {
                                defines[textureDefines[i]] = true;
                            }
                        }
                    }
                }
                if (MaterialFlags.BumpTextureEnabled) {
                    var textures = [this.normalTextureX, this.normalTextureY, this.normalTextureZ];
                    var textureDefines = ["BUMPX", "BUMPY", "BUMPZ"];
                    for (var i = 0; i < textures.length; i++) {
                        if (textures[i]) {
                            if (!textures[i].isReady()) {
                                return false;
                            }
                            else {
                                defines[textureDefines[i]] = true;
                            }
                        }
                    }
                }
            }
        }
        // Misc.
        MaterialHelper.PrepareDefinesForMisc(mesh, scene, false, this.pointsCloud, this.fogEnabled, this._shouldTurnAlphaTestOn(mesh), defines);
        // Lights
        defines._needNormals = MaterialHelper.PrepareDefinesForLights(scene, mesh, defines, false, this._maxSimultaneousLights, this._disableLighting);
        // Values that need to be evaluated on every frame
        MaterialHelper.PrepareDefinesForFrameBoundValues(scene, engine, defines, useInstances ? true : false);
        // Attribs
        MaterialHelper.PrepareDefinesForAttributes(mesh, defines, true, true);
        // Get correct effect
        if (defines.isDirty) {
            defines.markAsProcessed();
            scene.resetCachedMaterial();
            // Fallbacks
            var fallbacks = new EffectFallbacks();
            if (defines.FOG) {
                fallbacks.addFallback(1, "FOG");
            }
            MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this.maxSimultaneousLights);
            if (defines.NUM_BONE_INFLUENCERS > 0) {
                fallbacks.addCPUSkinningFallback(0, mesh);
            }
            defines.IMAGEPROCESSINGPOSTPROCESS = scene.imageProcessingConfiguration.applyByPostProcess;
            //Attributes
            var attribs = [VertexBuffer.PositionKind];
            if (defines.NORMAL) {
                attribs.push(VertexBuffer.NormalKind);
            }
            if (defines.VERTEXCOLOR) {
                attribs.push(VertexBuffer.ColorKind);
            }
            MaterialHelper.PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
            MaterialHelper.PrepareAttributesForInstances(attribs, defines);
            // Legacy browser patch
            var shaderName = "triplanar";
            var join = defines.toString();
            var uniforms = ["world", "view", "viewProjection", "vEyePosition", "vLightsType", "vDiffuseColor", "vSpecularColor",
                "vFogInfos", "vFogColor", "pointSize",
                "mBones",
                "vClipPlane", "vClipPlane2", "vClipPlane3", "vClipPlane4", "vClipPlane5", "vClipPlane6",
                "tileSize"
            ];
            var samplers = ["diffuseSamplerX", "diffuseSamplerY", "diffuseSamplerZ",
                "normalSamplerX", "normalSamplerY", "normalSamplerZ"
            ];
            var uniformBuffers = new Array();
            MaterialHelper.PrepareUniformsAndSamplersList({
                uniformsNames: uniforms,
                uniformBuffersNames: uniformBuffers,
                samplers: samplers,
                defines: defines,
                maxSimultaneousLights: this.maxSimultaneousLights
            });
            subMesh.setEffect(scene.getEngine().createEffect(shaderName, {
                attributes: attribs,
                uniformsNames: uniforms,
                uniformBuffersNames: uniformBuffers,
                samplers: samplers,
                defines: join,
                fallbacks: fallbacks,
                onCompiled: this.onCompiled,
                onError: this.onError,
                indexParameters: { maxSimultaneousLights: this.maxSimultaneousLights }
            }, engine), defines);
        }
        if (!subMesh.effect || !subMesh.effect.isReady()) {
            return false;
        }
        defines._renderId = scene.getRenderId();
        subMesh.effect._wasPreviouslyReady = true;
        return true;
    };
    TriPlanarMaterial.prototype.bindForSubMesh = function (world, mesh, subMesh) {
        var scene = this.getScene();
        var defines = subMesh._materialDefines;
        if (!defines) {
            return;
        }
        var effect = subMesh.effect;
        if (!effect) {
            return;
        }
        this._activeEffect = effect;
        // Matrices
        this.bindOnlyWorldMatrix(world);
        this._activeEffect.setMatrix("viewProjection", scene.getTransformMatrix());
        // Bones
        MaterialHelper.BindBonesParameters(mesh, this._activeEffect);
        this._activeEffect.setFloat("tileSize", this.tileSize);
        if (scene.getCachedMaterial() !== this) {
            // Textures
            if (this.diffuseTextureX) {
                this._activeEffect.setTexture("diffuseSamplerX", this.diffuseTextureX);
            }
            if (this.diffuseTextureY) {
                this._activeEffect.setTexture("diffuseSamplerY", this.diffuseTextureY);
            }
            if (this.diffuseTextureZ) {
                this._activeEffect.setTexture("diffuseSamplerZ", this.diffuseTextureZ);
            }
            if (this.normalTextureX) {
                this._activeEffect.setTexture("normalSamplerX", this.normalTextureX);
            }
            if (this.normalTextureY) {
                this._activeEffect.setTexture("normalSamplerY", this.normalTextureY);
            }
            if (this.normalTextureZ) {
                this._activeEffect.setTexture("normalSamplerZ", this.normalTextureZ);
            }
            // Clip plane
            MaterialHelper.BindClipPlane(this._activeEffect, scene);
            // Point size
            if (this.pointsCloud) {
                this._activeEffect.setFloat("pointSize", this.pointSize);
            }
            MaterialHelper.BindEyePosition(effect, scene);
        }
        this._activeEffect.setColor4("vDiffuseColor", this.diffuseColor, this.alpha * mesh.visibility);
        if (defines.SPECULARTERM) {
            this._activeEffect.setColor4("vSpecularColor", this.specularColor, this.specularPower);
        }
        if (scene.lightsEnabled && !this.disableLighting) {
            MaterialHelper.BindLights(scene, mesh, this._activeEffect, defines, this.maxSimultaneousLights);
        }
        // View
        if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== Scene.FOGMODE_NONE) {
            this._activeEffect.setMatrix("view", scene.getViewMatrix());
        }
        // Fog
        MaterialHelper.BindFogParameters(scene, mesh, this._activeEffect);
        this._afterBind(mesh, this._activeEffect);
    };
    TriPlanarMaterial.prototype.getAnimatables = function () {
        var results = [];
        if (this.mixTexture && this.mixTexture.animations && this.mixTexture.animations.length > 0) {
            results.push(this.mixTexture);
        }
        return results;
    };
    TriPlanarMaterial.prototype.getActiveTextures = function () {
        var activeTextures = _super.prototype.getActiveTextures.call(this);
        if (this._diffuseTextureX) {
            activeTextures.push(this._diffuseTextureX);
        }
        if (this._diffuseTextureY) {
            activeTextures.push(this._diffuseTextureY);
        }
        if (this._diffuseTextureZ) {
            activeTextures.push(this._diffuseTextureZ);
        }
        if (this._normalTextureX) {
            activeTextures.push(this._normalTextureX);
        }
        if (this._normalTextureY) {
            activeTextures.push(this._normalTextureY);
        }
        if (this._normalTextureZ) {
            activeTextures.push(this._normalTextureZ);
        }
        return activeTextures;
    };
    TriPlanarMaterial.prototype.hasTexture = function (texture) {
        if (_super.prototype.hasTexture.call(this, texture)) {
            return true;
        }
        if (this._diffuseTextureX === texture) {
            return true;
        }
        if (this._diffuseTextureY === texture) {
            return true;
        }
        if (this._diffuseTextureZ === texture) {
            return true;
        }
        if (this._normalTextureX === texture) {
            return true;
        }
        if (this._normalTextureY === texture) {
            return true;
        }
        if (this._normalTextureZ === texture) {
            return true;
        }
        return false;
    };
    TriPlanarMaterial.prototype.dispose = function (forceDisposeEffect) {
        if (this.mixTexture) {
            this.mixTexture.dispose();
        }
        _super.prototype.dispose.call(this, forceDisposeEffect);
    };
    TriPlanarMaterial.prototype.clone = function (name) {
        var _this = this;
        return SerializationHelper.Clone(function () { return new TriPlanarMaterial(name, _this.getScene()); }, this);
    };
    TriPlanarMaterial.prototype.serialize = function () {
        var serializationObject = SerializationHelper.Serialize(this);
        serializationObject.customType = "BABYLON.TriPlanarMaterial";
        return serializationObject;
    };
    TriPlanarMaterial.prototype.getClassName = function () {
        return "TriPlanarMaterial";
    };
    // Statics
    TriPlanarMaterial.Parse = function (source, scene, rootUrl) {
        return SerializationHelper.Parse(function () { return new TriPlanarMaterial(source.name, scene); }, source, scene, rootUrl);
    };
    __decorate([
        serializeAsTexture()
    ], TriPlanarMaterial.prototype, "mixTexture", void 0);
    __decorate([
        serializeAsTexture("diffuseTextureX")
    ], TriPlanarMaterial.prototype, "_diffuseTextureX", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], TriPlanarMaterial.prototype, "diffuseTextureX", void 0);
    __decorate([
        serializeAsTexture("diffuseTexturY")
    ], TriPlanarMaterial.prototype, "_diffuseTextureY", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], TriPlanarMaterial.prototype, "diffuseTextureY", void 0);
    __decorate([
        serializeAsTexture("diffuseTextureZ")
    ], TriPlanarMaterial.prototype, "_diffuseTextureZ", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], TriPlanarMaterial.prototype, "diffuseTextureZ", void 0);
    __decorate([
        serializeAsTexture("normalTextureX")
    ], TriPlanarMaterial.prototype, "_normalTextureX", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], TriPlanarMaterial.prototype, "normalTextureX", void 0);
    __decorate([
        serializeAsTexture("normalTextureY")
    ], TriPlanarMaterial.prototype, "_normalTextureY", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], TriPlanarMaterial.prototype, "normalTextureY", void 0);
    __decorate([
        serializeAsTexture("normalTextureZ")
    ], TriPlanarMaterial.prototype, "_normalTextureZ", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsTexturesDirty")
    ], TriPlanarMaterial.prototype, "normalTextureZ", void 0);
    __decorate([
        serialize()
    ], TriPlanarMaterial.prototype, "tileSize", void 0);
    __decorate([
        serializeAsColor3()
    ], TriPlanarMaterial.prototype, "diffuseColor", void 0);
    __decorate([
        serializeAsColor3()
    ], TriPlanarMaterial.prototype, "specularColor", void 0);
    __decorate([
        serialize()
    ], TriPlanarMaterial.prototype, "specularPower", void 0);
    __decorate([
        serialize("disableLighting")
    ], TriPlanarMaterial.prototype, "_disableLighting", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsLightsDirty")
    ], TriPlanarMaterial.prototype, "disableLighting", void 0);
    __decorate([
        serialize("maxSimultaneousLights")
    ], TriPlanarMaterial.prototype, "_maxSimultaneousLights", void 0);
    __decorate([
        expandToProperty("_markAllSubMeshesAsLightsDirty")
    ], TriPlanarMaterial.prototype, "maxSimultaneousLights", void 0);
    return TriPlanarMaterial;
}(PushMaterial));
export { TriPlanarMaterial };
_TypeStore.RegisteredTypes["BABYLON.TriPlanarMaterial"] = TriPlanarMaterial;
//# sourceMappingURL=triPlanarMaterial.js.map