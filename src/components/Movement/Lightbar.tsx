import React, { useState } from "react";
import "./Lightbar.css";

interface LightbarProps {
  onToggleDisabled: (disabled: boolean) => void;
  initialDisabled?: boolean;

  onToggleLightBar: (lightBarOn: boolean) => void; 
}

const Lightbar: React.FC<LightbarProps> = ({
  onToggleDisabled,
  initialDisabled = true,
  onToggleLightBar
}) => {
  const [disabled, setDisabled] = useState(initialDisabled);
  const [lightBarOn, setLightBarOn] = useState(false);

  const handleDisabledClick = () => {
    const newState = !disabled;
    setDisabled(newState);
    onToggleDisabled(newState);
  };

  const handleLightBarClick = () => {
    const newState = !lightBarOn;
    setLightBarOn(newState);
    onToggleLightBar(newState);
  };

  return (
  <div className="lightbar-container">
    <div className="top-buttons">
      <button className={`lightbar-btn ${lightBarOn ? "active" : ""}`}onClick={handleLightBarClick}>Light Bar</button>
      <button className="lightbar-btn center-btn">Center Camera</button>
      <button className={`lightbar-btn ${disabled ? "active" : ""}`}onClick={handleDisabledClick}>{disabled ? "Movement Disabled" : "Movement Active"}</button>
    </div>
  </div>
);
};

export default Lightbar;


