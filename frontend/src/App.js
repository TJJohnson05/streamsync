import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import WatchStream from './pages/WatchStream';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';

// Wrapper component so we can use useLocation() with Router
function AppContent() {
  const location = useLocation();

  // Hide navbar on login and signup pages
  const hideNavbar = ['/login', '/signup'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/watch/:streamId" element={<WatchStream />} />
        <Route path="*" element={<NotFound />} />	
	<Route path="/browse" element={<Browse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search/:query" element={<SearchResults />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


