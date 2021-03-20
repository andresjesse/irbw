import { LogicalInputs } from "../UniversalInputManager";

export default class CameraMovement {
  constructor(smgr) {
    this.smgr = smgr;

    this.cameraSpeed = 1;
  }

  onUpdate() {
    // calculate zoom factor to reduce movement speed on lower zoom, and increate on higher
    let zoomSpeedFactor = Math.min(
      (this.smgr.camera.position.y * 1.2) / this.smgr.CAMERA_MAX_ZOOM,
      1
    );

    // X movement
    this.smgr.camera.position.x +=
      this.smgr.imgr.getInput(LogicalInputs.MainAxisX) *
      this.cameraSpeed *
      zoomSpeedFactor;

    // Z movement
    this.smgr.camera.position.z +=
      this.smgr.imgr.getInput(LogicalInputs.MainAxisY) *
      this.cameraSpeed *
      zoomSpeedFactor;

    // Zoom
    let newY =
      this.smgr.camera.position.y +
      this.smgr.imgr.getInput(LogicalInputs.MainTrigger) *
        this.cameraSpeed *
        0.5;

    // Guarantee new zoom will be in acceptable range
    if (
      newY >= this.smgr.CAMERA_MIN_ZOOM &&
      newY <= this.smgr.CAMERA_MAX_ZOOM
    ) {
      this.smgr.camera.position.y = newY;

      // fix Z for smooth zoom
      this.smgr.camera.position.z +=
        this.smgr.imgr.getInput(LogicalInputs.MainTrigger) *
        -0.5 *
        this.cameraSpeed;
    }
  }
}
