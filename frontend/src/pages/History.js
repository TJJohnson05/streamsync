// src/pages/History.js
import React, { useEffect, useState } from 'react';
import { fetchHistory, clearHistory } from '../services/api';
import StreamCard from '../components/StreamCard';
import '../styles/History.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await fetchHistory(); // { history: [...] }
        if (!isMounted) return;
        setHistory(data.history || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Could not load history.');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleClear() {
    try {
      setClearing(true);
      await clearHistory();
      setHistory([]);
    } catch (err) {
      setError(err.message || 'Could not clear history.');
    } finally {
      setClearing(false);
    }
  }

  if (loading) {
    return (
      <div className="history-page">
        <h1>Your Watch History</h1>
        <p>Loading history...</p>
      </div>
    );
  }

  const hasHistory = history && history.length > 0;

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Your Watch History</h1>
        {hasHistory && (
          <button
            className="history-clear-button"
            onClick={handleClear}
            disabled={clearing}
          >
            {clearing ? 'Clearing...' : 'Clear History'}
          </button>
        )}
      </div>

      {error && <p className="history-error">{error}</p>}

      {!hasHistory ? (
        <p className="history-empty">
          You haven&apos;t watched any streams yet. Start browsing and watching!
        </p>
      ) : (
        <div className="history-grid">
          {history.map((item) => {
            const stream = item.stream;
            if (!stream) return null;

            return (
              <StreamCard
                key={item._id}
                stream={{
                  _id: stream._id,
                  title: stream.title,
                  streamerName: stream.streamerName,
                  category: stream.category,
                  thumbnailUrl: stream.thumbnailUrl,
                  isLive: stream.isLive,
                  views: stream.views
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
