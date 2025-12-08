import * as ROSLIB from "roslib";

interface LightbarSwitchRequest {
  enable: number;
}

interface LightbarSwitchResponse {
  status: number;
}

export class LightbarService {
  private service: ROSLIB.Service<LightbarSwitchRequest, LightbarSwitchResponse>;

  constructor(ros: ROSLIB.Ros) {
    this.service = new ROSLIB.Service({
      ros,
      name: "/switch_lightbar",
      serviceType: "lightbar_msgs/srv/LightBarSwitch",
    });
  }

  //enable=1 to turn on, 0 to turn off
  call(enable: number): Promise<number> {
    const request: LightbarSwitchRequest = { enable };

    return new Promise((resolve, reject) => {
      this.service.callService(
        request,
        (result: LightbarSwitchResponse) => {
          if (result && typeof result.status === "number") {
            resolve(result.status);
          } else {
            reject(new Error("Invalid response from light bar service"));
          }
        },
        (error: any) => reject(error)
      );
    });
  }
}