const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    // ===============================
    // Professional Information
    // ===============================

    occupation: {
        type: String,
        default: ""
    },

    company: {
        type: String,
        default: ""
    },

    education: {
        type: String,
        default: ""
    },

    // ===============================
    // Location
    // ===============================

    location: {
        type: String,
        default: ""
    },

    // ===============================
    // Dating Profile
    // ===============================

    age: {
        type: Number,
        default: null
    },

    gender: {
        type: String,
        enum: [
            "Male",
            "Female",
            "Other"
        ],
        default: "Other"
    },

    interestedIn: {
        type: String,
        enum: [
            "Male",
            "Female",
            "Everyone"
        ],
        default: "Everyone"
    },

    relationshipGoal: {
        type: String,
        enum: [
            "Long-term relationship",
            "Short-term dating",
            "Friendship",
            "Marriage",
            "Not sure"
        ],
        default: "Not sure"
    },

    bio: {
        type: String,
        default: ""
    },

    interests: {
        type: [String],
        default: []
    },

    // ===============================
    // Photos
    // ===============================

    profilePhoto: {
        type: String,
        default: ""
    },

    gallery: {
        type: [String],
        default: []
    },

    // ===============================
    // Account
    // ===============================

    verified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String,
        default: ""
    },

    verificationTokenExpires: {
        type: Date,
        default: null
    },

    subscription: {
        type: String,
        enum: [
            "Free",
            "Premium"
        ],
        default: "Free"
    },

    // ===============================
    // Activity
    // ===============================

    online: {
        type: Boolean,
        default: false
    },

    lastSeen: {
        type: Date,
        default: Date.now
    },

    // ===============================
    // Profile Completion
    // ===============================

    profileCompleted: {
        type: Number,
        default: 0
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);