// src/pages/History.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/History.css";
import StreamCard from "../components/StreamCard";
import { fetchHistory } from "../services/api"; // If you don't have this yet, see note below.

export default function History() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");

        // If your backend route is different, change fetchHistory() accordingly
        const data = await fetchHistory();
        const list = Array.isArray(data?.streams) ? data.streams : [];
        if (alive) setStreams(list);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load history");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="page">
      <Navbar />

      <div className="page-container">
        <div className="history-header">
          <h2 className="page-title">Watch History</h2>
          <p className="muted">
            Your recently viewed streams/videos (clears on sign-out).
          </p>
        </div>

        {loading && <p className="status">Loading…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && streams.length === 0 && (
          <div className="empty-card">
            <h3>No history yet</h3>
            <p className="muted">
              Watch a stream and it’ll show up here automatically.
            </p>
          </div>
        )}

        <div className="history-grid">
          {streams.map((s) => (
            <StreamCard key={s._id || s.id} stream={s} />
          ))}
        </div>
      </div>
    </div>
  );
}


