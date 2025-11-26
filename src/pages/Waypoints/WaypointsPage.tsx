import { MapContainer, TileLayer, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./WaypointsPage.css";
import Coordinates from "../../components/Waypoints/Coordinates";
import WaypointList from "../../components/Waypoints/WaypointsList";
import { useState, useEffect } from "react";

export default function WaypointsPage() {
  const initialLat = 47.51873;
  const initialLng = -52.80525;
  const initialZoom = 17;

   const [home, setHome] = useState<{ lat: number | string; lon: number | string }>({
    lat: "--",
    lon: "--",
  });

  const [robot, setRobot] = useState<{ lat: number | string; lon: number | string }>({
    lat: "--",
    lon: "--",
  });

   useEffect(() => {
    const interval = setInterval(() => {
      // Replace with your ROS/real data
      setHome({ lat: 47.51873, lon: -52.80525 });
      setRobot({ lat: 47.51880, lon: -52.80530 });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSendStart = () => console.log("Send & Start clicked");
  const handlePause = () => console.log("Pause clicked");
  const handleStop = () => console.log("Stop clicked");
  const handleGoTo = () => console.log("Go To clicked");

  return (
   <div className="waypoints-page">
  <div className="main-content">
    <div className="left-panel">
      <Coordinates
        homeLat={home.lat}
        homeLon={home.lon}
        robotLat={robot.lat}
        robotLon={robot.lon}
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

      <WaypointList  />
    </div>
  </div>
</div>

  );}


