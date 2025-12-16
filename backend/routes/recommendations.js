// routes/recommendations.js
const express = require("express");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Streamer = require("../models/Streamer"); // <-- create if needed
const { logToVM4 } = require("../server");

const router = express.Router();

function scoreStreamer(streamer, interests) {
  let score = 0;

  const sCats = new Set(streamer.categories || []);
  const sVibes = new Set(streamer.vibes || []);
  const sLang = streamer.language;

  for (const c of interests.categories || []) if (sCats.has(c)) score += 3;
  for (const v of interests.vibes || []) if (sVibes.has(v)) score += 2;
  for (const l of interests.languages || []) if (sLang === l) score += 1;

  if (streamer.isLive) score += 2;
  if (typeof streamer.viewerCount === "number") score += Math.log10(streamer.viewerCount + 1);

  return score;
}

// GET /api/recommendations/streamers
router.get("/streamers", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("quizCompleted interests");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Cold start: if quiz not done, return trending/live
    if (!user.quizCompleted) {
      const fallback = await Streamer.find({})
        .sort({ isLive: -1, viewerCount: -1 })
        .limit(24);
      return res.json({ streamers: fallback, reason: "quiz_not_completed" });
    }

    const streamers = await Streamer.find({}).limit(200); // pull a pool
    const ranked = streamers
      .map(s => ({ s, score: scoreStreamer(s, user.interests) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 24)
      .map(x => x.s);

    logToVM4(`Recommendations served: userId=${req.userId}, count=${ranked.length}`);

    res.json({ streamers: ranked, reason: "personalized" });
  } catch (err) {
    console.error(err);
    logToVM4(`Recommendations error: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

