import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const MiniMap: React.FC = () => {
  const center: [number, number] = [47.51873, -52.80525]; 
  const zoom = 16;

  return (
    <div style={{
      width: "100%",       
      height: "100%",
      border: "2px solid #555",
      borderRadius: "12px",
      overflow: "hidden"
    }}>
      <MapContainer center={center} zoom={zoom} style={{ width: "100%", height: "100%" }}>
        <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={21}
          />
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
            maxZoom={21}
          />
      </MapContainer>
    </div>
  );
};

export default MiniMap;

