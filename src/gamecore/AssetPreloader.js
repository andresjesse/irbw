export default class AssetPreloader {
  constructor(scene) {
    this.scene = scene;

    this.textures = {};
    this.containers = {};
  }

  preloadContainer(cFile) {
    if (!this.containers[cFile]) {
      // reserve slot to prevent duplicated tasks (results are async)
      this.containers[cFile] = "loading...";

      let sceneFilename = cFile.split("/").pop();
      let rootUrl = cFile.substring(0, cFile.length - sceneFilename.length);

      this.scene.assetsManager.addContainerTask(
        cFile,
        "",
        rootUrl,
        sceneFilename
      ).onSuccess = (task) => {
        this.containers[cFile] = task.loadedContainer;
      };
    }
  }

  preloadTexture(txFile) {
    if (!this.textures[txFile]) {
      // reserve slot to prevent duplicated tasks (results are async)
      this.textures[txFile] = "loading...";

      this.scene.assetsManager.addTextureTask(txFile, txFile).onSuccess = (
        task
      ) => {
        this.textures[txFile] = task.texture;
      };
    }
  }

  getContainer(cFile) {
    if (!this.containers[cFile])
      throw new Error("Container not Preloaded: " + cFile);

    return this.containers[cFile];
  }

  getTexture(txFile) {
    if (!this.textures[txFile])
      throw new Error("Texture not Preloaded: " + txFile);

    return this.textures[txFile];
  }
}
