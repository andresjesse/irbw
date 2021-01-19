import * as BABYLON from "@babylonjs/core";

const createFromTextures = (scene, textures) => {
  let data = [];

  textures.forEach((tx) => {
    let pixels = tx.readPixels();

    data = [...data, ...pixels];
  });

  return new BABYLON.RawTexture2DArray(
    new Uint8Array(data),
    textures[0].getSize().width, //width
    textures[0].getSize().height, //height
    textures.length, //layers
    BABYLON.Engine.TEXTUREFORMAT_RGBA,
    scene,
    true, //mipmaps
    false, //inverty
    BABYLON.Texture.NEAREST_LINEAR_MIPLINEAR
  );
};

export default { createFromTextures };
