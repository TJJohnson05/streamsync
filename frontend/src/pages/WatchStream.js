import React from 'react';
import '../styles/WatchStream.css';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

export default function WatchStream() {
  const { streamId } = useParams(); // for dynamic routing later

  // Temporary placeholder data (could be replaced with a fetch later)
  const stream = {
    id: streamId,
    title: 'Live Coding Session: Building StreamSync',
    streamer: 'TylerDev',
    viewers: 245,
    description:
      'Join me as I build a full-stack streaming platform using React, Node, and MongoDB!',
    thumbnail: 'https://placehold.co/800x450/8244ff/ffffff?text=Stream+Preview',
  };

  return (
    <div className="watch-page">
      <div className="watch-content">
        <div className="video-section">
          <div className="video-player">
            <img src={stream.thumbnail} alt="Stream preview" />
          </div>

          <div className="stream-details">
            <h2 className="stream-title">{stream.title}</h2>
            <p className="streamer-name">@{stream.streamer}</p>
            <p className="viewers">{stream.viewers} watching</p>
            <p className="description">{stream.description}</p>
          </div>
        </div>

        <div className="chat-section">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
