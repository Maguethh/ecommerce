import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.token) {
        const token = response.data.token;
        document.cookie = `token=${token}; path=/`;

        const decoded = jwtDecode(token);

        navigate("/");
      } else {
        setMessage("Login failed");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred");
      }
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2 className="auth-form-title">Login</h2>
        <div className="auth-form-article">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-form-article">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <p className="auth-modal-signup-text">
          Don't have an account ?{" "}
          <Link to="/signup" className="auth-modal-signup-italic">
            sign up
          </Link>
        </p>
        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
