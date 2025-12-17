// routes/onboarding.js
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const { logToVM4 } = require('../utils/logger');

const router = express.Router();

// POST /api/onboarding/quiz
router.post("/quiz", auth, async (req, res) => {
  try {
    const { categories = [], vibes = [], languages = [] } = req.body;

    // basic validation (simple + safe)
    if (!Array.isArray(categories) || !Array.isArray(vibes) || !Array.isArray(languages)) {
      return res.status(400).json({ message: "Quiz fields must be arrays" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        quizCompleted: true,
        interests: { categories, vibes, languages },
      },
      { new: true }
    ).select("-password");

    logToVM4(`Quiz completed: userId=${req.userId}, categories=${categories.join(",")}`);

    res.json({ user });
  } catch (err) {
    console.error(err);
    logToVM4(`Onboarding quiz error: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
