const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
{
    // ===================================
    // Sender
    // ===================================
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // ===================================
    // Receiver
    // ===================================
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // ===================================
    // Text Message
    // ===================================
    message: {
        type: String,
        trim: true,
        default: ""
    },

    // ===================================
    // Image
    // ===================================
    image: {
        type: String,
        default: ""
    },

    // ===================================
    // Voice Note
    // ===================================
    voice: {
        type: String,
        default: ""
    },

    // ===================================
    // File Attachment
    // ===================================
    file: {
        type: String,
        default: ""
    },

    // Original file name
    fileName: {
        type: String,
        default: ""
    },

    // ===================================
    // Message Type
    // ===================================
    messageType: {
        type: String,
        enum: [
            "text",
            "image",
            "text-image",
            "voice",
            "file"
        ],
        default: "text"
    },

    // ===================================
// Reactions
// ===================================
reactions: [
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    emoji: {
        type: String
    }
}
],

   // ===================================
// Read Status
// ===================================
read: {
    type: Boolean,
    default: false
},

// ===================================
// Reactions
// ===================================
reactions: [

    {

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User"

        },

        emoji: {

            type: String

        }

    }

]

},
{
    timestamps: true
});

module.exports = mongoose.model("Message", messageSchema);