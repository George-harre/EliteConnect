const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/chatUploadMiddleware");
const {

    sendMessage,

    getConversation,

    getConversations

} = require("../controllers/messageController");

// ===================================
// Get all conversations
// ===================================
router.get(

    "/",

    protect,

    getConversations

);

// ===================================
// Get conversation with one user
// ===================================
router.get(

    "/:userId",

    protect,

    getConversation

);

// ===================================
// Send Message (Text / Image)
// ===================================
router.post(

    "/",

    protect,

    upload.single("image"),

    sendMessage

);

module.exports = router;