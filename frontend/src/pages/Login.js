import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { saveAuth } from '../utils/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
	const res = await fetch('http://192.168.10.20:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

    // STORE AUTH TOKEN + USER
saveAuth(data.token, data.user);

// Optional parent callback
onLogin && onLogin(data.user);

// ✅ REDIRECT based on onboarding quiz
if (data.user?.quizCompleted) {
  navigate('/home', { replace: true });
} else {
  navigate('/onboarding-quiz', { replace: true });
}

    } catch (err) {
      setError('Network error — cannot reach backend');
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/logo192.png" alt="StreamSync Logo" className="logo" />
        <h1 className="title">StreamSync</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Log In
          </button>

          {error && <div className="error">{error}</div>}
        </form>

        <p className="signup-text">
          Don’t have an account?{' '}
          <span className="signup-link" onClick={() => navigate('/signup')}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
