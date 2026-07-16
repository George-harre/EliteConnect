const User = require("../models/User");
const Like = require("../models/Like");
const Match = require("../models/Match");
const Message = require("../models/Message");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendVerificationEmail = require("../utils/sendVerificationEmail");

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists."
            });

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken =
            crypto.randomBytes(32).toString("hex");

        const verificationTokenExpires =
            new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Create user
        const user = await User.create({

            firstName,
            lastName,
            email,
            password: hashedPassword,

            verified: false,

            verificationToken,
            verificationTokenExpires

        });

        // Read the user back from MongoDB
        const savedUser = await User.findById(user._id);

        // ===============================
        // DEBUG INFORMATION
        // ===============================
        console.log("====================================");
        console.log("✅ NEW USER CREATED");
        console.log("Email:", savedUser.email);

        console.log("\nGenerated Token:");
        console.log(verificationToken);

        console.log("\nStored Token:");
        console.log(savedUser.verificationToken);

        console.log("\nTokens Match?");
        console.log(
            verificationToken === savedUser.verificationToken
        );

        console.log("\nVerified:");
        console.log(savedUser.verified);

        console.log("\nExpiry:");
        console.log(savedUser.verificationTokenExpires);

        console.log("====================================");

        // Send verification email
        await sendVerificationEmail(

            savedUser.email,

            savedUser.firstName,

            savedUser.verificationToken

        );

        res.status(201).json({

            message:
                "Account created successfully. Please check your email to verify your account.",

            user: {

                id: savedUser._id,

                firstName: savedUser.firstName,

                lastName: savedUser.lastName,

                email: savedUser.email,

                verified: savedUser.verified

            }

        });

    }

    catch (error) {

        console.error("====================================");
        console.error("❌ Registration Error");
        console.error(error);
        console.error("====================================");

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

        const {
            email,
            password
        } = req.body;

        console.log("====================================");
        console.log("LOGIN REQUEST");
        console.log("Email:", email);

        const user = await User.findOne({
            email
        });

        console.log("User from database:");
        console.log(user);

        if (!user) {

            return res.status(400).json({
                message: "Invalid email or password."
            });

        }

        console.log("Verified:", user.verified);

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid email or password."
            });

        }

        // =====================================
        // Prevent login before email verification
        // =====================================
        if (!user.verified) {

            console.log("❌ Login blocked because verified = false");

            return res.status(403).json({
                message:
                    "Please verify your email before logging in."
            });

        }

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

        console.log("✅ Login successful");
        console.log("====================================");

        res.status(200).json({

            message: "Login successful!",

            token,

            user: {

                id: user._id,

                firstName: user.firstName,

                lastName: user.lastName,

                email: user.email,

                verified: user.verified

            }

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message

        });

    }

};

// ===============================
// Verify Email
// ===============================
const verifyEmail = async (req, res) => {

    console.log("====================================");
    console.log("verifyEmail() was called");

    try {

        const { token } = req.params;

        console.log("Token:");
        console.log(token);

        const allUsers = await User.find(
            {},
            "email verified verificationToken verificationTokenExpires"
        );

        console.log("Users in database:");
        console.log(allUsers);

        const user = await User.findOne({
            verificationToken: token
        });

        console.log("User found:");
        console.log(user);

        if (!user) {

            return res.status(404).json({
                message: "This verification link is invalid."
            });

        }

        if (user.verified) {

            return res.status(200).json({
                alreadyVerified: true,
                message: "Already verified."
            });

        }

        if (
            !user.verificationTokenExpires ||
            user.verificationTokenExpires < new Date()
        ) {

            return res.status(400).json({
                message: "Verification link expired."
            });

        }

        user.verified = true;
        user.verificationToken = "";
        user.verificationTokenExpires = null;

        await user.save();

        console.log("✅ User verified successfully");
        console.log("====================================");

        return res.status(200).json({
            verified: true,
            message: "Email verified successfully."
        });

    }

    catch (error) {

        console.log("VERIFY ERROR:");
        console.log(error);

        return res.status(500).json({
            message: error.message
        });

    }

};
// ===============================
// Get Logged-in User Profile
// ===============================
const getProfile = async (req, res) => {

    res.status(200).json({

        message: "Profile loaded successfully.",

        user: req.user

    });

};

