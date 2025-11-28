import React from "react";
import "./Coordinates.css";

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
  return (
    <div className="container">
      {/* Home coordinates */}
      <div className="coordBox home">
        <span className="cord-Label"><i className="fas fa-home"></i> Home:</span>
        <div className="values">
          <span>{homeLat}</span>
          <span>{homeLon}</span>
        </div>
      </div>

      {/* Robot coordinates */}
      <div className="coordBox robot">
        <span className="cord-Label"><i className="fas fa-map-marker-alt"></i> Robot:</span>
        <div className="values">
          <span>{robotLat}</span>
          <span>{robotLon}</span>
        </div>
      </div>
    </div>
  );
};

export default Coordinates;