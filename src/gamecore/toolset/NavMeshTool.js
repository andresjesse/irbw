import * as BABYLON from "@babylonjs/core";
import eventBus from "~/src/gamecore/EventBus";

export default class NavMeshTool {
  constructor(smgr) {
    this.smgr = smgr;

    this.navigationPlugin = new BABYLON.RecastJSPlugin();

    //TESTES DE PARAMETROS:

    //interessante! bem lowpoly
    // var parameters = {
    //   cs: 1,
    //   ch: 0.5,
    //   walkableSlopeAngle: 35,
    //   walkableHeight: 1,
    //   walkableClimb: 1,
    //   walkableRadius: 1,
    //   maxEdgeLen: 12,
    //   maxSimplificationError: 1,
    //   minRegionArea: 8,
    //   mergeRegionArea: 20,
    //   maxVertsPerPoly: 6,
    //   detailSampleDist: 6,
    //   detailSampleMaxError: 1,
    // };

    // +-, gera com mais detalhes, mas tem interrupcoes
    // var parameters = {
    //   cs: 0.2,
    //   ch: 0.2,
    //   walkableSlopeAngle: 0,
    //   walkableHeight: 0.0,
    //   walkableClimb: 0,
    //   walkableRadius: 1,
    //   maxEdgeLen: 12,
    //   maxSimplificationError: 1.3,
    //   minRegionArea: 8,
    //   mergeRegionArea: 20,
    //   maxVertsPerPoly: 6,
    //   detailSampleDist: 6,
    //   detailSampleMaxError: 15,
    //   borderSize: 1,
    //   tileSize: 20,
    // };

    // bem legal!! detalhado demais
    // let parameters = {
    //   cs: 0.2,
    //   ch: 0.05,
    //   walkableSlopeAngle: 5,
    //   walkableHeight: 10.0,
    //   walkableClimb: 3,
    //   walkableRadius: 2,
    //   maxEdgeLen: 12,
    //   maxSimplificationError: 0.6,
    //   minRegionArea: 50,
    //   mergeRegionArea: 20,
    //   maxVertsPerPoly: 6,
    //   detailSampleDist: 6,
    //   detailSampleMaxError: 1,
    // };

    this.parameters = {
      cs: 0.2,
      ch: 0.05,
      walkableSlopeAngle: 5,
      walkableHeight: 10.0,
      walkableClimb: 3,
      walkableRadius: 2,
      maxEdgeLen: 12,
      maxSimplificationError: 4, //simplificacao
      minRegionArea: 50,
      mergeRegionArea: 20,
      maxVertsPerPoly: 6,
      detailSampleDist: 6,
      detailSampleMaxError: 0.2, //diminui furos 0,5
    };

    eventBus.on("updateNavMesh", () => this.updateNavMesh());
  }

  updateNavMesh() {
    this.navigationPlugin.createNavMesh(
      [this.smgr.terrain.segments["0_0"].ground], //TODO: get ALL!!
      this.parameters
    );

    let navmeshdebug = this.navigationPlugin.createDebugNavMesh(
      this.smgr.scene
    );
    var matdebug = new BABYLON.StandardMaterial("matdebug", this.smgr.scene);
    matdebug.diffuseColor = new BABYLON.Color3(0.1, 0.2, 1);
    matdebug.alpha = 0.2;
    navmeshdebug.material = matdebug;
    navmeshdebug.position.y += 0.1;
  }
}
