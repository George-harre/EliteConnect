const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ===============================
        // Text Message
        // ===============================
        message: {
            type: String,
            trim: true,
            default: ""
        },

        // ===============================
        // Image Attachment
        // ===============================
        image: {
            type: String,
            default: ""
        },

        // ===============================
        // Message Type
        // ===============================
        messageType: {
            type: String,
            enum: ["text", "image", "text-image"],
            default: "text"
        },

        // ===============================
        // Read Status
        // ===============================
        read: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Message", messageSchema);