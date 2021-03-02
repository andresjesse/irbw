import * as BABYLON from "@babylonjs/core";

export default class Bioma1 {
  static onPreload(scene) {
    //scene.assetPreloader.preloadMeshes("assets/nature/tree1.babylon");
    scene.assetPreloader.preloadMeshes("assets/nature/test/tree1.babylon");
  }

  static instantiate(scene) {
    let instantiatedMeshes = [];

    scene.assetPreloader
      //.getMeshes("assets/nature/tree1.babylon")
      .getMeshes("assets/nature/test/tree1.babylon")
      .forEach((mesh) => {
        let newInstance = mesh.createInstance("tree1-instance");
        console.log(newInstance);
        instantiatedMeshes.push(newInstance);
      });

    return instantiatedMeshes;
  }
}
