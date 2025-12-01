import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
//layout
import Navbar from "./components/layout/Navbar";
import BottomBar from "./components/layout/BottomBar";
//pages
import PlanningPage from "./pages/Planning/PlanningPage";
import WaypointsPage from "./pages/Waypoints/WaypointsPage";
import MovementPage from "./pages/Movement/MovementPage";
import VideoPage from "./pages/Video/VideoPage";
import StatusPage from "./pages/Status/StatusPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import ArmPage from "./pages/Arm/ArmPage";
//Ros Components
import { ros, type RosStatus } from "./ros/Connection/RosSingleton";
import { type RobotInfo } from "./ros/Services/RobotInfoService";
import { GpsStatusTopic} from "./ros/Topics/GpsStatusTopic";
import { OrientationTopic , type OrientationMsg} from "./ros/Topics/OrientationTopic";
import { DauTopic , type DauStampedMsg} from "./ros/Topics/DauTopic";
import { WaypointStatusTopic, type WaypointStatusMsg } from "./ros/Topics/WaypointStatusTopic";

import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";


export default function App() {

  // Connection Status
  const [status, setStatus] = useState<RosStatus>("Not Connected");
  // Robot info
  const [robotInfo, setRobotInfo] = useState<RobotInfo | null>(null);
  // GPS Status
  const [gpsStatus, setGpsStatus] = useState<string>("--");
  // Orientation
  const [orientation, setOrientation] = useState<OrientationMsg | null>(null);
  // DAU Data
  const [dauData, setDauData] = useState<DauStampedMsg | null>(null);
  //Waypoint Status
  const [waypointStatus, setWaypointStatus] = useState<WaypointStatusMsg | null>(null);

  useEffect(() => {
    const updateStatus = (s: RosStatus) => setStatus(s);
    ros.onStatus = updateStatus;

    ros.subscribeRobotInfo(setRobotInfo);

    const gpsTopic = new GpsStatusTopic(ros.ros!);
    gpsTopic.subscribe(msg => setGpsStatus(msg.fix_type));

    const orientationTopic = new OrientationTopic(ros.ros!);
    orientationTopic.subscribe(setOrientation);

    const dauTopic = new DauTopic(ros.ros!);
    dauTopic.subscribe(setDauData);

    const waypointStatusTopic = new WaypointStatusTopic(ros.ros!);
    waypointStatusTopic.subscribe(setWaypointStatus);

    return () => {
      ros.onStatus = undefined;
      ros.unsubscribeRobotInfo();
      gpsTopic.unsubscribe();
      orientationTopic.unsubscribe();
      dauTopic.unsubscribe();
      waypointStatusTopic.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar status={status}/>

      <div className="app-background">
        <Routes>
          <Route path="/" element={<Navigate to="/planning" replace />} />

          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/waypoints" element={<WaypointsPage 
            robotInfo={robotInfo}
            waypointStatus={waypointStatus}/>} />
          <Route path="/movement" element={<MovementPage 
            robotInfo={robotInfo}/>} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/status" element={<StatusPage
            status={status}
            robotInfo={robotInfo}
            gpsStatus={gpsStatus}
            orientation={orientation}
            dauData={dauData}/>}/>
          <Route path="/arm" element={<ArmPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {}
          <Route path="*" element={<Navigate to="/planning" replace />} />
        </Routes>
      </div>

      <BottomBar
        status={status}
        robotInfo={robotInfo}
        gpsStatus={gpsStatus}
        onRecordVideo={() => console.log("Record Video clicked")}
        onRecordLidar={() => console.log("Record LiDAR clicked")}
      />
       
    </BrowserRouter>
  );
}

