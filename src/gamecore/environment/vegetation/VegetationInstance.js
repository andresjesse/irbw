let id = 100;

export default class VegetationInstance {
  constructor(data, isThin) {
    this.isThin = isThin;
    this.data = data;

    isThin ? this._thinInstanceCreate() : this._instancedMeshCreate();
  }

  dispose() {
    this.isThin ? {} : this._instancedMeshDispose();
  }

  enableShadows() {
    this.isThin ? {} : this._instancedMeshEnableShadows();
  }

  setPosition(pos) {
    this.position = pos;
    this.isThin ? {} : this._instancedMeshSetPosition(pos);
  }

  setRotation(rot) {
    this.rotation = rot;
    this.isThin ? {} : this._instancedMeshSetRotation(rot);
  }

  setScale(scl) {
    this.scale = scl;
    this.isThin ? {} : this._instancedMeshSetScale(scl);
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

  _thinInstanceCreate() {
    this.innerInstances = [];

    this.data.meshes.forEach((mesh) => {
      if (!ids[mesh.name]) ids[mesh.name] = 100;

      this.innerInstances.push(
        mesh.createInstance(
          "VegetationInstance-" + mesh.name + "-" + ids[mesh.name]++
        )
      );
    });
  }
}
