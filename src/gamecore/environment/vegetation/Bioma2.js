import VegetationInstance from "./VegetationInstance";

export default class Bioma2 {
  static onPreload(scene) {
    scene.assetPreloader.preloadMeshes("assets/nature/bush1.babylon");
  }

  static instantiate(scene) {
    let vegetationInstances = [];

    let i1 = {
      meshes: scene.assetPreloader.getMeshes("assets/nature/bush1.babylon"),
      scene: scene,
      castShadows: false,
    };

    vegetationInstances.push(new VegetationInstance(i1, true));

    return vegetationInstances;
  }
}
