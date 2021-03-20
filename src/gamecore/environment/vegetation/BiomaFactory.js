import BushDense from "./biomas/BushDense";
import GrassHigh from "./biomas/GrassHigh";
import Tree1 from "./biomas/Tree1";
import Tree2 from "./biomas/Tree2";

const biomas = {
  BushDense,
  GrassHigh,
  Tree1,
  Tree2,
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
