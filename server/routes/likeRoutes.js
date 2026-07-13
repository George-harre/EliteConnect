const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { likeUser } = require("../controllers/likeController");

// Like a user
router.post("/", protect, likeUser);

module.exports = router;