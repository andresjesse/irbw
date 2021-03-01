import Bioma1 from "./Bioma1";

const biomas = {
  Bioma1,
};

export default class BiomaFactory {
  constructor(scene) {
    this.scene = scene;

    for (let k in biomas) {
      biomas[k].onPreload(scene);
    }
  }

  instantiate(bioma) {
    return biomas[bioma].instantiate(this.scene);
  }

  static asList() {
    return Object.keys(biomas);
  }
}
