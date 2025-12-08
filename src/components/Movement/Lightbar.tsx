import React, { useState } from "react";
import "./Lightbar.css";
import { LightbarService } from "../../ros/Services/LightbarService";

interface LightbarProps {
  onToggleDisabled: (disabled: boolean) => void;
  initialDisabled?: boolean;

  lightbarService: LightbarService;
}

const Lightbar: React.FC<LightbarProps> = ({
  onToggleDisabled,
  initialDisabled = true,
  lightbarService
}) => {
  const [disabled, setDisabled] = useState(initialDisabled);
  const [lightBarOn, setLightBarOn] = useState(false);

  const handleDisabledClick = () => {
    const newState = !disabled;
    setDisabled(newState);
    onToggleDisabled(newState);
  };

  const handleLightBarClick = async () => {
    const newState = !lightBarOn;
    setLightBarOn(newState);

    try {
      const result = await lightbarService.call(newState ? 1 : 0);
      console.log("Lightbar service result:", result);
    } catch (error) {
      console.error("Lightbar service error:", error);
    }
};

  return (
  <div className="lightbar-container">
    <div className="top-buttons">
      <button className={`lightbar-btn ${lightBarOn ? "active" : ""}`}onClick={handleLightBarClick}>{lightBarOn ? "Light Bar On" : "Light Bar Off"}</button>
      <button className="lightbar-btn center-btn">Center Camera</button>
      <button className={`lightbar-btn ${disabled ? "active" : ""}`}onClick={handleDisabledClick}>{disabled ? "Movement Disabled" : "Movement Active"}</button>
    </div>
  </div>
);
};

export default Lightbar;


