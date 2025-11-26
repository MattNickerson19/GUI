import React from "react";

const SpeedMovement: React.FC = () => {
  return (
    <div style={{
      width: "150px",
      height: "50px",
      backgroundColor: "#999",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "0.9rem"
    }}>
      <div>Speed: 0</div>
      <div>Movement: N/A</div>
    </div>
  );
};

export default SpeedMovement;

