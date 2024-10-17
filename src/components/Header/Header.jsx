import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth/Auth";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/evangadi-logo-black.png";
import "./Header.css";

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [menuActive, setMenuActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Control modal visibility

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleResize = () => {
    const mobileView = window.innerWidth <= 800;
    setIsMobile(mobileView);
    if (!mobileView) {
      setMenuActive(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true); // Show the modal on logout click
  };

  const confirmLogout = () => {
    setShowLogoutModal(false); // Close the modal
    logout(); // Call logout after confirmation
  };

  const cancelLogout = () => {
    setShowLogoutModal(false); // Close the modal without logging out
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="header-container">
      <section className="nav-container">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div
          className={`burger-menu ${menuActive ? "hide" : ""}`}
          onClick={toggleMenu}
        >
          <FaBars />
        </div>
        <div
          className={`close-menu ${menuActive ? "show" : ""}`}
          onClick={toggleMenu}
        >
          <FaTimes />
        </div>
        <ul className={`list-container ${menuActive ? "active" : "hide"}`}>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li className="dropdown">
            <Link to="/">How it Works</Link>
            <ul className="dropdown-content">
              <li>
                <Link to="/home">Overview</Link>
              </li>
              <li>
                <Link to="/home">Features</Link>
              </li>
              <li>
                <Link to="/home">Pricing</Link>
              </li>
            </ul>
          </li>
          {isAuthenticated ? (
            <li>
              <button className="logout-button" onClick={handleLogoutClick}>
                Log Out
              </button>
            </li>
          ) : (
            <li>
              <Link to="/signIn">Sign In</Link>
            </li>
          )}
        </ul>
      </section>

      {/* Modal for logout confirmation */}
      {showLogoutModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to log out?</p>
            <button onClick={confirmLogout} className="confirm-btn">
              Yes
            </button>
            <button onClick={cancelLogout} className="cancel-btn">
              No
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
