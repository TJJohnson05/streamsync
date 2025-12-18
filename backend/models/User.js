// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    
    emailVerified: { type: Boolean, default: false },

emailVerifyTokenHash: { type: String, default: null },
emailVerifyTokenExpires: { type: Date, default: null },
	
    // ✅ NEW (for onboarding + personalization)
    quizCompleted: { type: Boolean, default: false },
    interests: {
      categories: { type: [String], default: [] },
      vibes: { type: [String], default: [] },
      languages: { type: [String], default: [] },
    },

    // For favorites on Profile page
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream'
      }
    ]
  },
  { timestamps: true } // adds createdAt / updatedAt
);

module.exports = mongoose.model('User', userSchema);
