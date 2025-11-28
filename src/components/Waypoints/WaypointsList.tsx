import React from "react";
import "./WaypointsList.css";

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
  return (
    <div className="waypointscroll">
      {/* Warning message */}
      <span id="waypointWarningStr" className="waypointwarning highlight"></span>

      {/* Waypoints table */}
      <table id="waypointlisttableWaypointTab" className="waypointlist">
        <thead>
          <tr>
            <th>ID</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Task</th>
          </tr>
        </thead>
        <tbody id="waypointlistWaypointTab">
          {waypoints.length > 0 ? (
            waypoints.map((wp) => (
              <tr key={wp.id} className="waypointRow">
                <td className="highlight index">{wp.id}</td>
                <td className="highlight">{wp.lat}</td>
                <td className="highlight">{wp.lon}</td>
                <td className="highlight">{wp.task}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="noWaypoints">
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
