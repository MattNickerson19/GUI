import * as ROSLIB from "roslib";
import type { Ros } from "roslib";

export type ForwardDistanceMsg = {
  data: number;
};

export class OdomMetricsTopic {
  private topic: ROSLIB.Topic<ForwardDistanceMsg>;

  constructor(ros: Ros) {
    if (!ros) throw new Error("OdomMetricsTopic: ros instance is null");

    this.topic = new ROSLIB.Topic<ForwardDistanceMsg>({
      ros,
      name: "/odom_metrics/forward_distance",
      messageType: "std_msgs/msg/Float64",
    });
  }

  subscribe(callback: (msg: ForwardDistanceMsg) => void) {
    this.topic.subscribe(callback);
  }

  unsubscribe() {
    this.topic.unsubscribe();
  }
}
