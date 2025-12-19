const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// GET /api/users/search?q=something
router.get("/search", auth, async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ users: [] });

    const me = req.user?.id || req.userId;
    if (!me) return res.status(401).json({ message: "Unauthorized" });

    const users = await User.find(
      {
        _id: { $ne: me },
        $or: [
          { username: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
      },
      { username: 1, email: 1 }
    )
      .limit(10)
      .lean();

    res.json({ users });
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


