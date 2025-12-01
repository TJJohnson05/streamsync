import React, { useState } from 'react';
import '../styles/SignUp.css';

export default function SignUp({ onSignedUp }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://192.168.1.46:4000'}/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password }),
        }
      );
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }
      localStorage.setItem('token', data.token);
      onSignedUp && onSignedUp(data);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Network error');
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSubmit}>
          <h1>StreamSync</h1>
        <h2>Create an account</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        <p className="switch-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
}


