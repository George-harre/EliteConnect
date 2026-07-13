const Match = require("../models/Match");

// ===============================
// Like Another User
// ===============================
const likeUser = async (req, res) => {
    try {

        const sender = req.user._id;
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                message: "Receiver ID is required."
            });
        }

        if (sender.toString() === receiverId) {
            return res.status(400).json({
                message: "You cannot like yourself."
            });
        }

        const existingLike = await Match.findOne({
            sender,
            receiver: receiverId
        });

        if (existingLike) {
            return res.status(400).json({
                message: "You have already liked this user."
            });
        }

        const reverseLike = await Match.findOne({
            sender: receiverId,
            receiver: sender
        });

        if (reverseLike) {

            reverseLike.status = "Matched";
            await reverseLike.save();

            const newMatch = await Match.create({
                sender,
                receiver: receiverId,
                status: "Matched"
            });

            return res.status(200).json({
                message: "🎉 It's a Match!",
                match: newMatch
            });
        }

        const match = await Match.create({
            sender,
            receiver: receiverId,
            status: "Pending"
        });

        res.status(201).json({
            message: "Like sent successfully!",
            match
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ===============================
// Get My Matches
// ===============================
const getMatches = async (req, res) => {
    try {

        const userId = req.user._id;

        const matches = await Match.find({
            status: "Matched",
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
        .populate("sender", "-password")
        .populate("receiver", "-password");

        res.status(200).json({
            message: "Matches loaded successfully!",
            count: matches.length,
            matches
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    likeUser,
    getMatches
};