const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

// ===================================
// Upload Middlewares
// ===================================

const uploadImage = require("../middleware/chatUploadMiddleware");
const uploadVoice = require("../middleware/voiceUpload");
const uploadFile = require("../middleware/fileUpload");

// ===================================
// Controllers
// ===================================

const {

    sendMessage,

    sendVoiceMessage,

    sendFileMessage,

    reactToMessage,

    getConversation,

    getConversations,

    deleteMessage

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
// Send Text / Image Message
// ===================================

router.post(

    "/",

    protect,

    uploadImage.single("image"),

    sendMessage

);

// ===================================
// Send Voice Message
// ===================================

router.post(

    "/voice",

    protect,

    uploadVoice.single("voice"),

    sendVoiceMessage

);

// ===================================
// Send File
// ===================================

router.post(

    "/file",

    protect,

    uploadFile.single("file"),

    sendFileMessage

);

// ===================================
// React To Message
// ===================================

router.put(

    "/:id/react",

    protect,

    reactToMessage

);

// ===================================
// Delete Message
// ===================================

router.delete(

    "/:messageId",

    protect,

    deleteMessage

);

module.exports = router;