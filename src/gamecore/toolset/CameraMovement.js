import { LogicalInputs } from "../UniversalInputManager";

export default class CameraMovement {
  constructor(smgr) {
    this.smgr = smgr;

    this.cameraSpeed = 1;
  }

  onUpdate() {
    this.smgr.camera.position.x +=
      this.smgr.imgr.getInput(LogicalInputs.MainAxisX) * this.cameraSpeed;

    this.smgr.camera.position.z +=
      this.smgr.imgr.getInput(LogicalInputs.MainAxisY) * this.cameraSpeed;
  }
}
