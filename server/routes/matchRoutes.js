const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    likeUser,
    getMatches
} = require("../controllers/matchController");

// Like another user
router.post("/like", protect, likeUser);

// View all my matches
router.get("/", protect, getMatches);

module.exports = router;