const Like = require("../models/Like");
const Match = require("../models/Match");

// ===============================
// Like a User
// ===============================
const likeUser = async (req, res) => {
    try {

        const sender = req.user._id;
        const { receiver } = req.body;

        // Cannot like yourself
        if (sender.toString() === receiver) {
            return res.status(400).json({
                message: "You cannot like yourself."
            });
        }

        // Prevent duplicate likes
        const existingLike = await Like.findOne({
            sender,
            receiver
        });

        if (existingLike) {
            return res.status(400).json({
                message: "You already liked this user."
            });
        }

        // Save the like
        const like = await Like.create({
            sender,
            receiver
        });

        // Check if the receiver has already liked the sender
        const mutualLike = await Like.findOne({
            sender: receiver,
            receiver: sender
        });

        if (mutualLike) {

            // Prevent duplicate matches
            const existingMatch = await Match.findOne({
                users: {
                    $all: [sender, receiver]
                }
            });

            if (!existingMatch) {

                const match = await Match.create({
                    users: [sender, receiver]
                });

                return res.status(201).json({
                    message: "🎉 It's a Match!",
                    match
                });

            }

            return res.status(200).json({
                message: "You are already matched."
            });

        }

        return res.status(201).json({
            message: "User liked successfully!",
            like
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
const getMyMatches = async (req, res) => {

    try {

        const userId = req.user._id;

        const matches = await Match.find({
            users: userId
        })
        .populate({
            path: "users",
            select: "-password"
        });

        const formattedMatches = matches.map(match => {

            const otherUser = match.users.find(
                user => user._id.toString() !== userId.toString()
            );

            return {
                matchId: match._id,
                user: otherUser,
                matchedAt: match.createdAt
            };

        });

        res.status(200).json({
            message: "Matches loaded successfully.",
            count: formattedMatches.length,
            matches: formattedMatches
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    likeUser,
    getMyMatches
};