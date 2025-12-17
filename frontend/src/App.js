// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import History from "./pages/History";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import WatchStream from './pages/WatchStream';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingQuiz from './pages/OnboardingQuiz';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes (must be logged in) */}
        <Route
          path="/watch/:streamId"
          element={
            <ProtectedRoute>
              <WatchStream />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
  path="/onboarding-quiz"
  element={
    <ProtectedRoute>
      <OnboardingQuiz />
    </ProtectedRoute>
  }
/>


 

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;





