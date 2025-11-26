import React from "react";

interface CoordinatesProps {
  homeLat: number | string;
  homeLon: number | string;
  robotLat: number | string;
  robotLon: number | string;
}

const Coordinates: React.FC<CoordinatesProps> = ({
  homeLat,
  homeLon,
  robotLat,
  robotLon,
}) => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: "10%",       // space between Home and Robot
    fontSize: "20px",
    alignItems: "center",
    marginBottom: "2px",
    marginLeft: "10px",
    justifyContent: "center",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginRight: "4px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

 return (
  <div style={containerStyle}>
    {/* Home coordinates */}
    <div style={{ color: "lime", display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={labelStyle}>
        <i className="fas fa-home"></i> Home:
      </span>
      <div style={{ display: "flex", gap: "25px" }}>
        <span>{homeLat}</span>
        <span>{homeLon}</span>
      </div>
    </div>

    {/* Robot coordinates */}
    <div style={{ color: "yellow", display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={labelStyle}>
        <i className="fas fa-map-marker"></i> Robot:
      </span>
      <div style={{ display: "flex", gap: "25px" }}>
        <span>{robotLat}</span>
        <span>{robotLon}</span>
      </div>
    </div>
  </div>
);
};

export default Coordinates;
