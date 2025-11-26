import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlanningPage.css";

export default function PlanningPage() {
  // Control mode
  const CONTROL_MODE_MANUAL = 0;
  const CONTROL_MODE_GPS = 1;
  const CONTROL_MODE_AUTO = 2;

  const [controlMode, setControlMode] = useState<number>(CONTROL_MODE_MANUAL);
  const [envMode, setEnvMode] = useState<number>(0);
  const [driveMode, setDriveMode] = useState<number>(0);

  const navigate = useNavigate();

  const getSaveButtonText = () => {
    if (controlMode === CONTROL_MODE_GPS) return "Save & Plan Waypoints";
    return "Save & Connect";
  };


  const handleSave = () => {

    const config = {
      controlMode,
      envMode,
      driveMode,
    };
    console.log("Saving Planning config:", config);

    if (controlMode === CONTROL_MODE_MANUAL) {
      navigate("/movement");
    } else if (controlMode === CONTROL_MODE_GPS) {
      navigate("/waypoints");
    }
    
    // TODO: integrate ROS message send here
  };

  return (
    <div className="planning-page">
      <div className="responsive-container">
        <h3 className="highlight">Choose Mode</h3>

        {/* Manual Mode */}
        <label className="option">
          <input
            type="radio"
            name="modeRadio"
            value={CONTROL_MODE_MANUAL}
            checked={controlMode === CONTROL_MODE_MANUAL}
            onChange={() => setControlMode(CONTROL_MODE_MANUAL)}
          />
          <span>Manual Mode</span>
          <br />
          <span className="desc">
            Use robot in manual mode. Robot can be controlled using Movement tab or through the transceiver.
          </span>
        </label>

        {/* GPS Waypoint Mode */}
        <label className="option">
          <input
            type="radio"
            name="modeRadio"
            value={CONTROL_MODE_GPS}
            checked={controlMode === CONTROL_MODE_GPS}
            onChange={() => setControlMode(CONTROL_MODE_GPS)}
          />
          <span>GPS Waypoint Mode</span>
          <br />
          <span className="desc">
            Use robot in GPS following mode. A GPS route can be planned consisting of multiple waypoints and sent to the robot.
          </span>
          <br />

          {/* Environment Mode */}
          <span className="desc-small">
            Environment Mode:
            {[0, 1, 2, 3].map((val) => (
              <label key={val}>
                <input
                  type="radio"
                  name="envMode"
                  value={val}
                  checked={envMode === val}
                  onChange={() => setEnvMode(val)}
                />
                Mode {val + 1}&nbsp;
              </label>
            ))}
          </span>

          {/* Drive Mode */}
          <span className="desc-small">
            Drive Mode:
            {[0, 1, 2, 3].map((val) => (
              <label key={val}>
                <input
                  type="radio"
                  name="driveMode"
                  value={val}
                  checked={driveMode === val}
                  onChange={() => setDriveMode(val)}
                />
                Mode {val + 1}&nbsp;
              </label>
            ))}
          </span>
        </label>

        {/* Indoor Exploration Mode */}
        <label className="option">
          <input
            type="radio"
            name="modeRadio"
            value={CONTROL_MODE_AUTO}
            checked={controlMode === CONTROL_MODE_AUTO}
            onChange={() => setControlMode(CONTROL_MODE_AUTO)}
          />
          <span>Indoor Exploration Mode</span>
          <br />
          <span className="desc">
            Robot will attempt to navigate through world using on-board 3D mapping software.
          </span>
        </label>

        <button className="save-button" onClick={handleSave}>
          {getSaveButtonText()}
        </button>

        <a
          href="/Nanuk_Users_Guide.pdf"
          target="_blank"
          className="user-guide-link"
        >
          User Guide (PDF)
        </a>
      </div>
    </div>
  );
}
