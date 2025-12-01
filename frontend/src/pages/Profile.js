import React, { useState } from 'react';
import '../styles/Profile.css';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Full-stack developer & streamer. Building StreamSync live!');
  const [banner, setBanner] = useState('https://placehold.co/1200x300/3a0ca3/ffffff?text=Profile+Banner');

  const user = {
    username: 'TylerDev',
    profilePic: 'https://placehold.co/120x120/8244ff/ffffff?text=T',
    followers: 1024,
    following: 50,
  };

  const streams = [
    {
      id: 1,
      title: 'Live Coding: StreamSync Dashboard',
      thumbnail: 'https://placehold.co/400x225/9333ea/ffffff?text=Live+Now',
      viewers: 210,
    },
    {
      id: 2,
      title: 'Building React Components',
      thumbnail: 'https://placehold.co/400x225/4f46e5/ffffff?text=Past+Stream',
      viewers: 0,
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated! (In a real app, this would save to the database.)');
  };

  return (
    <div className="profile-page">
      <div className="profile-banner">
        <img src={banner} alt="Profile banner" />
      </div>

      <div className="profile-info">
        <img src={user.profilePic} alt="Profile" className="profile-pic" />
        <div className="profile-details">
          <h2>{user.username}</h2>
          <p className="bio">{bio}</p>
          <div className="stats">
            <span>{user.followers} Followers</span> • <span>{user.following} Following</span>
          </div>
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      </div>

      <div className="stream-section">
        <h3>Streams</h3>
        <div className="stream-grid">
          {streams.map((stream) => (
            <Link key={stream.id} to={`/watch/${stream.id}`} className="stream-card">
              <img src={stream.thumbnail} alt={stream.title} />
              <div className="stream-info">
                <h4>{stream.title}</h4>
                {stream.viewers > 0 && (
                  <p className="live-tag">{stream.viewers} watching</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>
            <label>Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              placeholder="Enter your bio..."
            />

            <label>Banner Image URL:</label>
            <input
              type="text"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="Paste new banner image link..."
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


