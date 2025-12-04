// src/pages/Browse.js
import React from 'react';
import '../styles/Browse.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Browse() {
  // Mock data for streams (can later be replaced with API call)
  const streams = [
    {
      id: 1,
      title: 'Epic Apex Legends Gameplay',
      streamer: 'GamerPro',
      viewers: '2.1K',
      thumbnail: 'https://via.placeholder.com/400x225?text=Stream+1'
    },
    {
      id: 2,
      title: 'Cozy Minecraft Building Stream',
      streamer: 'BlockCrafter',
      viewers: '1.5K',
      thumbnail: 'https://via.placeholder.com/400x225?text=Stream+2'
    },
    {
      id: 3,
      title: 'Speedrunning Minecraft Any%',
      streamer: 'BlockMaster',
      viewers: '3.8K',
      thumbnail: 'https://via.placeholder.com/400x225?text=Stream+3'
    },
    {
      id: 4,
      title: 'LoL Ranked Grind',
      streamer: 'Summoner99',
      viewers: '5.2K',
      thumbnail: 'https://via.placeholder.com/400x225?text=Stream+4'
    },
    {
      id: 5,
      title: 'Music & Chill Beats',
      streamer: 'DJStreamz',
      viewers: '900',
      thumbnail: 'https://via.placeholder.com/400x225?text=Stream+5'
    }
  ];

  return (
    <div className="browse-page">
      {/* Navbar at top just like Home */}
      <Navbar />

      <div className="browse-container">
        <h2 className="browse-title">Browse Live Streams</h2>
        <div className="stream-grid">
          {streams.map((stream) => (
            <Link
              key={stream.id}
              to={`/watch/${stream.id}`}
              className="stream-card"
            >
              <div className="thumbnail-wrapper">
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="stream-thumbnail"
                />
                <div className="viewer-count">
                  {stream.viewers} watching
                </div>
              </div>
              <div className="stream-info">
                <h3>{stream.title}</h3>
                <p>@{stream.streamer}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


