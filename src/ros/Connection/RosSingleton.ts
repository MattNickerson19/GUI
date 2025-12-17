// RosSingleton.ts
import { RosConnect, type RosStatus } from "./RosConnect";
import { loadConfig } from "../../config/ConfigStore";

export type { RosStatus }; 

let status: RosStatus = "Not Connected";

const config = loadConfig();
const rosUrl = `ws://${config.rosNodeIp}:${config.rosNodePort}`;

export const ros = new RosConnect(rosUrl, 5000, (newStatus) => {
  status = newStatus;
  console.log("ROS Status:", status);
});

ros.connect();

export const getRosStatus = () => status;
