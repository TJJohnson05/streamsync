import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../utils/history';
import '../styles/History.css';

export default function History() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getHistory());
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 16 }}>
      <h2>History</h2>
      <p>Recently viewed streams/videos. This clears when you sign out.</p>

      {items.length === 0 ? (
        <div style={{ marginTop: 20 }}>No history yet.</div>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
          {items.map((x) => (
            <div
              key={x.id + x.viewedAt}
              style={{
                border: '1px solid #ddd',
                borderRadius: 10,
                padding: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{x.title || x.streamTitle || 'Stream'}</div>
                <div style={{ fontSize: 14, opacity: 0.85 }}>
                  {x.streamerName ? `By ${x.streamerName}` : ''}
                  {x.category ? ` • ${x.category}` : ''}
                </div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  Viewed: {new Date(x.viewedAt).toLocaleString()}
                </div>
              </div>

              <button onClick={() => navigate(`/watch/${x.id}`)}>
                Watch again
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
