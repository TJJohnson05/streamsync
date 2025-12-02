// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, isLoggedIn, clearAuth } from '../utils/auth';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getUser();

  function handleLogout() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo192.png" alt="logo" className="navbar-logo" />
        <span className="navbar-title">StreamSync</span>
      </div>

      <div className="navbar-center">
        {/* search box etc */}
      </div>

      <div className="navbar-right">
        <Link to="/browse" className="nav-link">
          Browse
        </Link>
        {loggedIn ? (
          <>
            <Link to="/profile" className="nav-link">
              {user?.username || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
