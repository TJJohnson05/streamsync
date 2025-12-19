// src/pages/Browse.js
import React, { useEffect, useMemo, useState } from "react";
import "../styles/Browse.css";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import StreamCard from "../components/StreamCard";
import { fetchRecommendedStreams, searchStreams } from "../services/api";

export default function Browse() {
  const location = useLocation();

  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("q") || "").trim();
  }, [location.search]);

  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const data = query
          ? await searchStreams(query)
          : await fetchRecommendedStreams();

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
  }, [query]);

  return (
    <div className="browse-page">
      <Navbar />

      <div className="browse-container">
        <h2 className="browse-title">
          {query ? `Results for "${query}"` : "Browse Live Streams"}
        </h2>

        {loading && <p className="browse-status">Loading…</p>}
        {error && <p className="browse-error">{error}</p>}

        {!loading && !error && streams.length === 0 && (
          <p className="browse-status">
            No streams found{query ? " for that search." : " right now."}
          </p>
        )}

        <div className="browse-stream-grid">
          {streams.map((s) => (
            <StreamCard key={s._id || s.id} stream={s} />
          ))}
        </div>
      </div>
    </div>
  );
}


