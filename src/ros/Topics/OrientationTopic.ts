import * as ROSLIB from "roslib";
import type { Ros } from "roslib";

export type OrientationMsg = {
  x: number;
  y: number;
  z: number;
};

export class OrientationTopic {
  private topic: ROSLIB.Topic<OrientationMsg>;

  constructor(ros: Ros) {
    if (!ros) throw new Error("OrientationTopic: ros instance is null");

    this.topic = new ROSLIB.Topic<OrientationMsg>({
      ros,
      name: "/orientation",
      messageType: "geometry_msgs/msg/Vector3",
    });
  }

  subscribe(callback: (msg: OrientationMsg) => void) {
    this.topic.subscribe(callback);
  }

  unsubscribe() {
    this.topic.unsubscribe();
  }
}

