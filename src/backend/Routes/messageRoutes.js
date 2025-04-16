const express = require("express");
const Message = require("../Models/messageModel.js");

const router = express.Router();

// Save a new message
router.post("/", async (req, res) => {
  try {
    const { sender, text } = req.body;

    if (!sender || !text) {
      return res.status(400).json({ error: "Sender and text are required" });
    }

    const message = new Message({ sender, text });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
