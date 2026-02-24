import * as ROSLIB from "roslib";
import type { Ros } from "roslib";

export type ControllerPollMsg = {
  x_normalized: number;
  y_normalized: number;
  z_normalized: number;
  pitch_normalized: number;
  roll_normalized: number;
  yaw_normalized: number;
};

export type GripperCommandMsg = {
  data: number;
};

export type EmptyMsg = {};

export class UfactoryArmTopic {
  private controllerPollTopic: ROSLIB.Topic<ControllerPollMsg>;
  private gripperCommandTopic: ROSLIB.Topic<GripperCommandMsg>;
  private enableArmTopic: ROSLIB.Topic<EmptyMsg>;

  constructor(ros: Ros) {
    if (!ros) throw new Error("UfactorArmTopic: ros instance is null");

    this.controllerPollTopic = new ROSLIB.Topic<ControllerPollMsg>({
      ros,
      name: "/controller_poll",
      messageType: "arm_msgs/msg/ControllerPoll",
    });

    this.gripperCommandTopic = new ROSLIB.Topic<GripperCommandMsg>({
      ros,
      name: "/gripper_command",
      messageType: "std_msgs/msg/Float64",
    });

    this.enableArmTopic = new ROSLIB.Topic<EmptyMsg>({
      ros,
      name: "/enable_arm",
      messageType: "std_msgs/msg/Empty",
    });
  }

  // Publish methods
  publishControllerPoll(msg: ControllerPollMsg) {
    this.controllerPollTopic.publish(msg);
  }

  publishGripperCommand(value: number) {
    this.gripperCommandTopic.publish({ data: value });
  }

  publishEnableArm() {
    this.enableArmTopic.publish({});
  }

  // Optional: subscribe to controllerPoll if needed
  subscribeControllerPoll(callback: (msg: ControllerPollMsg) => void) {
    this.controllerPollTopic.subscribe(callback);
  }

  unsubscribeControllerPoll() {
    this.controllerPollTopic.unsubscribe();
  }
}
