// src/pages/Home.js
import React, { useEffect, useMemo, useState } from "react";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import StreamCard from "../components/StreamCard";
import { fetchRecommendedStreams } from "../services/api";

export default function Home() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchRecommendedStreams();
        const list = Array.isArray(data?.streams) ? data.streams : [];
        if (alive) setStreams(list);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load streams");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    for (const s of streams) {
      if (s?.category) set.add(s.category);
    }
    return Array.from(set).slice(0, 10);
  }, [streams]);

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-content">
        <section className="home-section">
          <h2 className="home-h2">Featured Streams</h2>

          {loading && <p className="home-status">Loading…</p>}
          {error && <p className="home-error">{error}</p>}

          {!loading && !error && streams.length === 0 && (
            <p className="home-status">No recommended streams yet.</p>
          )}

          <div className="home-stream-grid">
            {streams.map((s) => (
              <StreamCard key={s._id || s.id} stream={s} />
            ))}
          </div>
        </section>

        <section className="home-section">
          <h2 className="home-h2">Popular Categories</h2>

          {categories.length === 0 ? (
            <p className="home-status">Categories will appear once streams load.</p>
          ) : (
            <div className="home-category-row">
              {categories.map((c) => (
                <span key={c} className="home-category-pill">
                  {c}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


