import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/auth/signup", {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      navigate("/login");
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSignup} className="auth-form">
        <h2 className="auth-form-title">Signup</h2>

        <div className="auth-form-article">
          <label>Username :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="auth-form-article">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-form-article">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Signup</button>
        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
};

export default SignupPage;
