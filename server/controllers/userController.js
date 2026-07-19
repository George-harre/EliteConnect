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

        const {
            firstName,
            lastName,
            email,
            password,
            isAdult
        } = req.body;

        // User must confirm they are 18+
        if (!isAdult) {

            return res.status(400).json({
                message: "You must confirm that you are at least 18 years old."
            });

        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists."
            });

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({

            firstName,
            lastName,
            email,
            password: hashedPassword,

            // Temporary during testing
            verified: true

        });

        console.log("====================================");
        console.log("✅ NEW USER CREATED");
        console.log("Email:", user.email);
        console.log("Verified:", user.verified);
        console.log("====================================");

        res.status(201).json({

            message: "🎉 Account created successfully!",

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

        // Email verification is temporarily disabled
        // User can log in immediately after registering

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
// (Temporarily Disabled During Testing)
// ===============================
const verifyEmail = async (req, res) => {

    return res.status(200).json({

        message: "Email verification is temporarily disabled during testing."

    });

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

        const likesReceived = await Like.countDocuments({

            receiver: userId

        });

        const matches = await Match.countDocuments({

            users: userId

        });

        const messages = await Message.countDocuments({

            receiver: userId,

            read: false

        });

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

    // verifyEmail removed for testing phase

    getProfile,

    updateProfile,

    uploadProfilePhoto,

    getUsers,

    getMatches,

    getDashboardStats

};
