import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { saveAuth } from "../utils/auth";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResendMsg("");
    setShowResend(false);

    try {
      // IMPORTANT: Use proxy (same-origin) instead of hardcoding backend IP
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.message || "Login failed";
        setError(msg);

        // If backend says verify first, show resend button
        if (msg.toLowerCase().includes("verify your email")) {
          setShowResend(true);
        }
        return;
      }

      // STORE AUTH TOKEN + USER
      saveAuth(data.token, data.user);

      // Optional parent callback
      if (onLogin) onLogin(data.user);

      // ✅ REDIRECT based on onboarding quiz
      if (data.user?.quizCompleted) {
        navigate("/home", { replace: true });
      } else {
        navigate("/onboarding-quiz", { replace: true });
      }
    } catch (err) {
      setError("Network error — cannot reach backend");
    }
  }

  async function handleResend() {
    setError("");
    setResendMsg("");

    if (!email) {
      setError("Enter your email first, then click resend.");
      return;
    }

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Resend failed");
        return;
      }

      setResendMsg(data.message || "Verification email sent! Check your inbox.");
      setShowResend(false);
    } catch (err) {
      setError("Network error — cannot reach backend");
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

          {showResend && (
            <button
              type="button"
              className="login-btn"
              style={{ marginTop: "10px" }}
              onClick={handleResend}
            >
              Resend verification email
            </button>
          )}

          {resendMsg && (
            <div style={{ marginTop: "10px" }}>
              {resendMsg}
            </div>
          )}
        </form>

        <p className="signup-text">
          Don’t have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

