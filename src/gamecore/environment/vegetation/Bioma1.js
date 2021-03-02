import * as BABYLON from "@babylonjs/core";

/** Preload Bioma Assets */
const onPreload = (scene) => {
  scene.assetPreloader.preloadMeshes("assets/nature/test/tree1.babylon");
};

/** Bioma Instantiation Logic */
const instantiate = (options) => {
  let instantiatedMeshes = [];

  options.scene.assetPreloader
    .getMeshes("assets/nature/test/tree1.babylon")
    .forEach((mesh) => {
      //first instance config
      if (mesh.thinInstanceCount == 0) {
        options.scene.smgr.lightManager.addShadowsTo(mesh);
      }

      // generate thinInstance matrix from options

      const transition = options.position;

      const rotation = new BABYLON.Quaternion.RotationAxis(
        new BABYLON.Vector3(0, 1, 0),
        options.rotation
      );

      const scaling = new BABYLON.Vector3(
        options.scale,
        options.scale,
        options.scale
      );

      const matrix = BABYLON.Matrix.Compose(scaling, rotation, transition);

      // instantiate

      let idx = mesh.thinInstanceAdd(matrix);

      instantiatedMeshes.push(idx);

      // meshes are loaded in AssetPreloader and remain disabled until thinInstances are created.
      mesh.setEnabled(true);
    });

  return instantiatedMeshes;
};

/** Thin Instance Removing (Buffer Update) */
const removeInstance = (idx) => {
  console.log(idx);
  console.log(mesh.thinInstanceCount);
  console.log(mesh.thinInstanceGetWorldMatrices());
};

/** Exports */
export default {
  onPreload,
  instantiate,
  removeInstance,
};
