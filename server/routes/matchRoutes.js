const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    likeUser
} = require("../controllers/matchController");

router.post("/like", protect, likeUser);

module.exports = router;