// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const authed = isLoggedIn();

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
