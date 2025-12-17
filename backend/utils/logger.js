// backend/utils/logger.js
const fs = require('fs');
const path = require('path');

const LOG_DIR = process.env.LOG_DIR || '/var/log/streamsync';
const LOG_FILE = process.env.LOG_FILE || 'app.log';
const LOG_PATH = path.join(LOG_DIR, LOG_FILE);

function ensureDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch (e) {
    // fallback: do nothing (avoid crashing app)
  }
}

function logToVM4(message) {
  const line = `${new Date().toISOString()} ${message}\n`;
  try {
    ensureDir();
    fs.appendFileSync(LOG_PATH, line);
  } catch (e) {
    // Never crash app for logging
    console.log(line.trim());
  }
}

module.exports = { logToVM4 };
