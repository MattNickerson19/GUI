import React from "react";

export interface Waypoint {
  id: number | string;
  lat: number | string;
  lon: number | string;
  task: string;
}

interface WaypointListProps {
  waypoints?: Waypoint[]; 
}

const WaypointList: React.FC<WaypointListProps> = ({ waypoints = [] }) => {
     const tableStyle: React.CSSProperties = {
        width: "100%",
        borderCollapse: "separate", 
        borderSpacing: 0,
        border: "2px solid #4a90e2", 
        borderRadius: "10px",
        overflow: "hidden",
        background: "linear-gradient(135deg, #151515 0%, #3a3a3a 50%, #1c1c1c 100%)",
    };

    const cellStyle: React.CSSProperties = {
        border: "1px solid #4a90e2", 
        padding: "4px 8px",
        textAlign: "center",
        fontWeight: "normal",
    };

  return (
    <div
      className="waypointscroll"
      style={{ flex: "1 1 auto", marginTop: "5px" }}
    >
      {/* Warning message */}
      <span
        id="waypointWarningStr"
        className="waypointwarning highlight"
        style={{ paddingLeft: "5px", color: "red", display: "none" }}
      ></span>

      {/* Waypoints table */}
      <table id="waypointlisttableWaypointTab" className="waypointlist" style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle} >ID</th>
            <th style={cellStyle} >Latitude</th>
            <th style={cellStyle} >Longitude</th>
            <th style={cellStyle} >Task</th>
          </tr>
        </thead>
        <tbody id="waypointlistWaypointTab">
          {waypoints.length > 0 ? (
            waypoints.map((wp) => (
              <tr key={wp.id} className="waypointRow">
                <td style={cellStyle} className="highlight index">{wp.id}</td>
                <td style={cellStyle} className="highlight">{wp.lat}</td>
                <td style={cellStyle} className="highlight">{wp.lon}</td>
                <td style={cellStyle} className="highlight">{wp.task}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={cellStyle} colSpan={4}>
                No Waypoints To Display!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WaypointList;