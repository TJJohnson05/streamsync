// src/components/Navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { getUser, isLoggedIn, clearAuth } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getUser();
  const [searchTerm, setSearchTerm] = useState("");

  function handleLogout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  function handleLogoClick() {
    navigate("/home");
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/browse?q=${encodeURIComponent(q)}`);
    } else {
      navigate("/browse");
    }
  }

  return (
    <nav className="navbar">
      <div
        className="navbar-left"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <img src="/logo192.png" alt="StreamSync logo" className="navbar-logo" />
        <span className="navbar-title">StreamSync</span>
      </div>

      <div className="navbar-center">
        <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
          <input
            className="navbar-search"
            placeholder="Search streams, games, or creators"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="navbar-search-btn" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="navbar-right">
        {loggedIn && (
          <Link to="/history" className="nav-link">
            History
          </Link>
        )}

        <Link to="/browse" className="nav-link">
          Browse
        </Link>

        {/* Only show DMs if logged in */}
        {loggedIn && (
          <Link to="/dm" className="nav-link">
            DMs
          </Link>
        )}

        {loggedIn ? (
          <>
            <Link to="/profile" className="nav-link">
              {user?.username || "Profile"}
            </Link>
            <button
              onClick={handleLogout}
              className="nav-link"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Log In
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

