// models/Stream.js
const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    streamerName: { type: String, required: true },
    category: { type: String },
    thumbnailUrl: { type: String },
    isLive: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stream', streamSchema);
