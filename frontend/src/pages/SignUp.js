import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://192.168.10.20:4000'}/api/auth/register`,
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

      // ✅ Registration started, email verification required
      setMessage(
        'Account created! Please check your email and verify your account before logging in.'
      );

      // Optional: redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2500);

    } catch (err) {
      setLoading(false);
      setError('Network error — cannot reach backend');
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
        {message && <div className="success">{message}</div>}

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
