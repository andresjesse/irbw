import * as BABYLON from "@babylonjs/core";

let id = 100;

export default class VegetationInstance {
  constructor(data, isThin) {
    this.isThin = isThin;
    this.data = data;

    isThin ? this._thinInstanceCreate() : this._instancedMeshCreate();
  }

  dispose() {
    this.isThin ? this._thinInstanceDispose() : this._instancedMeshDispose();
  }

  enableShadows() {
    if (!this.data.castShadows) return;

    this.isThin
      ? this._thinInstanceEnableShadows()
      : this._instancedMeshEnableShadows();
  }

  setPosition(pos) {
    this.position = pos;
    this.isThin
      ? this._thinInstanceSetPosition(pos)
      : this._instancedMeshSetPosition(pos);
  }

  setRotation(rot) {
    this.rotation = rot;
    this.isThin
      ? this._thinInstanceSetRotation(rot)
      : this._instancedMeshSetRotation(rot);
  }

  setScale(scl) {
    this.scale = scl;
    this.isThin
      ? this._thinInstanceSetScale(scl)
      : this._instancedMeshSetScale(scl);
  }

  // ------------------------------------------------------------ InstancedMesh Stuff

  _instancedMeshCreate() {
    this.innerInstances = [];

    this.data.meshes.forEach((mesh) => {
      this.innerInstances.push(
        mesh.createInstance("VegetationInstance-" + mesh.name + "-" + id++)
      );
    });
  }

  _instancedMeshDispose() {
    this.innerInstances.forEach((innerInstance) => {
      innerInstance.dispose();
    });
  }

  _instancedMeshEnableShadows() {
    this.innerInstances.forEach((innerInstance) => {
      this.data.scene.smgr.lightManager.addShadowsTo(innerInstance);
    });
  }

  _instancedMeshSetPosition(pos) {
    this.innerInstances.forEach((innerInstance) => {
      innerInstance.position.x = innerInstance.sourceMesh.position.x + pos.x;
      innerInstance.position.y = innerInstance.sourceMesh.position.y + pos.y;
      innerInstance.position.z = innerInstance.sourceMesh.position.z + pos.z;
    });
  }

  _instancedMeshSetRotation(rot) {
    this.innerInstances.forEach((innerInstance) => {
      innerInstance.rotation.x = innerInstance.sourceMesh.rotation.x + rot.x;
      innerInstance.rotation.y = innerInstance.sourceMesh.rotation.y + rot.y;
      innerInstance.rotation.z = innerInstance.sourceMesh.rotation.z + rot.z;
    });
  }

  _instancedMeshSetScale(scl) {
    this.innerInstances.forEach((innerInstance) => {
      innerInstance.scaling.x = innerInstance.sourceMesh.scaling.x * scl.x;
      innerInstance.scaling.y = innerInstance.sourceMesh.scaling.y * scl.y;
      innerInstance.scaling.z = innerInstance.sourceMesh.scaling.z * scl.z;
    });
  }

  // ------------------------------------------------------------ ThinInstances Stuff

  _thinInstanceFindBufferIndexById(innerInstance) {
    return innerInstance.mesh._userThinInstanceBuffersStorage.data[
      "id"
    ].indexOf(innerInstance.id);
  }

  _thinInstanceCreate() {
    this.innerInstances = [];

    this.position = new BABYLON.Vector3(0, 0, 0);
    this.rotation = new BABYLON.Vector3(0, 0, 0);
    this.scale = new BABYLON.Vector3(1, 1, 1);

    this.data.meshes.forEach((mesh) => {
      // ThinInstance first execution setup
      if (mesh.thinInstancesInitialized != true) {
        mesh.thinInstanceRegisterAttribute("id", 1);
        mesh.thinInstancesInitialized = true;
      }

      // create instance at origin with default scale and rot
      const matrix = BABYLON.Matrix.Compose(
        this.scale,
        BABYLON.Quaternion.FromEulerVector(this.rotation),
        this.position
      );

      let thinInstanceIndex = mesh.thinInstanceAdd(matrix);
      mesh.thinInstanceSetAttributeAt("id", thinInstanceIndex, [id]);

      this.innerInstances.push({ mesh, id });

      id++;

      // meshes are loaded in AssetPreloader and remain disabled until thinInstances are created.
      mesh.setEnabled(true);
    });
  }

  _thinInstanceDispose() {
    this.innerInstances.forEach((innerInstance) => {
      let blackListedId = innerInstance.id;

      let bfSize =
        innerInstance.mesh._userThinInstanceBuffersStorage.data["id"].length -
        2;

      let newMatrixBuffer = new Float32Array(16 * bfSize);
      let newIdBuffer = new Float32Array(bfSize);

      let bfIndex = 0;

      innerInstance.mesh._userThinInstanceBuffersStorage.data["id"].forEach(
        (id, index) => {
          if (id != blackListedId && id > 0) {
            newIdBuffer[bfIndex] = id;
            innerInstance.mesh
              .thinInstanceGetWorldMatrices()
              [index].copyToArray(newMatrixBuffer, bfIndex * 16);
            bfIndex++;
          }
        }
      );

      if (newIdBuffer.length > 0) {
        // replace thinInstances buffer
        innerInstance.mesh.thinInstanceSetBuffer("matrix", newMatrixBuffer, 16);
        innerInstance.mesh.thinInstanceSetBuffer("id", newIdBuffer, 1);
      } else {
        // disable original mesh when no instances are drawn
        innerInstance.mesh.thinInstanceCount = 0;
        innerInstance.mesh.setEnabled(false);
      }
    });
  }

  _thinInstanceEnableShadows() {
    this.data.meshes.forEach((mesh) => {
      this.data.scene.smgr.lightManager.addShadowsTo(mesh);
    });
  }

  _thinInstanceSetPosition(pos) {
    this.innerInstances.forEach((innerInstance) => {
      let instanceIndexOnBuffer = this._thinInstanceFindBufferIndexById(
        innerInstance
      );

      let thinInstanceMatrix = innerInstance.mesh.thinInstanceGetWorldMatrices()[
        instanceIndexOnBuffer
      ];

      // update position (I ask me, why there's no setRotation and setScale?)
      thinInstanceMatrix.setTranslation(pos);

      innerInstance.mesh.thinInstanceSetMatrixAt(
        instanceIndexOnBuffer,
        thinInstanceMatrix
      );
    });
  }

  _thinInstanceSetRotation(rot) {
    this.innerInstances.forEach((innerInstance) => {
      let instanceIndexOnBuffer = this._thinInstanceFindBufferIndexById(
        innerInstance
      );

      // generate a new matrix updating rotation as quaternion
      innerInstance.mesh.thinInstanceSetMatrixAt(
        instanceIndexOnBuffer,
        BABYLON.Matrix.Compose(
          this.scale,
          BABYLON.Quaternion.FromEulerVector(rot),
          this.position
        )
      );
    });
  }

  _thinInstanceSetScale(scl) {
    this.innerInstances.forEach((innerInstance) => {
      let instanceIndexOnBuffer = this._thinInstanceFindBufferIndexById(
        innerInstance
      );

      // generate a new matrix updating scale
      innerInstance.mesh.thinInstanceSetMatrixAt(
        instanceIndexOnBuffer,
        BABYLON.Matrix.Compose(
          scl,
          BABYLON.Quaternion.FromEulerVector(this.rotation),
          this.position
        )
      );
    });
  }
}
