const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    sendMessage,
    getConversation,
    getConversations
} = require("../controllers/messageController");

// ===================================
// Get all conversations
// ===================================
router.get("/", protect, getConversations);

// ===================================
// Get conversation with one user
// ===================================
router.get("/:userId", protect, getConversation);

// ===================================
// Send message
// ===================================
router.post("/", protect, sendMessage);

module.exports = router;