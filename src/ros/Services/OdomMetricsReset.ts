import * as ROSLIB from "roslib";

interface EmptyRequest {}

interface EmptyResponse {}

export class OdomMetricsReset {
  private service: ROSLIB.Service<EmptyRequest, EmptyResponse>;

  constructor(ros: ROSLIB.Ros) {
    this.service = new ROSLIB.Service({
      ros,
      name: "/odom_metrics/reset",
      serviceType: "std_srvs/srv/Empty",
    });
  }

  call(): Promise<void> {
    const request: EmptyRequest = {};

    return new Promise((resolve, reject) => {
      this.service.callService(
        request,
        (_result: EmptyResponse) => {
          resolve(); 
        },
        (error: any) => reject(error)
      );
    });
  }
}
