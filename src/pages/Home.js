import React from 'react';
import '../styles/Home.css';

export default function Home() {
  const featuredStreams = [
    {
      id: 1,
      title: 'Call of Duty: Live Ranked Grind',
      streamer: 'AceShooter',
      thumbnail: 'https://placehold.co/400x225?text=Stream+1',
      viewers: 3241,
    },
    {
      id: 2,
      title: 'Minecraft Mega Build Stream',
      streamer: 'BlockBoi',
      thumbnail: 'https://placehold.co/400x225?text=Stream+2',
      viewers: 2190,
    },
    {
      id: 3,
      title: 'League of Legends – Ranked to Challenger',
      streamer: 'MiraTV',
      thumbnail: 'https://placehold.co/400x225?text=Stream+3',
      viewers: 8710,
    },
    {
      id: 4,
      title: 'Fortnite Duos Practice',
      streamer: 'ZaynePlays',
      thumbnail: 'https://placehold.co/400x225?text=Stream+4',
      viewers: 598,
    },
  ];

  const categories = [
    { id: 1, name: 'Just Chatting', img: 'https://placehold.co/200x200?text=Chatting' },
    { id: 2, name: 'Valorant', img: 'https://placehold.co/200x200?text=Valorant' },
    { id: 3, name: 'Apex Legends', img: 'https://placehold.co/200x200?text=Apex' },
    { id: 4, name: 'Music', img: 'https://placehold.co/200x200?text=Music' },
  ];

  return (
    <div className="home-page">

      <div className="home-content">
        <section className="featured-section">
          <h2>Featured Streams</h2>
          <div className="stream-grid">
            {featuredStreams.map(stream => (
              <div key={stream.id} className="stream-card">
                <img src={stream.thumbnail} alt={stream.title} className="stream-thumbnail" />
                <div className="stream-info">
                  <h3>{stream.title}</h3>
                  <p>{stream.streamer}</p>
                  <span>{stream.viewers.toLocaleString()} viewers</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="categories-section">
          <h2>Popular Categories</h2>
          <div className="category-grid">
            {categories.map(cat => (
              <div key={cat.id} className="category-card">
                <img src={cat.img} alt={cat.name} className="category-img" />
                <p>{cat.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
