import * as ROSLIB from "roslib";
import type { Ros } from "roslib";

export type PanTiltMsg = {
  pan: string;
  tilt: string;
};

export type ZoomMsg = {
  data: string;
};

export class AxisTopics {
  private panTiltTopic: ROSLIB.Topic<PanTiltMsg>;
  private zoomTopic: ROSLIB.Topic<ZoomMsg>;
  private cameraHost: string;
  private username: string;
  private password: string;

  constructor(ros: Ros, cameraHost: string, username: string, password: string) {
    this.cameraHost = cameraHost;
    this.username = username;
    this.password = password;

    this.panTiltTopic = new ROSLIB.Topic<PanTiltMsg>({
      ros,
      name: "/pan_tilt",
      messageType: "axis_camera_msgs/msg/PanTilt",
    });

    this.zoomTopic = new ROSLIB.Topic<ZoomMsg>({
      ros,
      name: "/zoom",
      messageType: "std_msgs/msg/String",
    });
  }

  publishPanTilt(pan: string, tilt: string) {
    this.panTiltTopic.publish({ pan, tilt });
  }

  publishZoom(level: number) {
    this.zoomTopic.publish({ data: String(level) });
  }

  goHomePreset() {
    const url = `${this.cameraHost}/axis-cgi/com/ptz.cgi?gotoserverpresetno=1&camera=1`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true, this.username, this.password); // digest auth
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => console.log('Home preset response:', xhr.responseText);

    xhr.send();
  }
}

