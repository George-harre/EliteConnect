const User = require("../models/User");
const Like = require("../models/Like");
const Match = require("../models/Match");
const Message = require("../models/Message");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password."
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

    } catch (error) {

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

    } catch (error) {

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

        // ===============================
        // Add Like & Match Status
        // ===============================

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
            _id: { $ne: currentUser._id }
        }).select("-password");

        const matches = users.map(user => {

            let score = 0;

            if (
                currentUser.location &&
                currentUser.location === user.location
            ) {
                score += 25;
            }

            if (
                currentUser.relationshipGoal &&
                currentUser.relationshipGoal === user.relationshipGoal
            ) {
                score += 25;
            }

            if (
                currentUser.interests &&
                user.interests
            ) {

                const common = currentUser.interests.filter(
                    interest => user.interests.includes(interest)
                );

                score += common.length * 10;

            }

            return {
                user,
                compatibilityScore: score
            };

        });

        matches.sort(
            (a, b) => b.compatibilityScore - a.compatibilityScore
        );

        res.status(200).json({
            message: "Matches generated successfully",
            matches
        });

    } catch (error) {

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

        // Real Matches
        const matches = await Match.countDocuments({
            users: userId
        });

        // Unread Messages
        const messages = await Message.countDocuments({
            receiver: userId,
            read: false
        });

        // Profile Views (Coming Soon)
        const profileViews = 0;

        res.status(200).json({

            likesReceived,

            matches,

            messages,

            profileViews

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
    updateProfile,
    uploadProfilePhoto,
    getUsers,
    getMatches,
    getDashboardStats
};