import * as ROSLIB from "roslib";
import { getRobotInformation, type RobotInfo } from "../Services/RobotInfoService";

export type RosStatus = "Connected" | "Connection Failed" | "Not Connected" | "Connecting...";

export class RosConnect {
  ros: ROSLIB.Ros | null = null;
  url: string;
  reconnectInterval: number;
  reconnectTimer: ReturnType<typeof setInterval> | null = null;
  onStatus?: (status: RosStatus) => void;

  private healthCheckInterval: ReturnType<typeof setInterval> | null = null;
  private healthCheckIntervalMS: number;
  private currentStatus: RosStatus = "Not Connected";
  private healthCheckInProgress = false;
  private latestRobotInfo: RobotInfo | null = null;
  private onRobotInfoUpdate?: (info: RobotInfo) => void;

  constructor(
    url = "ws://192.168.10.89:9090",
    reconnectInterval = 10000,
    onStatus?: (status: RosStatus) => void,
    healthCheckIntervalMS = 7000
  ) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.onStatus = onStatus;
    this.healthCheckIntervalMS = healthCheckIntervalMS;
    this.startHealthCheck();
  }

  connect() {
    this.clearReconnectTimer();

    console.log("[RosConnect] Attempting ROSBridge connection...");
 
    this.ros = new ROSLIB.Ros({ url: this.url });

    this.ros.on("connection", () => {
      console.log("[RosConnect] Connected to ROSBridge.");
      this.setStatus("Connected");
    });

    this.ros.on("error", (err) => {
      console.error("[RosConnect] Connection error:", err);
      this.handleDisconnect();
    });

    this.ros.on("close", () => {
      console.log("[RosConnect] Connection closed.");
      this.handleDisconnect();
    });
  }

  disconnect() {
    this.stopReconnectLoop();
    if (this.ros) {
      try { this.ros.close(); } catch {}
      this.ros = null;
    }

  }

  private handleDisconnect() {
    this.startReconnectLoop();
}

  private startReconnectLoop() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setInterval(() => {
      if (!this.isConnected()) {
        console.log("[RosConnect] Trying to reconnect...");
        this.connect();
      }
    }, this.reconnectInterval);
  }

  private stopReconnectLoop() {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private setStatus(status: RosStatus) {
    this.currentStatus = status;
    this.onStatus?.(status);
  }

  private clearReconnectTimer() {
  if (this.reconnectTimer) {
    clearInterval(this.reconnectTimer);
    this.reconnectTimer = null;
  }
}

  private startHealthCheck() {
    if (this.healthCheckInterval) return;

    this.healthCheckInterval = setInterval(() => this.healthCheck(), this.healthCheckIntervalMS);
  }

  private async healthCheck() {
    if (!this.ros || !this.ros.isConnected) {
      const nextStatus =
          this.currentStatus === "Connecting..." ? "Connection Failed" : "Connecting...";
        this.setStatus(nextStatus);
      console.log("[HealthCheck] ROS not connected, reconnecting...");
      this.disconnect();
      this.connect();
      return;
    }

    if (this.healthCheckInProgress) return;
    this.healthCheckInProgress = true;

    try {
      const info: RobotInfo = await getRobotInformation();
      console.log("[HealthCheck] Connection Healthy,");
      this.latestRobotInfo = info;
      this.onRobotInfoUpdate?.(info);
      this.setStatus("Connected");
    } catch (err) {
      console.warn("[HealthCheck] Connection Failed.", err);
      this.disconnect();
      this.connect();
    } finally {
      this.healthCheckInProgress = false;
    }
}

  isConnected() {
    return this.currentStatus === "Connected";
  }

  public subscribeRobotInfo(callback: (info: RobotInfo) => void) {
    this.onRobotInfoUpdate = callback;

    if (this.latestRobotInfo) {
      callback(this.latestRobotInfo);
    }
  }

  public unsubscribeRobotInfo() {
    this.onRobotInfoUpdate = undefined;
  }
}
