export default class AssetPreloader {
  constructor(scene) {
    this.scene = scene;

    this.containers = {};
    this.meshes = {};
    this.textures = {};
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
        // containers are loaded and stored for future use (not immediately attached to scene)
        this.containers[cFile] = task.loadedContainer;
      };
    }
  }

  preloadMeshes(mFile) {
    if (!this.textures[mFile]) {
      // reserve slot to prevent duplicated tasks (results are async)
      this.textures[mFile] = "loading...";

      let meshFilename = mFile.split("/").pop();
      let rootUrl = mFile.substring(0, mFile.length - meshFilename.length);

      this.scene.assetsManager.addMeshTask(
        mFile,
        "",
        rootUrl,
        meshFilename
      ).onSuccess = (task) => {
        // original meshes are disabled. new Instances will be enabled and visible.
        task.loadedMeshes.forEach((lm) => lm.setEnabled(false));
        this.meshes[mFile] = task.loadedMeshes;
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
        // texture is stored for future use
        this.textures[txFile] = task.texture;
      };
    }
  }

  getContainer(cFile) {
    if (!this.containers[cFile])
      throw new Error("Container not Preloaded: " + cFile);

    return this.containers[cFile];
  }

  getMeshes(mFile) {
    if (!this.meshes[mFile]) throw new Error("Meshes not Preloaded: " + mFile);

    return this.meshes[mFile];
  }

  getTexture(txFile) {
    if (!this.textures[txFile])
      throw new Error("Texture not Preloaded: " + txFile);

    return this.textures[txFile];
  }
}
