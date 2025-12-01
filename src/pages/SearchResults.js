import React, { useState, useEffect } from 'react';
import '../styles/SearchResults.css';
import { useParams, Link } from 'react-router-dom';


export default function SearchResults() {
  const { query } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Mock data simulating backend search results
    const allStreams = [
      {
        id: 1,
        title: 'Learning React Hooks',
        streamer: 'CodeMaster',
        category: 'Programming',
        thumbnail: 'https://placehold.co/400x225/9333ea/ffffff?text=React+Hooks',
      },
      {
        id: 2,
        title: 'Just Chatting about Dev Life',
        streamer: 'TylerDev',
        category: 'Chatting',
        thumbnail: 'https://placehold.co/400x225/4f46e5/ffffff?text=Chat+Session',
      },
      {
        id: 3,
        title: 'Building a MERN App Live',
        streamer: 'StackWizard',
        category: 'Programming',
        thumbnail: 'https://placehold.co/400x225/8244ff/ffffff?text=MERN+Stream',
      },
      {
        id: 4,
        title: 'Apex Legends Ranked Push',
        streamer: 'GamerPro',
        category: 'Gaming',
        thumbnail: 'https://placehold.co/400x225/3a0ca3/ffffff?text=Apex+Legends',
      },
    ];

    // Filter mock results by query (case-insensitive)
    const filtered = allStreams.filter(
      (stream) =>
        stream.title.toLowerCase().includes(query.toLowerCase()) ||
        stream.streamer.toLowerCase().includes(query.toLowerCase()) ||
        stream.category.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-results-container">
        <h2>
          Search results for: <span className="query-text">"{query}"</span>
        </h2>

        {results.length === 0 ? (
          <p className="no-results">No streams found for your search.</p>
        ) : (
          <div className="results-grid">
            {results.map((stream) => (
              <Link key={stream.id} to={`/watch/${stream.id}`} className="result-card">
                <img src={stream.thumbnail} alt={stream.title} />
                <div className="result-info">
                  <h3>{stream.title}</h3>
                  <p>@{stream.streamer}</p>
                  <span className="category">{stream.category}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
