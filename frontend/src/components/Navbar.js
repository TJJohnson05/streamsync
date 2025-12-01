import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.svg'; // optional — replace or remove if you don’t have one

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/search/${encodeURIComponent(trimmed)}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="navbar">
      {/* LEFT SECTION */}
      <div className="navbar-left">
        {logo && <img src={logo} alt="Logo" className="navbar-logo" />}
        <span className="navbar-title">StreamSync</span>
        <Link to="/browse" className="nav-link">Browse</Link>
        <Link to="/watch/1" className="nav-link">Watch</Link>
      </div>

      {/* CENTER SECTION */}
      <div className="navbar-center">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="navbar-search"
            placeholder="Search streams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* RIGHT SECTION */}
      <div className="navbar-right">
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Sign Up</Link>
        <div className="navbar-avatar">T</div> {/* Example avatar (replace later with user initials or profile pic) */}
      </div>
    </nav>
  );
}


