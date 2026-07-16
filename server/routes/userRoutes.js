const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyEmail,
    getProfile,
    updateProfile,
    uploadProfilePhoto,
    getUsers,
    getMatches,
    getDashboardStats
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ===================================
// Public Routes
// ===================================

router.post("/register", registerUser);

router.post("/login", loginUser);

// Email Verification
router.get("/verify-email/:token", verifyEmail);

// ===================================
// Protected Routes
// ===================================

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.put(
    "/profile/photo",
    protect,
    upload.single("profilePhoto"),
    uploadProfilePhoto
);

router.get("/discover", protect, getUsers);

router.get("/matches", protect, getMatches);

router.get("/dashboard", protect, getDashboardStats);

module.exports = router;