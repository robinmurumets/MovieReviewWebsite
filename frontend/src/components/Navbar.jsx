import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfilePanel = () => {
    setIsProfilePanelOpen(!isProfilePanelOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie App</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/favorite" className="nav-link">Favorites</Link>
      </div>
      <button className="burger-menu" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={toggleMenu}>×</button>
        <Link to="/" className="side-menu-link" onClick={toggleMenu}>Home</Link>
        <Link to="/favorite" className="side-menu-link" onClick={toggleMenu}>Favorites</Link>
      </div>
      <div className="profile-container">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="profile-picture"
          onClick={toggleProfilePanel}
        />
      </div>
      <div className={`profile-panel ${isProfilePanelOpen ? "open" : ""}`}>
        <button className="close-profile" onClick={toggleProfilePanel}>×</button>
        <Link to="/profile" className="profile-panel-link" onClick={toggleProfilePanel}>Profile</Link>
        <Link to="/settings" className="profile-panel-link" onClick={toggleProfilePanel}>Settings</Link>
        <Link to="/logout" className="profile-panel-link" onClick={toggleProfilePanel}>Logout</Link>
      </div>
    </nav>
  );
}

export default Navbar;