import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setError("Invalid verification link.");
      setMessage("");
      return;
    }

    const verifyEmail = async () => {
      try {
        /**
         * IMPORTANT:
         * This request is made to the FRONTEND origin (port 3000),
         * NOT directly to the backend VM.
         *
         * The frontend must proxy /api → http://192.168.10.20:4000
         */
        const response = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Email verification failed.");
          setMessage("");
          return;
        }

        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 1500);

      } catch (err) {
        setError("Unable to connect to verification service.");
        setMessage("");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center" }}>
      <h2>Email Verification</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

