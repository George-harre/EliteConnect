const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    uploadProfilePhoto,
    getUsers,
    getDashboardStats
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    validateRegister,
    handleValidationErrors
} = require("../validators/userValidator");

// ===============================
// Public Routes
// ===============================

// Register User
router.post(
    "/register",
    validateRegister,
    handleValidationErrors,
    registerUser
);

// Login User
router.post("/login", loginUser);

// ===============================
// Protected Routes
// ===============================

// Get Logged-in User Profile
router.get("/profile", protect, getProfile);

// Dashboard Statistics
router.get(
    "/dashboard-stats",
    protect,
    getDashboardStats
);

// Update User Profile
router.put(
    "/profile",
    protect,
    updateProfile
);

// Upload Profile Photo
router.put(
    "/profile/photo",
    protect,
    upload.single("profilePhoto"),
    uploadProfilePhoto
);

// Discover Other Users
router.get(
    "/discover",
    protect,
    getUsers
);

module.exports = router;