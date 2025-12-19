// src/components/StreamCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StreamCard.css";
import { streamPlaceholderThumbnail } from "../utils/placeholders";

export default function StreamCard({ stream }) {
  const navigate = useNavigate();
  if (!stream) return null;

  const {
    _id,
    id,
    title,
    streamerName,
    category,
    thumbnailUrl,
    isLive,
    views,
  } = stream;

  const streamId = _id || id;

  function handleClick() {
    if (streamId) navigate(`/watch/${streamId}`);
  }

  const thumb =
    thumbnailUrl ||
    streamPlaceholderThumbnail({
      title,
      streamerName,
      category,
    });

  return (
    <div className="stream-card" onClick={handleClick}>
      <div className="stream-card-thumbnail-wrapper">
        <img
          src={thumb}
          alt={title || "Stream thumbnail"}
          className="stream-card-thumbnail"
        />
        {isLive && <span className="stream-card-live-badge">LIVE</span>}
      </div>

      <div className="stream-card-body">
        <h3 className="stream-card-title">{title}</h3>
        <p className="stream-card-streamer">{streamerName}</p>

        <div className="stream-card-meta">
          {category && <span className="stream-card-category">{category}</span>}
          {typeof views === "number" && (
            <span className="stream-card-views">{views.toLocaleString()} views</span>
          )}
        </div>
      </div>
    </div>
  );
}


