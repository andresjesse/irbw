export default class Bioma1 {
  static onPreload(scene) {
    scene.assetPreloader.preloadMeshes("assets/nature/tree1.babylon");
  }

  static instantiate(scene) {
    let instantiatedMeshes = [];

    scene.assetPreloader
      .getMeshes("assets/nature/tree1.babylon")
      .forEach((mesh) => {
        instantiatedMeshes.push(mesh.createInstance("tree1-instance"));
      });

    return instantiatedMeshes;
  }
}
