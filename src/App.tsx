import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import BottomBar from "./components/layout/BottomBar";

import PlanningPage from "./pages/Planning/PlanningPage";
import WaypointsPage from "./pages/Waypoints/WaypointsPage";
import MovementPage from "./pages/Movement/MovementPage";
import VideoPage from "./pages/Video/VideoPage";
import StatusPage from "./pages/Status/StatusPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import ArmPage from "./pages/Arm/ArmPage";

import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="app-background">
        <Routes>
          <Route path="/" element={<Navigate to="/planning" replace />} />

          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/waypoints" element={<WaypointsPage />} />
          <Route path="/movement" element={<MovementPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/arm" element={<ArmPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {}
          <Route path="*" element={<Navigate to="/planning" replace />} />
        </Routes>
      </div>

      <BottomBar
        onRecordVideo={() => console.log("Record Video clicked")}
        onRecordLidar={() => console.log("Record LiDAR clicked")}
        gpsStatus="-"
        lat="-"
        lng="-"
        batteryV="-"
        batteryPercent="-"
      />
       
    </BrowserRouter>
  );
}

