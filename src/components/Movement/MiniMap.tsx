import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

import robotLogo from "../../assets/Logos/Nanuk.png";
import "leaflet/dist/leaflet.css";


interface MiniMapProps {
  lat: number | null | undefined;
  lon: number | null | undefined;
}

const robotIcon = L.icon({
  iconUrl: robotLogo,
  iconSize: [65, 70],
  iconAnchor: [20, 40],
  className: "robot-marker"
});

const Recenter: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);

  return null;
};

const MiniMap: React.FC<MiniMapProps> = ({ lat, lon }) => {

   const hasFix =
    typeof lat === "number" &&
    typeof lon === "number" &&
    lat !== 0 &&
    lon !== 0;

  const defaultCenter: [number, number] = [47.51873, -52.80525];

 const center: [number, number] = hasFix
    ? [lat!, lon!]
    : defaultCenter;

    console.log("MiniMap lat/lon:", lat, lon);


  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: "2px solid #555",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <MapContainer center={center} zoom={17} style={{ width: "100%", height: "100%" }}>
        {/* recenter on update */}
        {hasFix && <Recenter lat={lat!} lon={lon!} />}


        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={21}
        />
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
          maxZoom={21}
        />

        {hasFix && (
          <>
            <Marker position={[lat!, lon!]} icon={robotIcon} />
            <Recenter lat={lat!} lon={lon!} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MiniMap;


