// server.js
const dmRoutes = require("./routes/dm");
const streamRoutes = require('./routes/streams');
const historyRoutes = require('./routes/history');
const favoritesRoutes = require('./routes/favorites');
const onboardingRoutes = require('./routes/onboarding');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const { exec } = require('child_process');   // ✅ ADD
const app = express();
const userRoutes = require("./routes/users");



// ===== Logging helper (NEW) =====
const LOG_SCRIPT = '/home/backend/log_to_vm4.sh'; // adjust if path differs

function logToVM4(message) {
  const safeMessage = message.replace(/"/g, '\\"');
  exec(`${LOG_SCRIPT} "${safeMessage}"`, (error) => {
    if (error) {
      console.error('Failed to send log to VM4:', error.message);
    }
  });
}
// ================================

// Port and CORS config
const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use("/api/dm", dmRoutes);
app.use("/api/users", userRoutes);

// Start server once DB is connected
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
      logToVM4(`Backend started on port ${PORT}`); // ✅ ADD
    });
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    logToVM4(`Mongo connection error: ${err.message}`); // ✅ ADD
    process.exit(1);
  });

// ===== Global error logging (NEW) =====
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  logToVM4(`Uncaught Exception: ${err.message}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  logToVM4(`Unhandled Rejection: ${reason}`);
});
// =====================================

// Export logging helper for routes
module.exports = { app, logToVM4 };


