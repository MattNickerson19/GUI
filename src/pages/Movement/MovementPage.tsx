import  { useState } from "react";
import JanusVideo from "../../components/Movement/JanusVideo";
import MiniMap from "../../components/Movement/MiniMap";
import Joystick from "../../components/Movement/Joystick";
import Lightbar from "../../components/Movement/Lightbar";

import "./MovementPage.css";

const MovementPage = () => {
  const [joystickDisabled, setJoystickDisabled] = useState(true); // default Disabled on

  return (
    <div className="movement-page">
      <div className="pane pane-left">
        <JanusVideo />
      </div>

      <div className="pane pane-center">
        <Lightbar
          initialDisabled={true}
          onToggleDisabled={(isDisabled) => {
            setJoystickDisabled(isDisabled);
            console.log(isDisabled ? "Movement Disabled" : "Movement Active");
          }}
          onToggleLightBar={(isOn) => {
            console.log(isOn ? "Light Bar On" : "Light Bar Off");
          }}
  />
        <Joystick disabled={joystickDisabled} />
      </div>

      <div className="pane pane-right">
        <MiniMap />
      </div>
    </div>
  );
};

export default MovementPage;



