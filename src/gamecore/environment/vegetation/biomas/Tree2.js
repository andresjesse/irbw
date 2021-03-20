import VegetationInstance from "../VegetationInstance";

export default class Tree2 {
  static onPreload(scene) {
    scene.assetPreloader.preloadMeshes("assets/nature/Tree2.babylon");
  }

  static instantiate(scene) {
    let vegetationInstances = [];

    let tree1Data = {
      meshes: scene.assetPreloader.getMeshes("assets/nature/Tree2.babylon"),
      scene: scene,
      castShadows: true,
    };

    vegetationInstances.push(new VegetationInstance(tree1Data, false));

    return vegetationInstances;
  }
}
