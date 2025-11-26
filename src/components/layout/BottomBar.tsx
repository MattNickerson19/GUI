import "./BottomBar.css";

interface BottomBarProps {
  onRecordVideo?: () => void;
  onRecordLidar?: () => void;
  gpsStatus?: string; 
  lat?: number | string;
  lng?: number | string;
  batteryV?: number | string;
  batteryPercent?: number | string;
}

export default function BottomBar({
  onRecordVideo,
  onRecordLidar,
  gpsStatus = "--",
  lat = "-",
  lng = "-",
  batteryV = "-",
  batteryPercent = "-",
}: BottomBarProps) {
  return (
    <div className="bottom-bar">
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

        <div className="bottom-content">
          <span style={{ marginRight: "1rem" }}>
            <i className="fas fa-satellite-dish" style={{ marginRight: "0.3rem", fontSize: "1.3rem" }}></i>
            GPS Status: {gpsStatus}
          </span>
          <span style={{ marginRight: "1rem" }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: "0.3rem", fontSize: "1.3rem" }}></i>
            Lat: {lat}° Lng: {lng}°
          </span>
          <span>
            <i className="fas fa-battery-half" style={{ marginRight: "0.3rem", fontSize: "1.3rem" }}></i>
            V:{batteryV} {batteryPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}

