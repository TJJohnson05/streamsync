import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('Verifying your email...');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = params.get('token');
    const email = params.get('email');

    async function run() {
      try {
        const res = await fetch(
          `http://192.168.10.20:4000/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Verification failed');
          setMsg('');
          return;
        }

        setMsg(data.message || 'Email verified. Redirecting to login...');
        setTimeout(() => navigate('/login', { replace: true }), 1200);
      } catch (e) {
        setError('Network error — cannot reach backend');
        setMsg('');
      }
    }

    if (!token || !email) {
      setError('Missing verification info.');
      setMsg('');
    } else {
      run();
    }
  }, [params, navigate]);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 16 }}>
      <h2>Email Verification</h2>
      {msg && <p>{msg}</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  );
}

