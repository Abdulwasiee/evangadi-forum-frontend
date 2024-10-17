import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/Auth";
import "./register.css";
import { axiosInstance } from "../../utility/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    firstname: "",
    lastname: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner
    try {
      const response = await axiosInstance.post("/api/user/register", formData);

      localStorage.removeItem("authToken");

      localStorage.setItem("authToken", `Bearer ${response.data.token}`);
      await login(response.data.token);
      setMessage(response.data.msg);
      setError("");
      setFormData({
        email: "",
        username: "",
        password: "",
        firstname: "",
        lastname: "",
      });

      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg || "Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
      setMessage("");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Join the Network</h2>
      <p>
        Already have an account? <Link to="/signIn">Sign In</Link>
      </p>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-input">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="fullName">
          <div className="form-input">
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Enter your first name"
              value={formData.firstname}
              onChange={handleChange}
            />
          </div>
          <div className="form-input">
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Enter your last name"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-input">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-input password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Register"}
        </button>
        <br />
        <br />
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </form>
      <p className="terms-privacy-links">
        I agree with <a href="/privacy">privacy policies</a> and{" "}
        <a href="/terms">terms of service</a>
      </p>
      <p>
        <Link to="/signIn">Already have an account?</Link>
      </p>
    </div>
  );
};

export default Register;
