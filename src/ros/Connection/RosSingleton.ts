import { RosConnect, type RosStatus } from "./RosConnect";

export type { RosStatus }; 

let status: RosStatus = "Not Connected";

export const ros = new RosConnect("ws://192.168.10.89:9090", 5000, (newStatus) => {
  status = newStatus;
  console.log("ROS Status:", status);
});

ros.connect();

export const getRosStatus = () => status;