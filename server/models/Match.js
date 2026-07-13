const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Match", matchSchema);