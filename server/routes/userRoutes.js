const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Profile
router.get("/profile", protect, getProfile);

// Update Profile

router.put("/profile", protect, updateProfile);


module.exports = router;