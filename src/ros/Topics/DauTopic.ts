import * as ROSLIB from "roslib";
import type { Ros } from "roslib";

export type DauStampedMsg = {
  header: {
    stamp: {
      sec: number;
      nanosec: number;
    };
    frame_id: string;
  };
  temperature: number;
  humidity: number;
  pressure: number;
  light: number;
  noise: number;
  eco2: number;
  etvoc: number;
  pga: number;
  si: number;
  sivalue: number;
};

export class DauTopic {
  private topic: ROSLIB.Topic<DauStampedMsg>;

  constructor(ros: Ros) {
    if (!ros) throw new Error("DauTopic: ros instance is null");

    this.topic = new ROSLIB.Topic<DauStampedMsg>({
      ros,
      name: "/dau/data",
      messageType: "dau_msgs/msg/DauStamped",
    });
  }

  subscribe(callback: (msg: DauStampedMsg) => void) {
    this.topic.subscribe(callback);
  }

  unsubscribe() {
    this.topic.unsubscribe();
  }
}

