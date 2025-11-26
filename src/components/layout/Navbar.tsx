import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { ros, type RosStatus } from "../../ros/Connection/RosSingleton";
import "./Navbar.css";

export default function Navbar() {
  const links = [
    { to: "/planning", label: "Planning" },
    { to: "/waypoints", label: "Waypoints" },
    { to: "/movement", label: "Movement" },
    { to: "/video", label: "Video" },
    { to: "/status", label: "Status" },
    { to: "/arm", label: "Arm" },
    { to: "/settings", label: "Settings" }
  ];


 const [status, setStatus] = useState<RosStatus>("Not Connected");

   useEffect(() => {

  const updateStatus = (s: RosStatus) => setStatus(s);
  ros.onStatus = updateStatus;

  return () => {
    ros.onStatus = undefined;
  };
}, []);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="nav-connection">
          Status: {status}
        </div>
      </div>
    </nav>
  );
}

