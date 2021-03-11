import VegetationInstance from "./VegetationInstance";

export default class Bioma1 {
  static onPreload(scene) {
    scene.assetPreloader.preloadMeshes("assets/nature/tree1.babylon");
  }

  static instantiate(scene) {
    let vegetationInstances = [];

    let tree1Data = {
      meshes: scene.assetPreloader.getMeshes("assets/nature/tree1.babylon"),
      scene: scene,
      castShadows: true,
    };

    vegetationInstances.push(new VegetationInstance(tree1Data, false));

    return vegetationInstances;
  }
}
