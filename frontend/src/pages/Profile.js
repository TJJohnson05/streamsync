// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Profile.css";
import {
  fetchCurrentUser,
  fetchFavorites,
  fetchHistory,
} from "../services/api";
import { getUser } from "../utils/auth";
import StreamCard from "../components/StreamCard";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [historyCount, setHistoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      // fallback to whatever is stored client-side
      const localUser = getUser();

      try {
        // Try to get fresh user info from backend
        const data = await fetchCurrentUser(); // { user }
        if (!isMounted) return;
        setUser(data.user || localUser || null);
      } catch (err) {
        console.warn("Could not fetch /me, using local user:", err);
        if (!isMounted) return;
        setUser(localUser || null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function loadStats() {
      setStatsLoading(true);
      try {
        // Favorites
        const favData = await fetchFavorites().catch(() => ({ favorites: [] }));
        // History
        const histData = await fetchHistory().catch(() => ({ history: [] }));

        if (!isMounted) return;
        setFavorites(favData.favorites || []);
        setHistoryCount((histData.history || []).length);
      } catch (err) {
        if (!isMounted) return;
        console.warn("Profile stats error:", err);
        setError("Some profile stats could not be loaded.");
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    }

    loadProfile();
    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <p className="profile-error">
            We couldn&apos;t load your profile. Try logging out and back in.
          </p>
        </div>
      </div>
    );
  }

  const initials = (user.username || user.email || "?")
    .charAt(0)
    .toUpperCase();

  const memberSince =
    user.createdAt || user.created_at || user.joinedAt || null;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h1 className="profile-username">
              {user.username || "StreamSync User"}
            </h1>
            <p className="profile-email">{user.email}</p>
            {memberSince && (
              <p className="profile-meta">
                Member since:{" "}
                {new Date(memberSince).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        {error && <p className="profile-error">{error}</p>}

        <div className="profile-stats-row">
          <div className="profile-stat-card">
            <span className="stat-label">Streams watched</span>
            <span className="stat-value">
              {statsLoading ? "…" : historyCount}
            </span>
          </div>
          <div className="profile-stat-card">
            <span className="stat-label">Favorites</span>
            <span className="stat-value">
              {statsLoading ? "…" : favorites.length}
            </span>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="profile-section-title">Favorite Streams</h2>
          {statsLoading ? (
            <p>Loading favorites...</p>
          ) : favorites.length === 0 ? (
            <p className="profile-empty">
              You haven&apos;t favorited any streams yet.
            </p>
          ) : (
            <div className="profile-favorites-grid">
              {favorites.map((stream) => (
                <StreamCard
                  key={stream._id}
                  stream={{
                    _id: stream._id,
                    title: stream.title,
                    streamerName: stream.streamerName,
                    category: stream.category,
                    thumbnailUrl: stream.thumbnailUrl,
                    isLive: stream.isLive,
                    views: stream.views,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
