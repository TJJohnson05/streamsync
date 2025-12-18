// frontend/src/pages/OnboardingQuiz.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuth } from '../utils/auth';

export default function OnboardingQuiz() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const CATEGORY_OPTIONS = [
    'Gaming',
    'FPS',
    'RPG',
    'Sports',
    'Music',
    'Just Chatting',
    'Coding/Tech',
    'Art',
  ];

  const [categories, setCategories] = useState([]);
  const [vibes] = useState([]);       // placeholders
  const [languages] = useState([]);   // placeholders

  function toggle(list, value) {
    return list.includes(value)
      ? list.filter((x) => x !== value)
      : [...list, value];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (categories.length === 0) {
      setError('Please pick at least one category.');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please log in again.');
        navigate('/login', { replace: true });
        return;
      }

      // ✅ USE FRONTEND PROXY — NOT BACKEND IP
      const res = await fetch('/api/onboarding/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categories, vibes, languages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to save quiz.');
        setSubmitting(false);
        return;
      }

      // Update stored user so quizCompleted is true
      saveAuth(token, data.user);

      navigate('/home', { replace: true });
    } catch (err) {
      setError('Network error — cannot reach backend');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
      <h1 style={{ marginBottom: 10 }}>Quick Setup Quiz</h1>
      <p style={{ marginTop: 0, marginBottom: 20 }}>
        Pick a few categories you like — we’ll recommend streams based on this.
      </p>

      {error && (
        <div style={{ marginBottom: 16, padding: 10, border: '1px solid #ffb3b3' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: 10 }}>Categories</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 10,
          }}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={categories.includes(opt)}
                onChange={() => setCategories(toggle(categories, opt))}
              />
              {opt}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{ marginTop: 20, padding: '10px 14px', cursor: 'pointer' }}
        >
          {submitting ? 'Saving...' : 'Finish & Continue'}
        </button>
      </form>
    </div>
  );
}

