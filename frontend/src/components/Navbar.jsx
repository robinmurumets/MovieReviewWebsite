import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, logout } = useMovieContext();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={refreshPage}>
          <img
            src="/src/assets/filmify.png"
            width={75}
            alt="Filmify Logo"
            className="navbar-logo"
          />
        </Link>
      </div>
      {token ? (
        <>
          <button className="burger-menu" onClick={toggleMenu}>
            ☰
          </button>
          <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
            <button className="close-menu" onClick={toggleMenu}>
              ×
            </button>
            <Link to="/favorite" className="side-menu-link" onClick={toggleMenu}>
              Favorites
            </Link>
            <Link to="/profile" className="side-menu-link" onClick={toggleMenu}>
              Profile
            </Link>
            <Link to="/settings" className="side-menu-link" onClick={toggleMenu}>
              Settings
            </Link>
            <button className="side-menu-link" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <button className="burger-menu" onClick={toggleMenu}>
            ☰
          </button>
          <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
            <button className="close-menu" onClick={toggleMenu}>
              ×
            </button>
            <Link to="/auth" className="side-menu-link" onClick={toggleMenu}>
              Login/Register
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;