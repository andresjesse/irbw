import * as BABYLON from "@babylonjs/core";

import EmptySegment from "./EmptySegment";
import TerrainSegment, { TerrainSegmentConfig } from "./TerrainSegment";

export default class Terrain {
  constructor(scene) {
    this.scene = scene;

    //----- create children -----
    this.segments = {
      "0_0": new TerrainSegment(this.scene, "0_0"),
    };

    this.emptySegments = {};

    this.generateEmptySegments(false);
  }

  onStart() {
    //----- start children -----
    Object.keys(this.segments).forEach((k) => this.segments[k].onStart());
    Object.keys(this.emptySegments).forEach((k) =>
      this.emptySegments[k].onStart()
    );

    //----- start self -----
  }

  checkForSegmentChange(options) {
    let pickinfo = this.scene.pick(options.x, options.y, (mesh) => {
      return (
        mesh.id.startsWith("empty_segment_") ||
        mesh.id.startsWith("terrain_segment_")
      );
    });

    if (pickinfo.hit) {
      // calculate picked id
      let tk = pickinfo.pickedMesh.id.split("_");
      let hitId = tk[2] + "_" + tk[3];

      // generate (or remove) a segment
      if (!this.segments[hitId]) {
        console.log("creating valid seg ");
        this.segments[hitId] = new TerrainSegment(this.scene, hitId);
        this.segments[hitId].onStart();

        // merge borders
        this.segments[hitId].mergeToSegment(
          this.segments[parseInt(tk[2]) - 1 + "_" + tk[3]]
        );
        this.segments[hitId].mergeToSegment(
          this.segments[parseInt(tk[2]) + 1 + "_" + tk[3]]
        );
        this.segments[hitId].mergeToSegment(
          this.segments[tk[2] + "_" + (parseInt(tk[3]) - 1)]
        );
        this.segments[hitId].mergeToSegment(
          this.segments[tk[2] + "_" + (parseInt(tk[3]) + 1)]
        );
      } else {
        console.log(
          "TODO: Remove segment (cascade to water, vegetation, entities, etc..)."
        );
      }

      // TODO: trigger para junta das bordas

      this.generateEmptySegments(true);
    }
  }

  generateEmptySegments(sceneStarted) {
    // helper functions (for semantic)
    const isNotSegment = (id) => !(id in this.segments);
    const isNotEmptySegment = (id) => !(id in this.emptySegments);

    //remove all empty segments (if exists)
    for (const key in this.emptySegments) {
      this.emptySegments[key].dispose();
    }

    this.emptySegments = {};

    //generate new empty segments where needed
    for (const key in this.segments) {
      let seg = this.segments[key];

      let intPos = seg.id.split("_").map((v) => parseInt(v));

      for (let i = intPos[0] - 1; i <= intPos[0] + 1; i++) {
        for (let j = intPos[1] - 1; j <= intPos[1] + 1; j++) {
          let id = i + "_" + j;

          if (isNotSegment(id) && isNotEmptySegment(id)) {
            this.emptySegments[id] = new EmptySegment(this.scene, id);

            //trigger onStart when scene is already running (on the fly segment creation)
            if (sceneStarted) this.emptySegments[id].onStart();
          }
        }
      }
    }
  }

  paintVegetation(options) {
    var pickinfo = this.scene.pick(options.x, options.y, (mesh) =>
      mesh.id.startsWith("terrain_segment_")
    );

    if (pickinfo.hit) {
      //TODO: check distance to Segments (too far does not need to be trasformed, e.g. > 64 <<test>>?? )

      for (const key in this.segments) {
        this.segments[key].paintVegetation({
          pickedPoint: pickinfo.pickedPoint,
          ...options,
        });
      }
    }
  }

  transform(options) {
    var pickinfo = this.scene.pick(options.x, options.y, (mesh) =>
      mesh.id.startsWith("terrain_segment_")
    );

    if (pickinfo.hit) {
      let transformOptions = {
        pickedPoint: pickinfo.pickedPoint,
        brushSize: options.brushSize,
        brushStrength: options.brushStrength,
        factor: options.factor,
        soften: options.soften,
      };

      if (options.soften) {
        transformOptions["heightAvg"] = this.calculateAverageHeightInBrushRange(
          transformOptions
        );
      }

      for (const key in this.segments) {
        let seg = this.segments[key];

        //skip segments too far
        if (
          BABYLON.Vector3.Distance(
            seg.ground.position,
            transformOptions.pickedPoint
          ) >
          TerrainSegmentConfig.MESH_SIZE * 2
        )
          continue;

        seg.transform(transformOptions);
      }
    }
  }

  calculateAverageHeightInBrushRange(options) {
    let avg = 0;
    let vCount = 0;

    for (const key in this.segments) {
      let seg = this.segments[key];

      //skip segments too far
      if (
        BABYLON.Vector3.Distance(seg.ground.position, options.pickedPoint) >
        TerrainSegmentConfig.MESH_SIZE * 2
      )
        continue;

      let positions = seg.ground.getVerticesData(
        BABYLON.VertexBuffer.PositionKind
      );

      var numberOfVertices = positions.length / 3;

      for (let j = 0; j < numberOfVertices; j++) {
        let vDist = BABYLON.Vector3.Distance(
          new BABYLON.Vector3(
            positions[j * 3] + seg.ground.position.x,
            positions[j * 3 + 1] + seg.ground.position.y,
            positions[j * 3 + 2] + seg.ground.position.z
          ),
          options.pickedPoint
        );

        if (vDist <= options.brushSize) {
          avg += positions[j * 3 + 1] + seg.ground.position.y;
          vCount += 1;
        }
      }
    }

    return avg / vCount;
  }

  // this method collects all terrain-related user data for api project save
  collectUserData() {
    let userData = {
      segments: {},
    };

    Object.keys(this.segments).forEach((k) => {
      userData.segments[k] = k;
    });

    return userData;
  }
}
