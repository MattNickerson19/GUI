import React from "react";
import {type RosStatus } from "../../ros/Connection/RosSingleton";
import { type RobotInfo } from "../../ros/Services/RobotInfoService";
import { type OrientationMsg} from "../../ros/Topics/OrientationTopic";
import { type DauStampedMsg} from "../../ros/Topics/DauTopic";

import "./StatusPage.css";

interface StatusPageProps {
  status: RosStatus;
  robotInfo: RobotInfo | null;
  gpsStatus: string | undefined;
  orientation: OrientationMsg | null;
  dauData: DauStampedMsg | null
}

export default function StatusPage({ robotInfo, gpsStatus, orientation, status, dauData}: StatusPageProps) {
  if (!robotInfo || status !== "Connected") {
    return (
      <div className="no-robot-data">
        <h2>No robot data available.</h2>
      </div>
    );
  }

 
  const batt = robotInfo.battinfo;
  const disk = robotInfo.hdspace;

  function convertYawToCompassHeading(yawDeg: number): string {
    let compass = yawDeg % 360;
    if (compass < 0) compass += 360;

    let dir = "";
    if (compass >= 337.5 || compass < 22.5) dir = "N";
    else if (compass < 67.5) dir = "NE";
    else if (compass < 112.5) dir = "E";
    else if (compass < 157.5) dir = "SE";
    else if (compass < 202.5) dir = "S";
    else if (compass < 247.5) dir = "SW";
    else if (compass < 292.5) dir = "W";
    else dir = "NW";

    return `${Math.round(compass)}° ${dir}`;
  }

  let headingDisplay: string = "--";
  if (orientation && typeof orientation.z === "number") {
    headingDisplay = convertYawToCompassHeading(orientation.z);
  }

  const prevLat = React.useRef<string>("--");
  const prevLng = React.useRef<string>("--");
  const prevAlt = React.useRef<string>("--");

 
  const rawLat = robotInfo.fix?.latitude;
  const rawLng = robotInfo.fix?.longitude;
  const rawAlt = robotInfo.fix?.altitude;

  if (rawLat != null && rawLat !== 0) {
    prevLat.current = rawLat.toFixed(6);
  }
  if (rawLng != null && rawLng !== 0) {
    prevLng.current = rawLng.toFixed(6);
  }
  if (rawAlt != null && rawAlt !== 0) {
  prevAlt.current = rawAlt.toFixed(2);
  }

  // Helper to format MB → GB
  const mbToGb = (mb?: number) =>
    mb != null ? (mb / 1024).toFixed(2) : "--";

  const renderDiskRow = (
    label: string,
    total?: number,
    free?: number,
  ) => {
    const totalGb = mbToGb(total);
    const freeGb = mbToGb(free);
    const usedGb = total != null && free != null ? ((total - free) / 1024).toFixed(2) : "--";

    return (
      <div className="disk-row">
        <h4>{label}</h4>
        <div>Total: {totalGb} GB</div>
        <div>Available: {freeGb} GB</div>
        <div>Used: {usedGb} GB</div>
      </div>
    );
  };

  return (
    <div className="statuspage-container">

      {/* GPS */}
      <div className="status-card">
        <h3>GPS</h3>
        <div><span className="label">Status:</span> {gpsStatus ?? "--"}</div>
        <div><span className="label">Latitude:</span> {prevLat.current}°</div>
        <div><span className="label">Longitude:</span> {prevLng.current}°</div>
        <div><span className="label">Altitude:</span> {prevAlt.current} m</div>
        <div><span className="label">Heading:</span> {headingDisplay}</div>
      </div>

      {/* Battery */}
      <div className="status-card">
        <h3>Battery</h3>
        <div><span className="label">Voltage:</span> {batt?.voltage?.toFixed(2) ?? "--"} V</div>
        <div><span className="label">Current:</span> {batt?.current?.toFixed(2) ?? "--"} A</div>
        <div><span className="label">State of Charge:</span> {batt?.stateofcharge?.toFixed(0) ?? "--"}%</div>
        <div><span className="label">Time Remaining:</span> {batt?.timeremaining ?? "--"} min</div>
      </div>

      {/* DAU */}
     <div className="status-card">
      <h3>DAU</h3>
      <h5>({dauData?.header?.stamp? `${new Date(
              dauData.header.stamp.sec * 1000 + Math.floor(dauData.header.stamp.nanosec / 1e6)
            ).toLocaleDateString()} ${new Date(dauData.header.stamp.sec * 1000 + Math.floor(dauData.header.stamp.nanosec / 1e6)
            ).toLocaleTimeString()}`: "--"})
      </h5>
      <div className="dau-container">
        <div className="dau-column">
          <div><span className="label">Temperature:</span> {dauData?.temperature?.toFixed(1) ?? "--"} °C</div>
          <div><span className="label">Humidity:</span> {dauData?.humidity?.toFixed(1) ?? "--"} %</div>
          <div><span className="label">Light:</span> {dauData?.light?.toFixed(0) ?? "--"} lx</div>
          <div><span className="label">Pressure:</span> {dauData?.pressure?.toFixed(1) ?? "--"} hPa</div>
        </div>
        <div className="dau-column">
          <div><span className="label">Noise:</span> {dauData?.noise?.toFixed(1) ?? "--"} dB</div>
          <div><span className="label">Air Quality:</span> {dauData?.etvoc?.toFixed(0) ?? "--"} ppb</div>
          <div><span className="label">Carbon Dioxide:</span> {dauData?.eco2?.toFixed(0) ?? "--"} ppm</div>
          <div><span className="label">Seismic Intensity:</span> {dauData?.sivalue?.toFixed(2) ?? "--"} MM</div>
        </div>
      </div>
    </div>


      {/* Disk */}
     <div className="status-card storage-card">
      <h3>Storage</h3>
      <div className="disk-row-horizontal">
        <div className="disk-item">
          {renderDiskRow("VIDEO", disk?.total2, disk?.free2)}
        </div>
        <div className="disk-item">
          {renderDiskRow("LIDAR", disk?.total3, disk?.free3)}
        </div>  
        <div className="disk-os">
        {renderDiskRow("OS", disk?.total1, disk?.free1)}
        </div>
      </div>
    </div>
    </div>
  );
}