// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

