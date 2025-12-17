import { useEffect, useState } from "react";
import { loadConfig, saveConfig } from "../../config/ConfigStore";
import UserAlert from "../../components/layout/UserAlert";
import { ParametersService } from "../../ros/Services/Parameters";
import {type RosStatus } from "../../ros/Connection/RosSingleton";

import "./SettingsPage.css";

type SettingsPageProps = {
  status: RosStatus;
};

export default function SettingsPage({ status }: SettingsPageProps) {
  const [alertMsg, setAlertMsg] = useState("");
  const closeAlert = () => {
    setAlertMsg("");
  };

  const config = loadConfig();

  // GUI Settings
  const [ip, setIp] = useState(config.rosNodeIp);
  const [port, setPort] = useState(config.rosNodePort);

  // ROS Parameters
  const [waypointTolerance, setWaypointTolerance] = useState<number | "">("");
  const [coneHeight, setConeHeight] = useState<number | "">("");
  const [operationWidth, setOperationWidth] = useState<number | "">("");
  const [rcOverride, setRCOverride] = useState<boolean>(false);

  useEffect(() => {
    if (status !== "Connected") return;

    ParametersService.getWaypointTolerance()
      .then(setWaypointTolerance)
      .catch(console.error);

    ParametersService.getConeHeight()
      .then(setConeHeight)
      .catch(console.error);

    ParametersService.getOperationWidth()
      .then(setOperationWidth)
      .catch(console.error);
  }, [status]);


  const saveGUISettings = () => {
    if (!ip.trim()) {
      alert("IP address is required");
      return;
    }

    if (!Number.isInteger(port) || port <= 0) {
      alert("Invalid port");
      return;
    }

    saveConfig({
      rosNodeIp: ip.trim(),
      rosNodePort: port,
    });
    setAlertMsg("GUI Settings saved successfully!");
    console.log("GUI settings saved.");
  };

  const submitROSParameters = async () => {
    try {
      if (waypointTolerance !== "") await ParametersService.setWaypointTolerance(waypointTolerance);
      if (coneHeight !== "") await ParametersService.setConeHeight(coneHeight);
      if (operationWidth !== "") await ParametersService.setOperationWidth(operationWidth);
      //await ParametersService.setRCOverride(rcOverride);

      setAlertMsg("ROS Parameters updated successfully!");
      console.log("ROS parameters updated. - Waypoint Tolerance: ", waypointTolerance, "Cone Height: ", 
                    coneHeight, "Operation Width: ", operationWidth, "RC Override: ", rcOverride);
    } catch (err) {
      console.error(err);
      setAlertMsg("Failed to update ROS parameters.");
      console.log("Failed to update ROS parameters.", err);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">

        {/* GUI SETTINGS */}
        <div className="settings-card">
          <h2>GUI Settings</h2>
          <button className="settings-save-btn" onClick={saveGUISettings}>Save & Reload</button>
          <div className="settings-group">
            <label>RosBridge IP</label>
            <input value={ip} onChange={(e) => setIp(e.target.value)} />
          </div>

          <div className="settings-group">
            <label>RosBridge Port</label>
            <input type="number" value={port} onChange={(e) => setPort(Number(e.target.value))} />
          </div>
        </div>

        {/* ROS PARAMETERS */}
        <div className="settings-card">
          <h2>ROS Parameters</h2>
          <button className="settings-submit-btn" onClick={submitROSParameters}>Submit</button>

          <div className="settings-group">
            <label>Waypoint Tolerance</label>
            <input
              type="number"
              value={waypointTolerance}
              onChange={(e) => setWaypointTolerance(Number(e.target.value))}
            />
          </div>

          <div className="settings-group">
            <label>Conical Filter Height</label>
            <input
              type="number"
              value={coneHeight}
              onChange={(e) => setConeHeight(Number(e.target.value))}
            />
          </div>

          <div className="settings-group">
            <label>Operation Width</label>
            <input
              type="number"
              value={operationWidth}
              onChange={(e) => setOperationWidth(Number(e.target.value))}
            />
          </div>

          <div className="settings-group">
            <label>RC Override</label>
            <select
              value={rcOverride ? "true" : "false"}
              onChange={(e) => setRCOverride(e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>
      </div>

      <UserAlert message={alertMsg} color="blue" onClose={closeAlert}/>
    </div>
  );
}
