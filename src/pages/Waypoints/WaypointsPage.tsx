import { useRef, useState, useEffect } from "react";
//Map
import { MapContainer, TileLayer, ScaleControl, Marker, useMapEvents, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

//Components
import Coordinates from "../../components/Waypoints/Coordinates";
import WaypointList from "../../components/Waypoints/WaypointsList";
import { type RobotInfo } from "../../ros/Services/RobotInfoService";
import { type WaypointStatusMsg } from "../../ros/Topics/WaypointStatusTopic";
import UserAlert from "../../components/layout/UserAlert";
import {type RosStatus } from "../../ros/Connection/RosSingleton";

import robotLogo from "../../assets/Logos/Nanuk.png";
import homeLogo from "../../assets/homeIcon.png";
import "./WaypointsPage.css";

interface WaypointsPageProps {
  robotInfo: RobotInfo | null;
  waypointStatus: WaypointStatusMsg | null;
  status: RosStatus;
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
  className: "waypoint-marker"
});

const robotIcon = L.icon({
  iconUrl: robotLogo,
  iconSize: [65, 70],
  iconAnchor: [20, 40],
  className: "robot-marker"
});

const homeIcon = L.icon({
  iconUrl: homeLogo,
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "home-marker"
});

function MapClickHandler({ onClick }: { onClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {onClick(e.latlng.lat, e.latlng.lng);}});
  return null;
}

function CenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

