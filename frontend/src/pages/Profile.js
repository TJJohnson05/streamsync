import React from 'react';
import '../styles/Profile.css';
import Navbar from '../components/Navbar';
import { getUser } from '../utils/auth';

export default function Profile() {
  const authUser = getUser();

  const username = authUser?.username || 'Unknown User';
  const email = authUser?.email || 'unknown@example.com';
  const avatarLetter = (authUser?.username?.[0] || 'U').toUpperCase();

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-layout">
        <div className="profile-main">
          <div className="profile-card">
            <div className="profile-avatar-circle">
              {avatarLetter}
            </div>

            <h2 className="profile-username">{username}</h2>
            <p className="profile-email">{email}</p>

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">0</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-number">0</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            <div className="profile-actions">
              <button className="primary-btn">Edit Profile</button>
              <button className="secondary-btn">Go Live</button>
            </div>
          </div>
        </div>

        <div className="profile-side">
          <div className="profile-panel">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/browse">Browse Streams</a></li>
              <li><a href="/home">Back to Home</a></li>
            </ul>
          </div>

          <div className="profile-panel">
            <h3>About</h3>
            <p>
              This is your StreamSync profile. In the future, this can show your bio,
              recent streams, and panels, similar to a Twitch channel page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

