import { MapContainer, TileLayer, ScaleControl, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./WaypointsPage.css";
import Coordinates from "../../components/Waypoints/Coordinates";
import WaypointList from "../../components/Waypoints/WaypointsList";
import { type RobotInfo } from "../../ros/Services/RobotInfoService";

interface WaypointsPageProps {
  robotInfo: RobotInfo | null;
}

interface Waypoint {
  id: number;
  lat: number;
  lon: number;
  task: string;
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ onClick }: { onClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function WaypointsPage({ robotInfo }: WaypointsPageProps) {
  const initialLat = 47.51873;
  const initialLng = -52.80525;
  const initialZoom = 17;

  const prevLat = useRef<string>("--");
  const prevLon = useRef<string>("--");

  const rawLat = robotInfo?.fix?.latitude;
  const rawLon = robotInfo?.fix?.longitude;

  if (rawLat != null && rawLat !== 0) {
    prevLat.current = rawLat.toFixed(6);
  }
  if (rawLon != null && rawLon !== 0) {
    prevLon.current = rawLon.toFixed(6);
  }

  const currentLat = prevLat.current;
  const currentLon = prevLon.current;

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);


  const handleSendStart = () => console.log("Send & Start clicked");
  const handlePause = () => console.log("Pause clicked");
  const handleStop = () => console.log("Stop clicked");
  const handleGoTo = () => console.log("Go To clicked");

  return (
   <div className="waypoints-page">
    <div className="main-content">
    <div className="left-panel">
      <Coordinates
        homeLat={"--"}
        homeLon={"--"}
        robotLat={currentLat}
        robotLon={currentLon}
      />

      <div className="map-wrapper">
        <MapContainer
          center={[initialLat, initialLng]}
          zoom={initialZoom}
          className="waypoints-map"
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={21}
          />
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
            maxZoom={21}
          />
          <ScaleControl position="bottomleft" />
          <MapClickHandler
            onClick={(lat, lon) => {
              setWaypoints(prev => [
                ...prev,
                {
                  id: prev.length + 1,
                  lat: Number(lat.toFixed(6)),
                  lon: Number(lon.toFixed(6)),
                  task: "",     // or "None", your choice
                }
              ]);
            }}
          />

          {/* render markers */}
          {waypoints.map(wp => (
            <Marker
              key={wp.id}
              position={[wp.lat, wp.lon]}
              icon={markerIcon}
            />
          ))}
        </MapContainer>

        <div className="waypoints-buttons">
          <button className="btn-blue" onClick={handleSendStart}>Send & Start</button>
          <button className="btn-red" onClick={handlePause}>Pause</button>
          <button className="btn-red" onClick={handleStop}>Stop</button>
          <button className="btn-blue" onClick={handleGoTo}>Go To...</button>
        </div>
      </div>
    </div>

    <div className="right-panel">
      <div className="top-buttons waypoints-buttons">
        <button className="btn-blue">Load Waypoints</button>
        <button className="btn-blue" >Save Waypoints</button>
      </div>

      <div className="waypoint-list-container">
        <WaypointList waypoints={waypoints} />
      </div>

    </div>
  </div>
</div>
  );}




