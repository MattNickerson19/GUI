import React from "react";
import "./Coordinates.css";

interface CoordinatesProps {
  homeLat: number | string;
  homeLon: number | string;
  robotLat: number | string;
  robotLon: number | string;
  goalLat: number | string;
  goalLon: number | string;
  goalNum: number | string;
}

const Coordinates: React.FC<CoordinatesProps> = ({
  homeLat,
  homeLon,
  robotLat,
  robotLon,
  goalLat,
  goalLon,
  goalNum,
}) => {
  return (
    <div className="container">
      {/* Home coordinates */}
      <div className="coordBox home">
        <span className="cord-Label">
          <i className="fas fa-home"></i> Home:
        </span>
        <div className="values">
          <span>{homeLat}</span>
          <span>{homeLon}</span>
        </div>
      </div>

      {/* Robot coordinates */}
      <div className="coordBox robot">
        <span className="cord-Label">
          <i className="fas fa-map-marker-alt"></i> Current:
        </span>
        <div className="values">
          <span>{robotLat}</span>
          <span>{robotLon}</span>
        </div>
      </div>

      {/* Goal coordinates */}
      <div className="coordBox goal">
        <span className="cord-Label">
          <i className="fas fa-crosshairs"></i> Goal {(goalNum)}:
        </span>
        <div className="values">
          <span>{goalLat}</span>
          <span>{goalLon}</span>
        </div>
      </div>
    </div>
  );
}

export default Coordinates;