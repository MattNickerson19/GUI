import React from "react";
import "./UserAlert.css";

interface UserAlertProps {
  message: string;
  onClose: () => void;
}

const UserAlert: React.FC<UserAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="ua-overlay">
      <div className="ua-modal">
        <p className="ua-message">{message}</p>

        <button className="ua-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default UserAlert;
