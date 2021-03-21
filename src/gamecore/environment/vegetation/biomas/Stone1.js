import VegetationInstance from "../VegetationInstance";

export default class Stone1 {
  static onPreload(scene) {
    scene.assetPreloader.preloadMeshes("assets/nature/Stone1.babylon");
  }

  static instantiate(scene) {
    let vegetationInstances = [];

    let i1 = {
      meshes: scene.assetPreloader.getMeshes("assets/nature/Stone1.babylon"),
      scene: scene,
      castShadows: true,
    };

    vegetationInstances.push(new VegetationInstance(i1, true));

    return vegetationInstances;
  }
}
