import * as BABYLON from "@babylonjs/core";

let seqIds = {};

/** Thin Instances Adding Logic */
const add = (meshes, options) => {
  let liveInstances = [];

  meshes.forEach((mesh) => {
    //first instance config
    if (mesh.thinInstancesInitialized != true) {
      options.scene.smgr.lightManager.addShadowsTo(mesh);
      mesh.thinInstanceRegisterAttribute("id", 1);
      seqIds[mesh] = 100; //Float32Array buffers are initialized with zeros, so init liveInstances ids with a higher value

      mesh.thinInstancesInitialized = true;
    }

    // generate thinInstance matrix from options
    const translation = options.position;

    const rotation = new BABYLON.Quaternion.RotationAxis(
      new BABYLON.Vector3(0, 1, 0),
      options.rotation
    );

    const scaling = new BABYLON.Vector3(
      options.scale,
      options.scale,
      options.scale
    );

    const matrix = BABYLON.Matrix.Compose(scaling, rotation, translation);

    // instantiate
    let idx = mesh.thinInstanceAdd(matrix);
    let newId = seqIds[mesh]++;
    mesh.thinInstanceSetAttributeAt("id", idx, [newId]);

    liveInstances.push({ mesh, id: newId });

    // meshes are loaded in AssetPreloader and remain disabled until thinInstances are created.
    mesh.setEnabled(true);
  });

  return liveInstances;
};

/** Thin Instance Removal Logic (Manual Buffer Update) */
const remove = (meshes, options) => {
  // iterate meshes
  meshes.forEach((mesh) => {
    let filteredMatrices = [];
    let filteredIds = [];

    mesh._userThinInstanceBuffersStorage.data["id"].forEach((id, index) => {
      options.liveInstances.forEach((liveInstance) => {
        if (mesh == liveInstance.mesh && id == liveInstance.id) {
          filteredIds.push(id);
          filteredMatrices.push(mesh.thinInstanceGetWorldMatrices()[index]);
        }
      });
    });

    console.log(filteredIds);

    //Filter instances out of "delete"
    // mesh.thinInstanceGetWorldMatrices().filter((mat) => {
    //   console.log(options);
    //   // let dist = BABYLON.Vector3.Distance(
    //   //   mat.getTranslation(),
    //   //   options.pickedPoint
    //   // );

    //   // if (dist > options.brushSize) return mat;
    // });

    // generate a new Float32Array buffer
    let newBuffer = new Float32Array(16 * filteredMatrices.length);
    let newIdBuffer = Float32Array.of(filteredIds);
    filteredMatrices.forEach((m, index) =>
      m.copyToArray(newBuffer, index * 16)
    );

    if (newBuffer.length > 0) {
      // replace thinInstances buffer
      mesh.thinInstanceSetBuffer("matrix", newBuffer, 16);
      mesh.thinInstanceSetBuffer("id", newIdBuffer, 1);
    } else {
      // disable original mesh when no instances are drawn
      mesh.thinInstanceCount = 0;
      mesh.setEnabled(false);
    }
  });

  // // iterate meshes
  // meshes.forEach((mesh) => {

  //   //Filter instances out of "delete"
  //   let filteredInstances = mesh
  //     .thinInstanceGetWorldMatrices()
  //     .filter((mat) => {
  //       console.log(options);
  //       // let dist = BABYLON.Vector3.Distance(
  //       //   mat.getTranslation(),
  //       //   options.pickedPoint
  //       // );

  //       // if (dist > options.brushSize) return mat;
  //     });

  //   // generate a new Float32Array buffer
  //   let newBuffer = new Float32Array(16 * filteredInstances.length);
  //   filteredInstances.forEach((m, index) =>
  //     m.copyToArray(newBuffer, index * 16)
  //   );

  //   if (newBuffer.length > 0) {
  //     // replace thinInstances buffer
  //     mesh.thinInstanceSetBuffer("matrix", newBuffer, 16);
  //   } else {
  //     // disable original mesh when no instances are drawn
  //     mesh.thinInstanceCount = 0;
  //     mesh.setEnabled(false);
  //   }
  // });
};

/** Exports */
export default {
  add,
  remove,
};
