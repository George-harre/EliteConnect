const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    likeUser,

    getLikesReceived,

    likeBack,

    ignoreLike,

    getMyMatches

} = require("../controllers/likeController");

// ===============================
// Like User
// ===============================
router.post(
    "/",
    protect,
    likeUser
);

// ===============================
// Get Likes Received
// ===============================
router.get(
    "/received",
    protect,
    getLikesReceived
);

// ===============================
// Like Back
// ===============================
router.post(
    "/like-back/:senderId",
    protect,
    likeBack
);

// ===============================
// Ignore Like
// ===============================
router.delete(
    "/ignore/:senderId",
    protect,
    ignoreLike
);

// ===============================
// Get My Matches
// ===============================
router.get(
    "/matches",
    protect,
    getMyMatches
);

module.exports = router;