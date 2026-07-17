const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getProfile
} = require("../controllers/profileController");

// ===================================
// Get User Profile
// ===================================

router.get(

    "/:userId",

    protect,

    getProfile

);

module.exports = router;