import * as ROSLIB from "roslib";
import type { Ros } from "roslib";
import type { WaypointMsg } from "./WaypointMsg";

export type WaypointStatusMsg = {
  status: number;      

  goal_coord: WaypointMsg;
  home_coord: WaypointMsg;

  goal_number: number; 
};

export class WaypointStatusTopic {
  private topic: ROSLIB.Topic<WaypointStatusMsg>;

  constructor(ros: Ros) {
    if (!ros) throw new Error("WaypointStatusTopic: ros instance is null");

    this.topic = new ROSLIB.Topic<WaypointStatusMsg>({
      ros,
      name: "/waypoint_status",
      messageType: "input_msgs/msg/WaypointStatus",
    });
  }

  subscribe(callback: (msg: WaypointStatusMsg) => void) {
    this.topic.subscribe(callback);
  }

  unsubscribe() {
    this.topic.unsubscribe();
  }
}