// ===============================
// Update Profile
// ===============================
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

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===============================
// Upload Profile Photo
// ===============================
const uploadProfilePhoto = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        if (!req.file) {

            return res.status(400).json({

                message: "Please upload an image."

            });

        }

        user.profilePhoto = `/uploads/profiles/${req.file.filename}`;

        await user.save();

        res.status(200).json({

            message: "Profile photo uploaded successfully!",

            profilePhoto: user.profilePhoto

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===============================
// Discover Users
// ===============================
const getUsers = async (req, res) => {

    try {

        const {

            location,

            gender,

            relationshipGoal,

            minAge,

            maxAge

        } = req.query;

        const currentUserId = req.user._id;

        const filters = {

            _id: {

                $ne: currentUserId

            }

        };

        if (location) {

            filters.location = {

                $regex: location,

                $options: "i"

            };

        }

        if (gender) {

            filters.gender = gender;

        }

        if (relationshipGoal) {

            filters.relationshipGoal = relationshipGoal;

        }

        if (minAge || maxAge) {

            filters.age = {};

            if (minAge) {

                filters.age.$gte = Number(minAge);

            }

            if (maxAge) {

                filters.age.$lte = Number(maxAge);

            }

        }

        const users = await User.find(filters)

            .select("-password");

        // =====================================
        // Add Like & Match Status
        // =====================================

        const formattedUsers = await Promise.all(

            users.map(async (user) => {

                const liked = await Like.findOne({

                    sender: currentUserId,

                    receiver: user._id

                });

                const matched = await Match.findOne({

                    users: {

                        $all: [

                            currentUserId,

                            user._id

                        ]

                    }

                });

                return {

                    ...user.toObject(),

                    isLiked: !!liked,

                    isMatched: !!matched

                };

            })

        );

        res.status(200).json({

            message: "Users loaded successfully.",

            count: formattedUsers.length,

            users: formattedUsers

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===============================
// Smart Match Discovery
// ===============================
const getMatches = async (req, res) => {

    try {

        const currentUser = await User.findById(req.user._id);

        const users = await User.find({

            _id: {

                $ne: currentUser._id

            }

        }).select("-password");

        const matches = users.map(user => {

            let score = 0;

            // Same Location
            if (

                currentUser.location &&

                currentUser.location === user.location

            ) {

                score += 25;

            }

            // Same Relationship Goal
            if (

                currentUser.relationshipGoal &&

                currentUser.relationshipGoal === user.relationshipGoal

            ) {

                score += 25;

            }

            // Common Interests
            if (

                currentUser.interests &&

                user.interests

            ) {

                const common = currentUser.interests.filter(

                    interest =>

                        user.interests.includes(interest)

                );

                score += common.length * 10;

            }

            return {

                user,

                compatibilityScore: score

            };

        });

        matches.sort(

            (a, b) =>

                b.compatibilityScore -

                a.compatibilityScore

        );

        res.status(200).json({

            message: "Matches generated successfully.",

            matches

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===============================
// Dashboard Statistics
// ===============================
const getDashboardStats = async (req, res) => {

    try {

        const userId = req.user._id;

        // Likes Received
        const likesReceived = await Like.countDocuments({

            receiver: userId

        });

        // Matches
        const matches = await Match.countDocuments({

            users: userId

        });

        // Unread Messages
        const messages = await Message.countDocuments({

            receiver: userId,

            read: false

        });

        // Profile Views (Future Feature)
        const profileViews = 0;

        res.status(200).json({

            likesReceived,

            matches,

            messages,

            profileViews

        });

    }

    catch (error) {

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

    verifyEmail,

    getProfile,

    updateProfile,

    uploadProfilePhoto,

    getUsers,

    getMatches,

    getDashboardStats

};