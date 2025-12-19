const express = require("express");
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

// 🔐 must already exist in your project
const auth = require("../middleware/authMiddleware"); // or whatever your auth middleware is

// Get my conversations
router.get("/conversations", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({ members: userId })
      .sort({ lastMessageAt: -1 })
      .lean();

    // Optional: include member names
    const populated = await Promise.all(
      conversations.map(async (c) => {
        const members = await User.find({ _id: { $in: c.members } }, { username: 1, email: 1 }).lean();
        return { ...c, membersInfo: members };
      })
    );

    res.json({ conversations: populated });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create or get a 1:1 conversation
router.post("/conversations", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId) return res.status(400).json({ message: "Missing otherUserId" });
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) return res.status(400).json({ message: "Invalid user id" });
    if (otherUserId === userId) return res.status(400).json({ message: "Cannot DM yourself" });

    // Find existing 1:1 conversation containing both users
    let convo = await Conversation.findOne({
      isGroup: false,
      members: { $all: [userId, otherUserId] },
      $expr: { $eq: [{ $size: "$members" }, 2] },
    });

    if (!convo) {
      convo = await Conversation.create({ members: [userId, otherUserId], isGroup: false });
    }

    res.json({ conversation: convo });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get messages in a conversation
router.get("/messages/:conversationId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ message: "Conversation not found" });

    // Only members can access
    if (!convo.members.map(String).includes(String(userId))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "username email")
      .lean();

    res.json({ messages });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send a message
router.post("/messages", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId, text } = req.body;

    if (!conversationId || !text) return res.status(400).json({ message: "Missing fields" });

    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ message: "Conversation not found" });

    if (!convo.members.map(String).includes(String(userId))) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const msg = await Message.create({
      conversationId,
      sender: userId,
      text,
      readBy: [userId],
    });

    convo.lastMessageAt = new Date();
    await convo.save();

    const populated = await Message.findById(msg._id).populate("sender", "username email").lean();
    res.json({ message: populated });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