export default function WaypointsPage({ robotInfo, waypointStatus, status }: WaypointsPageProps) {

  const [alertMsg, setAlertMsg] = useState("");
  const closeAlert = () => setAlertMsg("");


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

  const homeLat =waypointStatus?.home_coord?.position.latitude && waypointStatus.home_coord.position.latitude !== 0? waypointStatus.home_coord.position.latitude.toFixed(6): "--";

  const homeLon =waypointStatus?.home_coord?.position.longitude && waypointStatus.home_coord.position.longitude !== 0? waypointStatus.home_coord.position.longitude.toFixed(6): "--";

  const goalLat =waypointStatus?.goal_coord?.position.latitude && waypointStatus.goal_coord.position.latitude !== 0? waypointStatus.goal_coord.position.latitude.toFixed(6): "--";

  const goalLon =waypointStatus?.goal_coord?.position.longitude && waypointStatus.goal_coord.position.longitude !== 0? waypointStatus.goal_coord.position.longitude.toFixed(6): "--";

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const hasCurrentCoords =
    currentLat !== "--" &&
    currentLon !== "--" &&
    Number(currentLat) !== 0 &&
    Number(currentLon) !== 0;

  const hasHomeCoords =
    homeLat !== "--" &&
    homeLon !== "--" &&
    Number(homeLat) !== 0 &&
    Number(homeLon) !== 0;


  const handleSendStart = () => console.log("Send & Start clicked");
  const handlePause = () => console.log("Pause clicked");
  const handleStop = () => console.log("Stop clicked");
  const handleGoTo = () => console.log("Go To clicked");

  const [selectedWaypointId, setSelectedWaypointId] = useState<number | undefined>(undefined);

 
  const handleSelectWaypoint = (id: number) => {
    setSelectedWaypointId(id);
  };

  
  const moveUp = () => {
  if (selectedWaypointId == null) return;

  setWaypoints(prev => {
    const index = prev.findIndex(wp => wp.id === selectedWaypointId);
    if (index > 0) {
      const newWaypoints = [...prev];
      // Swap only the lat, lon, and task, keep IDs in place
      const temp = { ...newWaypoints[index - 1] };
      newWaypoints[index - 1] = {
        ...newWaypoints[index - 1],
        lat: newWaypoints[index].lat,
        lon: newWaypoints[index].lon,
        task: newWaypoints[index].task,
      };
      newWaypoints[index] = {
        ...newWaypoints[index],
        lat: temp.lat,
        lon: temp.lon,
        task: temp.task,
      };
      setSelectedWaypointId(newWaypoints[index - 1].id);
      return newWaypoints;
    }
    return prev;
  });
};

  const moveDown = () => {
    if (selectedWaypointId == null) return;

    setWaypoints(prev => {
      const index = prev.findIndex(wp => wp.id === selectedWaypointId);
      if (index >= 0 && index < prev.length - 1) {
        const newWaypoints = [...prev];
        const temp = { ...newWaypoints[index + 1] };
        newWaypoints[index + 1] = {
          ...newWaypoints[index + 1],
          lat: newWaypoints[index].lat,
          lon: newWaypoints[index].lon,
          task: newWaypoints[index].task,
        };
        newWaypoints[index] = {
          ...newWaypoints[index],
          lat: temp.lat,
          lon: temp.lon,
          task: temp.task,
        };
        setSelectedWaypointId(newWaypoints[index + 1].id);
        return newWaypoints;
      }
      return prev;
    });
  };

  const deleteSelectedWaypoint = () => {
    if (selectedWaypointId == null) return;

    setWaypoints(prev => {
      const filtered = prev.filter(wp => wp.id !== selectedWaypointId);
      const reindexed = filtered.map((wp, idx) => ({
        ...wp,
        id: idx + 1,
      }));

      return reindexed;
    });

    setSelectedWaypointId(undefined);
  };

  const clearWaypoints = () => {
    setWaypoints([]);
    setSelectedWaypointId(undefined);
};


  return (
   <div className="waypoints-page">
    <div className="main-content">
    <div className="left-panel">
      <Coordinates
        homeLat={homeLat}
        homeLon={homeLon}
        robotLat={currentLat}
        robotLon={currentLon}
        goalLat={goalLat}
        goalLon={goalLon}
        goalNum={waypointStatus?.goal_number ?? "-"}
      />

      <div className="map-wrapper">
        <MapContainer
          center={
          hasCurrentCoords
          ? [Number(currentLat), Number(currentLon)]
          : [initialLat, initialLng]
      }
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
                  task: "",    
                }
              ]);
            }}
          />

          {/* Current location marker */}
          {hasCurrentCoords && (
            <>
              <Marker
                position={[Number(currentLat), Number(currentLon)]}
                icon={robotIcon}
              />
              <CenterMap lat={Number(currentLat)} lon={Number(currentLon)} />
            </>
          )}

          {/* Home marker */}
          {hasHomeCoords && (
              <Marker
                position={[Number(homeLat), Number(homeLon)]}
                icon={homeIcon}
              />
          )}

          {/* render markers */}
          {waypoints.map(wp => (
            <Marker
              key={wp.id}
              position={[wp.lat, wp.lon]}
              icon={markerIcon}
            />
          ))}
          {/* draw polyline connecting waypoints */}
          {waypoints.length > 1 && (
            <Polyline
              positions={waypoints.map(wp => [wp.lat, wp.lon])}
              pathOptions={{ color: "#4a90e2", weight: 3}}
            />
          )}
        </MapContainer>

        <div className="waypoints-buttons">
          <button className="btn-blue" onClick={() => {
              if (status !== "Connected") {
                setAlertMsg("Not Connected to Robot!");
                return;
              }
              {handleSendStart}
            }}
          >Send & Start</button>
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
        <WaypointList
          waypoints={waypoints}
          selectedWaypointId={selectedWaypointId}
          onSelectWaypoint={handleSelectWaypoint}
        />
      </div>
      <div className="waypoint-controls waypoints-buttons">
        <div >
          <h5>Selected Waypoint:</h5>
        </div>
        <div className="controls-row">
          <button className="waypoint-btn" onClick={moveUp}>Move Up</button>
          <button className="waypoint-btn" onClick={moveDown}>Move Down</button>
          <button className="waypoint-btn" onClick={deleteSelectedWaypoint}>Delete</button>
        </div>
        <div>
          <h5>Waypoint Actions:</h5>
        </div>
        <div className="controls-row">
          <button
            className="waypoint-btn"onClick={() => {
              if (hasCurrentCoords) {
                setWaypoints(prev => [
                  ...prev,
                  {
                    id: prev.length + 1,
                    lat: Number(currentLat),
                    lon: Number(currentLon),
                    task: "",
                  },
                ]);
              } else {
                setAlertMsg("Robot Position Unavailable");
              }
            }}
          >
            Add Waypoint
          </button>
          <button
            className="waypoint-btn"onClick={() => {
              if (status !== "Connected") {
                setAlertMsg("Not Connected to Robot!");
                return;
              }
              if (hasCurrentCoords) {
                //set Home logic
              } else {
                setAlertMsg("Robot Position Unavailable");
              }
            }}
          >Set Home</button>
          <button className="waypoint-btn" onClick={clearWaypoints}>Clear Waypoints</button>
        </div>
        <div>
          <h5>Polygon Actions:</h5>
        </div>
        <div className="controls-row">
          <button className="waypoint-btn">Coverage Path</button>
          <button className="waypoint-btn">Geo-Fence</button>
          <button className="waypoint-btn">Clear Drawings</button>
        </div>
        <div>
          <h5>Mission Controls</h5>
        </div>
        <div className="top-buttons">
          <button className="waypoint-btn">Auto Continue</button>
          <button className="waypoint-btn">Repeat Mission</button>
        </div>
      </div>
      </div>
    </div>
    <UserAlert message={alertMsg} onClose={closeAlert} />
</div>
  );}




