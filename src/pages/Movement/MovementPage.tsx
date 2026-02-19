import { useState, useMemo } from "react";

import JanusVideo from "../../components/Movement/JanusVideo";
import MiniMap from "../../components/Movement/MiniMap";
import { type RobotInfo } from "../../ros/Services/RobotInfoService";
import * as ROSLIB from "roslib";
import ArtificialHorizon from "../../components/Orientation/ArtificalHorizon";
import { type OrientationMsg } from "../../ros/Topics/OrientationTopic";
import { LightbarService } from "../../ros/Services/LightbarService";
import { OdomMetricsReset } from "../../ros/Services/OdomMetricsReset";


import "./MovementPage.css";
import type { ForwardDistanceMsg } from "../../ros/Topics/OdomMetricsTopic";

interface MovementPageProps {
  robotInfo: RobotInfo | null;
  ros: ROSLIB.Ros;
  orientation: OrientationMsg | null;
  forwardDistance: ForwardDistanceMsg | null;
}

const MovementPage = ({ robotInfo, orientation, ros, forwardDistance }: MovementPageProps) => {


    const lightbarService = useMemo(() => new LightbarService(ros), [ros]);

    const odomMetricsService = useMemo(
      () => new OdomMetricsReset(ros),
      [ros]
    );

    const [resetting, setResetting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState(false);

    const handleResetTrip = async () => {
        if (resetting) return;

        setResetting(true);
        setResetSuccess(false);
        setResetError(false);

        try {
          await odomMetricsService.call();

          setResetSuccess(true);
        } catch (error) {
          console.error("Trip reset failed:", error);
          setResetError(true);
        } finally {
          // Always recover UI state
          setTimeout(() => {
            setResetSuccess(false);
            setResetError(false);
            setResetting(false);
          }, 1500);
        }
      };


    
    const [lightBarOn, setLightBarOn] = useState(false);

    const handleLightBarClick = async () => {
      const newState = !lightBarOn;

      try {
        const result = await lightbarService.call(newState ? 1 : 0);

        console.log("Lightbar service result:", result);
        setLightBarOn(newState);

      } catch (error) {
        console.error("Lightbar service error:", error);
      }
    };

    const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };

    return (
    <div className="movement-page">
    
        <div className="movement-top">
          <div className="pane pane-left">
            <JanusVideo />
          </div>

          <div className="pane-right-stack">
            <div className="pane pane-top-half">
              <MiniMap
                lat={robotInfo?.fix?.latitude}
                lon={robotInfo?.fix?.longitude}
              />
            </div>

            <div className="pane-top-row">
              <div className="pane pane-orientation">
                <div className="orientation-corner pitch-corner">
                  Pitch: {orientation?.y.toFixed(1) ?? 0}°
                </div>
                <div className="orientation-corner roll-corner">
                  Roll: {orientation?.x.toFixed(1) ?? 0}°
                </div>
                <ArtificialHorizon
                  pitch={orientation?.y ?? 0}
                  roll={orientation?.x ?? 0}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pane pane-bottom">
          <div className="control-buttons">
            <button className={`mvmt-btn ${lightBarOn ? "active" : ""}`} onClick={handleLightBarClick}>
              Light Bar
            </button>

            <button
              className={`mvmt-btn ${
                resetSuccess
                  ? "success"
                  : resetError
                  ? "error"
                  : ""
              }`}
              onClick={handleResetTrip}
              disabled={resetting}
            >
              {resetSuccess
                ? "Reset ✓"
                : resetError
                ? "Failed ✕"
                : resetting
                ? "Resetting..."
                : "Reset Trip"}
            </button>

          </div>

          <div className="trip-display">
            <span className="trip-label">Trip Distance:</span>
            <span className="trip-value">{formatDistance(forwardDistance?.data ?? 0)}</span>
          </div>
        </div>
  </div>
  );
};

export default MovementPage;
