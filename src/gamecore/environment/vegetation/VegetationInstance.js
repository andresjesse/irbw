let ids = {};

export default class VegetationInstance {
  constructor(data, isThin) {
    this.isThin = isThin;
    this.data = data;

    if (isThin) {
    } else {
      this._instancedMeshCreate();
    }
  }

  dispose() {
    this.isThin ? {} : this._instancedMeshDispose();
  }

  enableShadows() {
    this.isThin ? {} : this._instancedMeshEnableShadows();
  }

  setPosition(pos) {
    this.isThin ? {} : this._instancedMeshSetPosition(pos);
  }

  setRotation(rot) {
    this.isThin ? {} : this._instancedMeshSetRotation(rot);
  }

  setScale(scl) {
    this.isThin ? {} : this._instancedMeshSetScale(scl);
  }

  // ------------------------------------------------------------ InstancedMesh Stuff

  _instancedMeshCreate() {
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
      innerInstance.position.x = innerInstance.position.x + pos.x;
      innerInstance.position.y = innerInstance.position.y + pos.y;
      innerInstance.position.z = innerInstance.position.z + pos.z;
    });
  }

  _instancedMeshSetRotation(rot) {
    this.innerInstances.forEach((innerInstance) => {
      innerInstance.rotation.x = innerInstance.rotation.x + rot.x;
      innerInstance.rotation.y = innerInstance.rotation.y + rot.y;
      innerInstance.rotation.z = innerInstance.rotation.z + rot.z;
    });
  }

  _instancedMeshSetScale(scl) {
    this.innerInstances.forEach((innerInstance) => {
      innerInstance.scaling.x = innerInstance.scaling.x * scl.x;
      innerInstance.scaling.y = innerInstance.scaling.y * scl.y;
      innerInstance.scaling.z = innerInstance.scaling.z * scl.z;
    });
  }
}
