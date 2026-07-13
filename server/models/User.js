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

    location: {
        type: String,
        default: ""
    },

    age: {
        type: Number,
        default: null
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other"
    },

    interestedIn: {
        type: String,
        enum: ["Male", "Female", "Everyone"],
        default: "Everyone"
    },

    relationshipGoal: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    interests: {
        type: [String],
        default: []
    },

    profilePhoto: {
        type: String,
        default: ""
    },

    verified: {
        type: Boolean,
        default: false
    },

    subscription: {
        type: String,
        enum: ["Free", "Premium"],
        default: "Free"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
