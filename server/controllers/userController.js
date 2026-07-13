const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ===============================
// Login User
// ===============================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProfile = async (req, res) => {
    res.status(200).json({
        message: "Profile loaded successfully.",
        user: req.user
    });
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const {
            occupation,
            company,
            education,
            location,
            age,
            gender,
            interestedIn,
            relationshipGoal,
            bio,
            interests
        } = req.body;

        user.occupation = occupation ?? user.occupation;
        user.company = company ?? user.company;
        user.education = education ?? user.education;
        user.location = location ?? user.location;
        user.age = age ?? user.age;
        user.gender = gender ?? user.gender;
        user.interestedIn = interestedIn ?? user.interestedIn;
        user.relationshipGoal = relationshipGoal ?? user.relationshipGoal;
        user.bio = bio ?? user.bio;
        user.interests = interests ?? user.interests;

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// ===============================
// Export Controllers
// ===============================
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
};