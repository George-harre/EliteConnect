const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
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

    status: {
        type: String,
        enum: [
            "Pending",
            "Matched",
            "Rejected"
        ],
        default: "Pending"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Match", matchSchema);