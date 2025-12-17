import * as ROSLIB from "roslib";
import { ros } from "../Connection/RosSingleton";

const TIMEOUT_MS = 5000;

export class ParametersService {

  static getConeHeight(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!ros.ros || !ros.isConnected()) {
        return reject(new Error("ROS not connected"));
      }

      const service = new ROSLIB.Service({
        ros: ros.ros,
        name: "/conical_filter_node/get_parameters",
        serviceType: "rcl_interfaces/srv/GetParameters",
      });

      const request = { names: ["cone_height"] };

      let timeout = setTimeout(() => {
        reject(new Error("Get cone height service timeout"));
      }, TIMEOUT_MS);

      service.callService(
        request,
        (response: any) => {
          if (timeout) clearTimeout(timeout);
          if (response?.values?.length) resolve(response.values[0].double_value);
          else reject(new Error("Parameter not found"));
        },
        (error: any) => {
          if (timeout) clearTimeout(timeout);
          reject(new Error(`Service call failed: ${error}`));
        }
      );
    });
  }

  static setConeHeight(value: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!ros.ros || !ros.isConnected()) {
        return reject(new Error("ROS not connected"));
      }

      const service = new ROSLIB.Service({
        ros: ros.ros,
        name: "/conical_filter_node/set_parameters",
        serviceType: "rcl_interfaces/srv/SetParameters",
      });

      const request = {
        parameters: [
          {
            name: "cone_height",
            value: { type: 3, double_value: value }, // PARAMETER_DOUBLE
          },
        ],
      };

      let timeout = setTimeout(() => {
        reject(new Error("Set cone height service timeout"));
      }, TIMEOUT_MS);

      service.callService(
        request,
        () => {
          if (timeout) clearTimeout(timeout);
          resolve();
        },
        (error: any) => {
          if (timeout) clearTimeout(timeout);
          reject(new Error(`Service call failed: ${error}`));
        }
      );
    });
  }

  static getRCOverride(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!ros.ros || !ros.isConnected()) return reject(new Error("ROS not connected"));

      const service = new ROSLIB.Service({
        ros: ros.ros,
        name: "/motor_controller_interface/get_parameters",
        serviceType: "rcl_interfaces/srv/GetParameters",
      });

      const request = { names: ["override_rc"] };

      let timeout = setTimeout(() => reject(new Error("Get RC Override timeout")), TIMEOUT_MS);

      service.callService(
        request,
        (response: any) => {
          if (timeout) clearTimeout(timeout);
          if (response?.values?.length) resolve(response.values[0].bool_value);
          else reject(new Error("Parameter not found"));
        },
        (error: any) => {
          if (timeout) clearTimeout(timeout);
          reject(new Error(`Service call failed: ${error}`));
        }
      );
    });
  }

  static setRCOverride(value: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!ros.ros || !ros.isConnected()) return reject(new Error("ROS not connected"));

      const service = new ROSLIB.Service({
        ros: ros.ros,
        name: "/motor_controller_interface/set_parameters",
        serviceType: "rcl_interfaces/srv/SetParameters",
      });

      const request = {
        parameters: [
          { name: "override_rc", value: { type: 1, bool_value: value } }, // PARAMETER_BOOL
        ],
      };

      let timeout = setTimeout(() => reject(new Error("Set RC Override timeout")), TIMEOUT_MS);

      service.callService(
        request,
        () => {
          if (timeout) clearTimeout(timeout);
          resolve();
        },
        (error: any) => {
          if (timeout) clearTimeout(timeout);
          reject(new Error(`Service call failed: ${error}`));
        }
      );
    });
  }

  static getOperationWidth(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!ros.ros || !ros.isConnected()) return reject(new Error("ROS not connected"));

      const service = new ROSLIB.Service({
        ros: ros.ros,
        name: "/coverage_server/get_parameters",
        serviceType: "rcl_interfaces/srv/GetParameters",
      });

      const request = { names: ["operation_width"] };

      let timeout = setTimeout(() => reject(new Error("Get operation width timeout")), TIMEOUT_MS);

      service.callService(
        request,
        (response: any) => {
          if (timeout) clearTimeout(timeout);
          if (response?.values?.length) resolve(response.values[0].double_value);
          else reject(new Error("Parameter not found"));
        },
        (error: any) => {
          if (timeout) clearTimeout(timeout);
          reject(new Error(`Service call failed: ${error}`));
        }
      );
    });
  }

  static setOperationWidth(value: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!ros.ros || !ros.isConnected()) return reject(new Error("ROS not connected"));

      const service = new ROSLIB.Service({
        ros: ros.ros,
        name: "/coverage_server/set_parameters",
        serviceType: "rcl_interfaces/srv/SetParameters",
      });

      const request = { parameters: [{ name: "operation_width", value: { type: 3, double_value: value } }] };

      let timeout = setTimeout(() => reject(new Error("Set operation width timeout")), TIMEOUT_MS);

      service.callService(
        request,
        () => {
          if (timeout) clearTimeout(timeout);
          resolve();
        },
        (error: any) => {
          if (timeout) clearTimeout(timeout);
          reject(new Error(`Service call failed: ${error}`));
        }
      );
    });
  }

  static getWaypointTolerance(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!ros.ros || !ros.isConnected()) return reject(new Error("ROS not connected"));

      const service = new ROSLIB.Service({
        ros: ros.ros,
        name: "/controller_server/get_parameters",
        serviceType: "rcl_interfaces/srv/GetParameters",
      });

      const request = { names: ["general_goal_checker.xy_goal_tolerance"] };

      let timeout = setTimeout(() => reject(new Error("Get waypoint tolerance timeout")), TIMEOUT_MS);

      service.callService(
        request,
        (response: any) => {
          if (timeout) clearTimeout(timeout);
          if (response?.values?.length) resolve(response.values[0].double_value);
          else reject(new Error("Parameter not found"));
        },
        (error: any) => {
          if (timeout) clearTimeout(timeout);
          reject(new Error(`Service call failed: ${error}`));
        }
      );
    });
  }

  static setWaypointTolerance(value: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!ros.ros || !ros.isConnected()) return reject(new Error("ROS not connected"));

      const service = new ROSLIB.Service({
        ros: ros.ros,
        name: "/controller_server/set_parameters",
        serviceType: "rcl_interfaces/srv/SetParameters",
      });

      const request = {
        parameters: [{ name: "general_goal_checker.xy_goal_tolerance", value: { type: 3, double_value: value } }],
      };

      let timeout = setTimeout(() => reject(new Error("Set waypoint tolerance timeout")), TIMEOUT_MS);

      service.callService(
        request,
        () => {
          if (timeout) clearTimeout(timeout);
          resolve();
        },
        (error: any) => {
          if (timeout) clearTimeout(timeout);
          reject(new Error(`Service call failed: ${error}`));
        }
      );
    });
  }

  static listGestures(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!ros.ros || !ros.isConnected()) return reject(new Error("ROS not connected"));

      const service = new ROSLIB.Service({
        ros: ros.ros,
        name: "/arm_mover/list_gestures",
        serviceType: "arm_msgs/GestureList",
      });

      let timeout = setTimeout(() => reject(new Error("List gestures service timeout")), TIMEOUT_MS);

      service.callService(
        {},
        (response: any) => {
          if (timeout) clearTimeout(timeout);
          resolve(response.gestures ?? []);
        },
        (error: any) => {
          if (timeout) clearTimeout(timeout);
          reject(new Error(`Service call failed: ${error}`));
        }
      );
    });
  }
}
