import VegetationInstance from "../VegetationInstance";

export default class GrassHigh {
  static onPreload(scene) {
    scene.assetPreloader.preloadMeshes("assets/nature/GrassHigh.babylon");
  }

  static instantiate(scene) {
    let vegetationInstances = [];

    let i1 = {
      meshes: scene.assetPreloader.getMeshes("assets/nature/GrassHigh.babylon"),
      scene: scene,
      castShadows: false,
    };

    vegetationInstances.push(new VegetationInstance(i1, true));

    return vegetationInstances;
  }
}
