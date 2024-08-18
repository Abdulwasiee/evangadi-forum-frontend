import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import logo from "../../assets/evangadi-logo-black.png";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <section className="all-container">
        <section className="media-icon">
          <div className="logo-container">
            <img src={logo} alt="Evangadi Logo" className="footer-logo" />
          </div>
          <ul className="icon-container">
            <li>
              <a href="https://facebook.com" aria-label="Facebook">
                <FaFacebook className="social-icon" />
              </a>
            </li>
            <li>
              <a href="https://youtube.com" aria-label="YouTube">
                <FaYoutube className="social-icon" />
              </a>
            </li>
            <li>
              <a href="https://instagram.com" aria-label="Instagram">
                <FaInstagram className="social-icon" />
              </a>
            </li>
          </ul>
        </section>
        <section className="links">
          <div className="section-title">Useful Links</div>
          <ul>
            <li>
              <a href="/">How it Works</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
          </ul>
        </section>
        <section className="contact">
          <div className="section-title">Contact Info</div>
          <ul>
            <li>Evangadi Networks</li>
            <li>
              <a href="mailto:support@evangadi.com">support@evangadi.com</a>
            </li>
            <li>
              <a href="tel:+12023062702">+1-202-306-2702</a>
            </li>
          </ul>
        </section>
      </section>
    </footer>
  );
}

export default Footer;
