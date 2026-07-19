const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {

    registerUser,

    loginUser,

    getProfile,

    updateProfile,

    uploadProfilePhoto,

    getUsers,

    getMatches,

    getDashboardStats

} = require("../controllers/userController");

// ===============================
// Authentication
// ===============================
router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);

// ===============================
// Profile
// ===============================
router.get(
    "/profile",
    protect,
    getProfile
);

router.put(
    "/profile",
    protect,
    updateProfile
);

// ===============================
// Upload Profile Photo
// ===============================
router.put(
    "/profile/photo",
    protect,
    upload.single("profilePhoto"),
    uploadProfilePhoto
);

// ===============================
// Discover Users
// ===============================
router.get(
    "/discover",
    protect,
    getUsers
);

// ===============================
// Smart Match Suggestions
// ===============================
router.get(
    "/matches",
    protect,
    getMatches
);

// ===============================
// Dashboard Statistics
// ===============================
router.get(
    "/dashboard/stats",
    protect,
    getDashboardStats
);

module.exports = router;