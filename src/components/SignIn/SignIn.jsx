import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/Auth";
import { axiosInstance } from "../../utility/axios";
import "./SignIn.css";

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
      const response = await axiosInstance.post("/api/user/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.token) {
        // Successful login
        await login(response.data.token);
        setMessage(response.data.msg || "Login successful!");
        setError("");
        setFormData({ username: "", password: "" });
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg);
      } else {
        setError("An error occurred. Please try again.");
      }
      setMessage("");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="signin-container">
      <h2 className="signin-title">Sign In</h2>
      <form onSubmit={handleSubmit} className="signin-form">
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
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <button type="submit" className="signin-button" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Sign In"}
        </button>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </form>
      <p className="signup-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default SignIn;
