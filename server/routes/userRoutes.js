const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    uploadProfilePhoto,
    getUsers,
    getMatches
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Get Logged-in User Profile
router.get("/profile", protect, getProfile);

// Get Matches
router.get("/matches", protect, getMatches);

// Update User Profile
router.put("/profile", protect, updateProfile);

// Upload Profile Photo
router.put(
    "/profile/photo",
    protect,
    upload.single("profilePhoto"),
    uploadProfilePhoto
);

router.get("/discover", protect, getUsers);

module.exports = router;