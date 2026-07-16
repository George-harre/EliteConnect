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

    // Professional Information
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

    // Location
    location: {
        type: String,
        default: ""
    },

    // Dating Profile Information
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

    // Who the user wants to meet
    interestedIn: {
        type: String,
        enum: [
            "Male",
            "Female",
            "Everyone"
        ],
        default: "Everyone"
    },

    // Dating intention
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

    // About user
    bio: {
        type: String,
        default: ""
    },

    // User interests for compatibility matching
    interests: {
        type: [String],
        default: []
    },

    // Profile picture
    profilePhoto: {
        type: String,
        default: ""
    },

    // ===============================
    // Email Verification
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

    // Subscription system
    subscription: {
        type: String,
        enum: [
            "Free",
            "Premium"
        ],
        default: "Free"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);