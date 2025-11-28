import { NavLink } from "react-router-dom";
import { type RosStatus } from "../../ros/Connection/RosSingleton";
import Logo from "../../assets/Logos/Compusult_Logo_White.png";

import "./Navbar.css";

interface NavbarProps {
  status: RosStatus;
}

export default function Navbar({ status }: NavbarProps) {
  const links = [
    { to: "/planning", label: "Planning" },
    { to: "/waypoints", label: "Waypoints" },
    { to: "/movement", label: "Movement" },
    { to: "/video", label: "Video" },
    { to: "/status", label: "Status" },
    { to: "/arm", label: "Arm" },
    { to: "/settings", label: "Settings" }
  ];

  return (
   <nav className={`navbar ${
      status === "Connected" ? "status-connected" :
      status === "Connecting..." ? "status-connecting" :
      status === "Connection Failed" ? "status-connection-failed" :
      "status-not-connected"
}`}>
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
        <div className="nav-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="nav-connection">
          Status: {status}
        </div>
      </div>
    </nav>
  );
}

