import {useState } from "react";
import JanusVideo from "../../components/Movement/JanusVideo";
import MiniMap from "../../components/Movement/MiniMap";
import Joystick from "../../components/Movement/Joystick";
import Lightbar from "../../components/Movement/Lightbar";
import { type RobotInfo } from "../../ros/Services/RobotInfoService";

import "./MovementPage.css";

interface MovementPageProps {
  robotInfo: RobotInfo | null;
}

const MovementPage = ({robotInfo}: MovementPageProps) => {
  const [joystickDisabled, setJoystickDisabled] = useState(true); // default Disabled on

  const currentLat = robotInfo?.fix?.latitude;
  const currentLon = robotInfo?.fix?.longitude;


  return (
    <div className="movement-page">
 
      <div className="pane pane-left">
        <JanusVideo />
      </div>

      <div className="pane pane-right-stack">
        <div className="pane pane-minimap">
          <MiniMap lat={currentLat} lon={currentLon}/>
        </div>

        <div className="pane pane-controls">
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
      </div>
    </div>
  );
  };

export default MovementPage;



