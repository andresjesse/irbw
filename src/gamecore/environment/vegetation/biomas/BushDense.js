import VegetationInstance from "../VegetationInstance";

export default class BushDense {
  static onPreload(scene) {
    scene.assetPreloader.preloadMeshes("assets/nature/BushDense.babylon");
  }

  static instantiate(scene) {
    let vegetationInstances = [];

    let i1 = {
      meshes: scene.assetPreloader.getMeshes("assets/nature/BushDense.babylon"),
      scene: scene,
      castShadows: true,
    };

    vegetationInstances.push(new VegetationInstance(i1, true));

    return vegetationInstances;
  }
}
