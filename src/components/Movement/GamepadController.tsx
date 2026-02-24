import { useEffect, useMemo, useRef } from "react";
import * as ROSLIB from "roslib";
import { AxisTopics } from "../../ros/Topics/AxisTopics";
import { UfactoryArmTopic, type ControllerPollMsg } from "../../ros/Topics/UfactoryArmTopic";

interface GamepadControllerProps {
  ros: ROSLIB.Ros;
  onConnectionChange: (connected: boolean) => void;
}

const GamepadController = ({ ros, onConnectionChange }: GamepadControllerProps) => {
  const gpIndex = useRef<number | null>(null);

  // Robot control state
  const enabled = useRef(false);
  const eStop = useRef(false);
  const cmdLin = useRef(0);
  const cmdAng = useRef(0);
  const lastT = useRef(performance.now());

  // Camera PTZ
  const MAX_PAN = 100;
  const MAX_TILT = 100;
  const lastZoom = useRef<number | null>(null);
  const zoomLevel = useRef(0);
  const ZOOM_STEP = 50;
  const presetActive = useRef(false);
  const lastLeftStickPressed = useRef(false);

  // Arm control
  const joystick_z = useRef(0);
  const joystick_yaw = useRef(0);
  const gripper_normalized = useRef(0);

  // Mode toggle
  const mode = useRef<'robot' | 'arm'>('robot');
  const lastToggleButtonPressed = useRef(false);



  const axisTopics = useMemo(() => 
    new AxisTopics(ros, "http://192.168.10.90", "root", "GLIMRbot_7914"), 
  [ros]
);

 const armTopics = useMemo(() => new UfactoryArmTopic(ros), [ros]);


  useEffect(() => {
    if (!ros) return;

    const tabletVelTopic = new ROSLIB.Topic({
      ros,
      name: "/tablet_vel",
      messageType: "geometry_msgs/msg/Twist",
    });


    const RATE_HZ = 30;
    const DEADBAND = 0.08;
    const EXPO = 1.6;
    const MAX_LIN = 1.0;
    const MAX_ANG = 1.5;
    const SLEW_LIN = 2.0;
    const SLEW_ANG = 4.0;

    function deadband(x: number, db: number) {
      if (Math.abs(x) < db) return 0;
      const s = Math.sign(x);
      const a = (Math.abs(x) - db) / (1 - db);
      return s * Math.min(1, a);
    }

    function expo(x: number, e: number) {
      const s = Math.sign(x);
      return s * Math.pow(Math.abs(x), e);
    }

    function slew(current: number, target: number, maxDelta: number) {
      const d = target - current;
      if (Math.abs(d) <= maxDelta) return target;
      return current + Math.sign(d) * maxDelta;
    }

    function publishTwist(lin: number, ang: number) {
        tabletVelTopic.publish({
            linear:  { x: lin, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: ang },
        });
        }


    const onGamepadConnected = (e: GamepadEvent) => {
      gpIndex.current = e.gamepad.index;
      console.log("Gamepad connected:", e.gamepad.id);
      onConnectionChange(true);
    };

    const onGamepadDisconnected = (e: GamepadEvent) => {
        if (gpIndex.current === e.gamepad.index) {
            gpIndex.current = null;
            onConnectionChange(false);
        }
        enabled.current = false;
        eStop.current = false;
        publishTwist(0, 0);
        };

    const onWindowBlur = () => {
      enabled.current = false;
      eStop.current = false;
      publishTwist(0, 0);
    };

    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);
    window.addEventListener("blur", onWindowBlur);

    const interval = setInterval(() => {
      const now = performance.now();
      const dt = Math.max(0.001, (now - lastT.current) / 1000);
      lastT.current = now;

      if (gpIndex.current === null) return;
      const gp = navigator.getGamepads()[gpIndex.current];
      if (!gp) return;

      // --- Mode toggle ---
      const optionsPressed = gp.buttons[9]?.pressed;
      if (optionsPressed && !lastToggleButtonPressed.current) {
        mode.current = mode.current === 'robot' ? 'arm' : 'robot';
        console.log("Switched mode to", mode.current);
      }
      lastToggleButtonPressed.current = optionsPressed;

      // --- Robot & camera mode ---
      if (mode.current === 'robot') {
        const L1 = gp.buttons[4]?.pressed; // L1 for enabling movement
        const B = gp.buttons[1]?.pressed;  // Circle for eStop
        const A = gp.buttons[0]?.pressed;  // Cross for clear eStop

        enabled.current = !!L1;
        if (B) eStop.current = true;
        if (A) eStop.current = false;

        // Linear/angular
        let rawLin = -gp.axes[3];
        let rawAng = gp.axes[2];
        rawLin = expo(deadband(rawLin, DEADBAND), EXPO);
        rawAng = expo(deadband(rawAng, DEADBAND), EXPO);
        let targetLin = rawLin * MAX_LIN;
        let targetAng = rawAng * MAX_ANG;
        if (!enabled.current || eStop.current) {
          targetLin = 0;
          targetAng = 0;
        }
        cmdLin.current = slew(cmdLin.current, targetLin, SLEW_LIN * dt);
        cmdAng.current = slew(cmdAng.current, targetAng, SLEW_ANG * dt);
        publishTwist(cmdLin.current, cmdAng.current);

        // PTZ
        let rawPan = gp.axes[0];
        let rawTilt = -gp.axes[1];

        rawPan = expo(deadband(rawPan, DEADBAND), EXPO);
        rawTilt = expo(deadband(rawTilt, DEADBAND), EXPO);

        const panStr = String(Math.round(rawPan * MAX_PAN));
        const tiltStr = String(Math.round(rawTilt * MAX_TILT));

        const dpadUp = gp.buttons[12]?.pressed;
        const dpadDown = gp.buttons[13]?.pressed;
        const leftStickPressed = gp.buttons[10]?.pressed;

        // Zoom
        if (dpadUp) zoomLevel.current += ZOOM_STEP;
        if (dpadDown) zoomLevel.current -= ZOOM_STEP;
        if (zoomLevel.current !== lastZoom.current) {
          axisTopics.publishZoom(zoomLevel.current);
          lastZoom.current = zoomLevel.current;
        }

        if (leftStickPressed && !lastLeftStickPressed.current) {
          presetActive.current = true;     
          axisTopics.goHomePreset();        

          setTimeout(() => {
              presetActive.current = false;
          }, 7000);
      }
    
      if (!presetActive.current) {
          axisTopics.publishPanTilt(panStr, tiltStr);
      }

      lastLeftStickPressed.current = leftStickPressed;

        // --- Arm mode ---
    }else if (mode.current === 'arm') {
          const axes = gp.axes.map(a => Number(a.toFixed(2)));
          const buttons = gp.buttons.map(b => b.pressed);

          // Map axes/buttons to arm message
          const controllerPollMsg: ControllerPollMsg = {
            x_normalized: Math.abs(axes[1]) > DEADBAND ? -axes[1] : 0.0,
            y_normalized: Math.abs(axes[0]) > DEADBAND ? axes[0] : 0.0,
            z_normalized: joystick_z.current,
            pitch_normalized: Math.abs(axes[3]) > DEADBAND ? -axes[3] : 0.0,
            roll_normalized: Math.abs(axes[2]) > DEADBAND ? axes[2] : 0.0,
            yaw_normalized: joystick_yaw.current,
          };
          armTopics.publishControllerPoll(controllerPollMsg);

          // Gripper control
          if (buttons[4]) gripper_normalized.current -= 1.0; // L1
          if (buttons[5]) gripper_normalized.current += 1.0; // R1
          if (gripper_normalized.current !== 0.0) {
            armTopics.publishGripperCommand(gripper_normalized.current);
          }

          // Enable arm
          if (buttons[9]) armTopics.publishEnableArm(); // Options button
        }
    }, 1000 / RATE_HZ);
    return () => {
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      window.removeEventListener("blur", onWindowBlur);
      clearInterval(interval);
      publishTwist(0, 0);
    };
  }, [ros]);

  return null; // this component doesn’t render anything
};

export default GamepadController;
