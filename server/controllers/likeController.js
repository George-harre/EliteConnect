const Like = require("../models/Like");
const Match = require("../models/Match");
const Notification = require("../models/Notification");

// ===============================
// Like a User
// ===============================
const likeUser = async (req, res) => {

    try {

        const sender = req.user._id;
        const { receiver } = req.body;

        if (sender.toString() === receiver) {

            return res.status(400).json({
                message: "You cannot like yourself."
            });

        }

        const existingLike = await Like.findOne({

            sender,
            receiver

        });

        if (existingLike) {

            return res.status(400).json({
                message: "You already liked this user."
            });

        }

        const like = await Like.create({

            sender,
            receiver

        });

        // ===============================
        // Create Like Notification
        // ===============================

        const likeNotification = await Notification.create({

            recipient: receiver,

            sender,

            type: "like",

            text: "liked your profile ❤️"

        });

        await likeNotification.populate(
            "sender",
            "firstName lastName profilePhoto"
        );

        const io = req.app.get("io");

        io.to(receiver.toString()).emit(
            "newNotification",
            likeNotification
        );

        // ===============================
        // Mutual Like?
        // ===============================

        const mutualLike = await Like.findOne({

            sender: receiver,

            receiver: sender

        });

        if (mutualLike) {

            let match = await Match.findOne({

                users: {

                    $all: [sender, receiver]

                }

            });

            if (!match) {

                match = await Match.create({

                    users: [sender, receiver]

                });

            }

            // Remove pending like after match
            await Like.findOneAndDelete({

                sender,
                receiver

            });

            const senderNotification =
                await Notification.create({

                    recipient: sender,

                    sender: receiver,

                    type: "match",

                    text: "matched with you 💕"

                });

            await senderNotification.populate(
                "sender",
                "firstName lastName profilePhoto"
            );

            const receiverNotification =
                await Notification.create({

                    recipient: receiver,

                    sender,

                    type: "match",

                    text: "matched with you 💕"

                });

            await receiverNotification.populate(
                "sender",
                "firstName lastName profilePhoto"
            );

            io.to(sender.toString()).emit(
                "newNotification",
                senderNotification
            );

            io.to(receiver.toString()).emit(
                "newNotification",
                receiverNotification
            );

            return res.status(201).json({

                message: "🎉 It's a Match!",

                match

            });

        }

        res.status(201).json({

            message: "User liked successfully!",

            like

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===============================
// Get Likes Received
// ===============================
const getLikesReceived = async (req, res) => {

    try {

        const userId = req.user._id;

        const likes = await Like.find({

            receiver: userId

        }).populate(

            "sender",

            "-password"

        );

        const pendingLikes = [];

        for (const like of likes) {

            const match = await Match.findOne({

                users: {

                    $all: [
                        userId,
                        like.sender._id
                    ]

                }

            });

            if (!match) {

                pendingLikes.push(like);

            }

        }

        res.status(200).json({

            likes: pendingLikes

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===============================
// Like Back
// ===============================
const likeBack = async (req, res) => {

    try {

        const receiver = req.user._id;

        const sender = req.params.senderId;

        const existingLike = await Like.findOne({

            sender: receiver,

            receiver: sender

        });

        if (!existingLike) {

            await Like.create({

                sender: receiver,

                receiver: sender

            });

        }

        let match = await Match.findOne({

            users: {

                $all: [sender, receiver]

            }

        });

        if (!match) {

            match = await Match.create({

                users: [sender, receiver]

            });

        }

        // Remove pending like after matching
        await Like.findOneAndDelete({

            sender,

            receiver

        });

        const io = req.app.get("io");

        const senderNotification =
            await Notification.create({

                recipient: sender,

                sender: receiver,

                type: "match",

                text: "matched with you 💕"

            });

        await senderNotification.populate(
            "sender",
            "firstName lastName profilePhoto"
        );

        const receiverNotification =
            await Notification.create({

                recipient: receiver,

                sender,

                type: "match",

                text: "matched with you 💕"

            });

        await receiverNotification.populate(
            "sender",
            "firstName lastName profilePhoto"
        );

        io.to(sender.toString()).emit(
            "newNotification",
            senderNotification
        );

        io.to(receiver.toString()).emit(
            "newNotification",
            receiverNotification
        );

        res.status(200).json({

            message: "🎉 It's a Match!",

            match

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===============================
// Ignore Like
// ===============================
const ignoreLike = async (req, res) => {

    try {

        const userId = req.user._id;

        const senderId = req.params.senderId;

        await Like.findOneAndDelete({

            sender: senderId,

            receiver: userId

        });

        res.status(200).json({

            message: "Like ignored."

        });

    }

    catch (error) {

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

        }).populate(

            "users",

            "-password"

        );

        const formattedMatches = matches
    .map(match => {

        const otherUser = match.users.find(
            user => user._id.toString() !== userId.toString()
        );

        if (!otherUser) return null;

        return {
            matchId: match._id,
            user: otherUser
        };

    })
    .filter(Boolean);

        res.status(200).json({

            matches: formattedMatches

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    likeUser,

    getLikesReceived,

    likeBack,

    ignoreLike,

    getMyMatches

};