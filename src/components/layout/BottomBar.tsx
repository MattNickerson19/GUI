import "./BottomBar.css";
import {type RosStatus } from "../../ros/Connection/RosSingleton";
import { type RobotInfo } from "../../ros/Services/RobotInfoService";
import Logo from "../../assets/Logos/NANUK_Logo.png";
import { useRef } from "react";

interface BottomBarProps {
  status: RosStatus;
  robotInfo?: RobotInfo | null;
  onRecordVideo?: () => void;
  onRecordLidar?: () => void;
  gpsStatus?: string;
}

export default function BottomBar({
  status,
  robotInfo,
  gpsStatus,
  onRecordVideo,
  onRecordLidar,
}: BottomBarProps) {
  const prevLat = useRef<string>("--");
  const prevLng = useRef<string>("--");
  const prevGpsStatus = useRef<string>("--");

  let lat = "--";
  let lng = "--";
  let batteryV = "--";
  let batteryPercent = "--";
  let displayedGpsStatus = "--";

  if (status === "Connected" && robotInfo) {
    const latitude = robotInfo.fix?.latitude;
    const longitude = robotInfo.fix?.longitude;

    if (latitude != null && latitude !== 0) prevLat.current = latitude.toFixed(6);
    if (longitude != null && longitude !== 0) prevLng.current = longitude.toFixed(6);

    lat = prevLat.current;
    lng = prevLng.current;

    batteryV = robotInfo.battinfo?.voltage != null ? robotInfo.battinfo.voltage.toFixed(2) : "--";
    batteryPercent = robotInfo.battinfo?.stateofcharge != null ? robotInfo.battinfo.stateofcharge.toFixed(0) : "--";

    if (gpsStatus) prevGpsStatus.current = gpsStatus;
  }

  displayedGpsStatus = status === "Connected" ? prevGpsStatus.current : "--";

  const isPlaceholder = (val: string | number) => val === "--";

  return (
    <div className={`bottom-bar ${
      status === "Connected" ? "status-connected" :
      status === "Connecting..." ? "status-connecting" :
      status === "Connection Failed" ? "status-connection-failed" :
      "status-not-connected"
    }`}>
      <div className="bottom-inner">
        <div className="bottom-buttons">
          <button
            className="icon-button"
            onClick={onRecordVideo}
            title="Record Video"
          >
            <i className="fas fa-video"></i>
          </button>
          <button
            className="icon-button"
            onClick={onRecordLidar}
            title="Record LiDAR"
          >
            <i className="fas fa-vr-cardboard"></i>
          </button>
        </div>
        <div className="nav-logo">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="bottom-content">
          <span style={{ marginRight: "1rem" }}>
            <i className="fas fa-satellite-dish" style={{ marginRight: "0.3rem", fontSize: "1.3rem" }}></i>
            GPS Status: <span className={isPlaceholder(displayedGpsStatus) ? "placeholder" : ""}>{displayedGpsStatus}</span>
          </span>
          <span style={{ marginRight: "1rem" }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: "0.3rem", fontSize: "1.3rem" }}></i>
            Lat: <span className={isPlaceholder(lat) ? "placeholder" : ""}>{lat}</span>°
            Lng: <span className={isPlaceholder(lng) ? "placeholder" : ""}>{lng}</span>°
          </span>
          <span>
            <i className="fas fa-battery-half" style={{ marginRight: "0.3rem", fontSize: "1.3rem" }}></i>
            <span className={isPlaceholder(batteryV) ? "placeholder" : ""}>{batteryV}</span>v
            <span className={isPlaceholder(batteryPercent) ? "placeholder" : ""}> {batteryPercent}</span>%
          </span>
        </div>
      </div>
    </div>
  );
}

