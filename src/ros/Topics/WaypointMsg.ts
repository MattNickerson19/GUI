export type WaypointMsg = {
  header: {
    stamp: { sec: number; nanosec: number };
    frame_id: string;
  };
  type: number;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  utm_zone: number;
  heading: number;
  speed_limit: number;
  action: string;
};
