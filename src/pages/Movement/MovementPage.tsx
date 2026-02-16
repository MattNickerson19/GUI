import { useState, useMemo } from "react";
import JanusVideo from "../../components/Movement/JanusVideo";
import MiniMap from "../../components/Movement/MiniMap";
import Joystick from "../../components/Movement/Joystick";
import Lightbar from "../../components/Movement/Lightbar";
import { LightbarService } from "../../ros/Services/LightbarService";
import { type RobotInfo } from "../../ros/Services/RobotInfoService";
import * as ROSLIB from "roslib";
import RobotOrientation3D from "../../components/Orientation/RobotOrientation3D";
import { type OrientationMsg} from "../../ros/Topics/OrientationTopic";

import "./MovementPage.css";

interface MovementPageProps {
  robotInfo: RobotInfo | null;
  ros: ROSLIB.Ros;
  orientation: OrientationMsg | null;
}

const MovementPage = ({ robotInfo, ros, orientation}: MovementPageProps) => {
  const [joystickDisabled, setJoystickDisabled] = useState(true);

  const lightbarService = useMemo(() => new LightbarService(ros), [ros]);

  return (
    <div className="movement-page">
      <div className="pane pane-left">
        <JanusVideo />
      </div>

      <div className="pane pane-right-stack">
      {/* Top row: MiniMap + Orientation */}
      <div className="pane-top-row">
        <div className="pane pane-minimap">
          <MiniMap
            lat={robotInfo?.fix?.latitude}
            lon={robotInfo?.fix?.longitude}
          />
        </div>

        <div className="pane pane-orientation">
          <RobotOrientation3D orientation={orientation} />
        </div>
      </div>
        
        <div className="pane pane-controls">
          {lightbarService && (
            <Lightbar
              initialDisabled={true}
              lightbarService={lightbarService}
              onToggleDisabled={(isDisabled) => {setJoystickDisabled(isDisabled);}}
            />
          )}

          <Joystick disabled={joystickDisabled} />
        </div>
      </div>
    </div>
  );
};

export default MovementPage;




