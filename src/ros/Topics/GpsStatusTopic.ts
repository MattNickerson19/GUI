import * as ROSLIB from "roslib";
import type { Ros } from "roslib";

export type GPSStatusMsg = {
  fix_type: string;
};

export class GpsStatusTopic {
  private topic: ROSLIB.Topic<GPSStatusMsg>;

  constructor(ros: Ros) {
    if (!ros) throw new Error("GpsStatusTopic: ros instance is null");

    this.topic = new ROSLIB.Topic<GPSStatusMsg>({
      ros,
      name: "/gps/status",
      messageType: "inertial_sense_ros_msgs/msg/GPSStatus",
    });
  }

  subscribe(callback: (msg: GPSStatusMsg) => void) {
    this.topic.subscribe(callback);
  }

  unsubscribe() {
    this.topic.unsubscribe();
  }
}

