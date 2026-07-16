const Message = require("../models/Message");
const Match = require("../models/Match");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ===================================
// Send Message
// ===================================
const sendMessage = async (req, res) => {

    try {

        const sender = req.user._id;

        const { receiver, message } = req.body;

        const image = req.file
            ? `/uploads/chat/${req.file.filename}`
            : "";

        // ===============================
        // Require either text or image
        // ===============================
        if (
            (!message || message.trim() === "") &&
            !image
        ) {

            return res.status(400).json({
                message: "Message cannot be empty."
            });

        }

        // ===============================
        // Ensure users are matched
        // ===============================
        const match = await Match.findOne({

            users: {
                $all: [sender, receiver]
            }

        });

        if (!match) {

            return res.status(403).json({

                message: "You can only message your matches."

            });

        }

        // ===============================
        // Determine Message Type
        // ===============================
        let messageType = "text";

        if (message && image) {

            messageType = "text-image";

        }

        else if (image) {

            messageType = "image";

        }

        // ===============================
        // Save Message
        // ===============================
        const newMessage = await Message.create({

            sender,

            receiver,

            message: message || "",

            image,

            messageType

        });

        await newMessage.populate(
            "sender",
            "firstName lastName profilePhoto"
        );

        await newMessage.populate(
            "receiver",
            "firstName lastName profilePhoto"
        );

        // ===============================
        // Notification
        // ===============================
        const notification = await Notification.create({

            recipient: receiver,

            sender,

            type: "message",

            text:
                messageType === "image"
                    ? "sent you a photo 📷"
                    : "sent you a message 💬"

        });

        await notification.populate(
            "sender",
            "firstName lastName profilePhoto"
        );

        // ===============================
        // Socket.IO
        // ===============================
        const io = req.app.get("io");

        io.to(receiver.toString()).emit(
            "receiveMessage",
            newMessage
        );

        io.to(receiver.toString()).emit(
            "newNotification",
            notification
        );

        res.status(201).json({

            message: "Message sent successfully.",

            newMessage

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// Get One Conversation
// ===================================
const getConversation = async (req, res) => {

    try {

        const currentUser = req.user._id;

        const otherUserId = req.params.userId;

        const otherUser = await User.findById(otherUserId)
            .select("-password");

        if (!otherUser) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const messages = await Message.find({

            $or: [

                {

                    sender: currentUser,

                    receiver: otherUserId

                },

                {

                    sender: otherUserId,

                    receiver: currentUser

                }

            ]

        })
        .populate(
            "sender",
            "firstName lastName profilePhoto"
        )
        .populate(
            "receiver",
            "firstName lastName profilePhoto"
        )
        .sort({
            createdAt: 1
        });

        // ===================================
        // Read Receipts
        // ===================================

        const unreadMessages = await Message.find({

            sender: otherUserId,

            receiver: currentUser,

            read: false

        });

        if (unreadMessages.length > 0) {

            const unreadIds = unreadMessages.map(

                message => message._id

            );

            await Message.updateMany(

                {

                    _id: {

                        $in: unreadIds

                    }

                },

                {

                    read: true

                }

            );

            const io = req.app.get("io");

            io.to(otherUserId.toString()).emit(

                "messagesRead",

                {

                    reader: currentUser.toString(),

                    sender: otherUserId.toString(),

                    messageIds: unreadIds

                }

            );

        }

        res.status(200).json({

            user: otherUser,

            count: messages.length,

            messages

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// Get Conversation List
// ===================================
const getConversations = async (req, res) => {

    try {

        const currentUser = req.user._id;

        const matches = await Match.find({

            users: currentUser

        }).populate(

            "users",

            "-password"

        );

        const conversations = await Promise.all(

            matches.map(async (match) => {

                const otherUser = match.users.find(

                    user =>

                        user._id.toString() !==

                        currentUser.toString()

                );

                const lastMessage = await Message.findOne({

                    $or: [

                        {

                            sender: currentUser,

                            receiver: otherUser._id

                        },

                        {

                            sender: otherUser._id,

                            receiver: currentUser

                        }

                    ]

                })
                .sort({

                    createdAt: -1

                });

                return {

                    matchId: match._id,

                    user: otherUser,

                    lastMessage: lastMessage
                        ? lastMessage.message
                        : "Start chatting...",

                    lastMessageTime: lastMessage
                        ? lastMessage.createdAt
                        : null

                };

            })

        );

        conversations.sort((a, b) => {

            if (!a.lastMessageTime) return 1;

            if (!b.lastMessageTime) return -1;

            return (

                new Date(b.lastMessageTime) -

                new Date(a.lastMessageTime)

            );

        });

        res.status(200).json({

            conversations

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    sendMessage,

    getConversation,

    getConversations

};