// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');

const app = express();

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

// Start server once DB is connected
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
