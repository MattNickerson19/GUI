import * as ROSLIB from "roslib";
import { ros } from "../Connection/RosSingleton";

export type RobotInfo = {
  statusDesc: string;
  fix: any;
  battinfo: any;
  hdspace: any;
};

const TIMEOUT_MS = 5000;

export function getRobotInformation(rate: number = 1): Promise<RobotInfo> {
  return new Promise((resolve, reject) => {
    if (!ros.ros || !ros.isConnected()) {
      return reject(new Error("ROS not connected"));
    }

    const service = new ROSLIB.Service({
      ros: ros.ros,
      name: "/robot_info",
      serviceType: "robot_info_msgs/srv/RobotInfoService",
    });

    const request = { rate };
    let timeout: ReturnType<typeof setTimeout> | null = null;

    timeout = setTimeout(() => {
      reject(new Error("Robot info service timeout"));
      timeout = null;
    }, TIMEOUT_MS);

    service.callService(
      request,
      (result: any) => {
        if (timeout) clearTimeout(timeout);
        if (result?.info) resolve(result.info as RobotInfo);
        else reject(new Error("Service returned null or missing info"));
      },
      (error: any) => {
        if (timeout) clearTimeout(timeout);
        reject(new Error(`Robot info service call failed: ${error}`));
      }
    );
  });
}
