import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchStreamById,
  addHistoryEntry,
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "../services/api";
import "../styles/WatchStream.css"; // if you have a style file
import { addToHistory } from '../utils/history';

export default function WatchStream() {
  const { id } = useParams(); // /watch/:id
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favBusy, setFavBusy] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadStream() {
      setLoading(true);
      setError("");

      try {
        // 1) Load stream data
        const data = await fetchStreamById(id); // { stream }
        if (!isMounted) return;

        const loadedStream = data.stream;
        setStream(loadedStream);

        // 2) Add to history (MAIN THING YOU WANTED)
        // we don't really care if it fails, so we don't block UI on it
        addHistoryEntry(loadedStream._id).catch((err) => {
          console.error("Failed to add history entry:", err);
        });

        // 3) OPTIONAL: check if it's already in favorites
        try {
          const favData = await fetchFavorites(); // { favorites: [...] }
          if (!isMounted) return;

          const alreadyFav = (favData.favorites || []).some(
            (fav) => fav._id === loadedStream._id
          );
          setIsFavorite(alreadyFav);
        } catch (favErr) {
          // Not critical; we can ignore favorites errors silently
          console.warn("Could not fetch favorites:", favErr);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load stream.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) {
      loadStream();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleToggleFavorite() {
    if (!stream || favBusy) return;
    setFavBusy(true);

    try {
      if (isFavorite) {
        await removeFavorite(stream._id);
        setIsFavorite(false);
      } else {
        await addFavorite(stream._id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setFavBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="watch-page">
        <p>Loading stream...</p>
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="watch-page">
        <p className="watch-error">{error || "Stream not found."}</p>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <div className="watch-main">
        {/* Fake video player area */}
        <div className="watch-video-container">
          <div className="watch-video-placeholder">
            {/* In a real app, this would be a video player/iframe */}
            <p>Now watching:</p>
            <h2>{stream.title}</h2>
          </div>
        </div>

        <div className="watch-info">
          <div className="watch-title-row">
            <h1 className="watch-title">{stream.title}</h1>
            <button
              className={`watch-favorite-btn ${
                isFavorite ? "watch-favorite-btn--active" : ""
              }`}
              onClick={handleToggleFavorite}
              disabled={favBusy}
            >
              {isFavorite ? "♥ Favorited" : "♡ Favorite"}
            </button>
          </div>

          <p className="watch-streamer">{stream.streamerName}</p>

          <div className="watch-meta">
            {stream.category && (
              <span className="watch-category">{stream.category}</span>
            )}
            {typeof stream.views === "number" && (
              <span className="watch-views">
                {stream.views.toLocaleString()} views
              </span>
            )}
          </div>

          {stream.description && (
            <p className="watch-description">{stream.description}</p>
          )}
        </div>
      </div>

      {/* You can add chat on the side here if you want */}
      {/* <ChatBox streamId={stream._id} /> */}
    </div>
  );
}
