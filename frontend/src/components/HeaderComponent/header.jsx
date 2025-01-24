import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./header.css";

const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookies.token;
  let isAdmin = false;

  if (token) {
    const decodedToken = jwtDecode(token);
    isAdmin = decodedToken.role === "admin";
  }

  const handleLogout = () => {
    removeCookie("token");
  };

  return (
    <header className="header">
      <nav className="header-navbar">
        <ul className="header-navbar-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          {!token ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <li>
              <Link to="/login" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
