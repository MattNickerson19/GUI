import React from "react";
import "./Joystick.css";

import arrowUp from "../../assets/arrows/arrow-up.png";
import arrowDown from "../../assets/arrows/arrow-down.png";
import arrowLeft from "../../assets/arrows/arrow-left.png";
import arrowRight from "../../assets/arrows/arrow-right.png";
import stopIcon from "../../assets/arrows/stop.png";

interface JoystickProps {
  disabled?: boolean;
}

const Joystick: React.FC<JoystickProps> = ({ disabled = true }) => {
  return (
    <div className="movement_grid">
      {/* Forward row */}
      <div className="movement_row">
        <span className="movement_spacer" />
        <button id="forward" className="joystick-btn" disabled={disabled}>
          <img src={arrowUp} alt="Forward" />
        </button>
        <span className="movement_spacer" />
      </div>

      {/* Middle row */}
      <div className="movement_row">
        <button id="left" className="joystick-btn" disabled={disabled}>
          <img src={arrowLeft} alt="Left" />
        </button>
        <button id="stop" className="joystick-btn" disabled={disabled}>
          <img src={stopIcon} alt="Stop" />
        </button>
        <button id="right" className="joystick-btn" disabled={disabled}>
          <img src={arrowRight} alt="Right" />
        </button>
      </div>

      {/* Back row */}
      <div className="movement_row">
        <span className="movement_spacer" />
        <button id="back" className="joystick-btn" disabled={disabled}>
          <img src={arrowDown} alt="Back" />
        </button>
        <span className="movement_spacer" />
      </div>
    </div>
  );
};

export default Joystick;




