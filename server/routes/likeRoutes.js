const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    likeUser,
    getMyMatches
} = require("../controllers/likeController");

// ===============================
// Like a User
// ===============================
router.post("/", protect, likeUser);

// ===============================
// Get My Matches
// ===============================
router.get("/matches", protect, getMyMatches);

module.exports = router;